---
title: "Color Interpolation and Hue Interpolation"
date: "2023-07-17"
---

While I was researching gradients, I came across a couple of interesting features introduced in the [CSS Color Level 4 specification](https://www.w3.org/TR/css-color-4/)

You can specify the color you want the gradient to run on. This is called hue interpolation.

The example below uses the OKLab color space in the conic gradient

```css
.oklab01 {
  background: conic-gradient(
    in oklab,
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

You can also specify how browsers interpolates the hues in a gradient

The four possible values are:

- shortest
- longest
- increasing
- decreasing

The Codepen below shows the different hue interpolation methods used with the same two colors from cyan to blue.

<iframe height="428.021" style="width: 100%;" scrolling="no" title="Gradient Color Interpolation" src="https://codepen.io/caraya/embed/bGQVmgO?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/bGQVmgO"> Gradient Color Interpolation</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

## Links and Resources

- [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient) — MDN
- [Using CSS Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_images/Using_CSS_gradients) — MDN
- [A Deep CSS Dive Into Radial And Conic Gradients](https://www.smashingmagazine.com/2022/01/css-radial-conic-gradient/)
- Gradients in the [CSS Color Level 4 specification](https://drafts.csswg.org/css-images-4/#gradients)
- [Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient) — MDN
- [Gradient hue interpolation](https://nerdy.dev/gradients-going-the-shorter-longer-increasing-or-decreasing-route)
- [Gradient in modern color spaces](https://codepen.io/argyleink/pen/JjZajmb) — Codepen — Adam Argyle
- [Interactive color space interpolation results](https://codepen.io/argyleink/pen/GRGPxEJ)— Codepen — Adam Argyle
