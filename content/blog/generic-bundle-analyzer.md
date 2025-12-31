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

If you are using other bundlers like Rollup, Vite, or Parcel, you need a different tool. I have been looking for a generic alternative that isn't tied to a specific ecosystem.

This post covers how to set up [Sonda](https://sonda.dev/), a generic bundle analyzer, and use it to analyze your JavaScript bundles with Vite and Rollup.

## What Is Sonda?

Sonda is a generic bundle analyzer that provides a detailed breakdown of your bundle's contents, including module sizes and dependencies. It supports multiple bundlers and integrates directly into your build process to generate reports automatically.

## Why It Matters

A bundle analyzer helps you visualize the contents of your bundled output files. This is critical for optimizing application performance, managing build size, and identifying inefficiencies. Key benefits include:

Identifying Large Dependencies
: Easily spot which libraries or modules occupy the most space in your final bundle. This helps you determine if a large dependency is truly necessary or if a smaller alternative could be used.

Optimizing Load Times
: Smaller bundle sizes lead to faster application load times. You can significantly improve user experience by identifying and removing unnecessary code (dead code elimination) or using techniques like code splitting and tree shaking.

Debugging Build Issues
: Understand why a build might be larger than expected or why certain modules are being included multiple times (duplication issues).

Visualizing Module Structure
: Analyzers provide an interactive map (usually a treemap) that breaks down the bundle into its constituent parts, showing the relative size of each file and its dependencies.

## How It Works

The workflow for Sonda depends on the bundler you are using. Below are the configurations for Vite and Rollup.

### Vite

This installation assumes you have an existing Vite project. If not, follow the [Vite Getting Started Guide](https://vitejs.dev/guide/) to create one.

#### 1. Install Sonda

Install Sonda as a development dependency:

```bash
npm install sonda --save-dev
```

#### 2. Configure Vite

Modify your Vite configuration file to include the Sonda plugin. Sonda requires source maps to be enabled to analyze the bundle effectively.

Note: Ensure Sonda is the first plugin in the plugins array for it to work correctly.

```typescript
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

Even though Vite is my preferred bundler, I still use Rollup for some older projects. Here is how to set up Sonda with Rollup.

#### 1. Install Dependencies

Install the Sonda package as a development dependency:

```bash
npm install sonda --save-dev
```

#### 2. Configure Rollup

Modify your Rollup configuration file. Like Vite, Rollup requires source maps enabled, and Sonda should be the first plugin in the list.

```typescript
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

### Configuration Options

Once set up, you can customize Sonda's behavior. For example, to prevent the report from opening automatically in the browser after a build, set the open option to false:

```typescript
Sonda({
  open: false
});
```

Here is a breakdown of the common configuration options I use most often. For a full list, check the configuration page.

enabled
: **Type**: boolean
: **Default**: true
: Specifies whether the plugin is active. This allows you to keep the configuration present but disable the plugin execution by setting this to false.

include
: **Type**: Array&lt;RegExp> | null
: **Default**: null
: A list of RegExp patterns matching output assets to include. By default, all assets are included. Patterns match against relative asset paths. For example, use [ `/\.js$/` ] to include only JavaScript files.

exclude
: **Type**: Array&lt;RegExp> | null
: **Default**: null
: A list of RegExp patterns matching output assets to exclude. Note that .map and .d.ts files are always excluded. This option takes precedence over include. For example, use [ `/\.css$/` ] to exclude all CSS files.

gzip
: **Type**: boolean
: **Default**: false
: Calculates asset sizes after GZIP compression. The report includes estimated compressed sizes for general reference. Enabling this may increase report generation time.

brotli
: **Type**: boolean
: **Default**: false
: Calculates asset sizes after Brotli compression. Like GZIP, these are estimates and may increase generation time.

The configuration I use most often looks like this:

```typescript
sonda({
  open: true,
  filename: "sondaReport[index].html",
  gzip: true,
  brotli: true
});
```

With this config, every project build adds a new report file (incremented by index) to the default `.sonda` folder. It will open the report in your default browser automatically after the build completes.

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
