---
title: "My CSS Starter Kit: Getting Started"
date: "2016-12-07"
---

One of the things I would have killed for when I came back to doing (serious) web design was a set of guidelines, stylesheets and examples of how to use responsive design and typography on the web. This is my attempt at creating such a guide. It's far from perfect but it's a starting point.

I don't hide the fact that I'm opinionated. There are reasons why I choose to do things a given way and I respect that you may disagree with me, that's your call.

## SASS/SCSS versus CSS

The styles in this guide will be created using SASS 3.4 and the Ruby SASS interpreter. There is a C implementation of SASS (libsass) that is supposed to be on par with Ruby SASS. In my experience libsass does not work as well as the Ruby version so I decided it's ok to add the Ruby dependency to the project.

The CSS output of the SASS process will also be available and you can work from the CSS. Just remember that if you work from the CSS you are responsible for updating your stylesheets when changes happen or when you want to do things differently.

## Using Normalize.scss

We need to make sure that our content looks the same in as many browsers as possible. Normalize.css and its SCSS version make a good job of smoothing the remaining differences in styles and their application across browsers. It has been imported in our `main.scss` stylesheet.

If you don't want Normalize as part of your stylesheet, remove the statement `@import partials/normalize/import-now;` from `main.scss`.

## Open Type classes

The project includes [Utility OpenType](http://utility-opentype.kennethormandy.com/) from Kenneth Normandy. The classes in Utility OpenType provide fine grained control over OpenType font features.

Not all OTF fonts offer all features. But it is still a good tools to have if you choose your fonts carefully .

## using the Golden Ratio and modular scales

The first thing we'll do is define a modular scale to use in the content. I've chose to use [modular scale](http://modularscale.com) by [Scott Kellum](http://scottkellum.com/) and [Tim Brown](http://tbrown.org/) as a way to make it easier to create a scale that works across sizes and accross devices.

There is also a SASS plugin (will work with Compass as well as vanilla SASS). To install in vanilla SASS follow these instructions:

- Download the latest version modular scale plugin from [Github](https://github.com/Team-Sass/modular-scale/releases/latest)
- Unzip the content to your project (I used the `src/sass` directory)
- In your main SCSS file `@import 'modular-scale/modular-scale`

For example, to define the font sizes of the 6 heading elements (h1 through h6), we could do something like this:

```scss
h1 {
  font-size: ms(4);
  line-height: 1.2;
}
h2 {
  font-size: ms(3);
  line-height: 1.1;
}
h3 {
  font-size: ms(2);
  line-height: 1.1;
}
h4 {
  font-size: ms(1);
  line-height: 1.1;
  text-transform: uppercase;
  word-spacing: .2em;
}
h5 {
  font-size: ms(1);
  line-height: 1.1;
  text-transform: uppercase;
}
h6 {
  font-size: ms(1);
  line-height: 1.1;
}
```

and the resulting CSS looks like this:

```css
h1 {
  font-size: 6.8541em;
  line-height: 1.2;
}

h2 {
  font-size: 4.23607em;
  line-height: 1.1;
}

h3 {
  font-size: 2.61803em;
  line-height: 1.1;
}

h4 {
  font-size: 1.61803em;
  line-height: 1.1;
  text-transform: uppercase;
  word-spacing: .2em;
}

h5 {
  font-size: 1.61803em;
  line-height: 1.1;
  text-transform: uppercase;
}

h6 {
  font-size: 1.61803em;
  line-height: 1.1;
}
```

The one thing I don't like about the sizes we get using the Golden Ratio is that they are too big. The Modular Scale makes available different scales. If we use the change the scale to 15:16, also known as a minor second scale. The values of our headers will also change. To make these changes, add the following variables to your stylesheet, or to your variables file:

```scss
$ms-base: 1em;
$ms-ratio: 1.067;
```

In this scales the headings become harder to differentiate:

```css
h1 {
  font-size: 1.29616em;
  line-height: 1.2;
}

h2 {
  font-size: 1.21477em;
  line-height: 1.1;
}

h3 {
  font-size: 1.13849em;
  line-height: 1.1;
}

h4 {
  font-size: 1.067em;
  line-height: 1.1;
  text-transform: uppercase;
  word-spacing: .2em;
}

h5 {
  font-size: 1.067em;
  line-height: 1.1;
  text-transform: uppercase;
  word-spacing: .2em;
}

h6 {
  font-size: 1.067em;
  line-height: 1.1;
}
```

We'll try one more scale, the major third scale (1.25). We'll change the variables to those below:

```scss
$ms-base: 1em;
$ms-ratio: 1.25;
```

And the resulting CSS

```css
h1 {
  font-size: 3.8147em;
  line-height: 1.2;
}

h2 {
  font-size: 3.05176em;
  line-height: 1.1;
}

h3 {
  font-size: 2.44141em;
  line-height: 1.1;
}

h4 {
  font-size: 1.95313em;
  line-height: 1.1;
}

h5 {
  font-size: 1.5625em;
  line-height: 1.1;
}

h6 {
  font-size: 1.25em;
  line-height: 1.1;
}
```

There are other scales available. You can play with them to find the scale that suits your fonts, your design and your tastes the best

We'll pair the modular scale with media queries to change the sizes for smaller form factors.

Modular scale includes functions for a number of classic design and musical scale ratios. You can add your own ratios as well.

| Function | Ratio | Decimal value |
| --- | --- | --- |
| $phi | 1:1.618 | 1.618 |
| $golden | 1:1.618 | 1.618 |
| $double-octave | 1:4 | 4 |
| $major-twelfth | 1:3 | 3 |
| $major-eleventh | 3:8 | 2.667 |
| $major-tenth | 2:5 | 2.5 |
| $octave | 1:2 | 2 |
| $major-seventh | 8:15 | 1.875 |
| $minor-seventh | 9:16 | 1.778 |
| $major-sixth | 3:5 | 1.667 |
| $minor-sixth | 5:8 | 1.6 |
| $fifth | 2:3 | 1.5 |
| $augmented-fourth | 1:√2 | 1.414 |
| $fourth | 3:4 | 1.333 |
| $major-third | 4:5 | 1.25 |
| $minor-third | 5:6 | 1.2 |
| $major-second | 8:9 | 1.125 |
| $minor-second | 15:16 | 1.067 |

## Defining a list of variable to use

For a long time SASS was the only game in town when it came to using variables or variable-like constructs for your stylesheets. CSS caught up with a more dynamic concept of variables.

I love CSS variables but, for building a framework SASS variables will work best. If necessary we can convert some of the SASS variables discussed below into CSS variables to use after transformation.

Some variables to think about:

- Colors: We can create variables for colors in the Material Design Palette, for example, and then use SASS functions to create lighter and darker versions of each color without having to do the calculations manually.
- Default font sizes: Since we’ll be changing some (if not all) font size attributes we may as well store them in variables. However we need to remember that we’re using modular scales to generate the sizes
