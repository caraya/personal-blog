---
title: Converting CommonJS to ES Modules
date: 2024-12-30
tags:
  - Javascript
  - Modules
  - Common JS
  - ES Modules
---

Node.js has always supported Common.js as the module system.

When building a package we use `modules.export` to define the elements in the package that can be consumed by other modules:

```js
// file: myMath.js
function add(a, b) {
	return a + b;
}

modules.exports = add;
```

This is the traditional way of defining modules in Node.js:

```js
const add = require('myMath');
```

Ecmascript developed a module system as a standard way to import and export

When building a package we use `export` to define the elements in the package that can be consumed by other modules:

```js
function add(a, b) {
	return a + b;
}

modules.exports = add;
```

However, Node adopted the module specification from Ecmascript 2015 (ES6) in a gradual way.

ES Modules where first introduced as an experimental feature that required a flag in Node 8.5.0 (September 2017)

It spent a long time in the experimental phase and it wasn't until Node 21.2.0 (October 2021) that it was declared stable.

Defining the module in ES6, that would work in Node would look like this:

```js
// file: myMath.js

export function add(a, b) {
	return a + b;
}
```

And importing it would look like this:

```js
import { add } from 'myMath';
```

These two module systems are incompatible but whether you can import CommonJS modules into ESM code will depend on what version of Node.js you're using.

This post will describe some aspects of the conversion process and how to work with both module systems in the same codebase.

## Converting CommonJS to ES Modules

If you own the code that you're working with, the simplest way to change the syntax
for exports and imports.

Replace the import statement with the equivalent ESM import statement:

```js
// CJS
const add = require('myMath');

// ESM
import { add } from 'myMath';
```

Instead of the CommonJS export statementUse the ESM export statement in the function declaration:

```js
// MJS
import { add } from 'myMath';

// ESM
export function add(a, b) {
  return a + b;
}
```

If you’re using package.json, you’ll need to make a few adjustments to support ESM. We add a `type` field to the package.json file and set it to `module` and the `exports` field to indicate the entry point for the ESM package. The leading `./` in ESM is necessary as every reference has to use the full pathname, including directory and file extension.

```js
{
  "name": "my-project",
  "type": "module",
  "exports": "./index.js",
}
```

The `exports` declaration is a modern alternative to `main` in that it gives authors the ability to clearly define the public interface for their package by allowing multiple entry points, supporting conditional entry resolution between environments, and preventing other entry points outside of those defined in "exports".

```js
{
  "name": "my-project",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./other": "./other.js"
  }
}
```

Another way to tell Node to run the file in ESM is to use the `.mjs` file extension. This is great if you want to update a single file to ESM. But if your goal is to convert your entire code base, it’s easier to update the type in your package.json.

### Other changes

Since JavaScript inside an ESM will automatically run in strict mode, you can remove all instances of "use strict"; from your code base.

CommonJS also supported a handful of built-in globals that do not exist in ESM, such as `__dirname` and `__filename`.

This is what we would normally do to get the directory and file name:

```js
const __dirname = new URL(".", import.meta.url).pathname;

import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
```

Starting with Node 20.11 we can use the `import.meta` object to get the directory and file name:

```js
// Since Node 20.11.0
const __dirname = import.meta.dirname;
const __filename = import.meta.filename;
```

### Using file name extensions

Another way to tell Node to run the file in to use specific extensions for each type of file:

* If your file is an ESM module, use the `.mjs` file extension
* If your file is a CommonJS module, use the `.cjs` file extension.

If your goal is to convert your entire code base, it’s easier to update the `type` field in your package.json. However, if you're updating a few files, you can use the file extension to tell Node what type of modules they use.

## Importing ESM in CommonJS: Dynamic Imports

[Dynamic import()](https://v8.dev/features/dynamic-import) introduces a new function-like form of import that caters to additional use cases like the ones below:

* On-demand module import
* Conditional module import
* Compute the module specifier at runtime
* Import a module from within a regular script (as opposed to a module)

The function-like syntax, `import(moduleSpecifier)`, returns a promise for the requested module's namespace object, which is created after fetching, instantiating, and evaluating the module and all its dependencies.

Here’s how to dynamically import and use the `./utils.mjs` module:

```js
const moduleSpecifier = './utils.mjs';
import(moduleSpecifier)
  .then((module) => {
		// run the code in the module here
    module.default();
    module.doStuff();
  });
```

Because `import()` returns a promise, we can use `async/await` to write our code more concisely:

```js
(async () => {
  const moduleSpecifier = './utils.mjs';
  const module = await import(moduleSpecifier)
	// Run the code in the module here
  module.default();
  module.doStuff();
})();
```

!!! warning Warning
Although `import()` looks like a function call, it is specified as syntax that just happens to use parentheses (similar to `super()`). This means that `import` doesn’t inherit from `Function.prototype` so you can't use any of the function prototype's methods like `call`, `apply`, or `bind`.
!!!

## Mix and Match Imports

When working with ESM code you can use the import syntax for both ESM and CommonJS modules.

Using these two module definitions:

```js
// Module defined in CommonJS
// cjs.cjs
const name = "Darth Vader";
const ability = () => {
  return "Can drive spaceship";
};

module.exports = { name, ability };

// Module defined in ES 2015 module syntax
// esm.mjs
const name = "Messi";
const ability = () => {
  return "Can kick balls";
};

export default { name, ability };
export const extra = "He won the world cup";
```

You can import modules from both systems in the same file using the `import` statement.

```js
// importing esm in esm
import messi from "./esm.mjs";

console.log(messi.name, messi.ability());

// importing cjs in esm
import darthVader from "./cjs.cjs";

console.log(darthVader.name, darthVader.ability());
```

This solution will work with existing code in ESM codebases, making your code future proof when your dependencies are updated to ESM (with only renaming the file extension in the import statements and changing how you call the exported methods).

## Links and Resources

* [How to convert CommonJS to ESM](https://deno.com/blog/convert-cjs-to-esm)
* [Using ES modules in Node.js](https://blog.logrocket.com/es-modules-in-node-today/)
* [Announcing core Node.js support for ECMAScript modules](https://nodejs.medium.com/announcing-core-node-js-support-for-ecmascript-modules-c5d6dc29b663)
* [Node.js ESM API](https://nodejs.org/api/esm.html)
* [Dynamic import()](https://v8.dev/features/dynamic-import)
* [CommonJS and ESM modules interoperability in NodeJS](https://sliceofdev.com/posts/commonjs-and-esm-modules-interoperability-in-nodejs)
