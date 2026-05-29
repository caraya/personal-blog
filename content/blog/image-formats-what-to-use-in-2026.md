---
title: "Image Formats: What To Use In 2026?"
date: 2026-07-27
tags:
  - Images
  - Performance
---

This post started as an addendum to my article about responsive images and the `sizes="auto"` attribute, but I realized it deserved its own post.

When you use the `<picture>` element for format fallbacks, adopting a modern format stack is crucial for performance. Like with video, the browser will select the first format it supports from the list of `<source>` elements. Therefore, you should list the most efficient formats first, followed by older formats as fallbacks and finally a baseline format in the `img` tag for legacy support.

However, the issue is not as simple as "use AVIF and WebP." You still need to understand each format's tradeoffs, compatibility, and quality implications.

This post will explore the current landscape of image formats, their advantages and disadvantages, and provide guidance on how to choose the right formats for your web projects in 2026.

## The Problem: What Formats To Use

There are six primary image formats to consider in 2026, each with its own strengths and weaknesses. The formats are:

* **AVIF (AV1 Image File Format)**: Best compression efficiency with broad modern browser support.
* **WebP (WebM Image File Format)**: Strong all-around format with lossy/lossless, transparency, and animation support.
* **PNG (Portable Network Graphics)**: Lossless and ideal for flat-color graphics, text, and transparency.
* **JPEG/JPG (Joint Photographic Experts Group)**: Legacy-safe lossy format still practical for photos.
* **HEIC (HEVC Image File Format)**: Efficient but mostly limited to Apple ecosystem support on the web.
* **JPEG XL (JXL)**: Promising high-fidelity format with limited real-world browser availability today.

The following table summarizes the key characteristics of each format, including browser support, advantages, and disadvantages:

| Format | Browser Support | Advantages | Disadvantages |
| --- | --- | --- | --- |
| JPG	(Joint Photographic Experts Group) | Universal (~100%) | Universally recognized; fast encoding and decoding; excellent hardware acceleration. | Lossy only (suffers from generation loss); no transparency support; produces blocky artifacts at lower bitrates. |
| PNG	(Portable Network Graphics) | Universal (~100%) | Mathematically lossless; supports alpha-channel transparency; perfect for hard edges, text, and logos. | Very large file sizes for complex photographs; inefficient for web delivery compared to modern codecs. |
| WebP (WebM Image File Format) | Excellent (~96%+) | Supports both lossy and lossless; supports transparency and animation; consistently 25-35% smaller than JPG. | Max resolution limit (16383x16383 pixels); lossless WebP can occasionally be larger than highly optimized PNGs. |
| AVIF (AV1 Image File Format) | Excellent (~93%+) | Phenomenal compression efficiency (often beats WebP); supports HDR, 10-bit color, and transparency. | Very slow encoding times (CPU intensive); lacks progressive decoding (images load top-down instead of blurring in). |
| JXL (JPEG XL) | Minimal (Safari 17+ only). Behind flag in Chromium browsers and Firefox | Mathematically lossless transition from legacy JPGs; incredible high-fidelity compression; supports progressive loading. | Google removed support from Chromium and later restored it. Limited adoption until flags are removed. |
| HEIC (HEVC Image File Format) | Poor (Safari only) | Excellent compression (derived from h.265 video); supports depth maps, 16-bit color, and animation. | Patent-encumbered; practically useless for the open web outside the Apple ecosystem; computationally heavy. |

### Why Not GIF?

GIF is an outdated format that should be avoided for static images. It uses a limited 256-color palette, resulting in poor quality for photographs and complex images. Additionally, GIF's lossless compression is inefficient compared to modern formats, leading to unnecessarily large file sizes. For animations, WebP, AVIF, or small, highly compressed videos are superior alternatives that offer better quality and smaller file sizes.

### Choosing between JPEG and PNG for the baseline

Selecting your baseline format requires evaluating the tradeoff between compression settings, acceptable visual quality, and the specific content of the image. The objective is to produce the smallest file size while preserving image quality, but JPEG and PNG achieve this differently depending on the visual data.

