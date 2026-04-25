---
title: "JavaScript and TypeScript Promises"
date: 2026-06-10
tags:
  - Javascript
  - Typescript
  - Promises
  - Async/Await 
---

A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It acts as a proxy for a value not necessarily known when the promise is created.

## Core Concepts and Lifecycle

Every Promise exists in one of three mutually exclusive states:

* **Pending**: The initial state; the operation has not yet completed.
* **Fulfilled**: The operation completed successfully. The promise now holds a permanent value.
* **Rejected**: The operation failed. The promise now holds a permanent reason (typically an Error object).

Once a promise is either fulfilled or rejected, it is settled. A settled promise's state and value can never change again.

## Creating and Triggering Promises

There are three primary ways to obtain or trigger a promise in JavaScript:

### Wrapping Non-Promise Asynchronous Code (The Constructor)

Use the Promise constructor to turn a callback-based API or a manual delay into a promise. It takes an "executor" function which runs immediately and receives two callbacks: `resolve` and `reject`.

```ts
const delayedMessage = new Promise<string>((resolve, reject) => {
  const success = true;

  // setTimeout is a classic 'source' of a promise
  setTimeout(() => {
    if (success) {
      resolve("Operation successful");
    } else {
      reject(new Error("Operation failed"));
    }
  }, 1000);
});
```

### Consuming Asynchronous Web APIs

Most modern Web and Node.js APIs are "Promise-native," returning a promise automatically. Common sources include:

* Network Requests: `fetch("https://api.example.com")` returns a `Promise<Response>`.
* File System (Node.js): `fs.promises.readFile("config.json")` returns a `Promise<Buffer>`.
* Media Devices: `navigator.mediaDevices.getUserMedia()` returns a `Promise<MediaStream>`.

### Wrapping Synchronous Code

You can wrap synchronous code in a promise using `Promise.resolve()` or the constructor. However, remember that the executor function runs synchronously.

```ts
const syncPromise = new Promise<string>((resolve) => {
  // This loop still blocks the main thread!
  for (let i = 0; i < 1e9; i++) {}
  resolve("Done");
});
```

Why wrap synchronous code?

* **API Consistency**: If a function sometimes returns a cached value and sometimes fetches data, returning a promise for both allows the caller to use a consistent await pattern.
* **Error Normalization**: Promises automatically catch synchronous throw statements and convert them into rejections.

## Consuming Promises: Chaining

Before `async/await`, the primary way to interact with promises was through instance methods. These methods always return a new promise, allowing for "chaining."

* **`.then(onFulfilled, onRejected)`**: Appends fulfillment and rejection handlers.
* **`.catch(onRejected)`**: A shorthand for `.then(null, onRejected)`.
* **`.finally(onFinally)`**: Runs a callback regardless of the outcome; used for cleanup.

### The Mechanics of Chaining

The `.then()` method returns a new promise. If the handler returns a value, the new promise resolves with that value. If the handler returns another promise, the new promise "follows" that promise.

Note on Handler Optionality:

The `.then()` method does not require both handlers. If a handler is omitted, the promise state "passes through" to the next link in the chain. This "bubbling" allows a single `.catch()` at the end of a chain to handle an error from any preceding step.

```ts
fetchUser(id)
  .then((user: User) => {
    return fetchPermissions(user.role);
  })
  .then((permissions: string[]) => {
    console.log("Permissions received:", permissions);
  })
  .catch((error: Error) => {
    console.error("Chain failed:", error);
  });
```

## Static Promise Methods

Modern JavaScript provides static methods to manage promise creation and concurrency.

### Utility Methods

* **`Promise.resolve(value)`**: Returns a `Promise` object resolved with the given value.
* **`Promise.reject(reason)`**: Returns a `Promise` object rejected with the given reason.

### Concurrency Methods

* **`Promise.all(iterable)`**: Fulfills when all promises fulfill. Rejects immediately if any reject (fail-fast).
* **`Promise.allSettled(iterable)`**: Waits until all promises settle. Returns an array of state objects: `{ status: 'fulfilled', value: T }` or `{ status: 'rejected', reason: any }`.
* **`Promise.race(iterable)`**: Settles as soon as the first promise settles (either fulfills or rejects).
* **`Promise.any(iterable)`**: Fulfills as soon as the first promise fulfills. Rejects only if all reject.

## The Async/Await Abstraction

Introduced in ES2017, async/await is "syntactic sugar" over promises that simplifies asynchronous control flow.

* **async functions**: Always return a `Promise`.
* **await expression**: Pauses execution until the promise settles, then returns the value or throws the error.

```ts
async function updatePermissions(id: string): Promise<void> {
  try {
    const user = await fetchUser(id);
    const permissions = await fetchPermissions(user.role);
    await applyPermissions(user, permissions);
  } catch (error) {
    console.error("Update failed", error);
  }
}
```

