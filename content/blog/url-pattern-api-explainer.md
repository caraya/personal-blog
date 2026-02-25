---
title: "URL Pattern API: A Native Standard for Routing"
date: 2026-03-20
tags:
  - Javascript
  - Web Development
  - URL Pattern
---

The URL Pattern API provides a standardized, native way to match URLs against specific patterns. It brings the pattern-matching capabilities found in server-side frameworks (such as Express) or frontend routers (such as React Router) directly into the browser and Node.js runtimes.

This post explains the functionality of the URL Pattern API, the external tools it replaces, and why it provides a superior alternative for URL matching and routing in modern web development.

## How It Works

The API revolves around the URLPattern class. It allows you to define patterns using either a compact string or a structured object, which you then match against full URLs.

### URL Pattern Components

A URLPattern can match against all individual components of a URL. These components match the properties of the standard URL object:

* **protocol**: e.g., https
* **username**: The username part of a URL.
* **password**: The password part of a URL.
* **hostname**: e.g., example.com
* **port**: e.g., 8080
* **pathname**: e.g., /api/v1/users
* **search**: The query string, e.g., ?id=123
* **hash**: The fragment, e.g., #section-1

### Creating a Pattern

You can define a pattern using a string for familiarity or an object for granular control over specific URL parts.

#### String Syntax

```ts
// Matches any product path on a specific origin
const pattern = new URLPattern('/products/:id', 'https://store.example.com');
```

#### Object Syntax

```ts
// Matches any subdomain on google.com with a specific pathname
const pattern = new URLPattern({
  hostname: '*.google.com',
  pathname: '/maps/*'
});
```

## Pattern Syntax

The URL Pattern API supports a rich syntax for flexible matching:

* **Named Groups (:name)**: Captures a part of the URL into a named variable. For example, /users/:id matches /users/123 and captures 123 as id.
* **Wildcards (*)**: Matches zero or more characters. For example, /images/* matches /images/logo.png or /images/icons/help.svg.
* **Optional Groups ({...}?)**: Makes a part of the pattern optional. For example, /books{/:id}? matches both /books and /books/123.
* **Regex Customization**: You can provide custom regular expressions within a named group, such as /articles/:id(\\d+) to ensure the ID is numeric.

## Matching Methods

The API provides two primary methods for interacting with URLs: .test() and .exec().

### Boolean Matching with .test()

Use `.test()` when you only need to know if a URL matches the pattern. It returns a boolean.

```ts
const pattern = new URLPattern({ pathname: '/admin/*' });
const isAllowed = pattern.test('https://example.com/admin/settings');

if (isAllowed) {
  console.log('Access granted');
}
```

### Extraction with .exec()

The .exec() method checks if a URL matches the defined pattern. If a match occurs, it returns a result object containing the parsed components and any captured groups.

```ts
const pattern = new URLPattern('/books/:genre/:title', 'https://library.com');
const result = pattern.exec('https://library.com/books/sci-fi/dune');

if (result) {
  // Access named groups directly from the pathname property
  const { genre, title } = result.pathname.groups;
  console.log(`Genre: ${genre}`); // "sci-fi"
  console.log(`Title: ${title}`); // "dune"
}
```

## Implementation Example: Single-Page Blog Router

In this example, we implement a router for a blog where each post lives in its own directory (e.g., <https://blog.example.com/post-name/index.html>). We use URLPattern to parse the slug and integrate with the popstate event to handle browser navigation.

```ts
interface Route {
  pattern: URLPattern;
  handler: (params: Record<string, string | undefined>) => void;
}

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: '/' }),
    handler: () => console.log('Rendering Home Page...')
  },
  {
    pattern: new URLPattern({ pathname: '/:slug/index.html' }),
    handler: (params) => console.log(`Rendering post: ${params.slug}`)
  }
];

function router(): void {
  const url = window.location.href;
  for (const route of routes) {
    const match = route.pattern.exec(url);
    if (match) {
      route.handler(match.pathname.groups);
      return;
    }
  }
  console.log('404: Page Not Found');
}

// Handle browser back/forward buttons
window.addEventListener('popstate', router);

// Intercept link clicks for client-side navigation
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const anchor = target.closest('a');

  if (anchor && anchor.href.startsWith(window.location.origin)) {
    e.preventDefault();
    window.history.pushState({}, '', anchor.href);
    router();
  }
});

// Initial route execution
router();
```

## Performance: URLPattern vs. path-to-regexp

While libraries like path-to-regexp are highly optimized, the URLPattern API offers several performance advantages by shifting logic from the JavaScript engine to the browser's native C++ layer.

Native Execution Speed
: path-to-regexp works by converting strings into JavaScript RegExp objects at runtime. This requires the JavaScript engine to parse the string, generate a regex, and then JIT-compile it. In contrast, URLPattern is implemented directly in the browser's engine. Benchmarks generally show that native matching is faster, especially when handling complex patterns with multiple named groups.

Initial Load and Startup Time
: In modern web development, "Total Blocking Time" is a critical metric. Using the native API eliminates the time spent:
: * Downloading the library (reducing bundle size).
: * Parsing and Compiling the library code.
: * Generating Regex objects during the initial application bootstrap.
: For low-power mobile devices, this reduction in CPU work during the startup phase can lead to a more responsive user experience.

Memory Overhead
: Each instance of a path-to-regexp matcher creates several JavaScript objects and closures. Native URLPattern instances have a smaller memory footprint in the JavaScript heap because the heavy lifting occurs in the browser's internal memory management system.

## Legacy Tool Replacements

Before the introduction of this API, developers relied on external libraries or complex manual logic to parse URLs. The URL Pattern API replaces the following:

* `path-to-regexp`: The engine behind Express.js and React Router. The URL Pattern API makes this functionality native.
* `Manual Regular Expressions`: Developers often write fragile regex to validate URLs (e.g., /\/api\/v1\/([a-z]+)/).
* `Manual String Parsing`: Logic such as url.split('/').pop() to extract IDs or filenames.

## Benefits of Native Patterns

Service Worker Integration
: The URL Pattern API is available in Service Workers. This allows you to write sophisticated caching strategies based on URL patterns without importing heavy routing libraries into your worker thread.

Enhanced Security
: Writing custom regular expressions for URLs is prone to security vulnerabilities, such as ReDoS (Regular Expression Denial of Service). The native engine is optimized and tested to mitigate these risks.

Improved Readability
: Structured patterns are more readable than complex regular expressions:
: * Regex: ^https:\/\/(?:[a-z0-9-]+\.)?example\.com\/api\/.*$
: * URLPattern*: { hostname: '*.example.com', pathname: '/api/*' }

## Providing a Fallback (Polyfill)

As of early 2026, the URLPattern API is natively supported in all major browsers, including Chrome, Safari, Firefox, and Edge. It is also available in Node.js and Deno.

While native support is widespread, you might still need to support legacy browser versions or non-standard environments. In these cases, use the urlpattern-polyfill library.

### Install the Polyfill

```bash
npm install urlpattern-polyfill
```


### Conditional Import

Load the polyfill only if the environment lacks native support.

```ts
// patterns.ts
if (!globalThis.URLPattern) {
  await import('urlpattern-polyfill');
}

// Safely use the API
const pattern = new URLPattern('/api/:endpoint');
```

### React Implementation

In a React application, import the polyfill at the top of your entry file (e.g., index.tsx) to ensure global availability.

```tsx
// index.tsx
import 'urlpattern-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
```
