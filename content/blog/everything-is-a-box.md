---
title: Everything is a box
date: "2024-06-30"
tags:
  - CSS
  - Design
youtube: true
draft: true
---

One way of thinking about HTML and web content is to think about boxes, multiple boxes surrounding your content. You can see these nested boxes in your browser's Dev Tools as shown in figure 1.

![CSS Box Model](https://res.cloudinary.com/dfh6ihzvj/images/v1698731828/publishing-project.rivendellweb.net/box-model-2/box-model-2.png?_i=AA)

Starting from the inside, the boxes are:

content box
: The area that the content lives in.
: If the [box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) property is set to `content-box` and the element is a block element, the content area's size can be explicitly defined with the following properties:
: * [width](https://developer.mozilla.org/en-US/docs/Web/CSS/width)
: * [min-width](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)
: * [max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)
: * [height](https://developer.mozilla.org/en-US/docs/Web/CSS/height)
: * [min-height](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)
: * [max-height](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)

padding box
: surrounds the content box and is the space created with the padding properties:
: * [padding-top](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)
: * [padding-right](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)
: * [padding-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)
: * [padding-left](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)
: * The [padding](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) shorthand property
: Since the padding is inside the box, the background of the box will be visible in the space that it creates.
: If the box has overflow rules set, such as overflow: auto or overflow: scroll, the scrollbars will occupy this space too.

border box
: The border box represents the bounds of your box and the border edge is the limit of what you can see.
: You can control the borders of your content with these properties:
: * [border-top](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top)
: * [border-right](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right)
: * [border-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom)
: * [border-right](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right)
: * The [border](https://developer.mozilla.org/en-US/docs/Web/CSS/border) shorthand property

margin box
: is the outermost box around your content.
: Properties such as outline and box-shadow occupy this space too because they are painted on top, so they don't affect the size of our box.
: You can control margins with these properties:
: * [margin-top](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)
: * [margin-right](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)
: * [margin-bottom](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)
: * [margin-left](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left)
: * The [margin](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) shorthand

## Calculating Content Size

Calculating the size of the content in CSS is tricky.

By default in the CSS box model, the width and height assigned to an element are applied to the element's content box and will not consider any padding or margins. Any padding or margin will be added to the content width and will make the resulting element wider than what we intended

This means that when you set width and height, you have to adjust the value you give to allow for any border or padding that may be added.

For example, if you have four boxes with `width: 25%;`, if any has left or right padding or a left or right border, they will not by default fit on one line within the constraints of the parent container.

I've created an explainer in Codepen to illustrate the different values

The box-sizing property can be used to adjust this behavior:

* **content-box** (default behavior)
  * If you set an element's width to 100 pixels, then the element's content box will be 100 pixels wide, and the width of any border or padding will be added to the final rendered width, making the element wider than 100px
* **border-box** tells the browser to account for any border and padding in the values you specify for an element's width and height
  * If you set an element's width to 100 pixels, that 100 pixels will include any border or padding you added, and the content box will shrink to absorb that extra width. This typically makes it much easier to size elements.
  * `box-sizing: border-box` is the default styling that browsers use for the &lt;table>, &lt;select>, and &lt;button> elements, and for &lt;input> elements whose type is radio, checkbox, reset, button, submit, color, or search.

The following Pen explains the differences between the box-sizing values.

<iframe
	height="974.0311279296875" style="width: 100%;" scrolling="no" title="box sizing" src="https://codepen.io/caraya/embed/vYMeqYB?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/vYMeqYB">
  box sizing</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Intrinsic Versus Extrinsic Sizing

The next question is how CSS measures the size of a box. CSS has two ways to measure the size of content: intrinsic and extrinsic:

The intrinsic size of an element is the size it would be based on its content if no external factors were applied to it.

For example, when we use the following `figure` + `image` + `figcaption` combination, we rely on the size of the image as it is.

The width of the `figcaption` element is 100% of the width of the parent. Since we didn't set up dimensions for the `figure`, it will take 100% of the width of the parent container.

```html
<figure>
	<img src="img/santiago-landscape.avif"
	alt="image of Santiago landscape">
	<figcaption>image of Santiago landscape</figcaption>
</figure>
```

The extrinsic size of an element is the size when we add specific dimensions to the element we're sizing.

Using extrinsic sizing for the figure and image would look like this:

```html
<figure>
	<img src="img/santiago-landscape.avif"
	height="600"
	width="800"
	alt="image of Santiago landscape">
	<figcaption>image of Santiago landscape</figcaption>
</figure>
```

In [Intrinsic Sizing In CSS](https://ishadeed.com/article/intrinsic-sizing-in-css/) Ahmad Shadeed discusses intrinsic and extrinsic sizing and goes into details on the intrinsic sizing units.

## Flow and Block Directions

## Display Values And Their Impact On Content

The display CSS property sets whether an element is treated as a `block` or `inline` box and the layout used for its children, such as flow layout, grid or flex.

Formally, the display property sets an element's inner and outer display types. The outer type sets an element's participation in the flow layout; the inner type sets the layout of its children.

As far as boxes are concerned

## Writing Modes

## Logical Styles

## Links And Resources

* [Introduction to the CSS basic box model](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model) &mdash; MDN
* [Box Model](https://web.dev/learn/css/box-model) &mdash; web.dev
* [The box model and box sizing](https://piccalil.li/blog/the-box-model-and-box-sizing/) &mdash; piccalil.li
* [Boxes](https://every-layout.dev/rudiments/boxes/) &mdash; Every Layout
* [box sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) &mdash; MDN
* [A Simple Introduction to Intrinsic Web Design](https://www.webdesignerdepot.com/2018/05/a-simple-introduction-to-intrinsic-web-design/)
* [A Sneak Peek At Intrinsic Web Design](https://medium.com/level-up-web/a-sneak-peek-at-intrinsic-web-design-cb179eea7c9e)
* [Styling the Intrinsic Web](https://www.miriamsuzanne.com/speaking/intrinsic-web/)
* [Contextual Spacing For Intrinsic Web Design](https://moderncss.dev/contextual-spacing-for-intrinsic-web-design/)
* [Intrisic Size](https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size) &mdash; MDN
* [Intrinsic Sizing In CSS](https://ishadeed.com/article/intrinsic-sizing-in-css/)
* [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css) Default Styles
* [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css) Default Styles
* [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css) Default Styles
* [Display](https://developer.mozilla.org/en-US/docs/Web/CSS/display) &mdash; MDN
