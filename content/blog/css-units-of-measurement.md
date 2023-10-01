---
title: "CSS Units of Measurement"
date: "2013-12-26"
categories: 
  - "ebook-publishing"
  - "technology"
---

## Defining Length

According to the W3C:

> **_Lengths refer to distance measurements_**
> 
> The format of a length value (denoted by >length< in this specification) is a number (with or without a decimal point) immediately followed by a unit identifier (e.g., px, em, etc.). After a zero length, the unit identifier is optional.
> 
> Some properties allow negative length values, but this may complicate the formatting model and there may be implementation-specific limits. If a negative length value cannot be supported, it should be converted to the nearest value that can be supported.
> 
> If a negative length value is set on a property that does not allow negative length values, the declaration is ignored.
> 
> [http://www.w3.org/TR/CSS2/syndata.html#length-units](http://www.w3.org/TR/CSS2/syndata.html#length-units)

## Absolute length (size) units\`

Absolute length units are fixed in relation to each other. They are mainly useful when the output environment is known. Absolute values can be expressed in:

- in: inches — 1in is equal to 2.54cm.
- cm: centimeters
- mm: millimeters
- pt: points — the points used by CSS are equal to 1/72nd of 1in.
- pc: picas — 1pc is equal to 12pt.
- px: pixel units — 1px is equal to 0.75pt.

Or using one of the following pre-defined keywords

- xx-small
- small
- medium
- large
- x-large
- xx-large

### Examples of absolute size values

```
h1 { margin: 0.5in }      /* inches  */
h2 { line-height: 3cm }   /* centimeters */
h3 { word-spacing: 4mm }  /* millimeters */
h4 { font-size: 12pt }    /* points */
h4 { font-size: 1pc }     /* picas */
p  { font-size: 12px }    /* px */
```

In the example above all elements will retain the assigned measurements, regardless of their parent or surrounding elements measurements.

Absolute size keywords are calculated by the User Agent (browser) and will be slightly different from one to another.

## Relative length (size) units

Relative lengths and measurements are based on the computed-style of the current element. The only exception is font-size where the size is calculated based on the parent element

According to W3C:

> Relative length units specify a length relative to another length property. Style sheets that use relative units can more easily scale from one output environment to another.
> 
> [cite="http://www.w3.org/TR/CSS2/syndata.html"](http://www.w3.org/TR/CSS2/syndata.html)

Relative units defined in CSS2 and CSS3

- em: the 'font-size' of the relevant font
- rem (root em): calculated based on the font-size of the root element
- ex: the 'x-height' of the relevant font
- percentages: a fraction of the parent element's measurement

Any of the predefined keywords:

- Larger
- Smaller

### Examples using em, ex and percentages

```
h1 { margin: 0.5em; }      /* em */
h1 { margin: 1ex; }        /* ex */
h1 { margin: 125%; }       /* percentage */ 
```

### Examples using rem

```
html { font-size: 16px /* to make the example clearer */ } 
body { font-size: 1.5rem; } /* =24px */
h1   { font-size: 2.5rem; } /* =40px */
```
