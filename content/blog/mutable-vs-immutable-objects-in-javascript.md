---
title: Mutable vs Immutable Objects in Javascript
date: 2025-06-11
tags:
  - Javascript
  - Web
baseline: true
---

Even outside of functional programming, Javascript provides mutable and immutable functions and methods to process data. Which one you use depends on the context of the application you're working on.

In this post, we'll explore the differences between mutable and immutable objects in Javascript, and how to use them.

## Definitions

**Mutable objects**
: Objects whose state can be modified after they are created
:  * In Javascript, most objects are mutable by default. This means you can change their properties, add new properties, or remove existing ones without creating a new object
:  * This is what most people think of when they hear the word "object" in Javascript

**Immutable objects**
: Objects whose state cannot be modified after they are created
:  * In Javascript, strings and numbers are immutable primitives
:  * When you perform operations on them, you create new values rather than changing the original ones.

Understanding the differences between mutable and immutable objects is crucial for writing efficient and predictable code in Javascript.

## Array methods

Javascript provides a variety of methods for manipulating arrays. Some of these methods are mutable, meaning they change the original array, while others are immutable, meaning they return a new array without modifying the original.

### Mutable Array Methods

These mutable array methods modify the original array, so if you need to access the original array later, you won't be able to, unless you've made a copy of it before using these methods.

For example, if you use the [forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) method to iterate over an array and modify its elements, the original array will be changed.

```typescript
let numbers: number[] = [1, 2, 3, 4];

numbers.forEach(num => console.log(num * num));
```

The methods below are mutable and will change the original array.

| Method | Example | Description |
|:---: | :---: | :---: |
| [push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push) | arr.push(1) | Add to end |
| [pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop) | arr.pop() | Remove from end |
| [shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift) | arr.shift() | Remove from start |
| [unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift) | arr.unshift(1) | Add to start |
| [splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) | arr.splice(1, 2, 9) | Insert/delete elements |
| [sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) | arr.sort() | Sorts array in-place |
| [reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) | arr.reverse() | Reverses array in-place |
| [copyWithin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin) | arr.copyWithin(0, 2) | Copy part of array within itself |
| [fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill) | arr.fill(0) | Fill array with static value |

### Immutable Array Methods

These method return a new array without changing the original and the original array will remain unchanged. This is a good practice to follow when working with shared or global state.

These methods are also side-effect free, meaning they don't interact with the outside world or change state outside their scope. This makes them easier to reason about and test.

When using the [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method to iterate over an array, you create a new array with the results of applying a function to each element of the original array without modifying the original array.

```typescript
// Declare the type of the array explicitly
const numbers: number[] = [1, 2, 3, 4]

// Use map to double each number
const doubled: number[] = numbers.map((num: number): number => num * 2)

console.log(doubled)
// Output: [2, 4, 6, 8]
console.log(numbers)
// Output: [1, 2, 3, 4]

```

These methods are immutable and will not change the original array.

| Method | Example | Description |
| :---: | :---: | --- |
| [map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) | arr.map(x => x * 2) | Transform values |
| [filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) | arr.filter(x => x > 1) | Filter elements |
| [slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) | arr.slice(0, 2) | Return sub-array |
| [concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) | arr.concat([4, 5]) | Merge arrays |
| [flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) | arr.flat(1) | Flatten nested arrays |
| [Spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) | [...arr] | Clone array |
| [Array.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) | Array.from(arr) | Clone array |

ES2023 introduces new immutable methods for manipulating arrays. These methods return a new array with the changes, promoting immutability.

The new methods are:

| Method | Example | Description |
|:---: | :---: | --- |
| [toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) | arr.toSorted() | Sorted copy (ES2023) |
| [toReversed()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed) | arr.toReversed() | Reversed copy (ES2023) |
| [toSpliced()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced) | arr.toSpliced(1, 1, 99) | Spliced copy (ES2023) |
| [with()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with) | arr.with(1, 100) | Creates a new array with the element at the specified index replaced with the provided value.|
| [findLast()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLast) | arr.findLast(x => x > 2) | Returns the value of the last element in the array that satisfies a provided testing function.|
| [findLastIndex()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findLastIndex) | arr.findLastIndex(x => x > 2) | Returns the index of the last element in the array that satisfies a provided testing function.|
| [group()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group) | arr.group(x => x % 2) | Groups the elements of an array based on the result of a callback function.|
| [groupToMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap) | arr.groupToMap(x => x % 2) | Groups the elements of an array into a Map based on the result of a callback function.|

The code below demonstrates how to use these new methods. We will use a single `originalArray` and modify it using these new methods.`.

Two notes:

All methods were introduced in ES2023 and require `"target": "ES2023"` in `tsconfig.json` when working with Typescript.

`group()` returns a [Record<string, Person[]>](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type), while `groupToMap()` returns a [Map<number, Person[]>](https://www.geeksforgeeks.org/typescript-map/).

```typescript
const originalArray: number[] = [1, 2, 3, 4, 5];

// `toReversed()` returns a new array with elements in reverse order
const reversedArray = originalArray.toReversed();
console.log(reversedArray);
// [5, 4, 3, 2, 1]
console.log(originalArray);
// [1, 2, 3, 4, 5]

// `toSorted()` returns a new array sorted by the provided comparator
const sortedArray = originalArray.toSorted((a, b) => b - a);
console.log(sortedArray);
// [5, 4, 3, 2, 1]
console.log(originalArray);
// [1, 2, 3, 4, 5]

// `toSpliced()` returns a copy with elements removed/replaced
const splicedArray = originalArray.toSpliced(2, 1, 10, 11);
console.log(splicedArray);
// [1, 2, 10, 11, 4, 5]
console.log(originalArray);
// [1, 2, 3, 4, 5]

// `with()` returns a copy of the array with a value changed at a given index
const withArray = originalArray.with(1, 100);
console.log(withArray);
// [1, 100, 3, 4, 5]
console.log(originalArray);
// [1, 2, 3, 4, 5]

// Array of numbers for testing findLast and findLastIndex
const numbers: number[] = [10, 20, 30, 40, 50];

// `findLast()` finds the last element matching the condition
const lastEven = numbers.findLast((number) => number % 2 === 0);
console.log(lastEven); // 50

// `findLastIndex()` returns the index of the last matching element
const lastEvenIndex = numbers.findLastIndex((number) => number % 2 === 0);
console.log(lastEvenIndex); // 4

// Define the shape of a person object
type Person = {
  name: string;
  age: number;
};

const people: Person[] = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 }
];

