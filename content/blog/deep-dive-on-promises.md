---
title: Deep Dive on Promises
date: 2025-04-23
tags:
  - Javascript
  - Async
  - Promises
baseline: true
---

Promises have been around since 2015 and are a powerful way to handle asynchronous code in Javascript. They allow you to write cleaner, more readable code by avoiding callback hell and making it easier to handle errors.

Newer methods are introduced periodically to improve the functionality of promises, and the async/await syntax has made working with promises even easier.

In this post, we'll take a deep dive into how promises work, their methods, and provide a reference for these methods.

We'll also look at the async/await syntax and how it can be used to simplify promise handling.

## Basic promise support

In Javascript promises represent the eventual completion (or failure) of an asynchronous operation and its resulting value. A promise is in one of three states:

* **Pending**: The initial state of a promise. The operation has not yet completed
* **Fulfilled**: The operation completed successfully and the promise has a resulting value
* **Rejected**: The operation failed and the promise has a reason for the failure

The initial status of a promise is `pending`.

If the operation completes successfully, the promise is `fulfilled`.

If the operation fails, the promise is `rejected`.

### Using the promise constructor

We will first look at the low level ways to create promises.  The promise constructor is a way to create a new promise. It takes a function as an argument, which is called the executor function. The executor function takes two arguments: `resolve` and `reject`. You call `resolve` when the operation completes successfully and `reject` when it fails.

```typescript
function fetchWithRetries(
	url: string,
	retries: number = 3,
	delayMs: number = 500): Promise<any> {
  return new Promise((resolve, reject) => {
    const attempt = (remainingRetries: number) => {
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          return response.json()
        })
        .then(data => resolve(data))
        .catch(error => {
          if (remainingRetries > 0) {
            setTimeout(() => {
              attempt(remainingRetries - 1)
            }, delayMs)
          } else {
            reject(error)
          }
        })
    }

    attempt(retries)
  })
}
```

Then we call the function with the URL we want to fetch, the number of retries, and the delay between retries.

The `then` and `catch` blocks are shorter than they were when we defined the function, all the functionality is encapsulated in the function definition.

```typescript
fetchWithRetries('https://jsonplaceholder.typicode.com/posts/1', 3, 1000)
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error after retries:', error))
```

### Using Promise.withResolvers

<baseline-status featureid="promise-withresolvers"></baseline-status>

