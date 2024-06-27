---
title: Rethinking CSS Patterns
date: 2024-07-03
tags:
  - CSS
  - Research
  - How-To
---

There are many ways we can improve our CSS, both in terms of readability and ease of use.

This post will discuss some of these new ways of doing things and start thinking about ways to incorporate these new ways into existing projects.

## Using custom properties to make things more readable

Until CSS gained [custom properties (AKA CSS variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables) there was no way to reuse values across one or more stylesheets; if/when we need to make changes, we have to make the changes everywhere we use these values which is tedious and error-prone.

In this example, we use the same color in multiple locations.

```css
body {
  color: #f0f;
}

.special {
  color: #f0f;
}

aside {
  color: #f0f;
}
```

If we decide to change the color we need to change it for every instance and it will produce weird results if we forget.

Using variables, we can centralize the value, reference the variable and override it where necessary.

1. We set the default values for the variables in the root element
2. Then we use the [var()](https://developer.mozilla.org/en-US/docs/Web/CSS/var) function to insert the custom property where appropriate
3. We can customize the values for specific instances by redeclaring the variable

```css
:root {
  /* 1 */
  --base-color: #f0f;
}

body {
  /* 2 */
  color: var(--base-color);
}

.special {
  color: var(--base-color);
}

aside {
  /* 3 */
  --base-color: rebeccapurple;
  color: var(--base-color);
}
```

Using well-named variables also makes the code easier to understand, particularly for people looking at the stylesheet for the first time.

## The flow class ( `* + *` )

I had a hard time understanding this one. Heydon Pickering's [Axiomatic CSS and Lobotomized Owls](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/) does a pretty good job of explaining it and making it useful.

It essentially means ***All elements in the flow of the document that proceed other elements get the styles defined inside***.

So, how does this work? Let's look at an example.

```css
* + * {
	margin-top: 1.5em;
}
```

This means that every element that has a preceding sibling will get the `margin-top` style.

We can qualify the owl so it's only applied in some circumstances. For example, the code below sets the width (`inline-size`) and centers the content using `margin-inline: auto`, and nests the owl selector that applies to the content inside `articles`.

```css
article {
  inline-size: 60vw;
  margin-inline: auto;
}

article * + * {
  margin-top: 1.5em;
}
```

You can also use the negation selector (`:not`) to invert the statement so if we use this selector to style the elements that **don't** match the selector.

```css
article :not(* + *) {
	font-size: 150%;
}
```

By scoping the owl selector we have more flexible styling tools.

**Additional reference**: [CSS lobotomized owl selector: A modern guide](https://blog.logrocket.com/css-lobotomized-owl-selector-modern-guide/).

## Using width: min(), max(), and clamp() to size a container

This is interesting, [min()](https://developer.mozilla.org/en-US/docs/Web/CSS/min), [max()](https://developer.mozilla.org/en-US/docs/Web/CSS/max) and [clamp()](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) provide ways to constrain the dimensions of an element.

`min()` chooses the smallest value from a list of comma-separated expressions as the value of the property. The `min()` function can be used anywhere a `length`, `frequency`, `angle`, `time`, `percentage`, `number`, or `integer` is allowed.

In this example, the `inline-size` (`width` in Western languages) will be the smallest of 50vw or 600px.

```css
.demo01 {
	inline-size: min(50vw, 600px);
}
```

The `max()` function chooses the largest value from a list of comma-separated expressions as the value of the property. The `max()` function can be used anywhere a `length`, `frequency`, `angle`, `time`, `percentage`, `number`, or `integer` is allowed.

This is the inverse of `min()`. The `inline-size` attribute will be the largest of 50vw and 600px.

```css
.demo01 {
	inline-size: max(50vw, 600px);
}
```

The `clamp()` function clamps a middle value within a range of values between a defined minimum bound and a maximum bound. The function takes three parameters:

* A minimum value
* A preferred value
* A maximum allowed value.

In this example, the font will be 2.5vw, but no smaller than 1rem or larger than 2rem.

```css
.demo01 {
	font-size: clamp(1rem, 2.5vw, 2rem);
}
```

## Using container queries

[Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries) enable you to apply styles to an element based on the size of the element's container.

```html
<div class="post">
  <div class="card">
    <h2>Card title</h2>
    <p>Card content</p>
  </div>
</div>
```

Next, we define a ***containment context*** on an element using the `container-type` attribute so the browser knows you might want to query the dimensions of this container element later.

The possible values for `container-type` are:

size
: The query will be based on the inline and block dimensions of the container. Applies layout, style, and size containment to the container.

inline-size
: The query will be based on the inline dimensions of the container. Applies layout, style, and inline-size containment to the element.

normal
: The element is not a query container for any container size queries, but remains a query container for container-style queries.

You can also name a containment context using the `container-name` property. Once named, the name can be used in a `@container` query to target a specific container. Naming containers is optional but enables developers to have multiple container queries for different elements

```css
.post {
  container-type: inline-size;
	container-name: card;
}
```

We then use the [@container](https://developer.mozilla.org/en-US/docs/Web/CSS/@container) at-rule to change styles based on the parent's dimensions.

```css
/* Default heading styles for the card title */
.card h2 {
  font-size: 1em;
}

/* If the container is larger than 700px */
@container card (min-width: 700px) {
  .card h2 {
    font-size: 2em;
  }
}
```

We can use multiple container queries to style elements in the document according to a parent's dimensions. Make sure you document the containers and what each container query represents.

Container queries complement [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries).  Media queries apply styles to elements based on viewport size or other device characteristics.

## light-dark() for theming

One way to use media queries is to test whether the user has enabled dark mode at the system level.

The first example assumes that the default color scheme is light and will make changes if the user has enabled dark or auto modes in the system settings.

```css
@media (prefers-color-scheme: dark) {
	/* Styles for dark mode go here */
}
```

But it represents a lot of potential work. You have to make all the changes inside the `prefers-color-scheme` media query which may cause confusion.

The [color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme) CSS property indicatess which color schemes an element can comfortably render.

The possible values for `color-scheme` are:

normal
: The element isn't aware of any color schemes, and so should be rendered using the browser's default color scheme.

light
: The element can be rendered using the operating system light color scheme.

dark
: The element can be rendered using the operating system dark color scheme.

only
: Forbids the user agent from overriding the color scheme for the element.
: Can be used to turn off color overrides caused by Chrome's Auto Dark Theme, by applying `color-scheme: only light` on a specific element or `:root`.

The final element to consider when revisiting theming web content is the [light-dark](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) color function.

This function sets two colors for a property &mdash; returning one of the two colors options by detecting if the developer has set a light or dark color scheme or the user has requested light or dark color theme &mdash; without `prefers-color-scheme` media queries.

Users are able to indicate their color-scheme preference through their operating system settings or their browser settings.

The `light-dark()` CSS color function returns the first value if the user's preference is set to light or if no preference is set and the second value if the user's preference is set to dark.

For `light-dark()` to work you must set the `color-scheme` propery to the `light dark` on a parent, element, usually the `:root` pseudo-class.

The value returned will depends on what the user has set for their color theme in the OS preferences. If the appearance is set to light, then the browser will choose the first value and if the value is dark, then the second value is selected.

With `light-dark()` we reduce the amount of work that we do when working with color scheme media queries. It doesn't eliminate it completely since not all changes are color-based. But it makes it easier to work with colors across themes for dark and light modes.

## When To Use Ranges in Media Queries

Until not too long ago, we had [min-width()](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width) and [max-width()](https://: developer.mozilla.org/en-US/docs/Web/CSS/max-width) to control the specific width of an element.

You can use the following values for these properties.

: &lt;length>
: Defines the max-width as an absolute value.

&lt;percentage>
: Defines the max-width as a percentage of the containing block's width.

none
: No limit on the size of the box.

max-content
: The intrinsic preferred max-width.

min-content
: The intrinsic minimum max-width.

fit-content
: Use the available space, but not more than max-content, i.e min(max-content, max(min-content, stretch)).

fit-content(&lt;length-percentage>)
: Uses the fit-content formula with the available space replaced by the specified argument, i.e. min(max-content, max(min-content, argument)).

### The explanation

`max-width` indicates the largest possible value for the property. The element will not exceed this value.

The demo01 class will be 100% wide but will not exceed 800 pixels

```css
.demo01 {
  max-width: 800px;
  width: 50%;
}
```

In the media query below, the demo02 class will be light blue if the width of the viewport is 600 pixels or smaller.

```css
@media (max-width: 600px) {
  .demo02 {
    background-color: lightblue;
  }
}
```

`min-width` specifies the minimum width an element can be. The element will not be smaller than this width.

`demo03` will be 50% wide but no smaller than 300 pixels.

```css
.demo03 {
  min-width: 300px;
  width: 50%;
}
```

This media query will make `demo04` light green only on screens larger than 700 pixels.

```css
@media (min-width: 700px) {
  .demo04 {
    background-color: lightgreen;
  }
}
```

You can also combine the two width constrains. The following example will only match `demo05` if the viewport is more than 700 and less than 1200 pixels wide.

```css
@media (min-width: 700px) and (max-width: 1200px) {
  .demo05 {
    background-color: lightgreen;
  }
}
```

It gets tedious to have to remember what each of these means and how to combine them in the context of media queries so they do as intended and remain easy enough to reason through.

### Using max-width and min-width vs. Range Syntax in Media Queries

[Media Queries Level 4](https://www.w3.org/TR/mediaqueries-4/) introduced a range syntax, allowing more concise and readable expressions for range conditions. This syntax supports <, <=, >, and >=.

These are easier to read and understand than equivalent queries using `min-width` and `max-width`.

When using `min-width` and `max-width`

```css
@media (min-width: 600px) and (max-width: 1200px) {
  .demo05 {
    background-color: lightgreen;
  }
}
```

The same query using ranges looks like this:

```css
@media (600px <= width <= 1200px) {
  .container {
    background-color: lightcoral;
  }
}
```

When using individual range queries the `width` attribute represents the current width of the element.

#### Greater than (`>`)

In this example, the background color will change to light pink if the viewport width is greater than 800px.

```css
@media (width > 800px) {
  .container {
    background-color: lightpink;
  }
}
```

#### Greater than or equal to (`>=`)

In this example, the background color will change to light pink if the viewport width is 800 pixels or greater.

This is one type of media queries that can't be expressed using `min-width`

```css
@media (width >= 800px) {
  .container {
    background-color: lightpink;
  }
}
```

#### Less than (`<`)

In this example, the background color will change to light yellow if the viewport width is less than 500 pixels.

```css
@media (width < 500px) {
  .container {
    background-color: lightyellow;
  }
}
```

#### Less or equal than (`<=`)

In this example, the background color will change to light yellow if the viewport width is 500px or less.

```css
@media (width <= 500px) {
  .container {
    background-color: lightyellow;
  }
}
```

Which type of range queries you use will depend a lot on your audience. If you need to support older browsers then you may be better off using `max-width` and `min-width`.

Otherwise, the new range media queries makes the code easier to read and understand for people reading your code, either another developer or yourself 6 months from now.
