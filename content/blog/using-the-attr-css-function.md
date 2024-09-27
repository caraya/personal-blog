---
title: Using the attr() css function
date: 2024-09-30
tags:
  - HTML
  - CSS
  - Attributes
---

The [attr](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) allows developers to pull data from HTML attributes into CSS.

The idea is that, like data attributes and custom properties, you can use these bits of custom data to provide limited ways to customize the page's content.

Like data attributes these are stored in the HTML document itself.

Unlike custom properties defined with the `@property` at-rule, the value cannot be customized.

With this HTML

```html
<blockquote cite="https://mozilla.org/en-US/about/">Mozilla makes
browsers, apps, code and tools
that put people before profit.</blockquote>
```

```css
blockquote::after {
  display: block;
  content: ' (source: ' attr(cite) ') ';
  color: hotpink;
}
```

As it currently works, the functionality is very limited in that it only works with the [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property.

While `attr()` is supported for effectively all browsers for the content property, [CSS Values and Units Level 5](https://drafts.csswg.org/css-values-5/) adds the [ability to use attr() on any CSS property, and to use it for non-string values](https://drafts.csswg.org/css-values-5/#attr-notation) (like  numbers, colors).

The syntax changes to something like this:

```css
[data-background] {
  background-color: attr(data-background color, limegreen);
}
```

The new version of the `attr()` function takes three arguments:

The arguments of attr() are:

name
: Gives the name of the attribute being referenced but without the possibility of a wildcard prefix.
: If no namespace is specified (just an identifier is given, like `attr(foo)`), the null namespace is implied. (This is usually what’s desired, as namespaced attributes are rare. In particular, HTML and SVG do not contain namespaced attributes.) As with attribute selectors, the case-sensitivity of `attr-name` depends on the document language.
: If attr() is used in a property applied to an element, it references the attribute of the given name on that element; if applied to a pseudo-element, the attribute is looked up on the pseudo-element’s originating element.

type
: Specifies what kind of CSS value the attribute’s value will be interpreted into (the `attr()`’s substitution value) and what, if any, special parsing will be done to the value.
: The allowed values are listed in [attr() Types](https://drafts.csswg.org/css-values-5/#attr-types).
: The default value is string if omitted.

value
: Specifies a fallback value for the `attr()`, which will be substituted instead of the attribute’s value if the attribute is missing or fails to parse as the specified type.
: If the `type` argument is string, defaults to the empty string if omitted; otherwise, defaults to the [guaranteed-invalid value](https://drafts.csswg.org/css-variables-2/#guaranteed-invalid-value) if omitted.

Because this version of `attr()` is not supported anywhere yet, we need to make sure we provide fallbacks using the original format for `attr()`.

## Links and Resources

* [Attribute References: the attr() function](https://drafts.csswg.org/css-values-5/#attr-notation)
* [attr()](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) &mdash; MDN
* [The CSS attr() Function](https://www.digitalocean.com/community/tutorials/css-attr-function)
* [The CSS attr() function got nothin’ on custom properties](https://css-tricks.com/css-attr-function-got-nothin-custom-properties/)
* Expanded functionality
  * [Chromium issue #246571: Implement CSS3 attribute / attr references](https://bugs.chromium.org/p/chromium/issues/detail?id=246571) &mdash; Chromium
  * [WebKit Bug #26609: Support CSS3 attr() function](https://bugs.webkit.org/show_bug.cgi?id=26609) &mdash; WebKit
  * [Mozilla Bug #435426: implement css3-values extensions to `attr()`](https://bugzilla.mozilla.org/show_bug.cgi?id=435426) &mdash; Mozilla
