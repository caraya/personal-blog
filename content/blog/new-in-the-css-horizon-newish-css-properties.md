---
title: "New in the CSS Horizon: New(ish) CSS properties"
date: "2016-02-01"
categories: 
  - "technology"
---

There are some amazing things we can do with just CSS in modern browsers (and some not so modern ones too.) I'm documenting some of my favorites for posterity and also because they have an unusually high level of support.

## CSS3 Selectors

New additions to the selector family introduced in CSS3. Includes: `[foo^="bar"]`, `[foo$="bar"]`, `[foo*="bar"]`, `:root`, `:nth-child()`, `:nth-last-child()`, `nth-of-type`, `nth-last-of-type()`, `:last-child`, `:first-of-type`, `:last-of-type`, `:only-child`, `:only-of-type`, `:empty`, `:target`, `:enabled`, `:disabled`, `:checked`, `:not()`, `~` (general sibling)

### :root

The :root pseudo-class represents an element that is the root of the document. In HTML 4, this is always the HTML element. This is also useful when styling XML based documents where the root element can be arbitrarily named.

```
:root {
 font-family: Roboto, Helvetica, Arial, sans-serif;
 font-size: 16px;
}
```

### Substring matching attribute selectors

We can use CSS to match substrings within our CSS. This is paricularly useful, in my experience when we want to work with links.

In this first example we target all the `a` elements that have an `href` attribute that starts with http or https and add a small icon to indicate that they are external links.

```
a[href^="http"] {
  background: url(external-icon.svg) no-repeat;
  padding-left: 10px;
}
```

We can also use something like `foo$="bar"`, to test whether a string happens at the end of an element. In the example below we test if the string ends with PDF and if it does we append the string (PDF) to the content of the URL.

```
a[href$=”.pdf”]:after {
 content: “(PDF)”;
}
```

Using a combination of the substring match selectors with the `:not` selector to create selectors by negating a value. For example if we want all local links to not be underlined we may be able to do it like this

```
a:not[href^="http"] {
 text-decoration: none; 
}
```

### :nth-child()

For the longest time one of the biggest PITA tasks was to create stripped tables where even rows would have a white background and odd rows would have a grey one. `:nth-child()` to the rescue.

`:nth-child()`, selects elements based on the occurrence of the elements. Take the following possible values for `:nth-child` \* :nth-child(2n) selects every second child \* :nth-child(3n) selects every third child \* :nth-child(2n+2) selects every 2n + 2 child, a more redundant way of saying :nth-child(4n)

```
li:nth-child(2n) {
 background-color: light-grey;
}
```

### :not

The `:not` selector is a negative selector meaning that it inverts the value of the selector it's attached to.

In the example below we are testing the menu class and expect it **not** to have the .is-hidden class. If it doesn't then the rules in this selector will apply. However if the element has both classes it will not. I would write a different selector for that situation.

```
.menu:not(.is-hidden) {
 // menu styles
}

.menu .is-hidden {
  // Menu is hidden so style accordingly
}
```

## Calculations in CSS

The `calc()` function allows mathematical expressions with addition (`+`), subtraction (`-`), multiplication (`*`), and division (`/`) to be used as component values. The `calc()` expression represents the result of the mathematical calculation it contains, using standard operator precedence rules.

For example, if we want to make the width of our content 2em narrower than full width we could do someting like:

```
.wrapper {
  width: calc(100vw - 2em);
}
```

If you want a floating sidebar to fill up the entire height of the screen, minus the height of the header, you could use:

```
.sidebar { 
 height: calc(100% - 50px) 
}
```

## CSS Filters

CSS filters provide access to several non-destructive image manipulation effects that take place before the element is rendered on screen. The effects available to .

- blur()
- brightness()
- contrast()
- drop-shadow()
- grayscale()
- hue-rotate()
- invert()
- opacity()
- saturate()
- sepia()

```css
img {
 transition: -webkit-filter .5s;
 -webkit-filter: blur(0);
}

.overlay-active img {
 -webkit-filter: blur(1);
}
```

So now we can do non-destructive image manipulation at run time and we can stop the ugly hacks we've had to do in the past.

## To @support or not to @support

`@support` allows me to create conditional selectors beyond what you can do with media queries and provide styles for browsers that support and don't support a feature in the same styel sheet.

In the example below the first rule test if the browser supports Flexbox and sets the display to flex if they do

We then test if the browser **does not** support flexbox and if this rule matches then we provide an alternative style.

```
@supports (display: flex) {
  div { display: flex; }
}

@supports not (display: flex) {
  div { float: left; }
}
```

## In closing

All these techniques are in various states of development. You should always check the level of support according to [caniuse.com](http://caniuse.com/) to make sure you're reaching your target audience.

If there are other properties, functions or tricks I should add to future installments of this series, let me know :-)
