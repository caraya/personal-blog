---
title: "What does isolation do in CSS?"
date: "2023-06-21"
---

The [isolation](https://developer.mozilla.org/en-US/docs/Web/CSS/isolation) property provides a way for an element to create a [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) without using any special technique to do so.

Creating new stacking orders prevent an element from acquiring blend-modes from elements in the backdrop.

The following example demonstrate how isolation works with [mix-blend-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode)

<iframe height="634.86328125" style="width: 100%;" scrolling="no" title="isolation property test with background image" src="https://codepen.io/caraya/embed/wvYOWqG?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/wvYOWqG"> isolation property test with background image</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

In the example there are two elements with a magenta background. The only difference is the `isolation` declaration.

The first box with class `isolation-auto` sets isolation to `auto`, the default value. This let's the background through, blending it with the background color.

The second box with class `isolation-isolate`. This will prevent the background image in the parent element from blending through.

You can find a more technical explanation in the [Compositing and Blending Level 2 specification](https://drafts.fxtf.org/compositing/#isolation)
