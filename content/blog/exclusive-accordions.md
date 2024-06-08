---
title: Exclusive Accordions
date: 2024-06-17
tags:
  - CSS
---

Accordions present an interesting way to display content using one or more [details](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) elements.

There is a specific type of accordion that, until recently, was impossible to do without scripting, the exclusive accordion.

This post will explain what's an exclusive accordion and how to polyfill the API to handle older browsers.

## What are exclusive accordions and how they work

To achieve this on the web you can now a `name` attribute to `details` elements. When this attribute is used, all `details` elements with the same name value form a semantic group and will behave as an exclusive accordion.

When you open one of the `details` elements that share the same name, the previously opened one will automatically close.

In the example below we have three items in the accordion with the first one being open by default when the page opens. When you click on the other items, it will open the item you click and close the one currently open.

```html
<div class="container">
  <h2>Latest Posts</h2>

  <details name="posts-list" open>
    <summary>Post 1</summary>
    <p>This is the content for the post.</p>
    <p><a href="#">Read More</a></p>
  </details>

  <details name="posts-list">
    <summary>Post 2</summary>
    <p>This is the content for the post.</p>
    <p><a href="#">Read More</a></p>
  </details>

  <details name="posts-list">
    <summary>Post-3</summary>
    <p>This is the content for the post.</p>
    <p><a href="#">Read More</a></p>
  </details>
</div>
```

This is what the exclusive accordion looks like with CSS applied to it.

<iframe height="529.8236083984375" style="width: 100%;" scrolling="no" title="Exclusive Accordion: Single Accordion" src="https://codepen.io/caraya/embed/ExzZwML?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ExzZwML">
  Exclusive Accordion: Single Accordion</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

You can have multiple exclusive accordions, each group sharing a name.

<iframe height="686.33837890625" style="width: 100%;" scrolling="no" title="Exclusive Accordion: Multiple Exclusive Accordions In A Single Page" src="https://codepen.io/caraya/embed/wvbgOwM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/wvbgOwM">
  Exclusive Accordion: Multiple Exclusive Accordions In A Single Page</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

The elements of the exclusive accordion don't have to be next to each other for the accordion to work.

## Javascript Polyfill

Maintaining backward compatibility is not complicated. We can polyfill the behavior of the exclusive accordion. The code relies on the `toggle` event of the `details` element to close all the details elements with the same name, except the one that was just opened.

```js
document.querySelectorAll("details[name]").forEach(($details) => {
  $details.addEventListener("toggle", (e) => {
    const name = $details.getAttribute("name");

    if (e.newState == "open") {
      document
        .querySelectorAll(`details[name=${name}][open]`)
        .forEach(($openDetails) => {
          if (!($openDetails === $details)) {
            $openDetails.removeAttribute("open");
          }
        });
    }
  });
});
```

## Links and Resources

* [Exclusive Accordion (Explainer)](https://open-ui.org/components/accordion.explainer/) &mdash; Open UI
* [Exclusive Accordion](https://developer.chrome.com/docs/css-ui/exclusive-accordion) &mdash; Chrome Developers

