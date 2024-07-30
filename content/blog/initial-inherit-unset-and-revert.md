---
title: Initial, Inherit, Unset and Revert
date: 2024-08-07
tags:
  - CSS
  - Rules
---

There are four properties that I've always been curious and confused about:

* initial
* inherit
* unset
* revert

These values are specified in the [Values and Units Module Level 4](https://drafts.csswg.org/css-values-4/#textual-values) specification.

## Resetting a Property: the initial keyword

The `initial` keyword applies the property's default value to an element.

It can be applied to any property, including the `all` shorthand property. With the property set to `initial`, all properties can be restored to their respective initial values in one go instead of restoring each one separately.

```css
.demo {
  all: initial;
}
```

The initial value for inherited properties may be unexpected. You should consider using other reset values for the property.

## Explicit Inheritance: the inherit keyword

The `inherit` keyword causes the element to take the computed value of the property from its parent element. It can be applied to any property, including the `all` shorthand property.

This property is only useful for properties that don't inherit from its parent element. For inherited properties, this reinforces the default behavior and is only necessary to override another rule.

## Erasing All Declarations: the unset keyword

The unset keyword works differently based on the type of property we apply it to.

If the property inherits from its parent, it resets a property to its inherited value. In this case, it behaves like the inherit keyword.

In the following example, the `color` property inherits from its parent, so the color for `.bar p` will be green, the color of `.bar`.

```css
.bar {
  color: green;
}

p {
  color: red;
}

.bar p {
  color: unset;
}
```

If the property doesn't inherit, then it sets the value to its initial value if not. In this case `unset` behaves like the initial keyword.

The `border` property doesn't inherit so, using `unset` in the `.border p` element, it will revert to its default value, black.

```css
div {
  border: 1px solid green;
}

p {
  border: 1px solid red;
}

.bar p {
  border-color: unset;
}
```

The `unset` value can be applied to any property, including the `all` shorthand property.

This keyword effectively erases all declared values occurring earlier in the cascade, correctly inheriting or not as appropriate for the property (or all longhands of a shorthand).

## Rolling Back Cascade Origins: the revert keyword

The revert keyword is, to me, the most complicated of all the properties discussed in this post since it requires some knowledge of the cascade and the different origins available in CSS.

To describe briefly, these are the available origins

User-agent origin
: These are browser built-in stylesheets or code that provide basic styling for web documents.

Author origin
: Author stylesheets are the most common type of style sheet; these are the styles written by web developers.
: These styles can reset user-agent styles, as noted above, and define the styles for the design of a given web page or application.
: The author defines the styles using one or more linked or imported stylesheets, &lt;style&gt; blocks, and inline styles defined with the style attribute.

User origin
: In most browsers, the user (or reader) of the website can choose to override styles using a custom stylesheet designed to tailor the experience to the user's wishes.
: Depending on the user agent, user styles can be configured directly or added via browser extensions.

There is much more to discuss when talking about the cascade (see [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade) for more information), but for the discussion about revert, understanding the different origins is enough

So, how does `revert` work:

* When used in the author origin, revert rolls the property's cascaded value back to the user's defined style if one exists; otherwise, it rolls the style back to the browser's default style
* When used in the user origin, revert rolls the cascaded value back to the user agent's default style
* When used in the user agent origin, this keyword is functionally equivalent to unset.

The revert keyword works exactly the same as unset in many cases. The only difference is for properties that have values set by the browser or by custom stylesheets created by users (set on the browser side).

Revert will not affect rules applied to children of an element you reset but will remove any effects on a parent's rule applied to its children.

Revert is just a value. It is still possible to override the revert value using specificity.
