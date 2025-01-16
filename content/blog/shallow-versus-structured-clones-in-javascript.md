---
title: Shalow Versus Structured Clones in Javascript
date: 2025-02-05
tags:
  - Javascript
  - Cloning
  - Copying
---

In JavaScript, cloning refers to creating a copy of an object or data structure. Depending on the method used, the clone may be shallow (basic duplication) or deep (comprehensive duplication). A structured clone is a deep copy created through specific APIs.

This post will cover both shallow and structured cloning in Javascript, their differences and when to use each.

## Shallow Cloning

A shallow clone copies the references of an object’s properties rather than duplicating the actual objects in memory.

Characteristics:

* Only the first level of the object is duplicated
* Nested objects are not copied, instead, their references are copied
* Changes to the cloned object’s nested properties affect the original object
* Methods for Shallow Cloning:
  * [Object.assign()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  * [Spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) { ...obj }

```js
const original = { name: "Alice", details: { age: 25 } };
const shallowClone = { ...original };

// Changing nested object in the clone
shallowClone.details.age = 30;

console.log(original.details.age);
// Output: 30 (nested object shared between original and clone)
```

In this example, both the original and the cloned objects reference the same details object which will cause unexpected results.

## Structured Cloning

A structured clone creates a deep copy of the original data structure, ensuring that no references to the original object remain.
Characteristics:

* Entirely copies the structure and values, including deeply nested objects
* Handles complex types like ArrayBuffer, Blob, Map, Set, and even Date
* Changes to the clone do not affect the original object
* Method for structured cloning
  * [StructuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone)


```js
const original = { name: "Bob", details: { age: 25 } };
const copy = structuredClone(original);

// Changing nested object in the clone
copy.details.age = 30;

console.log(original.details.age); // Output: 25 (original unaffected)
```

Using structured cloning ensures that the original object remains unchanged when modifying the cloned object.

## Final notes

The table below summarizes the differences between shallow and structured cloning.

| Feature | Shallow Clone | Structured Clone |
| --- | --- | --- |
| Depth of Copy | First level only | Full deep copy |
| Reference Handling | Nested objects share references | Nested objects are duplicated |
| Supported Data Types | Simple objects and arrays | Handles Map, Set, Date, ArrayBuffer, etc. |
| API	| { ...obj }, Object.assign() | 	structuredClone() |

Use Cases:

* **Shallow clones**: Suitable for simple objects or when immutability isn't a concern
* **Structured clones**: Ideal for complex data that needs to be fully duplicated without reference sharing

Limitations:

* `structuredClone()` cannot copy objects with functions, prototypes, or symbol keys
* Shallow clones may introduce bugs if unaware of shared references in nested objects.
* `json.parse(json.stringify(obj))` can be used as a polyfill for structured cloning in older browsers. However, it has limitations with certain data types like Date objects
* You can also use libraries like Lodash's `cloneDeep()` for structured cloning.
