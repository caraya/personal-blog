---
title: "Playing with border radius"
date: "2023-03-08"
---

The most frequent uses of border-radius I see are to make images round without modifying the image.

```css
.circle-radius {
  border-radius: 50%;
}
```

or to round the corners of a rectangular box.

```css
.round-corners {
  border-radius: 20px;
}
```

But there is more that you can do with border-radius.

The shorthand property can take one to four values that will produce different results.

If we provide one value for `border-radius` then all border radius elements will have the same value.

```css
.example {
  border-radius: 15px;
}

/* equivalent individual attributes */
.example {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px; 
  border-bottom-right-radius: 15px;
  border-bottom-left-radius: 15px
}
```

When you use two values, the first one is assigned to the `top-left` and `bottom-right` corners. The second value is applied to the `top-right` and `bottom-left`

```css
.example {
  border-radius: 10px 5%;
}

/* equivalent individual attributes */
.example {
  border-top-left-radius: 10px;
  border-top-right-radius: 5%; 
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 5%;
}
```

When using three values the assignment gets more complicated.

The first value gets assigned to the `top-left` corner.

The second value gets assigned to both the `top-right` and `bottom-left` corners.

The third, and last, value gets assigned to the `bottom-right` corner.

```css
.example {
  border-radius: 2px 4px 6px;
}

/* equivalent individual attributes */
.example {
  border-top-left-radius: 2px;
  border-top-right-radius: 4px; 
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 4px;
}
```

When using four values, each value references one corner.

Unlike margins, the values are read clockwise from the top left. So the values get passed in this order:

- top-left
- top-right
- bottom-right
- bottom-left

```css
.sample-borders {
  border-radius: 10px 20px 30px 50px
}

/* equivalent individual attributes */
.example {
  border-top-left-radius: 10px;
  border-top-right-radius: 20px; 
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 40px;
}
```

## Uneven radius

In addition to the sets we saw in the last section, we can add a little more complexity.

Each individual border-radius can take two values, representing the width and height of the radius itself.

When using a single value, both width and height are the same.

When using two values, the first value is the radius in the horizontal direction, the second is in the vertical direction.

To use these two-digit values for `border-radius` we separate the horizontal radii for each value and then the vertical radii for each element present.

```css
.example {
  border-radius: 10px / 20px;
}
```

```css
.example {
  border-radius: 10px 5% / 20px 30px;
}
```

```css
border-radius: 10px 5px 2em / 20px 25px 30%;
```

```css
border-radius: 10px 5% / 20px 25em 30px 35em;
```

We don’t have to set every radius in the shorthand. The shorthand in this example is equivalent to setting all of the vertical radii to 50%, while alternately setting the horizontal radii to 5rem and 2rem respectively.

```css
/* Shorthand */
.example {
  border-radius: 5rem 2rem / 50%;
}

/* Equivalent to: */
.example {
  border-top-left-radius: 5rem 50%;
  border-top-right-radius: 2rem 50%;
  border-bottom-right-radius: 5rem 50%;
  border-bottom-left-radius: 2rem 50%;
}
```

## Logical properties and border-radius

Borders have logical properties to address changes related to writing mode and right-to-left languages.

So we could use logical properties in our borders, like this

```css
.example {
  border-top-left-radius: 5rem 50%;
  border-top-right-radius: 2rem 50%;
  border-bottom-right-radius: 5rem 50%;
  border-bottom-left-radius: 2rem 50%;
}


/*
These are the equivalent logical properties in longhand form */
.example {
  border-start-start-radius: 2rem 50%;
  border-start-end-radius: 5rem 50%;
  border-end-start-radius: 2rem 50%;
  border-end-end-radius: 5rem 50%;
}
```

The following table provides a list of physical and logical values for border-radius attributes based on their location.

| Location | Physical Property | Logical Proerty |
| --- | --- | --- |
| Top Left | border-top-left-radius | border-start-start-radius |
| Top Right | border-top-right-radius | border-start-end-radius |
| Bottom Left | border-bottom-left-radius | border-end-start-radius |
| Bottom Right | border-bottom-right-radius | border-end-end-radius |

Yes, the logical property names are harder to remember than the physical ones and they may not always be necessary, but it is nice to have them when we do.
