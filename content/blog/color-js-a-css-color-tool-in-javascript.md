---
title: "Color.js A CSS Color Tool in Javascript"
date: "2021-09-01"
---

[CSS Color Module Level 4](https://drafts.csswg.org/css-color-4/) and [level 5](https://drafts.csswg.org/css-color-5/) introduce a lot of new color features but unless you're really into the guts of working with colors on computers you probably wouldn't know how to use them. There is also an issue of browser uneven support for colors on the web, which is a large problem for developers.

When the graphical web first came online it was in low-resolution monitors, 640 x 480 was the norm and RGB was the only color space that we had to worry about. As technology improved, displays got bigger and grew beyond RGB and what it could show us.

Current monitors can display more colors than those available in the sRGB color space as explained in [Wide Gamut Color in CSS with Display-P3](https://webkit.org/blog/10042/wide-gamut-color-in-css-with-display-p3/)

There are other color spaces like LCH / LAB and P3 that do better in presenting color information and don't have any of the limitations of sRGB as explained in [LCH colors in CSS: what, why, and how?](https://lea.verou.me/2020/04/lch-colors-in-css-what-why-and-how/)

[Lea Verou](https://lea.verou.me/), and [Chris Lilley](https://twitter.com/svgeesus), editors of the level 4, and level 5 color specifications, wrote [color.js](https://colorjs.io/) to convert between different color formats supported in browsers and manipulate colors in a way that is similar to what you can do with SASS (and I imagine other preprocessors too).

This post will explore different uses of the library and how it can make working with colors on the web easier.

The first thing to do is explore how to convert colors from one color space to another.

All these examples assume that we've imported the package using any command documented at [Get Color.js](https://colorjs.io/get/). I imported the code from a CDN to make it easier to work in Codepen while exploring the library.

```js
import Color from "https://colorjs.io/dist/color.esm.js";
```

The first two examples convert colors between different color spaces or formats. In each case, we first define the starting color, one in RGB and the other in LCH.

using the `.to` method we can convert to other color spaces. This will become handy when we work when presenting the color that will work on a given browser.

```js
let color1 = new Color("rebeccapurple");
// We can switch color spaces
let color1lab = color1.to("lch");
let color1p3 = color1.to("p3");

let color4 = new Color("lch(50% 80 30)");
// We can switch color spaces
let color4srgb = color4.to("srgb");
let color4p3 = color4.to("p3");
```

&nbsp;

!!! note **Note:**
These examples purposefully ignore the issues of color gamut mapping and the possibility that, after conversion from a larger color space to a smaller one like sRGB, the resulting colors may be outside the smaller colorspace visible colors. Color.js provides tools and functions to deal with this; check [gamut mapping](https://colorjs.io/docs/gamut-mapping.html) for more information.
!!!

Once we define the color we can adjust different properties of the color that will change the color in place or will change it to a different color.

The first color gets converted to display-p3 and a lightness adjustment. and will remain mostly the same.

```js
let color1Mod1 = new Color("rebeccapurple");
color1Mod1.to("p3");
color1Mod1.lightness *= 2;
```

The second color starts from an LCH color and adjusts the lightness, chroma, and hue.

```js
let color4Mod1 = new Color("lch(50% 80 30)");
color4Mod1.lightness *= 1.2;
color4Mod1.chroma = 40;
color4Mod1.hue += 30;
```

If we use Color.js directly on the browser we can use the most appropriate color space for the browser.

We first define the color and, optionally, convert it to the initial color space and make it into a string.

We then test if the browser supports the CSS color in the format we defined. If the browser doesn't support the color then we move on to the next color space and repeat the process.

We use sRGB as the final format because it's the only format we know all browsers will support.

We log the value to the console to see the color space that the browser supports during development. We will also use the value of `cssColor` to create CSS variables that we can use in the CSS styles.

I could have chosen to start from a color space other than sRGB but I am not familiar with the syntax of those other color spaces and that probably will take longer than I would like.

```js
let color = new Color("rebeccapurple");
let cssColor = color.to("p3").toString();
if (!CSS.supports("color", cssColor)) {
  cssColor = color.to("lch").toString();
}
if (!CSS.supports("color", cssColor)) {
  cssColor = color.to("srgb").toString();
}
cssColor;
// console.log(cssColor);
```

The final step is to use the color we got from testing in the browser into a CSS variable so we can use it in multiple locations throughout the stylesheets.

We first capture a reference to the document element, this will save typing and reduce the possibility of errors.

For each color, we want to define we use [setProperty](https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/setProperty) to add the property to the style object of the root element.

```js
let root = document.documentElement;

root.style.setProperty("--color4-lch", color4);
root.style.setProperty("--color4-srgb", color4srgb);
root.style.setProperty("--color4-p3", color4p3);
root.style.setProperty("--color4-mod1", color4Mod1);
```

In browsers that support Houdini's [CSS Properties and Values API](https://drafts.css-houdini.org/css-properties-values-api/) we can use [CSS.registerProperty](https://drafts.css-houdini.org/css-properties-values-api/#the-registerproperty-function) to register a more flexible version of the variable.

As with everything on the web the power comes at the cost of flexibility. What I call `Houdini Variables` are only supported in Chromium browsers with partial support in Safari as of Safari TP (Technology Preview) 67 (for what it's worth, the current Safari TP version is 128).

```js
window.CSS.registerProperty({
  name: '--color4-modified',
  syntax: '<color>',
  inherits: false,
  initialValue: cssColor,
});
```