`Promise.withResolvers` is a static method ([currently at stage 4 of the TC39 process](https://github.com/tc39/proposal-promise-with-resolvers)). It returns an object containing a new Promise object and two functions to resolve or reject it, corresponding to the two parameters passed to the executor of the `Promise()` constructor.

```typescript
function fetchWithRetries(url: string, retries = 3, delayMs = 500): Promise<any> {
  const { promise, resolve, reject } = Promise.withResolvers<any>()

  const attempt = (remainingRetries: number) => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.json()
      })
      .then(resolve)
      .catch(error => {
        if (remainingRetries > 0) {
          setTimeout(() => attempt(remainingRetries - 1), delayMs)
        } else {
          reject(error)
        }
      })
  }

  attempt(retries)

  return promise
}
```

The `fetchWithRetries` function now uses `Promise.withResolvers` to create a promise and the corresponding resolve and reject functions. The rest of the code remains the same.

```typescript
fetchWithRetries('https://jsonplaceholder.typicode.com/posts/1', 3, 1000)
  .then(data => console.log('Fetched data:', data))
  .catch(error => console.error('Failed after retries:', error))
```

## Simplifying promise creation

<baseline-status featureid="promise"></baseline-status>

<baseline-status featureid="promise-finally"></baseline-status>

Rather than using the promise constructor we can use methods like [then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then), [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch), and [finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally) to create promises. These methods are chainable and allow you to handle the result of the promise in a more readable way.

This is what I saw when I first started working with promises in the context of service workers.

In the example below, we do the following:

1. Fetch JSON data from a URL
2. Check if the response status is ok (or 200), if not we throw an error because something happened
3. Convert the data to JSON
4. Log the data to console
5. If there is an error, we check the type of the returned error
   1. If it's an instance of `Error`, we log the error message
   2. If it's not an instance of `Error`, we log the error as an unknown error
6. The `finally` block will run regardless.

We return `unknown` as the type of the promise to force the user to narrow the type of the promise when used. This way we make sure we get the correct type of the object when we use it. We'll see more about this when we look at an exampe of using the promise.

```typescript
function fetchJsonFromUrl(url: string): Promise<unknown> {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Received data:', data);
      return data;
    })
    .catch((error) => {
      if (error instanceof Error) {
        console.error('Fetch error:', error.message);
      } else {
        console.error('Unknown error occurred:', error);
      }
    })
    .finally(() => {
      console.log("File fetched!");
    });
}
```

Now that the promise is created, we can use it to fetch data from a URL. The promise will return the data as an object, which we can then use in our code.

```typescript
const postUrl = 'https://jsonplaceholder.typicode.com/posts/1';

fetchJsonFromUrl<Post>(postUrl)
  .then((post) => {
    console.log('Post title:', post.title);
    console.log('Post body:', post.body);
  })
  .catch((err) => {
    // Error already logged inside fetchJsonFromUrl
    // Optional extra handling here
    console.log('An error occurred while fetching the post.');
  })
  .finally(() => {
    console.log("Data fetching completed");
  });
```

## Promise methods

<baseline-status featureid="promise"></promise-status>

There are many methods available on the Promise object that allow you to create and manipulate promises. They provide specialized functionality for different use cases. Here are some of the most commonly used methods

### Promise.race

The `Promise.race()` static method takes an iterable of promises as input and returns a single promise.

The promise will fulfill with the status of the first promise that settles (either fulfilled or rejected), and its value will be the value or reason of that promise.

```typescript
const promise1: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, "one");
});

const promise2: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, "two");
});

// Uses Promise.race to return the value of the first promise to resolve
Promise.race<string>([promise1, promise2])
	.then((value: string) => {
		console.log(value); // Result: "two"
	})
	.catch((error: Error) => {
		console.error(error);
	});
```

### Promise.all

`Promise.all` takes an iterable of promises as input and returns a single Promise.

The returned promise fulfills when all of the input's promises fulfill with an array of the fulfillment values for each of the input's promise. It rejects when any of the input's promises rejects, with this first rejection reason.

```typescript
// A resolved Promise with a number
const promise1: Promise<number> = Promise.resolve(3)

// A number value that can be treated as a resolved Promise in Promise.all
const promise2: number = 42

// A Promise that resolves to a string after 100ms
const promise3: Promise<string> = new Promise((resolve) => {
  setTimeout(resolve, 100, 'foo')
})

// Use Promise.all to resolve all values and log the result
Promise.all([promise1, promise2, promise3]).then((values: [number, number, string]) => {
  console.log(values)
  // Expected output: Array [3, 42, "foo"]
})
```

### Promise.allSettled

<baseline-status featureid="promise-allsettled"></baseline-status>

`Promise.allSettled` takes an iterable of promises as input and returns a single Promise.

The returned promise fulfills when all of the input's promises fulfill with an array of the fulfillment values for each of the input's promise, regardless of whether they fulfill or reject.

```typescript
const promise1: Promise<number> = Promise.resolve(3);

const promise2: Promise<string> = new Promise((_, reject) =>
  setTimeout(() => reject("foo"), 100)
);

const promises: Promise<unknown>[] = [promise1, promise2];

Promise.allSettled(promises).then((results: PromiseSettledResult<unknown>[]) => {
  results.forEach((result) => {
    console.log(result.status);
    // Narrow the type using a type guard
    if (result.status === "fulfilled") {
      console.log("Value:", result.value);
    } else {
      console.log("Reason:", result.reason);
    }
  });
});
```

### Promise.any

<baseline-status featureid="promise-any"></baseline-status>

`Promise.any` takes an iterable of promises as input and returns a single Promise.

The returned promise fulfills when any of the input's promises fulfills, with this first fulfillment value.

It rejects when all of the input's promises reject with an [AggregateError](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError) containing an array of all rejection reasons. Otherwise, promise.all will ignore rejections.

```typescript
// Define each promise can resolve to
const promise1: Promise<never> = Promise.reject(0);

const promise2: Promise<string> = new
Promise((resolve) =>
  setTimeout(resolve, 100, "quick")
);

const promise3: Promise<string> = new
Promise((resolve) =>
  setTimeout(resolve, 500, "slow")
);

// Combine the promises into an array with the correct union type
const promises: Promise<string>[] = [promise1, promise2, promise3];

Promise.any(promises)
	.then((value: string) => {
		console.log(value);
	})
	.catch((error: AggregateError) => {
		console.error("All promises were rejected:", error);
	});
```

### Promise.try

<baseline-status featureid="promise-try"></baseline-status>

`Promise.try` takes a callback of any kind and wraps its result in a Promise.

Without `promise.try` any asynchronous error the function throws may not bubble up to the caller and will not be the reason for rejection.

If the callbacks return a value, the returned promise will be resolved with that value.

If the callback throws an error, the returned promise will be rejected with that error.

In the example below, the function may throw an error, but we want it to be the reason the promise reject.

```typescript
// A function that might throw an error
function mightThrow(): number {
  if (Math.random() > 0.5) {
    throw new Error('Something went wrong!');
  }
  return 42;
}

// Use Promise.try to safely wrap the function
Promise.try(() => mightThrow())
  .then((result) => {
    console.log('Success:', result)
  })
  .catch((error) => {
    console.error('Caught error:', error.message)
  })
```

## Async/Await

<baseline-status featureid="async-await"></baseline-status>

Async/await is a syntax introduced in ES2017 that allows you to write asynchronous code in a more synchronous style. It is built on top of promises and makes it easier to read and write asynchronous code.

```typescript
export async function fetchJson(url: string): Promise<any> {
  try {
    const response = await fetch(url)

    // Check if the response status is OK (status code in the range 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received data:', data)
    return data
  } catch (error) {
    console.error('Failed to fetch JSON data:', error)
    // Rethrow the error to be handled by the calling code if needed
    throw error
  }
}
```

### Top level await

<baseline-status featureid="top-level-await"></baseline-status>

`await` is usually used to unwrap promises by passing a Promise as the expression. Using await pauses the execution of its surrounding async function until the promise is settled (that is, fulfilled or rejected). When execution resumes, the value of the await expression becomes that of the fulfilled promise.

If the promise is rejected, the await expression throws the rejected value. The function containing the await expression will appear in the stack trace of the error. Otherwise, if the rejected promise is not awaited or is immediately returned, the caller function will not appear in the stack trace.

Because await is only valid inside async functions and modules, which themselves are asynchronous and return promises, the await expression never blocks the main thread and only defers execution of code that actually depends on the result.

```typescript
function resolveAfter2Seconds<T>(x: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(x)
    }, 2000)
  })
}

async function f1(): Promise<void> {
  const x = await resolveAfter2Seconds(10)
  console.log(x) // 10
}

f1()
```

## Notes

Some notes from having reseached promises and working with them.

### Difference between raw promises and Promise.any

Early on I struggled with the difference between raw promises and `Promise.any`. If they both return a single promise then what's the difference?

Raw promises work on a single promise, while `Promise.any` works on multiple promises. The key difference is that `Promise.any` will return the first successful result among multiple candidates, while raw promises will only resolve when the single promise resolves.

| Feature	| Raw Promise (promise.then) |Promise.any([...]) |
| :---: | --- | --- |
| Input	| One promise | Multiple promises |
| Resolves when | That one promise fulfills | The first of any promises fulfills |
| Rejects when | That one promise rejects | All promises reject |
| Error object | Standard Error | AggregateError |
| Use case | Handle result of a single async operation | Use first successful result among multiple candidates |

### Difference between Promise.all and Promise.allSettled

`Promise.all` will reject as soon as one of the promises in the iterable rejects, while `Promise.allSettled` will wait for all promises to settle (either fulfilled or rejected) and return an array of objects describing the outcome of each promise.

Which one you use depends on your use case. If you want to stop as soon as one promise fails, use `Promise.all`. If you want to wait for all promises to complete regardless of their outcome, use `Promise.allSettled`.

This is different than using `Promise.any` which will return the first promise that resolves.

### When to use Async/Await

Other than specific situations that may not have a full equivalent with Async/Await, async/await is more readable and easier to understand than raw promises.

Use async/await when:

* You want readable, synchronous-looking code
* You need try/catch for better error handling
* You're running sequential async steps
* You're looping through async tasks

Use raw Promises when:

* You need to fire things off in parallel using `Promise.all` or `Promise.allSettled`
* You're managing complex promise chains or combining with legacy code
