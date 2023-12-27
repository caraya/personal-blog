---
title: Using the attr() css function
date: 2024-06-30
draft: true
---


The [attr](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) allows developers to pull data from HTML attributes into CSS.

As it currently works, the functionality is very limited but, if browser makers get around to implementing the rest of the attr specification as written, it would give developers a powerful way to use HTML attributes directly in CSS without Javascript.

With this HTML

```html
<blockquote cite="https://mozilla.org/en-US/about/">Mozilla makes browsers, apps, code and tools that put people before profit.</blockquote>
```

```css
blockquote::after {
  display: block;
  content: ' (source: ' attr(cite) ') ';
  color: hotpink;
}
```
