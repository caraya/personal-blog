---
title: "The Evolution of Reactive Programming"
date: 2026-07-22
---

Reactive programming is a declarative paradigm centered around data streams and the automatic propagation of change. Instead of writing imperative code that explicitly updates the user interface (UI) or recalculates variables when data shifts, a reactive system binds the UI directly to the state. When the state updates, the system pushes those changes to all interested subscribers.

There are different models of reactivity, each with its own trade-offs. Knowing the differences between hooks, observables, and signals is crucial for choosing the right tools for your application.

In this post, we will explore the history of reactivity in web development, the current trends, and why signals are emerging as the new standard for state management. We will also compare different implementations, including the TC39 Signals proposal and Signalium, to understand their unique advantages and use cases.

## The History of Reactivity: From Dirty Checking to the Virtual DOM

Historically, modern web applications relied heavily on component-level reactivity and Virtual DOM diffing. If data changed, the framework had to re-evaluate or re-render a large portion of the application to see what changed, eventually pushing the new state into the view. However, modern reactivity is shifting toward a single source of truth that actively pushes notifications to the exact functions or DOM nodes that depend on it, bypassing widespread re-evaluation entirely.

To understand why modern web development is moving rapidly toward signals, we must look at how the web solved the "state-to-UI" problem over the past fifteen years. The evolution can be categorized into three distinct eras:

### The Early MVVM Era and Dirty Checking (2010–2013)

In the early 2010s, frameworks like AngularJS and Knockout.js pioneered declarative data binding.

Knockout.js introduced "observables" using a dependency-tracking getter/setter system that built an implicit graph of dependencies. This was actually a direct ancestor of modern signals. However, the syntax was often verbose, and managing nested structures was notoriously difficult.

AngularJS took a different route with dirty checking via the $digest loop. Instead of tracking dependencies, AngularJS recursively ran through every bound variable in the application whenever an event occurred to see if any value had changed. While simple to write, this approach quickly became a performance bottleneck for larger applications, leading to "digest cycle exceeded" errors and sluggish UIs.

### The Virtual DOM Revolution (2013–2020)

Frustrated by the scalability issues of dirty checking and the complexity of early observables, the industry shifted dramatically with the release of React in 2013. React bypassed granular dependency tracking entirely by introducing the Virtual DOM (VDOM).

Instead of trying to figure out exactly what changed, React's philosophy was to re-run the entire component tree when state updated, generate a lightweight virtual representation of the UI, diff it against the previous snapshot, and batch the necessary updates to the real DOM. This "pull-based" model made state highly predictable and eliminated a massive category of bugs. However, it transferred the performance cost from the developer to the client's CPU and memory, requiring complex optimizations like shouldComponentUpdate, useMemo, and useCallback to prevent unnecessary renders.

### The Return to Fine-Grained Reactivity (2020–Present)

As web applications grew larger and mobile browsing surged, the overhead of Virtual DOM diffing became a major performance hurdle. Frameworks like Vue (with its reactivity system based on ES6 Proxies), Svelte (with compile-time reactivity), and SolidJS proved that applications could update the DOM directly and instantly without a VDOM layer.

This modern era marks a return to Knockout-style fine-grained reactivity, but built on modern browser capabilities, standard ES APIs, and compiler optimizations. Signals are the mature, standardized evolution of this journey.

### The Hybrid Spectrum: The Preact Approach

During this transition, hybrid models also emerged to bridge the gap. Preact Signals represents a fascinating middle ground on this spectrum, demonstrating how a system can leverage both Virtual DOM rendering and true fine-grained reactivity depending on usage:

* **Virtual DOM Integration**: If you access `.value` inside a component's render function (e.g., `const val = count.value`), Preact registers a subscription that triggers a standard Virtual DOM re-render for that specific component when the value changes.
* **Direct DOM Bypassing**: If you pass the raw signal object directly into the JSX (`<div>{count}</div>`), Preact’s custom rendering engine bypasses the Virtual DOM diffing pipeline entirely. It intercepts the node during the initial render and binds a direct, pinpoint update to the underlying DOM text node when the signal changes, achieving native-level execution speed.

