---
title: "Making my life easier: Color Conversion Tool"
date: "2023-06-19"
---

> "We will encourage you to develop the three great virtues of a programmer: laziness, impatience, and hubris." — Larry Wall, Programming Perl (1st edition), Oreilly And Associates Taken from: [Laziness Impatience Hubris](https://wiki.c2.com/?LazinessImpatienceHubris).

This came in to my mind today as I finished a quick and dirty color conversion tool.

All the new color spaces available in the new color [level 4](https://www.w3.org/TR/css-color-4/) and [color level 5](https://www.w3.org/TR/css-color-5/) specifications it makes it hard to keep all the different syntaxes in my head.

So I wrote a little app that, given a color, will produce a color swatch for the seven syntaxes I'm interested in:

- rgb
- display-p3
- lab
- hwb
- hsl
- OKLAB
- OKLCH

It will also display the CSS syntax to use each color space along with the value for the color.

Under the hood, it leverages [color.js](https://colorjs.io/) to generate the colors.

It can definitely be improved and there are other tools that can supplement the transformation tool.

## HTML

The HTML is a simple form with one text input field, submit and reset buttons.

The rest of the content of the page is generated from Javascript

```html
<form id='colorForm'>
  <input type='text' id='colorInput' placeholder='Enter a color'>
  <input type='submit' value='Submit'>
  <input type='reset' value='Reset'>
</form>
```

## Javascript

The Javascript is still fairly simple. It will take the value of the HTML input and generate HTML to display to the user.

The first step is install color.js

```bash
npm i colorjs.io
```

We then import the color.js modules that we want to use. This will facilitate tree shaking when we bundle the code at build time.

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

The next step is to register the color spaces for parsing and converting.

sRGB can parse keywords and hex colors so we can use three and six digit hexadecimal numbers (#fff, #ffffff) and named colors (lightgray, rebeccapurple)

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

We then create a container element for the outermost container, we give it an `class` attribute so we can style it later and append it to the body of the page.

```js
const container = document.createElement('div')
container.classList.add('container')
document.body.appendChild(container)
```

the `buildColorBlock` function takes two parameters, the color name and the color space that we want to convert the color to.

The function will do the following:

1. Convert the color to the specified format
2. Create a div with classes `box` and `box-${colorspace}`
3. Set the box background color to the converted color
4. Create a paragraph element and set the text inside to the string value of the converted color
5. Use [appendChild](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) to attach the paragraph created in step 4 to the box we created in step 2
6. We append the box to the container we created outside the function

```js
function buildColorBlock(color, space) {
  // 1
  const theColor = serialize(convert(color, `${space}`))

  // 2
  const box = document.createElement('div')
  box.classList.add('box', `box-${space}`);

  // 3
  box.style.backgroundColor = theColor;

  // 4
  const para = document.createElement('p')
  para.textContent = theColor;

  // 5
  box.appendChild(para);

  // 6
  container.appendChild(box);
};
```

We then call `buildColorBlock` once for each color format that we want to convert to. Because we can use any color format supported by Color.js it is possible that the color we enter matches exactly one of the colors displayed.

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

This code will produce the following result, using magenta as an example.

![](/images/2023/05/color-tool-01.png)

Color conversion tool showing results for color magenta
