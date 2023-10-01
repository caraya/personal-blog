---
title: "Using data attributes"
date: "2023-03-27"
---

`data` attributes give developers a very powerful tool to create custom code on both CSS and Javascript.

This post will look at three things:

- What are `data` attributes
- How to use data attributes in CSS
- How to use data attributes in javascript

## What are data attributes

[data](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*) attributes allow you to insert arbitrary data on your HTML without hacks, and then use it in CSS and Javascript.

The names of data attributes have the following restrictions

- The name must not start with the string `xml` (case-insensitive)
- The name must not contain any colon characters (`:`)
- The name must not contain any capital letters

For example, the following snippet of HTML defines a custom attribute for the font family:

```html
<div class="content" data-font-sans>
  <p>My content</p>
</div>
```

## Using data attributes in CSS

Since data attributes are plain HTML attributes, you can access them from CSS.

you can use the [attr](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) function to show the attribute data:

```css
article::before {
  content: attr(data-parent);
}
```

Perhaps, the most common use of data attributes from CSS is to use [Attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors) to style content.

We style content based on the presence of a data attribute. In the example below, we use style selectors to change the styles if the `data-inverted` attribute is present

<iframe height="600" style="width: 100%;" scrolling="no" title="Data Attribute (1)" src="https://codepen.io/caraya/embed/oNPzpKj?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/oNPzpKj"> Data Attribute (1)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

We can also change the styles based on the value assigned to a data property.

The example I chose uses different column layouts. We change the layout based on the value of the `data-columns` attribute.

<iframe height="400" style="width: 100%;" scrolling="no" title="Using data attributes to style content (2)" src="https://codepen.io/caraya/embed/dyqpdPM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/dyqpdPM"> Using data attributes to style content (2)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

This gives us the flexibility to style content based on custom HTML attributes.

## Using data attributes in javascript

We can also use data properties from Javascript using the [dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset) property of the HTMLElement interface.

This **read-only** property holds a map of all `data-*` attributes in the current document.

You can also set up empty data attributes and populate them later from your script.

In this example there is metadata about the content that we don't want to share with the user by default, but that we can make available to scripts on the page if necessary.

Use the following HTML fragment as an example:

```html
<article id="main-article"
  data-kind="paid"
  data-subscriber-tier="full"
  data-length="2000"></article>
```

We can query the `data-*` elements using the `dataset` property

```js
const article = document.querySelector("#main-article");

console.log(article.dataset.kind);
console.log(article.dataset.subscriberTier);
console.log(article.dataset.length);
```

We can also add empty `data` properties to attributes and populate them in the script.

We've modified the HTML to add an empty `data-expiration-date` attribute.

```html
<article id="main-article"
  data-kind="paid"
  data-subscriber-tier="full"
  data-length="2000"
  data-expiration-date></article>
```

We will use Javascript to populate the `data-expiration-date` attribute with the date 30 days from now.

```js
const article = document.querySelector("#main-article");

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

const date = new Date();

article.dataset.expirationDate = date.addDays(5);

console.log(article.dataset.expirationDate)
```

This is a simple example but it shows how we can populate attributes at run time and then use them to script and style the content.
