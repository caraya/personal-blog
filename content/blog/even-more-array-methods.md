---
title: "Even More Array Methods"
date: 2024-02-19
tags:
  - Javascript
  - Notes
---

The ECMAScript specification gained a new set of methods for the Array object that work on copies of the original array rather than modifying the original array directly.

There are other ways to complete the tasks these methods do. Which method you use will largely depend on whether you need to keep the original array intact or not.

## Reversing an array by copy with toReversed()

When I want to reverse the content of an array, I normally clone the array using [from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) and then reverse it using [reverse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse).

```js
console.log(cars)
// -> ['Porsche', 'Ferrari', 'BMW']

let reverseCars = Array.from(cars).reverse();

console.log(reverseCars);
// -> ['BMW', 'Ferrari', 'Porsche']

console.log(cars);
// -> ['Porsche', 'Ferrari', 'BMW']
```

Using the [toReversed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toReversed) method condenses the steps. It copies the original array and then reverses it.

```js
let cars = ["Porsche", "Ferrari", "BMW"]


let carsReversed = cars.ToReversed;
console.log(cars.toReversed())
// -> ['BMW', 'Ferrari', 'Porsche']

console.log(cars)
// -> ['Porsche', 'Ferrari', 'BMW']
```

## Splicing an array with toSpliced()

Traditionally, to splice a copy of an array we need to clone it (I use the `from` array method) and then splice it.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

let fewerCars = Array.from(cars).splice(2, 1);

console.log(cars)
// -> ["Porsche", "Ferrari", "Jaguar", "BMW"]

console.log(fewerCars)
// -> ["Porsche", "Ferrari", "BMW"]
```

The [toSpliced()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSpliced)
consolidates the process.

It first copies the array and then it splices one or more values as instructed. It leaves the original array intact for further work.

**Array indices are zero-based. The first index is 0, not 1.**

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

let splicedCars = cars.toSpliced(2,1)

console.log(splicedCars)
// -> ['Porsche', 'Ferrari', 'BMW']
```

## Sorting array copies with toSorted()

Sorting the content of an array has always felt complicated.

The [sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) method of Array instances sorts the elements of an array in place and returns the reference to the same array, now sorted.

The default sorting mechanism used in both `sort()` and `toSorted()` will compare the letters in strings. This may or may not be what you want, particularly if you're working with number arrays.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

cars.sort();

console.log(cars)
// -> ['BMW', 'Ferrari', 'Jaguar', 'Porsche']
```

The sort method takes an optional parameter with a custom sorting function.

This function will compare the length of two array values and sort them from longest to shortest.  It has some shortcomings (it doesn't take into account what happens if the lengths are equal) but as an example it's OK.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]


cars.sort(function (car1, car2) {
  if (car1.length > car2.length) {
    return -1;
  }
  return 1;
})

console.log(cars)
// -> ['Porsche', 'Ferrari', 'Jaguar', 'BMW']
```

The Problem is that this sorts the array in place, we no longer have the original array to work with.

That's where the [toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) method comes in.

It will create a copy of the array and then sort it, either using the default algorithm or whatever custom function we use to sort.

`toSorted()` also supports the custom sorting function parameter, with the same shortcomings as those we found when using the function in the `sort` method.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

let sortedCars = cars.toSorted(function (car1, car2) {
  if (car1.length > car2.length) {
    return -1;
  }
  return 1;
})

console.log(cars)
// -> ['Porsche', 'Ferrari', 'Jaguar', 'BMW']
```

## Creating a copy of an array with a single updated value

When we want to replace one element of an array we have to do it manually, usually by assigning a new value to the given index of the array. For example, if we want to change the third element of an array, we'd do something like this:

```js
arraName[2] = "new value";
```

Like all other traditional methods, this will change the original array. In this case, the `cars` array is changed permanently.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

cars[2] = 'Koenigsegg';

console.log(cars);
// -> ['Porsche', 'Ferrari', 'Koenigsegg', 'BMW']
```

If we want to keep the original array we can use the [with()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted) method.

This method will create a copy of the array and replace the desired items in the array copy.

This will work to replace individual items. It will not work replacing multiples.

The values of the array items are zero-based. The first item is 0, not 1.

```js
let cars = ["Porsche", "Ferrari", "Jaguar", "BMW"]

let fastCars = cars.with(2, 'Koenigsegg');

console.log(cars);
// -> ["Porsche", "Ferrari", "Jaguar", "BMW"]

console.log(fastCars);
// -> ['Porsche', 'Ferrari', 'Koenigsegg', 'BMW']
```

These four methods provide simpler ways to do things that we've done before but will make a copy of our original array and modify the copy.

This may or may not be what we want to do. That decision will depend on the project and what browser versions you need to support.
