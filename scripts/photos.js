/*
Photo uploader script

Usage:
  node scripts/photos.js [--concurrency N] [--cache PATH] [--dry-run] [--verbose] [--quiet]
  npm run photo-upload -- [--concurrency N] [--cache PATH] [--dry-run] [--verbose] [--quiet]

Options:
  --concurrency N   Number of parallel uploads (default 4)
  --cache PATH      Path to cache file (default scripts/photos.json)
  --dry-run, -n     Show actions without uploading or writing cache
  --verbose, -v     Show detailed logs
  --quiet, -q       Suppress logs, prints one-line completion summary

Environment:
  Set Cloudinary credentials via environment variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

Tuning performance:
  - Increase `--concurrency` to upload more files in parallel; monitor CPU/network and API rate limits.
  - Keep the cache file on fast local storage (use `--cache`) so mtime checks avoid network calls.
  - Use `--dry-run` to preview actions before consuming API credits.
  - For large libraries, tag uploads or use a dedicated Cloudinary folder so bulk listing is faster.
  - Pre-generate resized/optimized images locally when possible to reduce server-side processing.
  - Run uploads during off-peak hours and adjust the bulk-fetch threshold in code if needed.
*/

import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const IMG_DIR = './public/images';
const DEFAULT_CONCURRENCY = 4;
const DEFAULT_CACHE_NAME = 'photos.json';

