---
title: "Getting fancy: Shapes and masks"
date: "2015-08-26"
categories:
  - "typography"
---

[CSS Shapes](http://dev.w3.org/csswg/css-shapes/) allow designers and content creators to match some magazines layouts where the text wraps around images and other polygonal and irregular shapes.

Why do I include shapes in an essay about typography? As you can see in the examples below, shapes change the way the text relates to the surrounding images. Imagine what we can do with irregular shapes or letters (thinking of Dropcap applications).It can also be used to create shapes with text *inside* the shape (this is not part of the level 1 specification and deferred to level 2 which is currently a working draft.)

![Example of CSS shape outside](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/shape-outside-example)

<iframe height="582.752197265625" style="width: 100%;" scrolling="no" title="Shape Outside Example" src="https://codepen.io/caraya/embed/MwvvLE?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/MwvvLE">
  Shape Outside Example</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

In the future we'll be able to use shape inside and [exclusions](http://dev.w3.org/csswg/css-exclusions/) to create magazine equivalent layouts and where creativity will be the driving force, not browser constraints.

Unfortunately there doesn't seem to be much traction with exclusions or full shapes support within the CSS working group (which means that browsers are far from giving us working implementations) so we have to resort to [polyfills](https://github.com/adobe-webplatform/css-shapes-polyfill/blob/master/README.md) for shapes to account for incomplete spec support and older browsers that don't support the feature altogether. I am not a fan of polyfills but, even with all the limitations inherent to polyfills, seems like a good compromise for this particular situation.

![Example Layout using Exclusions (taken from A List Apart's article [CSS Shapes 101](http://alistapart.com/article/css-shapes-101) by [Sara Soueidan](http://sarasoueidan.com/)](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion-example)


According to the [CSS Masking](http://dev.w3.org/fxtf/masking/) specification abstract:

> CSS Masking provides two means for partially or fully hidding portions of visual elements: masking and clipping.
>
> *Masking* describes how to use another graphical element or image as a luminance or alpha mask. Typically, rendering an element via CSS or SVG can conceptually described as if the element, including its children, are drawn into a buffer and then that buffer is composited into the element’s parent. Luminance and alpha masks influence the transparency of this buffer before the compositing stage.
>
> *Clipping* describes the visible region of visual elements. The region can be described by using certain SVG graphics elements or basic shapes. Anything outside of this region is not rendered.

It has long been a trivial exercise to create masks and clip path images in Photoshop or Illustrator (and Photoshop CC makes it a really simple exercise as shown in the Lynda.com course [Design the Web: Clipping Masks](http://www.lynda.com/Photoshop-tutorials/Web-Design-Lab-Using-Clipping-Masks-Nondestructive-Cropping/114906-2.html).) But until clip paths and masks became available in CSS you had to use an external tool to create these effects.

In [Getting Fancy: Blend Modes](https://publishing-project.rivendellweb.net/getting-fancy-blend-modes/) We'll explore possibilities to do non-destructive masking using the CSS Blending draft specification directly in our web content.

### Examples and References

* [Shapes 101](http://alistapart.com/article/css-shapes-101) &mdash; A List Apart
* [Getting Started with CSS Shapes](http://www.html5rocks.com/en/tutorials/shapes/getting-started/) * HTML5 Rocks
* [Clipping and Masking in CSS](https://css-tricks.com/clipping-masking-css/)
* [Masking Tutorial](http://www.html5rocks.com/en/tutorials/masking/adobe/)
