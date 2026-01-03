---
title: Revisiting Modules in Node.js
date: 2026-02-18
tags:
  - Javascript
  - Node.js
  - Modules
  - ESM
  - CommonJS
---

Working with modules in Node.js has evolved significantly. It used to be simple: CommonJS was the only game in town. With the introduction of ES Modules (ESM) and their stabilization in Node.js, developers now have powerful options—but also new complexity.

The flexibility comes with its own set of challenges for both module authors and consumers. In this post, we’ll explore the differences between CommonJS and ESM, discuss how to navigate interoperability, and provide practical examples for building hybrid packages.

## A Little Bit Of History

To understand the current landscape, we need to look back at how modules evolved in the Node.js ecosystem.

Ancient Times: No Modules
: When Javascript was first introduced, there was no module system. You either wrote code in a single file or used multiple &lt;script> tags.
: This approach quickly became unmanageable as websites grew into complex web applications.

CommonJS Modules
: When Node.js was released in 2009, the need for a standardized module system was apparent. Kevin Dangoor proposed the ServerJS specification (later CommonJS) to address this.
: CommonJS solved Node’s early challenges by introducing synchronous loading, caching, and scope isolation using require() and module.exports. It became the default for server-side JS, fueling the explosive growth of the npm ecosystem.

ES Modules (ESM)
: Introduced in ECMAScript 2015 (ES6), ESM is the official standardized module system for Javascript. It brought several modern advantages:
: - Static Structure: Enables static analysis and tree-shaking.
: - Asynchronous Loading: Improves performance.
: - Browser Compatibility: Natively supported in modern browsers, allowing code sharing between client and server.
: - Improved Syntax: Uses declarative import and export statements.

### The Timeline: ESM Arrives in Node.js

Bringing ESM to Node.js was a multi-year effort to ensure it didn't break the existing CommonJS ecosystem.

| Date | Version | Milestone | Status |
| :---: | :---: | --- | --- |
| Sep 2017 | v8.5.0 | First Implementation | ⚠️ Experimental<br><br>Required --experimental-modules flag.<br><br>Only supported .mjs. |
| Nov 2019 | v13.2.0 | Unflagged | ⚠️ Experimental<br><br>No flag needed.<br><br>Added support for "type": "module" in package.json. |
| May 2020 | v12.17.0 | Backporting | ⚠️ Experimental<br><br>Unflagged support backported to v12 LTS.|
| Aug 2020 | v14.8.0 | Top-Level Await | ⚠️ Experimental<br><br>Enabled without a flag. |
| Oct 2020 | v14.13.0 | Official Stability | ✅ Stable<br><br>The "ExperimentalWarning" was removed. |

## Key Differences Between CommonJS and ESM

**Syntax Comparison:**

| Feature | CommonJS (CJS) | ES Modules (ESM) |
| --- | --- | --- |
| Import | const fs = require('fs'); | import fs from 'node:fs'; |
| Export | module.exports = { fn }; | export const fn = ...;<br><br>export default ...; |
| Extension | .cjs (or .js by default) | .mjs (or .js with config) |
| Loading | Synchronous: Blocks execution until loaded. | Asynchronous: Loads modules in parallel. |

### Major Behavioral Differences

Asynchronous vs. Synchronous
: CommonJS loads modules synchronously, allowing you to dynamically require() files inside if-statements. ESM loads modules asynchronously; imports must be static and at the top level (unless using dynamic import()).

Top-Level Await
: ESM allows await at the top level of a module. CommonJS does not; you must wrap async code in an IIFE.

```js
// ESM (Allowed)
const response = await fetch('https://api.example.com');

// CommonJS (Error)
// Must be wrapped:
(async () => {
  const response = await fetch('https://api.example.com');
})();
```

Missing Globals in ESM
: CommonJS injects `__dirname` and `__filename` into every file. In ESM, these do not exist and must be recreated using import.meta.

