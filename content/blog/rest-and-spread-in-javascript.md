---
title: Rest and Spread in Javascript
date: 2025-07-28
tags:
  - Javascript
  - Typescript
  - Rest
  - Spread
---

Javascript has two syntaxes that use the same representation: Rest and Spread. This post will explore the two syntaxes, their differences, and how to use them in Javascript and Typescript.

## The Core Idea: Gathering vs. Expanding

At its heart, the distinction between rest and spread is about direction:

* **Rest Parameters**: Gathers multiple elements and "condenses" them into a single array.
* **Spread Syntax**: Expands an iterable (like an array or string) into its individual elements.

## Rest Parameters: Collecting an Indefinite Number of Arguments

The rest parameter syntax allows a function to accept an indefinite number of arguments as an array. This is particularly useful when you want to create functions that can handle a variable number of inputs.

What it does:

In a function's parameter list, `...` followed by a parameter name will gather all remaining arguments passed to the function into an array.

This array will contain all arguments from the point the rest parameter is declared to the end.

!!! note **Note**
A function can only have one rest parameter, and it must be the last parameter in the function's signature.
!!!

Example:

```js
function sum(...numbers) {
  return numbers.reduce((total, current) => total + current, 0);
}

console.log(sum(1, 2, 3));
// Output: 6
console.log(sum(10, 20, 30, 40));
// Output: 100
console.log(sum());
// Output: 0
```

In this example, the `...numbers` syntax collects all the arguments passed to sum into an array called numbers.

## Spread Syntax: Unpacking Elements

The spread syntax does the opposite of rest parameters. It takes an iterable (like an array, string, or object) and expands it into its individual components.

What it does:

* **In function calls**: Spreads the elements of an array as individual arguments to a function.
* **In array literals**: Creates a new array containing the elements of another array
  * This is a common way to create a shallow copy or concatenate arrays.
* **In object literals**: Copies the properties from one object to another
  * This is useful for creating shallow copies of objects or merging objects.

Examples:

In Function Calls:

```js
const numbers = [1, 2, 3, 4, 5];
console.log(Math.max(...numbers));
// Equivalent to Math.max(1, 2, 3, 4, 5)
// Output: 5
```

In Array Literals:

```js
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Concatenating arrays
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Creating a shallow copy
const copy = [...arr1];
copy.push(4);
console.log(arr1);
// [1, 2, 3] (original is unchanged)
console.log(copy);
// [1, 2, 3, 4]
```

In Object Literals:

```js
const obj1 = { name: 'Alice', age: 30 };
const obj2 = { city: 'New York', country: 'USA' };

// Merging objects
const mergedObj = { ...obj1, ...obj2 };
// {
// 	name: 'Alice',
// 	age: 30,
// 	city: 'New York',
// 	country: 'USA'
// }

// Creating a shallow copy
const copyObj = { ...obj1 };
```

## Key Differences Summarized

| Feature | Rest Parameters | Spread Syntax |
| --- | --- | --- |
| Purpose | Gathers remaining function arguments into an array. | Expands an iterable into its individual elements. |
| Location | In function parameter declarations. | In function calls, array literals, or object literals. |
| Direction | Condenses multiple elements into one array. | Expands one iterable into multiple elements. |

## The Typescript Difference: The Power of Types

The fundamental behavior of rest and spread in Typescript is identical to JavaScript. The key difference lies in Typescript's static type system, which adds a layer of type safety.

### What Typescript Adds

**Type Checking for Rest Parameters**: You must define the type of the elements within the rest parameter's array. This ensures that the function only receives arguments of the expected type.

For example, if you want a function that sums numbers, you can define it like this:

```ts
function sum(...numbers: number[]): number {
  return numbers.reduce((total, current) => total + current, 0);
}
```

This call to `sum()` is valid:

```ts
sum(1, 2, 3);
```

This call to `sum()` will cause a compile-time error:

```ts
sum(1, '2', 3);
```

The error reported will be: ***Argument of type 'string' is not assignable to parameter of type 'number'***.

**Type Inference with Spread Syntax**: Typescript's type inference works seamlessly with the spread syntax, correctly inferring the type of the resulting array or object.

```ts
const arr1: number[] = [1, 2, 3];
const arr2: number[] = [4, 5, 6];

const combined = [...arr1, ...arr2];
// Typescript infers 'combined' as number[]

interface Person {
  name: string;
  age: number;
}

interface Location {
  city: string;
}

const person: Person = { name: 'Bob', age: 42 };
const location: Location = { city: 'London' };

const merged = { ...person, ...location };
// Typescript infers 'merged' as
// { name: string; age: number; city: string; }
```

Typescript doesn't change what rest and spread do but enhances their usage with compile-time type checking, leading to more robust and predictable code. This helps catch potential bugs early in the development process that might go unnoticed in plain JavaScript.
