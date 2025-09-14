---
title: Creating a Font Inspector
date: 2025-11-12
tags:
  - Fonts
  - Javascript
  - Node
---

When working with custom fonts, especially variable fonts, it can be tedious to manually extract font metrics and generate the necessary CSS `@font-face` rules. A script that automates this process can save time and reduce errors.

Rather than manually inspecting font files to extract their metrics and generate the appropriate CSS `@font-face` rules, we can automate this process with a Node.js script.

This post will cover one such possible implementation using the [opentype.js](https://www.npmjs.com/package/opentype.js?activeTab=readme) to read font files and extract their properties and the [wawoff2](https://www.npmjs.com/package/wawoff2) to handle WOFF2 decompression to work around a limitation in opentype.js.

## Why Create a Font Inspector?

I don't like repeating myself, especially when the task is not trivial. Inspecting fonts to extract their metrics and generate the necessary CSS `@font-face` rules can be tedious and error-prone if done manually. Automating this process ensures consistency and reduces the likelihood of mistakes.

Tools like this font inspector are both a learning tool an a productivity booster. It helps me understand how to read and interpret font files while also saving time when preparing to work with fonts in web projects.

### Features

The font inspector is designed to:

* Handle both static and variable fonts, adjusting CSS properties accordingly.
* Parse various font formats, including automatic WOFF2 decompression.
* Display key font metrics (UPM, ascender, descender, line gap, etc.).
* List available variable font axes (fvar table) and their ranges.
* Generate a single fonts.css file with @font-face rules for all processed fonts.

## Prerequisites

This is a Node application, so you'll need to have Node.js installed.

In addition, you'll need to initialize a new Node project and install the following dependencies:

* [opentype.js](https://www.npmjs.com/package/opentype.js)
* [wawoff2](https://www.npmjs.com/package/wawoff2)

The `wawoff2` needs a little explanation. The `opentype.js` library does not natively support WOFF2 files. To work around this limitation, we can use the `wawoff2` package to decompress WOFF2 files into a format that `opentype.js` can read, such as TTF (TrueType Font).

Other Brotli compression libraries require compilation of native code which will not work in all environments. The `wawoff2` package uses a WebAssembly (WASM) version of the WOFF2 library to perform the decompression, making it more portable and easier to use across different systems.

## The Code

I will break down the code into sections to better explain how it works.



```js
#!/usr/bin/env node

// Built-in modules
import fs from 'node:fs';
import path from 'node:path';
// Third-party modules
import opentype from 'opentype.js';
import { decompress } from 'wawoff2';
```

The `round` helper function rounds a number to a specific number of decimal places.

It takes a number as input and returns the rounded number using the built-in [Math.round](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round) function.

```js
const round = (num) => Math.round(num * 100) / 100;
```

The `processFontFile` function processes a single font file.

The function takes one parameter, the absolute path to the font file and returns a promise that resolves to the CSS rule string, or null on failure.


The function first checks if the path at the specified location exists. It it doesn't, it logs an error and returns null.

```js
async function processFontFile(fontPath) {
  if (!fs.existsSync(fontPath)) {
    console.error(`Error: File not found at ${fontPath}`);
    return null;
  }

  console.log(`Inspecting font: ${fontPath}`);
```

If the font is a WOFF2 file (ends with `.woff2`), it reads the file, decompresses it using `wawoff2`, and then parses the resulting TTF data with `opentype.js`.

If the font is in another format, the script loads it directly using `opentype.js`.

```js
  try {
    let font;
    const fileExtension = path.extname(fontPath).toLowerCase();

    if (fileExtension === '.woff2') {
      console.log('Detected .woff2 format, converting to TTF...');
      const woff2Buffer = fs.readFileSync(fontPath);
      const ttfBuffer = await decompress(woff2Buffer);
      const arrayBuffer = ttfBuffer.buffer.slice(
        ttfBuffer.byteOffset,
        ttfBuffer.byteOffset + ttfBuffer.byteLength
      );
      font = opentype.parse(arrayBuffer);
    } else {
      font = opentype.loadSync(fontPath);
		}
```

The following section prints out key font metrics such as units per em, ascender, descender, line gap, cap height, x-height, and bounding box to the console.

Some of the metrics are available in specific tables, so the code checks if those tables exist before trying to access their properties.

```js
    console.log('\nFont Metrics:');
    console.log('-------------');
    console.log(`- Units per Em: ${font.unitsPerEm}`);
    console.log(`- Ascender: ${font.ascender}`);
    console.log(`- Descender: ${font.descender}`);
    if (font.tables.hhea) console.log(`- Line Gap: ${font.tables.hhea.lineGap}`);
    if (font.tables.os2) {
      if (font.tables.os2.sCapHeight) console.log(`- Cap Height: ${font.tables.os2.sCapHeight}`);
      if (font.tables.os2.sxHeight) console.log(`- X-Height: ${font.tables.os2.sxHeight}`);
    }
    if (font.tables.head) {
        const { xMin, yMin, xMax, yMax } = font.tables.head;
        console.log(`- Bounding Box: (${xMin}, ${yMin}) to (${xMax}, ${yMax})`);
    }
```

If the `fvar` table exists and has one or more axes, then we're working with a variable font. The script lists all variable font axes, including their tags, ranges, and default values.

Static fonts will skip this section.

```js
    const isVariable = font.tables.fvar && font.tables.fvar.axes && font.tables.fvar.axes.length > 0;
    if (isVariable) {
      console.log('\nVariable Font Axes:');
      console.log('---------------------');
      font.tables.fvar.axes.forEach(axis => {
        console.log(`- Tag: '${axis.tag}', Range: ${round(axis.minValue)} to ${round(axis.maxValue)}, Default: ${round(axis.defaultValue)}`);
      });
    }
```

Now, we start building the strings for the CSS `@font-face` at-rule.

The family name is extracted from the appropriate name table, defaulting to 'Unknown' if not found.

We initialize variables for `font-weight`, `font-style`, and `font-variation-settings`.

```js
    if (font.tables.name && font.tables.os2 && font.tables.hhea) {
      const getEnglishName = (nameObject) => nameObject ? (nameObject.en || Object.values(nameObject)[0]) : 'Unknown';
      const fontFamily = getEnglishName(font.names.fontFamily);

      let fontWeight;
      let fontStyle;
      let fontVariationSettings = '';
```

Now we start building the CSS properties based on the type of font (variable or static) and the different tables in the font where the data may be found.

For example, variable fonts may have a range of weights in the `wght` axis, while static fonts will have a single weight value.

Same thing with `slnt` axis for slant/italic styles. Variable fonts can have a range of values, while static fonts will have a single style (normal or italic).

```js
      if (isVariable) {
        const weightAxis = font.tables.fvar.axes.find(axis => axis.tag === 'wght');
        fontWeight = weightAxis ? `${round(weightAxis.minValue)} ${round(weightAxis.maxValue)}` : font.tables.os2.usWeightClass;

        const slantAxis = font.tables.fvar.axes.find(axis => axis.tag === 'slnt');
        fontStyle = slantAxis ? `oblique ${round(slantAxis.minValue)}deg ${round(slantAxis.maxValue)}deg` : ((font.tables.os2.fsSelection & 1) ? 'italic' : 'normal');

				fontVariationSettings = font.tables.fvar.axes
          .map(axis => `'${axis.tag}' ${round(axis.defaultValue)}`)
          .join(', ');

      } else {
        // For static fonts, use single values.
        fontWeight = font.tables.os2.usWeightClass;
        fontStyle = (font.tables.os2.fsSelection & 1) ? 'italic' : 'normal';
      }
```

The override metrics (`ascent-override`, `descent-override` and `line-gap-override`) are calculated as percentages of the `units per em` value.

We round to two decimal places for cleaner output.

```js
      const ascentOverride = (font.ascender / font.unitsPerEm * 100).toFixed(2);
      const descentOverride = (Math.abs(font.descender) / font.unitsPerEm * 100).toFixed(2);
      const lineGapOverride = (font.tables.hhea.lineGap / font.unitsPerEm * 100).toFixed(2);
```



```js
      const cssProperties = [
        `  font-family: '${fontFamily}'`,
        `  src: url('${fontPath}')`,
        `  font-weight: ${fontWeight}`,
        `  font-style: ${fontStyle}`,
        `  font-display: swap`,
      ];

      if (fontVariationSettings) {
        cssProperties.push(`  font-variation-settings: ${fontVariationSettings}`);
      }

      cssProperties.push(`  ascent-override: ${ascentOverride}%`);
      cssProperties.push(`  descent-override: ${descentOverride}%`);
      cssProperties.push(`  line-gap-override: ${lineGapOverride}%`);

      // Join the properties into the final @font-face rule string.
      return `@font-face {\n${cssProperties.join(';\n')};\n}`;
    }
    return null; // Return null if required tables are missing.
```

```js
  } catch (err) {
    console.error(`\nError: Could not parse ${fontPath}. It might be corrupted or in an unsupported format.`);
    console.error(`Details: ${err.message}`);
    return null; // Return null on parsing failure.
  }
}
```

The `main` async function is the entry point of the script.

It checks if any file paths were provided as command-line arguments. If not, it prints an error message and usage instructions, then exits.

```js
async function main() {
  const fontPaths = process.argv.slice(2);

  // Check if any file paths were provided.
  if (fontPaths.length === 0) {
    console.error('Error: Please provide at least one path to a font file.');
    console.log('Usage: font-inspector /path/to/font1.woff2 /path/to/font2.ttf ...');
    process.exit(1);
  }
```

It loops through each font path provided as a command-line argument, process the font file, and collect the resulting CSS rules.

```js
  const allCssRules = [];

  // Loop through each provided font path and process it.
  for (const relativePath of fontPaths) {
    const absoluteFontPath = path.resolve(relativePath);
    const cssRule = await processFontFile(absoluteFontPath);
    if (cssRule) {
      allCssRules.push(cssRule);
    }
    // Add a separator for cleaner console output between fonts.
    console.log('\n' + '-'.repeat(50) + '\n');
  }
```

It combines all the generated CSS rules and writes them to a `fonts.css` file in the current working directory.

```js
  if (allCssRules.length > 0) {
    const combinedCss = allCssRules.join('\n\n');
    const outputCssPath = path.resolve(process.cwd(), 'fonts.css');
    fs.writeFileSync(outputCssPath, combinedCss);
    console.log(`All CSS @font-face rules have been saved to: ${outputCssPath}`);
  } else {
    console.log('No valid fonts were processed, so no CSS file was generated.');
  }
}
```

Finally, we call the `main` function to run the script.

```js
// Run the main function.
main();
```