```js
// CommonJS:
console.log(__dirname); // Works automatically

// ESM Workaround:
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

Strict Mode
: ESM is always in "Strict Mode" ('use strict'). CommonJS is "sloppy" by default unless you explicitly opt-in.

### Enabling ESM in Node.js

Node.js treats files as CommonJS by default. To use ESM, you must either
: - Rename your file from .js to .mjs.
: - Add "type": "module" to your package.json.

```json
{
  "name": "my-app",
  "type": "module"
}
```

!!! Note  **Note**
If you add `"type": "module"` to your package.json, all .js files in that project will be treated as ESM. You must rename any CommonJS files to .cjs.!!!

## Interoperability: Mixing CommonJS and ESM

Mixing the two systems can be tricky because ESM is async and CJS is sync. Before switching your project to ESM, audit your dependencies. If you rely heavily on legacy CommonJS-only libraries, you may face friction.

### Importing CommonJS into ESM

This generally works easily. You can import a CJS file, but be aware of the "Double Default" issue.The Issue: ESM cannot verify named exports from CJS files at build time.The Result: You usually only get the default export.

```js
// ❌ Named import might fail
import { foo } from 'cjs-lib';

// ✅ Default import works
import pkg from 'cjs-lib';
const { foo } = pkg;
```

### Importing ESM into CommonJS

This is version-specific.

- **Node.js 20.18 & Older**: You cannot use require() to load an ESM file. You must use dynamic imports:

    ```js(async () => {
      const myModule = await import('./my-module.mjs');
    })();
    ```

- **Node.js 22 (LTS) & 23+**: You can use require() to load synchronous ESM files.

```js
const myModule = require('./my-module.mjs');
```

The next table summarizes ESM support in Node.

| Node Version | Status | How to use |
| :---: | --- | --- |
| 23+ | Enabled by DefaultJust | require('./file.mjs') |
| 22 (LTS) | Experimental | May need --experimental-require-module. |
| 20.19 | Backported | require('./file.mjs') |
| 20.18 & Older | Not Supported | Use await import('./file.mjs'). |

!!! warning  Warning
require(esm) has two caveats:

- You can only require the default export.
- It will crash if the ESM module uses Top-Level Await.
!!!

## The createRequire() Bridge

Sometimes you are in an ESM file but need the behavior of require (e.g., to load JSON synchronously and dynamically). Since require is undefined in ESM, you must create it manually.

```js
// my-module.mjs
import { createRequire } from 'node:module';

// Create a require function relative to the current file's URL
const require = createRequire(import.meta.url);

// ✅ Dynamic AND Synchronous loading
const config = require(`./config/${userEnv}.json`);
```

## Building a Hybrid Module

If you are publishing a library to npm, you likely need to support both CommonJS (for legacy users) and ESM (for bundlers and modern Node). This requires a carefully configured package.json.

### Package.json Configuration

The exports field is the modern standard for defining entry points. It allows Conditional Exports &mdash; serving different files based on how the user imports your package.

```json
{
  "main": "dist/index.js",
  "module": "dist/index.mjs",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  }
}
```

### Detailed Breakdown

- "exports": If Node sees this, it ignores "main".
  - "types": **Must be first**. Tells Typescript where the definitions are.
  - "import": Served when the user uses import (ESM).
  - "require": Served when the user uses require() (CommonJS).
- "main" / "module" / "types" (Root level): These are fallback fields for older Node versions, legacy bundlers, and older Typescript versions that don't understand exports.

### Bundler Configuration (Rollup Example)

You need a build tool to generate these two distinct files (.js and .mjs) from your source code.

```js
// rollup.config.js
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true,
    },
  ],
};
```

### Bundling for the Browser

If your target is solely the browser, you only need to generate an ESM build. Browsers do not support CommonJS and support ESM natively.

```js
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.mjs',
      format: 'es',
      sourcemap: true,
    },
  ],
};
```

## Conclusion

Modules in Node.js have come a long way. With fully stable ESM support, developers now have powerful tools for structuring applications. While the need for hybrid CommonJS/ESM modules will eventually diminish, the vast legacy ecosystem means understanding both systems is an essential skill for the modern Node.js developer.
