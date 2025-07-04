---
title: Generating CSS variables from a JS file
date: 2025-05-26
tags:
  - Web
  - CSS
  - Javascript
  - Projects
---

I read Michelle Barker's [Creating CSS Theme Variables from a JS file](https://css-irl.info/creating-css-variables-from-a-js-file/) and thought it was a great idea. I wanted to try out a simpler version that would work as a command line tool.

This post will discuss how to create a command line tool that generates a CSS file with custom properties from a JS/TS module exporting a theme object.

## Rationale

Michelle's post is a great introduction to the topic, but rather than using it as a library or including the theme data on the same script file, I wanted to create a command line tool that would generate the CSS file from an external module file. This way, I can keep my theme data in an external file as a central point for managing styles and themes.

## The theme module

The `theme.js` module exports a default object whose structure can be nested to arbitrary depth. Each key represents a CSS custom-property name, and each value is the corresponding CSS value.

The current example only uses colors but you can extend it to include other properties (font sizes, spacing, etc.) as needed.

```typescript
const theme = {
  color: {
    brand: {
      primary: {
        DEFAULT: '#7B1FA2',
        light: '#BA68C8',
        dark: '#4A148C'
      },
      secondary: {
        DEFAULT: '#E91E63',
        light: '#F48FB1',
        dark: '#C2185B'
      }
    },
    data: {
      blue: '#40C4FF',
      turquoise: '#84FFFF',
      mint: '#64FFDA'
    }
  }
};

export default theme
```

## The command line tool

The command line tool performs the following steps:

1. Reads the theme module
2. Recursively maps the theme object into CSS custom-property declarations
3. Writes the CSS declarations to a file

I've deliberately kep the number of external dependencies to a minimum, even if it makes the code more verbose. The only external dependency is Commander for parsing command line arguments.

The first step is to import the required modules:

```typescript
import { writeFile } from 'fs/promises'
import { resolve } from 'path'
import { pathToFileURL } from 'url'
import { Command } from 'commander'
```

The `mapTheme` function recursively maps a theme entry into CSS custom-property declarations.

If the entry is a string, it converts it to a custom-property declaration. If the entry is an object, it recursively maps its entries into custom-property declarations.

```typescript
const mapTheme = ([key, value]: [string, any]): string[] => {
  if (typeof value === 'string') {
    return [`--${key}: ${value}`]
  }

  return Object.entries(value).flatMap(([nestedKey, nestedValue]) => {
    const newKey = nestedKey === 'DEFAULT' ? key : `${key}-${nestedKey}`
    return mapTheme([newKey, nestedValue])
  })
}
```

The `buildTheme` function takes two arguments: the input path to the theme module and the output path for the generated CSS file.

1. It uses [pathToFileURL](https://nodejs.org/api/url.html#urlpathtofileurlpath-options) to convert the input path to an absolute file URL. This is necessary because we are dynamically importing the module.
2. [Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) generates an array of key-value pairs from the theme object. The [flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap) method is used to flatten the resulting array of arrays into a single array
3. Creates the `:root` CSS rules with the array of custom-property declarations we created earlier
4. Writes the output to the specified file using [writeFile](https://nodejs.org/api/fs/promises.html#fs_fspromises_writefilefile-data-options)
5. Handles errors and logs them to the console

```typescript
async function buildTheme(inputPath: string, outputPath: string) {
  try {
		// 1
    const fileUrl = pathToFileURL(resolve(inputPath)).href
    const { default: theme } = await import(fileUrl)

		// 2
    const lines = Object.entries(theme).flatMap(mapTheme)
		// 3
    const content = [
      ':root {',
      ...lines.map((line) => `  ${line};`),
      '}',
      '',
    ].join('\n')

		// 4
    await writeFile(
			outputPath,
			content,
			{ encoding: 'utf-8' }
		)
    console.log(`\x1b[32m✔\x1b[0m CSS file written to ${outputPath}`)
  } catch (err: any) { // 5
    console.error(`\x1b[31m✖\x1b[0m Error: ${err.message}`)
    process.exit(1)
  }
}
```

The last block uses Commander to parse command line arguments and execute the `buildTheme` function with the provided input and output paths.

It first creates a new `Command` instance, sets the name, description, and version of the command line tool, and then defines two positional arguments: `<input>` and `<output>`. The `action` method is used to specify the function to be called when the command is executed.

```typescript
const program = new Command()

program
  .name('theme-generator')
  .description('Generate a CSS custom-properties file from a theme module')
  .version('0.1.0')
  .argument('<input>', 'path to the theme JS/TS module')
  .argument('<output>', 'path to write the generated CSS file')
  .action((input, output) => {
    buildTheme(input, output)
  })

program.parse(process.argv)
```

## Conclusion

With this command line tool you can generate CSS custom properties from a Javascript module exporting a theme object.

Running the script against the `theme.js` module will generate a CSS file with the following content:

```css
:root {
  --color-brand-primary: #7B1FA2;
  --color-brand-primary-light: #BA68C8;
  --color-brand-primary-dark: #4A148C;
  --color-brand-secondary: #E91E63;
  --color-brand-secondary-light: #F48FB1;
  --color-brand-secondary-dark: #C2185B;
  --color-data-blue: #40C4FF;
  --color-data-turquoise: #84FFFF;
  --color-data-mint: #64FFDA;
}
```

Since we don't validate the values in the theme object, you can use any value for the custom properties. Browsers will ignore values they don't understand, so you can use any value.

A more ambitious project would be to convert the theme object into variables defined with the `@property` rule. This would allow you to use the custom properties in a more dynamic way, but it would require a more complex implementation since the properties would now require a valid syntax, specify if they inherit and a default value.

The code is available on [GitHub](https://github.com/caraya/theme-generator) and in the [npm registry](https://www.npmjs.com/package/@elrond25/theme-generator).
