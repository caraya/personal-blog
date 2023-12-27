---
title: Partial function applications
date: 2024-06-30
draft: true
---

Partial application and currying are two techniquest to make functions more flexible and reusable by enabling composition (building complex functions from simpler ones).

If you come from a functional programming background you may be familiar with these techniques.

While we have vanilla Javascript functions to do this, sometimes it may be easier to use a library like [lodash](https://lodash.com/) to do this, particularly if you already use it for other purposes.

## Partial application

Partial application allows us to fix a function’s arguments. This lets us derive new functions, with specific behavior, from other, more general functions.

At the most basic level a partial application functions takes a function and one or more arguments. It returns a new function that calls the original function with all of the arguments.

```js
function partialApply(fn, ...args) {
  return fn.bind(null, ...args);
}
```

so if we have a function like this:

```js
function add(a, b) {
  return a + b;
}
```

## Currying

Currying transforms a function that accepts multiple arguments “all at once” into a series of function calls, each of which involves only one argument at a time. Curried functions with a well-designed argument order are convenient to partially apply.

## Using lodash/fp to create partial functions

## Links and Resources

* [Partial Application in JavaScript](https://learn.microsoft.com/en-us/previous-versions/msdn10/gg575560(v=msdn.10))
* [Partial Function Application in JavaScript and Flow](https://medium.com/@jnkrtech/partial-function-application-in-javascript-and-flow-7f3ca87074fe)
* [How to use partial application to improve your JavaScript code](https://www.freecodecamp.org/news/how-to-use-partial-application-to-improve-your-javascript-code-5af9ad877833/)
* [JavaScript Functional Programming Explained: Partial Application and Currying](https://www.digitalocean.com/community/tutorials/javascript-functional-programming-explained-partial-application-and-currying)
* Lodash
  * [Functional Lodash](https://blog.klipse.tech/javascript/2020/11/26/lodash-fp.html)
  * Functions/Methods
    * [curry](https://lodash.com/docs/4.17.15#curry)
    * [curryRight](https://lodash.com/docs/4.17.15#curryRight)
    * [partial](https://lodash.com/docs/4.17.15#partial)
    * [partialRight](https://lodash.com/docs/4.17.15#partialRight)
