---
title: "URL Pattern API: A Native Standard for Routing"
date: 2026-03-20
tags:
  - Javascript
  - Web Development
  - URL Pattern
---

The **URL Pattern API** provides a standardized, native way to match URLs against patterns. It brings the pattern-matching capabilities typically found in server-side frameworks (like Express) or frontend routers (like React Router) directly into the browser and Node.js runtimes.

This post will explain what the URL Pattern API is, how it works, what external tools it replaces, and why it's a better alternative for URL matching and routing in modern web development.

## **How It Works**

The API revolves around the URLPattern class. It allows you to define patterns either as a compact string or a structured object, and then match them against full URLs.

### Creating a Pattern

You can define a pattern using a string (familiar to users of Express or React Router) or an object (for granular control over specific URL parts).

**String Syntax:**

```js
// Matches any product path
const pattern = new URLPattern('/products/:id', 'https://store.example.com');
```

**Object Syntax:**

```js
// Matches any subdomain on google.com
const pattern = new URLPattern({
  hostname: '*.google.com',
  pathname: '/maps/*'
});
```

### Matching and Extraction

The .exec() method checks if a URL matches the pattern. If it does, it returns a result object containing the parsed components and any captured groups.

```js
const pattern = new URLPattern('/books/:genre/:title', 'https://library.com');
const result = pattern.exec('https://library.com/books/sci-fi/dune');

if (result) {
  // Access named groups directly
  console.log(result.pathname.groups.genre); // "sci-fi"
  console.log(result.pathname.groups.title); // "dune"
}
```

## **What External Tools Does It Replace?**

Before this API, developers relied on external libraries or complex manual logic to parse URLs. The URL Pattern API effectively replaces:

1. **path-to-regexp**: This is the engine behind Express.js, React Router, and Vue Router. It converts path strings (like /user/:id) into Regular Expressions. The URL Pattern API makes this functionality native.
2. **Manual Regular Expressions**: Developers often write complex, fragile regex to validate URLs (e.g., /\\/api\\/v1\\/(\[a-z\]+)/).
3. **String Parsing Logic**: Manual splitting of strings (e.g., url.split('/').pop()) to extract IDs or filenames.

## Why Is This a Better Alternative?

### Zero Bundle Size

Because URLPattern is built into the browser (and Node.js/Deno), you don't need to ship a parsing library to your users. This reduces your JavaScript bundle size.

### Security & Safety

Writing custom Regular Expressions for URLs is prone to errors and security vulnerabilities, such as **ReDoS** (Regular Expression Denial of Service). The native engine is optimized and tested against these vulnerabilities.

### Service Worker Integration

This is a major advantage. The URL Pattern API is available in **Service Workers**, allowing you to write sophisticated caching strategies based on URL patterns without importing heavy routing libraries into your worker thread.

### Readability

Structured patterns are significantly more readable than Regex.

* **Regex:** ^https:\\/\\/(?:\[a-z0-9-\]+\\.)?example\\.com\\/api\\/.\*$
* **URLPattern:** { hostname: '\*.example.com', pathname: '/api/\*' }

## How to Provide a Fallback (Polyfill)

While support is growing (Chrome, Edge, Deno, Node.js), not every browser supports URLPattern natively (notably Safari and Firefox as of late 2024). You must provide a fallback.

The standard solution is the **urlpattern-polyfill** library.

### Step 1: Install the Polyfill

```bash
npm install urlpattern-polyfill
```

### Step 2: Conditional Import

You should only load the polyfill if the browser doesn't support the API natively.

**TypeScript / JavaScript (ES Modules):**

```ts
// patterns.ts
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
}

// Now you can safely use the API
const pattern = new URLPattern('/api/:endpoint');
```

**React Implementation Example:**

In a React app, you might import it at the very top of your entry file (e.g., index.tsx or main.tsx) to ensure it's available globally before any components render.

```tsx
// index.tsx
import 'urlpattern-polyfill'; // Imports globally if strictly necessary, or use conditional logic above

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```
