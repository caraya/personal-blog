---
title: "Numbering sections of content"
date: "2022-08-17"
---

There are times when we need to number things that are not ordered list.

The best example, from my experience, is numbering sections of content in the `h1` element serving as the title for each section of content.

The idea is to turn this heading:

```html
<section>
  <h2>This is the first chapter</h2>
</section>
```

Into this text:

```text
Chapter 1: This is the first chapter.
```

Without adding additional markup to the document.

## The solution: Counters and generated content

Just like we did in a previous post to add content for figure captions, we'll leverage generated content and counters to insert text into the heading and automatically increase the numbering of our chapters.

The first thing we need to do is create a larger container to use as the base of the document where we will reset the counter for chapters. In this case, I will use the `body` element.

```css
body {
  /* Whatever else you need */
  counter-reset: chapter-counter;
}
```

We then increment the counter for every `section` element since they will contain our chapters.

```css
section {
  counter-increment: chapter-counter;
}
```

Finally, we generate and add the text to the chapter's `h2` element using the `::before` pseudo-element.

```css
section h2::before {
  content: "Chapter " counter(chapter-counter) ": "
}
```

For the first chapter, this will insert the string: ***Chapter 1:*** before the text in the `h2` element.

As with any application of generated content, we need to keep accessibility in mind. The generated content may not work well with assistive technology. It may not work well with some screen readers or it may not work at all.

See [Accessible CSS Generated Content](https://yatil.net/blog/accessible-css-generated-content) for an example of why this is important.

## Full example

<iframe height="639.18017578125" style="width: 100%;" scrolling="no" title="Numbering Chapters" src="https://codepen.io/caraya/embed/oNqEbvY?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/oNqEbvY">
  Numbering Chapters</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
