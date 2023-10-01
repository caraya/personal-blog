---
title: "Revisiting CSS Custom Properties"
date: "2023-08-23"
---

CSS variables are awesome, particularly when implemented using the `@property` at-rule but we need to remember that there can be too much of a good thing.

This post will talk about how to define custom properties using `@property`, the differences between using `@property` and regular custom properties and some cases where we can have too many properties.

## Revisiting @property

There are two ways to declare custom properties in CSS.

The original is to just declare it and initialize it in one declaration:

```css
:root {
  --color-background: oklch(1 0 106);
}
```

We can then use the variable everywhere we want:

```css
.demo01 {
  background: var(--color-background)
}
```

As good as they are, custom properties have a series of drawbacks:

**They are treated as strings**, regardless of the value you put on them. This is why sometimes you see the following code:

```css
:root {
  --body-width: 60;
}

.demo01 {
  width: calc(var(--body-width) * 1em)
}
```

**They are not animatable**. Because the browser has no way of knowing what type of value you've stored in the custom property it can animate them.

**There is no default value**. There is no way to provide a default value to reduce typing or to prevent unexpected results.

While you can provide fallbacks in your `var()` function declaration like so:

```css
.demo01 {
  background: var(--color-background, oklch(0.45 0.25 294),
  rebeccapurple)
}
```

That's a function of the `var()` function and not the custom properties.

**Custom properties inherit by default.** This is not always a good thing but we have no control over inheritance.

### The @property at-rule

The [@property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property) at-rule, part of the Houdini family of specifications, addresses the issues with the original custom properties.

The differences are:

**It is defined in an at-rule**. This makes the at-rule more complicated but we can do more with these properties

**@property at rules require explicit syntax declarations**. You must explicitly set one or more syntax declarations when you define the property. At least one syntax declaration is required for the property to be valid

```css
@property --background-color {
  syntax: "<color>";
  inherits: false;
  initial-value: oklch(0.55 0.26 321);
}
```

You can also indicate multiple allowed syntaxes using one of the values listed in the [syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax#values) values list, the `+` sign to indicate a space-separate list of 2 or more syntax values, the `#` sign to indicate a space separated list of two or more syntaxes and the `|` sign to indicate two or more options.

In this example we use the `<length-percentage>` syntax that will accept a width (4em), a percentage (20%) or a calc() value that resolves to either a width or a percentage

```css
@property --content-width {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 40vw;
}
```

**You control whether the property inherits or not**. No more guessing if the property inherits down the tree or not, you have to be explicit about it.

**The properties have a default value**. We can incorporate a default value for the property and, as long as we use sensible default, we can have more predictable results.

**The properties can be animated**. Assuming that the property can be animated, providing a syntax for the custom property means that the browser knows if and how to animate it.

## How do we use them

Using @property defined custom properties is no different than regular custom properties but requires more upfront planning than what I'd normally use when planning custom properties.

For example: do we create individual properties for each item that we want to use or are we ok with creating a single custom property for each parameter and then update it in code?

For these examples I will go with the later option.

### Getting started

We first need to define the custom properties. Because we're using at-rules we'll define them at the top of the stylesheet.

```css
@property --content-width {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 40vw;
}

@property --content-height {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 400px;
}

@property --background-color {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.99 0.01 116);
}

@property --text-color {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.25 0.01 67.5);
}

@property --accent-color {
  syntax: "<color>";
  inherits: true;
  initial-value: oklch(0.55 0.22 30.2);
}
```

Now we can use these custom properties in multiple ways. The easiest is to use the default values for each property.

```css
:root {
  font-family: Raleway, sans-serif;
}

.container {
  width: var(--content-width);
  background: var(--background-color);
  height: 400px;
  margin-inline: 2em;
  margin-block-end: 2em;
}

h1,
p {
  color: var(--acccent-color);
  margin-inline: 2em;
}

a {
  color: var(--accent-color);
  text-decoration: none;
}
```

We can also override the values for each custom property at the time we use it.

In this example, we've overridden the default values for the custom properties.

Because we've set the inherit values of all our custom properties we only need to set the overrides in the container element and they will propagate to all the children. Otherwise, we'd have to override the variable for each individual property that we want to change.

```css
.container {
  /* variable override */
  --content-width: 50vw;
  --background-color: black;
  --text-color: white;
  --accent-color: hotpink;

  /* using the overriden values */
  width: var(--content-width);
  background: var(--background-color);
  height: var(--content-height);
  margin-inline: 2em;
  margin-block-end: 2em;
}
```

## Final thoughts

So, looking at the examples, they don't look any different than when using traditional CSS Custom Properties, so why choose the more complex way of creating them?

They keep me honest by forcing me to make my assumptions explicit and making it clear as to what I want to do with that particular custom property and how far can I go when changing the default value. For example, if I have a color property that has a default value of `#663399` I know that I can only change to other color values and only to colors. This makes it easier for another developer to understand what I wanted the code to do.

If we're only working with default values then they are defined once and used everywhere. Having control of inheritance allows for more flexible usage and overrides.
