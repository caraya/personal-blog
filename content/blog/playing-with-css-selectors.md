---
title: "Playing with CSS Selectors"
date: 2024-02-07
tags:
  - CSS
---

CSS has evolved significantly over the last few years. Some of these changes deal with a set of selectors known as the *functional pseudo-classes*.

The `:not()` pseudo-class has been around for a while (at least since IE9), but when the other selectors we'll discuss on the post were introduced in the [Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors/) specification, the [:not()](https://drafts.csswg.org/selectors/#negation) pseudo-class was changed to accept a selector list to keep it in line with the other functional pseudo-classes.

## The **:is()** Pseudo-class

The Matches-Any Pseudo-class accepts a comma-separated list of selectors and matches any element that can be selected by one of the items in the list.

This example will match any h2 element that is contained in an article, section, or aside element.

```css
:is(article, section, aside) h2 {
	color: oklch(0.65 0.27 341);
}
```

This would be useful when we want to style all elements of the same type in some sections of a document but not everywhere.

## The **:not()** Pseudo-class

This pseudo-class represents elements that do not match a list of selectors in the parameter.

The first example will select all the list items except the last one (all the `li` elements that are not the last child on the list).

```css
li:not(:last-child) {}
```

The following example will change the colors of all links that are not descendants of an article, down to any level.

```css
h2:not(article *) {
  color: oklch(1 1 1);
  background-color: oklch(0 0 0)
}
```

## The **:has()** Pseudo-class

The Relational Pseudo-class provides a way to select a parent element based on its children or siblings.

According to the CSS Selectors Level 4 specification (emphasis mine):

> The `:has()` pseudo-class cannot be nested; `:has()` is not valid within `:has()`. Also, unless explicitly defined as a **:has-allowed pseudo-element**, pseudo-elements are not valid selectors within `:has()`. (This specification does not define any :has-allowed pseudo-elements, but other specifications may do so.)
>
> Source: [CSS Selectors Level 4](https://drafts.csswg.org/selectors/#relational)

The first example will only match an `a` element with an image as their direct child.

```css
a:has(> img) {
	text-decoration: none;
}
```

The following selector matches a `dt` element immediately followed by another `dt` element:

```css
dt:has(+ dt) {
	font-weight: 700;
}
```

The following selector uses `:not()` and `:has()` to match `section` elements that without any heading elements:

```css
section:not(:has(h1, h2, h3, h4, h5, h6)) {
	border: 1px solid red;
}
```

## The **:where()** Pseudo-class

:where(), behaves like the :is() selector, but its specificity is always zero.

## Note about specificity

When a functional pseudo-class like `:is()`, `:not()` or `:has()` takes more than one selector as its value, it takes the highest specificity of the included selectors.

Using an example from [Surprising Facts About New CSS Selectors](https://cloudfour.com/thinks/surprising-facts-about-new-css-selectors/) we'll see how these selectors change the way CSS matches.

Given the following CSS rules

```css
:is(#unique, p) {
	color: red;
}

.intro {
	color: green;
}
```

We would expect the HTML below to match the `.intro` rule since a class selector has higher specificity

```html
<p class="intro">This will also be red</p>
```

But even if the paragraph doesn't have an `id` attribute, the `:is()` attribute contains a more specific ID attribute, making it more specific than a class attribute.

If you use the `:where()` selector, then the specificity of the selector is always equal to zero (0). If we change the pseudo-class from is to `:where()` we'll have the opposite result.

The `p` element will have a specificity of zero even though it's part of a `where()` selector with an `id` attribute. The specificity will be zero regardless of the specificity of the components inside the selector.

`<p class="intro"></p>` will be green, rather than red.

```css
:where(#unique, p) {
	color: red;
}

.intro {
	color: green;
}

/*
<p class="intro">This will be green</p>
*/
```
