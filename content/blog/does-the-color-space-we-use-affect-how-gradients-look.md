---
title: "Does the color space we use affect how gradients look?"
date: "2023-07-12"
---

When gradients were first introduced we only had hex and rgb/rgba colors for monitors that only worked on the sRGB color space so the gradients would look the same in all monitors.

With the introduction of the new color spaces in the CSS Color Level 4, and the way they work it is appropriate to ask the question: _do all color spaces work the same with gradients_

[Adam Argyle](https://twitter.com/argyleink) created a comparison to test the look of linear gradients across the color spaces in the CSS Color [level 4](https://www.w3.org/TR/css-color-4/) and [level 5](https://www.w3.org/TR/css-color-5/) modules and supported by the underlying [color.js](https://colorjs.io) library.

<iframe height="465.1748046875" style="width: 100%;" scrolling="no" title="Interactive color space interpolation results" src="https://codepen.io/argyleink/embed/JjZajmb?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/argyleink/pen/JjZajmb"> Interactive color space interpolation results</a> by Adam Argyle (<a href="https://codepen.io/argyleink">@argyleink</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

It appears that OKLAB provides the smoother gradient from all the supported colors. You'll have to decide if this is what you want for your project.

I created a series of conical gradients in different color spaces to see if t here is any difference based on the color space.

I can't really tell but perhaps readers can :)

<iframe height="667.498779296875" style="width: 100%;" scrolling="no" title="Repeating Gradients Demo" src="https://codepen.io/caraya/embed/zYMGmQP?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/zYMGmQP"> Repeating Gradients Demo</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>
