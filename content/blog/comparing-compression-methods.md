---
title: Comparing compression methods
date: 2025-03-19
tags:
  - Compression
  - Web
  - Command line
  - Comparison
youtube: true
---

Compression has been around for a long time, and it's a key part of web performance. In this post, we'll compare three popular compression methods: GZip, Brotli, and Zstd.

We will first look at each compression standard, compare them when compressing a file and then look at how they can be used in the web, on their own and with compression dictionaries.

## The compression methods

We will work with three compression: GZip, Brotli, and Zstd.

GZip
: GZip is a file format and a software application used for file compression and decompression. The program was created as a free software replacement for the compress program used in early Unix systems, and intended for use by GNU (from which the "g" of gzip is derived).
: It is widely available and should provide a good baseline for comparison and a fallback for when the other two are not available.

Brotli
: Brotli is a lossless data compression algorithm. It uses a combination of the  LZ77 lossless compression algorithm, Huffman coding and 2nd-order [context modelling](https://en.wikipedia.org/wiki/Context_model).
: Brotli is primarily used by web servers and content delivery networks to compress HTTP content, making internet websites load faster.
: It is a newer compression method that has been gaining popularity in the web community. Because it's geared for web compression, I'm curious to see how it compares to GZip in non-web applications in terms of compression and speed.

Zstd
: Zstandard (or Zstd) is a lossless data compression algorithm and reference implementation developed at Facebook.  Zstandard is designed to offer fast real-time compression and decompression speeds, as well as a high compression ratio.
: This is the blackbox for me. I want to test how it compares to Brotli since I expect it to perform better than the GZip baseline.

### Format specific considerations

Since each format has its own configuration settings, we'll look at details like compression level and other attributes that can be set to optimize the compression.

#### GZip

--keep / -k
: Keep (don't delete) input files during compression or decompression.

-n (1 - 9)
: Controls the compression speed and is a tradeoff between speed and compression
: `-1` or `--fast` indicates the fastest compression method (less compression) and `-9` or `--best` indicates the slowest compression method (optimal compression)
: The default compression level is -6 (that is, biased towards high compression at expense of speed).

#### Brotli

While Brotli is primarily used for web compression, it can be used for general file compression too. The flags we'll be using are:

-q NUM / --quality=NUM (0 -11)
: Compression level from . Running the same assumption as with GZip, the higher the number the better the compression but the slower the process

-Z / --best
: Use best compression level. ***This is the default***
: This is equivalent to `-q 11`

#### Zstd

 The Zstd flags we'll be using are:

-n (default: 3)
: Desired compression level, where `n` is a number between 1 and 19.
: Lower numbers provide faster compression, higher numbers yield
better compression ratios.

--ultra
: Enable levels beyond 19, up to 22; requires more memory.

--fast[=#] (default: 1)
: Use to very fast compression levels.

## The comparison

Before we start, let's look at the specs of the laptop where I'm running the tests and the files that we'll be compressing.

* MacOS Ventura 13.7.2
* 3.1 GHz QuadCore Intel Core i7
* 16 GB RAM (2133 MHz LPDDR3)

I am using the following tools installed via [Homebrew](https://brew.sh/):

| Tool | Version |
| --- | --- |
| gzip | 1.13 |
| Brotli | 1.1.0 |
| zstd | 1.5.7 |

!!! note Note
In this post I will not research whether there's a difference in using tools installed via Homebrew and those compiled from source. I will assume that the tools installed via Homebrew will behave the same as those manually compiled
!!!

The files that we'll be testing with:

| File | Size | Description |
| --- | :---: | --- |
| books-as-web-apps-2.md | 44KB | A markdown file |

We will run multiple compression tests  and compare the results for each compression methods.

!!! note Note
I chose to only compress a sample text file because it's the most likely thing to compress in the command line.

Photos and videos can be better compressed with specialized tools so I wouldn't expect to see much difference in compression file sizes when using any of the tools in this post.
!!!

### GZip

For this test I created a small shell script to automate the process.

I've added the `--keep` flag to keep the original file to prevent the default behavior of deleting it after compression.

I don't expect compression to make much of a difference with GZip, but I'm using it as a baseline to measure the other two formats against.

```bash
#!/usr/bin/env bash

if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <file> [additional files...]"
  exit 1
fi

for file in "$@"; do
  filename=$(basename -- "$file")

  name="${filename%.*}"

  extension="${filename##*.}"

  for level in 1 6 9; do
    output_file="${name}-${level}.${extension}.gz"

    echo "Compressing $file with compression level -$level to $output_file"

    gzip --keep -"$level" -c "$file" > "$output_file"
  done
done
```

The script takes one or more files as arguments and compresses them with three different compression levels: 1, 6, and 9.

When we use it with text files, we can see the difference in the compression levels. Even at the minimum level of compression, the file size is reduced by more than 50%, the size is further reduced when we run the command with higher compression levels.

This may be because text files are easier to compress than binary ones where, most of the time, files have already been compressed when they are created.

| tool | file | flags | original size | compressed size |
| --- | --- | --- | --- | --- |
| gzip | books-as-web-apps-2.md | --keep -1 | 44KB | 19KB |
| gzip | books-as-web-apps-2.md | --keep -6 | 44KB | 17KB |
| gzip | books-as-web-apps-2.md | --keep -9 | 44KB | 17KB |


### Brotli

We've created a similar automation script for Brotli. The process is similar to those we've done for GZip... with one additional step: we verify that the Brotli binary is available on the system and bail out if it's not installed.

Eventhough I know it's installed via Homebrew, it may not be the case for other people trying to duplicate the tests.

I expect so see some level of improvement over GZip, but I'm not sure how much.

```bash
#!/usr/bin/env bash

# Check if brotli is installed on the system.
# It may not installed by default
if ! command -v brotli &> /dev/null; then
  echo "Error: brotli is not installed. Please install it first."
  exit 1
fi

# Ensure an input file has been provided as an argument
if [ $# -ne 1 ]; then
  echo "Usage: $0 <input-video-file>"
  exit 1
fi

input_file="$1"

# Extract filename with extension
filename=$(basename -- "$input_file")
# Extract file extension (after the last dot)
extension="${filename##*.}"
# Extract filename without extension (before the last dot)
filename="${filename%.*}"

compression_levels=(0 5 10)

for level in "${compression_levels[@]}"
do
  output_file="${filename}-${level}.${extension}.br"

  echo "Compressing ${input_file} with quality ${level}..."

  brotli -q "${level}" -o "${output_file}" "${input_file}"

  echo "Generated ${output_file}"
done
```

Once again, compressing text files shows a significant reduction in file sizes. As expected, the higher the compression level, the smaller the file size.

| tool | file | flags | original size | compressed size |
| --- | --- | --- | --- | --- |
| brotli | books-as-web-apps-2.md | --keep -q 0 | 44KB | 20KB |
| brotli | books-as-web-apps-2.md | --keep -q 5 | 44KB | 16KB |
| brotli | books-as-web-apps-2.md | --keep -q 10 | 44KB | 14KB |


### Zstd

The Zstd script is similar to the Brotli script. It checks if the Zstd binary is available on the system and bail out if it's not installed. It then compresses the file with multiple compression levels.

```bash
#!/usr/bin/env bash

# Check if zstd is installed on the system
if ! command -v zstd &> /dev/null; then
  echo "Error: zstd is not installed. Please install it first."
  exit 1
fi

if [ $# -ne 1 ]; then
  echo "Usage: $0 <input-video-file>"
  exit 1
fi

input_file="$1"

# Extract filename with extension
filename=$(basename -- "$input_file")
# Extract file extension (after the last dot)
extension="${filename##*.}"
# Extract filename without extension (before the last dot)
filename="${filename%.*}"

compression_levels=(1 10 19)

for level in "${compression_levels[@]}"
do
  output_file="${filename}-${level}.${extension}.zst"

  echo "Compressing ${input_file} with quality ${level}..."

  zstd -${level} -o "${output_file}" "${input_file}"

  echo "Generated ${output_file}"
done
```

In the text file example the size reduction is slightly worse than with Brotli, but still better than GZip.

| tool | file | flags | original size | compressed size |
| --- | --- | --- | --- | --- |
| zstd | books-as-web-apps-2.md | -1 | 44KB | 18.1KB |
| zstd | books-as-web-apps-2.md | -10 | 44KB | 16.2KB |
| zstd | books-as-web-apps-2.md | -19 | 44KB | 15.8KB |

### Final Comparison

The results of the compression tests show that the three compression methods are effective at reducing the size of text files.

Of the three I've chosen Brotli as my preferred compression method for text and other uncompressed files. It offers the best compression ratio of the three.

## Compression on the web

You can also compress text files like HTML, CSS, and Javascript on the server to improve performance by sending smaller files down the wire to your users. This is especially useful for mobile users who may have slower connections. This will not reduce the cost of parsing and executing the files, but it will reduce the time it takes to download them.

How to enable compression on the server depends on the server software or the hosting company that you use.

For example, Netlify automatically compresses text files for you, while Cloudflare allows you to configure compression settings in the dashboard.

If you're using a web server like Apache or Nginx, you can configure them to dynamically compress files using Brotli.

Here are instructions for configuring Brotli compression in [Apache 2.4](https://bash-prompt.net/guides/apache-brotoli/) using `mod_brotli` and [Nginx](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/brotli/). THese instructions assume you have access to your main server and virtual host's configuration files. **These should not be run in .htaccess files**.

All previous and current versions of modern browsers will automatically decompress these server-compressed files, so you don't need to worry about compability as show in the following Caniuse table.

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/static/v1/brotli-1742150711743.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/static/v1/brotli-1742150711743.png">
<img src="https://caniuse.bitsofco.de/static/v1/brotli-1742150711743.jpg" alt="Data on support for the brotli feature across the major browsers from caniuse.com">
</picture>

## Links and resources

* Background
  * [Understanding Compression](https://www.oreilly.com/library/view/understanding-compression/9781491961520/) by Colt McAnlis and Aleks Haecky &mdash; O'Reilly
* Formats
  * [Gzip](https://en.wikipedia.org/wiki/Gzip)
  * [Brotli](https://en.wikipedia.org/wiki/Brotli)
  * [Zstd](https://en.wikipedia.org/wiki/Zstd)
* Server-Side web compression
  * [Cloudflare](https://developers.cloudflare.com/rules/compression-rules/)
    * [Create a rule in the dashboard](https://developers.cloudflare.com/rules/compression-rules/create-dashboard/)
  * [Vercel](https://vercel.com/docs/edge-network/compression)
  * [Apache 2.4](https://httpd.apache.org/docs/2.4/mod/mod_deflate.html)
  * [How To Enable Brotli Compression In Apache 2.4](https://bash-prompt.net/guides/apache-brotoli/)
  * [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/compression/)
  * Nginx [Brotli](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/brotli/)
