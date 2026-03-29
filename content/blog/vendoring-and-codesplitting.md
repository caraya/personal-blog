---
title: "Vendoring and Code Splitting in the HTTP/2 Era"
date: 2026-05-06
tags:
  - Performance
  - Build Tools
---

Code splitting is the practice of breaking JavaScript code into small chunks that the browser can load on demand. This technique optimizes load times and improves user experience by only loading the code necessary for the current page or route.

Vendoring (often called vendor chunking) is the practice of extracting third-party dependencies—such as React, Lodash, or utility libraries—from the main application code and bundling them into separate files.

Instead of serving a single, massive bundle.js file to users, you serve the application code (`app.js`) and the dependencies (`vendor.js`) separately. This strategy optimizes browser caching because third-party libraries change much less frequently than application code.

This guide explains how HTTP/2 multiplexing has changed the performance landscape for code splitting and vendoring, and why modern build tools have evolved from simple binary splits to more granular chunking strategies.

## How HTTP/2 Multiplexing Changes Network Overhead

Historically, developers grouped files to minimize HTTP requests. Under HTTP/1.1, browsers limited concurrent connections to a single domain. If a page required 20 JavaScript files, the browser queued them, causing a bottleneck known as head-of-line blocking.

HTTP/2 solves this by allowing multiplexing over a single TCP connection. The browser requests dozens of chunks simultaneously without queuing delays or repeated connection handshakes. Because of this, splitting an application into multiple files no longer incurs the severe network performance penalties it once did.

## Why Developers Still Bundle and Vendor Code

If HTTP/2 allows web servers to send many small files efficiently, why do developers still use bundlers to combine files?

While HTTP/2 solves the network bottleneck, bundling and chunking address several other performance constraints:

Compression Efficiency
: Compression algorithms like Gzip and Brotli look for repeated strings of characters to reduce file size. They build a dictionary of these repetitions.
: When you compress one 200 KB file, the algorithm has a large dataset to find repetitions, resulting in a highly efficient compression ratio. If you split that same code into twenty 10 KB files, the algorithm must compress each file individually. It cannot share the compression dictionary across files, resulting in a larger total download size. Grouping dependencies maximizes compression efficiency.

Browser Parsing and Execution
: While the network downloads 100 small JavaScript files quickly over HTTP/2, the browser's JavaScript engine (such as V8 in Chrome) still needs to parse and compile them. Evaluating many small scripts individually introduces CPU overhead compared to evaluating well-optimized, larger chunks. Bundlers optimize the module execution order and scope, which helps the browser parse the code faster.

### The Pitfalls of a Single Vendor Bundle

Historically, developers grouped all of `node_modules` into a single `vendor.js` file and their application code into `app.js`. However, a monolithic vendor bundle introduces significant drawbacks:

The "All-or-Nothing" Cache Invalidation
: If you combine 50 dependencies into a single 500 KB `vendor.js` file, updating just one minor 5 KB utility library invalidates the cache for the entire 500 KB file. The user must re-download the remaining 495 KB of unchanged code, resulting in a severe performance hit.

Parsing Overhead
: While V8 and other modern engines cache parsed bytecode on disk to speed up subsequent loads, a massive single file forces the engine to evaluate code that a specific route might not even use. This wastes CPU cycles on the main thread.

The Modern Solution: Granular Chunking
: Because of the cache invalidation issues with single massive bundles and the advent of HTTP/2 multiplexing, modern build tools (like Vite and Webpack) have evolved from simple vendoring to granular chunking.
: Instead of a binary `app.js` and `vendor.js` split, bundlers use intelligent heuristics to create multiple, optimized chunks:
: - **Framework Chunks**: Core libraries that almost never change and are required on every page (for example, react, react-dom, vue) bundle together into a highly cacheable framework chunk.
: - **Feature-Specific Chunks**: Large, heavy libraries (like d3 or three.js) split into their own separate chunks. The application loads them only when a specific route requests them via dynamic imports.
: - **Shared Application Chunks**: Application components used across multiple routes extract into shared chunks so they do not duplicate across the network.
: This granular approach represents the modern ideal: it balances network efficiency (taking advantage of HTTP/2) with optimal cache invalidation and reduced parsing overhead.

## Implementation Guide

Modern bundlers provide powerful APIs to configure how they split and vendor code. Below are examples for configuring both Vite and Webpack to dynamically chunk dependencies from `node_modules` while managing file sizes.

### Vite

Vite uses Rollup under the hood for production builds. To split `node_modules` automatically while keeping bundle sizes manageable, pass a function to `manualChunks` instead of an array.

This function examines the file path (id) of each module. If the module originates from `node_modules`, the function extracts the package name and returns it. Rollup then groups all files from that specific npm package into its own chunk, preventing a single massive vendor file.

