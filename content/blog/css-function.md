---
title: CSS @function
date: 2025-10-20
tags:
  - CSS
  - Web Development
---

The CSS `@function` at-rule allows you to create reusable, static functions, making your code more DRY (Don't Repeat Yourself), modular, and maintainable.

This post covers the `@function` syntax as implemented in recent Chrome 139+ and as specified in the [CSS Custom Functions and Mixins Module Level 1](https://www.w3.org/TR/css-mixins-1/) draft.

## What It Is

The CSS `@function` at-rule is conceptually similar to the [SASS @function](https://sass-lang.com/documentation/at-rules/function/) at-rule.

```css
@function --function-name(--arg1 = default, --arg2) returns <type> {
  /* Function body with logic */
  result: /* some computed value */;
}
```

The components of the function are:

* `--function-name`: The name you use to call the function, prefixed with two dashes (--) just like custom properties (`var(--my-function)`).
* `--arg1 <type> = default`: An argument passed to the function. You can specify a type (like &lt;length&gt; or &lt;color&gt;) and provide a default value.
* `returns <type>`: An optional keyword declaring the expected return type of the function (e.g., &lt;length&gt;, &lt;color&gt;).
* `result: ...`: The mandatory implementation. This descriptor defines the value the function computes and returns. It’s where the magic happens!

### Implementation Status in Chrome

The current Chrome implementation is experimental and doesn't yet support the full specification. Here’s a quick breakdown:

<table>
	<thead>
		<tr>
			<th>✅ Supported</th>
			<th>❌ Not Yet Supported</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>
				<ul>
					<li>Basic function definition</li>
					<li>Positional arguments</li>
					<li>The result descriptor</li>
				</ul>
			</td>
			<td>
				<ul>
					<li>Typed parameters (&lt;length&gt;)</li>
					<li>Default values</li>
					<li>The returns keyword</li>
					<li>Named arguments</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

These limitations mean you can't enforce type safety or rely on default values, so code carefully.

### Working Example

Here’s a function that constructs a border value. We've made a couple of accommodations for the current implementation:

* All parameters must be provided, as default values are not supported.
* Parameter types are not specified.

```css
@function --create-styled-border(--width, --style, --color) {
    result:
      var(--width)
      var(--style)
      var(--color);
}
```

To use it, simply call the function by its name and pass in your arguments.

```css
/* Call with all arguments in order. */
.element-1 {
    border: --create-styled-border(2px, solid, oklch(0.5712 0.2219 20.09));
}
```

## More Examples

Let's look at a few more examples of CSS functions in action.

### Example 1: The Themer

Here, we define two functions, `--generate-shade` and `--generate-tint`, to create variations of a base color. A key behavior to note is that `@function` is static. The browser evaluates it once when the CSS is parsed, not dynamically when a variable changes.

If you change the `--base-color` with Javascript, the shades and tints will not update because they were resolved to fixed values on page load.

```css
@function --generate-shade(--base-color, --percentage) {
  result: color-mix(
    in srgb, var(--base-color), black var(--percentage)
  );
}

@function --generate-tint(--base-color, --percentage) {
  result: color-mix(
    in srgb, var(--base-color), white var(--percentage)
  );
}
```

```css
.themed {
  --primary-color-dark: --generate-shade(var(--base-color), 20%);
}
```

### Example 2: Spacing System

This `--calculate-spacing` function takes a base unit and a multiplier. Even though the result uses `calc()`, the entire function is resolved to a static value (8px or 16px) during the initial CSS parsing.

```css
@function --calculate-spacing(--base-unit, --multiplier) {
    result: calc(var(--base-unit) * var(--multiplier));
}
```

When using the function, we provide the values. Here, we use a CSS variable `var(--base-spacing)` as the value for the `--base-unit` argument.

```css
.dynamic-spacing {
  --base-spacing: 16px;
  --spacing-sm: --calculate-spacing(var(--base-spacing), 0.5); /* 8px */
  --spacing-lg: --calculate-spacing(var(--base-spacing), 2);   /* 32px */
}
```

### Example 3: Fluid Typography

The `--fluid-typography` function simplifies creating responsive text by taking four parameters: min/max font size and min/max viewport width.

While the `@function` itself is parsed once, the `clamp()` expression it produces remains fully responsive to browser resizing.

```css
@function --fluid-typography(--min-size, --max-size, --min-vw, --max-vw) {
  result: clamp(
    var(--min-size),
    calc(var(--min-size) + (var(--max-size) - var(--min-size)) * ((100vw - var(--min-vw)) / (var(--max-vw) - var(--min-vw)))),
    var(--max-size));
}
```

## Coding Defensively

Since `@function` is experimental and has limited browser support, you must provide fallbacks. Here are two primary strategies.

### Using the Cascade

The simplest method is to rely on the CSS cascade. Define a standard CSS property first, then redefine it using your `@function`. Browsers that don't understand `@function` will ignore the second rule and apply the first one.

```css
.element {
  /* Fallback for older browsers */
  --border-color: #cc0000;

  /* Modern browsers will use this */
  --border-color: --generate-shade(crimson, 10%);
}
```

### Using Feature Queries (@supports)

A more robust fallback strategy is to use the `@supports` at-rule to check if the browser supports the `@function` syntax. This is ideal for applying styles only when the feature is available.

```css
/* Function definition */
@function --calculate-spacing(--base-unit, --multiplier) {
    result: calc(var(--base-unit) * var(--multiplier));
}
```

Then, wrap the rule that uses the function in a feature query. This way, only supporting browsers will apply the styles.

```css
.another-element {
  /* Default value */
  --padding-large: 32px;
}

/* Check for function() support */
@supports function(--any-name(initial)) {
  .another-element {
    --padding-large: --calculate-spacing(var(--base-spacing), 2);
  }
}
```

## Conclusion

CSS functions offer a powerful way to create reusable styles and encapsulate complex logic.

However, their current implementation is limited and requires careful use of fallbacks until the feature is fully supported across all browsers.

Understanding these constraints is key to using CSS functions effectively today.
