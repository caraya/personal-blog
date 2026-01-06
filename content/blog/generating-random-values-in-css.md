---
title: Generating Random Values in CSS
date: 2025-11-03
tags:
  - CSS
---

Until now generating random values to use in CSS required Javascript to generate the random values and apply them to CSS rules.

The CSS Working Group has created two different ways to generate and use random values in CSS independent of Javascript: the `@random` at-rule (currently available in Safari Technical Preview) and the proposed `random()` function (not currently available).

This post covers what the `@random` rule is, how it differs from the proposed `random()` function, its current limited browser support, and how you can experiment with it today.

## What is the @random At-Rule

The CSS `@random` at-rule is an experimental feature that lets you apply a style rule chosen randomly from a list you provide. This powerful feature, part of the CSS [Conditional Rules Module Level 5](https://drafts.csswg.org/css-values-5/) draft, introduces procedural and aesthetic variety directly into your stylesheets, without Javascript.

### @random Rule vs. random() Function: What's the Difference?

The `@random` at-rule and the `random()` function are two separate features designed for different tasks.

| Feature | @random At-Rule | random() Function |
| :---: | --- | --- |
| What It Is | An At-Rule (like @media or @keyframes). | A Function (like calc() or rgb()). |
| What It Does | Chooses one entire CSS rule block from a list. | Generates a single random value inside a property. |
| Usage | Wraps a set of complete style rules. | Used inside a CSS property declaration. |
| Granularity | Selects from a discrete, predefined set of styles. | Generates a number within a specified continuous range. |
| Status | Experimental; available in Safari Technology Preview. | Experimental; available in Safari Technology Preview. |

`@random` picks from a menu of options you write out, while `random()` generates a value on the fly. As of today, both are only available for experimentation in Safari Technology Preview, not the production version of Safari.

## Browser Support and How to Enable It

Safari Technology Preview (191+): The only browser that supports both `@random` and `random()`, and they must be enabled manually via feature flags.

Chrome, Firefox, Edge, and standard Safari do not support either of them.

### How to Enable Randomness Features in Safari Technology Preview

1. Open Safari Technology Preview.
2. From the menu bar, select Develop > Feature Flags.
3. Scroll to the CSS section and check the boxes for CSS @random Rule and CSS random() function.

You should not use these features in production code until they've stabilized and become, at least, baseline newly available.

## How @random Works: Syntax and Strategies

The `@random` at-rule acts as a container. The browser looks inside the `@random {}` block and activates just one of the style rules it contains.

* **random (default)**: Picks one rule and applies it to all matching elements.
* **random-per-element**: Makes a new random choice for each matching element.

```css
@random random-per-element {
  /* rules */
}
```

## How random() Works: Syntax

The `random()` function generates a random number within a given range, which you can use directly as a value for a CSS property.

```css
/* Generate a random number between 0.5 and 1.5 */
transform: scale(random(0.5, 1.5));

/* Generate a random integer between 1 and 5 */
grid-column: random(1, 5, integer);
```

## CSS random() vs. SASS random()

It is important not to confuse the native CSS `random()` function with the `random()` function available in the SASS preprocessor. They achieve similar goals but work in fundamentally different ways.

| Feature | CSS random() | SASS random() |
| :---: | --- | --- |
| Execution | Client-Side (in the browser). Runs every time the page loads. | Compile-Time. Runs once when you compile your SASS to CSS. |
| Result | Dynamic. The value can be different on every page refresh. | Static. The value is fixed in the generated CSS file until you recompile. |
| Use Case | Generative art, dynamic layouts, UI that feels alive. | Creating variations for a style guide, A/B testing static assets, randomizing during development. |

### SASS random() Example

This SASS code generates a single random hue and assigns it to the .element class.

```scss
.element {
  // Get a random integer from 0 to 360
  background-color: hsl(random(360), 80%, 70%);
}
```

When you compile this, it produces a static CSS file with a fixed value. The result will look like this, and it will not change until you compile your SASS again:

```css
/* The result is static */
.element {
  background-color: hsl(217, 80%, 70%);
}
```

In contrast, the CSS `random()` function remains in the final CSS file and is evaluated by the browser, making it truly dynamic.

## @random vs. random() for Ranges

The `@random` rule cannot generate a value within a range; it only selects from predefined blocks. For generating dynamic values, the `random()` function is the correct tool.

### Examples and Use Cases

#### Example 1: @random for Per-Element Choice

Using `random-per-element`, each card gets its own style from a predefined set, creating a "messy" but curated layout.

```html
<div class="card-container">
  <div class="card"></div>
  <div class="card"></div>
  <div class="card"></div>
  <div class="card"></div>
</div>
```

The styles in the `@random` block are full definitions, not random values to apply to a property. This means more work upfront to define all possible styles.

```css
@random random-per-element {
  .card { background-color: #ffadad; transform: rotate(-2deg); }
  .card { background-color: #ffd6a5; transform: rotate(3deg); }
  .card { background-color: #caffbf; transform: rotate(1.5deg); }
  .card { background-color: #9bf6ff; transform: rotate(-3deg); }
}
/* Base styles */
.card-container { display: flex; gap: 1rem; padding: 1rem; }
.card { width: 100px; height: 150px; border-radius: 8px; }
```

#### Example 2: random() for Generative Styles

Here, we use `random()` to give each shape a truly unique color, size, and rotation without predefined blocks. This is far more powerful for generative art.

```html
<div class="container">
  <div class="shape"></div>
  <div class="shape"></div>
  <div class="shape"></div>
  <div class="shape"></div>
</div>
```

Unlike the `@random` at-rule, which selects from predefined styles, `random()` generates individual values on the fly.

```css
/* Base styles for all boxes */
.shape {
  width: 100px;
  height: 100px;
  border-radius: 8px;

  /* random(0, 360) -> for a random color hue */
  background-color: hsl(random(0, 360), 80%, 60%);

  /* random(0.5, 1.5) -> for a random size */
  /* random(-45, 45) -> for a random rotation */
  transform: scale(random(0.5, 1.5)) rotate(random(-45, 45)deg);
}
/* Base styles */
.container { display: flex; gap: 1rem; padding: 1rem; }
```

## Javascript/TypeScript Alternatives for Cross-Browser Support

Until these features are widely available, you must use Javascript to achieve similar effects in other browsers.

### Simulating @random

This script replicates the effect from "Example 1" using Typescript (this would get compiled to Javascript for production).

```ts
type CardStyle = {
  backgroundColor: string;
  transform: string;
};

document.addEventListener('DOMContentLoaded', () => {
  const cards: NodeListOf<HTMLDivElement> = document.querySelectorAll('.card');
  const styles: CardStyle[] = [
    { backgroundColor: '#ffadad', transform: 'rotate(-2deg)' },
    { backgroundColor: '#ffd6a5', transform: 'rotate(3deg)' },
    { backgroundColor: '#caffbf', transform: 'rotate(1.5deg)' },
    { backgroundColor: '#9bf6ff', transform: 'rotate(-3deg)' },
  ];
  cards.forEach((card: HTMLDivElement) => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    if (randomStyle) {
      card.style.backgroundColor = randomStyle.backgroundColor;
      card.style.transform = randomStyle.transform;
    }
  });
});
```

### Simulating random()

This script replicates the generative effect from "Example 2."

```ts
document.addEventListener('DOMContentLoaded', () => {
  const shapes: NodeListOf<HTMLDivElement> = document.querySelectorAll('.shape');
  const getRandom = (min: number, max: number): number => Math.random() * (max - min) + min;

  shapes.forEach((shape: HTMLDivElement) => {
    // This remains the same, as hue is an angle from 0-360 in both HSL and OKLCH.
    const randomHue = getRandom(0, 360);

    // We replace hsl() with oklch().
    // Lightness is set to 70%, and Chroma (color intensity) is set to 0.15.
    shape.style.backgroundColor = `oklch(70% 0.15 ${randomHue})`;

    const randomScale = getRandom(0.5, 1.5);
    const randomRotation = getRandom(-45, 45);
    shape.style.transform = `scale(${randomScale}) rotate(${randomRotation}deg)`;
  });
});
```

## Conclusion

The `@random` at-rule and the `random()` function offer powerful ways to create dynamic, generative styles in CSS. Until these features are universally supported, leveraging Javascript can help achieve similar effects across all browsers.
