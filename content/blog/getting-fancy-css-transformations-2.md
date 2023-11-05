---
title: "Getting fancy: CSS Transformations"
date: "2015-08-19"
categories:
  - "typography"
---

One of the most intriguing things we can do with text is change its position and the way it looks on the screen with nothing but CSS in browsers that support it. The good news is that [all browsers except IE8 and Opera Mini support transformations](http://caniuse.com/#feat=transforms2d) so we won't have to do workarounds.

![An example of what is possible with CSS shapes and transformations (taken from A List Apart's article [CSS Shapes 101](http://alistapart.com/article/css-shapes-101) by [Sara Soueidan](http://sarasoueidan.com/).](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/rhombic)

We'll start with rotating the header of our content 90 degrees and move it down the column.

<iframe height="421.165771484375" style="width: 100%;" scrolling="no" title="CSS Content Rotation - Take 1" src="https://codepen.io/caraya/embed/ZGJJvy?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ZGJJvy">
  CSS Content Rotation - Take 1</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

It looks good but I think it can look better. When we move it sideways the text looks very small and when we make the font larger it forces the text into 2 rows... and that's not what I want... I want the larger text to stay in one column.

What I realized was that I had to change the design. Rather than keep the heading inside the content area, it would work better if we move the `h2` element outside the content area and style it separately.

Transformations are very dependent on the dimensions of the content you're working with. The codepen below shows the heading in the smallest media query I set up for the demo (800px wide). The heading is not rotated but displayed in above the text as in a regular page.

<iframe height="561.1591186523438" style="width: 100%;" scrolling="no" title="CSS Content Rotation Using Media Queries" src="https://codepen.io/caraya/embed/MwvWYd?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/MwvWYd">
  CSS Content Rotation Using Media Queries</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

But if you look at a screenshot below, you'll see what the code work when you set the screen as wide as possible.

![Heading moved sideways 90 degrees counter clockwise](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/full-width-translated-object)

Media queries would be the best solution to accommodate for all screen sizes. You will have to decide if Media Queries and Vendor prefixes is worth the effort and how many media queries you would have to create for your code to look good in your target device(s). It's not a perfect solution, it requires tons of work and needs to be adjusted for all your target breakpoints and devices.

This is just the beginning of what you can do. Mozila Developers Network (MDN) provides a very good [overview of CSS transformations](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to show what you can do.

***Because this is dependent on screen resolution (when is a pixel is not a pixel) you must test in your target devices. Also : Just because you can it doesn't mean you should.* As great as transformations are they take time and may detract from your audience's attention.**

### Links and Resources

* [CSS Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) (MDN)
* [Using CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms) (MDN)
