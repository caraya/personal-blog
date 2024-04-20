---
title: Building a Card Component
date: 2024-04-22
tags:
  - CSS
  - Experiment
---

Container queries introduce an additional and complementary way to create content in addition to what media queries allow.

This post will look at container queries and how to use them to build a reusable card component.

## What are container queries and how do they work

With container queries, you can apply styles to an element based on the size of the element's container rather than the viewport (like we can with media queries). For example, if a container has less space available in the surrounding context, you can hide certain elements or use smaller fonts.

### Using container queries

Using container queries is a two-step process:

1. Tell the browser what type of container we want to create
2. Use the [@container at-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) with an optional name and a media query-like dimension check to create one or more container queries

Now, let's look at how this works.

Using the following HTML content

```html
<div class="layout-item">
  <div class="card">
    <h2>Card Title</h2>
    <div class="card-content">
      <img
				src="https://placehold.co/150x150"
				alt="placeholder for image"
				class="card-image">

      <p>Card Content</p>

    </div>

    <div class="card-footer">
      <ul>
        <li><a href="#">Home</a></li>
      </ul>
    </div>

  </div>
</div>
```

We can create the container query like this:

We convert the outermost container (`.layout-item`) into an `inline-size` container.

```css
.layout-item {
  container: card / inline-size;
}

/* initial styles for the component children */
```

Then we can create one or more container queries and change the styles for the card components.

In this example, we use the newer query syntax to create a container for cards that are equal to or less than 800 pixels wide.

```css
/* Container query */
@container card (width <= 800px) {
	/*
		Styles for elements that change when
		the width is 800px or larger
	*/
}
```

The full example is in this CodePen:

<iframe height="429.49310302734375" style="width: 100%;" scrolling="no" title="Container Query Card Component" src="https://codepen.io/caraya/embed/OJGBdNe?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/OJGBdNe">
  Container Query Card Component</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Depending on your need you may create additional container queries. For example, you could create specific styles when the container is between two specific values.

```css
@container card (200px <= width <= 400px) {
  /*
		styles when width matches the query
	*/
}
```

You can also nest container queries as shown in this Pen by [Michelle Barker](https://codepen.io/michellebarker). The Pen shows how to use container size queries with Grid and how to make them work together to create more complex layouts.

<iframe
	height="963.454833984375"
	style="width: 100%;" scrolling="no"
	title="Nested container queries" src="https://codepen.io/michellebarker/embed/rNJrJxp?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/michellebarker/pen/rNJrJxp">
  Nested container queries</a> by Michelle Barker (<a href="https://codepen.io/michellebarker">@michellebarker</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Links and Resources

* [Getting started with CSS container queries](https://developer.mozilla.org/en-US/blog/getting-started-with-css-container-queries/)
* [A Primer On CSS Container Queries](https://www.smashingmagazine.com/2021/05/complete-guide-css-container-queries/)
* [An Interactive Guide to CSS Container Queries](https://ishadeed.com/article/css-container-query-guide)
* [Using container size and style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries)
* [CSS Container Queries: Use-Cases And Migration Strategies](https://www.smashingmagazine.com/2021/05/css-container-queries-use-cases-migration-strategies/)
