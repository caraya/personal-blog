---
title: Color tools and experiments - Color Converter
date: 2023-10-30
---

The more I play with [color.js](https://colorjs.io), the more I love it. I created two simple tools on top of it to make my life easier.

The first one is a color converte.

This post will discuss why I created it and how it works.

## The tools

I've built each tool as a separate [Vite](https://vitejs.dev/) project to make sure I got them working.

A future iteration of this project will combine them into a single project. The future version will also move to Typescript as I become more comfortable with types and the Typescript extensions to Javascript.

### Color conversion

The first tool is a color converter. It takes a color in one color space and converts it to a set of color spaces.

I've moved most of my CSS colors to OKLCH and I wanted the ability to convert other color spaces to OKLCH to work with. Eventhough browser support for OKLCH is good, I've always added one or more fallbacks to my CSS.

The color spaces I'm using are:

* sRGB (includes hex and keyword colors)
* P3
* Lab
* LCH
* OKLab
* OKLCH
* HWB
* HSL

So using a name in any of these colors will produce a set of color blocks showing the color in each color space along with the corresponding string to use in your CSS.

Also important to know; because the objective of this is to display the color blocks in a web page, the code builds a lot of the HTML in Javascript.

The first step is to import all the code from Color.js. I choose to import individual methods rather than the full Color.js package to enable [tree shaking](https://webpack.js.org/guides/tree-shaking/).

```js
import {
  to as convert,
  serialize,
  ColorSpace,
  sRGB,
  P3,
  Lab,
  LCH,
  OKLab,
  OKLCH,
  HWB,
  HSL,
} from "colorjs.io/fn";
```

The next step is to register the color spaces for parsing and conversion. Color.js supports many other color spaces documented in Color.js' [Supported Color Spaces](https://colorjs.io/docs/spaces) documentation.

The sRGB color space also supports hex (#ffffff) and keyword (white) colors.

With this in place we can enter any color on the spaces we've registered.

We could expand this to include all the color spaces supported by Color.js but for web-related work, it's best to limit the list to the colors below, and maybe constrain it even further.

```js
ColorSpace.register(sRGB);
ColorSpace.register(P3);
ColorSpace.register(Lab);
ColorSpace.register(LCH);
ColorSpace.register(OKLab);
ColorSpace.register(OKLCH);
ColorSpace.register(HWB);
ColorSpace.register(HSL);
```

Next, we create the outer HTML elements that will populate the page.

```js
const container = document.createElement('div')
container.classList.add('container')
document.body.appendChild(container)
```

The core of the code is the `buildColorBlock` function.

The function takes a color and a color space and builds the HTML for the color block.

1. It first converts the color to the specified color space. We will use these values in the color block.
2. We create a box using [document.createElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
   1. We add two classes using the [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList) method, one generic to style later and one with the background color
   2. We set the background color matching the color we defined in step 1
3. We create a paragraph using  `document.createElement`
   1. We set the text of the paragraph to the text of the `theColor` variable we set earlier

```js
export function buildColorBlock(color, space) {
  // 1
  const theColor = serialize(convert(color, `${space}`))

  // 2
  const box = document.createElement('div')
  box.classList.add('box', `box-${space}`);
  box.style.backgroundColor = theColor;

  // 3
  const para = document.createElement('p')
  para.textContent = theColor;

  // 4
  box.appendChild(para);
  container.appendChild(box);
};
```

As the last step, we call `buildColorBlock` once for each color space we want to show.

```js
export function processInput(color) {
  buildColorBlock(color, 'sRGB');
  buildColorBlock(color, 'P3');
  buildColorBlock(color, 'Lab');
  buildColorBlock(color, 'LCH');
  buildColorBlock(color, 'hwb');
  buildColorBlock(color, 'hsl');
  buildColorBlock(color, 'OKLab');
  buildColorBlock(color, 'OKLCH');
}
```

In future iterations we may change the code to use an array of formats and then loop through the array to perform the required tasks.

## Links and Resources

* [Color.js](https://colorjs.io/)
  * [Contrast](https://colorjs.io/docs/contrast.html)
  * [Color Spaces](https://colorjs.io/docs/spaces.html)
* [The Science of Color & Design](https://material.io/blog/science-of-color-design)
