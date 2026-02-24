---
title: "globalThis in JavaScript"
date: 2026-03-13
tags:
  - Javascript
  - Web Development
---

globalThis is a universal accessor for the global object in JavaScript. It provides a reliable, standard way to access global variables and functions regardless of the environment executing the code.

This post explains the purpose of globalThis, how it unifies access to the global scope across different JavaScript environments, and how to use it effectively in JavaScript and TypeScript projects. It also covers polyfilling globalThis for legacy environments.

## Purpose and Functionality

Before globalThis, the global object had different names depending on the runtime environment. Code designed to run in multiple environments—such as isomorphic libraries or cross-platform utilities—required complex workarounds to find the global object. globalThis standardizes this reference.

When you call globalThis, it points directly to the environment's global scope. Properties assigned to it become available globally.

## Legacy Global References

globalThis does not deprecate older global references, but it eliminates the need for environment-checking fallback logic. It unifies the following environment-specific global objects:

| Environment | Legacy Global Object Reference |
| :---: | --- | --- |
| Web Browsers | `window`, `frames`, `self` |
| Web Workers | self |
| Node.js | global |
| Standalone JavaScript | this (Note: this is undefined in strict-mode functions) |

### Browser References: window, frames, and self

In browser environments, developers historically used three separate references:

* **window**: The standard global object in a browser's main thread. It represents the browser window or tab containing the DOM document.
* **frames**: A property of the window that returns the window itself (window === frames).
* **self**: In a standard browser window, self points to the window object. In **Web Workers**, which lack access to the DOM and the window object, developers use self (specifically WorkerGlobalScope) to reference the global context.

Historically, developers used the following pattern to find the global object safely across these contexts:

```ts
// The legacy workaround
const getGlobal = function () {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('Unable to locate global object');
};

const myGlobal = getGlobal();
```

With globalThis, a single native keyword replaces this entire block of code.

Cross-Environment CompatibilityIntroduced in ECMAScript 2020 (ES11), globalThis works consistently across modern JavaScript environments:

* **Browsers**: Chrome 71+, Firefox 65+, Safari 12.1+, Edge 79+
* **Server/Runtimes**: Node.js (v12.0.0+), Deno, Bun
* **Workers**: Web Workers, Service Workers

## Strict Mode and ES Modules

Historically, developers relied on the this keyword at the global scope to access the global object. However, strict mode and ES modules (ESM) alter this behavior to prevent accidental global variable creation.

In a standard script, the top-level this refers to the global object. In strict mode ("use strict";) or inside an ES module, the top-level this evaluates to undefined.

globalThis resolves this inconsistency by bypassing the execution context's this binding to provide a guaranteed reference to the global object.

```js
// JavaScript - ES Module or Strict Mode context
"use strict";

console.log(this); // Outputs: undefined
console.log(globalThis); // Outputs: the global object (e.g., Window or global)

// Attempting to set a global variable using legacy patterns
try {
  this.myVar = 'Hello'; // Throws TypeError
} catch (e) {
  console.error(e.message);
}

// Safely setting a global variable
globalThis.mySafeVar = 'Hello';
console.log(globalThis.mySafeVar); // Outputs: 'Hello'
```

## Limitations of globalThis

While globalThis provides a unified reference, consider these contextual behaviors:

* **Realm-Specific Scope**: globalThis points to the global object of the current JavaScript realm. Inside an &lt;iframe&gt;, globalThis refers to the iframe's window object, not the parent document.
* **Security Restrictions**: globalThis does not bypass Content Security Policy (CSP) rules.
* **Frozen Global Objects**: In secure environments like Secure ECMAScript (SES), where the environment freezes the global object using Object.freeze(), you cannot assign new properties to globalThis.

## Polyfilling globalThis

To support older environments like Internet Explorer 11, you must polyfill globalThis. Note that a robust polyfill is complex because modern bundlers often enforce strict mode, and CSP rules frequently block the Function('return this')() workaround.

### JavaScript Polyfill

Include this code at the start of your application entry point:

```js
(function() {
  if (typeof globalThis !== 'undefined') return;

  var getGlobalObject = function() {
    if (typeof self !== 'undefined') return self;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    return this;
  };

  var globalObj = getGlobalObject();

  if (globalObj) {
    globalObj.globalThis = globalObj;
  } else {
    throw new Error('Unable to locate the global object.');
  }
})();
```

### TypeScript Configuration

In TypeScript, update your tsconfig.json to include ES2020 in the lib array so the compiler recognizes globalThis.

```ts
{
  "compilerOptions": {
    "target": "ES5",
    "lib": [
      "DOM",
      "ES5",
      "ScriptHost",
      "ES2020"
    ]
  }
}
```

## Code Examples

### JavaScript Usage

```js
// JavaScript
globalThis.appConfig = {
  theme: 'dark',
  debugMode: true
};

function readConfig() {
  if (globalThis.appConfig.debugMode) {
    console.log('Running in debug mode.');
  }
}

readConfig();
```

### TypeScript Usage

In TypeScript, augment the global scope to ensure type safety.

```ts
// TypeScript
interface AppConfig {
  theme: string;
  debugMode: boolean;
}

// Augment the global scope
declare global {
  var appConfig: AppConfig;
}

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
