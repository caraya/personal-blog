---
title: "Using media queries in Javascript"
date: "2022-12-12"
---

Most of the time media queries in CSS will work fine for what we want to do but there are times when just having the media queries will not be enough.

The first example that I can think of is doing something based on changes to the preferred color scheme.

While the CSS Media Query should be enough to do the work, we can't be certain it will.

Before you can evaluate the results of a media query, you need to create the MediaQueryList object representing the query. To do this, use the [window.matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) method.

To detect changes to the result of the query on an ongoing basis, register an event listener using the [addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) method on the [MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) object. Note that, unlike CSS queries, the event listener will not continue updating the value as it changes.

In the event listener, we test if the query matches the current value.

If it matches then we log the information to the console and add the `Dark Theme` string into the text box.

If it doesn't match then we change it to the light theme and write `Light Theme` in the text box.

```js
const textBox = document.querySelector(".textbox");

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

mediaQuery.addEventListener("change", ({ matches }) => {
  if (matches) {
    console.log("change to dark mode!");
    textBox.innerText = "Dark Theme";
  } else {
    console.log("change to light mode!");
    textBox.innerText = "Light Theme";
  }
});
```

This is a simple example but it illustrates what you can do with them.

You can always experiment with different media queries and what to do when the query matches and when it doesn't.
