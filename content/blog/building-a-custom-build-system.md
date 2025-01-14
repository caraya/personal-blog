---
title: Building a custom build system
date: 2025-02-03
tags:
  - Build Systems
  - Javascript
  - Typescript
  - PostCSS
---

Rather than using a third-party build system we can create our own custom system tailored to our requirements. This allows us to have more control over the build process and customize it to our needs.

The following is the minimal set of required tasks:

* Watching for changed files using [Chokidar](https://www.npmjs.com/package/chokidar)
* Typescript
* Babel
* Bundling with [Rollup](https://rollupjs.org/)
* PostCSS

The post will discuss how to implement these tasks in a custom build system in w Node environment using Node 20.x, and how to enhance it further with additional tasks.

## Configuration files

Before we start writing the build script, we need to set up the configuration files for Rollup and PostCSS. Here are the configuration files for each tool.

The advantage of explicit configuration rather than accepting implict defaults is that it allows us to customize the build process to our requirements by adding processes and plugins as necessary.

### Rollup

I chose Rollup as my bundler for now. In the configuration we do two things: specify inputs, outputs and the type of module that we want to use (ESModules).

We also specify the plugins that we want to use. In this case, we use the following plugins:

* `rollup-plugin-typescript2` plugin to compile TypeScript files
* `@rollup/plugin-babel` plugin to transpile the output to JavaScript.

```js
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
  plugins: [
    typescript(),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.js', '.ts'],
      presets: ['@babel/preset-env'],
    }),
  ],
};
```

### PostCSS

The PostCSS configuration file specifies the plugins that we want to use. In this case, we use these plugins

* `autoprefixer` to add vendor prefixes to CSS properties
* `postcss-preset-env` to enable modern CSS features

One thing I chose to do that is not part of the default PostCSS configuration is to indicate the stage that I want to use for the preset-env plugin.

The stages represent levels of maturity in the CSS process and is roughly analogous to the TC-39 process for Javascript (without the stage 2.7 section). A good explanation can be found in [The Staging Process](https://cssdb.org/#the-staging-process)

```js
// postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env')({
      stage: 2, // Adjust the stage as needed
      features: {},
    }),
  ],
};
```

## Breaking down the script

I broke the script into several sections to make it easier to write about. The sections are:

* Importing modules and setting up paths
* A function to bundle with Rollup
* A function to process CSS with  PostCSS
* A function to watch for file changes using Chokidar
* A utility function to make child_process.exec work better with async/await
* A main functiont to parse command-line arguments

### Importing modules and setting up paths

```js
// Importing required modules
import chokidar from 'chokidar';
import { exec } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// Convert current module URL to file path for compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the paths for the source and distribution directories
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
```


### Utility function

The first function will promisify commands to make it easier to work with async/await. This function will return a promise that resolves when the command is successful and rejects when there is an error.

```js
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}
```

### Bundling with Rollup

Since we've put the configuration in a separate the file, we don't need to do much in the function itself.

We use `execPromise` to run the [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) task runner to execute the Rollup command with the `--config` flag to specify the configuration file we defined earlier.

```js
async function bundle() {
  console.log('Bundling with Rollup...');

	await execPromise('npx rollup --config').catch((err) => {
    console.error(`Rollup Error: ${err}`);
  });
}
```

### Processing PostCSS

The `processPostCSS` function is similar to the bundle function. It uses `execPromise` to run the PostCSS command with the source and output files as arguments.

It specified both the source and output paths as parameters for the `postcss` command.

```js
async function processPostCSS() {
  console.log('Processing PostCSS...');

  await execPromise(`npx postcss src/styles/main.css --output dist/main.css`).catch((err) => {
    console.error(`PostCSS Error: ${err}`);
  });
}
```

### Watching for file changes

The `watch` function watches for file changes in the source directory. It uses the [Chokidar](https://www.npmjs.com/package/chokidar) module to watch for changes in the source directory and triggers the appropriate build process based on the file extension. I chose to use Chokidar because it's more reliable than the Node built-in filesystem [watch](https://nodejs.org/api/fs.html#fswatchfilename-options-listener) native method.

We first run the `bundle` and `processPostCSS` functions to run the functions for the first time before starting to watch for file changes.

We use the file extension to determine what function to run:

* If the file is a TypeScript or JavaScript file, we run the `bundle` function
* If it's a CSS file, we run the `processPostCSS` function.

```js
function watch() {
  console.log('Starting initial build and watching for file changes...');

  bundle();
  processPostCSS();

  chokidar.watch(srcDir, { persistent: true }).on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);

    if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
      bundle();
    }

    if (filePath.endsWith('.css')) {
      processPostCSS();
    }
  });
}
```

### Parsing command-line arguments

The `main` function will parse the command-line arguments and run the appropriate function based on the command. If the command is not recognized, it will display an error message with the available commands.

We first use the `slice` method on the `argv` argument array to extract the command we want to run (the third argument in the `argv` array).

Then we use a [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) statement to run the appropriate function based on the command. If the command is not recognized, we fall back to the default statement and display an error message with the available commands.

We could use a third party library like [Commander.js](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) to handle command-line arguments, but for this simple script, we can use the built-in `process.argv` array.

Once the command has been processed then we call `main` again to initialize the script.

```js
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'bundle':
      await bundle();
      break;
    case 'processPostCSS':
      await processPostCSS();
      break;
    case 'watch':
      watch();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Available commands: bundle, processPostCSS, watch');
  }
}

// Run the main function
main();
```

This is a simple build script that can be expanded upon to include additional tasks and features as needed. By creating a custom build system, we have more control over the build process and can tailor it to our specific requirements.
