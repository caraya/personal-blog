---
title: "Code Defensive CSS"
date: "2023-06-07"
---

One of the things I've always appreciated learning about writing Javascript is to code defensively.

Defensive coding (or defensive programming),is **the practice of eliminating assumptions in the code, especially when it comes to handling information in and out of other routines**.

[Write Better CSS By Borrowing Ideas From JavaScript Functions](https://www.smashingmagazine.com/2023/04/write-better-css-borrow-ideas-javascript-functions/) provides ideas and solutions for writing defensive CSS.

I'm starting from a different place.

How can we reduce code repetition and how can we keep ourselves honest when writing CSS?

I will use the [CSS Properties and Values Level 1 API](https://drafts.css-houdini.org/css-properties-values-api/) (Houdini CSS Variables) as an example of how we can code defensively. We will also discuss other defensive strategies.

## Using Houdini CSS Variables

When they were first introduced into browsers, you could only define custom properties in Javascript:

```js
CSS.registerProperty({
  name: '--colorPrimary',
  syntax: '<color>',
  initialValue: 'lab(33% 70.91 41.19)',
  inherits: false
});
```

As of Chromium 85, you can now declare Houdini CSS Properties directly in CSS using the `@property` at-rule.

```css
@property --colorPrimary {
  syntax: '<color>';
  initial-value: lab(33% 70.91 41.19);
  inherits: false;
}
```

Browser support is almost there. The only big browser that doesn't support Houdini CSS Variablesn is Firefox. The post will consider this when addressing fallbacks.

## Defensive Coding with Houdini Variables

This is what a Houdini CSS property definition using the `@property` at-rule looks like:

```css
@property --colorPrimary {
  syntax: '<color>';
  initial-value: magenta;
  inherits: false;
}
```

Out of the box, the definition addresses many of my defensive coding requirements:

The `syntax` attribute keeps you honest and helps you remember what you wanted to use the variable for. This will also help you pass the "you in six months test" (will you remember what you wanted to do with the property six months from now?)

The list of valid syntax values is in the [CSS Properties and Values API Level 1](https://drafts.css-houdini.org/css-properties-values-api/) specification.

You can control whether the property inherits or not.

You can assign an initial value to the property so that you can use it without an explicit value.

So how does this help us to write our CSS with defense in mind.

Having a defined syntax keeps us honest. Both when writing the properties, when using it and when looking at the stylesheet six months from now, I will know what I meant to do.

Having the choice to propagate the property value down the tree prevents leakage. There may be times when we don't want to inherit and have to override the property on every element down the tree.

Finally, providing a default value makes sure that the property will work even if you forget to put a value in the base property.

We fist define the `--colorPrimary` variable.

```css
@property --colorPrimary {
  syntax: '<color>';
  initial-value: lab(33% 70.91 41.19);
  inherits: false;
}
```

`.item1` overrides the property and uses the overide as the background color

```css
.item1 {
  --colorPrimary: #663399;
  background: var(--colorPrimary);
}
```

`.item2` and `.item3` are functionally identical. When you don't include the varaiable definition or you provide a value of the wrong syntax, the browser will use the `initial-value` we defined for the property.

Because of this the two rules will output the same color.

```css
.item2 {
  background: var(--colorPrimary);
}

.item3 {
  --colorPrimary: 20px;
  background: var(--colorPrimary);
}
```

Finally, because we chose not to make the property inherit, we save ourselves from a very tricky type of errors.

`.item4` defines a new value for `--colorPrimary`.

`.item4-inner` doesn't redefine `--colorPrimary`. Because we set `inherit` to false, the color will not inherit down to the child and, because we didn't put a `--colorPrimary` override, it will take the initial value for the color.

```css
.item4 {
  --colorPrimary: lab(11.16 0.04 -24.11);
  background: var(--colorPrimary);
}

.item4-inner {
  width: 100px;
  height: 100px;

  background: var(--colorPrimary)
}
```

We could do something similar with measurements, like box `--boxWidth` and `--box-height`.

```css
@property --boxWidth {
  syntax: '<length-percentage>';
  initial-value: 300px;
  inherits: false;
}

@property --boxHeight {
  syntax: '<length-percentage>';
  initial-value: 300px;
  inherits: false;
}
```

Each of these `@property` declarations defines the height and the width of the object they are assigned to.

Using the [length-percentage](https://developer.mozilla.org/en-US/docs/Web/CSS/length-percentage)data type gives us flexibility since it allows both lengths (20px, 5rem), percentages, and [calc](https://developer.mozilla.org/en-US/docs/Web/CSS/calc) functions that use length, percentages or combinations of the two.

Because we defined height and width independent from each other we can choose not to override them, override one or both of them.

`.item1` use the default values for height and width.

```css
.item1 {
  height: var(--boxHeight);
  width: var(--boxWidth);
}
```

`.item2` and `.item3` redefine a single dimension property.

```css
.item2 {
  --boxWidth: 60vw;
  height: var(--boxHeight);
  width: var(--boxWidth);
}

.item3 {
  --boxHeight: 40vh;
  height: var(--boxHeight);
  width: var(--boxWidth);
}
```

The final example redefines both properties.

```css
.item4 {
  --boxWidth: 800px;
  --boxHeight: 600px;
  height: var(--boxHeight);
  width: var(--boxWidth);
}
```

These two examples show how we can leverage custom properties defined with the `@property` at-rule to provide sensible defaults and make it easier to work with these properties.

The code for the boxes examples is shown in the Codepen below:

<iframe height="1059.2252197265625" style="width: 100%;" scrolling="no" title="Defensive CSS with @property (1)" src="https://codepen.io/caraya/embed/qBJyOZr?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/qBJyOZr"> Defensive CSS with @property (1)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>

The code for box dimension is shown below

<iframe height="641.8716430664062" style="width: 100%;" scrolling="no" title="Defensive CSS with @property (2)" src="https://codepen.io/caraya/embed/xxyJZGW?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/caraya/pen/xxyJZGW"> Defensive CSS with @property (2)</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>) on <a href="https://codepen.io">CodePen</a>. </iframe>
