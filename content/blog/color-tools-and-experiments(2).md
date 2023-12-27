---
title: Color tools and experiments(2) - contrast checker
date: 2024-06-30
draft: true
---

## WCAG 2.1 contrast

The [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG22/) provide a set of [contrast requirements](https://webaim.org/articles/contrast/) that we can measure to see if the contrast meets the requirements or not.

The second tool I created evaluates these contrast levels and checks them against preset values.

The post will discuss the tool, not the WCAG algorithm and it's shortcomings, and there are many shortcomings to the algorithm.

## The values we're testing for

We will concentrate on two levels of conformance: AA and AAA.

**WCAG AA level** provides an acceptable level of accessibility and is the level required by most governments's accessibility standards based on WCAG.

**WCAG AAA level** is an *optimal compliance* level with enhanced requirements that would make the content accessible to the widest audience possible.

Within these two levels there are further distinctions: for body text and larger/heading text.

| Conformance | Elements | Value |
| --- | --- | --- |
| AA | text and images of text | 4.5:1 |
| AA |  Large-scale text and images of large-scale | 3:1 |
| AAA | Text and images of text | 7:1 |
| AAA | Large-scale text and images of large-scale text | 4.5:1 |

See the following Criteria from WCAG: [Success Criterion 1.4.3 Contrast (Minimum)](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [Success Criterion 1.4.6 Contrast (Enhanced)](https://www.w3.org/TR/WCAG22/#contrast-enhanced). These are the values that we'll work with.

## The code

The first step is to import all the methods we will need from Color.js.

```js
import {
  to as convert,
  serialize,
  ColorSpace,
  sRGB,
  P3,
  Lab,
  OKLab,
  OKLCH,
  HWB,
  HSL,
} from "colorjs.io/fn";

import Color from "colorjs.io";
```

The next step is to register the color spaces that we want to use. The `sRGB` color space will also handle hexadecimal (#ffff) and named (white) colors.

```js
ColorSpace.register(sRGB);
ColorSpace.register(P3);
ColorSpace.register(Lab);
ColorSpace.register(OKLab);
ColorSpace.register(OKLCH);
ColorSpace.register(HWB);
ColorSpace.register(HSL);
```

Next, we create a container div and use [setAttribute](https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute) to set individual attributes.

We then use `appendChild` to add the container. If we were just adding class attributes, then `classList` would be enough to meet our needs but we're also adding an ID.

```js
const container = document.createElement('div')
container.setAttribute('id', 'container')
container.setAttribute('class', 'container')
document.body.appendChild(container)
```

The first WCAG-specific function will calculate the constrast between two colors.

1. We first convert the foreground and background colors to `sRGB`
2. Next, we calculate the contrast between the foreground and backgrouns colors
3. We return the constrast value to use elsewhere in the code.

```js
function calculateContrast (fgColor, bgColor, contrastAlgo) {

  // 1
  const foreground = new Color(serialize(convert(fgColor, 'sRGB')))
  const background = new Color(serialize(convert(bgColor, 'sRGB')))

  // 2
  const contrast = foreground.contrast(background, `${contrastAlgo}`)
  console.log(`The ${contrastAlgo} value is ${contrast}`)

  // 3
  return contrast
}
```

There's another contrast family of specification for APCA, to be the contrast algorithm for WCAG 3.0.

It is not finalized and the requirements are significantly harder than WCAG so it'll take more work to create an evaluation tool.

