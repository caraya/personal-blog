---
title: When To Use @property
date: 2024-06-24
tags:
  - CSS
  - Custom Properties
---

Custom properties are awesome.

They provide modularity and a central place to store variables that we'll use throughout a stylesheet.

But they are not perfect.

This post will discuss two ways to define CSS Custom properties and when it's best to use each type.

## Defining CSS Custom Properties

CSS Custom Properties (also known as CSS Variables) are defined in [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/).

They are commonly used to provide a central locatin for values used multiple times throughout the document. Before variables we would have to change each individual instance of the value would be cumbersome, especially when working on more than one file at a time.

CSS variables simplify process by giving developers a way to store values in a single place and then reuse them everywhere they are needed.

In this example we create three custom properties:

* Background color for the light theme
* (Text) color for the light theme
* Number of columns to display

We then use these properties as the values of CSS rules.

```css
:root {
	--light-background: #fff;
	--light-text: #000;
	--column-count: 2;
}

body {
	backgorund: var(--light-background);
	color: var(--light-text);
}

.mcolumn-body {
	columns: var(--column-count);
}
```

As convenient as they are, these custom properties have several drawbacks.

They are strings
: Most of the time this will be OK since the values stand on their own
: If you want to use them in calculations, you will have to use [calc()](https://developer.mozilla.org/en-US/docs/Web/CSS/calc)

They inherit by default
: Most of the time this will be OK since we're defining custom values that we want to use throughout the document. This may not always be the case.
: You can't control the inheritance of these properties; it's all or nothing. This means we need to be careful where we place the custom properties declarations
: This is why, most of the time, you see custom properties declared in the `:root` element of a stylesheet since it's the top-most element of the tree along with `html` but is more specific.

CSS custom properties do not enforce type
: Any value can be assigned to any variable. This can lead to unforseen behavior and errors if you assign an incorrect value (using a color variable for a size property).

Limited usage in some CSS properties
: Custom properties cannot be used in all CSS properties. They are valid in property values but not in property names, selectors, or other parts of CSS syntax, such as `@import` or `@keyframes`

Browser compatibility considerations
: While modern browsers support CSS custom properties, older browsers do not. This necessitates fallback mechanisms for full compatibility​.
: This is usually not a problem since the feature has been available for a few years, but it's always good to test on your target browsers to make sure it works as intended.

Can't Use Calculation in Declaration
: Custom properties cannot perform calculations in their declaration. For example, you cannot define a custom property using `calc(100% - 20px)` directly​.

## CSS Properties and Values

[CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/), part of the Houdini family of specifications, provides an enhanced way to define custom properties that address some of the shortcomings of the initial version of the custom properties specification. In particular:

They Provide Type Enforcement
: Ensures that values conform to the specified syntax, reducing errors.
: The valid values for the syntax properties are located in the [supported names](https://drafts.css-houdini.org/css-properties-values-api/#supported-names) section of the CSS Properties and Values API Level 1 specification.

They Control Inheritance
: Explicitly controls whether the element's children should inherit the property value.

They Include An Initial Value
: Ensures consistent behavior and prevents errors when you don't provide a value.

Using the Houdini custom properties to define the same properties as in the previous section looks like this:

```css
@property --light-background {
  syntax: "<color>";
  inherits: true;
  initial-value: #fff;
}

@property --light-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #000;
}

@property --column-count {
	syntax: "<integer>";
	inherits: false;
	initial-value: 2;
}
```

These definitions have advantages over traditional CSS variables:

Protection from errors
: Since the variables are typed to a specific syntax, they will behave like any other CSS error; Browsers will ignore the property and act as if it wasn't set.
: You can provide a fallback value when defining the property using `var()`

Handles missing values
: If you don't set a value when using the property inside a `var()` declaration, browsers will use the default value, if one is defined.

You have control over inheritance
: You can select whether the property is inherited by the element's children. This avoids unwanted side effects.

## Why use @property to define variables

I'm partial to using `@property` in all cases, even though it is more complicated to write.

Custom properties defined with `@property` keep me honest when writing them since they require a syntax and a default value, and make them easier for other people looking at your stylesheets to understand what you meant.

Considering this definition:

```css
@property --column-count {
	syntax: "<integer>";
	inherits: false;
	initial-value: 2;
}
```

Rather than having to guess the type of value for the property, we know that the intended value is an integer.

Rather than inheriting by default, we can control inheritance.

We can use the initial value of the variable. This code will produce  2-column text.

```css
.multicol {
	columns: var(--column-count);
}
```

We can override the default value for our properties. This will produce a 4-column layout by redeclaring the value of the `--column-count` variable.

```css
.multicol {
	--column-count: 4;
	columns: var(--column-count);
}
```

When working with custom properties we should keep in mind the following:

Performance Considerations
: A large number of custom properties or frequent updates can potentially lead to performance issues.
: The browser needs to re-evaluate and repaint affected elements whenever a custom property changes​.

Dynamic Updates Complexity
: Dynamically updating custom properties can be complex, especially with many elements involved, potentially leading to performance degradation or unexpected behavior​

Limited Support in Media Queries and Pseudo-Classes
: CSS custom properties cannot be used directly inside media queries. Media queries are used to apply styles based on certain conditions like screen size, resolution, or orientation. However, since media queries do not accept custom properties directly, you cannot use a custom property to define a breakpoint. this would be illegal CSS: `@media (max-width: var(--breakpoint-small)) {}`
: To work around this limitation, you must define the breakpoints directly in the media queries and use custom properties only for the styles inside the query.
: Similarly, custom properties cannot be directly used to change values within pseudo-classes like `:hover`, `:active`, or `:focus`. Instead, you need to set the custom property outside of the pseudo-class and apply it within the main style rules

## Links and resources

* Specifications
  * [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/)
  * [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/) &mdash; Houdini
* [The Times You Need A Custom @property Instead Of A CSS Variable](https://www.smashingmagazine.com/2024/05/times-need-custom-property-instead-css-variable/)
* [An Interesting Limitation of CSS Custom Properties](https://cloudfour.com/thinks/an-interesting-limitation-of-css-custom-properties/)
