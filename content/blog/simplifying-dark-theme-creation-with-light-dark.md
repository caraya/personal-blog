---
title: Simplifying dark theme creation with light-dark()
date: 2024-08-14
tags:
  - CSS
  - Design
  - Dark Mode
---

We can control the color schemes for light and dark modes through CSS using the `prefers-color-scheme` media query.

These media queries will match the system's color scheme and will allow us to select what colors to use when on each mode.

The two possible values for `prefers-color-scheme` are: light and dark.

In the first example below, the default is the light color scheme so we define a dark color scheme inside the media query.

```css
* {
  background: oklch(85.05% 0.049 84.53);
  color: oklch(40.9% 0.105 43.91);
}
@media (prefers-color-scheme: dark) {
  * {
    background: oklch(47.78% 0.067 65.07);
    color: oklch(85.46% 0.03 67.41);
    outline: 5px dashed oklch(0% 0 0);
  }
}
```

In the second example, the dark mode is the default so we set the media query to handle light mode.

```css
* {
  background: oklch(41.15% 0.084 282.05);
  color: oklch(80.32% 0.048 285.28);
}
@media (prefers-color-scheme: light) {
  * {
    background: #bcd;
    color: #334;
    outline: 5px dotted #000;
  }
}
```

This works but it's error-prone. You have to make sure that you add or change colors to one block you must change it in the other one, or you'll have unexpected, and likely ugly, results.

A more recent solution is to use the [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) function.

This function takes two parameters, each a color. The first color represents the color for the light scheme and the second color is the color for the dark scheme.

```css
.demo {
  background: light-dark(
    var(--background-color-light),
    var(--background-color-dark)
  );
}
```

For the function to work you need to set the `color-scheme` property to `light dark` (the space is intentional).

```css
:root {
  color-scheme: light dark;
}
```

This eliminates one level of work necessary for dark themes.  The color declarations will provide the correct color based on the user's system preferences.

The example below defines the `color-scheme` property and colors for light and dark themes as custom properties. This gives us a single point to update when we want to change the colors.

```css
:root {
  color-scheme: light dark;
  --background-color-light: oklch(85.05% 0.049 84.53);
  --background-color-dark: oklch(47.78% 0.067 65.07);
  --color-light: oklch(40.9% 0.105 43.91);
  --color-dark: oklch(85.46% 0.03 67.41);
}
```

We then use `light-dark()` wherever we use colors and indicate which color to use for light themes and which one for dark.

```css
* {
  background: light-dark(
    var(--background-color-light),
    var(--background-color-dark)
  );
  color: light-dark(
    var(--color-light),
    var(--color-light)
  );
}
```

This simplifies our CSS since we don't require media queries to handle colors in our design.

`light-dark()` doesn't replace all uses of `prefer-color-scheme` media queries. If we need to change elements other than colors, we still need to do so inside a media query but the query is simplified since we don't need to include the color changes, we took care of that using `light-dark()`.

```css
@media (prefers-color-scheme: dark) {
  * {
    outline: 5px dashed oklch(0% 0 0);
  }
}
```

I've tested `light-dark()` on this blog to make sure that links have the appropriate colors in dark mode. It makes it easier to work by consolidating color assignments in fewer places.