// `group()` returns a Record of arrays grouped by key
const groupedByAge = people.group((person) => person.age);
console.log(groupedByAge);

// `groupToMap()` returns a Map instead of an object
const groupedByAgeMap = people.groupToMap((person) => person.age);
console.log(groupedByAgeMap);
```

## Making mutable objects immutable

You can make an object immutable by using the [spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) operator to merges the original array with the new properties in a new array.

You can also use the [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method to copy the items from one array to another. Keep in mind that `Object.assign()` copies all [enumerable own properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Enumerability_and_ownership_of_properties) from one or more source objects to a target object so it may not copy all the properties you want.

Both of these methods create a new array without modifying the original, leaving it to do further processing later.

```js
// Using spread
const user = { name: 'Alice' };
const updated = { ...user, age: 30 };
console.log(user); // unchanged

// Object.assign (shallow copy)
const updated2 = Object.assign({}, user, { age: 30 });
```

## Mutable Object Manipulation

When working with mutable objects, you can directly modify the properties of the object without creating a new one.

```js
const user = { name: 'Alice' };
// Add a new property
user.age = 30;
```

You can also loop through the items in an array and modify them directly or generate side effects, such as logging to the console.

```typescript
const numbers = [1, 2, 3, 4, 5];
for (let i = 0; i <= numbers.length; i++) {
  numbers[i] *= 2;
}
console.log(numbers);
```

This means that if you have multiple references to the same array, changing one reference will affect all references to that object which can cause unexpected errors in your program if you don't account for this.

## Immutable Object Manipulation

When working with immutable objects you must be careful define the object using the `const` keyword. This prevent you from modifying the object directly. Instead, you create a new object with the desired changes.

When using `const`, Typescript will throw an error if you try to modify the object directly because of the initial `const` declaration. However, this will not stop the transpilation and will run fine in Javascript environments.

```typescript
	const numbers: number[] = [1, 2, 3, 4, 5];

	// Double each number
	numbers = numbers.map(n => n * 2);

	console.log(numbers);
	// Cannot assign to 'numbers' because it is a constant.
```

However, if you use `let`, you can modify the array directly.

Typescript will not flag the code below as an error when modifying the array defined with `let`.

```typescript
let numbers: number[] = [1, 2, 3, 4, 5];

numbers = numbers.map(n => n * 2);

console.log(numbers); // [2, 4, 6, 8, 10]
// No warning or error
```

## Best Practices Suggestions

Here are some suggestions for using mutable and immutable objects in JavaScript:

1. Prefer immutable patterns in shared or global state to prevent different instances from overwriting each other
   1. Use third party immutable data structures like [Immutable.js](https://immutable-js.github.io/immutable-js/) or [Immer](https://immerjs.github.io/immer/) for complex state management
2. Use mutable operations in performance-critical, isolated sections or if you're running the code only for side effects
   1. Libraries like [Lodash](https://lodash.com/) provide mutable methods if you don't want to use the native methods
3. Use [Object.freeze()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) for deep immutability (but beware: it's shallow and may not freeze nested objects)
4. Leverage ES2023 immutable array methods when available
   1. Make sure you change the target in your `tsconfig.json` file if working with Typescript or target appropriate versions of browsers as shown in this [caniuse.com search](https://caniuse.com/?feats=mdn-javascript_builtins_array_findlast,mdn-javascript_builtins_array_findlastindex,mdn-javascript_grammar_hashbang_comments,mdn-javascript_builtins_weakmap_symbol_as_keys,mdn-javascript_builtins_array_toreversed,mdn-javascript_builtins_array_tosorted,mdn-javascript_builtins_array_tospliced,mdn-javascript_builtins_array_with)
