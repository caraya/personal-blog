---
title: "Hanging punctuation in CSS"
date: 2024-06-30
tags:
  - CSS
  - Typography
draft: true
---

<https://chriscoyier.net/2023/11/27/the-hanging-punctuation-property-in-css/>


```css
blockquote {
  text-indent: -0.45em;
}
@​supports (hanging-punctuation: first last) {
  blockquote {
    text-indent: 0;
    hanging-punctuation: first last;
  }
}
```
