---
title: "Google fonts way of serving variable fonts"
date: "2020-09-02"
---

One of the biggest pain points of variable fonts was that they were not available in font CDNs like Google Fonts.

In October 2019, Google released the new version of its API that supported variable fonts. I wrote about it in [Variable Fonts from Google Fonts](https://publishing-project.rivendellweb.net/variable-fonts-from-google-fonts/)

The way we import the fonts from Google Fonts changes when working with version 2 of the Google font API. To use Roboto Variable Font, the link we insert in HTML looks like this (it should all be in one line, broken down for readability):

```html
<link href="https://fonts.googleapis.com/css2?
family=Roboto+Slab:ital,wght@0,400;0,700;
1,400;1,700&display=swap" rel="stylesheet">
```

and the CSS `@import` command changes in a similar way:

```css
@import url('https://fonts.googleapis.com/css2?
family=Roboto+Slab:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```

The downside of using Variable Fonts from Google Fonts is that they don't have all the axes available to the font so if you've done work with the font before it may not do what you would expect, at least not without major work.

For example, [Recursive](https://www.recursive.design/) from Google Fonts only provides the `wght` axis and none of the other axes the font provides when you use it locally.

They also lose all the named instances because, in this example, each axis requests individual values.

We can ask for value ranges by changing the values and replacing the single value with a range of values separated by two periods (it should all be in one line, broken down for readability):

```html
<link href="https://fonts.googleapis.com/css2?
family=Roboto+Slab:ital,wght@0,100..700;1,100..700
&display=swap" rel="stylesheet">
```

What this will do is request the full range of weights for both regular and italic versions of Roboto Slab and modify the CSS `@font-face` declaration to include the range.

With these modifications, we get the full power of variable fonts. We can animate them, we can use values other than multiples of 100 and actually be creative with how we use them.
