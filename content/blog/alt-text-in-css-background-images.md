---
title: Alt text in CSS background images
date: 2024-10-21
tags:
  - CSS
  - Images
  - Accessibility
---

One of the biggest issues I have when using CSS background images, is that we can't add alt text to images used as background image sets.

a new feature has become [newly available in Baseline](https://webstatus.dev/features/alt-text-generated-content) that fixes this problem, enabling alt text for images used in CSS.

For example, all external links that contain the string "wikipedia" are considered external links pointing to Wikipedia content (in whatever language the content is created in) so we append a Wikipedia icon to all these links.

```css
a[href*="archive"]::after {
  content: "";
  inline-size: 20px;
  block-size: 20px;
  margin-inline-start: 10px;
  background-image: url("https://assets.codepen.io/32795/ia-logo.svg" / "Internet Archive");
  display: inline-block;
}
```

Be careful when deciding if you want to add alt attributes to these links. They are not always necessary.
