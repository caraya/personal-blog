---
title: "Subresource Integrity (SRI)"
date: 2026-03-06
tags:
  - Security
  - Web Development
  - Performance
  - Javascript
---

When you build modern web applications, you often rely on third-party services like Content Delivery Networks (CDNs) to host essential files. While CDNs improve performance, they also introduce a vector for supply chain attacks. Subresource Integrity (SRI) provides a standardized defense against these risks.

This post will explain what SRI is, how it works, and why it's crucial for securing your web applications. We'll also discuss the performance implications of using SRI and how to implement it effectively, even for resources hosted on your own server. Finally, we'll provide a TypeScript script to generate SRI hashes for your assets.

## What is Subresource Integrity (SRI)?

Subresource Integrity (SRI) is a security feature that enables browsers to verify that resources they fetch—such as JavaScript or CSS files—are delivered without unexpected manipulation. It ensures the file the browser executes is exactly the file you intended to load.

You implement SRI using the integrity attribute on &lt;script&gt; or &lt;link&gt; tags. This attribute contains a cryptographic hash of the resource.

```html
<script src="https://example.com/app.js"
        integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
        crossorigin="anonymous"></script>
```

## **How SRI Works**

When a browser encounters a &lt;script&gt; or &lt;link&gt; tag with an integrity attribute, it follows a specific validation process:

1. **Fetch**: The browser downloads the file from the specified src or href.
2. **Compute**: Before executing or applying the file, the browser calculates the cryptographic hash of the downloaded content using the algorithm specified in the integrity attribute (usually SHA-256, SHA-384, or SHA-512).
3. **Compare**: The browser compares the computed hash against the hash provided in the integrity attribute.
4. **Execute or Block**:
   * If the hashes match, the browser executes the script or applies the stylesheet.
   * If the hashes do not match, the browser refuses to execute the code and logs a network error to the console.

### **The Role of CORS**

To use SRI for resources hosted on a different origin (like a third-party CDN), you must include the crossorigin="anonymous" attribute. This instructs the browser to make a Cross-Origin Resource Sharing (CORS) request without sending user credentials (like cookies). If the CDN does not serve the file with the appropriate Access-Control-Allow-Origin headers, the browser blocks the resource entirely, even if the hash matches.

## **Why SRI is Necessary**

Websites frequently load external dependencies, such as React, jQuery, or analytics scripts. This creates a supply chain vulnerability. If an attacker compromises the external server or intercepts the connection, they could inject malicious code (like a keylogger or cryptocurrency miner) into the widely distributed file.

SRI protects your application by neutralizing this threat. Even if an attacker successfully modifies a file on the CDN, they cannot update the hardcoded HTML hash on your server. Because the modified file's hash will not match your expected hash, the browser simply drops the malicious payload.

## **The Performance Impact of SRI**

You might wonder if calculating a cryptographic hash for every script delays execution and degrades the user experience. While the browser must indeed pause execution to compute the hash, the performance impact is generally negligible.

Modern browsers use highly optimized native implementations &mdash; which are often hardware-accelerated &mdash; to perform cryptographic hashing. Calculating a SHA-384 hash for a typical JavaScript payload takes only a few milliseconds. This computation time is microscopic compared to the network latency required to download the file and the CPU time required for the JavaScript engine to parse, compile, and execute the code.

Therefore, even on low-end devices or with multiple SRI-protected scripts, the security benefits of SRI far outweigh the imperceptible cost of hash computation.

## SRI for Same-Origin (Local) Resources

While developers primarily use SRI to secure third-party CDN resources, you can also apply it to files hosted on your own server (same-origin).

### Defense-in-Depth for Local Files

Applying SRI to your own hosted files provides an excellent layer of defense-in-depth. If an attacker breaches your server and modifies a static JavaScript file (for example, via a compromised FTP account or an arbitrary file write vulnerability) but fails to alter the database or the HTML templates that generate the page, SRI prevents the malicious script from executing.

### Self-Hosting vs. Using a CDN in the Modern Web

Historically, developers relied on public CDNs under the assumption that they provided superior performance through shared caching. However, modern web standards have fundamentally changed this equation.

#### SRI and the HTTP Cache

The HTTP cache stores copies of downloaded resources (like scripts and stylesheets) on the user's local disk to prevent redundant network requests. Historically, the cache used a single key to identify these files: the resource's URL. If multiple websites requested the exact same CDN URL, the browser only downloaded it once and served the cached copy to all subsequent sites.

SRI works seamlessly with the HTTP cache, providing security for both network requests and local storage. When a browser initially fetches an SRI-protected resource from the network, it validates the hash before executing the code and storing it in the cache. Crucially, when the browser retrieves that same resource from the local HTTP cache later, it calculates and validates the SRI hash again. This ensures the file was not corrupted on the disk or tampered with by local malware.

#### Changes to CDN Performance Benefits

