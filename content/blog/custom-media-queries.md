---
title: Custom Media Queries
date: 2025-03-03
tags:
  - CSS
  - Media Queries
---

When working with [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries) is that we can't reuse media queries.

A naive approach is to define the value as a CSS variable in the `:root` pseudo-class.

```css
:root {
  --width: 20em;
}
```

And then use the variable in the media query. **Unfortunately, this doesn't work**.

```css
/* This will not work */
@media (min-width: var(--width)) {
}
```

Instead of using CSS variables, we can use [custom media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@media#Custom_media_queries). These are aliases for media queries.

This is a two step process. First, we define the media query using `@custom-media`. The value for the custom media is included in parentheses and is equivalent to the media query.

```css
@custom-media --narrow-window (max-width: 30em);
```

You can also use combination of queries in the `@custom-media` rule declaration.

```css
@custom-media --modern (color), (hover);
```

You then reference the custom media query in the `@media` rule, either indivudually.

```css
@media (--narrow-window) {
  /* narrow window styles */
}

@media (--modern) {
	/* modern styles */
}
```

Or in combination with other media queries and logical operators.

```css
@media (--narrow-window) and (script) {
  /* styles for when script is allowed */
}
/* other styles */
```

## Some considerations

A `@custom-media` rule can refer to other custom media queries. However, loops are forbidden, and a custom media query must not be defined in terms of itself or of another custom media query that directly or indirectly refers to it. Any such attempt of defining a custom media query with a circular dependency must cause all the custom media queries in the loop to fail to be defined.

If multiple `@custom-media` rules declare the same named query, the truth value is based on the last one alone, ignoring all previous declarations of the same name.

## Conclusion

Using custom media queries makes stylesheets easier to read and maintain. You have to be careful when defining custom media queries to avoid circular dependencies and to ensure that the custom media query is defined before it is used.

## Links and References

* [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) &mdash; MDN Web Docs
* [Media Queries Level 5](https://www.w3.org/TR/mediaqueries-5/) &mdash; W3C Working Draft
* [Custom Media Queries](https://www.w3.org/TR/mediaqueries-5/#custom-mq) &mdash; W3C Working Draft
* [Can we have custom media queries, please?](https://dev.to/stefanjudis/can-we-have-custom-media-queries-please-ngb)