export default async function getPhotos() {
  let photos = [];
  const web_options = {
    transformation: [
      { width: 500, crop: 'scale' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  };

  const getWeb = (publicId) => cloudinary.url(publicId, web_options);

  const cloudinary_options = {
    use_filename: true,
    unique_filename: false,
    overwrite: false
  };

  try {
    // Parse CLI options early so flags like --quiet apply to startup errors
    const rawArgs = process.argv.slice(2);
    let concurrency = DEFAULT_CONCURRENCY;
    let cacheArg = DEFAULT_CACHE_NAME;
    let dryRun = false;
    let verbose = false;
    let quiet = false;
    let errorCount = 0;
    for (let i = 0; i < rawArgs.length; i++) {
      const a = rawArgs[i];
      if (a === '--concurrency' && rawArgs[i + 1]) { concurrency = Math.max(1, parseInt(rawArgs[i + 1], 10) || DEFAULT_CONCURRENCY); i++; }
      else if (a.startsWith('--concurrency=')) { concurrency = Math.max(1, parseInt(a.split('=')[1], 10) || DEFAULT_CONCURRENCY); }
      else if (a === '--cache' && rawArgs[i + 1]) { cacheArg = rawArgs[i + 1]; i++; }
      else if (a.startsWith('--cache=')) { cacheArg = a.split('=')[1]; }
      else if (a === '--dry-run' || a === '-n') { dryRun = true; }
      else if (a === '--verbose' || a === '-v') { verbose = true; }
      else if (a === '--quiet' || a === '-q') { quiet = true; }
      else if (a === '--help' || a === '-h') {
        console.log('Usage: node scripts/photos.js [--concurrency N] [--cache path] [--dry-run] [--verbose] [--quiet]');
        return [];
      }
    }

    // logging helpers
    const log = (...args) => { if (!quiet) console.log(...args); };
    const vlog = (...args) => { if (!quiet && verbose) console.log(...args); };
    const errLog = (...args) => { errorCount++; if (!quiet) console.error(...args); };

    if (!fs.existsSync(IMG_DIR)) {
      errLog(`Directory not found: ${IMG_DIR}`);
      return [];
    }

    // Read image files
    let files = fs.readdirSync(IMG_DIR);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.jxl'];
    const imageFiles = files.filter(f => validExtensions.includes(path.extname(f).toLowerCase()));
    log(`Processing images, ${imageFiles.length} total`);
    vlog(`Options: concurrency=${concurrency}, cache=${cacheArg}, dryRun=${dryRun}, verbose=${verbose}, quiet=${quiet}`);

    // Resolve cache path relative to script directory unless absolute
    const cachePath = path.isAbsolute(cacheArg) ? cacheArg : path.join(__dirname, cacheArg);
    let localCache = {};
    if (fs.existsSync(cachePath)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        if (Array.isArray(cached)) {
          cached.forEach(e => {
            if (e && e.id) localCache[e.id] = e;
          });
        }
      } catch (e) {
        // ignore cache parse errors
      }
    }

    // Determine which files need Cloudinary checks/uploads
    const toProcess = [];
    for (const imageFile of imageFiles) {
      const file = path.join(IMG_DIR, imageFile);
      const publicId = path.parse(imageFile).name;
      let mtime = 0;
      try { mtime = fs.statSync(file).mtimeMs; } catch (e) { mtime = 0; }

      const cached = localCache[publicId];
      if (cached && typeof cached.mtime === 'number' && cached.mtime === mtime) {
        photos.push({ id: cached.id, web: cached.web, mtime: cached.mtime });
        continue;
      }

      toProcess.push({ imageFile, publicId, file, mtime });
    }

    // Helper to run async tasks with limited concurrency
    async function runWithConcurrency(items, limit, worker) {
      const results = [];
      let i = 0;
      const runners = Array(Math.min(limit, items.length)).fill(null).map(async () => {
        while (i < items.length) {
          const idx = i++;
          try {
            results[idx] = await worker(items[idx], idx);
          } catch (e) {
            results[idx] = null;
          }
        }
      });
      await Promise.all(runners);
      return results;
    }

    if (toProcess.length === 0) {
      log('All images matched local cache, no uploads needed');
    } else {
      // If many files changed, fetch Cloudinary resources in bulk to avoid many resource calls
      let useBulkFetch = toProcess.length > 20;
      let existingIds = null;
      if (useBulkFetch) {
        existingIds = new Set();
        let res = await cloudinary.api.resources({ type: 'upload', max_results: 500 }).catch(() => null);
        if (res) {
          res.resources.forEach(r => existingIds.add(r.public_id));
          while (res.next_cursor) {
            res = await cloudinary.api.resources({ type: 'upload', max_results: 500, next_cursor: res.next_cursor }).catch(() => null);
            if (!res) break;
            res.resources.forEach(r => existingIds.add(r.public_id));
          }
        }
      }

      const results = await runWithConcurrency(toProcess, concurrency, async (item) => {
        const { imageFile, publicId, file, mtime } = item;

        // If using bulk fetch, consult existingIds, otherwise call resource per-item
        let exists = false;
        if (useBulkFetch) {
          exists = existingIds && existingIds.has(publicId);
        } else {
          const resource = await cloudinary.api.resource(publicId).catch(() => null);
          exists = !!resource;
        }

        if (exists) {
          log(`File ${imageFile} already exists in Cloudinary as ${publicId}`);
          const entry = { id: publicId, web: getWeb(publicId), mtime };
          // update local cache
          localCache[publicId] = entry;
          return entry;
        }
        if (dryRun) {
          log(`[dry-run] Would upload ${imageFile} as ${publicId}`);
          return { id: publicId, web: getWeb(publicId), mtime };
        }

        try {
          const uploadResult = await cloudinary.uploader.upload(file, cloudinary_options);
          log(`Uploaded ${uploadResult.public_id}`);
          const entry = { id: uploadResult.public_id, web: getWeb(uploadResult.public_id), mtime };
          localCache[uploadResult.public_id] = entry;
          return entry;
        } catch (uploadError) {
          errLog(`Error uploading file ${file}: ${uploadError.message}`);
          return null;
        }
      });

      results.forEach(r => { if (r) photos.push(r); });
    }

    // Write updated cache (include mtime for future fast checks), unless dry-run
    if (!dryRun) {
      const cacheArray = photos.map(p => ({ id: p.id, web: p.web, mtime: p.mtime || 0 }));
      fs.writeFileSync(cachePath, JSON.stringify(cacheArray, null, 2));
      log(`Wrote ${cacheArray.length} entries to ${cachePath}`);
    } else {
      log('Dry-run: not writing cache');
    }

    // Final summary: always print one-line summary so quiet mode still notifies completion
    console.log(`Photo upload complete: ${photos.length} entries processed${dryRun ? ' (dry-run)' : ''}${errorCount ? `, ${errorCount} errors` : ''}`);

    return photos;
  } catch (err) {
    errLog('Error processing images:', err);
    throw err;
  }
}

// If executed directly, run the uploader
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  getPhotos().catch(err => {
    console.error('Fatal error running photos uploader:', err);
    process.exit(1);
  });
}
