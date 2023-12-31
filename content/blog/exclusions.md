---
title: "Exclusions"
date: "2014-10-08"
categories:
  - "technology"
---

I'm sad to see the potential of exclusions not being used. No browser vendor supports the complete exclusion specification. IE 10+ is the one that comes the closes but doesn't support the full set of exclusion features.

This is the best we have (and yes, it still feels weird to say that IE is the best we have in terms of a web feature)

The idea of exclusions is complementary to that of shapes. As a matter of fact, there was only one specification addressing both shapes and exclusions but they were split in 2012, I guess to ease development of at least one of the sections of the specification.

The spec has two primary CSS attributes: `wrap-flow` and `wrap-through`.

## wrap-flow

Wrap-flow tells the browser how to wrap the content. One thing to notice is that instead of using left and right as attribute values it uses start and end to avoid confusions with right-to-left and top to bottom languages where the meaning of start and end is different.

I based each attribute definition on the how the [specification](http://www.w3.org/TR/css3-exclusions/) defines it.

* wrap-flow: auto;

This will **not** create an exclusion for floated elements. It has no effect on other, not floated, elements. This is the default value for `wrap-flow`

![exclusion_wrap_side_auto](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_auto)

* wrap-flow: both;

Flows content on both sides of the element

[![exclusion_wrap_side_both](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_both2.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_both2)

* wrap-flow: start;

Inline content can wrap on the start edge of the exclusion area (this would be the left edge for LTR languages.) It must leave the end edge clear

[![exclusion_wrap_side_left](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_left.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_left)

* wrap-flow: end;

Inline flow content can wrap on the end side of the exclusion area but must leave the area to the start edge of the exclusion area empty. This is the reverse of the start value.

[![exclusion_wrap_side_right](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_right.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_right)

* wrap-flow: maximum;

Inline flow content wraps on the side of the exclusion with the largest available space for the given line, and must leave the other side of the exclusion empty. The space can happen on either side of the content, as shown in the examples below:

\[caption id="attachment\_353541" align="aligncenter" width="427"\][![Example of wrap-flow: maximum wrapped from the left side](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_maximum_R.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_maximum_R.png) Example of wrap-flow: maximum wrapped from the right side\[/capt]

\[caption id="attachment\_353540" align="aligncenter" width="426"\][![Example of wrap-flow: maximum wrapped from the left side](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_maximum_L.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_maximum_L.png) Example of wrap-flow: maximum wrapped from the left side\[/capt]

* wrap-flow: clear;

Inline content flows top and bottom of the exclusion, leaving the start and end sides clear.

[![exclusion_wrap_side_clear](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_clear1.png)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/exclusion_wrap_side_clear1)

## wrap-through

This property controls whether content wraps around this particular element or not. According to the [specification](http://www.w3.org/TR/css3-exclusions/#wrap-through-property), if the value of the wrap-through property is to wrap:

> The element inherits its parent node's wrapping context. Its descendant inline content wraps around exclusions defined outside the element.

If the value is to none content will not wrap around the element

![Example of wrap-through exclusions](https://www.w3.org/TR/css3-exclusions/images/exclusion_wrap_through.png)

## Combination of exclusions and shapes

Examples taken from the [CSS WG use case wiki](https://wiki.csswg.org/ideas/css3-exclusions-use-cases)

One of the best things about exclusions is that they work almost intuitively with shapes as in the examples below. Note that because exclusions are a working draft, the syntax, is not finalized and, most likely, not be supported by your browser (even IE 10+)

I still chose to include the examples as an illustration of what, I hope, is to come

### Basic shaped exclusion example

[![csswg_exclusions_v1](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v1.jpg)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v1)

In a two column text frame we create a circle shape at the center and use the shape as an exclusion where we flow the content around both sides using `wrap-flow: both;`

### Padding and margins in exclusions

[![csswg_exclusions_v7](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v7.jpg)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v7)

### Adding background to a shaped exclusion

[![csswg_exclusions_v8](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v8.jpg)](http:https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/csswg_exclusions_v8)

## Tutorials and Examples

* [http://galjot.si/css-exclusions](http://galjot.si/css-exclusions)
* Sara Soueidan talks briefly about exclusions in her [shapes article](http://alistapart.com/article/css-shapes-101#section8)
