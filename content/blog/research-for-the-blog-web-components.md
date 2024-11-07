---
title: Research for the blog - Color.js Web Components
date: 2024-11-18
tags:
  - Design
  - Web Components
  - Evaluation
colorjs: true
share: true
---

!!! warning **Warning:**
These components are under development and they may change without notice.

If the current version of the components meets your needs you may want to pin to the specific version you're currently using. This may also mean hosting your own version of the library
!!!

Working in blog updates (and ideas for future projects) I started looking at web components as an alternative to manually updating code for each type of component I want.

These are likely not the only options for what I want to do but are the one I'm evaluating at the time of writing.

## color.js

[Color.js elements](https://elements.colorjs.io/) provide experimental, ready-made components to address color related code examples.

I don't normally work with colors but it's always nice to have when explaining different color spaces and when working in color-based demonstrations.

### Using The Components

The library makes available a series of components so we'll look at four specific elements. You can review the other components in the [website](https://elements.colorjs.io/)

#### color-picker

The [color-picker](https://elements.colorjs.io/src/color-picker/) elements displays a slider-based color picker that will display the selected color. It will also fire events that will enable you to use the color you picked in styles for other parts of the page.

This code:

```html
<color-picker space="oklch" color="oklch(60% 30% 180)"></color-picker>
```

Will produce the following result:

<color-picker space="oklch" color="oklch(60% 30% 180)"></color-picker>

The [color-picker reference](https://elements.colorjs.io/src/color-picker/#reference) for the component's API.

#### color-scale

The [color-scale](https://elements.colorjs.io/src/color-scale/) component provides a visual representation of a color scale presented in the `colors` attribute.

You can enter the colors in any color space supported in color.js. The component will convert the colors to the space specified in the `space` attribute.

This code:

```html
<color-scale space="oklch" colors="
  Gray 50: #f9fafb,
  Gray 100: #f3f4f6,
  Gray 200: #e5e7eb,
  Gray 300: #d1d5db,
  Gray 400: #9ca3af,
  Gray 500: #6b7280,
  Gray 600: #4b5563,
  Gray 700: #374151,
  Gray 800: #1f2937,
  Gray 850: #1a202c,
	Gray 900: #111827,
"></color-scale>
```

Will produce the following result:

<color-scale space="oklch" colors="
  Gray 50: #f9fafb,
  Gray 100: #f3f4f6,
  Gray 200: #e5e7eb,
  Gray 300: #d1d5db,
  Gray 400: #9ca3af,
  Gray 500: #6b7280,
  Gray 600: #4b5563,
  Gray 700: #374151,
  Gray 800: #1f2937,
  Gray 850: #1a202c,
	Gray 900: #111827
"></color-scale>

There is no actual API since this is a presentational element but you can check the [color-scale](https://elements.colorjs.io/src/color-scale/) page for more information on what attributes are available.

#### color-swatch

The [color-swatch](https://elements.colorjs.io/src/color-swatch/) element creates color swatches that can be edited if so configured.

The input file inside the `color-swatch` component will render the value of the selected color.

This code:

```html
<color-swatch value="oklch(70% 0.25 138)" size="large">
	<input />
</color-swatch>
```

Will render the following result:

<color-swatch value="oklch(70% 0.25 138)" size="large">
	<input />
</color-swatch>

#### color-inline

The [color-swatch](https://elements.colorjs.io/src/color-swatch/) element renders a swatch of color inline with other content like text.

```html
<p>This will render the color
	<color-inline contentEditable>lch(50% 40 30)</color-inline> inline.</p>
```

<p>This will render the color <color-inline contentEditable>lch(50% 40 30)</color-inline> inline.</p>

See the [color-inline reference](https://elements.colorjs.io/src/color-inline/#reference) for the component's API.

### Loading The Library

In your root template, add the following code to conditionally load the library if the variable exists (and it's set to true).

{% raw %}
```handlebars
{% if colorjs %}
  <script src="https://elements.colorjs.io/index.js"></script>
{% endif %}
```
{% endraw %}

And then, for each individual post add the following code to the post's front matter.

```yaml
colorjs: true
```

This is just one example of how to use web components in an Eleventy blog or application. There are other sets of components that I would like to use and will require similar
