---
title: "Individual transform properties"
date: "2023-06-14"
---

To apply transforms to an element, use the CSS transform Property. The property accepts one or more <transform-function>s which get applied one after the other.

```css
.target {
  transform: translateX(50%) rotate(30deg) scale(1.2);
}
```

One issue with this is that, if we want to update one of the properties then we have to update all of them. For example, if we want to change scale to 1.5 we need the following:

```css
.target:hover {
  transform: 
    translateX(50%)
    rotate(30deg)
    scale(2);
}
```

This is tedious and error-prone, particularly if you create many of these variations.

Chrome 104, Edge 104, Firefox 72 and Safari 14.1 provide an alternative syntax to write transforms where some of the transform functions can be split out into their own attributes.

We could write the original transformation like this:

```css
.target {
  translate: 50% 0;
  rotate: 30deg;
  scale: 1.2;
}
```

The hover declaration can also be simplified by only changing the declaration we need to, rather than all of them

```css
.target:hover {
  scale: 2;
}
```

There are a few caveats to using transform functions:

## Order Matters

The execution order for individual transform functionss is different than the order of execution inside a transform function.

Inside a transform function, the children execute from left to right.

The example below will execute in this order:

1. scale
2. translateX
3. rotate

```css
.target {
  transform
    scale(1.2) 
    translateX(50%)
    rotate(30deg)

}
```

The individual function equivalent will execute the functions in a fixed order, regardless of the order they appear in:

1. translate
2. rotate
3. scale

```css
.target {
  scale: 1.2;
  translate: 50% 0;
  rotate: 30deg:
}
```

See [how the transformation matrix should be calculated.](https://www.w3.org/TR/css-transforms-2/#ctm) for more information.

## Only a subset of transform functions work on their own

Only the `translate`, `rotate`, and `scale` transform functions will work independently.

This means that more complex animations will still requite the transform function.

See [Individual Transform Properties: the translate, scale, and rotate properties](https://drafts.csswg.org/css-transforms-2/#individual-transforms)

## The syntax for translate() is different

Since we don't have access to the axis-specific functions (translateX, translateY and translateZ), we use a three-parameter version of translate. Each value represents the x, y, and z axes.
