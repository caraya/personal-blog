---
title: "Color"
date: "2015-07-22"
categories: 
  - "typography"
---

Another aspect to consider is the color for your typefaces. This is a very design-dependent step. Were you given a color palette as part of your design brief? Then use those. But if you're planning your own project then you can use the tools below.

[Adobe Color CSS](https://color.adobe.com/) (Formerly known as Adobe Kuler) let's you create color sets for your projects. If you use SASS/SCSS you can then turn the colors into variables to use in your CSS.

Dudley Storye creataed a [color Thesaurus](http://demosthenes.info/blog/927/The-New-Defaults-A-Sass-Color-Thesaurus) that makes it easier to see what the colors will look like in the page. We can combine the colors from the chart with text to test

For this section I've created an [Adobe Color CC Palette](https://color.adobe.com/Labs-Color-Scheme-1-color-theme-3359413/).

It may not have al the colors I need and I'm in no way required to use all the colors in the palette but I will set them up anyways so we can see what it looks like in all the colors available to the palette.

\[codepen\_embed height="577" theme\_id="2039" slug\_hash="LVjVzY" default\_tab="result" user="caraya"\]See the Pen [Example Colored Headings](http://codepen.io/caraya/pen/LVjVzY/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

The first palette is fairly cool, let's see what other colors look like on our heading text; to do so, I've chosen a [second palete](https://color.adobe.com/Copy-of-Coral-Sea-color-theme-6005348/) from Color CC.

\[codepen\_embed height="573" theme\_id="2039" slug\_hash="ZGJGXq" default\_tab="result" user="caraya"\]See the Pen [Colored headings, take 2](http://codepen.io/caraya/pen/ZGJGXq/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

We can also test color with our paragraph formatting. I will pick the second color palette for this experiment. Notice how the lighter colors make things harder to read and the darker colors help... When we discuss accessibility concerns we'll touch on color blindness and contrast as necessary elements of your typographical design.

**Technical note:** In the example below there are two values for color in each selector. I coded it that way to provide a fallback solution for older browsers that do not support RGB color syntax. If the browser doesn't support RGB colors the rule will be ignored and the browser will move to the hexadecimal color and, hopefully, will render it without an issue.

\[codepen\_embed height="969" theme\_id="2039" slug\_hash="gpxpXg" default\_tab="result" user="caraya"\]See the Pen [Colored Paragraph Example](http://codepen.io/caraya/pen/gpxpXg/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

Even different shades of gray/grey may have an impact. In the last color example I've picked different shades of grey for each paragraph color. As with many things related to type, the best color for your text will depend on the typeface you choose.

\[codepen\_embed height="969" theme\_id="2039" slug\_hash="pJrJdK" default\_tab="result" user="caraya"\]See the Pen [Paragraph in Shades of Gray/Grey](http://codepen.io/caraya/pen/pJrJdK/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]
