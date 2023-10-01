---
title: "Templates on web pages"
date: "2022-11-07"
---

Using templates in Web pages has always been complicated and always required third-party libraries like [Handlebars](https://handlebarsjs.com/) and [Moustache](https://mustache.github.io/)

[HTML templates](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), part of the web components family of specifications, provide a native way to use templates on the web with minimal Javascript interaction.

[Templating in HTML](https://kittygiraudel.com/2022/09/30/templating-in-html/) explains the basics of how to use a `template` element to create reusable code in your page.

The first step is to create the template in HTML. We give it an ID so it's easier to retrieve from Javascript later.

This template is inert meaning that it won't be read by the browser's HTML parser until we insert it into the document.

```html
<template id="menu-template">
  <nav>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </nav>
</template>
```

I've also added a placeholder where to insert the content of the template.

```html
<div class="container">
  <div class="menu"></div>
</div>
```

Most of the work is done in Javascript.

The first constant is for the template element identified by its ID.

The second constant captures the content of the template element.

The third constant captures the element we want to place the content.

With the three constants in place, we just append the content to the container. This will insert the content into a live portion of the page.

```js
const template = document.querySelector("#menu-template");

const content = template.content.cloneNode(true);

const container = document.querySelector(".menu");

container.append(content);
```

We can also style the content of the templates just like we would style any other elements on the page.

In this example, we set the navigation as a flex layout and remove the bullets from the list items.

```css
nav ul {
  display: flex;
  flex-flow: row;
  justify-content: space-evenly;
  list-style: none;
}
```

One drawback that I see with native `template` elements is that they can't easily be reused.

You can use the same template element as the source but you need to create multiple instances of the same template if you want to place it in multiple locations in the document.

```js
// Top menu
const contentTop = template.content.cloneNode(true);

const container = document.querySelector(".top");

container.append(contentTop);

// Bottom menu
const contentBottom = template.content.cloneNode(true);

const container2 = document.querySelector(".bottom");

container2.append(contentBottom);
```

The example below adds two menus at the to and bottom of the page using the same template element as the source.

This may be OK if we're doing a few insertions in the document but gets cumbersome when you have to add multiple instances to elements like a table.
