---
title: "Shapes in CSS: Freeing the layout"
date: "2019-10-30"
---

Shapes allow you to wrap text around parts of an image or a predefined shape. Using these shapes we can change the way text looks on the screen

## Shape without image

In its most simple way, we can wrap text around an invisible shape defined as we would a clip-path.

The HTML defines an empty `div` element that will hold the shape we define in CSS.

```html
<div class="coffee"></div>
<p>Dark, lungo, café au lait in latte fair
trade blue mountain strong, redeye sugar
seasonal café au lait Turkish. Black mug
variety, cappuccino, single-shot body sit
grounds coffee whipped Turkish et, skinny,
doppio so filter Turkish spoon affogato rich.
```

The CSS for the `.cofee` div we defined in markup holds the shape that the text will flow around.

The element must have explicit dimensions (`width` and `height`) and must be floated.

The `shape-outside` attribute describes the shape that the text will wrap around.

```css
.coffee {
  shape-outside: circle(40%);
  float: left;
  height: 300px;
  width: 300px;
}
```

The examples, so far have only used a single shape, but you can use other values for shape-outside as shown in the list below, taken from ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside)).

`none`

The float area is unaffected. Inline content wraps around the element's margin box, like usual.

`<shape-box>`

The float area is computed according to the shape of a float element's edges (as defined by the [CSS box model](https://developer.mozilla.org/en-US/docs/Web/CSS/box_model)). This can be `margin-box`, `border-box`, `padding-box`, or `content-box`. The shape includes any curvature created by the [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) property.

`margin-box`

Defines the shape enclosed by the outside margin edge. The corner radii of this shape are determined by the corresponding [`border-radius`](https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius) and [`margin`](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) values.

`border-box`

Defines the shape enclosed by the outside border edge. The shape follows the normal border radius shaping rules for the outside of the border.

`padding-box`

Defines the shape enclosed by the outside padding edge. The shape follows the normal border radius shaping rules for the inside of the border.

`content-box`

Defines the shape enclosed by the outside content edge. Each corner radius of this box is the larger of `0` or `border-radius - border-width - padding`.

[`<basic-shape>`](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape)

The float area is computed based on the shape created by of one of `[inset()](https://developer.mozilla.org/en-US/docs/Web/CSS/basic-shape#inset())`, `[circle()](/https://developer.mozilla.orgen-US/docs/Web/CSS/basic-shape#circle())`, `[ellipse()](/https://developer.mozilla.orgen-US/docs/Web/CSS/basic-shape#ellipse())`, or `[polygon()](/https://developer.mozilla.orgen-US/docs/Web/CSS/basic-shape#polygon())`.

[`<image>`](/https://developer.mozilla.orgen-US/docs/Web/CSS/image)

The float area is extracted and computed based on the alpha channel of the specified [`<image>`](/en-US/docs/Web/CSS/image) as defined by [`shape-image-threshold`](https://developer.mozilla.org/en-US/docs/Web/CSS/shape-image-threshold).

## Shape with an image

We can combine shapes with images to get a graphical effect of the text wrapping around an image rather than around a space.

In this example, we add an image of a coffee cup and give it a class to reference it from CSS.

```html
<h1>I'm nice, once I've
had my coffee</h1>

<img class="coffee"
src='path/to/coffee2.png' alt='coffee cup'>
<p>Dark, lungo, café au lait in latte
fair trade blue mountain strong, redeye
sugar seasonal café au lait turkish.
Black mug variety, cappuccino, single shot
 body sit grounds coffee whipped
 Turkish et, skinny …</p>
```

The CSS for the image (`.coffee`) uses `shape-outside` and `shape-image-threshold`.

When you use an image as the value for `shape-outside` the shape is defined by the pixels whose alpha value is greater than the threshold.

```css
.coffee {
  shape-outside: circle(50%);
  shape-image-threshold: 0.5;
  float: left;
}
```

We can play with `shape-outside` to place text on top of the image and use images of arbitrary complexity to make our text "speak" in the voice we want.

## Shapes and multiple images

Another way we can use shapes to make text flow between shapes creating custom layouts that move us outside boxes, at least visually.

The example adds two empty divs (`coffee` and `coffee2`).

```html
<div class="coffee"></div>
<div class="coffee2"></div>
<p>Dark, lungo, café au lait in latte fair
 trade blue mountain strong, redeye sugar
 seasonal café au lait Turkish. Black mug
 variety, cappuccino, single-shot body sit
 grounds coffee whipped Turkish et, skinny,
 doppio so filter Turkish spoon affogato
 rich. Steamed roast, froth fair trade
 chicory a dripper, Turkish, extra milk,
 wings, milk dark Viennese, and est, filter,
 caffeine café au lait ut aromatic aged.</p>
```

The CSS defines two identical properties that create the same space on the left and right sides.

We could abstract the common elements to a third class that we can reuse but for this example, I'm ok with the duplication.

```css
.coffee {
  shape-outside: circle(50%);
  float: left;
  height: 300px;
  width: 300px;
}

.coffee2 {
  shape-outside: circle(50%);
  float: right;
  height: 300px;
  width: 300px;
}
```

You can see the final product in this [Codepen](https://codepen.io/caraya/pen/zYYKgML)

## A more complex example

When shapes were first released there was a companion specification for regions. This demo from the Adobe Web Platform team uses both.

Sadly, Regions are not supported in any browser other than old Edge so instead, I chose to present a video from Adobe, showing the project.

<iframe width="560" height="315" src="https://www.youtube.com/embed/VON2shFlsKU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
