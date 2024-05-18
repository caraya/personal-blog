---
title: What Are Duotones And How They Work
date: 2024-06-03
tags:
  - CSS
  - Design
  - Colors
---

Duotone is a graphic design technique that makes for contrasting graphics that can be combined with text and other CSS effects.

This post will look at what are duotone colors and how to create duotone colors in CSS to use with images.

## How To Create Duotone Colors in CSS?

The CSS portion of the process consists of three layers:

* A base layer (`layer1`) with a background image
  * grayscale and brightness (CSS) filters
* Two (2) layers (`layer2` and `layer3`)
  * Each with a background color and [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode) to blend the layer with the other layers

```css
.layer {
  position: absolute;
  width: 100%;
  height: 100%;
}

.layer1 {
  background-image: url(./waves.webp);
  background-size: cover;
  filter: grayscale(0.5) brightness(110%);
}

.layer2 {
  background: oklch(45.93% 0.308 265.15);
  mix-blend-mode: screen;
}

.layer3 {
  background: oklch(73.12% 0.1946 351.856);
  mix-blend-mode: multiply;
}
```

The HTML is just placeholders for the styles:

```html
<div class="image-container">
	<div class="layer layer1"></div>
	<div class="layer layer2"></div>
	<div class="layer layer3"></div>
</div>
```

My main issue is to select the right blend mode for each layer.

For the example above, I've chosen to use the `screen` blend mode in one layer and `multiply` on the other.

For reference, these are the possible values for `background-blend-mode` and `mix-blend-mode`. Note that modes may produce different, and unexpected, results.

For a detailed explanation see [Blending Modes: A Complete Guide for Graphic and Web Design](https://www.elegantthemes.com/blog/design/blending-modes)

* **No blending**:
  * normal
* **Darken**:
  * darken
  * multiple
  * color-burn
* **Lighten**:
  * lighten
  * screen
  * color-dodge
* **Adjust Contrast**:
  * overlay
  * soft-light
  * hard-light
* **Invert Colors**:
  * difference
  * exclusion
* **Change individual HSL/OKLCH components**:
  * hue
  * saturation
  * luminosity
  * color

To have a better understanding, I've created a playground where we can experiment with blend modes in general and duotone specifically.

<iframe height="790.0562744140625" style="width: 100%;" scrolling="no" title="duotone experiments" src="https://codepen.io/caraya/embed/Yzbywzm?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/Yzbywzm">
  duotone experiments</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

You can play with the repository to test the different possible value combinations. The full CSS code for layers one, two, and three is displayed under the controls.

If you want to use your own images you can edit the CSS for `layer1`. Change the image's `background-image` URL value or you can fork the repo to work on your own.

The code is also available on this [GitHub Repo](https://github.com/caraya/duotone-demo) and the repo's [GitHub Pages](https://caraya.github.io/duotone-demo/).

## Links and Resources

* [Blend Modes](https://web.dev/learn/css/blend-modes/)
* [Basics of CSS Blend Modes](https://css-tricks.com/basics-css-blend-modes/)
* [Blending Modes](https://typefully.com/DanHollick/blending-modes-KrBa0JP)
[Blending Modes: A Complete Guide for Graphic and Web Design](https://www.elegantthemes.com/blog/design/blending-modes)
* [Taming Blend Modes: `difference` and `exclusion`](https://css-tricks.com/taming-blend-modes-difference-and-exclusion/)
* [Image Effects With CSS](https://bennettfeely.com/image-effects/)
* [Duotone](https://garden.bradwoods.io/notes/css/blend-modes#duotone)
* [The duotone effect: what it is and how to create a duotone design](https://99designs.com/blog/trends/duotone-design/)
