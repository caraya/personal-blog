---
title: "Working With Conical gradients"
date: "2023-07-05"
---

Conical gradients can do different things than linear gradients but, from my perspective, they are harder to work with (or it may be I have a harder time reasoning through them).

The conic gradients work with two or more colors and, at he most basic level work like linear gradients.

Note that for these examples we've set a default `border-radius` of 50% so they'll appear in a circle.

The first example shows the simplest conic gradient between two colors. Note how there is a third, purplish color at the bottom of the demo

```css
.demo01 {
  background-image: conic-gradient(
    red,
    blue
  );
}
```

The next example shows a three color conical gradient going from red to rebeccapurple to blue.

```css
.demo02 {
  background: conic-gradient(
    #ff0000,
    #663399,
    #0000ff
  );
}
```

Demo03 shows a rainbow conic gradient going from red to violet. Note how the colors transitions from one color to the other

```css
.demo03 {
  background: conic-gradient(
    red,
    orange,
    yellow,
    green,
    blue,
    indigo,
    violet
  );
}
```

We can position the conic center in different positions inside the container using the keyword `at` and one or two precentage values to represent the origin.

This will control how the cone looks in the space.

```css
.demo04 {
  background: conic-gradient(
    at 0% 50%,
    red 10%,
    blue 30%,
    hotpink 50%
  );
}
```

If you give one value for position (after the `at` keyword) it will be treated as if center was the first omitted value

```css
.demo05 {
  background: conic-gradient(
    at 50%,
    red 10%,
    blue 30%,
    rebeccapurple 60%
  );
}
```

Using `from` and an angle unit, in this case 45deg, rotates the gradient by the specified amount.

with multiple colors, this means we control where the first color in the gradient will appear.

```css
.demo06 {
  background: conic-gradient(
    from 45deg,
    red 25%,
    blue 25%,
    hotpink,
    green);
}
```

We can use the any of the units that express [angles](https://developer.mozilla.org/en-US/docs/Web/CSS/angle) in CSS.

```css
.demo07 {
  background: conic-gradient(
    from .25turn,
    blue,
    green,
    red
  );
}
```

Interestingly, you use conical gradients to create chekered patterns.

The `conic-gradient` background defines the shape of the pattern and the `background-size` defines its dimensions.

Because we want this background to be a square, we override the `border-radius` property.

```css
.demo08 {
  border-radius: 0;
  background: conic-gradient(
    black 25%,
    white 0deg 50%,
    black 0deg 75%,
    white 0deg
  );
  background-size: 50px 50px;
}
```

This example from Lea Verou's [Conical gradients, today!](https://lea.verou.me/2015/06/conical-gradients-today/) presents another interesting use case for conical gradients, creating pie charts or similar graphical elements.

The first example presents a two-color pie chart where Gold takes the initial 40% of the pie and the other color takes the rest. In this case we use a single value for each color stop indicating where we want the color to "end".

```css
.demo09 {
  background:
   conic-gradient(
    gold 40%,
    #f06 0);
}
```

When you create pie charts with more than two colors you need to specify two values on each color, where it starts and where it ends.

Demo10 shows how this works:

- Gold goes from 0 to 40%
- #f06 goes from 40% to 75%
- lightblue goes from 75% to 0, completing the full circle

```css
.demo10 {
  background: conic-gradient(
    gold 0 40%,
    #f06 40% 75%,
    lightblue 75% 0
  )
}
```

You can see the examples in this Codepen:

<iframe height="439.75372314453125" style="width: 100%;" scrolling="no" title="Conical Gradients Demo" src="https://codepen.io/caraya/embed/qBQWXMY?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/qBQWXMY"> Conical Gradients Demo</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>
