---
title: Playing with text-shadows
date: 2024-05-13
tags:
  - CSS
  - Shadows
---

[text-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow) allows for interesting effects on text.

The property takes two or three values with an optional color as the fourth value

offset-x and offset-y (Required)
: These values specify the shadow's distance from the text.
: `offset-x` specifies the horizontal distance; a negative value places the shadow to the left of the text.
: `offset-y` specifies the vertical distance; a negative value places the shadow above the text.
: If both values are 0, the shadow is placed directly behind the text, although it may be partly visible due to the effect of `blur-radius`.

blur-radius (Optional).
: The higher the value, the bigger the blur; the shadow becomes wider and lighter.
: If not specified, it defaults to 0.

color (Optional)
: The color of the shadow. It can be specified either before or after the offset values. I prefer to put it at the end, as the fourth value.
: If unspecified, the color's value is left up to the user agent, so when consistency across browsers is desired you should define it explicitly.

I normally use text shadows on larger text, like display text or titles. Just like I did with box shadows, I created a quick visualizer to see what exact values do with the text.

The one change that I've made from the spec is that I'm requiring a color for the shadow, defaulting it to black.

<iframe height="798.7268676757812" style="width: 100%;" scrolling="no" title="Text Shadow Visualizer" src="https://codepen.io/caraya/embed/QWPPPbN?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/QWPPPbN">
  Text Shadow Visualizer</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

You can use more than one shadow in `text-shadow` properties. When you do so, the shadows are applied front-to-back, with the first-specified shadow on top.

One final note: The look of the shadows depends on the font you use. You should change the font on the visualizer to match the font you're using for your content.
