---
title: Using JSDoc in your projects
date: 2024-06-30
draft: true
---

[JSDoc](https://jsdoc.app/) is a documentation generator for your Javascript code.

This post will discuss JSDoc, what it can do, why you would want to use it, and how to install and configure it.

## Why

There are two reasons why you'd want to use JSDoc: type annotations and documentation.

### Type annotations

The best known application of JSDoc is to take special anotations in your Javascript code use them as type annotations.

The following example shows what these JSDoc type annotations look like for a `processContrast` function.

```js
/**
 * @name processContrast
 * @description calculates the contrast between a foreground and a background color using different measurement tools
 *
 * @param {string} foreground - foreground color, usually text
 * @param {string} background - background color
 */
export function processContrast(foreground, background) {}
```

The `@param` declarations give the type for each of the function's parameters. VSCode and other code editors will use these declarations in the popups when you hover over each function and will flag it when you provide values that don't match.

### Documentation

In addition to type validation you can document each function with notes on the design or anything else that you think other developers (including "you in six months") will need to know to work with the code.

#### Additional Items

Furthermore, you can document complete projects by adding additional documentation in the form of a README and tutorials

##### README

In this context, the README file for the project as an introduction for the project or as a

##### Tutorials

## How

### Installation

### Configuration

