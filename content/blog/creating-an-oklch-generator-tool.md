---
title: "Creating an OKLCH generator tool"
date: 2024-02-21
tags:
  - CSS
  - Javascript
  - Color
---

This code started as an exercise in ChatGPT prompt generation and a way to explore what we can do with OKLCH colors. It uses vanilla Javascript and deliberately avoids using libraries like [Chroma.js](https://gka.github.io/chroma.js/) or [Color.js](https://colorjs.io/).

The basis for the project is a color builder. On top of that, we build a series of additional tools to make other color experiments.

CSS support for OKLCH colors is part of the [CSS Color Level 4](https://www.w3.org/TR/css-color-4/#lab-colors) specification so you need to be mindful that older versions of your browsers may not support the color space of the notation.

The color components are:

L (perceived lightness)
: A number between 0 and 1 or the keyword none
: The number 0 corresponds to 0% (black) and the number 1 corresponds to 100% (white)

C (chroma or amount of color)
: A number between 0 and 1, or the keyword none
: Its minimum useful value is 0, while the maximum is theoretically unbounded, but in practice does not exceed 0.5.

H (hue angle)
: A from 0 to 360, or the keyword none, which represents the hue angle.

A (Alpha, Optional)
: A number between 0 and 1, or the keyword none.
: The number 0 corresponds to full transparency and 1 corresponds to full opacity.

The basic color builder will allow us to experiment with modifying the different components of an OKLCH color.

## The base color builder

The Javascript code depends on HTML. The first part is to capture the values of the sliders in the HTML page and use them to create a string literal representing the OKLCH color with each component in the correct order.

```js
function updateColor() {
  const lightness = document.getElementById("lightness").value;
  const chroma = document.getElementById("chroma").value;
  const hue = document.getElementById("hue").value;
  const alpha = document.getElementById("alpha").value;

  const oklchColor = `oklch(${lightness} ${chroma} ${hue} / ${alpha})`;
```

We then style the `color-display` box with the generated color as the background. We use the [color-contrast](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-contrast) function to provide the best text color against the background.

```js
  const colorDisplay = document.getElementById("color-display");

  colorDisplay.style.backgroundColor = oklchColor;
  colorDisplay.style.color = `color-contrast(${oklchColor} vs black, white)`;
  document.getElementById("color-display").innerText = oklchColor;
```

We call each of our auxiliary functions so they will also update when the values of the sliders change.

```js
  updateComplementaryColor(lightness, chroma, hue, alpha);
  updateLighterDarkerColors(lightness, chroma, hue, alpha);
  updateTriadicPalette(lightness, chroma, hue, alpha);
  updateTetradicPalette(lightness, chroma, hue, alpha);
}
```

### Setting up the sliders

Rather than add an event listener to each slider, we cheat.

`document.querySelectorAll("input[type=range]")` will return a list of all the sliders (matching `input[type=range]`).

We then loop through the resulting list using the [forEach()] method of the array object to add an event listener for the [input](https://developer.mozilla.org/en-US/docs/Web/API/Element/input_event) event to call the `updateColor` function.

```js
document.querySelectorAll("input[type=range]").forEach((slider) => {
  slider.addEventListener("input", updateColor);
});
```

With this in place, we have a working OKLCH color creator that will update every time we change the values of the sliders and will also update the ancillary functions discussed below.

## Calculating the contrast color

The first function will calculate the complementary color. For this function, we define complementary color as the color that is 180 degrees from the original in the hue wheel.

We use the [remainder (%)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder) operator in `(parseFloat(hue) + 180) % 360` to make sure that whatever value we get will remain within the 0 to 360 range.

Next, we create the div element to use for the complementary color and style it with inline styles and, finally, we insert the complementary color string as text inside the color box.

```js
function updateComplementaryColor(lightness, chroma, hue, alpha) {
  let complementaryHue = (parseFloat(hue) + 180) % 360;
  const complementaryColor = `oklch(${lightness} ${chroma} ${complementaryHue} / ${alpha})`;

	const complementaryElement = document.getElementById("complementary");

	complementaryElement.style.backgroundColor = complementaryColor;

	complementaryElement.style.color = `color-contrast(${complementaryColor} vs black, white)`;

	complementaryElement.innerText = `${complementaryColor}`;
}
```

## Monochromatic scale

The monochromatic scale is based on the color lightness. It will generate four darker and four lighter values and will display them alongside the base color.

The color generation is done in two separate [for loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for).

The first one will loop in descending order from four to one and in each iteration of the loop it will:

* Calculate the lightness value for this step and constraint the value to the largest between the lightness and 0
* Build the OKLCH color string
* Build the HTML to display, using the OKLCH color string for styles and the text inside the box
* Append the HTML we created to the `darkerColorsHtml` string

```js
function updateLighterDarkerColors(lightness, chroma, hue, alpha) {
  const step = 0.1;

  let darkerColorsHtml = "";
  let lighterColorsHtml = "";

  // Generate four darker colors, from darkest to lightest
  for (let i = 4; i >= 1; i--) {
    let newLightness = parseFloat(lightness) - step * i;
    newLightness = Math.max(newLightness, 0);
    newLightness = newLightness.toFixed(2);

    const color = `oklch(${newLightness} ${chroma} ${hue} / ${alpha})`;

		darkerColorsHtml += `<div class="color-display" style="background-color: ${color}; color: color-contrast(${color} vs black, white);">${color}</div>`;
  }
```

Next, we add the base color to keep as a reference point to compare lighter and darker colors.

```js
  // Add the base color
  const baseColor = `oklch(${parseFloat(lightness).toFixed(
    2
  )} ${chroma} ${hue} / ${alpha})`;
  const baseColorHtml = `<div class="color-display" style="background-color: ${baseColor}; border: 2px solid #000; color: color-contrast(${baseColor} vs black, white);">${baseColor}</div>`;
```

The second loop will run in ascending order to create the four lighter colors.

The steps are almost identical to the steps we used to build the darker colors. The difference is that we constrain the value to be the smaller value between the lightness value and 1

```js
	// add four lighter colors
  for (let i = 1; i <= 4; i++) {
    let newLightness = parseFloat(lightness) + step * i;
    newLightness = Math.min(newLightness, 1);
    newLightness = newLightness.toFixed(2);

    const color = `oklch(${newLightness} ${chroma} ${hue} / ${alpha})`;

		lighterColorsHtml += `<div class="color-display" style="background-color: ${color}; color: color-contrast(${color} vs black, white);">${color}</div>`;
  }
```

The last portion of the page will insert the strings we generated in order: darker colors, the base colors, and the lighter colors.

```js
  document.getElementById("lighter-darker-colors").innerHTML =
    darkerColorsHtml + baseColorHtml + lighterColorsHtml;
}
```

These colors will also change when the values on the sliders are updated since the base color will be different.

## Triadic colors

![Hue Color Wheel. Source [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/hue/color_wheel.svg)](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/color_wheel.svg)

[Triadic colors](https://www.interaction-design.org/literature/article/triadic-color-scheme) are three colors equidistant in the color wheel.

In this context equidistant means there are 120 degrees of separation between the colors and if you draw a line between the colors on the wheel, they will form a triangle.

The most important part of this function is the `hueStep` variable that holds the separation between the colors.

We run a `for` loop with the number of steps that we want.

Next, we calculate the hue for the color at this step. We use the reminder function to ensure that the value remains within the acceptable parameters.

We then create the HTML element to represent the color and push it into the `paletteHtml` array.

We use [array.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join) method to create a space-separated string that we'll insert into the `triadic-palette` HTML element.

```js
function updateTriadicPalette(lightness, chroma, hue, alpha) {
  const paletteHtml = [];
  const hueStep = 120;

  for (let i = 0; i < 3; i++) {
    let newHue = (parseFloat(hue) + i * hueStep) % 360;
    const color = `oklch(${parseFloat(lightness).toFixed(
      2
    )} ${chroma} ${newHue} / ${alpha})`;
    paletteHtml.push(
      `<div class="color-display" style="background-color: ${color}; color: color-contrast(${color} vs black, white);">${color}</div>`
    );
  }

  document.getElementById("triadic-palette").innerHTML = paletteHtml.join("");
}
```

## Tetradic colors

Tetradic colors are similar to triadic colors but it uses four colors that are 90 degrees from each other in the color wheel forming a square in the color wheel.

```js
function updateTetradicPalette(lightness, chroma, hue, alpha) {
  const paletteHtml = [];
  const hueStep = 90; // Step for tetradic colors

  for (let i = 0; i < 4; i++) {
    let newHue = (parseFloat(hue) + i * hueStep) % 360;
    const color = `oklch(${parseFloat(lightness).toFixed(
      2
    )} ${chroma} ${newHue} / ${alpha})`;
    paletteHtml.push(
      `<div class="color-display" style="background-color: ${color}; color: color-contrast(${color} vs black, white);">${color}</div>`
    );
  }

  document.getElementById("tetradic-palette").innerHTML = paletteHtml.join("");
}
```

## Putting it all together

The final step is to call `updateColor()`. This will display the colors the first time the page loads before we make any changes to the sliders.

```js
updateColor();
```
