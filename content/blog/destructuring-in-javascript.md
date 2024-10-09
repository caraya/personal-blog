---
title: Destructuring in Javascript
date: 2024-10-09
tags:
 - Javascript
---

Destructuring is an alternative way to assign properties from an objecct or array. The traditional way to assign items to an array is using bracker `[]` notation.

This example sets constatn to specific values found on the array.

```js
const myArray = [
  "blue",
  "red",
  "rebeccapurple",
];

const firstElement  = myArray[0];
const secondElement = myArray[1];
const thirdElement  = myArray[2];
```

Using destructuring, we can assign values from an array directly into a variable. We can also assign more than one value at a time.

This example is equivalent to the previous one but uses destructuring assignments to assign all three properties at the same time.

```js
const myArray = [
  "blue",
  "red",
  "rebeccapurple",
];

const [
	firstElement,
	secondElement,
	thirdElement,
] = myArray;
```

You can also chooseto populate only some of the elements in the array. Instead of a variable name, use an empty space spearated by commas.

In this example, only the first and fourth elements are assigned values from the array. The values that we don't want to assign are listed as spaces surrounded by commas.

```js
const myArray = [
	"goose",
	"duck",
	"duck",
	"goose",
];

const [ firstElement, , , fourthElement ] = myArray;
```

You can also destructure object properties into variables.

`myImage` contains imformation about an image.

We use two destructuring assignments to capture the values from the array.

The first destructuring assignment captures top level properties.

The second captures values in a child with nested attributes. Destructuring sizes will capture the values inside the attribute.

```js
const myImage = {
  "src": "/images/image01.avif",
  "alt": "A single black pixel.",
  "size": {
    "width": 150,
    "height": 100
  }
};

const {
	size,
	src,
	alt,
} = myImage;

const {
	width,
	height,
} = size;

console.log(`<img
	src="${ src }"
	alt="${ alt }"
	height="${ height }"
	width="${ width }">`);
```

Destructuring provides an easier way to assign values to multiple variables in a way that is easier to reason through and process.

It doesn't replace `const`, `let` and `var` (if you want to be dangerous) when assigning a single value.
