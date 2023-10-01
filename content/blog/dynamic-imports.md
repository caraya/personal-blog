---
title: "Dynamic imports"
date: "2023-06-05"
---

Dynamic imports have been around for a while but it wasn't until recently that I started looking at the API since it seems to answer a question I've had for a while: How to lazy load Javascript modules at run time without making things unnecessarily difficult for me as a developer.

This post will explore one possible way to answer the question I originally asked. We will also look at the difference between the current, static, way to import modules and dynamic, function-like, imports, and some additional uses for the syntax.

## The way we've always done it

In most scripts you will see ES Modules import syntax:

```js
import _ from 'lodash';
import moment from 'moment';
```

These are called static imports. These imports will let us bring external modules into our programs but require that the entire module dependency tree is resolved before scripts will run.

Static module imports require a string as the name of the module to import (including path). Passing a function would not work.

So this won't work:

```js
import ... from getModuleName();
```

Because the dependency tree resolution requirement, you will not be able to use static imports once any of the modules in the module dependency tree has been downloaded.

We also cannot import modules conditionally or at run time. This won't work.

```js
if(...) {
  import ...;
}
```

We can't put import inside a block. All import statements must be at the top of the module file.

This code will also produce an error:

```js
{
  import ...; 
}
```

## The new way

The [import() syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), commonly called dynamic import, is a function-like expression that allows loading an ECMAScript module asynchronously and dynamically.

Unlike static imports, dynamic imports are only evaluated when needed, and can be used anywhere in the script.

**The import() call closely resembles a function call, but import itself is a keyword, not a function. It does not inherit from the function prototype object.**

So it should be possible to do something like this to load the script for page 1.

```js
if (pageID === "page1") {
  import('./data/module1.js')
}
```

Or conditionally load a module based on external functions

```js
let modulePath = prompt("Which module to load?");

import(modulePath)
  .then((obj) => {
    console.log('module loaded')
  })
  .catch(err => {
    console.error('module loading failed ', err.message)
  })
```

## Use cases

The two cases that come immediately to mind are lazy loading modules and loading different scripts based on the type of Javascript engine we're working with.

### Lazy loading modules and inserting content into the page

Rather than load unnecessary code for every page we can create smaller bundles that can be downloaded when needed using dynamic imports.

Given the following HTML:

```html
<ul>
  <li>
    <a href="#" data-text="dogs">Click here to insert text about dogs</a></li>
  <li>
    <a href="#" data-text="cats">Click here to insert text about cats</a></li>
  <li>
    <a href="#" data-text="birds">Click here to insert text about birds</a></li>
  <li>
    <a href="#" data-text="fish">Click here to insert text about fish</a></li>
  <li>
    <a href="#" data-text="horses">Click here to insert text about horses</a></li>
</ul>
```

The function below will do the following:

1. For each `a` element, add a click event listener
2. Inside the event listener load the module corresponding to the value of the `data-text` attribute concatenated with the string `-text`
3. Insert the value of the text export from the module into the existing paragraph element

We make our function into an IIFE (Immediately Invoked Function Expression) so that it will run as soon as it is loaded.

```js
(async function handleLinks() {
  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', async () => {
      const text = await import(`./lib/${link.dataset.text}-text.js`);
      document.querySelector('p').textContent = text.text;
    });
  });
})();
```

### Importing different modules for different environments

Node and the browser use the same language but in different ways. Browsers have global objects like window that are not presentin Node and other non-browser run times.

We can now use dynamic imports to run the appropriate code.

In the following example we test is `window` is undefined. If window is undefined we use `require` to load the module at `url` since we know we're working in Node. If `window` is defined then we run a dynamic import to fetch the code for browsers.

```js
async function loadCode(url) {
  if (window === undefined) {
    const module = require(url);
    return module;
  } else {
    const module = await import(url);
    return module;
  }
}
```

## Node.js notes

In Node 13.2.0 and later Dynamic Imports can be used in either CommonJS or ES module files, to import either CommonJS or ES module files

## Links and References

- [ES6 Modules in Depth](https://ponyfoo.com/articles/es6-modules-in-depth) — [Ponyfoo](https://ponyfoo.com/)
- [Dynamic Imports](https://v8.dev/features/dynamic-import) — v8.dev