**TypeScript (vite.config.ts)**

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});
```

### Webpack

Webpack handles vendoring through its `optimization.splitChunks` API. To process everything from `node_modules` while strictly respecting a maximum file size, use the `maxSize` property.

When you set `maxSize` (defined in bytes), Webpack attempts to split the vendors chunk into smaller parts if it exceeds the specified limit. This ensures that no single vendor chunk becomes too large to parse efficiently.

**TypeScript (webpack.config.ts)**

```ts
import * as path from 'node:path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      maxSize: 250000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

export default config;
```

## Grouping Smaller Packages to Avoid Fragmentation

While granular chunking is highly effective, splitting every single npm package into its own chunk can lead to fragmentation. Serving hundreds of tiny chunks (under 10 KB) degrades compression efficiency and increases the browser's module resolution overhead.

To mitigate this, group smaller, related packages into logical chunks.

### Categorical Grouping in Vite

In Vite, enhance the `manualChunks` function to categorize dependencies. Instead of returning the raw package name for every file, check if the package belongs to a specific category (like UI components or utilities) and return a shared chunk name. This bundles related libraries together while grouping the remaining tiny dependencies into a catch-all vendor chunk.

**TypeScript (vite.config.ts)**

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('lodash') || id.includes('date-fns')) {
              return 'vendor-utils';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
```

### `minSize` and Priority Groups in Webpack

Webpack natively prevents overly small chunks using the `minSize` property (which defaults to 20,000 bytes). If a chunk would be smaller than this limit, Webpack merges it back into the main bundle to preserve compression efficiency.

You can combine `minSize` with targeted `cacheGroups` using the `priority` field. This extracts specific heavyweight libraries into their own chunks while letting smaller libraries fall back into a unified vendor chunk.

**TypeScript (webpack.config.ts)**

```ts
import * as path from 'node:path';
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  entry: './src/index.ts',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      minSize: 20000,
      maxSize: 250000,
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
          priority: 20,
        },
        utilityVendor: {
          test: /[\\/]node_modules[\\/](lodash|date-fns)[\\/]/,
          name: 'vendor-utils',
          chunks: 'all',
          priority: 10,
        },
        defaultVendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: -10,
        },
      },
    },
  },
};

export default config;
```

## Configuring Cache Headers

While modern bundlers split and hash files efficiently, the web server (or CDN) must serve these files with the correct HTTP cache headers to realize any performance gains. Use the Cache-Control header to instruct the browser on how long to store each file type.

### Vendor Chunks

Vendor chunks contain stable, third-party code that rarely changes. Because bundlers append a unique content hash to the filename (for example, vendor-react.8f3a2b1c.js), you can cache these files aggressively.

Set the Cache-Control header to a long duration, typically one year, and mark the file as immutable. This tells the browser to never re-validate the file as long as it exists in the local cache.

```http
Cache-Control: public, max-age=31536000, immutable
```

### Hashed Content

Application code chunks (like app.9e4b1a2d.js) and imported assets (like hashed images or fonts) follow the exact same caching strategy as vendor chunks. Because the filename guarantees the content is unique, any modification generates a new file. Therefore, cache these files indefinitely.

```http
Cache-Control: public, max-age=31536000, immutable
```

### Unhashed Content

Some static assets must maintain a consistent URL without a hash. Examples include favicon.ico, robots.txt, manifest.json, or social sharing images. Because the URL does not change when the content updates, a long cache duration prevents users from receiving the updated asset.

For unhashed content, use a shorter max-age (such as one day) combined with the stale-while-revalidate directive. This allows the browser to serve the stale asset immediately while fetching the fresh version in the background.

```http
Cache-Control: public, max-age=86400, stale-while-revalidate=86400
```

### HTML Content

The primary HTML document (index.html) acts as the entry point for the entire application. It contains the references to the specific, hashed JavaScript and CSS files. If the browser caches the HTML file, users will load an outdated version of the application and never discover the newly hashed vendor or app chunks.

Never cache the HTML entry point aggressively. Instead, force the browser to validate the document with the server on every single visit using the no-cache directive. (Note: no-cache means "check with the server before using the cached copy," whereas no-store means "do not cache at all.")

```http
Cache-Control: no-cache
```

## Conclusion

Code splitting and vendoring remain critical strategies for optimizing web performance, even as network protocols have evolved. While HTTP/2 multiplexing eliminated the need to aggressively concatenate files to reduce network requests, bundling is still necessary to maximize compression efficiency and minimize browser parsing overhead.

By moving away from monolithic vendor bundles and adopting granular chunking strategies with tools like Vite and Webpack, you can strike the perfect balance. Coupling this strategy with strict cache headers ensures that your application leverages optimal cache invalidation, fast module resolution, and efficient network delivery, ultimately providing a faster, smoother experience for your users.
