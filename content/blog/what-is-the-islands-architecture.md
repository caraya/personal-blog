---
title: "What is the islands architecture?"
date: 2026-04-03
tags:
  - Islands Architecture
  - Web Development
  - Performance Optimization
---

The islands architecture is a modern web development paradigm that emphasizes delivering static HTML content while selectively hydrating interactive components as needed. This approach allows developers to mix interactive "islands" of JavaScript within a "sea" of static HTML, optimizing performance and user experience by reducing the amount of JavaScript that needs to be loaded and executed on the client side. If we're careful then we're no longer sending a large Javascript bundle to the browser when the page first loads, instead, we send only the HTML and CSS and then only load the JavaScript for the interactive parts of the page when they are needed.

This post will explore the concept of islands architecture, its historical context, technical evolution, and practical implementation examples, including how to use it with Eleventy and the `is-land` plugin.

## Historical Context: The Pendulum of Web Development

Islands architecture represents a compromise between two extremes in web development: the fully server-rendered approach and the monolithic Single Page Application (SPA).

To understand islands, we must trace the history of how we deliver code to the browser.

### The Era of Server-Side Rendering (Pre-2010s)

In the early web, everything was an "island" of sorts, or rather, the whole ocean was static. Frameworks like PHP, Rails, and Django rendered HTML on the server. Interactivity was added sparingly via "sprinkles" of jQuery.

* **Pros**: Instant First Contentful Paint (FCP), excellent SEO.
* **Cons**: Full page reloads for every interaction, "clunky" user experience.

### The Rise of the Monolithic SPA (2010–2018)

Frameworks like Angular, React, and Vue moved the rendering engine to the client. The server sent a nearly empty HTML shell and a massive JavaScript bundle.

**The Hydration Problem**: Even for a static blog post, the browser had to download, parse, and execute the entire framework to make a single button clickable. This led to "The Uncanny Valley"—where the page looks ready but is unresponsive because the main thread is busy with hydration.

### The Transition: Static Site Generation (SSG)

Next.js and Gatsby popularized SSG, but they still suffered from "Rehydration." They would generate HTML at build time, but upon loading in the browser, the framework would still "re-render" the entire page to attach event listeners, effectively doing the work twice.

## Defining the "Island"

The term "Islands Architecture" was coined by Katie Sylor-Miller and popularized by Jason Miller (creator of Preact) in 2020.

The core idea is simple: The page is a sea of static HTML. Within that sea are isolated "islands" of dynamic interactivity. Each island is an independent entry point that hydrates in isolation.

## Technical Evolution: Partial and Progressive Hydration

Islands architecture is the logical conclusion of three technical milestones:

1. **Partial Hydration**: Only hydrating specific components instead of the whole tree.
2. **Progressive Hydration**: Hydrating components only when they are needed (e.g., when they scroll into view).
3. **Zero-JS by Default**: The baseline is 0KB of JavaScript. You "pay" only for the interactivity you explicitly define.

## TypeScript Implementation Examples

In an Islands-based framework (like Astro or Fresh), you define components as usual but choose how they are delivered to the client.

The Island Component (React Example)

```tsx
import { useState } from 'react';

interface CounterProps {
  initialCount: number;
  label: string;
}

export default function Counter({ initialCount, label }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <p className="text-gray-700 font-medium mb-2">{label}: {count}</p>
      <button
        onClick={() => setCount(prev => prev + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Increment
      </button>
    </div>
  );
}
```

The Orchestration (The "Sea")

```js
// This file is rendered on the server.
// Only the code inside the 'client:*' components is sent to the browser.

export default function Page() {
  return (
    <main className="max-w-4xl mx-auto p-8">
      <header>
        <h1 className="text-3xl font-bold">Island Architecture Deep Dive</h1>
      </header>

      <section className="mt-6 prose">
        <p>This paragraph is static. No framework code is needed here.</p>
      </section>

      {/* ISLAND (Immediate): Hydrates immediately on page load. */}
      <div className="my-8">
        <Counter client:load initialCount={0} label="Interactive Header Search" />
      </div>

      <div className="h-[1000px]">
        <p>A lot of static content that requires scrolling...</p>
      </div>

      {/* ISLAND (Lazy/Visible): Hydrates only when scrolled into view. */}
      <div className="my-8">
        <Counter client:visible initialCount={10} label="Comments Section" />
      </div>
    </main>
  );
}
```

## Implementing Islands in Eleventy

For a detailed technical guide on how to implement this pattern in Eleventy using the `@11ty/is-land` plugin, check out my [Complete Guide to is-land in Eleventy](/eleventy-island-guide/).

## Optimal Use Cases for Islands

Islands architecture is not a "silver bullet" for every application. It is most effective when the ratio of content to interactivity is high.

Content-Heavy Marketing and News Sites
: For blogs and news portals, the primary goal is readability and speed. You get the SEO benefits of pure HTML while embedding interactive charts or newsletter forms without the overhead of a full-site framework.

E-commerce Storefronts
: Product detail pages are often highly static but require small "islands" for "Buy Now" buttons or image galleries. Loading only the cart logic significantly improves Time to Interactive (TTI) for mobile shoppers.

Documentation and Portals
: Sites like the Astro or Firebase documentation use islands to handle search and code-snippet copying. This ensures the content is available instantly, even on poor connections.

## Communication Between Islands

Using Nano Stores or Signals

Modern patterns allow islands to share state without a global monolithic provider.

```ts
// store.ts - Shared state
import { atom } from 'nanostores';
export const $cartCount = atom(0);

// IslandA.tsx - The Trigger
export const AddToCart = () => (
  <button onClick={() => $cartCount.set($cartCount.get() + 1)}>
    Add to Cart
  </button>
);

// IslandB.tsx - The Observer
import { useStore } from '@nanostores/react';
export const CartIcon = () => {
  const count = useStore($cartCount);
  return <span>{count}</span>;
};
```

## Current Frameworks Leading the Charge

Astro: The most popular proponent, allowing multiple frameworks on one page.

Fresh (Deno): Zero-build, JIT-rendered islands using Preact.

Marko: Automatic partial hydration based on data flow analysis.

Qwik: Eliminates hydration through "Resumability."

## Conclusion

Islands architecture represents a return to the simplicity of the early web, enhanced by modern component-based developer experience. By treating JavaScript as a progressive enhancement rather than a prerequisite, developers can deliver sites that are fast by default, accessible, and resilient.
