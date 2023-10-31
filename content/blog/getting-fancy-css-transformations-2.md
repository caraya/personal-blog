---
title: "Getting fancy: CSS Transformations"
date: "2015-08-19"
categories:
  - "typography"
---

One of the most intriguing things we can do with text is change its position and the way it looks on the screen with nothing but CSS in browsers that support it. The good news is that [all browsers except IE8 and Opera Mini support transformations](http://caniuse.com/#feat=transforms2d) so we won't have to do workarounds.

\[caption id="attachment\_786436" align="aligncenter" width="438"\][![Example of what you can do with transitions and shapes](/images/2015/06/rhombic.jpg)](http:/images/2015/06/rhombic.jpg) An example of what is possible with CSS shapes and transformations (taken from A List Apart's article [CSS Shapes 101](http://alistapart.com/article/css-shapes-101) by [Sara Soueidan](http://sarasoueidan.com/).)\[/caption\]

We'll start with rotating the header of our content 90 degrees and move it down the column.

\[codepen\_embed height="373" theme\_id="2039" slug\_hash="ZGJJvy" default\_tab="result" user="caraya"\]See the Pen [CSS Content Rotation - Take 1](http://codepen.io/caraya/pen/ZGJJvy/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

It looks good but I think it can look better. When we move it sideways the text looks very small and when we make the font larger it forces the text into 2 rows... and that's not what I want... I want the larger text to stay in one column.

What I realized was that I had to change the design. Rather than keep the heading inside the content area, it would work better if we move the `h2` element outside the content area and style it separately.

Transformations are very dependent on the dimensions of the content you're working with. The codepen below shows the heading in the smallest media query I set up for the demo (800px wide). The heading is not rotated but displayed in above the text as in a regular page.

\[codepen\_embed height="830" theme\_id="2039" slug\_hash="MwvWYd" default\_tab="result" user="caraya"\]See the Pen [CSS Content Rotation Using Media Queries](http://codepen.io/caraya/pen/MwvWYd/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

But if you look at a screenshot below, you'll see what the code work when you set the screen as wide as possible.

\[caption width="800" align="aligncenter"\][![/images/2015/06/full-width-translated-object.png](//publishing-project.rivendellweb.net/wp-content/uploads/2015/06/full-width-translated-object.png)](/images/2015/06/full-width-translated-object.png) /images/2015/06/full-width-translated-object.png \[/caption\]

Media queries would be the best solution to accommodate for all screen sizes. You will have to decide if Media Queries and Vendor prefixes is worth the effort and how many media queries you would have to create for your code to look good in your target device(s). It's not a perfect solution, it requires tons of work and needs to be adjusted for all your target breakpoints and devices.

This is just the beginning of what you can do. Mozila Developers Network (MDN) provides a very good [overview of CSS transformations](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) to show what you can do.

**_Because this is dependent on screen resolution (when is a pixel is not a pixel) you must test in your target devices. Also :_ _Just because you can it doesn't mean you should._ As great as transformations are they take time and may detract from your audience's attention.**

### Links and Resources

- [CSS Transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) (MDN)
- [Using CSS Transforms](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms) (MDN)