* **When to use JPEG**: JPEG uses lossy compression, meaning it mathematically discards visual data to reduce file size. For continuous-tone images like photographs or complex illustrations, you can often lower the JPEG quality setting significantly before the human eye detects compression artifacts (such as blockiness or color banding). This tradeoff allows JPEG to achieve vastly smaller file sizes for photographs compared to a lossless format.
* **When to use PNG**: PNG uses lossless compression, meaning it preserves exact pixel data. While this creates massive files for photographs (which contain millions of subtle color variations and noise), PNG is highly efficient for images with large areas of flat color, sharp transitions, or text (such as UI screenshots, charts, or logos).

If you attempt to save a sharp UI screenshot as a JPEG, you must use an extremely high quality setting to avoid visible "ringing" artifacts around the text and sharp edges. At that equivalent high-quality setting, the JPEG will often produce a larger file size than the perfectly crisp PNG.

Let the image content dictate your fallback:

* Default to JPEG for photographs to prioritize bandwidth.
* Switch to PNG for graphics requiring sharp lines, flat colors, or transparency to prevent compression artifacts and actually achieve a smaller file size.

## Compression Quality Settings

When first saving your images, experiment with different quality settings to find the optimal balance between file size and visual fidelity.

The same quality setting doesn't mean the same thing across formats. A JPEG quality of 80 might produce a visually acceptable image, but a WebP quality of 80 could be much larger than necessary for the same image. Always test different settings for each format to find the sweet spot for your specific images.

Even when using the same format, the quality setting can have different effects based on the image content and the specific encoder implementation. For example, a JPEG quality of 80 might look great for a photograph with lots of detail, but it could produce noticeable artifacts in a simple graphic with sharp edges.

Always visually inspect your images at different quality settings to ensure you're achieving the desired balance between size and quality.

## Converting Images And Quality Metrics

