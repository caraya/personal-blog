---
title: Can we unSASS yet?
date: 2025-11-24
tags:
  - CSS
  - SASS
  - Web Development
---

While modern CSS has adopted several powerful features that were once exclusive to preprocessors like SASS, a number of key SASS functionalities are still not natively available. For some of these, clever workarounds exist in pure CSS but, for others, there are no direct equivalents.

This guide explores the features that both platforms now share, followed by the features that remain unique to SASS and their workarounds.

## Features Available in Both SASS and CSS

The gap between SASS and CSS has narrowed as native CSS has adopted features pioneered by preprocessors. What's important to note is that even though the features may look identical, they often behave differently under the hood. SCSS features are processed at compile time, while CSS features are interpreted by the browser at runtime.

### Variables

Declared with a `$` prefix, SASS variables are compiled into static CSS values. They are processed before the stylesheet reaches the browser. These variables are static, when you change them you need to recompile your SCSS files.

```scss
$primary-color: #3498db;
$font-stack: 'Helvetica', sans-serif;

body {
  color: $primary-color;
  font-family: $font-stack;
}
```

Defined with a `--` prefix and accessed with `var()`, CSS custom properties are dynamic. You can change them in real-time with JavaScript, making them incredibly powerful for theming and interactivity.

Browsers consider all CSS variables to be inherited, meaning that if you define a variable on a parent element, all its children can access it unless they override it. They are also treated as strings, so you'll have to use `calc()` for any mathematical operations.

```css
:root {
  --primary-color: #3498db;
  --font-stack: 'Helvetica', sans-serif;
}

body {
  color: var(--primary-color);
  font-family: var(--font-stack);
}
```

You can also use the `@property` at-rule to define custom properties with specific types, initial values, and inheritance behavior.

```css
@property --primary-color {
  syntax: '<color>';
  inherits: true;
  initial-value: #3498db;
}
```

### Nesting

Nesting in SCSS allows you to write selectors in a hierarchical way that mirrors your HTML, improving readability.

```scss
nav {
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;

    &:hover {
      color: blue;
    }
  }
}
```

CNow supported in modern browsers, native CSS nesting uses a very similar syntax, including the & symbol to reference the parent selector.

```css
nav {
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;

    &:hover {
      color: blue;
    }
  }
}
```

### File Importing

SASS allows you to split your code into smaller, modular files (partials). The modern `@use` rule is recommended over the older `@import` because it provides namespacing and prevents duplicate code compilation.

```scss
// _variables.scss
$primary-color: #3498db;

// styles.scss
@use 'variables';

body {
  color: variables.$primary-color;
}
```

Native CSS also has an `@import` rule. However, it can negatively impact performance by creating additional network requests that block page rendering since the importing happens at the time the browser reads the stylesheet. The best practice is typically to use multiple &lt;link&gt; tags in your HTML instead.

```css
/* styles.css */
@import url('reset.css');

body {
  font-family: sans-serif;
}
```

### Mathematical Operations

SASS supports standard math operators (+, -, *, /) directly in your stylesheets.

```scss
.container {
  width: 100% - 40px;
}
```

Native CSS provides the `calc()` function to perform calculations, which is especially powerful because it can mix different units.

```css
.container {
  width: calc(100% - 40px);
}
```

## SASS Features Not Natively in CSS

These are powerful features that still require a preprocessor like SASS to use.

### Mixins

Mixins allow you to define reusable blocks of CSS declarations. You can include these blocks throughout your stylesheet and even pass arguments to make them more flexible. This helps keep your code DRY (Don't Repeat Yourself).

```scss
@mixin center-flex($direction: row) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: $direction;
}

.container {
  @include center-flex();
}

.sidebar {
  @include center-flex(column);
}
```

While there's no direct equivalent, you can achieve some reusability with CSS Custom Properties (Variables). However, this approach is less powerful as it cannot encapsulate an entire block of styles in the same clean way a mixin can.

```css
:root {
  --flex-display: flex;
  --justify-content-center: center;
  --align-items-center: center;
}

.container {
  display: var(--flex-display);
  justify-content: var(--justify-content-center);
  align-items: var(--align-items-center);
}
```

### Inheritance with @extend

The @extend directive lets a selector inherit the styles of another selector. This is a powerful way to share a common set of properties without duplicating code. Placeholder selectors (%placeholder) are particularly useful here, as they create "silent" classes that don't get rendered to CSS unless they are extended.

```scss
%message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend %message;
  border-color: green;
}

.error {
  @extend %message;
  border-color: red;
}
```

CSS lacks a direct inheritance mechanism. The common workaround is to use utility classes. You create a base class with the shared styles and apply it directly to the HTML elements along with their specific modifier classes.

```css
.message {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  border-color: green;
}
```

```html
<div class="message success">Success!</div>
```

### Advanced Built-in Functions

SASS Feature: SASS offers a rich library of built-in functions for manipulating colors (`darken()`, `lighten()`, `mix()`), numbers, and strings. These make it easy to programmatically adjust styles.

```scss
.button {
  background-color: #007bff;
  &:hover {
    background-color: darken(#007bff, 10%);
  }
}
```

CSS is catching up with functions like `color-mix()`, but its library is not as extensive. For more complex logic, you often have to rely on third-party libraries like [color.js](https://colorjs.io/) or [chroma.js](https://gka.github.io/chroma.js/).

```css
.button {
  --button-color: #007bff;
  background-color: var(--button-color);
}

.button:hover {
  background-color: color-mix(in srgb, var(--button-color), #000 10%);
}
```

### Loops and Conditionals

SASS Feature: SASS includes control directives like `@if`, `@for`, `@each`, and `@while`. These allow you to write dynamic and programmatic stylesheets, which is useful for generating repetitive styles like grid columns or themes.

```scss
@for $i from 1 through 3 {
  .item-#{$i} {
    width: 2em * $i;
  }
}
```

There is no direct CSS equivalent for loops and conditionals. This level of logic is currently outside the scope of CSS and typically requires JavaScript to achieve dynamically in the browser.

## Conclusion: Should You Abandon SASS for Pure CSS?

The decision to use SASS or switch to a pure CSS approach depends heavily on your project's needs and constraints.

Go with Pure CSS if:

* Your project targets modern browsers that support features like custom properties and nesting.
* You want to reduce build complexity and eliminate a dependency on a preprocessor.
* Your styling logic is straightforward and doesn't require the advanced programmatic features of SASS.

Stick with SASS if:

* You are working on a large, complex application or a design system where features like mixins, functions, and @extend are crucial for maintainability.
* You need to support older browsers that lack modern CSS features.
* Your team is already proficient with SASS, and the existing workflow is efficient.

Ultimately, SASS is still a powerful tool that offers capabilities beyond what native CSS can do. However, as CSS continues to evolve, the necessity of a preprocessor is diminishing for many common use cases. The best approach is to evaluate the trade-offs for each project and choose the tool that best fits the job.
