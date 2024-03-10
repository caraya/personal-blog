---
title: "Making HTML Headers Look Nice"
date: 2024-03-06
tags:
  - CSS
  - Typography
---

Headings can show orphan issues that can cause readability issues.

In this context, an orphan ***is a single word (or syllable) that sits at the bottom of a paragraph of text***.

As a developer, you don't know the final size, font size, or even the language of a headline or paragraph. All the variables needed for an effective and aesthetic treatment of text wrapping, are in the browser.

Using [text-wrap: balance](https://developer.chrome.com/docs/css-ui/css-text-wrap-balance) we can provide better control over these orphan headings.

Before we had `text-wrap: balance` we had few tools to keep the heading lines balanced. The best (and probably only) options are to use the `<wbr>` tag or the `&shy;` entity to help browsers decide where to break lines and words.

```css
:is(h1, h2, h3, h4, h5, h6) {
  max-width: 50ch;
  max-inline-size: 50ch;
  text-wrap: balance;
}
```

Use this as progressive enhancement. If this works, it's an improvement and, if it doesn't, then it'll look slightly worse but it will still display the content.