## Async/Await vs Promise Chains: When to Use Each

Use `async/await` as your default for linear, step-by-step workflows. It reads like synchronous code and is usually easier to debug.

```ts
async function buildUserProfile(id: string): Promise<UserProfile> {
  const user = await fetchUser(id);
  const settings = await fetchSettings(user.id);
  return combineProfile(user, settings);
}
```

Use promise chains when the logic is naturally expressed as a transformation pipeline.

```ts
function loadDisplayName(id: string): Promise<string> {
  return fetchUser(id)
    .then((user) => user.name)
    .then((name) => name.trim())
    .then((name) => name.toUpperCase())
    .catch((error) => {
      console.error("Failed to load display name", error);
      throw error;
    });
}
```

There is no universal winner. Prefer the style that makes the function easiest to read and maintain.

Rule of thumb:

* Use `async/await` for imperative flows.
* Use chains for composition-heavy flows.
* In both styles, run independent work concurrently with `Promise.all()` instead of awaiting sequentially.

## Cancellation with AbortController

Native promises do not have a built-in cancel() method. Use the AbortController API to communicate cancellation to asynchronous operations like fetch.

```ts
const controller = new AbortController();
const signal = controller.signal;

type ApiData = { items: string[] };

function isApiData(value: unknown): value is ApiData {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray((value as { items: unknown }).items)
  );
}

async function fetchData(): Promise<unknown> {
  try {
    const response = await fetch("https://api.example.com/data", { signal });
    return await response.json();
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      console.log("Fetch was cancelled");
    } else {
      throw err;
    }
  }
}

// Trigger cancellation
controller.abort();

async function run(): Promise<void> {
  const result = await fetchData();

  if (!isApiData(result)) {
    throw new Error("Unexpected response shape");
  }

  // From here, TypeScript knows `result` is ApiData.
  console.log(result.items.length);
}
```

## Execution Order: The Microtask Queue

JavaScript uses a Microtask Queue to handle promise callbacks, which interacts with the Event Loop differently than standard tasks.

* **Priority**: Promise callbacks run before timer callbacks such as `setTimeout(..., 0)`.
* **Execution Timing**: After the current synchronous code finishes, JavaScript processes pending promise callbacks before moving on to the next task.

```ts
console.log("A: sync start");

Promise.resolve().then(() => {
  console.log("C: promise microtask");
});

setTimeout(() => {
  console.log("D: timeout task");
}, 0);

console.log("B: sync end");
// Expected order: A, B, C, D
```

## Why You Should Type Your Promises

In TypeScript, `Promise<T>` is not just style; it is part of your function contract.

When you annotate a promise return type, you define exactly what `await` will produce for every caller. That gives you stronger editor help, safer refactoring, and earlier feedback when the resolved value shape changes.

If you skip explicit typing at boundaries, the resolved type can become too broad (or effectively opaque), and mistakes move downstream to call sites where they are harder to diagnose.

```ts
// Clear contract for callers.
async function getCurrentUser(): Promise<User> {
  const response = await fetch("https://api.example.com/me");
  return (await response.json()) as User;
}
```

Use this rule of thumb: let inference work inside small local expressions, but type promises explicitly at module and API boundaries.

## Technical Best Practices (TypeScript)

* **Use the Constructor for Bridging, Not Re-Wrapping**: `new Promise(...)` is appropriate when converting callback- or event-based APIs into promises. Be aware that the executor runs immediately and synchronously, so heavy work inside it can still block the main thread.
* **Avoid the Promise Constructor Anti-pattern**: Do not wrap an existing promise in another `new Promise(...)`; return the original promise chain directly.
* **Type Your Promises**: Always use `Promise<T>` explicitly.
* **Avoid Waterfalling**: Use `Promise.all()` for independent tasks instead of awaiting them sequentially.
* **Handle Floating Promises**: Use the `@typescript-eslint/no-floating-promises` rule to ensure every promise is properly awaited or caught.

## Conclusion

Promises are the foundation of modern JavaScript and TypeScript asynchronous code, and most real-world reliability issues come from a small set of habits rather than obscure APIs.

If you remember just a few things, make them these: model async flows with clear promise chains or `async/await` (see **Consuming Promises: Chaining** and **The Async/Await Abstraction**), compose independent work with the right concurrency method (see **Static Promise Methods**), annotate promise types at boundaries (see **Why You Should Type Your Promises**), and always handle rejections deliberately (see **The Mechanics of Chaining** and **Technical Best Practices (TypeScript)**).

When those practices become your default, asynchronous code becomes easier to reason about, test, and maintain as your project grows.
