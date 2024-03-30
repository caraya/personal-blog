---
title: Shapes as Layout Drivers
date: 2024-04-03
tags:
  - CSS
  - Design
  - Ideas
---

[CSS Shapes](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shapes) have been around for a long time and allow developers to wrap text around the shape of the image.

According to [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_shapes):

> The CSS shapes module describes geometric shapes that can be in CSS. For the Level 1 specification, CSS shapes can be applied to floating elements. The specification defines a number of different ways to define a shape on a floated element, causing wrapping lines to wrap round the shape rather than following the rectangle of the element's box.

## Basic Examples

The most basic example uses an image to create the shape that the text flows around and [shape-outside()](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside) to create the shape.

<iframe
  height="491.199951171875"
  style="width: 100%;"
  scrolling="no"
  title="Using images with shape-outside to create layouts v1"
  src="https://codepen.io/caraya/embed/abxyjGz?default-tab=result"
  frameborder="no"
  loading="lazy"
  allowtransparency="true"
  allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/abxyjGz">
  Using images with shape-outside to create layouts v1</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

You're not limited to shapes as defined in the specification. You can use images to define the shape that the text will flow around.

The caveat is that the images must not have a background otherwise, the shape will be that of the background, usually a square or a rectangle.

Another important detail is that the images must be floated left or right for shapes to work properly.

<iframe
  height="650.0631103515625" style="width: 100%;" scrolling="no" title="Using images with shape-outside to create layouts" src="https://codepen.io/caraya/embed/poBWvWo?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/poBWvWo">
  Using images with shape-outside to create layouts v3</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Using More Than One Floated Images

You can float images on both sides to create different layouts. In this case, we've used the same circle from the first example, one floated to the left and the other one to the right.

<iframe
  height="754.7965087890625" style="width: 100%;" scrolling="no" title="Using images with shape-outside to create layouts v4" src="https://codepen.io/caraya/embed/mdgMjoq?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/mdgMjoq">
  Using images with shape-outside to create layouts v4</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

We can also use the bee image from example #2 on this post notice how the two shapes are different and based on the legs of the bee.

<iframe
  height="603.8582153320312" style="width: 100%;" scrolling="no" title="Using images with shape-outside to create layouts v4" src="https://codepen.io/caraya/embed/VwNMvMa?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/VwNMvMa">
  Using images with shape-outside to create layouts v4</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

A few examples we haven't looked at are:

* Using different images on each side of the text
* Using multiple images throughout the page to create even more complex layouts.

## Refining The Shapes

Using `shape-outside` gives us the shape to flow content around but there are a few things that we can add to make it better.

[shape-margin](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-margin) controls the distance between the image and the text.

With this property, we control the distance between the shape and the text wrapped around it.

<iframe
  height="526.2391967773438" style="width: 100%;" scrolling="no" title="Using images with shape-outside to create layouts v1" src="https://codepen.io/caraya/embed/GRLMxKp?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/GRLMxKp">
  Using images with shape-outside to create layouts v1</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The [shape-image-threshold](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-image-threshold) CSS property sets the alpha channel threshold used to extract the shape using an image as the value for shape-outside.

Any pixels whose alpha component's value is greater than the threshold are considered to be part of the shape for determining its boundaries. For example, a value of 0.2 or .2 means that the shape will enclose all the pixels that are more than 20% opaque.

<iframe
  height="370.87811279296875" style="width: 100%;" scrolling="no" title="shape-outside and shape-margin" src="https://codepen.io/caraya/embed/zYXEWrM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/zYXEWrM">
  shape-outside and shape-margin</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Defining Shapes Without Images

So far, all the examples we've covered use images to create the shapes. There is a way to create the shapes without using an image.

See the [full-page pen](https://codepen.io/caraya/full/eYoWPwa) or the embedded pen below.

<iframe
  height="667.2340698242188" style="width: 100%;" scrolling="no" title="Using multiple shape-outside properties to create layouts v1" src="https://codepen.io/caraya/embed/eYoWPwa?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/eYoWPwa">
  Using multiple shape-outside properties to create layouts v1</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

As we did with images, we can use multiple elements floated left and right to create non-box layouts for our texts.

<iframe
  height="898.3555908203125" style="width: 100%;" scrolling="no" title="Using multiple shape-outside properties to create layouts v2" src="https://codepen.io/caraya/embed/eYoWVXa?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/eYoWVXa">
  Using multiple shape-outside properties to create layouts v2</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

We can use any of the shapes included in the [basic shapes](https://www.w3.org/TR/css-shapes/#basic-shape-functions) specified in the CSS Shapes Level 1 specification.

## Further Ideas

Another way to look at shapes is how to combine them with layouts that don't include flows of text.

CSS Grid and Custom Shapes [Part 1](https://css-tricks.com/css-grid-and-custom-shapes-part-1/), [Part 2](https://css-tricks.com/css-grid-and-custom-shapes-part-2/), and [Part 3](https://css-tricks.com/css-grid-and-custom-shapes-part-3/) show some creative uses of shapes, grids and related technologies.
