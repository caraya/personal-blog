---
title: "Hanging punctuation in CSS"
date: 2024-03-04
tags:
  - CSS
  - Typography
---

Chris Coyuer wrote about the [hanging punctuation](https://chriscoyier.net/2023/11/27/the-hanging-punctuation-property-in-css/) CSS property, how it works and why it may be useful.

This property controls the pulling of characters, usually quotation marks, from the body of the text.

<iframe height="800" style="width: 100%;" scrolling="no" title="Hanging Punctuation in CSS with @supports and Custom Properties" src="https://codepen.io/caraya/embed/ZEZzXpz?default-tab=" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/ZEZzXpz">
  Hanging Punctuation in CSS with @supports and Custom Properties</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Officially, only Safari supports the feature so we need [feature queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Using_feature_queries) to make sure this works as the intended enhancement it is.

We check if the browser supports the feature and then provide code using the feature along with any other relevant code.

```css
@​supports (hanging-punctuation: first) {
  blockquote {
    text-indent: 0;
    hanging-punctuation: first;
  }
}
```
