---
title: "From Markdown to PDF: Pandoc"
date: 2026-06-17
tags:
  - PDF
  - Markdown
  - Pandoc
  - Latex
---

When I first thought about automatically geneerating PDF version of my blog posts, I thought it would be easy: Just create a shell script that would run Pandoc to convert each document into its PDF equivalent.

**First discovery**: Pandoc uses LaTeX to do the conversion.

**Second discovery**: LaTeX is very strict on how it wants its input formatted and how it reacts when it isn't.

This led to the two scripts that will be discussed in this post.

In a later post I will discuss a different alternative using XSLT, CSS and PrinceXML as an alternative PDF generation alternative.

## Software Prerequisites

For the scripts to run you need the following software installed in your computer, either natively or via your package manager (Homebrew, in my case):

* Pandoc
* ImageMagick to do image conversion
* TexLive, or an equivalent full LaTeX installation, to handle LuaLatex and the required fonts

## What The Scripts Will And Won't Do

The scripts will:

1. Convert the Markdown file to PDF without modifying the original Markdown file
2. Handle image conversion and formatting for PDF compatibility. We cannot and should not change the original images or their references in the Markdown file.
3. Ensure consistent typography and layout across the PDF files.
4. Handle emoji and multilingual characters

The scripts will not:

1. Modify the Markdown and image files
2. Alter the original content or structure of the documents
3. Handle complex LaTeX features or custom templates



## Architecture Overview

The PDF generation pipeline relies on two tightly coupled scripts designed to bridge the mismatch between web-first Markdown authoring and print-perfect LaTeX typesetting.

This mismatch stems from how each medium treats space. Markdown and HTML are inherently fluid; they are designed for dynamic reflowing across endless vertical canvases, responding to variable screen sizes and user preferences. Conversely, PDF generation requires strict pagination, absolute positioning, high-resolution local assets, and rigorous typographic constraints. A layout that looks acceptable on a scrolling web page can easily break a fixed-dimension print document.

To solve this friction without forcing content authors to write LaTeX natively or abandon modern web features, the pipeline automates the translation process using two core components:

**convert-blog-to-pdf.sh**: The primary Bash executable that orchestrates Pandoc, configures the LuaLaTeX rendering engine, and establishes the zero-install typography and layout architecture. It acts as the master build controller, establishing the environment, verifying dependencies, and handling the final output generation.

**convert-images.lua**: A Pandoc Lua filter that intercepts the Abstract Syntax Tree (AST) to sanitize web-centric image attributes, route remote URLs to local file paths, and transcode modern web image formats (WebP/AVIF) into PDF-compatible formats. It acts as the pre-processor, silently converting web semantics into print-safe assets before the typesetting engine ever sees them.

## The Dual Lua Architecture

Although both scripts in this pipeline rely heavily on the Lua programming language, they execute in two completely isolated environments at different stages of the build process. Understanding this distinction is critical for debugging, extending the pipeline, or troubleshooting complex compilation failures.

### Pandoc's Embedded Lua Interpreter

Pandoc features a natively embedded Lua interpreter specifically designed to manipulate a document's Abstract Syntax Tree (AST).

When Pandoc parses a Markdown file, it does not immediately generate LaTeX. Instead, it parses the text into a structured, in-memory tree of objects (for example, Header, Para, Image, RawBlock). Rather than relying on fragile, error-prone Regular Expressions to parse text sequentially, the Lua filter navigates this predictable structural tree.

When the pipeline executes `convert-images.lua` using the `--lua-filter` flag, Pandoc runs this script before generating any target code. The filter walks the tree, targeting specific node types for modification. This script is exclusively a Pandoc requirement. Because it operates entirely independently of the final PDF rendering engine, this AST filter would continue to function flawlessly even if you swapped LuaLaTeX for an alternative engine like XeLaTeX or pdfLaTeX, or if you decided to export to an EPUB file instead.

### LuaLaTeX's Internal Engine (LuaTeX)

Standard pdfLaTeX has historically been the default compiler for LaTeX, but it struggles heavily with modern UTF-8 encoding, complex language scripts, and OpenType system fonts. To solve this, the pipeline utilizes LuaLaTeX, a modern TeX typesetting engine built on top of LuaTeX, which embeds its own distinct Lua interpreter directly into the compiler.

During the PDF compilation phase, LuaLaTeX executes the `\directlua` commands defined within `convert-blog-to-pdf.sh`. The pipeline uses this specific, internal Lua environment strictly for advanced, low-level typography management. By exposing TeX's internals to Lua, we can dynamically construct the globalfallback font array directly within the compiler's memory. Unlike the AST filter, these commands are strictly tethered to LuaLaTeX and will cause compilation to crash if passed to a traditional LaTeX compiler.

## The Build Engine: `convert-blog-to-pdf.sh`

This script serves as the primary entry point for the automation pipeline. It iterates through the content/blog directory, extracting YAML frontmatter titles, establishing the environment, and compiling Markdown files sequentially into the pdf-exports directory.

### Dynamic Dependency Injection

Because modern web development environments often rely on varied package managers (like Homebrew on macOS or APT on Debian), hardcoding executable paths guarantees pipeline failure across different machines or in Continuous Integration (CI) environments.

To ensure resilience, the script dynamically resolves the magick binary path before compilation begins. It checks standard Homebrew directories (for macOS Apple Silicon and Intel architectures) as well as standard Linux binary paths. Once located, it exports the resolved path as an environment variable (`MAGICK_PATH`) for the downstream Lua AST filter to consume, ensuring seamless image transcoding regardless of the host operating system.

### The "Zero-Install" Typography Architecture

