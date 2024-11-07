---
title: Using Module Exports to Organize Your Code
date: 2024-11-11
tags:
  - Javascript
  - Modules
  - Exports
---

Most of the time I work with ES Modules as a consumer, only using the import side of the equation.

However there is another side to modules when working in creating reusable code libraries.

This post will cover module exports, the different elements we can export and why they are important.

## What are exports?

The export declaration is used to export values from a JavaScript module. Exported values can then be imported into other programs with the import declaration or dynamic import. The value of an imported binding is subject to change in the module that exports it — when a module updates the value of a binding that it exports, the update will be visible in its imported value.

In order to use the export declaration in a source file, the file must be interpreted by the runtime as a module. In HTML, this is done by adding `type="module"` to the script tag, or by being imported by another module. Modules are automatically interpreted in strict mode.

Every module can have two different types of export, *named *export** and *default export*. You can have multiple named exports per module but only one default export. Each type corresponds to one of the above syntax.

After the export keyword, you can use:

* let
* const
* var
* function
* class

You can also export the items you want after they've been defined elsewhere using this syntax:

```js
const name1 = "foo";
const name2 = "bar";

export { name1, name2 }
```

!!! warning **Warning**
`export {}` does not export an empty object &ndash; it's a no-op declaration that exports nothing (an empty name list).
!!!

## Types of Exports

Every module can have two different types of exports: `named` and `default`.

You can have multiple named exports per module but only one default export.

### Named Exports

Named exports are useful when you need to export several values. When importing this module, named exports must be referred to by the exact same name (optionally renaming it with as)

```js
// export individual features
export let myVariable = Math.sqrt(2);
export function myFunction() {
  // …
}
```

Export declarations are not subject to [temporal dead zone](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz) rules. You can declare that the module exports X before the name X itself is declared.

```js
export { myFunction2, myVariable2 };

const myVariable2 = Math.sqrt(9);
function myfunction2() {
	/* function definition goes here */
}
```

You can also rename named exports to avoid naming conflicts when functions use common names.

```js
export { myFunction as function1, myVariable as variable };
```

You can rename a name to something that's not a [valid identifier](https://developer.mozilla.org/en-US/docs/Glossary/Identifier) by using a string literal enclosed in quotation marks (single or double).

```js
export { myFunction as "my-function" };
```

### Default Export

You can use a default export to indicate the item you're exporting is the default item others can consume from your module.

```js
// This is equivalent to:
export default myFunction;
```

This means that when you import from that module, you can use the import without curly braces (`{}`). You can give it any name during the import, making it more convenient to use.

### Aggregating Modules

A module can also "relay" values exported from other modules without writing separate `import/export` statements. This is often useful when creating a single module concentrating various exports from various modules.

This can be achieved with the `export from` syntax.

```js
export { default as function1, function2 } from "bar.js";
```

This is equivalent to a combination of import and export, except that `function1` and `function2` do not become available inside the current module.

```js
import { default as function1, function2 } from "bar.js";
export { function1, function2 };
```

See [Re-exporting / Aggregating](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#re-exporting_aggregating) in the MDN `export` article for more information.

## Why this matters?

The main reason why these exports are useful is performance.

Tools like Rollup, Webpack or ESBuild will leverage exports and imports to [tree shake](https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking) eliminate "dead" code for the final bundle.

When we load a script using the `script` element we load all the code in the module regardless of whether it's used in the page it's loaded into.

Using this as our utilities script:

```js
// demo01.js
function add(...numbers) {
  let total = 0;
  for (const theNumber of numbers) {
    total += theNumber;
  }
  return total;
}

function mult(...numbers) {
  let total = 0;
  for (const theNumber of numbers) {
    total *= theNumber;
  }
  return total;
}

function substract(arg1, arg2) {
  let total = 0;
  total = arg1 - arg2;
  return total;
}

function division(arg1, arg2) {
  let total = 0;
  if (arg2 > 0) {
    total = arg1 / arg2;
  }
  return total;
}
```

For example, if we were to load this script in a page using the `script` tag, all functions would be loaded, whether they were used or not since there is no way to specify what elements to bundle together.

```html
<script src="demo01.js"></script>
```

However, if we used named exports in the module, we can choose what imports to use. We change the function definition by prepending `export` to each function that we want to make publically available.

```js
export function add(...numbers) {
  let total = 0;
  for (const theNumber of numbers) {
    total += theNumber;
  }
  return total;
}

export function mult(...numbers) {
  let total = 0;
  for (const theNumber of numbers) {
    total *= theNumber;
  }
  return total;

}

export function substract(arg1, arg2) {
  let total = 0;
  total = arg1 - arg2;
  return total;
}

export function division(arg1, arg2) {
  let total = 0;
  if (arg2 > 0) {
    total = arg1 / arg2;
  }
  return total;
}
```

When importing specific elements of a module we can specify the items we want to use.

```js
import {add} from "./math2"

console.log(add(2, 6, 88));
```

The bundle file will produce an optimized file with only the functions that are used in the importing file.

When using this command, Rollup will only include the specified functions into the final bundle.

```bash
rollup main1.mjs --file bundle.js --format esm
```

This is the product of the bundle we created.

```js
function add(...numbers) {
  let total = 0;
  for (const theNumber of numbers) {
    total += theNumber;
  }
  return total;
}

console.log(add(2, 6, 88));
```

Module exports doesn't mean you shouldn't be careful when designing your module's API. You still need choose what parts of the module are exported.

## Links and Resources

* [export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) &mdash; MDN
* [Smaller JavaScript Using Module Exports](https://caolan.uk/notes/2023-08-02_smaller_javascript_using_module_exports.cm)
* [What's the Difference Between Default and Named Exports in JavaScript?](https://www.freecodecamp.org/news/difference-between-default-and-named-exports-in-javascript/)
* Bundlers
  * [Rollup.js](https://rollupjs.org/)
  * [ESBuild](https://esbuild.github.io/getting-started/)
