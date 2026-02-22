---
title: "globalThis in JavaScript"
date: 2026-03-13
tags:
  - Javascript
  - Web Development
---

globalThis is a universal accessor for the global object in JavaScript. It provides a reliable, standard way to access global variables and functions regardless of the environment executing the code.

## **What it is and what it does**

Before globalThis, the global object had different names depending on the runtime environment. Code designed to run in multiple environments (like isomorphic libraries or cross-platform utilities) required complex workarounds to find the global object. globalThis standardizes this reference.

When you call globalThis, it points directly to the environment's global scope. If you assign a property to it, that property becomes available globally.

## **What it replaces**

globalThis does not strictly deprecate older global references, but it replaces the need to write environment-checking fallback logic. It unifies the following environment-specific global objects:

| Environment | Legacy Global Object Reference |
| :---- | :---- |
| **Web Browsers** | window, frames, self |
| **Web Workers** | self |
| **Node.js** | global |
| **Standalone JavaScript** | this (Note: this evaluates to undefined inside strict-mode functions, making it unreliable as a fallback.) |

### **window, frames, and self explained**

In browser environments, developers historically juggled three separate references, which often caused confusion:

* **window:** The standard global object in a browser's main thread. It represents the browser window or tab containing the DOM document.
* **frames:** A property of the window that returns the window itself (window === frames). Originally designed to help developers navigate &lt;frameset\> and &lt;iframe\> elements, using it as a primary global object reference is an outdated convention.
* **self:** In a standard browser window, self points directly to the window object (window === self). However, its primary value lies in **Web Workers**. Because Web Workers run in a background thread without access to the DOM, they do not have a window object. Instead, they use self (specifically, the WorkerGlobalScope) to reference their global context.

Historically, developers used verbose patterns like this to find the global object safely across all these contexts:

```js
// JavaScript - The legacy workaround
const getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('Unable to locate global object');
};

const myGlobal = getGlobal();
```

With globalThis, that entire block of code reduces to a single, native keyword.

## Cross-environment compatibility

globalThis works consistently across modern JavaScript environments. Introduced in ECMAScript 2020 (ES11), it is supported natively in:

* **Browsers:** Chrome 71+, Firefox 65+, Safari 12.1+, Edge 79+
* **Server/Runtimes:** Node.js (v12.0.0+), Deno, Bun
* **Workers:** Web Workers, Service Workers

## Interaction with strict mode and ES modules

Historically, developers often relied on the this keyword at the global scope to access the global object. However, strict mode and ES modules (ESM) intentionally alter this behavior to prevent accidental global variable creation and promote safer scoping.

In a standard, non-strict script, the top-level this refers to the global object. But when you enable strict mode ("use strict";) or run your code as an ES module (using &lt;script type="module"&gt; in the browser or `type: "module"` in Node.js), the top-level this evaluates to undefined.

globalThis resolves this inconsistency. It completely bypasses the execution context's this binding and provides a guaranteed reference to the global object, regardless of strict mode or the module system.

```js
// JavaScript - ES Module or Strict Mode context
"use strict";

console.log(this); // Outputs: undefined
console.log(globalThis); // Outputs: the global object (e.g., Window or global)

// Attempting to set a global variable using legacy patterns
try {
  this.myVar = 'Hello'; // Throws TypeError: Cannot set properties of undefined
} catch (e) {
  console.error(e.message);
}

// Safely setting a global variable
globalThis.mySafeVar = 'Hello'; // Succeeds
console.log(globalThis.mySafeVar); // Outputs: 'Hello'
```

## Limitations of globalThis

While globalThis provides a unified reference to the global object, it does have a few limitations and contextual behaviors you should keep in mind:

* **Realm-specific scope:** globalThis points to the global object of the current JavaScript realm. If you execute code inside an &lt;iframe&gt;, globalThis refers to the iframe's window object, not the parent document's window. Similarly, in a Web Worker, globalThis refers only to the worker's isolated scope.
* **Security restrictions apply:** globalThis does not bypass Content Security Policy (CSP) rules or other security sandbox mechanisms.
* **Frozen global objects:** In secure environments—such as Secure ECMAScript (SES) or certain runtime compartments—where the environment freezes the global object using Object.freeze(), you cannot assign new properties to globalThis. Attempts to do so will fail silently or throw a TypeError in strict mode.

## Polyfilling globalThis for legacy systems

If you must support older environments like Internet Explorer 11 or legacy versions of Node.js, you need to polyfill globalThis.

Because modern bundlers often enforce strict mode (where this is undefined at the module level), and Content Security Policy (CSP) rules often block the Function('return this')() workaround, you must use a robust fallback chain to accurately identify the global object and attach globalThis to it.

Creating a completely robust polyfill for globalThis in legacy browsers that enforce strict Content Security Policy (CSP) is notoriously difficult. The common Function('return this')() fallback violates unsafe-eval CSP rules. The browser treats the Function constructor like eval() because it evaluates a string into executable code at runtime. Strict CSPs block these "string-to-code" methods by default to prevent Cross-Site Scripting (XSS) attacks.

### JavaScript polyfill

Include this code at the very beginning of your application entry point:

```js
// JavaScript
(function() {
  // Exit early if the environment already supports globalThis
  if (typeof globalThis !== 'undefined') return;

  // Attempt to locate the global object safely
  var getGlobalObject = function() {
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;

    // Fallback for non-strict mode environments
    return this;
  };

  var globalObj = getGlobalObject();

  // Attach globalThis to the global object
  if (globalObj) {
    globalObj.globalThis = globalObj;
  } else {
    throw new Error('Unable to locate the global object to polyfill globalThis.');
  }
})();
```

### TypeScript configuration

In TypeScript, you do not write a separate polyfill script. Instead, you include the JavaScript polyfill in your build process, but you must tell the TypeScript compiler that globalThis exists.

To do this, update your tsconfig.json to target ECMAScript 2020 or higher, or explicitly include ES2020 in your lib array:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5", // You can still compile down to ES5 for IE11
    "lib": [
      "DOM",
      "ES5",
      "ScriptHost",
      "ES2020" // Tells TS that globalThis and other ES2020 features exist
    ]
  }
}
```

## Code examples

Here is how you interact with globalThis securely once it is available natively or polyfilled.

### JavaScript

```js
// JavaScript
// Set a configuration flag on the global object
globalThis.appConfig = {
  theme: 'dark',
  debugMode: true
};

function readConfig() {
  // Access the global variable directly
  if (globalThis.appConfig.debugMode) {
    console.log('Running in debug mode.');
  }
}

readConfig();
```

### TypeScript

In TypeScript, you must declare the properties you intend to add to the global scope to ensure the compiler recognizes them and maintains type safety.

```ts
// TypeScript
// Define the shape of your global property
interface AppConfig {
  theme: string;
  debugMode: boolean;
}

// Augment the global scope (must use 'var' in TS for globals)
declare global {
  var appConfig: AppConfig;
}

// Set the variable
globalThis.appConfig = {
  theme: 'dark',
  debugMode: true
};

function readConfigTS(): void {
  if (globalThis.appConfig.debugMode) {
    console.log('Running in debug mode.');
  }
}

readConfigTS();
```
