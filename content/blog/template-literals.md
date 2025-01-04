---
title: Template Literals
date: 2024-02-12
tags:
  - Javascript
---

Among the large number of new features in ES6/ES2015 are [Template Literals/Strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals).

These are backtick "\`" enclosed expressions that allow for multiline expressions and string interpolations using placeholders (`${varName}`).

```js
let name = "William"
let carMake = "Ferrari"

let myTemplateString = `My name is ${name}  and I own a ${carMake}`

// -> My name is William  and I own a Ferrari
```

White space is significant. Inserting spaces or newline characters will change the resulting string.

If we insert newline characters into `myTemplateString` will produce a different result that may not be what you're expecting.

```js
let name = "William"
let carMake = "Ferrari"

let myTemplateString = `My name is ${name}

and I own a ${carMake}`

// Whitespace is significant.
// -> My name is William
//
// and I own a Ferrari
```

Along with Template Literals, ES6 provided [Tagged Template Literals](https://wesbos.com/tagged-template-literals).

Tagged Template Literals allows developers to run a template string through a function with tighter control over how this actual string is made.

To create a Tagged Template String we do the following:

1. Create the function that we want to run
2. Put the name of the function before the Template String

In a first, naive, implementation, the `highlight` function will just return a string, creating a wholly unexpected result.

```js
function highlight() {
  return "cool"
}

let name = "William"
let carMake = "Ferrari"

let myTemplateString = highlight`My name is ${name}  and I own a ${carMake}`

// -> cool
```

We need to make the function return something more useful.

We will recreate the highlight function with two parameters

1. An array of the string elements of the template
2. One or more parameters for the interpolated values we want to use

The next version the `highlight` function looks like this:

```js
function highlight(strings, name, carMake) {
  return "cool"
}

let name = "William"
let carMake = "Ferrari"

let myTemplateString = highlight`My name is ${name}  and I own a ${carMake}`
```

But it still produces `cool` as the output.

For the next iteration, we'll make the following changes.

1. Rather than hardcoding the values, we will use the [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) to capture all the values that are not strings. This makes the function more flexible when we don't know how many values we'll pass to the function
2. We use a [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) loop to iterate through both the strings and values array inserting them where appropriate

```js
function highlight(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + values[i];
  });
  return str;
}

let name = "William"
let carMake = "Ferrari"

let myTemplateString = highlight`My name is ${name}  and I own a ${carMake}`

// -> My name is William  and I own a Ferrariundefined
```

If we return str, the string that we've been tacking things onto, we should now see "My name is William and I own a Ferrariundefined."

The strings array is always going to be one larger than the values array. When we hit that last one, it's only going to be a string and there's going to be no value to tack on the end. You could check if `values[i]` is undefined and, if it is, then add an empty string.

This will allow us to add as many values as we want or need to without worries of an undefined value sneaking in at the end.

```js
function highlight(strings, ...values) {
  let str = '';
  strings.forEach((string, i) => {
    str += string + (values[i] || '');
  });
  return str;
}


const name = "William"
const carMake = "Ferrari"
const carMake2 = "Porsche"

let myTemplateString = highlight`My name is ${name} and I own a ${carMake} and a ${carMake2}`

// -> My name is William and I own a Ferrari and a Porsche
```

In [Easy Creation of HTML with JavaScript’s Template Strings](https://wesbos.com/template-strings-html), Wes Bos provides examples of how we can leverage Tagged Template Literals to create HTML content.

[Lit](https://lit.dev/) HTML rendering uses Tagged String Literals to render HTML and CSS in Lit-HTML-based components.

```js
import {LitElement, html} from 'lit';

class MyElement extends LitElement {
  render() {
    return html`<p>Hello from my template.</p>`;
  }
}
customElements.define('my-element', MyElement);
```
