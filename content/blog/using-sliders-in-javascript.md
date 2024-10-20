---
title: Using Sliders in Javascript
date: 2024-11-04
tags:
  - Javascript
  - Interactivity
---

When doing interactive demos or building preferences panels we may need to create sliders to set values for the associated properties.

This post will cover how to configure an HTML slider and how to read the data from Javascript to change portions of the page.

First we define a [range input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range) we'll use to change the width of a target element.

```html
<label for="theWidth">Width: </label>
<input type="range"
  id="theWidth"
  name="theWidth"
  min="10"
  max="100"
  step="10"
  value="50"/>
```

The Javascript portion of the code does two things. First it captures references to the slider and the target element (element with `container` class).

```js
  const slider = document.getElementById('theWidth');

  const container = document.querySelector('.container');
```

Next,we add an [input](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event) event listener to update the CSS with the current value of the slider.

The event listener updates the value of the `width` property of the `.container` element using viewport units.

```js
  slider.addEventListener('input', function () {
    container.style.width = `${slider.value}vw`;
  });
```

A future iteration may change to customize the units that we use in addition to the value.
