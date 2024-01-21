---
title: "Select an element which doesn't descend from another in CSS"
date: 2024-01-22
tags:
  - CSS
  - Tips and Tricks
  - Notes
---

There may be times when we may want to style elements that are not direct descendants of the elements that we want to style.

In [Select an Element Which Doesn't Descend From Another in CSS](https://chriskirknielsen.com/blog/select-an-element-which-doesnt-descend-from-another-in-css/) Chris Nielsen outlines a way to do this using articles and links as examples.

This is a skeleton of the content.

```html
<body>
	...
		<article class="archived">
			<p>
				<a href="#">Link</a>
			</p>
		</article>
</body>
```

If we want to select a `a` element that is not a direct descendant of an element with the class `.archived`, we might start with code like this:

```css
:not(.archived) > a {
  background-color: hotpink;
}
```

But this will not work for any but the most basic example that have `a` elements whose parents do not have the `archived` class.

instead we can use the following selector:

```css
a:not(.archived *) {
  background-color: oklch(0.65 0.27 341);
}
```

The change to the CSS represents something different: It means match all `a` elements who are not a descendant of an element with class `archived`.
