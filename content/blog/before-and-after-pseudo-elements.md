---
title: "::before and ::after pseudo elements"
date: "2023-04-10"
---

`::before` and `::after` are interesting but, to me, they are hard to understand and use correctly.

These pseudo-elements are primarily used to insert content before and after an element. We can create interesting effects, particularly used with the [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property from [CSS Generated Content Module](https://w3c.github.io/csswg-drafts/css-content/) Level 3 specification.

In this post, we'll look at some examples of how these pseudo-classes work.

Two notes before we begin:

The current syntax for these pseudo-elements is `::before` and `::after`. In CSS 2.1 the syntax was `:before` and `:after` (with a single colon).

Screen readers and other assistive technologies will not read the content you place with `::before` and `::after`.

Keep this in mind when deciding what content to put in your generated content. In particular, make sure that the content you place in generated content has an alternative that is accessible.

## Numbering Sequences of Elements

The first examples of `::before` that I saw were about numbering images without having to hard code the numbers in the `<figcaption>` element.

This code does the following:

1. In the `<article>` element reset the counter that we use for images using [counter-reset](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset)
2. In the `<figure>` element we increase the value of the counter using [counter-icrement](https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment). This will happen for every image in the article
3. We use the `::before` pseudo-element to generate a string that will be placed before the text of the `<figcaption>` element. The string has three components.  
      
    The string `Figure`, a space, the value of the figure counter obtained with the [counter](https://developer.mozilla.org/en-US/docs/Web/CSS/counter) function, the string `:` and a space.  
      
    The space is significant and will appear resulting HTML.

```css
/* 1 */
article {
  counter-reset: figure_count;
}

/* 2 */
figure {
  counter-increment: figure_count;
}

/* 3 */
figcaption::before {
  content: "Figure " counter(figure_count) ": ";
}
```

With this code in place, all the captions for figures will display text like **_Figure 1:_** before the actual text of the caption.

## Adding link text or image to links

Another example of using `::before` and `::after` is to add information to links.

Note how we qualify the examples in this section. We only want the links inside `<article>` elements to show extensions or whether they are external links. This wouldn't apply to links in navigation or headers. You should review your requirements and encapsulate the links as needed

We can add text or images to external links.

The first example uses a class to define what links to apply the icon to.

```css
article.external::after {
  content: "";
  width: 11px;
  height: 11px;
  margin-left: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/%3E%3Cpath fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

We can also use [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to select all the links that have the `href` attribute and start with `http` to insert the icons into.

```css
article a[href^="http"]::after,
article a[href^="https://"]::after
{
  content: "";
  width: 11px;
  height: 11px;
  margin-left: 10px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'/%3E%3Cpath fill-rule='evenodd' d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

We can add icons for specific types of files. This example will add an icon to all links to PDF files both internal to the site and external.

```css
/* PDF */
a[href$=".pdf"]:after {
  content: '';
  background-image: url('path/to/pdficon.png');
  height: 10px;
  width: 10px;
  margin-left: 10px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
}
```

Or you can choose to add text after each link.

When you use text, make sure that there is no margin set up in the `::after` pseudo-element declaration. However the space in the content attribute is important.

```css
/* PDF */
a[href$=".pdf"]::after {
  content: ' (PDF)';
}
```

## Creating Quotation Mark Effects For Blockquotes

Perhaps the hardest exercise, to me, is adding custom quotation marks to block quotes.

In order to make this work you have to combine the `::after` and positioning.

We first define the style on the `<blockquote>`.

The important part is to give the element `postition: relative`. we also give it a width of 80 characters to make it easier to read.

```css
blockquote {
  font-size: 1.4em;
  width: 80ch;
  padding-left: 6rem;
  line-height: 1.6;
  position: relative;
}
```

In the `::before` pseudo-element we create the quote itself.

The [open-quote](https://css-tricks.com/almanac/properties/q/quotes/) value for content will insert the opening quotation mark using the browser's serif font.

We define the color in two color spaces: the six-digit hexadecimal color and the same color expressed in the lch color space.

We need to give the blockquote `position: absolute` so we can move it around using `left` and `top`.

```css
blockquote::before {
  content: open-quote;
  font-family: serif;
  color: #D2042D;
  color: lch(45.06% 80.92 30.16);
  font-size: 8em;
  position: absolute;
  left: -2px;
  top: -4rem;
}
```

One final thing. We need to "close" the quotation mark we used in the `::before` element.

One way to do it is to use the `::after` pseudo-element with content set to `no-close-quote`. This will tell the browser that we want to close the quotation mark without nesting but not show it on the screen.

```css
blockquote::after {
  content: no-close-quote;
}
```

## Adding Custom Quotation Marks for Inline Quotes

We can also create custom quotation marks we create with the [q](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q) element.

Because these quotations are inline they are much simpler to style.

```html
<p>When Dave asks HAL to open the pod bay door, HAL answers: <q>I'm sorry, Dave. I'm afraid I can't do that.</q></p>
```

By default, browsers will add quotation marks around the text to indicate inline quotations.

We can use `::before` and `::after` to change the type of quotation marks and style them as needed to match your theme.

```css
q::before {
  content: "«";
  color: red;
}

q::after {
  content: "»";
  color: red;
}
```

## Accessibility Considerations

I've mentioned this before but it bears repeating. Items we insert with `::before` and `::after` will not be read by screen readers so don't rely on inserted text as the primary mean of relying information to users.
