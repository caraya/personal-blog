---
title: "The popover API"
date: "2023-06-28"
---

In addition to dialogues, there is a new API to handle popovers, small blocks of text, natively in the browser.

This post will explore the Popover API, what it does, how it works and provide examples of how to use it.

## Necessary context

Before we jump into popovers we need to define a few terms.

Top layer
: The top layer, as the name implies is painted last as the top-most layer of content in the browser viewport, regardless of document order or z-index values.
: By default, if multiple elements are positioned in the same location, the browser paints them in the order they appear in the document (document order). With the z-index property you decide your layer order.
: Within the top layer, elements are painted in document order.
: If your popup is in an element with overflow: hidden, that will cut it off. If it is promoted to the top layer, no cutting will take place.

Backdrop
: A backdrop usually serves as a visual cue that any content behind the popover is unavailable for interactions. This can be used as a way to help the user focus.
: You can style the backdrop with the `::backdrop` pseudo-element.

## Why another API

Using the popover API lets the browser manage the complexity of working with popups. The API will handle the following tasks for you:

* **Promotion to the top layer** layer. Popovers will always appear on the top layer
* **Light-dismiss functionality**. Clicking outside of the popover area will close the popover and return focus
* **Default focus management**. When a popup is open, the next tab will navigate to the popup content
* **Accessible keyboard bindings**. Pressing the <kbd>esc</kbd> (escape) key will close the popover and return focus Accessible component bindings

These tasks make it easier to work with popovers. It gives you a lot of functionality "for free", just by using the API

## The basic popover

The basic popover has two components:

* A `button` to trigger the popover with a `popovertarget` attributte pointing to the ID of the popover content
* A `div` element for the popover content
  * It has an ID attribute that must match the `popovertarget` value in the button
* a `popover` attribute

The code looks like this:

```html
<button popovertarget="mypopover">Toggle the popover</button>

<div id="mypopover" popover>
  <h2>Popover</h2>

  <p>content</p>
</div>
```

The default behavior for popovers is to only allow one open popover at a time; the browser will close any other popover on the page.

## Automatic versus manual popovers

using the `popover` attribute is an alias for `popover = 'auto'`. This is the default behavior that we discussed in previous sections.

There is another value for the `popover` attribute: `manual`.

Manual popovers will not work like automatic popovers (they will not force close any other element type and do not close when you click outside them). You must close them via a timer or explicit close action.

These manual popovers are best for elements that shouldn't affect the rest of the page, such as a toast notification.

## Handling popovers programmatically

You can also use Javascript to create and manage popovers.

The following table provides the Javascript properties along with their HTML equivalents.

| Javascript property | HTML equivalent |
| --- | --- |
| `popover` | `popover` |
| `popoverTargetElement` | `popovertarget` |
| `popoverTargetAction` | `popovertargetaction` |

In this example, we first capture references to the popover and the buttons to control them.

Next, we create a feature detection function.

We use the feature detection function to check if popovers are supported. If they are then we set the `popoverTargetElement` and `popoverTargetAction` properties for the toggle and close buttons.

If the popover API is not supported then we hide the toggle button since it won't work.

```js
const popover = document.getElementById("mypopover");
const toggleBtn = document.getElementById("togglebutton");
const closeBtn = document.getElementById("close-btn");

function popoverSupported() {
  return HTMLElement.prototype.hasOwnProperty("popover");
}

if (popoverSupported) {
  popover.popover = "auto";

  toggleBtn.popoverTargetElement = popover;
  toggleBtn.popoverTargetAction = "toggle";

  closeBtn.popoverTargetElement = popover;
  closeBtn.popoverTargetAction = "hide";
} else {
  toggleBtn.style.display = "none";
}
```

I've avoided talking about the semantics of the popover API. Hidde de Vries does a much better job than I can in [Semantics and the popover attribute: what to use when?](https://hidde.blog/popover-semantics/).

## Links and Resources

* [popover](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) — MDN
* [MDN Popover API Examples](https://mdn.github.io/dom-examples/popover-api/)
* [Introducing the Popover API](https://developer.chrome.com/blog/introducing-popover-api/)
* [Dialogs and popovers seem similar. How are they different?](https://hidde.blog/dialog-modal-popover-differences/)
* [Semantics and the popover attribute: what to use when?](https://hidde.blog/popover-semantics/)
