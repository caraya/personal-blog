---
title: Tagged Template Literals
date: 2025-01-22
tags:
  - Javascript
  - Templates
  - Template Literals
---

When they were first introduced in ES6/ES2015, [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) created a new, easier IMO, way to produce strings of text, either on their own or interpolated with variables.

Tagged template literals let you parse a template literal with a function. This further enhances

This post provides a brief overview of template and tagged template literals and cover String Literals and Tagged String Literals

## Review of String Concatenation

When Javascript was first introduced, strings were created by manually concatenating strings and variables. For example:

```js
const firstName = 'John';
const lastName = 'Wick';

const fullNameCoolness = firstName + ' ' + lastName + ' is cool';
```

This works but is error prone. Since white space is significant, it is easy to forget to add them, it is also. This is where template literals come in.

## Template Literals

Template Literals give developers more flexibility when creating strings.

They allow for multi-line strings and string interpolation. White space is significant inside the backticks, so you can format the string as you like in as many lines as you want.

You define them with backticks (**`**) characters instead of single or double quotes.

The interpolations are done by wrapping the variable in `${}` but they are all hard coded and, as such, the code as written is not flexible, you'd have to add the variable in all places it's used.

```js
const firstName = 'John';
const lastName = 'Wick';

const fullNameCoolness = `${firstName} ${lastName} is cool`;
```

## Tagged Template Literals

Tagged template literals are a feature of ES6 that allow you to parse template literals with a function. This allows you to parse the function with the static content from the template literal in a way that is more flexible.

The function is called with an array of strings and the interpolated values as separate arguments. This means that we are not hardcoding the values in the string, but passing them as one parameter to the function using [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax).

You need to be careful with the values you use in tagged template literals. You should always test if the value is empty before using it.

```js
function highlight(strings, ...values) {
  let str = "";
  strings.forEach((string, i) => {
    str += `${string}<strong>${values[i] || ""}</strong>`;
  });
  return str;
}
```

We then call the function with the template literal as an argument.

In this example the function `highlight` is called with the template literal `Hello ${firstName} ${lastName}` and will output the string with the interpolated values wrapped in `strong` tags.

```js
const firstName = "John";
const lastName = "Doe";

const theString = highlight`Hello ${firstName} ${lastName}`;
```

The next step is to append the result as HTML content. For this example we append the content to the body element. In more elaborate example you may want to append the template result to a specific element.

```js
// Append the result as HTML content
const div = document.createElement("div");
div.innerHTML = theString;
document.body.appendChild(div);
```

## Examples

These examples, taken from [How to Use Template Literals in JavaScript](https://www.freecodecamp.org/news/template-literals-in-javascript/) illustrate how to use tagged template literals.

The first example is a simple greeting function that takes a name and returns a greeting based on the time of day.

The core of the code is the `timeOfDay` function. It checks the current hour and returns a string based on the time of day.

```js
function greetUser(strings, name) {
  const now = new Date()
  const currentHour = now.getHours()

  const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening'

  return `Good ${timeOfDay} ${name}${strings[1]}`
}

const userName = 'Ama'

console.log(greetUser`Hello ${userName}, nice to meet you!`)
```

The second example uses a tagged template literal to generate CSS and inject it into the document's head.

Inside the function we use the [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) method to combine all the strings and interpolated values into a single CSS string.

The function uses the following parameters:

* `acc`: Accumulator that stores the combined CSS string
* `str`: The current static string from the strings array
* `values[i]`: The interpolated value at the corresponding index i
  * If there is no value (in case the template doesn't have one at that position), it uses '' (an empty string)

The function then creates a new `style` element, sets the `textContent` to the CSS string, and appends it to the document's head.

```js
function injectCSS(strings, ...values) {
  const css = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');

  const styleElement = document.createElement('style');
  styleElement.textContent = css;

  document.head.appendChild(styleElement);
}
```

Using the Tagged Template Literal to inject CSS into the document's head looks like this:

```js
injectCSS`
  body {
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
  }

  .custom-class {
    color: #333;
    padding: 16px;
  }

  @media (max-width: 600px) {
    body {
      background-color: #ffffff;
    }
  }
`;
```



## Links and Resources

* [Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
* [A quick introduction to Tagged Template Literals](https://www.freecodecamp.org/news/a-quick-introduction-to-tagged-template-literals-2a07fd54bc1d/)
* [Understanding tagged template literals in JavaScript](https://www.zachsnoek.com/blog/understanding-tagged-template-literals-in-javascript)
* [Tagged Template Literal for HTML Templates](https://medium.com/@trukrs/tagged-template-literal-for-html-templates-4820cf5538f9)
* [The magic behind 💅 styled-components](https://web.archive.org/web/20161205023934/https://mxstbr.blog/2016/11/styled-components-magic-explained/)
* [Template Literals](https://exploringjs.com/es6/ch_template-literals.html) &mdash; Exploring ES6
* [Using template literals and tagged templates [ES6]](https://exploringjs.com/js/book/ch_template-literals.html#ch_template-literals) &mdash; Exploring Javascript (2024 edition)
