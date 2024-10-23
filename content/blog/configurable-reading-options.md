---
title: Configurable Reading Options
date: 2024-11-06
tags:
  - Reading Options
  - Configuration
  - Javascript
  - Reference
---

In [Using Sliders in Javascript](https://publishing-project.rivendellweb.net/using-sliders-in-javascript/) we saw how we can use sliders to control aspects of a user interface.

This post will expand on the content from the previous post and build a full configuration panel for a long-form reading application.

We'll look at what elements we should customize, how to customize them and finally, provide a script that accomplishes the customization.

## What to customize

Text and background colors
: Think of dark mode
: It may be good to provide preset color combinations in addition to let users create their own, maybe with a select menu
: Input type to use: **Color**

Font size
: Depending on the device and reader conditions readers may want to change the size of the font beyond the default we provide
: Input type to use: **Slider**

Width (measure)
: The prefered width of printed text is 75 to 80 characters but, depending on the screen size and orientation we may want to adjust the measure of the text in addition to the line height for the text
: Input type to use: **Slider**

Line Height
: Depending on the size of the text and the measure we choose, we may need different line height for users to be comfortable reading
: Input type to use: **Slider**

Hyphenation
: Most browsers now support native hyphenation so it shouldn't bee too hard to set it up as long as we remember to set the default language in the root of the document
: Input type to use: **Checkbox**

Font-stack (maybe)
: Add default font stacks to use beyond browser defaults
: Input type to use: **Select Pulldown Menu**

## How to do it?

Most of the options are configured based on sliders like we did in the previous post.

Since we don't know what specific values the user will choose, we can't add / remove / toggle classes. Instead we add inline styles to the content section of the page.

As usually, we first capture references to all the HTML elements we want to work with

```js
// Capture all element references
const textContent = document.querySelector('.text-content');
const textParagraph = document.querySelector('.text-content p');
const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const fontSizeInput = document.getElementById('font-size');
const widthInput = document.getElementById('width');
const lineHeightInput = document.getElementById('line-height');
const hyphenationInput = document.getElementById('hyphenation');
const fontStackSelect = document.getElementById('font-stack');
```

There are two kinds of sliders. The first one (`fontSize` and `width`) use [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to interpolate the value we get from the form with the appropriate unit string.

```js
const handleFontSizeChange = (e) => {
    textContent.style.fontSize = `${e.target.value}px`;
};

const handleWidthChange = (e) => {
    textContent.style.width = `${e.target.value}%`;
};
```

The second type of sliders (`lineHeight`) is unitless so we can just use the value on its own.

```js
const handleLineHeightChange = (e) => {
    textContent.style.lineHeight = e.target.value;
};
```

The color inputs (`backgroundColor` and `color`)

```js
const handleBgColorChange = (e) => {
    textContent.style.backgroundColor = e.target.value;
};

const handleTextColorChange = (e) => {
    textContent.style.color = e.target.value;
};
```

The Hypenation toggle takes a little more explanation.  Since it's a checkbox we use a [ternary operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator) to set the value of the `hyphens` attribute.

```js
const handleHyphenationToggle = (e) => {
    textParagraph.style.hyphens = e.target.checked ? 'auto' : 'none';
};
```

The font selection process uses a [select element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

The fonts we use must be available to the user either downloaded by the operating system or loaded with [@font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) at-rules.

We should also list the fonts to use in the select element.

```js
const handleFontStackChange = (e) => {
    textContent.style.fontFamily = e.target.value;
};
```

Finally, we attach the events to the respective elements we captured earlier.

```js
bgColorInput.addEventListener('input', handleBgColorChange);
textColorInput.addEventListener('input', handleTextColorChange);
fontSizeInput.addEventListener('input', handleFontSizeChange);
widthInput.addEventListener('input', handleWidthChange);
lineHeightInput.addEventListener('input', handleLineHeightChange);
hyphenationInput.addEventListener('change', handleHyphenationToggle);
fontStackSelect.addEventListener('change', handleFontStackChange);
```

A future enhancement would be to check if a property is stored in session storage: if it exists then we use it to set the property for the document and, if it's not, set the property up.
