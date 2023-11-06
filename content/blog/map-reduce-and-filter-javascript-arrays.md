---
title: "Map, reduce and filter Javascript arrays"
date: "2023-09-27"
---

Javascript also has a set of map/reduce/filter functions. I've always curious about how they work.

From what I see, these functions are closer to Functional programming than to data processing.

They create new arrays from their input, keeping the source intact rather than replacing it. This allows for further operations on the original array.

As an overall note. These functions are not a replacement for `for` and `for of` loops. There may be times when using for loops is more efficient than using these methods.

## Map

The [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) method of the [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) creates a new array with the result of calling a function in all the members of the original array.

The most basic example will take an array of numbers and multiply them by themselves.

The first step is to create an array of numbers.

```js
let numbers = [2, 4, 6, 8, 10];
```

We then create a function that we will execute on each element of the array when we use it in the map method later.

```js
function square(number) {
  return number * number;
}
```

The `square_numbers` variable will hold the result of the map method.

The first argument of the map method is the function that we want to execute on each element of the array. In this case the function is the `square` function that we defined earlier.

```js
let square_numbers = numbers.map(square);
```

When we log the `square_numbers` variable to the console we get an array of the numbers in the source array.

```js
console.log(square_numbers);
// Result
// [4, 16, 36, 64, 100]
```

We can do similar things with strings. In this case we can modify each string in an array in the same way. We can't customize the function for each string in the original array.

## Reduce

[Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) applies a function to each element of an array, and returns a single value.

This is different than `map` in that it will return a single value combining all the values of the original array.

```js
let numbers = [2, 4, 6, 8, 10];
```

The `square` function is the same one we used for `map`. It multiplies a number times itself.

```js
function square(number) {
  return number * number;
}
```

We then call reduce on the `numbers` array and pass the `square` function as the argument to `reduce`.

```js
let square_numbers = numbers.reduce(square);
```

When we log `square_numbers` to the console we get the result of multiplying all the numbers in the array.

```js
console.log(square_numbers);
// Output: 65536
```

You can also use `reduce` to join strings.

In this example, we make an array of strings. Note that we insert the necessary spaces here rather than adding them later.

```js
const message = [
  "JavaScript ",
  "is ",
  "fun."
];
```

The `joinStrings` function takes two arguments. The first one is the accumulator the value of the previous call to the function, the second one is the current value of the array element that we're working with.

```js
function joinStrings(accumulator, currentValue) {
  return accumulator + currentValue;
}
```

Now we create a variable holding the result of the `reduce` method applied to the `message` array.

```js
let joinedString = message.reduce(joinStrings);
```

When we log the value of `joinedString` to the console we get the result of joining all the strings in the array.

```js
console.log(joinedString);
// Output: JavaScript is fun.
```

## Filter

[Filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) creates a [shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy) of a portion of a given array, filtered down to just the elements from the given array that pass the test defined in the provided function.

This is different than `map` and `reduce` in that it will return an array with a subset of the values in the original array, rather than produce an array with the same number of elements as the original.

The first step is to create the array of strings that we want to work with.

```js
const materials = [
  'Hydrogen',
  'Helium',
  'Lithium',
  'Beryllium',
  'Uranium',
  'Plutonium',
  'Oxygen',
  'Nitrogen',
];
```

When we log the result of running `filter` on the `materials` array, we will get a new array with only the names that eight characters or longer.

```js
console.log(materials.filter((material) =>
  material.length >= 8
));

// Expected result:
// [
//   'Hydrogen',
//   'Beryllium',
//   'Plutonium',
//   'Nitrogen'
// ]
```

## Links and resources

* [JavaScript’s Map, Reduce, and Filter](https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter)
* [Arrow Function Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
* MDN
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
  * [Reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
  * [Filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
