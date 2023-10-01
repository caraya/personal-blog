---
title: "Variable Fonts from Google Fonts"
date: "2019-10-07"
---

Developers who, like me, like Google Fonts have been frustrated by their not having Variable Fonts available.

That has changed in the last few weeks. Google has released an experimental API, available at `fonts.googleapis.com/css2`.

The API has a limited selection of fonts available and the syntax takes a little while getting used to it. Google font developers make the following assertion:

**This version of the API isn’t completely stable. It’s best for experimental work while we document the new endpoint.**

## Syntax and Limitations

The new API announced in this [codepen](https://codepen.io/nlwilliams/full/JjPJewp) shows examples of how to use the new API and the difference between the new and the old API.

**Once again, remember that the new API is not final and may change in unexpected ways. Until the API is finalized I'd advice against using it in production code**.

The new endpoint is very strict about accepting requests.

- List axes alphabetically
- Axis value groups (i.e. tuples) need to be sorted numerically
- Tuples can’t overlap or touch (e.g. wght 400..500 and 500..600)

The following examples are, as far as I understand them, how the new API works. They all use the Roboto font.

### Emulating the old API

To load a single font without worrying about specifics, we can load it with the following command:

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto');
```

#### Indicating a Single Value

We can further refine the request by indicating what axis/value combination we want.

We do this by adding a colon and then indicating the axis name and value separated by an ampersand (`@`)

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@700');
```

#### Selecting multiple values from the same font

There are times when we want different values from the same axis and don't want to add them separated by a semicolon (`;`)

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700');
```

#### Selecting mutliple font faces

Google Fonts gives us the choice of working with multiple styles for the same font. The syntax gets slightly more complex.

We first list the two axes in alphabetical order then use an ampersand (`@`) and then, for each axis we give the index of the axis and the value we want to use separated by a comma (`,`) and each comma-separated value separated by a semicolon (`;`).

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,700;1,700');
```

### Working with variable fonts

The new API gives us the option of working with variable fonts and one or more axes available to the font.

#### Selecting a range of values from a single axis

Using multiple values of a single axis is similar too how we work a single axis but instead of putting the value as an index/value pair we use the values separated by two periods (`..`).

```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@200..900');
```

#### Using ranges of values from multiple axes

This is the most intriguing part and what makes variable fonts so exciting to work with.

This example defines two axes and the range of values that we want to use for each.

```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900');
```

### Adding `display: swap`

The [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) attribute allows developers to control how a font is displayed based on whether and when it is downloaded and ready to use.

To use font-display with Google fonts add the `?display=` plus the value of `font-display` you want to use as the last element of the URL.

```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,200..900;1,200..900?display=swap');
```

## Available Variable Fonts

This is a list of the fonts available under the new API as of August 28, 2019.

| Family | Style | Axis | Min | Max |
| --- | --- | --- | --- | --- |
| [Comfortaa](https://fonts.google.com/specimen/Comfortaa) | normal | wght | 300 | 700 |
| [Crimson Pro](https://fonts.google.com/specimen/Crimson Pro) | normal | wght | 200 | 900 |
| [Crimson Pro](https://fonts.google.com/specimen/Crimson Pro) | italic | wght | 200 | 900 |
| [Dosis](https://fonts.google.com/specimen/Dosis) | normal | wght | 200 | 800 |
| [Fira Code](https://fonts.google.com/specimen/Fira Code) | normal | wght | 300 | 700 |
| [Hepta Slab](https://fonts.google.com/specimen/Hepta Slab) | normal | wght | 1 | 900 |
| [Kreon](https://fonts.google.com/specimen/Kreon) | normal | wght | 300 | 700 |
| [Literata](https://fonts.google.com/specimen/Literata) | normal | wght | 400 | 700 |
| [Literata](https://fonts.google.com/specimen/Literata) | italic | wght | 400 | 700 |
| [Markazi Text](https://fonts.google.com/specimen/Markazi Text) | normal | wght | 400 | 700 |
| [Oswald](https://fonts.google.com/specimen/Oswald) | normal | wght | 200 | 700 |
| [Quicksand](https://fonts.google.com/specimen/Quicksand) | normal | wght | 300 | 700 |

## Closing Notes

While this is not a final API it gives us a lot of power in terms of we can use variable fonts in the Google Fonts API.

It'll be interesting to see what additional fonts become available and what creative avenues it opens for typography on the web.