(For a technical code breakdown of how Preact executes this dual-mode subscription vs. direct text mutation, see Appendix A: Under the Hood of Preact's DOM Bypassing).

## The Biggest Trends in Reactivity

The landscape of web performance has shifted drastically. The biggest current trends include:

* **Fine-Grained Reactivity over Virtual DOM**: Frameworks are moving toward direct, pinpoint DOM updates. Instead of diffing a tree of components, the system tracks dependencies at the granular level of individual variables, updating only the specific text node or attribute tied to that variable.
* **First-Class Asynchronous Handling**: Reactivity is expanding beyond synchronous state. Modern libraries treat promises, web sockets, and streams as native reactive primitives, eliminating messy lifecycle methods.
* **Platform Standardization**: The most significant trend is the push to move reactivity out of framework-specific implementations and into the native web platform through ECMAScript standards.

## Signals: The New Standard for State

Signals are currently the preferred model for reactivity. A signal is a wrapper around a value that notifies interested consumers when that value changes. Because a signal explicitly tracks what reads it during execution, it builds a precise dependency graph.

While the fundamental concept of a signal is becoming standardized, practical implementations vary. The ecosystem currently offers several ways to utilize this reactive model.

### The Official TC39 Polyfill (@proposal-signals/signal-polyfill)

The TC39 Signals proposal aims to standardize reactivity directly in JavaScript. Because rendering schedulers are environment-dependent, the specification intentionally omits a built-in effect API. Instead, it provides low-level primitives—Signal.State, Signal.Computed, and the low-level Signal.subtle.Watcher API—allowing framework and library authors to build their own optimized scheduling and batching systems.

(To explore how userland frameworks use these primitives to implement a custom, microtask-batched createEffect utility and drive a real application, see Appendix B: Building a Custom Scheduler with the TC39 Low-Level API).

### [Signalium](https://signalium.dev/)

Signalium is a userland library that provides a high-level, ergonomic abstraction for reactive state. It focuses heavily on developer experience, specifically by treating complex asynchronous operations (like data fetching) as native reactive primitives through Reactive Promises and Relays.

```ts
import { signal, reactive } from 'signalium';

const userId = signal('123');

const fetchUser = reactive(async () => {
  const res = await fetch('https://api.example.com/users/' + userId.value);
  return res.json() as Promise<{ name: string }>;
});
```

### Comparing Implementations: Polyfill vs. Signalium

While both the TC39 Signals polyfill and Signalium operate on the same core principles of dependency tracking and automatic change propagation, they serve entirely different layers of the modern web stack. They are not competing libraries, but rather represent a split between low-level platform primitives and high-level application ergonomics. Understanding the operational boundaries between these two approaches is critical for architects: the TC39 proposal establishes a foundational, engine-level standard designed for ultimate interoperability and raw efficiency, whereas Signalium acts as a developer-first product engine that turns those foundational reactive nodes into highly functional, application-ready abstractions. Contrasting them reveals the fundamental trade-offs between absolute control (building a custom reactive architecture from scratch) and immediate velocity (using a rich, out-of-the-box feature set).

| Feature | TC39 Polyfill | Signalium |
| --- | --- | --- |
| Architectural Scope | Operates as a foundational, independent engine. It runs anywhere JavaScript runs and defines dependency tracking without UI concepts. | Operates as an independent reactive graph but provides a richer, application-level feature set built on foundational concepts. |
| Side Effects | Omits a built-in effect function. It provides a low-level Watcher API, requiring framework authors to build update mechanisms. | Provides immediate, developer-friendly effect mechanisms out of the box for triggering side effects. |
| Asynchronous State | Manages synchronous values. Developers or higher-level libraries must manually orchestrate complex async flows. | Maps asynchronous tasks natively to the reactive graph, automatically handling pending, value, and error states. |

## Signals vs. Hooks vs. Observables

To understand why signals are dominating the conversation, we must contrast them with hooks and observables. These three models represent fundamentally different philosophies on how state, time, and the user interface interact. While hooks bind state directly to a component's lifecycle and rendering loop, and observables model state as an asynchronous stream over time, signals treat state as a self-aware value within an independent dependency graph. Contrasting them reveals the core trade-offs between execution overhead, architectural complexity, and developer cognitive load—showing why signals have emerged as the sweet spot for modern web applications.

### Hooks (The Component-Bound Model)

React popularized hooks (useState, useEffect, useMemo). Hooks depend entirely on the execution order within a component's render function.

* **How they work**: State lives inside the component. When state changes, the entire component function re-runs.
* **The drawback**: Hooks lack inherent dependency tracking for state reads. Developers must manually declare dependency arrays (e.g., [data, options]). Furthermore, any state change triggers a top-down re-render of the component tree unless heavily optimized with `React.memo` or a compiler.

```tsx
import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [double, setDouble] = useState(0);

  // Manual orchestration of derived state
  useEffect(() => {
    setDouble(count * 2);
  }, [count]); // Manually declared dependency array

  return (
    <button onClick={() => setCount(prev => prev + 1)}>
      Count: {count} (Double: {double})
    </button>
  );
}
```

### Observables (The Time-Bound Model)

Observables, popularized by RxJS, model values over time using streams.

* **How they work**: An observable is a push-based pipe. You cannot arbitrarily "read" the current value; you must subscribe to the pipe and wait for the callback to execute when a new value arrives.
* **The drawback**: Observables are incredibly powerful for complex asynchronous events (like debouncing keyboard input or handling web sockets). However, applying them to simple, synchronous UI state introduces massive boilerplate and a steep learning curve.

```tsx
import { BehaviorSubject, map } from 'rxjs';

// Setup state streams
const count$ = new BehaviorSubject<number>(0);
const double$ = count$.pipe(map(x => x * 2));

// Subscriptions must be explicitly managed and cleaned up
const subscription = double$.subscribe(value => {
  console.log(`Current double value: ${value}`);
});

// Update state
count$.next(1);
count$.next(2);

// Manual cleanup to prevent memory leaks
subscription.unsubscribe();
```

### Signals (The Value-Bound Model)

Signals strike a balance between the simplicity of values and the expressiveness of observables.

* **How they work**: Signals are "buckets" holding a current value. You can pull the value at any time, but if you read it inside a tracking context (like an effect or template), the system automatically subscribes to it.
* **The advantage**: Signals decouple state from the UI tree. Updating a signal does not require re-rendering a component tree; it only triggers the specific computations or DOM nodes that read that exact signal.

```ts
import { signal, computed, effect } from 'some-signals-library';

const count = signal(0);
const double = computed(() => count.value * 2); // Implicit tracking on read

// Implicit subscription. No cleanup boilerplate or dependency arrays needed.
effect(() => {
  console.log(`Current double value: ${double.value}`);
});

// Directly updating values triggers localized notifications
count.value = 1;
count.value = 2;
```

## Which Works Better for Modern Browsers?

For modern web applications, signals paired with fine-grained DOM updates are the clear winner for performance and developer experience across the entire web ecosystem.

### Vanilla JavaScript and TypeScript

In traditional vanilla web development, developers manually query the DOM and attach event listeners to imperatively update the UI. This approach frequently leads to tangled, hard-to-maintain code as applications scale. Signals introduce a declarative, reactive model to vanilla development. By binding DOM elements directly to signal values, developers eliminate manual synchronization and reduce the risk of the UI desynchronizing from the underlying data.

### Web Components

Custom elements and Web Components provide strong encapsulation but lack a standard, cross-component state management solution. Developers often resort to complex event bubbling or manual prop drilling to share data. Signals offer a lightweight data layer that perfectly complements Web Components. A shared signal can easily synchronize state across disparate Shadow DOM boundaries without requiring developers to bundle a heavy external framework.

### Frameworks and the Virtual DOM

For applications built with heavy frameworks, signals sidestep the overhead of Virtual DOM diffing. When a browser processes a Virtual DOM update, it allocates memory for a new tree and runs diffing algorithms—which can cause layout thrashing and dropped frames on low-end mobile devices. Because a signal directly notifies the specific text node or attribute it is bound to, the system bypasses the diffing process entirely, resulting in native-level performance.

## Conclusion

The web development community has steadily shifted away from coarse, pull-based re-renders toward precise, push-based data flows. Signals represent the culmination of this evolution. By eliminating the need for manual dependency arrays and bypassing expensive Virtual DOM diffing, the signal model drastically reduces cognitive load while guaranteeing high performance.

Whether you build complex framework-driven architectures, encapsulate logic in Web Components, or write lean vanilla TypeScript, signals provide a universal foundation. You no longer have to choose between developer ergonomics and rendering speed.

As the TC39 proposal advances toward standardization, the broader JavaScript ecosystem stands on the brink of a major unification. Future frameworks will not need to ship custom reactivity engines, which will lead to smaller bundle sizes and enable true cross-framework interoperability. Developers who adopt the signal mental model today will perfectly position their applications for a faster, more standardized web platform.

## References

* [TC39 Signals Proposal Repository](https://github.com/tc39/proposal-signals) — The official proposal to add signals as native reactivity primitives in JavaScript.
* [Signal Polyfill](https://github.com/proposal-signals/signal-polyfill) — The reference implementation tracking the current state of the TC39 proposal.
* [Signalium Documentation](https://signalium.dev/) — High-level universal reactivity library built for first-class async management.
* [Preact Signals](https://preactjs.com/guide/v10/signals) — Documentation on Preact's hybrid approach combining VDOM and fine-grained DOM rendering.

## Appendix A: Under the Hood of Preact's DOM Bypassing

To see this hybrid approach in action, consider how the compiler and runtime interpret signal access in Preact. The following code demonstrates the difference between subscribing to Virtual DOM updates versus executing a direct DOM text node mutation:

```ts
import { signal } from '@preact/signals';

const count = signal(0);

function Counter() {
  // If we accessed `count.value` here outside JSX, Preact would register
  // a subscription to re-render this entire Component function:
  // console.log(count.value);

  return (
    <div>
      {/*
        Passing the raw 'count' signal directly to the JSX tag allows Preact
        to bypass VDOM diffing entirely. It updates the DOM Text node directly.
      */}
      <p>Value: {count}</p>

      <button onClick={() => count.value++}>
        Increment
      </button>
    </div>
  );
}
```

## Appendix B: Building a Custom Scheduler with the TC39 Low-Level API

To understand how userland frameworks use these primitives, we must look at how we can implement a custom, microtask-batched createEffect utility and use it to drive a real application.

```ts
import { Signal } from '@proposal-signals/signal-polyfill';

// A. USERLAND IMPLEMENTATION: Building an Effect Scheduler
let isQueued = false;

// Create a Watcher that notifies when registered signals become dirty
const watcher = new Signal.subtle.Watcher(() => {
  if (!isQueued) {
    isQueued = true;
    // Batch evaluations to run as a single microtask
    queueMicrotask(() => {
      isQueued = false;
      // Re-read dirty signals to run calculations & notify subscribers
      for (const signal of watcher.getPending()) {
        signal.get();
      }
      // Re-arm the watcher
      watcher.watch();
    });
  }
});

// Create an 'effect' primitive on top of TC39 low-level elements
export function createEffect(callback: () => void) {
  const computed = new Signal.Computed(() => {
    callback();
  });

  // Watch this computed signal
  watcher.watch(computed);
  // Evaluate immediately to build the initial dependency graph
  computed.get();

  // Return a cleanup function
  return () => {
    watcher.unwatch(computed);
  };
}

// B. APPLICATION CODE: Driving a Vanilla App using our Custom Effect
const count = new Signal.State(0);
const isEven = new Signal.Computed(() => count.get() % 2 === 0);

const container = document.getElementById('app-output');

// Run side-effects dynamically
createEffect(() => {
  if (container) {
    container.textContent = `Value: ${count.get()} (${isEven.get() ? 'Even' : 'Odd'})`;
  }
});

// Mutating state synchronously triggers batched updates
setInterval(() => {
  count.set(count.get() + 1);
}, 1000);
```
