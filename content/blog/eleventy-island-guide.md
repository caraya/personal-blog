---
title: "The Complete Guide to is-land in Eleventy"
date: 2026-04-10
tags:
  - is-land
  - client-side rendering
  - Eleventy
---

While islands architecture offers significant performance benefits, finding a clear use case for partial hydration can initially seem challenging. However, as Eleventy sites require increasingly complex interactivity, the value of selectively hydrating components becomes apparent.

This guide covers how to implement partial hydration in Eleventy using the @11ty/is-land component. It details how to use the component as a standalone tool and how to integrate it with WebC for advanced asset management.

## Part 1: The core concepts

### What is is-land?

The `is-land` framework is a small, zero-dependency client-side library (4KB minified) that allows developers to designate specific regions of a static HTML page as "interactive."

* **Default state**: The browser loads the page as static HTML and CSS. It does not download or execute the JavaScript for specific components.
* **Hydration**: When a defined trigger condition is met (for example, the user scrolls the component into view), `is-land` downloads the necessary scripts and initializes the component.

### Is WebC required?

No. The `is-land` architecture relies on a standard Web Component (`<is-land>`). Developers can use it within any Eleventy template language (Nunjucks, Liquid, Handlebars, standard HTML) or even outside of the Eleventy ecosystem entirely.

| Usage | How it works |
| --- | --- |
| Without WebC | Developers manually write `<script type="module">` tags inside templates and manage the location of JavaScript files within the project. |
| With WebC | WebC handles the bundling. It allows developers to author CSS and JavaScript inside a single component file and decides whether to bundle them globally or defer them inside the island. |

While `is-land` operates independently, pairing it with WebC dramatically improves the developer experience for larger projects. WebC excels at build-time asset management and component encapsulation. Consider using WebC and `is-land` together to gain the following benefits:

* **Single-file components**: WebC enables developers to author HTML, CSS, and JavaScript within a single `.webc` file. Without WebC, developers must maintain separate `.js` and `.css` files and link them manually.
* **Automatic asset bundling**: If a project invokes a WebC component multiple times on a single page, WebC automatically deduplicates the assets, ensuring the browser only downloads the associated CSS and global JavaScript once.
* **Scoped CSS**: By adding the `webc:scoped` attribute to `<style>` tags, WebC strictly scopes the CSS to that specific component. This prevents the island's styles from leaking out and disrupting the rest of the site's layout.
* **Robust server-side fallbacks**: WebC executes entirely at build time. It can fetch data, run loops, and generate a complete static HTML fallback that users see immediately. The `is-land` component then takes over on the client side to inject interactivity into that pre-rendered HTML.
* **Smart script placement**: Using the `webc:keep` attribute, WebC intelligently differentiates between scripts that belong in the main global bundle and scripts that must remain inside the `<template data-island>` for lazy loading.

In short, `is-land` controls when the JavaScript executes in the browser, while WebC controls how developers author and organize that code during the build process.

## Part 2: Using is-land (standalone)

For projects using Nunjucks (.njk), Liquid (.liquid), or standard HTML files, follow this workflow.

### Installation

Add the library script to the global layout (typically inside the `<head>` or just before the closing `</body>` tag).

```html
<script type="module" src="https://unpkg.com/@11ty/is-land/is-land.js"></script>
```

### Hydration triggers

Developers control when an island hydrates by applying specific attributes to the `<is-land>` tag.

| Trigger | Attribute | Behavior | Best Use Case |
| --- | --- | --- | --- |
| Visibility | on:visible | Hydrates when the element enters the viewport (using IntersectionObserver). | Heavy components located below the fold, such as charts or comment sections. |
| Idle | on:idle | Hydrates when the browser's main thread is free (using requestIdleCallback). | Non-critical UI that requires quick interactivity but must not block the initial paint. |
| Interaction | on:interaction | Hydrates upon specific user interactions: click, touchstart, or mouseover. | Interactive elements like dropdown menus, modals, or "Show More" buttons. |
| Media Query | on:media | Hydrates only when a specific CSS media query matches (e.g., (min-width: 768px)). | Mobile-only navigation menus or desktop-only sidebars. |
| Save Data | on:save-data | Prevents hydration if the user's browser has prefers-reduced-data enabled. | High-bandwidth widgets, large image carousels, or auto-playing videos. |

## Implementation patterns

### Pattern A: Vanilla JavaScript (the <template> approach)

To successfully delay a script's execution, developers must wrap it inside a `<template data-island>` tag. Without this wrapper, the browser executes the script immediately upon page load, defeating the core purpose of the island architecture.

```html
<is-land on:visible>
  <!-- 1. Fallback UI (Visible immediately) -->
  <div id="my-widget">Loading...</div>

  <!-- 2. The Logic (Dormant until visible) -->
  <template data-island>
    <style>
      #my-widget { color: blue; }
    </style>
    <script type="module">
      const widget = document.getElementById('my-widget');
      widget.textContent = "I am now active!";
    </script>
  </template>
</is-land>
```

