---
title: "Javascript notes: bind, call, and apply"
date: "2023-10-02"
---

Bind, call and apply are old concepts in Javascript. They are likely the subject of many interview questions, blog posts and tutorials but I still find it hard to understand these functions, how they work and how they are different from each other.

This post is my attempt at understanding and explaining how these concepts work.

## General observations

These functions provide a basic level of composability to Javascript.

They perform the same task (creating a bound function) in different ways.

## Bind

[Bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) lets you specify the object that [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) references inside the bound function.

The simplest use of `bind()` is to make a function that, no matter how it is called, is called with a particular this value.

A common mistake I've made (and sometimes still do) is to extract a method from an object, and then call that function outside the original object and expect it to use the original object as its `this` reference.

If we're not careful the original object is usually lost. Creating a bound function using the original object, solves this problem.

To fully understand what this means and what `bind()` does we'll look at two examples:

The first example runs through basic usage of `bind()` in a bound function.

We create a variable bound to `this` and a value for `x` in the global scope. The top-level 'this' is bound to 'globalThis' in scripts.

We also create a module with a property `x` and a method `getX()` that returns the value of `x`.

```js
this.x = 9;
const module = {
  x: 81,
  getX() {
    return this.x;
  },
};
```

The first step is to create a bound variable. `module.getX()` will produce `81`; the value of X inside the module.

```js
console.log(module.getX()); // 81
```

`retrieveX` references the module's `getX()` function. However, since we're not making an explicit reference, `this` is bound to the global object and will produce a different result.

```js
const retrieveX = module.getX;
console.log(retrieveX()); // 9
```

The 'boundGetX' function binds the `this` parameter bound to 'module' so, when we call it, we get the value of `x` inside the module.

```js
const boundGetX = retrieveX.bind(module);
console.log(boundGetX()); // 81
```

The second example shows how to make a function with pre-specified initial arguments.

We create two functions.

`list()` will list the arguments it passes.

`addArguments()` takes two arguments and will return the sum of the arguments.

```js
function list(...args) {
  return args;
}

function addArguments(arg1, arg2) {
  return arg1 + arg2;
}
```

We test the functions to make sure that they work as expected and produce a list of the arguments and the addition of the two passed arguments.

```js
console.log(list(1, 2, 3)); // [1, 2, 3]

console.log(addArguments(1, 2)); // 3
```

// Create a function with a preset leading argument

The next two definitions use null as the value of `this`. This will bind the function to the global object.

If we don't provide a value then `leadingTenList` will just return 10.

If we provide one or more arguments then `leadingTenList` will return a list starting with 10 and followed by the arguments in the order they were defined.

```js
const leadingTenList = list.bind(null, 10);
```

```js
console.log(leadingTenList()); // [10]
console.log(leadingTenList(1, 2, 3)); // [10, 1, 2, 3]
```

The `addTen` function will return the sum of 10 plus the argument. If we don't provide an argument then it will return 10.

```js
const addTen = addArguments.bind(null, 10);
```

The function expects a single argument. If you pass it then it will add 10 to it and return the result.

If you pass more arguments than those in the function the additional arguments will be ignored.

```js
console.log(addTen(5)); // 15
console.log(addTen(5, 10)); // 15
```

## Call

[Call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call) calls the bound function with a given `this` value and arguments provided individually.

We first define our base module with all the properties and methods that we want to share.

```js
function Car(model, year, doors) {
  this.model = model;
  this.year = year;
  this.doors = doors;
}
```

We then define a more specialised object. We use `Car.call()` to bring the properties of the Car object into the `Ferrari` object along with custom attributes exclusive to the derived object.

```js
function Ferrari(year, doors) {
  Car.call(this, 'F30', year, doors);
  this.onSale = false;
}
```

```js
console.log(new Ferrari(2015, 2));

Ferrari {
  model: 'F30',
  year: 2015,
  doors: 2,
  onSale: false
}
```

## Apply

[Apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) calls this function with a given this value, and arguments provided as an array (or an array-like object).

As usual, we first define the array that we want to work with.

```js
const numbers = [5, 6, 2, 3, 7];
```

Then we define two function literals. When we use `apply()` rather than `call()` because we have an array of values that we want to work with.

```js
const max = Math.max.apply(null, numbers);

const min = Math.min.apply(null, numbers);

console.log(max); // 7
console.log(min); // 2
```

There are array and string methods that would achieve similar results. But this is still available and you're likely to get called out on it during interviews so it's better to know the differences.

## Links and Resources

- [Understanding Call, Bind and Apply Methods in JavaScript](https://blog.bitsrc.io/understanding-call-bind-and-apply-methods-in-javascript-33dbf3217be)
- MDN
    
    - [Bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
    - [Call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
    - [Apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
