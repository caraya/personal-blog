---
title: Creating A Default Pen for Codepen
date: 2024-10-09
tags:
  - CSS
  - Reset
---

Most of the time I create a pen in [Codepen](https://codepen.io) to validate the code I'm working with.

I've found myself constantly repeating the same CSS and the same HTML multiple times. It gets tiresome and it can lead to errors.

Codepen allows you to create template pens that you can then use to create new pens based on it.

This post will cover how to create a template pen, what to put in it and how to create new pens based on the template.

## Setting Default Styles

The first section we'll deal with is CSS.

This post takes the reset I created in [Creating a CSS Reset](https://publishing-project.rivendellweb.net/creating-a-css-reset/) and acknowledges that this is only the basic reset and will definitely be expanded for future projects.

First, we set box sizing to `border-box`.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

Prevent font size inflation by setting the value for the `*-text-size-adjust` properties to `none`.

```css
html {
  -moz-text-size-adjust: none;
  -webkit-text-size-adjust: none;
  text-size-adjust: none;
}
```

Handle defaults for the document. We set the minimal height of the document, a loose line-height and remove margin and padding.

We also set a default font stack (`system-ui, sans-serif`) and a default font size.

```css
body {
  min-height: 100vh;
  line-height: 1.5;
  margin: 0;
  padding: 0;

	font-family: system-ui, sans-serif;
	font-size: 1.25rem;
}
```

A elements that don't have a class get default styles. If a link has a class it has a special purpose.

```css
a:not([class]) {
  text-decoration-skip-ink: auto;
  color: currentColor;
}
```

Reduces the line-height and balances the text for headings 1 through 4.

```css
h1, h2, h3, h4 {
  line-height: 1.1;
  text-wrap: balance;
}
```

Next we handle the `pre` element and its idiosyncracies.

The first handles inheritance and scaling of font size accros all browsers.

```css
pre {
  font-family: monospace, monospace;
  font-size: 1em;
}
```

We also handle inline `pre` elements. This rule will handle `pre` elements that are direct children of other elements and that have no `class` or `id` attributes.

```css
* > pre:not([class]):not([id]) {
  display: inline-block;
  font-size: 1em;
  font-family: monospace, monospace;
}
```

Remove list styles on ul, ol elements. If we want to create special list we assign classes to them.

```css
ul, ol {
  list-style: none;
}
```

Another item that I'm interested in is a default for tables. The default I prefer is different from what the HTML specification provides.

I prefer to work with collapsed borders.

By default, I invert the colors of the table headers (thead tr) to black on white and stripe even rows.

Using OKLCH colors shouldn't be a problem with current versions, but it's always safe to provide a fallback.

This will also zebra stripe the body cells. Even cells have light grey background.

```css
table {
  table-layout: fixed;
  border-collapse: collapse;

  width: 100%;
  font-size: 1rem;
}

thead tr {
  background: rgb(35, 32, 37);
  background: oklch(0.25 0.01 315);
  color: rgb(255, 255, 255);
  color: oklch(1 0 106);
}

tbody tr:nth-child(even) {
  background-color: rgba(34, 32, 35, 0.125);
  background-color: oklch(24.69% 0.006 314.7 / 0.125);
}

tr {
  padding-inline-start: 1.25rem;
  padding-inline-end: 0.25rem;
  overflow-x: auto;
}

th,
td {
  border: 3px solid black;
  /* word-break: break-all; */
  overflow-wrap: break-word;
  hyphens: manual;
}
```

The last section of the reset, as far as Codepen is concerned, is figures.

First, we reset the `figures` counter for each page.

```css
body {
  counter-reset: figures;
}
```

We also reset the `figures` counter for each article. The article also sets [content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) to `auto`, potentially assisting with performance.

```css
article {
counter-reset: figures;
content-visibility: auto;
}
```

Lastly we deal with the figures themselves.

We use the `::before` pseudo element to insert a string plus the current value of the `figures` counter.

We also make sure that images inside figures use 100% of the parent figure width.

```css
figure {
counter-increment: figures;

  > figcaption::before {
    margin-block-start: 0.5em;
    content: "Figure " counter(figures) ": ";
    width: max-content;
  }

  > img {
    max-width: 100%;
  }
}
```

The CSS Reset will likely go in a `@layer` to make it work better with future code and will go trhough additional iterations going forward.

## Basic HTML

Most of the time, the layout I experiment with is 10 boxes with classes based on their position and a generic box class so I don't have to style them inidividually.

I normally use the following [emmet](https://emmet.io/) code:

```emmet
.container>(.box.box$$)*10
```

to create the following HTML output:

```html
<div class="container">
  <div class="box box01"></div>
  <div class="box box02"></div>
  <div class="box box03"></div>
  <div class="box box04"></div>
  <div class="box box05"></div>
  <div class="box box06"></div>
  <div class="box box07"></div>
  <div class="box box08"></div>
  <div class="box box09"></div>
  <div class="box box10"></div>
</div>
```

I can erase the template HTML code if necessary but I don't have to type the same command over and over anymore :)

## Any Javascript?

Depending on the API I'm testing or the code I'm writing, Javascript may not be necessary. However I always like to have a litte bit of code to remind myself that the API is available.

We capture references to the container element and to each individual box.

We then log the reference to the container to console.

Finally, I use a [forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) to loop through the boxes array and log each value to the console.

```js
const container = document.querySelector(".container");
const boxes = document.querySelectorAll(".box");

console.log(container)
boxes.forEach((box) => console.log(box));
```

## Saving as template

To save the pen as a template click on the down arrow to the right of the `save` button, located in the top section of the pen.

<figure>
<img src="https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/v1728268975/template-pen-01_uznisu.png" alt="Codepen Dialogue To Set Pen as Template">
<figcaption>Codepen Dialogue To Set Pen as Template</figcaption>
</figure>

This will make the pen available as a template to use from the Codepen main page, as show below

## Using the template for new pens

When you want to use the template pen, select it from the `Create` > `Pen` > `From Template` > `template name`

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale/f_auto,q_auto/v1728333106/template-pen-02_tqxmku.png' alt="Using available templates in Codepen" height="300">
	<figcaption>Using available templates in Codepen</figcaption>
</figure>
