---
title: "New Media Query Ranges"
date: "2023-05-29"
---

This is what we're used to do when working with media queries.

We use `and` and `or` to represent logical comparisons.

This example matches viewports that are 30em or larger.

```css
@media screen and (min-width: 30em) {
  .element {
    /* Styles go here*/
  }
}
```

It gets more complicated when you're working with multiple, simultaneous, conditions. This query will match when the viewport width is between 30em and 80em (larger than 30em and smaller than 80em)

```css
@media screen and (min-width: 30em) and (max-width: 80em) {
  .element {
    /* Style away! */
  }
}
```

Media Queries Level 4 introduced the concept of ranges.

Rather than provide a direct equivalency, you can use a comparison operator from the list below to compare against the attribute and the value you're testing.

The operators available to compare are:

- `<` evaluates if a value is less than another value
- `>` evaluates if a value is greater than another value
- `=` evaluates if a value is equal to another value
- `<=` evaluates if a value is less than or equal to another value
- `>=` evaluates if a value is greater than or equal to another value

We can simplify the queries by using one of the new comparison operators

```css
@media screen and (min-width: 30em) {}
```

Can also be expressed as:

```css
@media and (width > 30em) {}
```

Likewise we can simplify a compound query by using two comparisons. The width must be larger than 30em and smaller than 80em.

```css
@media ( 30em < width < 80em ) {}
```

We could also be a little more defensive and use `<=` to indicate that it should be equal or smaller than, rather than just smaller than.

```css
@media ( 30em <= width <= 80em ) {}
```

Range media queries don't replace boolean media queries (`and`, `or`), they complement them. You still need both of them.

```css
@media screen and ( 30em <= width <= 80em ) {}
```

For a full list of media queries, check: [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)
