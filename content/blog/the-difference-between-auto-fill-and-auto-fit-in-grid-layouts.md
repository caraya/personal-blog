---
title: The difference between auto-fill and auto-fit in grid layouts
date: 2024-05-29
tags:
  - CSS
  - Layout
---

Even after all these years, I've struggled to understand the difference between `auto-fill` and `auto-fit` values when used in creating grid layouts.

The easiest way to create a grid of equal columns is to use the [repeat](https://developer.mozilla.org/en-US/docs/Web/CSS/repeat) function:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}
```

But this may cause each column to be smaller than we'd like it to be, especially on phones and other small form factor devices.

To prevent this, we use the [minmax](https://developer.mozilla.org/en-US/docs/Web/CSS/minmax) function. Similar in intent to clamp, this function defines a size that is greater than or equal to the min value and less than or equal to the max.

In the example below, we make the columns that are 1fr but no smaller than 200 pixels.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(200px, 1fr));
}
```

But this is still not an ideal solution since this will cause overflow in the row. The columns will not wrap into new rows if the viewport width is too narrow, because we’re explicitly telling the browser to repeat the columns 12 times per row.

That's where `auto-fill` and `auto-fit` come into play. Both will populate the row of content.

<iframe height="492.2781982421875" style="width: 100%;" scrolling="no" title="auto-fill vs auto-fit" src="https://codepen.io/SaraSoueidan/embed/JrLdBQ?default-tab=result&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/SaraSoueidan/pen/JrLdBQ">
  auto-fill vs auto-fit</a> by Sara Soueidan (<a href="https://codepen.io/SaraSoueidan">@SaraSoueidan</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The difference between the two is rather hard to understand and it has to deal with how they handle available space **before the row wraps around**.

According to [Sara Soueidan](https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/):

> auto-fill FILLS the row with as many columns as it can fit. So it creates implicit columns whenever a new column can fit, because it’s trying to FILL the row with as many columns as it can. The newly added columns can and may be empty, but they will still occupy a designated space in the row.
>
> auto-fit FITS the CURRENTLY AVAILABLE columns into the space by expanding them so that they take up any available space. The browser does that after FILLING that extra space with extra columns (as with auto-fill ) and then collapsing the empty ones.

The way I see it:

* Use `auto-fill` when you need the content to take the full width of the available viewport
* Use `auto-fit` when you want to keep the way content looks without expanding it to the width of the viewport

As usual, test to see which works best for your project.

## Links and Resources

* <https://css-tricks.com/auto-sizing-columns-css-grid-auto-fill-vs-auto-fit/>
* <https://defensivecss.dev/tip/auto-fit-fill/>
* <https://codepen.io/SaraSoueidan/pen/JrLdBQ>
