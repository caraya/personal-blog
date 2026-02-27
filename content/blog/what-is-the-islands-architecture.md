---
title: "What is the islands architecture?"
date: 2026-04-03
tags:
  - Islands Architecture
  - Web Development
  - Performance Optimization
---

Islands architecture is a modern web development paradigm that emphasizes delivering static HTML content while selectively hydrating interactive components. This approach mixes interactive "islands" of JavaScript within a "sea" of static HTML, optimizing performance and user experience by drastically reducing the amount of JavaScript the client must load and execute.

Instead of sending a massive JavaScript bundle to the browser on the initial page load, the server sends only the HTML and CSS. The browser then loads the JavaScript exclusively for the interactive elements precisely when they are needed.

This post explores the concept of islands architecture, its historical context, technical evolution, and practical implementation examples, including how to use it with Eleventy and the is-land plugin.

## Historical Context: The Pendulum of Web Development

Islands architecture represents a compromise between two extremes in web development: the fully server-rendered approach and the monolithic single-page application (SPA).

To understand islands, trace the history of how developers deliver code to the browser.

### The Era of Server-Side Rendering (Pre-2010s)

In the early web, servers generated completely static pages. Frameworks like PHP, Ruby on Rails, and Django rendered all HTML on the server. Developers added interactivity sparingly using "sprinkles" of jQuery.

* **Pros:** Instant First Contentful Paint (FCP), excellent search engine optimization (SEO).
* **Cons:** Full page reloads for every interaction, resulting in a less fluid user experience.

### The Rise of the Monolithic SPA (2010–2018)

Frameworks like Angular, React, and Vue moved the rendering engine to the client. The server sends a nearly empty HTML shell alongside a massive JavaScript bundle.

#### The Hydration Problem

Even for a static blog post, the browser must download, parse, and execute an entire framework just to make a single button clickable. This creates the "Uncanny Valley" effect—a state where the page looks fully loaded but remains unresponsive because the browser's main thread is busy executing JavaScript.

### The Transition: Static Site Generation (SSG)

Tools like Next.js and Gatsby popularized SSG, but they still suffered from expensive rehydration. They generate HTML at build time, providing the illusion of speed. However, upon loading in the browser, the framework still re-renders the entire page tree to attach event listeners, effectively performing the computational work twice.

### Defining the "Island"

Katie Sylor-Miller coined the term "islands architecture" in 2019, and Jason Miller (creator of Preact) popularized it in 2020.

The core idea is simple: the page operates as a sea of static HTML containing isolated "islands" of dynamic interactivity. Each island acts as an independent entry point that hydrates in isolation.

#### Technical Evolution: Partial and Progressive Hydration

Islands architecture is the logical conclusion of three technical milestones:

* **Partial Hydration:** Hydrating only specific components instead of the entire application tree.
* **Progressive Hydration:** Hydrating components only when they are needed (for example, waiting until they scroll into the viewport).
* **Zero-JS by Default:** Setting the baseline to 0 KB of JavaScript. Applications incur performance costs only for explicitly defined interactivity.

## Implementation Examples

In an islands-based framework (like Astro or Fresh), developers define components as usual but dictate exactly how the framework delivers them to the client.

### The Island Component

Here is a standard interactive component. In an islands architecture, the framework isolates this interactive logic.

JavaScript

```js
import { useState } from 'react';

export default function Counter({ initialCount, label }) {
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

TypeScript

```ts
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

### The Orchestration (The "Sea")

The following file renders on the server. The framework sends only the HTML to the browser, intercepting the client:* directives to determine when to load the associated JavaScript. (Note: Directives like client:load are specific to frameworks like Astro).

JavaScript

```js
import Counter from './Counter';

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

TypeScript

```ts
import Counter from './Counter';