### Pattern B: React and UI frameworks

The is-land component is framework-agnostic. To render a React component, provide a "glue" script inside the island that imports React, imports the component, and mounts it to the DOM.

First, author the component in either JavaScript or TypeScript.

**JavaScript (MyComponent.jsx)**

```jsx
import React from 'react';

export default function MyComponent() {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2>Hello from React!</h2>
      <button onClick={() => alert('Hydrated!')}>Click Me</button>
    </div>
  );
}
```

**TypeScript (MyComponent.tsx)**

```tsx
import React from 'react';

export default function MyComponent(): JSX.Element {
  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2>Hello from React!</h2>
      <button onClick={() => alert('Hydrated!')}>Click Me</button>
    </div>
  );
}
```

Next, create the island in the Eleventy template. This script points to the compiled JavaScript version of the component.

```html
<is-land on:visible>
  <!-- Fallback container -->
  <div id="react-root">Loading React Component...</div>

  <template data-island>
    <script type="module">
      import React from "https://esm.sh/react@18";
      import { createRoot } from "https://esm.sh/react-dom@18/client";
      // Ensure this path points to the compiled output of the component
      import MyComponent from "/js/MyComponent.js";

      const root = createRoot(document.getElementById("react-root"));
      root.render(React.createElement(MyComponent));
    </script>
  </template>
</is-land>
```

## Part 3: Using is-land with WebC

WebC elevates the developer experience within Eleventy. While WebC compiles Single File Components at build time, is-land lazy-loads them at runtime.

### How they work together

* **WebC (build time)**: WebC parses and compiles components. By default, it extracts every `<script>` tag it discovers and bundles them into one global file (e.g., site.js).
* **is-land (client time)**: For an island to function, its specific script must not end up in the global site.js bundle. The script must remain exactly where it is—inside the `<template data-island>` tag—so the browser can load it later.

**The critical attribute: `webc:keep`**

To prevent WebC from eagerly bundling the island's script, apply the `webc:keep` attribute.

| Attribute | Effect |
| --- | --- |
| (No attribute) | WebC extracts the script into the global bundle (site.js). This breaks the island. |
| webc:keep | WebC leaves the script tag exactly where it is in the HTML. This is required for islands. |
| webc:bucket="name" | WebC extracts the script into a separate, named bundle (e.g., lazy.js). This is useful for grouping the logic of multiple islands. |

### Example: The &lt;relative-time&gt; component

The following example demonstrates a WebC component that renders a static timestamp on the server, then upgrades it to a dynamic, relative time calculation on the client only when the component becomes visible.

**File: _components/my-relative-time.webc**

```html
<is-land on:visible>
  <!-- 1. Server-Side Fallback -->
  <!-- WebC renders this static HTML immediately at build time. -->
  <time :datetime="timestamp" @text="formatDate(timestamp)"></time>

  <!-- 2. The Payload -->
  <template data-island>
    <!--
      CRITICAL: 'webc:keep' instructs WebC:
      "Do NOT bundle this. Leave it here so is-land can execute it later."
    -->
    <script type="module" src="https://unpkg.com/@github/relative-time-element/dist/index.js" webc:keep></script>

    <!-- Inline script to upgrade the DOM -->
    <script type="module" webc:keep>
      const staticTime = document.querySelector("time");
      const relativeTime = document.createElement("relative-time");

      relativeTime.setAttribute("datetime", staticTime.getAttribute("datetime"));
      staticTime.replaceWith(relativeTime);
    </script>
  </template>

  <!-- 3. CSS -->
  <!-- WebC naturally extracts and bundles this CSS into the <head> to prevent Layout Shifts (CLS). -->
  <style webc:scoped>
    :host {
      color: #666;
      font-size: 0.9em;
    }
  </style>
</is-land>
```

## Summary checklist

* Load is-land.js globally in the base HTML layout.
* Wrap interactive areas with the `<is-land>` component tag.
* Choose a trigger: Utilize `on:visible` for scrolling performance or `on:interaction` for deferred UI controls.
* Use `<template data-island>`: Place all deferred logic scripts inside this specific tag.

When using WebC: Remember to append webc:keep to the scripts inside the template to prevent global bundling.

## Further reading

* [What is Islands Architecture?](/what-is-the-islands-architecture/): A deep dive into the history and theory behind this pattern.
* [Resilient Islands with the Temporal API](/resilient-islands-temporal-api/): An advanced tutorial on building a "Show on Success" component that gracefully falls back if the browser does not support the required logic.
* [TypeScript Playgrounds Implementation (Local & No Build)](/typescript-playgrounds-implementation/): A guide on implementing a Sandpack playground using is-land components without requiring a build step.
