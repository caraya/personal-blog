---
title: Default Parameters and Sibling Parameters
date: 2024-11-13
tags:
  - Javascript
  - Function Parameters
---

We can use special types of parameters to protect ourselves when writing code.

This post will cover two defensive coding strategies: default parameters and what I call sibling parameters.

Using default parameters protects us from getting errors with our code when we forget to add the parameters or we forget to add the right number of parameters.

In this function we've set up default values for each parameter.

## Default Parameters

When we use default parameters we assign values to the parameters when we create the function.

In the example function we assign values to each parameter.

```js
function multiply(a = 5, b = 10) {
	return a * b;
}
```

Then we can work with multiple ways of running the function:

If we don't use any parameters, it will take the default values.

```js
// Use all default values
multiply() // -> 50
```

If we use a single parameter then it will use the value for the first parameter and the default value for the second.

```js
// Use the second default value
multiply(23) // -> 230
```

If you pass all the available values, the values will be used and the defaults will be ignored.

```js
// No default parameters
multiply(23, 15) // -> 345
```

## Sibbling Parameters

I took the name `sibling parameters` from Alex Macarthur's [I didn't know you could use sibling parameters as default values in functions](https://macarthur.me/posts/sibling-parameters/).

The idea is that we define parameters based on other parameters in the same function.

In this function we define the first parameter and we make the second one equal to the second one using a special version of default parameters.

```js
function add(a, b = a) {
    return a + b;
}
```

if we use one parameter then it will be applied twice.

```js
// One parameter will use it twice
add(4) // -> 8
```

If we use two parameters then the values for each parameter will be used and the default values will be ignored.

```js
// Two parameters will ignore sibling
add(443242, 4329048324) // -> 4329491566
```

Using these techniques helps in defensive coding both for our own code and when providing code as APIs for third-party consumption.
