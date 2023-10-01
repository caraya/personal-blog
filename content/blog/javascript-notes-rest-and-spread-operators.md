---
title: "Javascript Notes: Rest and Spread operators"
date: "2023-09-25"
---

Rest and spread operators are two ways to manipulate arrays and objects in Javascript. In this post we'll review what they are and how to use them.

## Spread Parameters

The [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) expands an array or objects into its individual elements.

For example, with the following array:

```js
const obj = {
    a: 1,
    b: 2,
    c: 3
};  
```

We can use the spread operator to assign the values of the array into a new array

```js
const newObj = {
    ...obj
};
```

```js
console.log(newObj);
// {a: 1, b: 2, c: 3}
```

We can also use the spread operator in a function's parameters.

The array below has three elements.

```js
const arr = [1, 2, 3];
```

The `sum` function takes three parameters and returns the sum of the three values

```js
const sum = (a, b, c) => a + b + c;
```

We then use the spread operator as the parameter for the `sum` function.

```js
console.log(sum(...arr));
```

Which is equivalent to passing the values directly to the function.

```js
console.log(sum(1, 2, 3));
```

With a few values it makes sense to use them interchangeably but, for larger arrays, the spread operator is easier to read and makes the code less error prone since the array is defined in one place.

## Rest Parameters

The [rest syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) allows for an unlimited of parameters to be passed to a function.

We need to be careful with the functions that we use the rest syntax with. The `sum` must account for indefinite number of parameters and the parameters should all be of the same time.

You cannot have multiple rest operators in the same function and the rest operator must be the last parameter in the function.

In this example we use the [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) method to add all the values in the array.

Reduce will walk through the array and add the current value to the accumulator.

```js
const sum = (...arr) => {
  return arr.reduce((acc, curr) => 
  {
    acc + curr, 0
  });
};
```

Yes, there are probably easier ways to do either of these examples but I like that you can use spread and rest in multiple locations with the same arrays and objects.