To support a globally diverse technical blog without requiring external OS-level font installations, a crucial factor for reproducible CI/CD pipelines, the pipeline leverages the massive font dictionaries natively bundled within TeX Live. This "zero-install" philosophy ensures any developer can clone the repository and build the PDFs without configuring a local font book.

The engine uses STIX Two Text and STIX Two Math as the core typeface. This pairs high-readability academic prose with mathematically perfect equation rendering. Because no single font covers the entire Unicode specification (CJK fonts alone consume roughly 90,000 codepoints), the script implements a sequential globalfallback array using LuaTeX's luaotfload package:

* **Japanese**: Harano Aji Mincho
* **Simplified Chinese**: FandolSong
* **Thai**: Kinnari
* **Arabic**: Amiri

### Extended Cyrillic & Symbols: CMU Serif

When LuaLaTeX encounters a character missing from the primary STIX Two font dictionary, it systematically cascades through this array until it finds a matching glyph. The script applies this exact fallback chain to both the main text and the monospace code block font (CMU Typewriter Text), ensuring inline code snippets containing complex web symbols (like ✔ or ✘) render accurately.

### Native Emoji Rendering

TeX Live engines were historically built for monochrome vector glyphs and do not natively support modern RGBA color emoji fonts. To render emojis, the script must bypass standard text shaping algorithms and force the HarfBuzz rendering engine to utilize the host operating system's native emoji dictionary.

Because color emoji fonts are closely tied to the underlying operating system, the font name supplied to the HarfBuzz renderer must exactly match the host environment. The current architecture uses the native macOS font, but you must adapt this string for cross-platform builds:

* **macOS**: Apple Color Emoji
* **Windows**: Segoe UI Emoji
* **Linux**: Noto Color Emoji (standard on Ubuntu/Debian) or Twitter Color Emoji

Using the `newunicodechar` package, the script explicitly maps specific emoji codepoints (for example, `\newunicodechar{🚀}&#123;&#123;\emojifont 🚀&#125;&#125;`). This instructs the compiler to temporarily swap into the specialized HarfBuzz engine exclusively when it encounters these registered characters.

### Layout and Float Boundaries

LaTeX defaults to strict, highly opinionated vertical boundaries. It relies on a complex algorithm for placing "floats" (images and tables) to ensure text flows beautifully around them. However, when dealing with modern, wide-aspect web screenshots, this algorithm often panics, throwing fatal Float too large for page errors when it attempts to place a large image near a page margin.

The script overrides these native TeX boundaries using the floatrow package and custom float fractions to guarantee successful compilation:

`\floatpagefraction` is relaxed to 0.9, allowing massive images to gracefully shift to their own dedicated pages rather than overflowing margins and halting the build.

A custom `\maxwidth` macro calculates the available space and ensures no image ever exceeds `\linewidth`. This prevents horizontal bleeding into the margins while strictly preserving native aspect ratios.

The `graphicx` package is unconditionally loaded before these constraints are applied, preventing the engine from crashing with "undefined key" errors when compiling pure text posts devoid of imagery.

## The AST Interceptor: `convert-images.lua`

While Pandoc delegates the actual PDF rendering to LaTeX, LaTeX expects pristine, local, print-ready image assets. This Lua filter bridges the gap between web-authored Markdown (which often links to external CDNs) and local print compilation.

### Local Asset Routing & Cache Busting

Blog content frequently contains raw image URLs pointing to remote CDNs like Cloudinary or WordPress media libraries. Relying on remote HTTP requests during PDF generation introduces severe latency and pipeline fragility. The filter's `force_local_path` function intercepts every image source and executes the following sanitization:

* **Strips Remote Hosts**: Removes the domain, directory path, and query strings entirely, isolating the core filename.
* **Strips Cache Hashes**: Web workflows often append random hashes to prevent browser caching issues. The script uses a targeted Lua pattern matching rule (`_%w%w%w%w%w%w%.`) to identify and cleanly remove Cloudinary's auto-generated 6-character cache-busting suffixes.
* **Forces Local Resolution**: It dynamically prepends `public/images/` to the sanitized filename, forcing LaTeX to pull the pristine, local source file directly from the repository's tracked assets.

### Image Format Transcoding

Modern web development heavily favors next-generation image formats like `.webp` or `.avif` for significant bandwidth savings. Unfortunately, LaTeX does not support these formats natively and requires standard `.png` or `.jpg` files.

When the AST filter identifies a WebP or AVIF extension, it triggers the host machine's ImageMagick binary (resolved earlier by the Bash script). The filter converts the file to a print-safe `.png` and saves it in a temporary `pdf-image-cache/` directory. It then rewrites the Pandoc AST node to point to this newly generated local cache file. Subsequent pipeline builds check this cache first to prevent redundant computational transcoding, significantly speeding up iteration and compilation times.

### HTML Scrubbing and Iframe Fallbacks

Modern Markdown extensions (like MDX) allow content authors to embed raw, semantic HTML tags (`<picture>`, `<source>`) or responsive attributes (`srcset`, `sizes`) directly into their posts. These concepts do not exist in print typesetting and will instantly crash LaTeX compilers.

To ensure graceful degradation, the AST filter includes a global HTML scrubber that sanitizes the document before it reaches LaTeX:

It systematically strips `srcset` and `sizes` attributes entirely to prevent the LaTeX engine from attempting background fetches of alternative resolutions.

It remaps standard `src` and `data-src` attributes within raw HTML blocks to match the local filesystem logic described above.

It detects interactive web components, such as `<iframe>` embeddings for CodePens or YouTube videos, and surgically removes them. It dynamically replaces the iframe with a semantic print fallback—typically a blockquote containing the original URL—ensuring the print reader still receives the contextual reference without breaking the document flow.