export default function Page(): JSX.Element {
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

For a detailed technical guide on how to implement this pattern in Eleventy using the @11ty/is-land plugin, review our [Complete Guide to is-land in Eleventy](/eleventy-island-guide/).

### Optimal Use Cases for Islands

Islands architecture is not a "silver bullet" for every application. It is most effective when the ratio of static content to interactivity is high.

* **Content-Heavy Marketing and News Sites**: For blogs and news portals, the primary goals are readability and speed. Islands provide the SEO benefits of pure HTML while easily embedding interactive charts or newsletter forms without the overhead of a full-site framework.
* **E-commerce Storefronts**: Product detail pages are often highly static but require small interactive islands for "Buy Now" buttons, variant selectors, or image galleries. Loading only the cart logic significantly improves Time to Interactive (TTI) for mobile shoppers.
* **Documentation and Portals**: Sites like the Astro or Firebase documentation use islands to handle search inputs and code-snippet copy buttons. This ensures the reading content is available instantly, even on poor network connections.

## Communication Between Islands

Because islands render as isolated, independent application trees, they cannot rely on global, monolithic providers—such as a top-level React Context—to share state. The virtual DOM does not span across islands, meaning standard component prop-drilling or context providers fail to bridge the gap.

Instead, establish communication using either lightweight, framework-agnostic state containers or browser-native events.

### Method 1: Framework-Agnostic State (Nano Stores / Signals)

Modern patterns often utilize external state management tools like Nano Stores or Signals. Because these tools live entirely outside the framework's component tree, a React island can update a value that a Vue or Svelte island simultaneously reacts to.

These two approaches are particularly effective for islands architecture for specific reasons:

* **Nano Stores**: This library is intentionally designed to be framework-agnostic and exceptionally lightweight. It avoids tying state to a specific UI library's rendering cycle, making it the community standard—and the officially recommended solution in frameworks like Astro—for sharing state across diverse islands.
* **Signals**: Signals provide fine-grained reactivity. Instead of triggering a bulky re-render of an entire component tree, signals track exact dependencies and update only the specific DOM nodes that change. While developers currently rely on standalone libraries (such as `@preact/signals-core`) to use them, Signals are the subject of an active [TC39 proposal](https://github.com/tc39/proposal-signals) to become a native part of the ECMAScript standard. Until browsers support them natively, these lightweight libraries serve as a highly performant bridge for cross-island reactivity.


#### Examples Using Nano Stores

JavaScript

```js
// store.js - Shared state
import { atom } from 'nanostores';
export const $cartCount = atom(0);

// IslandA.jsx - The Trigger
export const AddToCart = () => (
  <button onClick={() => $cartCount.set($cartCount.get() + 1)}>
    Add to Cart
  </button>
);

// IslandB.jsx - The Observer
import { useStore } from '@nanostores/react';
export const CartIcon = () => {
  const count = useStore($cartCount);
  return <span>{count}</span>;
};
```

TypeScript

```ts
// store.ts - Shared state
import { atom } from 'nanostores';
export const $cartCount = atom<number>(0);

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

#### Examples Using Signals

Example: Using Signals

JavaScript

```js
// store.js - Shared state
import { signal } from '@preact/signals-react';

export const cartCount = signal(0);

// IslandA.jsx - The Trigger
import { cartCount } from './store';

export const AddToCart = () => (
  <button onClick={() => { cartCount.value += 1; }}>
    Add to Cart
  </button>
);

// IslandB.jsx - The Observer
import { cartCount } from './store';

export const CartIcon = () => {
  // The component automatically tracks the signal and re-renders when it changes
  return <span>{cartCount.value}</span>;
};
```

TypeScript

```ts
// store.ts - Shared state
import { signal } from '@preact/signals-react';

export const cartCount = signal<number>(0);

// IslandA.tsx - The Trigger
import { cartCount } from './store';

export const AddToCart = () => (
  <button onClick={() => { cartCount.value += 1; }}>
    Add to Cart
  </button>
);

// IslandB.tsx - The Observer
import { cartCount } from './store';

export const CartIcon = () => {
  // The component automatically tracks the signal and re-renders when it changes
  return <span>{cartCount.value}</span>;
};
```

### Method 2: Browser-Native Custom Events

To avoid third-party state libraries entirely, rely on the browser's native CustomEvent API. One island dispatches an event to the global window object, and the other island listens for it.

JavaScript

```js
// IslandA.jsx - The Broadcaster
export const AddToCart = () => {
  const handleClick = () => {
    const event = new CustomEvent('cart:add', { detail: { itemId: 123 } });
    window.dispatchEvent(event);
  };

  return <button onClick={handleClick}>Add to Cart</button>;
};

// IslandB.jsx - The Listener
import { useState, useEffect } from 'react';

export const CartIcon = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const handleAdd = (event) => setCount(c => c + 1);
    window.addEventListener('cart:add', handleAdd);

    // Cleanup listener when the component unmounts
    return () => window.removeEventListener('cart:add', handleAdd);
  }, []);

  return <span>{count}</span>;
};
```

TypeScript

```ts
// IslandA.tsx - The Broadcaster
export const AddToCart = () => {
  const handleClick = () => {
    const event = new CustomEvent('cart:add', { detail: { itemId: 123 } });
    window.dispatchEvent(event);
  };

  return <button onClick={handleClick}>Add to Cart</button>;
};

// IslandB.tsx - The Listener
import { useState, useEffect } from 'react';

export const CartIcon = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const handleAdd = (event: Event) => setCount(c => c + 1);
    window.addEventListener('cart:add', handleAdd);

    // Cleanup listener when the component unmounts
    return () => window.removeEventListener('cart:add', handleAdd);
  }, []);

  return <span>{count}</span>;
};
```

## Current Frameworks Leading the Charge

Several modern frameworks have adopted and refined the islands architecture out-of-the-box:

* **Astro**: The most popular proponent, allowing developers to mix multiple framework components (React, Vue, Svelte) on a single page.
* **Fresh (Deno)**: A zero-build, just-in-time (JIT) rendered framework utilizing Preact.
* **Marko**: An eBay-backed framework that provides automatic partial hydration based on advanced data flow analysis.
* **Qwik**: Takes the concept further by eliminating hydration entirely through a process called "Resumability."

## Conclusion

Islands architecture represents a return to the simplicity of the early web, enhanced by modern, component-based developer experiences. By treating JavaScript as a progressive enhancement rather than a prerequisite, development teams can deliver sites that are fast by default, highly accessible, and resilient.
