---
title: Playing with box-shadows
date: 2024-05-08
tags:
  - CSS
  - Shadows
---

In developing a card with [box-shadow](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) I realized that it's harder than I remembered so I decided to take another look.

Box shadow takes two, three or four parameters.

If two values are specified, they are interpreted as `offset-x` (horizontal offset) and `offset-y` (vertical offset) values.
: Negative `offset-x` value places the shadow to the left of the element. Negative `offset-y` value places the shadow above the element.
: If not specified, the value of 0 is used for the missing length. If both `offset-x` and `offset-y` are set to 0, the shadow is placed behind the element (and may generate a blur effect if `blur-radius` and/or `spread-radius` is set).

If three values are specified, the third value is interpreted as `blur-radius`.
: The larger this value, the bigger the blur, so the shadow becomes bigger and lighter. Negative values are not allowed.
: If not specified, it will be set to 0 (meaning that the shadow's edge will be sharp).

If four values are specified, the fourth value is interpreted as `spread-radius`.
: Positive values will cause the shadow to expand and grow bigger. Negative values will cause the shadow to shrink.
: If the fourth value is not specified, it will be set to 0 (that is, the shadow will be the same size as the element).

The explanation kind of works but I need a visual representation so I created a visualizer in Codepen.

The parameters in the visualizer match the descriptions provided above.

<iframe height="517.0225219726562" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/VwNNWPQ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/VwNNWPQ">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

So far we've only discussed a single box shadow. You can add multiple box-shadow instances separated by commas to create more complex effects surrounding your boxes of content.

It is also important to note that `box-shadow` is different from `text-shadow`. `box-shadow` works on the box around the text and `text-shadow` works on the text itself.
