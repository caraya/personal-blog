---
title: Be Mindful Of The Reading Order
date: 2024-09-25
tags:
  - HTML
  - Reading
youtube: true
---

When we work with content for the web, we usually don't worry about the reading flow of a document, based on writing mode and writing direction. In Latin languages, we're used to right to left, to bottom.

On the web, this also means that the content will be displayed in the order it appears in the DOM.

This is how most assitive technology also works. For example: screen readers will "speak" the content in  document order.

However when we work with Flexbox and Grid layouts, we can change the order of part or parts of the document without changing the order they appear in the document. This may have accessibility implications and may cause the accessible document and the document we open in the browser may not be the same.

There are two properties that allow developers to control the flow of the page content: `reading-flow` and `order`.

[reading-flow](https://drafts.csswg.org/css-display-4/#reading-flow)controls the order in which elements in a flex or grid layout are rendered to speech or are navigated to when using (linear) sequential navigation methods.

The possible values of the property are:

normal
: Follow the order of elements in the DOM.

flex-visual
: Only takes effect on flex containers. Follows the visual reading order of flex items, taking the writing mode into account.

flex-flow
: Only takes effect on flex containers. Follows the flex-flow direction.

grid-rows
: Only takes effect on grid containers. Follows the visual order of grid items by row, taking the writing mode into account.

grid-columns
: Only takes effect on grid containers. Follows the visual order of grid items by column, taking the writing mode into account.

grid-order
: Follows the order-modified document order. Therefore, as normal unless the order property has been used to change the order of items.

I find this property problematic. Reading this nore in the specification for `reading-flow`:

> The source document should express the underlying logical order of elements. The reading-flow property exists for cases where a given document can have multiple reading orders depending on layout changes, e.g. in response to media queries. In such cases, the most common or most fundamental reading order should be encoded in the source order so that the document is sensical without CSS.
>
> Source Note on [Reading Order: the reading-flow property](https://drafts.csswg.org/css-display-4/#reading-flow)

I'm trying to understand the accessibility note. Does changing the layout of a page actually change the meaning of the text being read?

In reading the explanation of this example in it took me a while to understand it.

Given this HTML:

```html
 <div class="wrapper">
  <a href="#">Blog</a>
  <a href="#">About</a>
  <a href="#">Main</a>
</div>
```

Using the folllowing CSS:

```css
.wrapper {
  display: flex;
  flex-direction: row-reverse;
}
```

keyboard navigation using the [[tab]] key will navigate in the same flex direction, for English, this would be right to left (`Blog`, `About`, `Main`).

If we now add the `reading-flow: flex-visual` to the block the content will now read like expected, left to right (`Main`, `About`, `Blog`).

```css
.wrapper {
  display: flex;
  flex-direction: row-reverse;
  reading-flow: flex-visual;
}
```

When using `reading-flow` make sure that changing the visual reading flow doesn't change the meaning of the content.

[order](https://drafts.csswg.org/css-display-4/#order-property) controls the order in which flex items or grid items appear within their container, by assigning them to ordinal groups.

Given the following HTML:

```html
<div class="card">
  <div class="card--image">
    <img src="images/image.avif" alt="">
  </div>
  <div class="card--content">
    <h2>Card Title</h2>

    <p>Card Content</p>
  </div>
  <div class="card--footer">
    <h2>Footer</h2>
  </div>
</div>
```

We can then use the `order` property in CSS to change the way that the content will appear on the screen without changing the order content appears on the doucment or the way assistive technology will read the content.

This example will place the content in the following order:

1. Content
2. Footer
3. Image

```css
.card {
  inline-size: 30vw;
  margin-inline: auto;
  display: flex;
  flex-flow: column;
}

.card--image {
  order: 3;

  > img {
    width: 400px;
    height: 150px
  }
}

.card--content {
  order: 1;
  inline-size: 40ch;
}

.card--footer {
  order: 2;

  ul {
    list-style-type: none;
    margin: 0;
    display: flex;
    justify-content: space-between;
  }
}
```

Since order changes the way the content appears on screen we need to ensure that the content still makes sense when reading the content in the new visual layout.

This is concerning because the new visual reading order we've implemented may be different than the document order, which is what assistive technologies use.

They also point out that users who access the content via different modalities may not have the same experience with the document, even if the content itself remains unchanged.

WCAG Techniques calls attention to these possible pitfalls. In their Technique C27 they mentions that:

> This could be due to the user switching off the author-specified presentation, by accessing the content directly from the source code (such as with a screen reader), or by interacting with the content with a keyboard. If a blind user, who reads the page with a screen reader that follows the source order, is working with a sighted user who reads the page in visual order, they may be confused when they encounter information in different orders. A user with low vision who uses a screen magnifier in combination with a screen reader may be confused when the reading order appears to skip around on the screen. A keyboard user may have trouble predicting where focus will go next when the source order does not match the visual order.
>
> [WCAG Technique C27: Making the DOM order match the visual order](http://www.w3.org/TR/WCAG20-TECHS/C27.html)

If you want to learn more about this, look at the related WCAG criteria: [Guideline 1.3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation.html) and its associated success criteria.

## Additional Resources

* [Grid, content re-ordering and accessibility](https://rachelandrew.co.uk/archives/2019/06/04/grid-content-re-ordering-and-accessibility/)
* [Source Order Matters](https://adrianroselli.com/2015/09/source-order-matters.html)
* [Flexbox & the keyboard navigation disconnect](https://tink.uk/flexbox-the-keyboard-navigation-disconnect/)
* [The Dark Side of the Grid (Part 2)](https://www.matuzo.at/blog/the-dark-side-of-the-grid-part-2/#visual-order)
* WCAG Techniques and Guidelines
  * [WCAG Technique C27: Making the DOM order match the visual order](http://www.w3.org/TR/WCAG20-TECHS/C27.html)
  * [Understanding Guideline 1.3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation.html)
    * [Understanding SC (Success Criterion) 1.3.1](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-programmatic.html)
    * [Understanding SC 1.3.2](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-sequence.html)
    * [Understanding SC 1.3.3](https://www.w3.org/TR/UNDERSTANDING-WCAG20/content-structure-separation-understanding.html)
