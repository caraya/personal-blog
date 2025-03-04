---
title: "Defining multiple syntax in CSS variables"
date: 2023-12-11
tags:
  - CSS
---

In [Revisiting Custom Properties](https://publishing-project.rivendellweb.net/revisiting-css-custom-properties/) we looked at how to define custom properties using the `@property` at-rule.

One aspect of `@property` that we didn't discuss are the syntax multipliers and combinators.

These two gives us more flexibility when it comes to defining what our `@property`-defined variables can do.

## Quick Review

A CSS variable defined with `@property` looks like this:

```css
@property --border-block {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 2rem;
}
```

The name of the property follows the `@property` at rule and must have two dashes (**--**)

The following list, taken from the [Supported Names](https://drafts.css-houdini.org/css-properties-values-api/#supported-names) section of the [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/), shows the allowed values for the syntax attribute.

"&lt;length&gt;"
: Any valid &lt;length&gt; value

"&lt;number&gt;"
: &lt;number&gt; values

"&lt;percentage&gt;"
: Any valid &lt;percentage&gt; value

"&lt;length-percentage&gt;"
: Any valid &lt;length&gt; or &lt;percentage&gt; value, any valid &lt;calc()&gt; expression combining &lt;length&gt; and &lt;percentage&gt; components.

"&lt;color&gt;"
: Any valid &lt;color&gt; value

"&lt;image&gt;"
: Any valid &lt;image&gt; value

"&lt;url&gt;"
: Any valid &lt;url&gt; value

"&lt;integer&gt;"
: Any valid &lt;integer&gt; value

"&lt;angle&gt;"
: Any valid &lt;angle&gt; value

"&lt;time&gt;"
: Any valid &lt;time&gt; value

"&lt;resolution&gt;"
: Any valid &lt;resolution&gt; value

"&lt;transform-function&gt;"
: Any valid &lt;transform-function&gt; value

"&lt;custom-ident&gt;"
: Any valid &lt;custom-ident&gt; value

Any sequence which starts an identifier, can be consumed as a name, and matches the &lt;custom-ident&gt; production
: That identifier

"&lt;transform-list&gt;"
: A list of valid &lt;transform-function&gt; values.
: "&lt;transform-list&gt;" is a [pre-multiplied data type name](https://drafts.css-houdini.org/css-properties-values-api/#pre-multiplied-data-type-name) equivalent to "&lt;transform-function&gt;+"

## The '+' and '#' Multipliers

There are situations where we might want more than one value. For example, we might want to provide values for margins or padding, which can take one to four discreete values.

The two different multiplier values work in different context.

* The `+` multiplier allows a space-separated list of values
* The `#` multiplier allows a comma-separated list of values

Which one you use will depend on the attribute that you want to emulate. For examples using margins you can define them like so:

```css
@property --margin-block {
  syntax: "<length-percentage>+";
  inherits: false;
  initial-value: 2rem;
}
```

`margin-block` can take one or two values.

If you use one value, the browser will use for both `margin-block-start` and `margin-block-end`.

If you use two values the first one becomes `margin-block-start` and the second `margin-block-end`.

First we change the `@property` definition to take one or more values by adding the `+` sign right after the syntax we want to repeat.

```css
@property --margin-inline {
  syntax: "<length-percentage>+";
  inherits: true;
  initial-value: 2rem;
}
```

Next we define a generic class to hold settings common to all the examples.

```css
.block {
  border: 2px solid hotpink;
  inline-size: 10rem;
  block-size: 4rem;

  margin-block-start: 4rem;
}
```

If we use the variable as is, it will use the initial value.

```css
.block00 {
  margin-inline: 2rem

  /* These are equivalent */
  margin-inline: var(--margin-inline)
}
```

We can also change the value or values for the variable we created.

`.block01` updates the variable with one value and `.block02` provides to values to update the variable with.

```css
.block01 {
  --margin-inline: 4rem;

  margin-inline: var(--margin-inline);
}

.block02 {
  --margin-inline: 6rem 2rem;

  margin-inline: var(--margin-inline);
}
```

Logical properties also account for writing modes. If we change the writing mode, the position of the inline margins will change too.

```css
.block03 {
  --margin-inline: 4rem 2rem;

  writing-mode: vertical-lr;
  margin-inline: var(--margin-inline);
}
```

## The '|' Combinator

There are a few situations in CSS where one syntax descriptor is not going to be enough.

The case that comes to mind is [line height](https://drafts.csswg.org/css-inline/#line-height-property). The property can take four different types of values:

* `normal` (the default)
* `length`
* `percentage`
* `number`

so how do we account for this when defining a property?

We could be pedantic and say that it only accepts numbers. If we do this then the `number` syntax matches our needs.

The `length-percentage` syntax handles both length and percentage values.

If we want to allow both `number` and `length-percecntage` syntaxes we can use the `|` combinator like this

```css
@property --lh {
  syntax: '<number> | <length-percentage>';
  inherits: false;
  initial-value: 1;
}
```

This means that we can use any of the examples below.

* `p01` uses a number
* `p02` uses a length
* `p03` uses a percentage

If we don't update the value then it'll use the initial value we provided.

```css
p01 {
  --lh: 1.2;
  line-height: var(--lh);
  font-size: 10pt
}

p02 {
  --lh: 1.2em;
  line-height: var(--lh);
  font-size: 10pt
}

p03 {
  --lh: 120%;
  line-height: var(--lh);
  font-size: 10pt
}
```

We can go further in our custom elements by using another combinator character to allow the auto keyword like this:

```css
@property --lh {
  syntax: 'auto | <number> | <length-percentage>';
  inherits: false;
  initial-value: 1;
}
```

But the browser already does this and `auto` is the default value for the 	`line-height` property so it's redundant.

For our own CSS variables we may think of more complex combinators but I would always counsel for to [KISS](https://en.wikipedia.org/wiki/KISS_principle).
