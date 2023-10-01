---
title: "CSS Relative Colors and Building Color Palettes"
date: "2023-05-31"
---

In an [Deep Dive Into color-mix](https://publishing-project.rivendellweb.net/deep-dive-into-color-mix/) I used `color-mix` to lighten and darken colors.

There is another technique to accomplish the same task: relative color syntax.

Relative color syntax allows us to manipulate and convert any color to any format. We can use it to create a color palette from any chosen color

To make things easier, we'll store both the base color and the relative colors based on it in custom properties.

The syntax looks like this:

```css
:root {
  background: lab(from var(--theme-primary) 10% a b);
}
```

in this example we see the following elements:

`lab` indicates the color space that we want to convert the color to

`from` indicates the source color, in this case the `--theme-primary` variable.

`10% a b` are the values for the lab color, the lightness, a axis and b axis. The example uses 90% as the value of lightness, making the color 90% lighter. The default would be `l a b` to just convert the color from HEX to Lab

So how would we build a color scale to use in a theme?

These definitions in the `:root` object creates the relative colors.

```css
:root {
  --theme-primary: #663399;
  --theme-primary-900: lab(from var(--theme-primary) 10% a b);
  --theme-primary-800: lab(from var(--theme-primary) 20% a b);
  --theme-primary-700: lab(from var(--theme-primary) 30% a b);
  --theme-primary-600: lab(from var(--theme-primary) 40% a b);
  --theme-primary-500: lab(from var(--theme-primary) 50% a b);
  --theme-primary-400: lab(from var(--theme-primary) 60% a b);
  --theme-primary-300: lab(from var(--theme-primary) 70% a b);
  --theme-primary-200: lab(from var(--theme-primary) 80% a b);
  --theme-primary-100: lab(from var(--theme-primary) 90% a b);
}
```

You can then use the color definition anywhere you can use a color. For example:

```css
.background-light {
  background: var(--theme-primary-400)
}

.background-dark {
  var(--theme-primary-900)
}
```

If your browser supports relative colors (as of May 2023, only Safari), you can view a fuller example below

<iframe height="977" style="width: 100%;" scrolling="no" title="Relative colors and Color contrast" src="https://codepen.io/caraya/embed/yLRExLM?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/yLRExLM"> Relative colors and Color contrast</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>
