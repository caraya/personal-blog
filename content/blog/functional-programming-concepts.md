---
title: Functional Programming Concepts
date: 2025-04-21
tags:
  - Javascript
  - Functional Programming
draft: true
---

Functional programming is a programming paradigm that treats computation as the evaluation of mathematical functions and avoids changing-state and mutable data.

This post will explore basic concepts of functional programming and how you can apply them in Javascript.

## Primitives

Primitives are all datatypes that can hold only one value at a time. JavaScript has 7 primitive data types.

string
: Represents text.

number
: Represents numerical values.

boolean
: Represents true or false.

undefined
: Indicates a variable has not been assigned a value.

null
: Represents an intentional absence of any object value.

Symbol
: Creates unique identifiers.

BigInt
: Handles numbers larger than the standard number type can.

## Composite Data Types

Composite data types can store collections or combinations of values.

Object
: A structure that can hold multiple values as named properties.

Array
: A list-like structure that holds values in a specific order.

Map
: A collection of keyed data items, similar to an object but with keys of any type and maintains the order of insertions.

Set
: A collection of unique values. Like an array, but each value can only occur once.

## Functions

A function is a process that can take inputs, called parameters, and can produce some output called return value.

### Parameters vs. Arguments

Parameters
: variables defined in the function declaration. They act as placeholders for the values that a function will operate on.

Arguments
: The values or data passed to the function when it is called. These values replace the parameters during the function's execution.

Application
: The arguments are used to replace the function's parameters. This allows the function to perform its task using the provided arguments.

### Pure Functions

A function is a pure function if:

* Given the same inputs, it returns the same output
* It has no side-effects.

Pure functions are deterministic. A pure function will always produce the same output for the same set of inputs, no matter when or how many times it is called.

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

`add(2, 3)` will always return `5`, regardless of when or how many times it is called.

### Higher Order functions

Higher-order functions are functions that can take other functions as arguments or return functions as results. This allows for the creation of more modular and reusable code by treating functions as first-class citizens.

```typescript
const add = (x: number, y: number): number => x + y;

// Applies a binary operation to two numbers.
const applyOperation = (fn: (a: number, b: number) => number, a: number, b: number): number => {
  return fn(a, b);
};

// Example usage
const result = applyOperation(add, 5, 3); // result = 8

```

### Function Composition

The combination of two or more functions to produce a new function that represents the composition of the original ones.

In JavaScript we can manually compose functions or use third party libraries like Ramda.

```typescript
// Adds 1 to the input number
const add = (x: number): number => x + 1;

// Multiplies the input number by 2
const multiply = (x: number): number => x * 2;

// Composes two unary functions
const compose = (
  f: (x: number) => number,
  g: (x: number) => number
): ((x: number) => number) => x => f(g(x));

const addThenMultiply = compose(multiply, add);

console.log(addThenMultiply(5)); // 12
```

### Idempotence

Idempotence is a property of certain operations in which no matter how many times you perform the operation, the result remains the same after the first application. For example, setting a value to 5 is idempotent because no matter how often you do it, the value remains 5.

```typescript
let number: number = 5;
number = 5; // still 5
number = 5; // no change, still 5
```

All pure functions are idempotent, but not all idempotent functions are pure functions.

An idempotent function can cause idempotent side-effects. A pure function can't have side-effects, so it can't be idempotent in the same way.

Deleting a record in a database by ID is idempotent, because the row of the table stays deleted after subsequent calls. Additional calls do nothing.

### Referential Transparency

Idempotent functions without side-effects have a feature known as referential transparency.

That means that if you have a function call:

```typescript
const result: number = square(7);
```

You could replace that function call with the result of square(7) without changing the meaning of the program. So you could change the code above to:

```typescript
const result: number = 49;
```

and your program would still work the same.

### Partial Application

Partial function application in JavaScript involves pre-filling some of a function's arguments, creating a new function with fewer parameters. This can be achieved using JavaScript's bind method or with a custom implementation.

The first example uses a custom partial function implementation:

```typescript
// Creates a partially applied function with preset arguments.
function partial<T extends any[], U>(
  func: (...args: T) => U,
  ...presetArgs: Partial<T>
): (...laterArgs: any[]) => U {
  return (...laterArgs: any[]) => func(...presetArgs, ...laterArgs) as U;
}

// Greets a person with a given greeting.
function greet(greeting: string, name: string): string {
  return `${greeting}, ${name}!`;
}

// Partially apply the first argument
const sayHello = partial(greet, "Hello");

console.log(sayHello("Alice")); // "Hello, Alice!"
console.log(sayHello("Bob"));   // "Hello, Bob!"
```

The function signature is as follows:

* Generic Types
  * `T extends any[]`: A tuple representing the argument types of the original function.
  * `U`: The return type of the original function
* Parameters:
  * `func`: A function that takes arguments of type T and returns U
  * `...presetArgs`: A partial list of arguments from T. These are the arguments you want to "pre-fill"

The returned function:

