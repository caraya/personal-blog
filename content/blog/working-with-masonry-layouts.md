---
title: Working With Masonry Layouts
date: 2025-01-01
tags:
  - CSS
  - Masonry
  - Layout
  - Design
---

It appears that the CSS Working Group has decided to add masonry layouts as part of the [CSS Grid Level 3](https://drafts.csswg.org/css-grid-3/) specification. IMO this sucks but it appears to be a done deal that will hurt developers in the long run but, since it's a done deal it's time to move forward and learn how to work with it.

Before we look at the details of how to work with the new masonry layout, I'll take a brief detour and explain why I think it's a bad idea.

## Why I think it's a bad idea

In [Help us choose the final syntax for Masonry in CSS](https://webkit.org/blog/16026/css-masonry-syntax/), the WebKit team presents the following table comparing the option of just using grid with additional parameters and the masonry syntax proposed by the Chrome team in [An alternative proposal for CSS masonry](https://developer.chrome.com/blog/masonry)

| Just Use Grid option | New Masonry Layout option |
| :---: | :---: |
| display: grid | display: masonry |
| grid-template-columns /<br>grid-template-rows | masonry-template-tracks |
| grid-template-rows: collapse /<br>grid-template-columns: collapse |masonry-direction: column /<br>masonry-direction: row |
| grid-template-areas | masonry-template-areas |
| grid-template | masonry-template |
| grid-auto-flow | masonry-direction |
| masonry-fill | masonry-flow |
| gap | gap |
| grid-column-start /<br>grid-row-start	| masonry-track-start |
| grid-column-end /<br>grid-row-end |masonry-track-end |
| grid-column / grid-row | masonry-track |
| grid-auto-columns / grid-auto-rows | masonry-auto-tracks |
| grid | masonry |
| grid-slack (name TBD) | masonry-slack (name TBD) |

Then later in the article they state that:

> It [the new layout] will require developers to memorize a parallel layout system with an entire second set of syntax.

How is that different than having to learn masonry-specific values for existing grid properties? Does the number of properties to learn make a difference?

Keeping masonry as part of grid adds an unnecessary cognitive switch of having to figure out what attributes work everywhere versus what works in Masonry or Grid alone.

It'll be a matter of time to see how things work out. The feature is supported in Safari Technical Preview and in Firefox behind a flag. Once and if it's supported in Chromium we'll have another thing that we don't need third party libraries for and where we'll be able to benchmark performance betwee native CSS and third-party Javascript solutions.

## The specified CSS solution

An example syntax for the new masonry layout makes a few changes to the grid layout syntax. The following example is taken from one of the [WebKit photos demo](https://webkit.org/demos/grid3/photos/).

```css
main {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  grid-template-rows: masonry;
  gap: 1rem;
}
```

The main difference is that we use `masonry` as the value for `grid-template-rows` instead of a specific value. This tells the browser to use the masonry layout for the rows.

## Houdini: The Layout Worklet

The Houdini [Layout Worklet](https://drafts.css-houdini.org/css-layout-api/) is a way to define custom layout algorithms in Javascript. This is a powerful feature that allows developers to create custom layouts that can be used in CSS.

The following is an example of a masonry layout implemented using the Layout Worklet.

The first step is to define the layout worklet. This is best done in a separate file that we can import into our main script.

```js
registerLayout('masonry', class {
  static get inputProperties() {
    return [ '--padding', '--columns' ];
  }

  async intrinsicSizes() {}

  async layout(children, edges, constraints, styleMap) {
    const inlineSize = constraints.fixedInlineSize;

    const padding = parseInt(styleMap.get('--padding').toString());
    const columnValue = styleMap.get('--columns').toString();

    // We also accept 'auto', which will select the BEST number of columns.
    let columns = parseInt(columnValue);
    if (columnValue == 'auto' || !columns) {
      columns = Math.ceil(inlineSize / 350); // MAGIC NUMBER \o/.
    }

    // Layout all children with simply their column size.
    const childInlineSize = (inlineSize - ((columns + 1) * padding)) / columns;
    const childFragments = await Promise.all(children.map((child) => {
      return child.layoutNextFragment({fixedInlineSize: childInlineSize});
    }));

    let autoBlockSize = 0;
    const columnOffsets = Array(columns).fill(0);
    for (let childFragment of childFragments) {
      // Select the column with the least amount of stuff in it.
      const min = columnOffsets.reduce((acc, val, idx) => {
        if (!acc || val < acc.val) {
          return {idx, val};
        }

        return acc;
      }, {val: +Infinity, idx: -1});

      childFragment.inlineOffset = padding + (childInlineSize + padding) * min.idx;
      childFragment.blockOffset = padding + min.val;

      columnOffsets[min.idx] = childFragment.blockOffset + childFragment.blockSize;
      autoBlockSize = Math.max(autoBlockSize, columnOffsets[min.idx] + padding);
    }

    return {autoBlockSize, childFragments};
  }
});
```

Next, we need to load the woklet on the page.

We first check if the CSS object supports the `layoutWorklet` property. If it does, we add the module to the layout worklet using the `addModule` property of the layoutWorklet object. If it doesn't, we display a message to the user.

```js
if ('layoutWorklet' in CSS) {
	CSS.layoutWorklet.addModule('masonry.js');
} else {
	document.body.innerHTML = 'You need support for <a href="https://drafts.css-houdini.org/css-layout-api/">CSS Layout API</a> to view this demo :(';
}
```

Finally, we can use the masonry layout in our CSS using the `layout` function as the value for the `display` property with a single argument. The value of the argument is the full name of the worklet we defined in Javascript.

```css
main {
	display: layout(masonry);
	--padding: 1rem;
	--columns: auto;
}
```

## Third-party Javascript

Masonry has been a challenge for a long time. One of the libraries that has been around for a long time is [Masonry](https://masonry.desandro.com/). It's a large library and will add weight to your page but it's a good option if you need to support older browsers or if you need features that are not available in the CSS solution.

The first part of the example is the HTML. The styling is done in CSS and will be controlled by the CSS classes attached to the children element.

Also worth pointing out. The example's children are empty and sized with CSS. In production examples we could use text or images to affect the size of the children and the layout.

```html
<div class="grid">
  <div class="grid-item"></div>
  <div class="grid-item grid-item--width2 grid-item--height2"></div>
  <div class="grid-item grid-item--height3"></div>
  <div class="grid-item grid-item--height2"></div>
  <div class="grid-item grid-item--width3"></div>
  <div class="grid-item"></div>
  <div class="grid-item"></div>
  <div class="grid-item grid-item--height2"></div>
  <div class="grid-item grid-item--width2 grid-item--height3"></div>
  <div class="grid-item"></div>
  <div class="grid-item grid-item--height2"></div>
  <div class="grid-item"></div>
</div>
```

The CSS is used to style the grid and the children. The children are floated to the left and the grid is cleared after the last child. We could add content before and after the masonry grid

```css
.grid {
  background: #EEE;
  max-width: 1200px;
}

.grid:after {
  content: '';
  display: block;
  clear: both;
}
```

The second block defines the children elements. The children are floated to the left and have a background color and a border. The children are also given a border radius to make them look nicer. Because we don't add content inside the children we need to set explicit sizing for the elements.

We also create classes for different height and width values. These classes can be added to the children elements to control their size.

```css
.grid-item {
  width: 160px;
  height: 120px;
  float: left;
  background: #D26;
  border: 2px solid #333;
  border-color: hsla(0, 0%, 0%, 0.5);
  border-radius: 5px;
}

.grid-item--width2 { width: 320px; }
.grid-item--width3 { width: 480px; }
.grid-item--width4 { width: 640px; }

.grid-item--height2 { height: 200px; }
.grid-item--height3 { height: 260px; }
.grid-item--height4 { height: 360px; }
```

We initialize the masonry layout in Javascript. We first capture a reference to the grid element and then create a new instance of the Masonry object. The Masonry object takes two arguments. The first argument is the grid element and the second argument is an object with the configuration options.

```js
const theGrid = document.querySelector('.grid')

const msnry = new Masonry( theGrid, {
  itemSelector: '.grid-item',
  columnWidth: 160
});
```

## Which one to use?

A lot of it depends on the requirements of the project; you'll have to decide what browsers you need to support and what fallback will you use for unsupported browsers.

If you need to support older browsers then you should use a third-party library. These libraries may not be as performant as native CSS or Houdini solutions, but they work across browsers.

The Houdini solution is an interesting experiment but it will only work in Chromium browsers.

As of the date of writing (December 2024) the CSS standard solution is only available in Safari Technical Preview (available for macOS Sonoma and Sequoia) and in Firefox behind a flag.

These tradeofs will help you decide which solution to use.

## Links and resources

* [Help us choose the final syntax for Masonry in CSS](https://webkit.org/blog/16026/css-masonry-syntax/) &mdash; WebKit
* [An alternative proposal for CSS masonry](https://developer.chrome.com/blog/masonry) &mdash; Chrome
* [Approaches for a CSS Masonry Layout](https://css-tricks.com/piecing-together-approaches-for-a-css-masonry-layout/) &mdash; CSS Tricks
* [CSS Grid Level 3](https://drafts.csswg.org/css-grid-3/) specification
* [CSS Layout API](https://drafts.css-houdini.org/css-layout-api/) &mdash; CSS Houdini
* [Masonry](https://masonry.desandro.com/)
