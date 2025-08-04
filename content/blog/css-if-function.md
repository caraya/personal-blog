---
title: CSS if() function
date: 2025-09-10
tags:
  - CSS
  - Functions
  - Conditional Logic
---

When researching CSS features that mimic SASS features I came accross the `if()` function. This function allows you to apply conditional logic directly in your CSS, similar to how you might use it in SASS.

This post will cover Chromium's implementations of the `if()` function, which is currently behind a flag, and how it can be used to create dynamic styles based on conditions, along with fallbacks for browsers that don't support it yet.

At the time of this post, this feature is only available in Chromium-based browsers (Chrome, Edge, and Opera) behind the `Experimental Web Platform features` flag.

## The if() function

You use the if() function when you want to make a styling decision for a single property based on a condition, without writing extra CSS rules or JavaScript.

The syntax is straightforward: The `if()`  functions can use [style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries#container_style_queries), [media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries), or [feature queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_conditional_rules/Using_feature_queries) to evaluate the condition, and then returns a value based on whether the condition is true or the false.

```css
if(<condition>): <true value>; else: <else value>);
```

You can also have multple conditions to test:

```css
if(
  <condition1>: <true value1>;
	<condition2>: <true value2>;
  else: <else value>;
);
```

The `else` block is optional, but you should always include it. If you do, then it must be the last statement in the block.

If you leave out the else block and none of your if conditions evaluate to true, the function doesn't return a default value. Instead, it returns the  [guaranteed-invalid](https://developer.mozilla.org/en-US/docs/Glossary/guaranteed_invalid_value) value.

When a browser sees this, it ignores the entire line and the property is not applied at all. This can lead to unexpected behavior, especially if you rely on the property being set to a default value.

Let's say you have this CSS, and the `--is-active` variable is false:

```css
.feature-card {
  background-color: if(style(--is-active: true): #1e40af;);
}
```

In this case, `.feature-card` won't have a blue background, but it also won't have a default background (you didn't set one). It will have whatever background it would have inherited or its browser default (usually transparent).

For predictable and safe code, you should provide an else block to serve as your fallback value most of the time.

However, it's okay to skip the else block when you intentionally want the property to fall back to a value defined earlier in the CSS cascade.

Think of it as applying a style only when a condition is met, and otherwise, you don't want to interfere with the existing styles.

In the following example, we define a default background color for `.my-button`, but only want to change it when the `highlight` custom property is set to true.

If it's not set to true, or not set at all, the property will be ignored and `.my-button` will keep its default background color.

```css
.my-button {
  /* default style. */
  background-color: #e0e0e0;
  color: black;

  /* Only override if condition is met */
  background-color: if(style(--highlight: true): gold;);
}

.highlight-section .my-button {
  --highlight: true;
}
```

## Examples

You can use logical operators (`and`, `or`, `not`) to combine multiple conditions inside the `if()` function.

Style Container `if()` tests check if the property is set to the specified value.

```css
.feature-card {
  --is-active: false;

	background-color: if(
		style(--is-active: true): #1e40af;
		else: #f3f4f6);
  color: if(
		style(--is-active: true): white;
		else: #1f2937);

  transition: all 0.4s ease-in-out;
}

.feature-card:has(input:checked) {
  --is-active: true;
}
```

Media query if() tests check if the media query matches.

```css
margin: if(
  media(width < 700px): 0 auto;
  else: 20px auto;
)
```

Feature query if() tests, check if the feature is supported. This is a streamline version of the `@supports` at rule where you give fallbacks along with the desired value at the same time.

```css
color: if(
  supports(color: lch(77.7% 0 0)): lch(77.7% 0 0);
  else: rgb(192 192 192);
)
```
