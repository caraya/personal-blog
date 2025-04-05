---
title: HTML range inputs
date: 2025-04-14
tags:
  - HTML
  - Forms
  - Select
---

A lot of times we think of HTML as a static, inflexible, language. But there are many things you can do with HTML that are not obvious unless you look for them.

This post will look at two specific things you can do with HTML range inputs: adding tickmarks and a live value display.

## Range inputs with ticks (datalist)

When using a range input on its own, you specify a minimum and maximum value, and the user can select any value in between.

```html
<input type="range" min="1" max="7" />
```

As you can see below, on its own, the range input is not very informative. It doesn't provide cues as to what the values are, and it doesn't provide any visual indication of the value selected.

<figure>
	<input type="range" min="1" max="7" />
	<figcaption>Range input without ticks</figcaption>
</figure>

Supplying a [datalist](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) to a range input does two things:

* It renders tickmarks at each value step
* It clamp the input value to one of the datalist options

With the datalist, the user knows what value they've selected, similar to what you can do with the `step` attribute, but with an added visual cue.

```html
<input type="range" min="1" max="7" list="steps" />

<datalist id="steps">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
  <option>6</option>
  <option>7</option>
</datalist>
```

<figure>

<input type="range" min="1" max="7" list="steps" />

<datalist id="steps">
  <option>1</option>
  <option>2</option>
  <option>3</option>
  <option>4</option>
  <option>5</option>
  <option>6</option>
  <option>7</option>
</datalist>
<figcaption>Range input with ticks using a <code>datalist</code></figcaption>
</figure>

## Range inputs with live value display

Most of the examples I see of range inputs displaying the value on the page are done with external Javascript. But you can also do this with just a little inline Javascript in the `oninput` attribute.

```html
<input
  type="range"
  value="50"
  min="1"
  max="100"
  oninput="this.nextElementSibling.value = this.value"
/>
<output>50</output>
```

the `oninput` attribute fires when the value of the input changes. In this example, we set the value of the next sibling element (the `<output>` element) to the value of the range input.

This way, the user can see what value they have selected.

<figure>
	<input
		type="range"
		value="50"
		min="1"
		max="100"
		oninput="this.nextElementSibling.value = this.value"
	/>
	<output>50</output>
	<figcaption>Range input with live value display</figcaption>
</figure>

I would only recommend this solution when all you need is a simple value display. If you need more complex functionality, you should use an external script... there are limits to laziness :-).
