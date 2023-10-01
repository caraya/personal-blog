---
title: "CSS Variables For Handling Fonts"
date: "2019-12-25"
---

> Thanks to [Jason Pamental](https://twitter.com/jpamental) for feedback on this post.

Variable fonts have a problem as currently implemented. If you use `font-variation-settings` to control the different axes of the font then every time one changes you must change the other ones or they will reset back to their default values.

We'll use [Recursive](https://www.recursive.design/) as the font for this post.

Recursive has two custom axes: Monospace and Csual and three default axes: Weight, Slant and Italics. The axes information is shown in the table below.

| Axis Designation | Axis Name | Min Value | Max Value | Default |
| --- | --- | --- | --- | --- |
| MONO | Monospace | 0 | 1 | 0 |
| CASL | Casual | 0 | 1 | 0 |
| wght | Weight | 300 | 1000 | 300 |
| slnt | Slant | \-15 | 0 | 0 |
| ital | Italic | 0 | 1 | 0.5 |

We define the following variables defining the default values of the Variable Font axes to the `:root` element of the style sheet. We use `:root` rather than `html` because `:root` has a higher specificity.

```css
root: {
  --vf-mono: 0;
  --vf-casl: 0;
  --vf-slnt: 0;
  --vf-ital: 0.5;
  --vf-wght: 300;
}
```

Using these variables we can then use them to update `font-variation-settings` when we make changes.

In the first rule of the example below, we change the value of `--vf-mono` and when we update font-variation-settings, it'll take the value for `--vf-mono` we just defined and all the other values from `:root` so we don't have to define all the axes values every time we make a change to one of them.

The different examples show different combinations of variable changes from a single value to changing multiple values for more complex forms.

```css
.mono-linear-light {
  --vf-mono: 1;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}

.mono-linear-light-italic {
  --vf-mono: 1;
  --vf-slnt: -15;
  --vf-ital: 1;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}

.mono-casual-light {
  --vf-mono: 1;
  --vf-casl: 1;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}

.mono-casual-light-italic {
  --vf-mono: 1;
  --vf-casl: 1;
  --vf-slnt: -15;
  --vf-ital: 1;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}

.mono-casual-regular {
  --vf-mono: 1;
  --vf-casl: 1;
  --vf-wght: 400;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}

.mono-casual-italic {
  --vf-mono: 1;
  --vf-casl: 1;
  --vf-wght: 400;
  --vf-slnt: -15;
  --vf-ital: 1;
  font-variation-settings:  "MONO" var(--vf-mono),
                            "CASL" var(--vf-casl),
                            "slnt" var(--vf-slnt),
                            "ital" var(--vf-ital);
  font-weight: var(--vf-weight);
}
```

There is another use for Variable Fonts variables. The predefined axes change the way that we use existing attributes like `font-weight`, `font-stretch` and `font-styles`. Instead of preset values from 100 to 900 in increments of 100 units we now use values that are dependent on the font and can be used in as small increments as we want to use.

Recursive's weight range is from 300 (light) to 1000 (black). Let's say for example that we want to use a value that is halfway between semi-bold (600) and bold (700). We could define a variable with the value we want to use, like this:

```css
:root {
  --vf-bold-weight: 650;
}
```

We could then use the variable wherever we want to use boldfaced text.

```css
strong, b {
  font-weight: var(--vf-bold-weight);
}
```

If we want to change the value of our bold font, we need to change it in one place at the top and it will change it everywhere we use it.
