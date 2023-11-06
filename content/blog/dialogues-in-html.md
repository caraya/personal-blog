---
title: "Dialogues in HTML"
date: "2023-06-26"
---

The web platform now provides ways to build dialogues without having to use third-party libraries.

This post will cover dialogues and modal dialogues, the Javascript necessary to interact with the dialogues we create and some basic CSS.

## Basic Dialogue

The HTML is simple. We first create a div with the content we want the user to see in the dialogue, including the dialogue's close button. If we don't put it inside the dialogue, it'll be impossible to close the modal dialogue via user action.

We also add buttons to open the dialogue either as a normal dialogue or a modal dialogue.

The modal dialogue will obscure the content behind it as a way to keep the user's attention on the dialogue content.

```html
<dialog id="dialog">
  <h2>Dialogue Title</h2>

  <p>This is the content for the dialog</p>

  <button type="button" id="close">Close Dialog</button>

</dialog>

<div class="buttons">
  <button type="button" id="open">Open Dialog</button>
  <button type="button" id="modal">Open Modal</button>
</div>
```

In the Javascript side, we capture all necessary elements to interact with:

* The dialog element
* the open dialog button
* the open modal button
* the close button

For each of these elements we add a `click` event listener and perform the appropriate action.

| Button | action |
| --- | --- |
| openDialogue | Opens a standard dialogue |
| openModal | Opens modal dialogue |
| close | Closes the dialogue |

You can also close the modal dialogue by clicking outside the dialogue.

```js
const dialog = document.getElementById("dialog");
const openDialog = document.getElementById("open");
const openModal = document.getElementById("modal");
const close = document.getElementById("close");

openDialog.addEventListener("click", () => {
  dialog.show();
});

openModal.addEventListener("click", () => {
  dialog.showModal();
});

close.addEventListener("click", () => {
  dialog.close();
});
```

When you open a modal dialogue the browser will create a color overlay that will direct the user's attention to the dialogue.

You can style the overlay using the [::backdrop](https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop) pseudo element.

The following code does some basic layout and changes the color to a transparent charcoal using [oklch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch) colors.

```css
html {
  font-family: system-ui;
}
dialog::backdrop {
   background-color: oklch(0.25 0.0 67.5 / .75);
}
```

## Using forms inside dialogues

The dialog element can have any HTML content inside it. One interesting example is using forms inside a modal dialog.

They work mostly the same as standard modal dialogues with a few exceptions

1. we add `method="dialog"` to the form element
2. We create a button and:
   1. add `formmethod="dialog"`
   2. add `type="submit"`

```html
<dialog id="modal" class="modal">
  <form method="dialog">
    <div class="layout">
      <label for="name" class="nameLabel">Name:</label>
      <input id="name" class="text" type="text">
      <div>
        <button formmethod="dialog" id="cancel" type="submit">Cancel Form</button>
        <button id="submit" type="submit">Submit Form</button>
      </div>
    </div>
  </form>
</dialog>
```

The modal will now close when you cancel or submit the form. While this is cool, it may not necessarily be what your users want.

We can simplify the Javascript since we no longer need an explicit close event.

```js
const modal = document.getElementById("modal");
const open = document.getElementById("open");
const submit = document.getElementById("submit");


open.addEventListener("click", () => {
  modal.showModal();
});

modal.addEventListener("submit", (event) => {
  console.log("form submitted");
});
```

It is interesting to see how much we can do with HTML, CSS and a pinch of Javascript

## Links and Resources

* [Modals Will Never Be The Same &mdash; HTML dialog Element](https://blog.webdevsimplified.com/2023-04/html-dialog/)
* [Building a dialog component](https://web.dev/building-a-dialog-component/)
