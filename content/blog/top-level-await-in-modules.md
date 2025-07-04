---
title: Top-level Await in Modules
date: 2028-08-04
tags:
  - Javascript
  - Typescript
  - Await
  - Modules
---

Top-level await in Javascript allows developers to use the await keyword at the top level of a module, outside of an async function. This simplifies code by enabling modules to act as if they are large async functions, making it easier to work with asynchronous operations like fetching data, connecting to databases, or initializing dependencies.

## How Top-Level await Works in Javascript

Before top-level await, if you needed to perform an asynchronous operation within a module's initial execution, you had to wrap it in an async [immediately invoked function expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE), or use promise chaining with `.then()`. This could make the code more complex, especially when other parts of the module depended on the result of the asynchronous operation.

```js
(async () => {
  const result = await fetchData();
})();
```

With top-level await, you can directly await a promise in the main scope of a module. This pauses the execution of the current module and all parent modules that import it until the awaited promise is resolved. This ensures that modules that depend on the asynchronously loaded resource can reliably access it after the import is complete.

When a module uses top-level await, it effectively becomes an "async" module. If another module imports this async module, the execution of the importing module is paused until the async module and all its dependencies are fully loaded and the top-level await expressions are resolved.

Here's how you might fetch data and export it using top-level await in Javascript:

```js
// data.js
const response = await fetch('https://api.example.com/data');
const data = await response.json();

export default data;
```

You can then import this data in another module:

```js
// main.js
import myData from './data.js';

console.log(myData);
```

In this example, `main.js` execution will pause until the fetch request in `data.js` is complete and the response is parsed.

## Differences in Typescript

There are no fundamental differences in how top-level await works in Typescript compared to Javascript. The primary distinction is Typescript's configuration and type-checking.

To use top-level await in Typescript, you must set the following in your `tsconfig.json` file:

* "target": Must be "es2017" or newer.
* "module": Must be "esnext" or "system".

These settings ensure that Typescript outputs code that is compatible with environments that support top-level await.

The Typescript code for the same data fetching example is very similar, with the added benefit of type safety.

```ts
// data.ts
interface MyData {
  id: number;
  name: string;
}

const response = await fetch('https://api.example.com/data');
const data: MyData = await response.json();

export default data;
```

And the corresponding import:

```ts
// main.ts
import myData from './data.js'; // Note the .js extension for module imports

console.log(myData.name);
```

The functionality is identical to the Javascript example, but Typescript provides compile-time type checking for myData, preventing potential runtime errors.

## Top-level await and Dynamic imports

Top-level await works seamlessly with [dynamic import()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import), allowing you to conditionally load modules based on asynchronous logic. Since dynamic import() itself returns a promise, you can use await to wait for the module to be loaded and then access its exports.

This combination is powerful for scenarios like:

* **Conditional Loading**: Loading a module only if a certain asynchronous condition is met.
* **Lazy Loading**: Deferring the loading of a heavy module until it's actually needed, improving initial application load times.
* **Dependency-based Loading**: Loading a module whose path or name is determined by an asynchronous operation.

Here’s an example in Javascript where a module is dynamically imported based on the result of an asynchronous operation.

```js

async function getFeature() {
  console.log("Determining which feature to load...");
  // wait 1 second and then load the feature
	await new Promise(resolve => setTimeout(resolve, 1000));
  return 'feature-a';
}

const featureName = await getFeature();

const { default: feature } = await import(`./${featureName}.js`);

feature.initialize();
```

Then the code for the feature module could look like this:

```js
// feature-a.js
export default {
  initialize: () => console.log('Feature A has been initialized! 🚀')
};
```

In this setup, `feature-loader.js` first awaits the result of `getFeature()`. Only after that promise resolves does it proceed to dynamically import() the relevant module.

The functionality in Typescript is identical, with the added benefit of type safety. You can define an interface for the module you expect to import to ensure its shape is correct.

```ts
// feature.ts
export interface Feature {
  initialize: () => void;
}

// feature-b.ts
import type { Feature } from './feature';

const featureB: Feature = {
  initialize: () => console.log('Feature B has been initialized! 🚀')
};

export default featureB;
```

Then we import the selected feature (`feature-b`) dynamically in the main module:

```ts

// main.ts
import type { Feature } from './feature';

async function selectFeature(): Promise<string> {
  console.log("Selecting which feature to load...");
  await new Promise(resolve => setTimeout(resolve, 1000));
  return 'feature-b';
}

const featureName = await selectFeature(); // Top-level await

// Dynamically import the module
const module = await import(`./${featureName}.ts`);
const feature: Feature = module.default;

feature.initialize();
```

By using the `Feature` interface, Typescript can verify that the dynamically imported module's default export conforms to the expected structure, providing compile-time safety.