* Accepts any number of `laterArgs`.
* Calls the original `func`, combining the `presetArgs` and `laterArgs`.

The second example uses arrow functions and partially applies the first argument:

```typescript
const add = (a: number, b: number) => a + b;

// Partially apply the first argument
const add5 = (b) => add(5, b);

console.log(add5(10)); // Output: 15
```

### Currying

Currying is a transformative technique in functional programming where a function with multiple arguments is converted into a sequence of functions, each taking a single argument. This approach not only makes your functions more modular but also enhances the reusability and composability of your code.

Currying allows for the creation of higher-order functions that can be customized and reused with different arguments at various points in your application. It's particularly useful for:

```typescript
// Adds two numbers.
function add(a: number, b: number): number {
  return a + b;
}

// Curries the addition function.
function curriedAdd(a: number): (b: number) => number {
  return function (b: number): number {
    return a + b;
  };
}

const addFive = curriedAdd(5);
console.log(addFive(3)); // Outputs: 8
```

This example shows how currying can turn a simple addition function into a more versatile and reusable function.

While currying and partial application both involve breaking down functions into simpler, more specific functions, they are not the same:

* Currying converts a function with multiple arguments into a sequence of nesting functions, each taking exactly one argument.
* Partial Application involves creating a function with a smaller number of parameters by pre-filling some of the arguments.

Both techniques are valuable in functional programming and can be used to simplify complex function signatures and improve code modularity.

By leveraging currying, developers can enhance function reusability and composition, leading to clearer and more maintainable code in JavaScript projects.

### Memoization

Memoization is an optimization technique used in functional programming to speed up computer programs by storing the results of expensive function calls and returning the cached result when the same inputs occur again. It is particularly useful in JavaScript for optimizing performance in applications involving heavy computational tasks.

Memoization reduces the number of computations needed for repeated function calls with the same arguments.

It improves application responsiveness by caching results of time-consuming operations.

Memoization also help manage larger datasets or more complex algorithms by minimizing the computational overhead.

Here's a basic example of a memoized function in JavaScript:

```typescript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = args.toString();
    if (!cache[key]) {
      cache[key] = fn.apply(this, args);
    }
    return cache[key];
  };
}

const factorial = memoize(function(x) {
  if (x === 0) {
    return 1;
  } else {
    return x * factorial(x - 1);
  }
});

// Calculates and caches the result
console.log(factorial(5));

// Returns the cached result
console.log(factorial(5));
```

This example caches the results of a factorial calculation, significantly reducing the computation time for repeated calls.

Benefits and Potential Drawbacks of Memoization:

* Benefits:
  * Significantly reduces the processing time for repeated operations
  * Improves application efficiency by avoiding redundant calculations.
  * Easy to implement with higher-order functions.
* Drawbacks:
  * Increases memory usage due to caching
  * Not suitable for functions with non-deterministic outputs or functions with side effects

By understanding and implementing memoization, you can optimize their JavaScript applications, making them faster and more efficient. However, it's important to consider the trade-offs in terms of additional memory usage and ensure that memoization is applied only where it provides clear benefits.

### Closures

A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In other words, a closure gives a function access to its outer scope. In JavaScript, closures are created every time a function is created, at function creation time.

```typescript
const createCounter = (): () => number => {
  let count: number = 0

  return (): number => ++count
}

const counter = createCounter();

console.log(counter()) // 1
console.log(counter()) // 2
console.log(counter()) // 3
```

In this example, the `createCounter` function returns an inner function that increments the `count` variable. The `count` variable is accessible to the inner function due to the closure created when the inner function is defined.

### Laziness

We can improve efficiency of the code by delaying computation until its result is needed to. In Javascript we can improve efficiency using [generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) and [iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Iterator).

```typescript
function* lazySequence(): Generator<number, never, unknown> {
  let i = 0
  while (true) {
    yield i++
  }
}

const seq = lazySequence();
console.log(seq.next().value); // 0
console.log(seq.next().value); // 1
```

### Monads

