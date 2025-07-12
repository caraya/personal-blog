---
title: List Comprehensions in Javascript (sort of)
date: 2025-08-13
tags:
  - Typescript
  - Javascript
  - Programming
baseline: true
---

List comprehensions in Python allow you to create new lists by applying an expression to each item in an existing iterable, optionally filtering items based in a condition.

I've always missed this feature in Javascript (and later Typescript), but it wasn't until recently that I discovered there is a way to achieve similar array methods that are native to Javascript and available in Typescript.

This post will explain list comprehensions in Python, and how they can be replicated in Typescript using the `map()` and `filter()` array methods.

While there isn't a direct syntactic equivalent to Python's list comprehension in Typescript, you can achieve the same results using built-in array methods, most notably `map()` and `filter()`. These methods are a standard part of Javascript and are fully available in Typescript with the added benefit of type safety.

## What are list comprehensions in Python?

Let's say you have the following Python code to create a list of squared numbers:

```python
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers]
# Result: [1, 4, 9, 16, 25]
```

The squares array will walk though the numbers list and square each number (`n**2`) to create a new list.

You can also add an optional condition to filter the items as they are processed. For example, to only include the squares of even numbers, you can do:

```python
numbers = [1, 2, 3, 4, 5, 6]
even_squares = [n**2 for n in numbers if n % 2 == 0]
# Result: [4, 16, 36]
```

The `if n % 2 == 0` condition filters the numbers, so only even numbers are included in the new list.

Once you understand how list comprehensions work in Python, you can see how they provide a concise way to create lists based on existing iterables, applying transformations and filters in a single line of code.

## The Typescript Equivalents

While there is no direct equivalent to Python's list comprehensions in Typescript, you can achieve similar functionality using Javascript's array methods.

The two primary methods you'll use are:

* [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/Javascript/Reference/Global_Objects/Array/map): This method creates a new array by calling a provided function on every element in the calling array. It's the direct equivalent of the expression part of a list comprehension.
* [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/Javascript/Reference/Global_Objects/Array/filter): This method creates a new array with all elements that pass the test implemented by the provided function. It's the equivalent of the conditional part of a list comprehension.


To duplicate a basic list comprehension in Typescript, you would use the `map` method to achieve the same result.

```ts
const numbers: number[] = [1, 2, 3, 4, 5];
const squares: number[] = numbers.map(n => n ** 2);
// Result: [1, 4, 9, 16, 25]
```

To replicate the conditional filtering list comprehension in Typescript, you would use the `filter` method followed by the `map` method.

```ts
const numbers: number[] = [1, 2, 3, 4, 5, 6];
const evenSquares: number[] = numbers
  .filter(n => n % 2 === 0) // First, filter for even numbers
  .map(n => n ** 2);       // Then, square the result
// Result: [4, 16, 36]
```

Not that the order of the chain matters. While switching the order of `map` and `filter` would still yield the same result in this example, that's not guaranteed to always happen.

By combining these array methods, you can replicate the concise and powerful functionality of Python's list comprehensions in a clean and readable way.
