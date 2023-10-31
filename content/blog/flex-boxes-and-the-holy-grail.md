---
title: "Flex Boxes and the Holy Grail"
date: "2014-03-20"
categories:
  - "technology"
---

> There is an updated post [New in the CSS horizon: flexbox](https://publishing-project.rivendellweb.net/new-in-the-css-horizon-css-flexbox/) to be published shortly with updated code and better explanations. I refer you to that article for an update on how Flexbox works and better (and fully tested) working examples.



> Content and images taken from [Mozilla Developer Network Flexbox Page](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes) and [A Complete Guide to Flexbox](http://css-tricks.com/snippets/css/a-guide-to-flexbox/)

One of the hardest things to do in web design is to create a fluid 3 column layout, also known as the holy grail. I could talk for hours about how it was goo enough for the technologies available when the model was first developed, how much of a pain it is to implement correctly, how it did not support mobile and small form devices and how long have developers wanted a solution.

\[caption id="attachment\_153542" align="aligncenter" width="700"\][![Example of Holy Grail Layout](/images/2014/03/litesite-template.jpg)](http:/images/2014/03/litesite-template.jpg) Example of Holy Grail Layout. Courtesy of [Litesite](http://litesite.org/?pg=en/holy-grail-layout-intro)\[/caption\]

Instead I will talk about a solution that has finally become widely available. With the release of Firefox 28 to wide availability, the last of the big 4 browsers now supportd the full flexible box layouts specificactions. This means we can do some awesome crazy things with layouts that, until now we could only dream about.

In this article I will explain what Flexboxes are, the terminology, syntax, new CSS required to make it work and end with reworking the Holy Grail Layout using Flexboxes.

## Getting things setup

Flexboxes don't use the same terminology as other CSS elements. We need to discuss this terminology before we can fully understand and use the new layout in our own work.

### Flex Container

The outermost container for our Flex Layout. We create this by assigning `flex` or `inline-flex` as the values of the display property depending on whether you want to use the Flex Container as a block or inline element.

```css
.flex-container {
  display: flex
  /*  If you want the container to be a block element*/
}
```

or

```css
.container {
  display: inline-flex
  /*  If you want the container to be an inline element*/
}
```

Each Flex Box container defines two axes:

- A **main axis** that defines how the elements flow in the container
- A **cross axis** that is perpendicular to the main

#### flex-direction

The flex-direction attribute defines the main axis (start, direction, end) for the container. It can take one of 4 values:

- **row**: The flex container's main-axis is defined to be the same as the text direction. The elements in the container flow in the same direction as the page content (left to right in the case of English)
- **row-reverse**: The flex container's main-axis is defined to be the same as the text direction. The elements in the container flow in the opposite direction to the page content (right to left in the case of English)
- **column**: The flex container's main-axis is defined to be the same as the block-axis. The main-start and main-end points are the same as the before and after points of the writing-mode (top to bottom in English)
- **column-reverse**: The flex container's main-axis is defined to be the same as the block-axis. The main-start and main-end points are reversed from the before and after points of the writing-mode (bottom to top in English)

```css
.content {
  flex-direction: row;
}
```

#### flex-wrap

- **nowrap** (default): single-line / left to right in ltr; right to left in rtl
- **wrap**: multi-line / left to right in ltr; right to left in rtl
- **wrap-reverse**: multi-line / right to left in ltr; left to right in rtl

```css
.content {
  flex-direction: row;
  flex-wrap: wrap;
}
```

#### flex-flow

This is a shortcut for flex-direction and flex-wrap which together define both the main and cross axes. The default value is:

```css
.container {
  flex-flow: "row nowrap"
}
```

#### justify-content

Justify content takes a special meaning when used in flex boxes: It tells the browser how to arrange the content of the container in its main axis. It can take the following values:

- flex-start (default): items are packed toward the start line
- flex-end: items are packed toward to end line
- center: items are centered along the line
- space-between: items are evenly distributed in the line; first item is on the start line, last item on the end line
- space-around: items are evenly distributed in the line with equal space around them

```css
.content {
  flex-direction: row;
  justify-content: space-around;
}
```

#### align-items

align-items controls the vertical positioning of the row's element. It is the vertical counterpart to align-items. It can take the following values:

- flex-start: cross-start margin edge of the items is placed on the cross-start line
- flex-end: cross-end margin edge of the items is placed on the cross-end line
- center: items are centered in the cross-axis
- baseline: items are aligned such as their baselines align
- stretch (default): stretch to fill the container (still respect min-width/max-width)

#### align-content

Controls the use of the rermaining vertical space within a flex-container's row. This has no effect if there is only one row on the

- flex-start: lines packed to the start of the container
- flex-end: lines packed to the end of the container
- center: lines packed to the center of the container
- space-between: lines evenly distributed; the first line is at the start of the container while the last one is at the end
- space-around: lines evenly distributed with equal space between them
- stretch (default): lines stretch to take up the remaining space

### Flex Item

Every element inside our Flex Container becomes a Flex Item. When we put text on the page as a direct child of the Flex Box it'll be wrapped on an implicit flex item. There is no need to declare these elements explicitly.

#### order

Indicates the order (positive numbers without a unit) in which the items in a row are displayed. The default is to display them in source order.

```css
.content-item1{
  order: 1;
}
```

#### flex-grow

Indicates the proportion that an item can grow by if necessary.

If all items have flex-grow set to 1, every child will set to an equal size inside the container. If you were to give one of the children a value of 2, that child would take up twice as much space as the others.

In the example below, item2 will take twice as much space as item1 and item3 if more space becomes available:

```css
#item1 {
  grow: 1;
}
#item2{
  grow: 2;
}

#item3{
  grow: 1;
}
```

#### flex-shrink

Indicates the proportion that an item can shrink by if necessary.

If all items have flex-shrink set to 1, every child will set to an equal size inside the container. If you were to give one of the children a value of 2, that child would take up twice as much space as the others.

#### flex-basis

This defines the default size of an element before the remaining space is distributed.

Supported values:

- length
- auto

The default is auto

#### flex

This is the shorthand for flex-grow, flex-shrink and flex-basis. The flex-shrink and flex-basis parameters are optional.

Default is 0 1 auto.

#### align-self

If this property is set, it will override the align-item property of the parent.

- flex-start: cross-start margin edge of the items is placed on the cross-start line
- flex-end: cross-end margin edge of the items is placed on the cross-end line
- center: items are centered in the cross-axis
- baseline: items are aligned such as their baselines align
- stretch (default): stretch to fill the container (still respect min-width/max-width)

## The Holy Grail with Flex Boxes

Working example in Codepen:

\[codepen\_embed height="378" theme\_id="2039" slug\_hash="kviam" default\_tab="result"\]See the Pen [First Attempt at Flexbox](http://codepen.io/caraya/pen/kviam/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

There is an updated Codepen with better results all around, including the fact that you get equal columns for free :-)

The pen is copied below. Edit the pen in Codepen to see the full layout.

\[codepen\_embed height="266" theme\_id="2039" slug\_hash="ojmgEP" default\_tab="result" user="caraya"\]See the Pen [Holy Grail Layout using Flexbox](http://codepen.io/caraya/pen/ojmgEP/) by Carlos Araya ([@caraya](http://codepen.io/caraya)) on [CodePen](http://codepen.io).\[/codepen\_embed\]

## Browser compatibility

Taken from [Mozilla Developer Network Flexbox Page](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Flexible_boxes)

### Desktop Browsers

| Feature | Firefox (Gecko) | Chrome | Internet Explorer | Opera | Safari |
| --- | --- | --- | --- | --- | --- |
| Basic support (single-line flexbox) | 18.0 (18.0)\-moz(Behind a pref) \[2\]
22.0 (22.0) \[2\] | 21.0\-webkit
29.0 | 11 \[3\] | 12.10
15-19 \-webkit | 6.1\-webkit \[1\] |
| Multi-line flexbox | 28.0 (28.0) | 21.0\-webkit
29.0 | 11 \[3\] | 12.10
15-19 \-webkit | 6.1\-webkit \[1\] |

### Mobile Browsers

| Feature | Firefox Mobile (Gecko) | Android | IE Phone | Opera Mobile | Safari Mobile |
| --- | --- | --- | --- | --- | --- |
| Basic support (single-line flexbox) | 18.0 (18.0)\-moz(Behind a pref) \[2\]
22.0 (22.0) \[2\] | ? | ? | 15-19 \-webkit | 7\-webkit \[1\] |
| Multi-line flexbox | 28.0 (28.0) | ? | ? | 15-19 \-webkit | 7\-webkit \[1\] |

1

### Notes

\[1\] Safari up to 6.0 ( 6.1 for iOS ) supported an old incompatible draft version of the specification. Safari 6.1( 7 for iOS ) has been updated to support the final version

\[2\] Up to Firefox 22, to activate flexbox support, the user has to change the about:config preference "layout.css.flexbox.enabled" to `true`. From Firefox 22 to Firefox 27, the preference is `true` by default, but the preference has been removed in Firefox 28

\[3\] Internet Explorer 10 supports an old incompatible draft version of the specification; Internet Explorer 11 [has been updated](http://msdn.microsoft.com/en-us/library/ie/dn265027%28v=vs.85%29.aspx) to support the final version.
