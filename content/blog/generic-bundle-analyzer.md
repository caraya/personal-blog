---
title: Generic Bundle Analyzer
date: 2026-03-02
tags:
  - Javascript
  - Node.js
  - Web Development
  - Tools
  - Bundle Analysis
---

Webpack and other bundlers often produce large JavaScript bundles that can negatively impact web application performance. While [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) offers a visual way to analyze bundle contents and identify optimization opportunities, it is—as the name implies—Webpack-specific.

Developers using other bundlers like Rollup, Vite, or Parcel require a different tool. This post covers how to set up [Sonda](https://sonda.dev/), a generic bundle analyzer, and use it to analyze JavaScript bundles within Vite and Rollup projects.

## What is Sonda?

Sonda is a generic bundle analyzer that provides a detailed breakdown of a bundle's contents, including module sizes and dependencies. It supports multiple bundlers and integrates directly into the build process to generate reports automatically.

## Why bundle analysis matters

A bundle analyzer helps visualize the contents of bundled output files. This is critical for optimizing application performance, managing build size, and identifying inefficiencies. Key benefits include:

* **Identifying large dependencies**: Easily spot which libraries or modules occupy the most space in the final bundle. This helps determine if a large dependency is truly necessary or if a smaller alternative exists.
* **Optimizing load times**: Smaller bundle sizes lead to faster application load times. Developers can significantly improve the user experience by identifying and removing unnecessary code (dead code elimination) or using techniques like code splitting and tree shaking.
* **Debugging build issues**: Understand why a build might be larger than expected or why certain modules are being included multiple times (duplication issues).
* **Visualizing module structure**: Analyzers provide an interactive map (usually a treemap) that breaks down the bundle into its constituent parts, showing the relative size of each file and its dependencies.

## How it works

The workflow for Sonda depends on the bundler running the project. Below are the configurations for Vite and Rollup.

### Vite

This installation assumes an existing Vite project. If starting from scratch, follow the Vite Getting Started Guide to create one.

#### Install Sonda

Install Sonda as a development dependency:

```bash
npm install sonda --save-dev
```

#### Configure Vite

Modify the Vite configuration file to include the Sonda plugin. Sonda requires source maps to be enabled to analyze the bundle effectively.

Note: Ensure Sonda is the first plugin in the plugins array to guarantee it hooks into the build pipeline correctly.

**TypeScript (vite.config.ts)**

```ts
import { defineConfig } from 'vite';
import Sonda from 'sonda/vite';

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    Sonda()
		// add other plugins here
  ]
});
```

**JavaScript (vite.config.js)**

```js
import { defineConfig } from 'vite';
import Sonda from 'sonda/vite';

export default defineConfig({
  build: {
    sourcemap: true
  },
  plugins: [
    Sonda()
  ]
});
```

### Rollup

For legacy projects or specific use cases that rely directly on Rollup, follow these setup steps.

#### Install dependencies

Install the Sonda package as a development dependency:

```bash
npm install sonda --save-dev
```

#### Configure Rollup

Modify the Rollup configuration file. Like Vite, Rollup requires source maps to be enabled, and Sonda must be the first plugin in the list.

**TypeScript (rollup.config.ts)**

```ts
import { defineConfig } from 'rollup';
import Sonda from 'sonda/rollup';

export default defineConfig({
  output: {
    sourcemap: true
  },
  plugins: [
    Sonda()
  ]
});
```

**JavaScript (rollup.config.js)**

```js
import { defineConfig } from 'rollup';
import Sonda from 'sonda/rollup';

export default defineConfig({
  output: {
    sourcemap: true
  },
  plugins: [
    Sonda()
  ]
});
```

### Configuration options

Once set up, developers can customize Sonda's behavior by passing an options object. For example, to prevent the report from opening automatically in the browser after a build, set the open option to false.

TypeScript / JavaScript

```ts
Sonda({
  open: false
});
```

Here is a breakdown of the most common configuration options. For a comprehensive list, consult the official Sonda documentation.

enabled
: **Type**: boolean
: **Default**: true
: Specifies whether the plugin is active. This allows developers to keep the configuration present in the file but disable the plugin's execution by setting this to false.

include
: **Type**: Array<RegExp> | null
: **Default**: null
: A list of RegExp patterns matching output assets to include. By default, all assets are included. Patterns match against relative asset paths. For example, use [ /\.js$/ ] to include only JavaScript files.

exclude
: **Type**: Array<RegExp> | null
: **Default**: null
: A list of RegExp patterns matching output assets to exclude. Note that .map and .d.ts files are always excluded by default. This option takes precedence over include. For example, use [ /\.css$/ ] to exclude all CSS files.

gzip
: **Type**: boolean
: **Default**: false
: Calculates asset sizes after GZIP compression. The report includes estimated compressed sizes for general reference. Enabling this may increase report generation time.

brotli
: **Type**: boolean
: **Default**: false
: Calculates asset sizes after Brotli compression. Like GZIP, these are estimates and may increase generation time.

A standard, robust configuration looks like this:

TypeScript / JavaScript

```ts
Sonda({
  open: true,
  filename: "sondaReport[index].html",
  gzip: true,
  brotli: true
});
```

With this configuration, every project build adds a new report file (incremented by index) to the default .sonda output folder. The build process automatically opens the generated report in the default browser upon completion.

## Looking At The Output

After running your build command, Sonda generates a report file (e.g., sondaReport0.html) in the output directory.

The initial view provides a high-level overview of the bundle, breaking down component types and sizes.

![Sonda base report](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda01?_a=BAMAK+Dh0 "Initial view of Sonda report")

Figure 2 shows the input section, detailing the various modules and files included in the bundle.

![Sonda input report](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda02?_a=BAMAK+Dh0 "Sonda report showing inputs details")

Figure 3 highlights external dependencies, allowing you to quickly audit third-party libraries.

![Sonda external dependency](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda03?_a=BAMAK+Dh0 "Sonda report showing External dependency")

Figure 4 compares the uncompressed bundle size against GZIP and Brotli compression, providing estimated load times for each method.

![Sonda compression comparison](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda04?_a=BAMAK+Dh0 "Sonda report showing comprison between uncompressed, gzip and brotli compression")

Figure 5 shows the compression selection menu. This allows you to toggle the visualization based on your preferred compression technique.

![Sonda treemap compression selection](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda05?_a=BAMAK+Dh0 "Compression selection menu")

Figure 6 displays the treemap view—a visual representation of module sizes and their relationships within the bundle.

![Sonda treemap view](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda06?_a=BAMAK+Dh0 "Sonda build treemap view")

Figure 7 provides a detailed view of a specific module within the treemap, letting you drill down to understand individual contributions to the overall bundle size.

![Sonda treemap detail](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/sonda07?_a=BAMAK+Dh0 "Sonda treemap detail viewx")
