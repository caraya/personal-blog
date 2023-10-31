---
title: Custom List Styles in CSS
date: 2023-10-25
---

CSS lists look nice with the standard list styles but there are cases when we may want to use special characters in the styles, the language that we use may have special, or we may just want to have fun.

To modify the appearance of lists we'll look at the [list-style-type](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type) property and the [@counter-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style) at-rule.

## list-style-type

`list-style-type` lets CSS authors select from a list of available list styles to use.

THe list of available values for both ordered and unordered lists is in the [MDN page](https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type#values)

We'll use the values on that list to create custom ordered and unordered lists.

In both examples, we will also use the [::marker](https://developer.mozilla.org/en-US/docs/Web/CSS/::marker) to style the element.

### Ordered lists

This ordered list will use a numbered list with leading-0 decimals (01, 02, 03, etc).

We've also moved the `margin-inline-start` (margin-right for English) further in so the numbers are visible.

```css
ol li {
  list-style-type: decimal-leading-zero;
  margin-inline-start: 1rem;
}
```

We style the marker (in this case the number) to be 50% larger than the text and paint it in a different color.

```css
ol li::marker {
  font-size: 1.5rem;
  color: oklch(55.69% 0.2 12.21);
}
```

## Unordered list

The unordered list uses a disclosure closed character, &#9654;. We don't need to style the list itself.

```css
ul li {
  list-style-type: disclosure-closed;
}
```

Styling the markers shows how to style markers for the second level list.

Unless you explicitly override the marker styles, they will keep the pre-set styles.

```css
ul li::marker {
  font-size: 2rem;
  color: rebeccapurple;
}

ul ul li::marker {
  color: hotpink;
}
```

## @counter-style

In addition to the styles defined in [CSS Lists and Counters Module Level 3](https://www.w3.org/TR/css-lists-3/), you can define your own specific counter sets using the [@counter-style](https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style) at-rule.

`@counter-style` takes the following parameters:

**system**
: The system descriptor specifies which algorithm will be used to construct the counter’s representation based on the counter value
: For example, cyclic counter styles just cycle through their symbols repeatedly, while numeric counter styles interpret their symbols as digits and build their representation accordingly.
: The possible values for system are described in [Counter algorithms: the system descriptor](https://www.w3.org/TR/css-counter-styles-3/#counter-style-system)

**negative**
: How to handle negative values
: The default value is "\2D" ("-" hyphen-minus)

**prefix**
: The string that is prepended to the marker representation
: Prefixes come before any negative sign
: The initial value is  the empty string ("")

**suffix**
: A string that is appended to the marker representation
: Suffixes are added to the representation after negative signs
: The initial value is "\2E\20" ("." full stop followed by a space)

**range**
: This descriptor defines the ranges for the counter style is defined
: The descriptor takes one of two values: `auto` (dependent on the counter system) or a comma-separated defining the inclusive boundaries
: If a counter style is used to represent a counter value outside of its ranges, the counter style instead drops down to its fallback counter style

This example uses one of the W3C-produced [Ready-made counter styles](https://www.w3.org/TR/predefined-counter-styles/) to illustrate how these custom counters work.

The counter represents a `fixed` system. It defines symbols for the first 50 numbers circled with a thin black line around it using Unicode codepoints.

Once it run past the available symbols, it will fall back to a decimal style.

```css
@counter-style circled-decimal {
system: fixed 0;
symbols:
 \278A '\24EA' '\2460' '\2461'
'\2462' '\2463' '\2464'
'\2465' '\2466' '\2467'
'\2468' '\2469' '\246A'
'\246B' '\246C' '\246D'
'\246E' '\246F' '\2470'
'\2471' '\2472' '\2473'
'\3251' '\3252' '\3253'
'\3254' '\3255' '\3256'
'\3257' '\3258' '\3259'
'\325a' '\325b' '\325c'
'\325d' '\325e' '\325f'
'\32b1' '\32b2' '\32b3'
'\32b4' '\32b5' '\32b6'
'\32b7' '\32b8' '\32b9'
'\32ba' '\32bb' '\32bc'
'\32bd' '\32be' '\32bf';
suffix: ' ';
}

ol li {
  list-style-type: circled-decimal;
}
```

When working with Unicode codepoints you're at the mercy of the Unicode standard. The example has 50 items so we should be OK for most cases but, if we need more items than what Unicode provides in the style we're using, we need to consider changing the style we use or use the provided fallback wisely.

Another thing I've discovered, particularly with large markers and large text blocks, the alignment gets shot... I haven't figured out how to align the text to the marker or viceversa using markers so it may be better to consider doing it the old-fashioned way.

This code approaches to what I would like to do.

It uses a [counter](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_counter_styles/Using_CSS_counters) to hold the value of the list item, and the [::before](https://developer.mozilla.org/en-US/docs/Web/CSS/::before) pseudo element to style the counter.

It also uses Flexbox to align the items so the text won't wrap below the item number.

```css
.custom-counter {
  counter-reset: step-counter;
  list-style-type: none;
}

.custom-counter li {
  margin-block: 3rem;
  margin-inline: 2rem;
  counter-increment: step-counter;
  width: 40vw;
  display: flex;
}

.custom-counter li::before {
  content: counter(step-counter);
  background-color: rgb(200, 0, 200);
  color: white;
  font-size: 3.5rem;
  height: 96px;
  width: 72px;
  padding-inline: 32px;
  margin-inline-end: 32px;
  border-radius: 50%;
  font-weight: bold;
  vertical-align: center;
}
```
