---
title: Javascript - what is this?
date: 2025-06-30
tags:
  - Javascript
  - Programming
---


The this keyword in JavaScript can be tricky. It refers to the context in which a function is running, and its value changes depending on how that function is called.

This guide will clarify what this is, how it behaves in different situations, and how it relates to arrow functions and the `call()`, `apply()`, and `bind()` methods.

## Understanding this

In JavaScript, this refers to the execution context of a function. A common use case is within an object's methods, where this provides a convenient way to access the object it belongs to. This allows you to create a single method that can work with the data of multiple objects.

The value of this is dynamic and determined when a function is called. Think of it as a hidden parameter that JavaScript passes to the function to tell it which object to work with.

For a standard function, this refers to the object on the left side of the dot in a function call. For example, in `myObj.getThis()`, this inside the `getThis()` function will be `myObj`.

```js
function getThis() {
  return this;
}

const obj1 = { name: "obj1" };
const obj2 = { name: "obj2" };

obj1.getThis = getThis;
obj2.getThis = getThis;

console.log(obj1.getThis());
// { name: 'obj1', getThis: [Function: getThis] }
console.log(obj2.getThis());
// { name: 'obj2', getThis: [Function: getThis] }
```

Even though both objects use the same getThis function, the value of this changes depending on which object calls it.

When a function is called on its own (e.g., getThis()), this will default to the global object (in non-strict mode) or undefined (in strict mode).

## bind(), call(), and apply()

While the value of this is typically set implicitly, you can also set it explicitly for a function. This is where the `call()`, `apply()`, and `bind()` methods come in handy.

* `call()` and `apply()`: These methods allow you to execute a function once with a specific this value.
* `bind()`: This method creates a new function that is permanently tied to a specific this value, no matter how or where it's called.

### call()

The `call()` method invokes a function with a given this value and arguments provided individually. This is useful for "borrowing" a method from one object and using it with another.

In the example below, we use `call()` to execute the greet function in the context of the obj object:

```js
function greet() {
  console.log(
    this.animal,
    "typically sleep for",
    this.sleepDuration
  );
}

const obj = {
  animal: "cats",
  sleepDuration: "12 to 16 hours",
};

greet.call(obj); // "cats typically sleep for 12 to 16 hours"
```

### apply()

The `apply()` method is similar to `call()`, but it accepts arguments as an array. This makes it useful when you don't know the number of arguments a function will receive ahead of time.

```js
const numbers = [5, 6, 2, 3, 7];

const max = Math.max.apply(null, numbers);

console.log(max); // 7
```

### bind()

The bind() method creates a new function that, when called, has its this keyword set to a provided value. This is particularly useful for controlling the context of a function in event handling or callbacks.

Consider the following module object:

```js
const module = {
  name: 'Module A',
  sayHello: function() {
    console.log(`Hello from ${this.name}!`);
  }
};
```

When we use bind(), we create a new function where this will always refer to the module object.

```js
const boundSayHello = module.sayHello.bind(module);

// `this` will consistently refer to the `module` object.
boundSayHello();
// Result: "Hello from Module A!"
```

Without `bind()`, if sayHello were used as an event listener, this would refer to the element that triggered the event, not the module object.

## Arrow Functions

Arrow functions handle this differently from regular functions. They don't have their own this context; instead, they inherit this from their parent scope—a concept known as lexical scoping.

This makes arrow functions ideal for callbacks and situations where you want to maintain the this context from the surrounding code. Because their this value is lexically bound, you cannot change it with `bind()`, `apply()`, or `call()`.

In this example, we have a simple counter. We'll use an arrow function for the event listener to ensure this still refers to the counter object.

```js
// HTML needed for this example:
// <button id="myButton">Click me</button>
// <div id="count-display">0</div>

const counter = {
  count: 0,
  button: document.getElementById('myButton'),
  display: document.getElementById('count-display'),

  start: function() {
    this.button.addEventListener('click', () => {
      this.count++;
      this.display.textContent = this.count;
      this.button.textContent = `Clicked ${this.count} times`;
    });
  }
};

counter.start();
```

If we had used a regular function for the event listener, this would refer to this.button, and the code would not work as expected.

## Links and Resources

* [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) &mdash; MDN
* [Understanding this in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this#understanding_this_in_javascript) &mdash; MDN
* [What is this?](https://piccalil.li/blog/javascript-what-is-this/)
* [When is this?](https://piccalil.li/blog/javascript-when-is-this/)
* Related functions and methods:
  * [Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
  * [call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
  * [apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
  * [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