* **Partitioned (Double-Keyed) Caching**: To prevent cross-site tracking, all major modern browsers partition their HTTP caches based on the top-level site. If a user visits Site A and downloads react.js from a public CDN, and then visits Site B which requests the exact same file from the exact same CDN URL, the browser **must download the file again**. The historical benefit of "cross-site cache hits" no longer exists.
* **HTTP/2 and HTTP/3 Multiplexing**: Older HTTP/1.1 protocols required browsers to open multiple connections to download parallel assets, making it beneficial to shard assets across different CDN domains. HTTP/2 and HTTP/3 multiplex all requests over a single connection. Consequently, hosting assets on your own server is now often *faster*, as it eliminates the latency penalty of establishing new DNS lookups, TCP handshakes, and TLS negotiations with a separate CDN domain.

By hosting your own assets alongside your application, you eliminate the need for CORS (crossorigin="anonymous"), remove the risk of third-party supply chain attacks entirely, and often improve load times.

You might still choose to place a CDN (like Cloudflare or Fastly) *in front* of your own infrastructure for DDoS protection, edge caching, and bandwidth offloading. In this architecture, the assets technically remain same-origin, making self-hosting the most robust choice for both performance and security.

## **Potential Disadvantages and Caveats**

While SRI provides excellent security benefits, you must implement it carefully to avoid unintended application downtime.

Breaking Changes from Legitimate Updates
: If a third-party provider updates a file in place without changing the file name (often called an unversioned URL, like library-latest.js), the file's hash will change. Because your application still expects the old hash, the browser will block the legitimate update, breaking your application. **Only use SRI with strictly versioned URLs.**

Configuration Overhead
: Implementing SRI correctly requires you to integrate hash generation into your build pipeline. Every time you compile or modify your application assets, you must generate new hashes and inject them into your HTML files.

Network and CORS Dependencies
: If you still rely on third-party CDNs, SRI relies on CORS for cross-origin requests. A misconfiguration on the CDN's side (for example, dropping the Access-Control-Allow-Origin header) causes your site to break. Your application's uptime becomes highly dependent on the CDN correctly managing HTTP headers. To mitigate this risk, consider the self-hosting approach discussed in [Self-Hosting vs. Using a CDN in the Modern Web](\#self-hosting-vs-using-a-cdn-in-the-modern-web).

Lack of Support for Dynamic Content
: You cannot use SRI for scripts or stylesheets that are dynamically generated per user or per session. The file must remain static so its cryptographic hash remains consistent.

## Appendix: TypeScript SRI Generator

You can use the following Node.js script to manually generate SRI hashes for your files during development or as part of a custom build pipeline.

### **Prerequisites**

Ensure you have installed the required dependencies to run TypeScript files:

```bash
npm install -D tsx @types/node
```

### Usage

The usage is simple; either pass the path to the file you want to hash or pass the path to the file and specify the hashing algorithm (sha256, sha384, or sha512). If you don't specify an algorithm, it defaults to sha384.

```bash
# Defaults to sha384
npx tsx generate-sri.ts path/to/file.js

# Specify a custom algorithm
npx tsx generate-sri.ts path/to/file.js sha512
```

### The Generator Script (generate-sri.ts)

This is the full TypeScript code for the SRI generator. It only uses built-in Node.js modules (fs, crypto, and path) to read the file, compute the hash, and output the SRI string.

```ts
/**
 * Subresource Integrity (SRI) Generator
 *
 * Prerequisites:
 * npm install -D tsx @types/node
 *
 * Usage:
 * npx tsx generate-sri.ts <path-to-file> [algorithm]
 *
 * Example (defaults to sha384):
 * npx tsx generate-sri.ts ./public/app.js
 *
 * Example (specifying algorithm):
 * npx tsx generate-sri.ts ./public/app.js sha512
 */

import * as fs from 'node:fs';
import * as crypto from 'node:crypto';
import * as path from 'node:path';

/**
 * Generates an SRI hash for a given file.
 *
 * @param filePath The path to the file.
 * @param algorithm The cryptographic hash algorithm to use (default: sha384).
 * @returns A promise that resolves to the formatted SRI string.
 */
async function generateSRI(filePath: string, algorithm: string = 'sha384'): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`File not found: ${filePath}`));
    }

    const hash = crypto.createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on('data', (chunk: Buffer) => {
      hash.update(chunk);
    });

    stream.on('end', () => {
      const base64Hash = hash.digest('base64');
      resolve(`${algorithm}-${base64Hash}`);
    });

    stream.on('error', (err: Error) => {
      reject(err);
    });
  });
}

// CLI Execution Logic
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Error: Please provide a file path.');
    console.log('Usage: npx tsx generate-sri.ts <path-to-file> [algorithm=\'sha384\']');
    process.exit(1);
  }

  const filePath = path.resolve(args[0]);
  const algorithm = args[1] || 'sha384';

  const supportedAlgorithms = ['sha256', 'sha384', 'sha512'];
  if (!supportedAlgorithms.includes(algorithm)) {
    console.error(`Error: Unsupported algorithm '${algorithm}'. Use sha256, sha384, or sha512.`);
    process.exit(1);
  }

  try {
    const sri = await generateSRI(filePath, algorithm);
    console.log(`\nFile: ${filePath}`);
    console.log(`SRI Hash: ${sri}`);
    console.log(`\nHTML Example:`);
    console.log(`<script src="YOUR_URL_HERE" integrity="${sri}" crossorigin="anonymous"></script>\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to generate SRI: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
```
