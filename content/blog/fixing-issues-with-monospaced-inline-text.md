---
title: "Fixing Issues With Pre-formatted Inline Text"
date: 2023-11-24
tags:
  - CSS
  - Notes
---

While researching about using resets as the basis for custom project defaults, I came accross this solution to a problem I was having.

> `pre, code, kbd, samp`
The `font-family: monospace, monospace` hack fixes the inheritance and scaling of font-size for preformatted text. The duplication of monospace is intentional. Source.
>
> Source: Normalize.css [README](https://github.com/necolas/normalize.css#readme)

To me, this became evident when using `code` elements inside a header.

If the element that contains the `code` element is sized using `em` the different in font size is obvious. However, if you size the element using `rem` the change doesn't appear to happen or it's small enough not to be noticeable.

See the Codepen below for an example:

<iframe height="300.095947265625" style="width: 100%;" scrolling="no" title="Size difference between text and inline code" src="https://codepen.io/caraya/embed/ExrRZqe?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ExrRZqe">
  Size difference between text and inline code</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

If you use Normalize, the font-family fix is part of the reset. If you don't, you may want to add this fix early in your stylesheets, The code looks like this:

```css
pre, code, kbd, samp {
  font-family: monospace, monospace;
}
```

or change how you size your elements to use `rem` or other root-relative units
