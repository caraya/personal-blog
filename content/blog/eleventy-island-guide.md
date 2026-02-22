---
title: "The Complete Guide to is-land in Eleventy"
date: 2026-04-10
tags:
  - is-land
  - client-side rendering
  - Eleventy
---

This guide covers how to implement partial hydration in Eleventy using the is-land library. It details how to use it as a standalone tool and how to integrate it with WebC for advanced asset management.

## Part 1: The Core Concepts

### What is is-land?

**is-land** is a small, zero-dependency client-side library (4KB minified) that allows you to designate specific regions of your static HTML page as "interactive."

* **Default State:** The page loads as static HTML/CSS. JavaScript for specific components is **not** downloaded or executed.
* **Hydration:** When a trigger condition is met (e.g., the user scrolls the component into view), is-land downloads the necessary scripts and initializes the component.

### Is WebC Required?

**No.** is-land is a standard Web Component (&lt;is-land&gt;). You can use it in **any** Eleventy template language (Nunjucks, Liquid, Handlebars, HTML) or even outside of Eleventy entirely.

| Usage | How it works |
| :---- | :---- |
| **Without WebC** | You manually write &lt;script type="module"&gt; tags inside your templates. You are responsible for managing where those files live. |
| **With WebC** | WebC handles the **bundling**. It allows you to write CSS/JS inside a single component file and decides whether to bundle them globally or keep them deferred inside the island. |

While is-land operates independently, pairing it with WebC improves the developer experience, particularly for larger projects. Use WebC primarily for build-time asset management and component encapsulation. Consider using WebC and is-land together for the following benefits:

* **Single File Components:** WebC lets you author your HTML, CSS, and JavaScript in a single .webc file. Without WebC, you must manually maintain separate .js and .css files and manually link them in your templates.
* **Automatic Asset Bundling:** If you use a WebC component multiple times on a page, WebC automatically deduplicates the assets, ensuring the associated CSS and global JS are only included once in the final build.
* **Scoped CSS:** By adding the webc:scoped attribute to your &lt;style&gt; tags, WebC automatically restricts the CSS to that specific component. This prevents your island's styles from accidentally leaking out and breaking the rest of your site's layout.
* **Robust Server-Side Fallbacks:** WebC executes at build time. You can use it to fetch data, run loops, and build a complete static HTML fallback that users see immediately. is-land then takes over on the client side to inject interactivity into that pre-rendered HTML.
* **Smart Script Placement:** Using the webc:keep attribute, WebC differentiates between scripts that should be bundled into your main global file and scripts that must stay inside the &lt;template data-island&gt; for lazy loading.

In short, is-land controls *when* the JavaScript executes in the browser, while WebC controls *how* you author and organize that code during the build process.

## Part 2: Using is-land (Standalone)

If you are using Nunjucks (.njk), Liquid (.liquid), or standard HTML, follow this workflow.

### Installation

Add the library to your global layout (usually inside &lt;head&gt; or before &lt;/body&gt;).

```html
<script type="module" src="https://unpkg.com/@11ty/is-land/is-land.js"></script>
```

### Hydration Triggers**

You control *when* an island hydrates using attributes on the &lt;is-land&gt; tag.

| Trigger | Attribute | Behavior | Best Use Case |
| :---- | :---- | :---- | :---- |
| **Visibility** | on:visible | Hydrates when the element enters the viewport (uses IntersectionObserver). | Heavy components located below the fold, such as charts or comment sections. |
| **Idle** | on:idle | Hydrates when the browser's main thread is free (uses requestIdleCallback). | Non-critical UI that needs to be ready quickly but shouldn't block the initial paint. |
| **Interaction** | on:interaction | Hydrates on specific user interactions: click, touchstart, or mouseover. | Interactive elements like dropdown menus, modals, or "Show More" buttons. |
| **Media Query** | on:media | Hydrates only when a specific CSS media query matches (e.g., (min-width: 768px)). | Mobile-only navigation menus or desktop-only sidebars. |
| **Save Data** | on:save-data | Prevents hydration if the user's browser has prefers-reduced-data enabled. | High-bandwidth widgets, large image carousels, or auto-playing videos. |

### Implementation Patterns

#### Pattern A: Vanilla JS (The &lt;template&gt; Trick)**

To delay a script, you **must** wrap it in &lt;template data-island&gt;. If you don't, the browser will execute the script immediately on page load, defeating the purpose of the island.

```html
<is-land on:visible\>
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

#### Pattern B: React / Frameworks

is-land does not know React exists. You must provide a "glue" script that imports React and mounts your component.

```html
<is-land on:visible>
  <div id="react-root"></div>
  <template data-island>
    <script type="module">
      import React from "https://esm.sh/react@18";
      import { createRoot } from "https://esm.sh/react-dom@18/client";
      import MyComponent from "/js/MyComponent.js";

      const root = createRoot(document.getElementById("react-root"));
      root.render(React.createElement(MyComponent));
    </script>
  </template>
</is-land>
```

## Part 3: Using is-land with WebC

This is where Eleventy shines. WebC allows you to author Single File Components, and is-land allows you to lazy-load them.

### How they work together**

1. **WebC (Build Time):** It compiles your components. It normally takes every &lt;script&gt; tag it finds and bundles them into one big site.js.
2. **is-land (Client Time):** It needs the script to **not** be in site.js. It needs the script to stay inside the &lt;template data-island&gt; tag so it can load it later.

### The Critical Attribute: webc:keep

To stop WebC from bundling your island's script, you add `webc:keep`.

| Attribute | Effect |
| :---- | :---- |
| **(No attribute)** | WebC moves the script to your global bundle (site.js). **Bad for islands.** |
| **webc:keep** | WebC leaves the script tag exactly where it is in the HTML. **Required for islands.** |
| **webc:bucket="name"** | WebC moves the script to a separate bundle (e.g., lazy.js). Useful for grouping multiple islands. |

### Example: The &lt;relative-time&gt; Component

This example demonstrates a component that renders a static timestamp (server-side) and upgrades it to a relative time calculation (client-side) only when seen.

**File:** _components/my-relative-time.webc

```html
<is-land on:visible>
  <!-- 1. Server-Side Fallback -->
  <!-- WebC renders this static HTML immediately. -->
  <time :datetime="timestamp" @text="formatDate(timestamp)"></time>

  <!-- 2. The Payload -->
  <template data-island>
    <!--
      CRITICAL: 'webc:keep' tells WebC:
      "Do NOT bundle this. Leave it here so is-land can find it later."
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
  <!-- We let WebC bundle CSS to the head so there is no layout shift (CLS). -->
  <style webc:scoped>
    :host { color: #666; font-size: 0.9em; }
  </style>
</is-land>
```

## Summary Checklist*

1. **Load is-land.js** in your base layout.
2. **Wrap interactive areas** with &lt;is-land&gt;.
3. **Choose a Trigger**: Use on:visible for performance or on:interaction for UI controls.
4. **Use &lt;template data-island&gt;**: All deferred scripts **must** live inside this tag.
5. **If using WebC**: Add webc:keep to scripts inside the template to prevent them from being bundled globally.

## Further Reading

* [What is Islands Architecture?](../what-is-islands-architecture/): A deep dive into the history and theory behind this pattern.
* [Resilient Islands with the Temporal API](../resilient-islands-with-the-temporal-api/): An advanced tutorial on building a "Show on Success" component that gracefully falls back if the browser doesn't support the logic.
