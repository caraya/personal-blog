---
title: "Scripting Support Media Query"
date: 2024-01-29
tags:
  - CSS
---

I know that it's unlikely people will disable Javascript on their browsers, but it is not impossible.

We can notify the user of the lack of Javascript using the `scripting` media query.

This example will tell users whether Javascript is enabled on their browser. It is made of two parts.

The first part is the content that we want to display to the user. We'll hide it and reveal the appropriate value with CSS later.

```html
<div class="container">
  <p class="script-none">You do not have scripting available.</p>
  <p class="script-initial-only">
    Your scripting is only enabled during the initial page load. Weird.
  </p>
  <p class="script-enabled">You have scripting enabled!</p>
</div>
```

The CSS does two things.

1. It hides the paragraphs
2. It reveals the paragraph that matches the status of the scripting media query

The possible values of the scripting media query are:

none
: Scripting is completely unavailable on the current document.

initial-only
: Scripting is enabled during the initial page load, but not afterwards.

enabled
: Scripting is supported and active on the current document.

We write separate media queries for each of the possible status values. It is not possible to one statement that covers all three.


```css
p {
  display: none;
}

@media (scripting: none) {
  .script-none {
    display: block;
    color: red;
  }
}

@media (scripting: initial-only) {
  .script-initial-only {
    display: block;
    color: red;
  }
}

@media (scripting: enabled) {
  .script-enabled {
    display: block;
    color: red;
  }
}
```

In a production application, we may want to give the user visual cues about the status of Javascript.

This media query is not a replacement for `noscript` elements on your page. CSS is for visual styles and should not be relied upon for behavioral uses.
