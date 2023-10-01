---
title: "Aspect Ratio in CSS"
date: "2021-02-10"
---

Normally, only some elements have an aspect ratio, for example, images. For them, if only the width, or the height, is specified, the other is automatically computed using the intrinsic aspect ratio.

In this example, the browser will calculate the height of the image using the width and the image's intrinsic dimensions.

```html
<img src="..." style="width: 800px;">
```

The `aspect-ratio` property allows developers to explicitly set the aspect ratio of an element (not just those that already have an aspect ratio) and use it when one of the measurements is missing. The example below, taken From Una Kravetz [codepen](https://codepen.io/una/pen/BazyaOM) shows how this works with a div element.

We use this HTML code:

```html
<div>I am always 16x9</div>
```

And this CSS:

```css
div {
  background: lightblue;
  width: 100%;

  /*   New aspect-ratio property */
  aspect-ratio: 16 / 9;
}
```

When using only the width of an element, we tell the browser to calculate a 16/9 aspect ratio and use those calculations for the missing dimension. It will also retain the same aspect ratio regardless of the screen size you view the content in.

You can test this in a supported browser by changing the attribute from width to height, something like `height: 50vh;` or similar.

For browsers that don't support the property yet, you can use a fallback like the following code.

```css
/* Fallback (current, using padding hack) */
@supports not (aspect-ratio: 16 / 9) { 
  div::before {
    float: left;
    padding-top: 56.25%;
    content: '';
  }

  div::after {
    display: block;
    content: '';
    clear: both;
  }
}
```

This uses a vertical padding hack first described in [Creating Intrinsic Ratios for Video](https://alistapart.com/article/creating-intrinsic-ratios-for-video/) and shown working with images in [Aspect Ratios in CSS are a Hack](https://www.bram.us/2017/06/16/aspect-ratios-in-css-are-a-hack/). It is not the most elegant solution but it works in older browsers.

Something else to be aware of, even in the browsers that support aspect ratio in CSS: Safari (the current technical preview), Chrome Canary (version 89 as of this writing), and Firefox Nightly (version 85), the feature may still be ongoing. If you're interested check these issues for current status:

- **Chromium**: [https://bugs.chromium.org/p/chromium/issues/detail?id=1045668](https://bugs.chromium.org/p/chromium/issues/detail?id=1045668)
- **Firefox**: [https://bugzilla.mozilla.org/show\_bug.cgi?id=1528375](https://bugzilla.mozilla.org/show_bug.cgi?id=1528375)
- **Webkit (Safari)**: [https://bugs.webkit.org/show\_bug.cgi?id=47738](https://bugs.webkit.org/show_bug.cgi?id=47738)
