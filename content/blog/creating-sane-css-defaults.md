---
title: "Creating Sane CSS defaults"
date: 2023-12-25
tags:
  - CSS
---

Both [Eric Meyer's Reset](https://meyerweb.com/eric/thoughts/2007/05/01/reset-reloaded/) and [Normalize.css](https://necolas.github.io/normalize.css/) are comprehensive solutions to provide a baseline for CSS development.

Can I build a set of defaults that make sense for my projects on top of these resets? what shape would this set of defaults take?

Ever since I decided to move this blog to Eleventy, I've been thinking about moving the CSS to use [@CSS Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer). This would make it easier to organize the stylesheet.

## Getting started

We'll use Normalize as our base layer and leverage the fact that you can import stylesheets directly to a layer

## Links and resources

* [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)
* [@layer]([@CSS Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)) &mdash; MDN
* [The future of CSS: Cascade layers](https://www.bram.us/2021/09/15/the-future-of-css-cascade-layers-css-at-layer/)


