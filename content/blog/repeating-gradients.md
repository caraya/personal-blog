---
title: "Repeating gradients"
date: "2023-07-10"
---

linear-gradient(), radial-gradient(), and conic-gradient() don't automatically repeat color stops. However, there are functions taht do:

- repeating-linear-gradient()
- repeating-radial-gradient()
- repeating-conic-gradient()

The size of the repeating gradient line or arc is the length between the first color stop value and the last color stop length value.

If the first color stop just has a color and no color stop length, the value defaults to 0.

If the last color stop has just a color and no color stop length, the value defaults to 100%.

If you don't declare a value for either the first or last colors, the gradient line is 100% meaning the linear and conic gradients will not repeat and the radial gradient will only repeat if the radius of the gradient is smaller than the length between the center of the gradient and the farthest corner.

One final note before we jump into the demos. These will require more attributes than just the repeating gradients. The additional attributes will be pointed out when need it.

`linear-demo01` is a basic repeating linear gradient presenting diagonal, alternating, blue and hotpink lines.

```css
.linear-demo01 {
  background: 
    repeating-linear-gradient(
      45deg,
      blue 0px 10px,
      hotpink 20px 25px
    );
}
```

The second repeating linear gradient demo uses stacked repeating gradients to create a random pattern.

```css
.linear-demo02 {
    background: repeating-linear-gradient(
      190deg,
      rgba(255, 0, 0, 0.5) 40px,
      rgba(255, 153, 0, 0.5) 80px,
      rgba(255, 255, 0, 0.5) 120px,
      rgba(0, 255, 0, 0.5) 160px,
      rgba(0, 0, 255, 0.5) 200px,
      rgba(75, 0, 130, 0.5) 240px,
      rgba(238, 130, 238, 0.5) 280px,
      rgba(255, 0, 0, 0.5) 300px
    ), repeating-linear-gradient(
      -190deg,
      rgba(255, 0, 0, 0.5) 30px,
      rgba(255, 153, 0, 0.5) 60px,
      rgba(255, 255, 0, 0.5) 90px,
      rgba(0, 255, 0, 0.5) 120px,
      rgba(0, 0, 255, 0.5) 150px,
      rgba(75, 0, 130, 0.5) 180px,
      rgba(238, 130, 238, 0.5) 210px,
      rgba(255, 0, 0, 0.5) 230px
    ), repeating-linear-gradient(
      23deg,
      red 50px,
      orange 100px,
      yellow 150px,
      green 200px,
      blue 250px,
      indigo 300px,
      violet 350px,
      red 370px
    );
}
```

You can create tartan or plaid like patterns using multiple repeating linear gradients.

One of the color values is [transparent](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color#transparent), a fully transparent color that is a shortcut for rgba(0,0,0,0).

This demo uses the older [rgba](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb) color syntax to control the opacity of the colors in the gradient.

The demo uses multiple [backgrounds](https://developer.mozilla.org/en-US/docs/Web/CSS/background), each with its own background image.

```css
.linear-demo03 {
  repeating-linear-gradient(
      0deg,
      transparent,
      transparent 50px,
      rgba(255, 127, 0, 0.25) 50px,
      rgba(255, 127, 0, 0.25) 56px,
      transparent 56px,
      transparent 63px,
      rgba(255, 127, 0, 0.25) 63px,
      rgba(255, 127, 0, 0.25) 69px,
      transparent 69px,
      transparent 116px,
      rgba(255, 206, 0, 0.25) 116px,
      rgba(255, 206, 0, 0.25) 166px
    ), repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 5px,
      rgba(143, 77, 63, 0.25) 5px,
      rgba(143, 77, 63, 0.25) 10px
    ), repeating-linear-gradient(
      45deg,
      transparent, transparent 5px,
      rgba(143, 77, 63, 0.25) 5px,
      rgba(143, 77, 63, 0.25) 10px);
  background: repeating-linear-gradient(
      90deg,
      transparent 0 50px,
      rgba(255, 127, 0, 0.25) 50px 56px,
      transparent 56px 63px,
      rgba(255, 127, 0, 0.25) 63px 69px,
      transparent 69px 116px,
      rgba(255, 206, 0, 0.25) 116px 166px
    ), repeating-linear-gradient(
      0deg,
      transparent 0 50px,
      rgba(255, 127, 0, 0.25) 50px 56px,
      transparent 56px 63px,
      rgba(255, 127, 0, 0.25) 63px 69px,
      transparent 69px 116px,
      rgba(255, 206, 0, 0.25) 116px 166px
    ), repeating-linear-gradient(
      -45deg,
      transparent 0 5px,
      rgba(143, 77, 63, 0.25) 5px 10px
    ), repeating-linear-gradient(45deg,
    transparent 0 5px,
    rgba(
        143,
        77,
        63,
        0.25
    ) 5px 10px);
}
```

`linear-demo04`, and `linear-demo05`, show different variations of repeating linear gradients.

`linear-demo04` creates two-tone red bricks.

```css
.linear-demo04 {
  background-color: silver;
  background-image:   
    linear-gradient(
      335deg,
      #b00 23px,
      transparent 23px
    ),
    linear-gradient(
      155deg,
      #d00 23px,
      transparent 23px
    ),
    linear-gradient(
      335deg,
      #b00 23px,
      transparent 23px
    ),
    linear-gradient(
      155deg,
      #d00 23px,
      transparent 23px
    );
  background-size: 58px 58px;
  background-position:
    0px 2px,
    4px 35px,
    29px 31px,
    34px 6px;
}
```

`linear-demo05` is repeating set of diagonal lightgray bricks

```css
.linear-demo05 {
  background:
linear-gradient(135deg, #708090 21px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px),
linear-gradient(225deg, #708090 21px, #d9ecff 22px, #d9ecff 24px, transparent 24px, transparent 67px, #d9ecff 67px, #d9ecff 69px, transparent 69px)0 64px;
background-color:#708090;
background-size: 64px 128px;
}
```

`linear-demo06` creates a composition notebook background.

In theory we could adjust the separation between the lines and place the text above each line so it appears as if we're writing on the notebook.

```css
.linear-demo06 {
  background-color: #fff;
  background-image:
  linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),
  linear-gradient(#eee .1em, transparent .1em);
  background-size: 100% 1.2em;
}
```

`radial-demo01` creates a series of concentric black circles

```css
.radial-demo01 {
    background: repeating-radial-gradient(
    black 0 5px,
    white 5px 10px
  );
}
```

`conic-demo01` presents a repeating conic gradient centers on the left-center of the image and a brown, goldenrod and dark goldenrod sequence of colors.

```css
.conic-demo01 {
  background: 
    repeating-conic-gradient(
      from 45deg at 10% 50%,
      brown 0deg 10deg,
      goldenrod 10deg 20deg,
      darkgoldenrod 20deg 30deg);
}
```

`conic-demo02` shows a repeating conical gradient with shades of blue.

```css
.conic-demo02 {
  background: repeating-conic-gradient(
    from 3deg at 25% 25%,
    hsl(200, 100%, 50%) 0deg 15deg,
    hsl(200, 100%, 60%) 10deg 30deg
  )
}
```

`conic-demo03` creates an interesting repeating conic gradient with colors, because we repeat it, the colors will slightly overlap and produce the effect we see in the result

```css
.conic-demo03 {
  background: repeating-conic-gradient(
    from -45deg,
    red 45deg,
    orange,
    rebeccapurple,
    green,
    blue 225deg)
}
```
