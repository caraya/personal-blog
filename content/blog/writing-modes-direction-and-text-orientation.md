---
title: Writing Modes, Direction and Text-Orientation
date: 2024-04-10
tags:
  - CSS
  - Design
  - Multilingual Web
---

The [Writing Modes](https://drafts.csswg.org/css-writing-modes-3/) specification reached full recommendation status almost 5 years ago. I've written about it before but I think it's time to revisit them again and see how they could be applied to design.

The three specific areas we'll cover in this post are:

* [direction](https://www.w3.org/TR/css-writing-modes-3/#direction)
* [writing-direction](https://www.w3.org/TR/css-writing-modes-3/#block-flow)
* [text-orientation](https://www.w3.org/TR/css-writing-modes-3/#text-orientation)

## Direction

The [direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction) CSS property is a complement to the HTML [dir](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir) attribute.

It allows you to set the global value of (when used in the root element) and change (when used in children elements) the direction of the text on the page.

The two possible values are `ltr` (for left to right) and `rtl` (for right to left) languages.

Most of the time you should use the HTML `dir` attribute in markup rather than the CSS attribute.

## Writing Direction

The writing-mode CSS property controls the direction lines of text are laid out, and the direction in which blocks progress.

CSS supports various international writing modes, such as:

* left-to-right (Latin languages)
* right-to-left (Hebrew or Arabic)
* bidirectional (mixed Latin and Arabic)
* vertical (Asian scripts).

Writing systems typically have one or two native writing modes:

| Language System | Inline direction | Block direction |
| --- | --- | --- |
|Latin-based | left-to-right | top-to-bottom |
|Arabic-based | right-to-left | top-to-bottom |
| Mongolian-based | top-to-bottom |left-to-right |
| Han-based | left-to-right | top-to-bottom |
| ^^ | top-to-bottom |right-to-left |

Many magazines and newspapers will mix these two writing modes on the same page where it's useful.

Figures 1 and 2 show the BBC News website in English (Figure 1) and localized in Arabic (Figure 2).

![English version of the BBC News website](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/writing-modes-02.png)

![Arabic version of the BBC News website](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/writing-modes-01.png)

The Japanese magazine in Figure 3 uses both horizontal text for the author's biography and vertical text for the body of the article.

![Japanese website that uses both vertical and horizontal text](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1699047122/voguejppage.jpg)

### Defining writing modes

A `horizontal writing` mode is one with horizontal lines of text, i.e. a downward or upward block flow.

A vertical writing mode is one with vertical lines of text, i.e. a leftward or rightward block flow.

The allowed values for the property are:

horizontal-tb (default)
: For ltr scripts, content flows horizontally from left to right.
: For rtl scripts, content flows horizontally from right to left. The next horizontal line is positioned below the previous line.

vertical-rl
: For ltr scripts, content flows vertically from top to bottom, and the next vertical line is positioned to the left of the previous line
: For rtl scripts, content flows vertically from bottom to top, and the next vertical line is positioned to the right of the previous line

vertical-lr
: For ltr scripts, content flows vertically from top to bottom, and the next vertical line is positioned to the right of the previous line
: For rtl scripts, content flows vertically from bottom to top, and the next vertical line is positioned to the left of the previous line.

sideways-rl (only supported in Firefox)
: For ltr scripts, content flows vertically from top to bottom
: For rtl scripts, content flows vertically from bottom to top. All the glyphs, even those in vertical scripts, are set sideways toward the right.

sideways-lr (only supported in Firefox)
: For ltr scripts, content flows vertically from bottom to top
: For rtl scripts, content flows vertically from top to bottom. All the glyphs, even those in vertical scripts, are set sideways toward the left.

My favorite way to use vertical text is to move the text sideways and place it alongside vertical text.

The first example places a vertical header to the left of the body text.

<iframe
	height="574.66845703125" style="width: 100%;" scrolling="no" title="vertical writing mode and text orientation" src="https://codepen.io/caraya/embed/xxepZBE?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/xxepZBE">
  vertical writing mode and text orientation</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

You can use Flexbox to change the placement of image captions for figures. In this example, we've placed the caption to the right of the image inside the figure element.

<iframe
	height="655.4374389648438" style="width: 100%;" scrolling="no" title="figure captions and vertical alignment" src="https://codepen.io/caraya/embed/xxepQym?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/xxepQym">
  figure captions and vertical alignment</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Rotating The Vertical Text

`text-orientation` only works when the writing mode is vertical. It controls what happens with horizontal characters when mixed with vertical text.

As shown in the figure below, the default is to rotate the horizontal text 90 degrees so it'll appear sideways.

![Mixed right-to-left vertical and horizontal text](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1587718304/publishing-project.rivendellweb.net/vertical-layouts.png)

When working with all-horizontal text, using `text-orientation` will not have any effect.

The `writing-mode` property will still dictate how the text is laid out and how the boxes flow. This means that the margin properties (whether physical or logical) change too.

We can also use transform properties to change the position of the text.

<iframe
	height="652.341796875" style="width: 100%;" scrolling="no" title="Vertical text and rotated text in figure captions" src="https://codepen.io/caraya/embed/RwOxEoG?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/RwOxEoG">
  Vertical text and rotated text in figure captions</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Links and Resources

* W3C Specs
  * [CSS Writing Modes Level 3](https://www.w3.org/TR/css-writing-modes-3/)
  * [CSS Writing Modes Level 4](https://www.w3.org/TR/css-writing-modes-4/)
* MDN
  * [direction](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  * [writing-mode](https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode)
  * [text-orientation](https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation)
