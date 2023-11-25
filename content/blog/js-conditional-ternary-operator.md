---
title: "JS conditional (ternary) operator"
date: 2023-12-20
tags:
  - Javascript
  - Note
---

Javascript provides a way to shortcircuit if/else statements with the [conditional or ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator).

the idea is that we consolidate the three parts of the if statement in one command, like shown below:

```js
function canPass(isAdult) {
  return isAdult ? 'Yes, can pass' : 'No, cannot pass';
}
```

In this example, `isAdult` is the test we want to execute. The string after the question make (`?`) returns if the test is true and the secod string after the colon (`:`) returns if the test is false.

if the true and false statemnts are too complex or too long, we should break them out into separate functions to keep the ternary operator clean and easy to read.

We can change the example to test for the age of the person and add functions for positive and negative results.

```js
function isAdult() {
	return `Person is an adult so they can pass`
}

function notAdult() {
	return `Person is NOT an adult so they can not pass`
}

function canPass(age) {
	return age >= 18 ? isAdult() : notAdult();
}
```

As long as the code is readable either option works for me. Just have to remember that easy of reading the code always wins over clever APIs and complicated code.
