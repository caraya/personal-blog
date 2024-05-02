---
title: Detecting Javascript Support in CSS
date: 2024-05-15
tags:
  - CSS
  - JS Detection
---

There are times when we may want to style content differently based on whether the browser has enabled Javascript or not.

**This is different than using Javascript to detect whether a script has run or not, this technique will only change the UI where necessary.**

## The technique

The technique is simple: We use the `@media` at-rule with `scripting` as the property and one of the two valid values for the media query: `enabled` and `none`.

When using `scripting: enabled`, we can use the technique to progressively enhance the UI by adding CSS to elements where appropriate.

```css
@media (scripting: enabled) {
  .my-element {
    /*
      enhanced styles if JS is available
    */
  }
}
```

Or we can gracefully fall back to some alternate styles by using `scripting: none`.

```css
@media (scripting: none) {
  .my-element {
    /*
      fallback styles when JS is diabled
    */
  }
}
```

## What we used to do

Before we had this feature, one approach for detecting JavaScript support was by setting a custom selector on the root element of the page, usually something like the `no-js` class name.

```html
<html class="no-js">
  <!-- page content -->
</html>
```

If JavaScript is supported and enabled, it removes the `no-js` class before rendering the page so the styles we wrote for the page will work as intended.

```css
.my-element {
  /* styles when JS is enabled */
}
```

When JavaScript is disabled, we can supply alternative styles that adapt to the experience by adding the `no-js` class to add further specificity to the selector

```css
.no-js .my-element {
  /* styles when JS is disabled */
}
```

## Issues with this technique

This feature may not match user expectations for a few reasons:

* It does not behave as anticipated when a browser extension disables page scripts. `scripting: enabled` still matches though the extension disabled JavaScript
* Javascript may fail to load even if scripts are enabled. If a script gets blocked or fails to load, a fallback would need to be handled via JavaScript
