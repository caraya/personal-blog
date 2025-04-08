---
title: New uses of the attr function in CSS
date: 2025-04-16
tags:
  - CSS
  - Web Development
baseline: true
---

The [attr](https://developer.mozilla.org/en-US/docs/Web/CSS/attr) function allows you to use the value of an HTML attribute in your css.

It has been around for a while, but it was limited to using the value of an attribute as a string. The following  example uses the value of the `data-color` attribute to set the background color of a `div` element:

```css
div {
  background-color: attr(data-color);
}
```

There is a problem. `attr(data-color)` is always parsed as a string, and could only ever be referenced as a string value and used in the content property of a pseudo element.

There has been new functionality introduced recently that allows developers to add another argument to give this data attribute a type. `attr(data-color type(<color>));` can now be used as a color value.

Given this HTML:

```html
<div data-color="red"></div>
```

You can create a red background on this element with:

```css
div {
  background-color: attr(data-color type(<color>));
}
```

You can take that a step further and add a fallback value, like so:

```css
/* gray fallback value */
div {
  color: attr(data-color type(<color>), gray);
}
```

The new syntax, you can explicitly define a type for the attribute value, allowing CSS to interpret it correctly. It also allows you to use `attr()` in more places than the `content` property.

## Available types

You can use the following types in `attr()`:

&lt;string> | `raw-string`
: The default type representing a string. This is the same as `attr()` without type.

&lt;angle>
: Used in properties such as `linear-gradient()`
: Represents a `<dimension>` with one of deg, grad, rad, or turn units.

&lt;color>
: Used in properties such as background-color, color, and border-color. : This can be any color supported by CSS.

&lt;custom-ident>
: custom identifier, used for naming things like view transition names.

&lt;integer>
: integer value without decimal points.

&lt;percentage>
: Often relative to a parent object

&lt;length>
: number + unit (see [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/length) for more information)

&lt;length-percentage>
: Can be either a length or percentage

&lt;number>
: extends integer with periods (`.`) for fractional values

&lt;resolution>
: Resultion values used in media queries with units like `dpi`, `dpcm`, `dppx`.

&lt;time>
: used in animation (`s` or `ms`).

&lt;transform-function>
: function to change appearance of an element (`rotate()`)

## What does attr() return?

The return value of `attr()` is the value of the HTML attribute matching the name of the HTML attribute and is parsed as the given attribute or a string.

1. If the `type` attribute is set, `attr()` will try to parse the attribute into the specified type and return it
   1. If the attribute cannot be parsed into the given type, the fallback value will be returned instead
2. If no type is set, the attribute will be parsed as a string.
3. If no fallback value is set, the return value will default to an empty string when no type is set or the [guaranteed-invalid value](https://developer.mozilla.org/en-US/docs/Glossary/guaranteed_invalid_value) when a type is set

## Backwards compatibility

The modern `attr()` syntax is mostly backward-compatible; the old way of using it (without specifying a type) behaves the same as before. Writing `attr(data-attr)` in your code is the same as writing `attr(data-attr type(<string>))`.

There are two edge cases to be aware of:

In the following snippet, browsers that don't support the modern `attr()` syntax will discard the second declaration because they cannot parse it. The result in those browsers is "Hello World".

```html
<div text="Hello"></div>
```

```css
div::before {
  content: attr(text) " World";
}
div::before {
  content: attr(text) 1px;
}
```

In browsers with support for the modern syntax, the output will be empty. These browsers will parse the second declaration, but because it is invalid content for the content property, the declaration becomes ["invalid at computed-value time"](https://www.bram.us/2024/02/26/css-what-is-iacvt/).

To prevent this kind of situation, use feature detection (discussed later).

A second edge case is the following:

```html
<div id="parent">
	<div id="child" data-attr="foo"></div>
</div>
```

```css
#parent {
  --x: attr(data-attr);
}
#child::before {
  content: var(--x);
}
```

Browsers without support for modern syntax display the text "foo". In browsers with modern `attr()` support there is no output.

`attr()`, like custom properties that use the `var()` function, get substituted at [computed value time](https://www.bram.us/2024/02/26/css-what-is-iacvt/#custom-properties). With the modern behavior, `--x` first tries to read the `attr()` attribute from the `#parent` element, which results in an empty string because there is no such attribute on `#parent`. The `#child` element inherits the empty string from its parent, resulting in a `content: ;` declaration being set.

To prevent this sort of situation, don't pass inherited `attr()` values onto children unless you explicitly want to.

## Limitations

There are a couple of places where the `attr()` function cannot be used, even with the new syntax.

## URLs

The `attr()` function can introduce potential security threats when used in URLs by reading from sensitive information, not meant to be used in styles. Because of this potential threat, you can't use `attr()` to dynamically construct URLs.

Given this HTML snippet:

```html
<span data-icon="https://example.org/icons/question-mark.svg">
	help
</span>
```

This CSS declaration is invalid:

```css
span[data-icon] {
	background-image: url(attr(data-icon));
}
```

Values that use `attr()` get marked as `attr()-tainted`. Using an `attr()-tainted` value as or in a URL makes a declaration invalid at computed-value time, and the element will not have a background image.

## Images

You can’t use advanced `attr()` function for images. All of the following examples are invalid at computed-value time and will produce an empty string:

```css
/* can’t use it directly. */
background-image: src(attr(foo));
/* can’t use it in other url-taking functions. */
background-image: image(attr(foo))
/* can’t “launder” it thru another function. */
background-image: src(string("http://ex.com/?token=" attr(foo)))
/* can’t launder the value thru another property */
--foo: attr(foo); background-image(src(var(--foo))).
```

So you can’t use this technique for images or icons.

## Feature detection

You can, and should, use feature detection to see if the browser supports the new `attr()` syntax. This is important because the new syntax may not be supported everywhere yet and it may help in working around some of the edge cases.

```css
@supports (x: attr(x type(*))) {
  /* Browser has modern attr() support */
}
```

```css
@supports not (x: attr(x type(*))) {
  /* Browser does not have modern attr() support */
}
```

## Final Note

Thanks to [Una Kravets](https://una.im/), whose post [New capabilities for attr()](https://una.im/advanced-attr/) inspired me to write this post.
