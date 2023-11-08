---
title: "Styling Native Dialogues"
date: "2022-10-31"
---

In [dialogues in the web](https://publishing-project.rivendellweb.net/dialogues-in-the-web/) we saw how to create native dialogues using HTML and Javascript. This post will look at how to style the dialogues and the parent element.

## Styling the dialogue element

The first item to style is the `dialog` element itself.

In this example, we set the width of the modal dialogue to 50ch and a 1em padding.

We can add more styles as necessary.

```css
.modal {
  padding: 1em;
  max-width: 50ch;
}
```

## Styling the backdrop

The other CSS rule is the `::backdrop` pseudo-element.

The `::backdrop` CSS pseudo-element is a box the size of the viewport that is rendered immediately beneath the presented dialogue element.

In this example, we darken the backdrop using a rgba color for the background color of the background element.

```css
.modal::backdrop {
  background: rgb(0 0 0 / 0.8);
}
```
