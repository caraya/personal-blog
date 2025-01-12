---
title: Selecting adjacent siblings
date: 2025-01-29
tags:
  - CSS
  - Nesting
  - Design
---

This post will cover a technique to style adjacent siblings using CSS selectors and the `:has()` pseudo-class as described in [Selecting Previous Siblings](https://frontendmasters.com/blog/selecting-previous-siblings/) by Chris Coyier.

The idea is that we style the target elements using nested selectors, and then use universal selectors, the parent selector and the `has()` pseudo-class to style the adjacent selectors in both directions.

This is the basic structure for the page:

```css
.card {
  &:hover {
    /* Styles for the card being hovered */


    /* next card */
    & + * {

    }
    /* next card after that */
    & + * + * {

    }

    /* previous card */
    :has(+ &) {

    }
    /* previous card before that */
    :has(+ * + &) {

    }
  }
}
```

The base for the code uses [nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting) and the [& nesting selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector).

It does the following:

* `& + *` targets the immediate next sibling of the hovered card
  * `+` is the adjacent sibling combinator
  * `*` is the universal selector (matches any element)

This will apply styles to the card that comes immediately after the hovered `.card`

* `& + * + *` targets the next-to-next sibling after the hovered card
  * The first `+ *` selects the first sibling
  * The second `+ *` selects the second sibling after the hovered card

This will apply styles to the card that comes two siblings after the hovered `.card`

* `:has(+ &)` is a CSS relational pseudo-class that matches elements based on their descendants or siblings
  * `:has(+ &)`: This matches any element that has an adjacent sibling +  which is the hovered `.card`

This selects the card immediately before the hovered card

* `:has(+ * + &)` This matches any element that has a sibling two elements after it
  * `+ * + &` moves two cards forward and selects the one being hovered

So, `:has(+ * + &)` matches the card that is two cards before the hovered .card.

The original example uses colored bars that animate their size when hovered. I'm experimenting with the technique using images with the same effect. There are other ways to use this technique to create more polished UIs

Working with complex selectors as this, it is important to analyze the selectors and the structure of the HTML to ensure that the styles are applied correctly.
