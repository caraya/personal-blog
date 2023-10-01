---
title: "Playing with initial letters"
date: "2023-03-15"
---

Dropcaps have been around for a long time both in printed media and the web. On the web it used to be a pain to do it but, hopefully, this is changing with the introduction of the `initial-letter` property to work alongside the `::first-letter` pseudo-element.

The initial letter property takes one or two values (numbers or percentages). Using one value tells the browser how many lines the drop cap should take. The top of the drop cap letter will be aligned with the top of the first line of text and will drop down as many lines as specified.

The example below will set the first letter to drop down 4 lines.

<iframe height="300" style="width: 100%;" scrolling="no" title="Drop Cap Example (1)" src="https://codepen.io/caraya/embed/XWPbOjz?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/XWPbOjz"> Drop Cap Example (1)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

This makes it easier to create the drop caps but, as currently implemented, you can do a little more.

Using the second argument to `initial-letter` you can specify how many lines the drop cap will lower itself.

In this second example, the drop cap/initial letter still takes the space of four rows but we've also set it so the bottom of the drop cap will align with the line indicated by the second value.

<iframe height="579.6243896484375" style="width: 100%;" scrolling="no" title="Drop Cap Example (2)" src="https://codepen.io/caraya/embed/mdGJYEY?default-tab=html%2Cresult&amp;theme-id=dark" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/mdGJYEY"> Drop Cap Example (2)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

This also uses some defensive coding. We define two versions of some attributes `color` (hex and LCH) and `margin-inline-end` and `margin-right` to accommodate all browsers whether they support the newer features or not.

We can do more than just place the drop cap letter. We can change the color, and add background images and colors. Experimenting with these additional design features makes for additional exercises.

## Browser Support

Browser support is a little spotty right now. As documented in this post, `initial-letter` works in Chromium browsers (tested with Chrome 112) and Safari (tested in Safari 16.2) so you'll have to work around making it work in Firefox

The specification has many other features that haven't been implemented yet. Check the [Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1276900) for more information.

## Resources

- [Greater styling control over type with `initial-letter`](https://blog.stephaniestimac.com/posts/2023/1/css-initial-letter/)
- [caniuse.com support matrix](https://caniuse.com/?search=initial-letter)
- [Chromium issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1276900)
- [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/initial-letter)