The script below uses ImageMagick to convert a source image into multiple formats and quality settings, then calculates the [PSNR](https://www.ni.com/en/shop/data-acquisition-and-control/add-ons-for-data-acquisition-and-control/what-is-vision-development-module/peak-signal-to-noise-ratio-as-an-image-quality-metric.html), and [SSIM](https://www.imatest.com/docs/ssim/) metrics for each output image compared to the original.

This gives you empirical CSV data on how each format and quality setting performs for your specific images.

The script assumes you have ImageMagick installed and available in your system's path. It also assumes that the version of ImageMagick you have supports JPEG XL.

**If you're using Homebrew on macOS**, the default version of ImageMagick doesn't include JPEG XL support. You can install `imagemagick-full` and adjust your PATH accordingly to get JPEG XL support.

```bash
#!/usr/bin/env bash

# Source image variable. Pass the FULL filename (e.g., image.png, photo.tif)
SOURCE_IMAGE="$1"

# Verify that a file was provided and actually exists
if [[ -z "${SOURCE_IMAGE}" || ! -f "${SOURCE_IMAGE}" ]]; then
  echo "Error: Please provide a valid source image."
  echo "Usage: $0 <image_file>"
  exit 1
fi

IMAGE_MAGICK="magick"
IMAGE_MAGICK_COMPARE="magick compare"

if ! hash ${IMAGE_MAGICK} 2>/dev/null; then
  echo "Could not find ImageMagick (${IMAGE_MAGICK}) on your system."
  exit 1
fi

# Extract only the filename without the directory path to avoid broken folder routing
FILENAME=$(basename "${SOURCE_IMAGE}")
RUN_DIR=$(pwd -P)
SOURCE_IMAGE_ABS=$(cd "$(dirname "${SOURCE_IMAGE}")" && pwd -P)/$(basename "${SOURCE_IMAGE}")

# Automatically strip the extension to get the base name for output files
BASENAME="${FILENAME%.*}"

# Initialize the CSV file in the current directory and write the column headers
CSV_FILE="metrics-${BASENAME}.csv"
echo "Format,Quality,SizeBytes,PSNR,SSIM" > "${CSV_FILE}"

# Detect the format, color class, and compression algorithm of the source image
SOURCE_FORMAT=$(magick identify -format "%m" "${SOURCE_IMAGE}" 2>/dev/null)
IMAGE_CLASS=$(magick identify -format "%r" "${SOURCE_IMAGE}" 2>/dev/null)
IMAGE_COMPRESSION=$(magick identify -format "%C" "${SOURCE_IMAGE}" 2>/dev/null)

# Determine if the image is truly lossless (Guilty until proven innocent)
IS_LOSSLESS=0

if [[ "${SOURCE_FORMAT}" == "BMP" ]]; then
  IS_LOSSLESS=1
elif [[ "${SOURCE_FORMAT}" == "PNG" && "${IMAGE_CLASS}" == "DirectClass" ]]; then
  # Standard 24-bit/32-bit truecolor PNG
  IS_LOSSLESS=1
elif [[ "${SOURCE_FORMAT}" =~ ^(TIFF|PTIF)$ ]]; then
  # TIFF is a container. It is lossless UNLESS it specifically uses JPEG compression.
  if [[ ! "${IMAGE_COMPRESSION}" =~ ^(JPEG)$ ]]; then
    IS_LOSSLESS=1
  fi
fi

# Print the context banner based on the true state of the file
if [[ ${IS_LOSSLESS} -eq 0 ]]; then
  echo "======================================================================="
  echo "⚠️  NOTICE: Lossy or Indexed Source Detected"
  echo "Format: ${SOURCE_FORMAT} | Compression: ${IMAGE_COMPRESSION:-None}"
  echo ""
  echo "This image has already undergone lossy compression or color reduction."
  echo "The metrics below will measure how perfectly the codecs reproduce"
  echo "this exact file, including its existing artifacts (generation loss)."
  echo "======================================================================="
  echo ""
else
  echo "======================================================================="
  echo "✅  NOTICE: Pristine Lossless Source Detected"
  echo "Format: ${SOURCE_FORMAT} | Compression: ${IMAGE_COMPRESSION:-None}"
  echo ""
  echo "This is a mathematically lossless source. The metrics below"
  echo "will accurately reflect pure codec compression performance."
  echo "======================================================================="
  echo ""
fi

# Function to handle conversion, sizing, and metric calculations
process_and_evaluate() {
  local format="$1"
  local quality="$2"
  local source_file="${SOURCE_IMAGE}"

  # Point the output file to the newly created format directory
  local output_file="${format}/${BASENAME}-${quality}.${format}"

  # Convert the image (Using magick in IMv7)
  if ! ${IMAGE_MAGICK} "${source_file}" -quality "${quality}" "${output_file}" 2>/dev/null; then
    echo "  Quality ${quality} | ⚠️  ENCODING FAILED — skipping"
    echo "${format},${quality},ERROR,ERROR,ERROR" >> "${CSV_FILE}"
    return
  fi

  # Guard against a zero-byte output (some libheif builds silently produce one)
  if [[ ! -s "${output_file}" ]]; then
    echo "  Quality ${quality} | ⚠️  EMPTY OUTPUT — skipping"
    echo "${format},${quality},ERROR,ERROR,ERROR" >> "${CSV_FILE}"
    rm -f "${output_file}"
    return
  fi

  # Get the raw byte count for the CSV (pure numbers only)
  local raw_size
  raw_size=$(wc -c < "${output_file}" | tr -d ' ')

  # Get the human-readable size for the terminal
  local display_size
  display_size=$(magick identify -format "%b" "${output_file}" 2>/dev/null)
  if [[ -z "${display_size}" ]]; then
    display_size="${raw_size}B"
  fi

  # Calculate metrics (2>&1 redirects standard error to standard output)
  # sed strips any warnings that ImageMagick appends directly after the value
  # on the same line (e.g. iCCP profile warnings), leaving only "VALUE (COMPOSITE)"
  local psnr
  psnr=$(${IMAGE_MAGICK_COMPARE} -metric PSNR "${source_file}" "${output_file}" NULL: 2>&1 \
    | sed -E 's/^([0-9e.+\-]+( \([0-9e.+\-]+\))?).*/\1/')

  local ssim
  ssim=$(${IMAGE_MAGICK_COMPARE} -metric SSIM "${source_file}" "${output_file}" NULL: 2>&1 \
    | sed -E 's/^([0-9e.+\-]+( \([0-9e.+\-]+\))?).*/\1/')

  # Output the formatted results to the terminal
  echo "  Quality ${quality} | Size: ${display_size} | PSNR: ${psnr} | SSIM: ${ssim}"

  # Append the raw data to the CSV file
  echo "${format},${quality},${raw_size},${psnr},${ssim}" >> "${CSV_FILE}"
}

# Define the target formats
formats=("png" "jpg" "webp" "heic" "avif" "jxl")

echo "Starting evaluation. Data will be saved to: ${CSV_FILE}"
echo ""

# Process each format
for format in "${formats[@]}"; do

  # Verify JPEG XL support before processing
  if [[ "${format}" == "jxl" ]]; then
    if ! magick -list format | grep -i "JXL" > /dev/null; then
      echo "---"
      echo "⏭️  Skipping JPEG XL (jxl): Your ImageMagick build lacks the libjxl delegate."
      echo "---"
      echo ""
      continue
    fi
  fi

  echo "Encoding to ${format^^}..."

  # Create a directory for the format
  mkdir -p "${format}"

  for i in {50..100..10}; do
    process_and_evaluate "${format}" "${i}"
  done
  echo ""
done

echo "======================================================================="
echo "✅  Evaluation Complete! "
echo "📊  Results saved to: ${CSV_FILE}"
echo "======================================================================="
```

### Comparing Metrics: PSNR vs. SSIM

Including both metrics gives you a complete, multi-layered view of how a compression algorithm performs.

* **PSNR (Peak Signal-to-Noise Ratio)**: Measures the absolute mathematical pixel data loss. It calculates the raw signal degradation (Mean Squared Error) without caring how the image actually looks.
* **SSIM (Structural Similarity Index Measure)**: The traditional industry standard for perceptual quality. It measures changes in luminance, contrast, and basic structural correlations (edges and shapes) across local areas of the image.

**DISTS (Deep Image Structure and Texture Similarity)** was considered for inclusion as a third metric, but in testing it could run out of memory on large TIFF sources and lacks ImageMagick support. To evaluate it, we'd need to add a Python section to the script to run DISTS through PyTorch. For more information, see [Image Quality Assessment: Unifying Structure and Texture Similarity](https://arxiv.org/abs/2004.07728).

#### Feature Comparison

| Feature | PSNR (Data) | SSIM (Structure) |
| --- | --- | --- |
| **Measurement Focus** | Absolute mathematical pixel differences. | Local luminance, contrast, and edges. |
| **Underlying Tech** | Mean Squared Error (Math). | Local window variance (Math). |
| **Score Meaning** | Higher is better (dB). | Higher is better (Max score is 1.0). |
| **Computational Speed** | Extremely fast. | Extremely fast. |
| **Ideal Use Case** | Measuring raw data loss and catastrophic encoder failures. | Establishing a standardized, fast perceptual baseline. |

## Conclusion: What Formats To Use In 2026?

There is no one-size-fits-all answer to the question of which image formats to use in 2026. The ideal format stack depends on your specific use case, the content of your images, and the level of quality you want to achieve. However, a general recommendation for a modern format stack in 2026 would be:

* **Primary (AVIF)**: AVIF offers superior compression and quality characteristics compared to older formats. Modern browsers broadly support it.
* **Secondary (WebP)**: WebP provides excellent compression and acts as a bridge for older browser versions that support WebP but predate AVIF support.
* **Baseline (JPEG or PNG)**: You must provide a baseline format in the `<img>` tag for legacy browsers, RSS readers, email clients, and social media scrapers that can't parse modern formats.

In a `<picture>` element, the order of `source` tags should be:

```html
<picture>
	<source srcset="image.avif" type="image/avif">
	<source srcset="image.webp" type="image/webp">
	<img src="image.jpg" alt="Description of the image">
</picture>
```
