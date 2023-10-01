---
title: "Working with radial gradients"
date: "2023-07-03"
---

Radial gradients radiate out from a central point that you control.

The first example is a gradient between two colors.

The default position for the gradient is `50% 50%`, at the center of the containing block.

Because we didn't specify dimensions for the color stops, the browser will use its default algorithm to create the gradient.

```css
.demo01 {
  background:
    radial-gradient(
      red,
      blue
    );
}
```

The second demo shows a three color gradient placed at the default location of 50% 50%.

```css
.demo02 {
  background: 
    radial-gradient(
      red,
      green,
      blue
    );
}
```

There are two types of radial gradients: circular and elliptical. The default shape is circular.

They will each produce a different result.

`demo03` produces a circular gradient and `demo04` creates an ellyptical one.

```css
.demo03 {
  background: 
    radial-gradient(
      circle,
      red,
      blue
    );
}

.demo04 {
  background: 
    radial-gradient(
      ellipse,
      red,
      blue
    );
}
```

Besides controlling the origin and the type of gradient, we can control the position of each color stop, either as percentages or fixed length values.

```css
.demo05 {
  background:   
    radial-gradient(
      red,
      green 20%,
      blue 40%,
      cyan 20%,
      hotpink
    );
}

.demo06 {
  background: radial-gradient(
    red,
    green 200px,
    blue 100px,
    cyan 100px,
    hotpink
  );
}
```

Unlike linear gradients, we can control the size of a radial gradient.

It tales one of four possible values:

- `closest-corner`: sets the size as the distance from the starting point to the closest side of the enclosing box
- `closest-side`: sets the circle's radius to be the distance between the center of the gradient and the closest side
- `farthest-corner` **(default)**: sets the size of the gradient by the distance from the starting point to the farthest corner of the enclosing box
- `farthest-side`: sets the size of the gradient by the distance from the starting point to the farthest side.

```css
.demo07 {
  background-image:
    radial-gradient(
      farthest-corner at 40px 40px,
      #f35 0%,
      #43e 100%
    );
}

.demo08 {
  background-image: radial-gradient(
    closest-corner at 40px 40px,
    #f35 0%,
    #43e 100%
  );
}

.demo09 {
  background-image: radial-gradient(
    closest-side at 40px 40px,
    #f35 0%,
    #43e 100%
  );
}

.demo10 {
  background-image: radial-gradient(
    farthest-side at 40px 40px,
    #f35 0%,
    #43e 100%
  );
}
```

We can also combine the gradient shape, the gradient size and the gradient size in a single statement.

`demo11` shows the combined statements for a circle-shaped gradient while `demo12` shows the combined statements for an ellipsis gradient.

```css
.demo11 {
  background-image: radial-gradient(
    circle farthest-side at 0 50%,
    hotpink,
    blueviolet 20%,
    blue 30%,
    lightblue
  );
}

.demo12 {
  background-image: radial-gradient(
    ellipse farthest-side at 0 50%,
    red,
    yellow 10%,
    #1e90ff 50%,
    beige
  );
}
```

The final example shows stacked radial gradients

```css
.demo13 {
  background: radial-gradient(
    circle at 50% 0,
    rgba(255, 0, 0, 0.5),
    rgba(255, 0, 0, 0) 70.71%
  ),
  radial-gradient(
    circle at 6.7% 75%,
    rgba(0, 0, 255, 0.5),
    rgba(0, 0, 255, 0) 70.71%
  ),
  radial-gradient(
    circle at 93.3% 75%,
    rgba(0, 255, 0, 0.5),
    rgba(0, 255, 0, 0) 70.71%
  )
  beige;
  border-radius: 50%;
}
```
