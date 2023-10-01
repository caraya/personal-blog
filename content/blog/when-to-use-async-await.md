---
title: "When to use async/await"
date: "2023-02-22"
---

One of the first things that caught my attention when ES2015 was first released in 2015 were promises. They provide a nice alternative to callbacks and made the code easier for me to reason through.

In 2017 TC39 (the group in charge of Javascript standardization) added async/await, a way to make promise code easier to read and reason through, to the ECMA262 specification, essentially writing promise-based asynchronous code as it was synchronous blocks of code that, as developers, we're already familiar with.

The idea sounds simple enough but I always trip on the execution. This post is my attempt at figuring out the differences between promises and async/await and how to use them.

First, let's look at a promise-based example. The code below fetches the latest post from a site's WordPress Rest API, parses it as JSON and then logs it to the console.

```js
function fetchData() {
  fetch('https://wordpress-example-site.com/wp-json/wp/v2/posts?per_page=1&embedded=true')
  .then((response) => {
    if (!response.ok) {
      throw new Error("HTTP error, status = " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    this.data = data;
    console.log('Success:', this.data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
```

This is the code I'm most familiar with and it's the way I've done asynchronous code since 2015. For someone just learning Javascript this may look overtly complicated, particularly when we add `.then()` statements to do more work with the code we fetched.

Using `async` and `await` makes the code easier to read without changing its asynchronous nature.

To make `async/await` code work we need to do a few things differently:

1. The code must be wrapped in an async function
2. For convenience's sake use [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) blocks. These are equivalent to `.then` and `.catch` promises
3. In the try block, we use the `await` keyword instead of `.then`
4. The `catch` block is identical in function to the `.catch` portion of a promise chain

The code using `async/await` looks like this:

```js
async function fetchData() {
  try {
    const response = await fetch('https://wordpress-example-site.com/wp-json/wp/v2/posts?per_page=1&embedded=true')
    const data = await response.json();
    console.log('Success: ', data);
    return data;
  }
  catch(error) {
    console.log('fetch failed', error);
  }
};
```

If you got used to using promise chains then `async/await` may be hard but the real value comes when you're working with long promise chains.

| Promise | Async/Await |
| --- | --- |
| Promise is an object representing the state of an operation that will finish running at some point in the future. | Async/Await is a syntactic sugar for promises, a wrapper making the code execute more synchronously. |
| Promise has 3 states – resolved, rejected, and pending. | It does not have any states. It returns a promise either resolved or rejected. |
| If the function “fxn1” executes after the promise, then `promise.then(fxn1)` continues execution of the current function after adding the fxn1 call to the callback chain. | If the function “fxn1” is executed after await, then `await X()` suspends execution of the current function and then fxn1 is executed |
| Error handling is done using `.then()` and `.catch()` methods. | Error handling is done using .`try()` and `.catch()` methods. |

There is also an issue of browser support.

Promises were introduced in 2015 and `async/await` in 2017 so for a while there was a gap in support for `async/await` code, all browsers that support `async/await` support promises but not all browsers that support promises support `async/await`.

This shouldn't be a problem now since all browsers support [async](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [await](https://caniuse.com/mdn-javascript_operators_await) but depending on many older browsers do you need to support this may or may not become an issue.

Finally, to answer the specific question on the title of this post: You can use `async/await` anywhere you would use promises.

## Links and Resources

- [Async functions: making promises friendly](https://web.dev/async-functions/) — web.dev
- [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) — MDN