[Monads](https://en.wikipedia.org/wiki/Monad_(functional_programming)) are a type of abstract data type used in functional programming to handle side effects while maintaining pure functional principles. They encapsulate behavior and logic in a flexible, chainable structure, allowing for sequential operations while keeping functions pure.

They provide a framework for dealing with side effects (like IO, state, exceptions, etc.) in a controlled manner, helping maintain functional purity and composability. In JavaScript, Promises are a familiar example of a monadic structure, managing asynchronous operations cleanly and efficiently.

```typescript
// Generic Maybe monad for handling optional values.
class Maybe<T> {
  private value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.value = value;
  }

  // Wraps a value in a Maybe.
  static of<T>(value: T | null | undefined): Maybe<T> {
    return new Maybe(value);
  }

  // Checks if the value is null or undefined.
  isNothing(): boolean {
    return this.value === null || this.value === undefined;
  }

  // Applies a function to the contained value if it exists.
  map<U>(fn: (value: T) => U): Maybe<U> {
    if (this.isNothing()) {
      return new Maybe<U>(null);
    }
    return Maybe.of(fn(this.value as T));
  }

  // Provides a fallback value if the current value is null or undefined.
  orElse(defaultValue: T): T {
    return this.isNothing() ? defaultValue : (this.value as T);
  }
}

// Example
const validResult = Maybe.of(10)
  .map((x) => x * 2)
  .map((x) => x + 5)
  .orElse

```

### Examples

The first example shows a pure function to calculate the factorial of a numnber passed as parameter.

```typescript
function factorial(n: number): number {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
```

The next example shows a higher-order function that takes an array and a function as arguments and applies the function to each element of the array.

It also demonstrates immutability. The `numbers` array is not modified by the `map` function, it creates a new array with the modified values.

```js
// Applies a given function to each element of the array
// and returns a new array with the results.
function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  const result: U[] = []
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]))
  }
  return result
}

const numbers = [1, 2, 3, 4];
const doubled = map(numbers, (x) => x * 2);
```

The next example shows function composition using the `compose` function. This function takes two functions as arguments and returns a new function that applies the second function to the result of the first function.

```typescript
// Composes two functions `f` and `g`, where the output of `g` is passed to `f`.
function compose<T, U, V>(f: (arg: U) => V, g: (arg: T) => U): (x: T) => V {
  return function (x: T): V {
    return f(g(x));
  };
}

const increment = (x: number): number => x + 1;
const square = (x: number): number => x * x;

const squareThenIncrement = compose(increment, square);
const result = squareThenIncrement(2);

console.log(result); // Output: 5
```

The last example shows currying in action. The `add` function takes two arguments and returns their sum. The `curry` function takes a function and returns a new function that takes one argument and returns a function that takes the second argument and applies the original function to both arguments.

```typescript
// Returns a function that adds a given number to `x`.
function add(x: number): (y: number) => number {
  return function(y: number): number {
    return x + y;
  };
}

const add5 = add(5);
const result = add5(3); // 8
```

## Functional Programming and side effects

In programming, a side effect refers to any operation that modifies some state outside of its local environment or interacts with the outside world during function execution. This could include:

* Modifying a global variable
* Changing the value of ab object passed in
* Writing to a file or database
* Logging to the console
* Making a network request
* Mutating input data

Avoiding side effects helps with:

* **Predictability**: Pure functions are easier to reason about
* **Testability**: Since they don’t depend on or modify external state, they can be tested in isolation
* **Debuggability**: No hidden changes or state makes tracking bugs simpler
* **Concurrency & Parallelism**: Pure functions are inherently thread-safe

Here are additional examples of pure functions:

This function adds two numbers without causing any side effects.

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

The next function takes an array of numbers and returns a new array with each number doubled. `Array.map()` does not modify the original array so we don't have to worry about side effects.

```typescript
function doubleArray(arr: number[]): number[] {
  return arr.map(n => n * 2);
}
```

The `isEven` function checks if a number is even. It does not modify any external state or have side effects.

```typescript
function isEven(n: number): boolean {
  return n % 2 === 0;
}
```

There are times when we have to deal with side effects in functional programming. In these cases we can isolate the side-effects to their own functions and then use them to build our pure functions.

For example, we want to log something without mixing logging logic inside our functional code.

```typescript
// Pure function that formats a message
function formatMessage(name: string): string {
  return `Hello, ${name}!`
}

// Impure function handles the logging side effect
function logMessage(message: string): void {
  console.log(message)
}

// Main function wires everything together
function greet(name: string): void {
  const msg = formatMessage(name)
  // side effect isolated here
  logMessage(msg)
}

greet('Alice')
```

`formatMessage` is pure. Logging is done separately in `logMessage`, which makes testing and debugging easier.

Another example is fetching data in a Functional Style
Here’s how you might structure data fetching:

```typescript
// Pure function that builds a URL
function buildUrl(userId: number): string {
  return `https://jsonplaceholder.typicode.com/users/${userId}`
}

// Side-effect function fetch the URL
async function fetchUser(url: string): Promise<Response> {
  return fetch(url)
}

// Function orchestrates other functions
async function getUserById(userId: number): Promise<void> {
  const url = buildUrl(userId)  // pure
  const response = await fetchUser(url) // side effect here
  const data = await response.json()
  console.log(data) // side effect
}

getUserById(1)
```

## Links and resources

* [The Rise and Fall and Rise of Functional Programming (Composing Software)](https://medium.com/javascript-scene/the-rise-and-fall-and-rise-of-functional-programming-composable-software-c2d91b424c8c)
* [Deeply Understand Currying in 7 Minutes](https://www.yazeedb.com/posts/deeply-understand-currying-in-7-minutes)
* [Learn Reduce in 10 Minutes](https://www.yazeedb.com/posts/learn-reduce-in-10-minutes)
* [JavaScript Map, Reduce, and Filter - JS Array Functions Explained with Code Examples](https://www.freecodecamp.org/news/javascript-map-reduce-and-filter-explained-with-examples/)
