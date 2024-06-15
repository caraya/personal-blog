---
title: Creating a CSS Reset
date: 2024-06-26
tags:
  - CSS
  - Tools
---

CSS Resets have been around for a while and they have evolved along with CSS and browser support.

The notion of a CSS reset first came around with `undoHTML.css` by Tantek Celik in 2004 and it does what it says; it undoes many of the CSS defaults in browsers so you have a clean beginning for your own work.

```css
:link,:visited { text-decoration:none }

ul,ol { list-style:none }

h1,h2,h3,h4,h5,h6,pre,code { font-size:1em; }

ul,ol,li,h1,h2,h3,h4,h5,h6,pre,form,body,html,p,
blockquote,fieldset,input { margin:0; padding:0 }

a img,:link img,:visited img { border:none }

address { font-style:normal }
```

In 2005, Farouk Ates created [initial.css](http://web.archive.org/web/20050930205005/http:/kurafire.net/log/archive/2005/07/26/starting-css-revisited) as groupings of styles that he's found useful in the past.

His reset included:

* Setting the `html`, `body`, `form`, `fieldset` elements to have zero margins and padding, and their fonts to 100%/120% and a Verdana-based sans-serif font stack
* Setting the `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `pre`, `blockquote`, `ul`, `ol`, `dl`, `address` elements to have a 1em vertical margin, no horizontal margin, and no padding
* Giving a 1em left margin to the `li`, `dd`, `blockquote` elements
* Setting the form label cursor to pointer
* Setting the `fieldset` border to none
* Setting the `input`, `select`, `textarea` font sizes to 100%

```css
/*
=INITIAL v2.1, by Faruk Ates - www.kurafire.net
Addendum by Robert Nyman - www.robertnyman.com */

html, body, form, fieldset {
	margin: 0;
	padding: 0;
	font: 100%/120%
		Verdana,
		Arial,
		Helvetica,
		sans-serif;
}

h1, h2, h3, h4, h5, h6,
p, pre, blockquote,
ul, ol, dl, address {
	margin: 1em 0;
	padding: 0;
}

li, dd, blockquote {
	margin-left: 1em;
}

form label {
	cursor: pointer;
}

fieldset {
	border: none;
}

input, select, textarea {
	font-size: 100%;
}
```

The next big reset was created by Nate Koechley, the YUI senior frontend engineer, and Matt Sweeney from the Yahoo UI (YUI) team as part of their larger [Yahoo UI Library (YUI)](https://en.wikipedia.org/wiki/YUI_Library) (discontinued in 2014).

The reset:

* Removes margins and padding from most HTML elements
* Removes the borders from images
* Removes the markers (bullets or numbers) from lists
* Sets all headings to the same size

```css
body,div,dl,dt,dd,ul,ol,li,
h1,h2,h3,h4,h5,h6,pre,
form,fieldset,input,textarea,
p,blockquote,th,td {
	margin:0;
	padding:0;
}

table {
	border-collapse:collapse; border-spacing:0;
}

fieldset,img {
	border:0;
}

address,caption,cite,code,
dfn,em,strong,th,var {
	font-style:normal;
	font-weight:normal;
}

ol,ul {
	list-style:none;
}

caption,th {
	text-align:left;
}

h1,h2,h3,h4,h5,h6 {
	font-size:100%;
	font-weight:normal;
}

q:before,q:after { content:''; }

abbr,acronym { border:0; }
```

Eric Meyer created [his reset](https://meyerweb.com/eric/tools/css/reset/) in 2007 as a way to smooth out differences in styling between browsers and to ensure that the new (at the time) HTML5 elements would display properly even in browsers with partial or no support.

This is the entirety of the Eric Meyer reset.

```css
html, body, div, span, applet, object,
iframe, h1, h2, h3, h4, h5, h6, p,
blockquote, pre, a, abbr, acronym,
address, big, cite, code, del, dfn, em,
font, img, ins, kbd, q, s, samp, small,
strike, strong, sub, sup, tt, var, b, u,
i, center, dl, dt, dd, ol, ul, li,
fieldset, form, label, legend, table,
caption, tbody, tfoot, thead, tr, th, td {
	margin: 0;
	padding:
	0;
	border: 0;
	outline: 0;
	font-size: 100%;
	vertical-align:
	baseline;
	background: transparent;
}

body { line-height: 1; }

ol, ul { list-style: none; }

blockquote, q { quotes: none; }

/* remember to define focus styles! */ :focus { outline: 0; }

/* remember to highlight inserts somehow!
 */
ins { text-decoration: none; }
del { text-decoration: line-through; }

/* tables still need 'cellspacing="0"' in the markup */
table {
	border-collapse: collapse; border-spacing: 0;
}
```

The Meyer reset:

* Resets values for HTML elements that use them. It resets:
  * margin
  * padding
  * border
  * font-size
  * Vertical alignment
* Sets the document's default line height
* Removes the marker (number or bullet) from lists
* Removes quotes from `blockquotes` and `q` elements

Eric's reset assumes a lot about what developers will do after they apply the reset.

This is not always the case and some of the choices in the reset are problematic from an accessibility standpoint.

An interesting evolution of Meyer's reset is the HTML5 Doctor [HTML5 Reset Stylesheet](http://html5doctor.com/html-5-reset-stylesheet/) also released in 2007.

This is, to my knowledge, one of the first resets that adds a basic look for some elements

```css
html, body, div, span, object, iframe,
h1, h2, h3, h4, h5, h6, p,
blockquote, pre, abbr, address, cite, code,
del, dfn, em, img, ins, kbd, q, samp,
small, strong, sub, sup, var, b, i,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, figcaption, figure,
footer, header, hgroup, menu, nav, section, summary,
time, mark, audio, video {
	margin:0;
	padding:0;
	border:0;
	outline:0;
	font-size:100%;
	vertical-align:baseline;
	background:transparent;
}

body {
	line-height:1;
}

article,aside,details,figcaption,figure,
footer,header,hgroup,menu,nav,section {
	display:block;
}

nav ul {
  list-style:none;
}

blockquote, q {
	quotes:none;
}

blockquote:before, blockquote:after,
q:before, q:after {
	content:'';
	content:none;
}

a {
	margin:0;
	padding:0;
	font-size:100%;
	vertical-align:baseline;
	background:transparent;
}

ins {
	background-color:#ff9;
	color:#000;
	text-decoration:none;
}

mark {
	background-color:#ff9;
	color:#000;
	font-style:italic;
	font-weight:bold;
}

del {
	text-decoration: line-through;
}

abbr[title], dfn[title] {
	border-bottom:1px dotted;
	cursor:help;
}

table {
	border-collapse:collapse;
	border-spacing:0;
}

/* change border colour to suit your needs */
hr {
	display:block;
	height:1px;
	border:0;
	border-top:1px solid #cccccc;
	margin:1em 0;
	padding:0;
}

input,
select {
	vertical-align:middle;
}
```

The next reset we'll look at is the first one that is more than reset.

First released in 2018, [normalize.css](https://necolas.github.io/normalize.css/) was created for predictability across browsers.

According to its repository's README, normalize.css:

* Preserves useful defaults, unlike many CSS resets
* Normalizes styles for a wide range of elements
* Corrects bugs and common browser inconsistencies
* Improves usability with subtle modifications
* Explains what code does using detailed comments for people interested in learning about the reset

Rather than copy the full `normalize` script, I'll copy the areas I find most interesting.

The first one is the use of `font-family: monospace, monospace`. This handles an interesting case where monospaced elements: `pre`, `code`, `kbd`, and `samp` look smaller than the surrounding text, particularly in headings.

```css
pre, code, kbd, samp {
  font-family: monospace, monospace;
	font-size: 1em;
}
```

I don't normally use subscripts and superscripts but it's interesting to see how we can configure them to work with existing line heights.

This would also have to be tested with OpenType fraction-related features if they are available.

```css
sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}
```

I've always wondered why most resets choose to remove borders, usually blue, of images inside links.

This is one way of doing it.

```css
img {
  border-style: none;
}
```

Who decides what paddings and margins should be used in the reset? Is it documented anywhere?

Should this always be specified as three values to make it easier for people to understand?

```css
fieldset {
  padding: 0.35em 0.75em 0.625em;
}
```

Browsers have their internal properties defined with vendor prefixes. How much should we handle these in a reset stylesheet and how much should be handled on a per-site stylesheet basis?

Note that these vendor-prefixed properties will not necessarily go away since these appear to be internal to one browser.

However, this raises the question, should we normalize the standard [focus-visible](https://github.com/WICG/focus-visible) and disable the proprietary related features?

```css
button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}
```

Matching the `hidden` attribute to the correct display value presents an interesting question. How much should we care for older browsers or those with no or partial support for a feature?

```css
[hidden] {
  display: none;
}
```

## Resets over the years

While these big resets are still popular, many developers have created their own resets to address particular needs or ideas. I've referenced these works in my own.

* [Andy Bell](https://piccalil.li/blog/a-more-modern-css-reset/)
* [Josh Comeau](https://www.joshwcomeau.com/css/custom-css-reset/)
* [Keith Grant](https://keithjgrant.com/posts/2024/01/my-css-resets/)

## Making your own

When I started thinking about creating my own reset, the following questions came to the fore:

* Is this a reset or a normalize-style stylesheet?
* What do I want this stylesheet to do?

The stylesheet is a normalize-style stylesheet, where I set my defaults on top of what browsers offer as default and then do further customization for specific cases.

The idea is that this default will be the first `@layer` of any stylesheet

The most basic content of this stylesheet sets some sane defaults for the document.

We set the default [box-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) for all elements to be `border-box`. This will tell the browser to account for any border and padding in the values you specify for an element's width and height. If you set an element's width to 100 pixels, that 100 pixels will include any border or padding you added, and the content box will shrink to absorb that extra width.

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

This one caught me by surprise, I've always thought viewport units would be enough to set the dimensions on the browser. And they would, on desktop machines.

As [Ahmad Shadeed](https://ishadeed.com/article/new-viewport-units/) points out:

> When using 100vh to size an element to take the full height of the viewport on mobile, it will be larger than the space between the top and bottom bars. This will happen in browsers that shrink their UI on scrolling, such as Safari or Chrome on Android.

The dynamic viewport units would be useful and they are for specific situations, however, we should be careful when using them:

> The dynamic viewport unit might impact the performance of the page, as it will be a lot of work for the browser to recalculate the styles which the user is scrolling up or down.

To avoid these performance issues, we set basic defaults for the body element, along with the first workaround for specific browsers.

```css
body {
  min-height: 100vh;
  line-height: 1.5;
  margin: 0;
  padding: 0;
}

@supports (-webkit-touch-callout: none) {
  body {
    height: -webkit-fill-available;
  }
}
```

Monospaced elements like `pre`, present an interesting case, It can be used as a block or an inline element and any reset using it needs to account for both (because I know I wouldn't in my projects).

The first case uses the font-family trick to standardize the size of the pre-formatted blocks of text.

```css
pre {
  font-family: monospace, monospace;
  font-size: 1em;
}
```

We also need to handle inline instances so we also create a rule where we match all `pre` elements that are direct descendants of any element and that don't have a class or an ID.

```css
* > pre:not([class]):not([id]) {
  display: inline-block;
  font-size: 1em;
  font-family: monospace, monospace;
}
```

Another item that I'm interested in is a default for tables. The default I prefer is different from what the HTML specification provides.

I prefer to work with collapsed borders.

By default, I invert the colors of the table headers (`thead tr`) to black on white and stripe even rows.

When using colors in this stylesheet I use multiple definitions of each color: an RGB color and an OKLCH alternative.

Although older browsers should no longer be a concern regarding OKLCH color support, I'm always covering in case I made I mistake in the OKLCH color definition.

```css
  table {
    table-layout: fixed;
    border-collapse: collapse;

    width: 100%;
		font-size: 1rem;
  }

  thead tr {
		background: rgb(35, 32, 37);
    background: oklch(0.25 0.01 315);
		color: rgb(255, 255, 255);
    color: oklch(1 0 106);
  }

  tbody tr:nth-child(even) {
    background-color: rgba(34, 32, 35, 0.125);
    background-color: oklch(24.69% 0.006 314.7 / 0.125);
  }

  tr {
    padding-inline-start: 1.25rem;
    padding-inline-end: 0.25rem;
    overflow-x: auto;
  }

  th,
  td {
    border: 3px solid black;
    /* word-break: break-all; */
    overflow-wrap: break-word;
    hyphens: manual;
  }
```

The final element in this iteration of the project is figures and their associated images and captions.

We reset the `figures` counter on the base element for our counter.

We also set [content-visibility](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility) for our base elements.

```css
article {
	counter-reset: figures;
	content-visibility: auto;
}
```

In each figure, we increase the `figures` counter.

In nested code, we do the following:

We insert generated text in the `caption::before` pseudo-element using strings of text and the counter we for the image. The idea is that it'll look like `Figure 1: this is the caption for the image`.

```css
figure {
	counter-increment: figures;

	> figcaption::before {
		margin-block-start: 0.5em;
		content: "Figure " counter(figures) ": ";
		width: max-content;
	}

	> img {
		max-width: 100%;
	}
}
```

That's a good starting point. I'm pretty sure that if I look at other resets and normalize stylesheets I will find more things to add but I have to keep reminding myself that these are the defaults and most changes are likely to work better in project-specific stylesheets rather than defaults.

## Links and Resources

* Historical Context
  * [The History of CSS Resets](https://www.webfx.com/blog/web-design/the-history-of-css-resets/)
  * [A Comprehensive Guide to CSS Resets](https://www.webfx.com/blog/web-design/a-comprehensive-guide-to-css-resets/)
  * [Should You Reset Your CSS?](https://www.webfx.com/blog/web-design/should-you-reset-your-css/)
* Browser default stylesheets
  * [Blink (Chromium)](https://source.chromium.org/chromium/chromium/src/+/main/blink/renderer/core/css/html.css)
  * [WebKit (Safari)](https://trac.webkit.org/browser/webkit/trunk/Source/WebCore/css/html.css)
  * [Gecko (Firefox)](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
  * [CSS2.1 User Agent Style Sheet Defaults](http://css-class.com/test/css/defaults/UA-style-sheet-defaults.htm)
* The early versions (chronological by release date)
  * [Eric Meyer's Reset](https://meyerweb.com/eric/tools/css/reset/)
  * HTML Doctor [HTML5 Reset Stylesheet](http://html5doctor.com/html-5-reset-stylesheet/)
  * [Normalize.css](https://necolas.github.io/normalize.css/)
* Modern resets
  * [A (more) Modern CSS Reset](https://piccalil.li/blog/a-more-modern-css-reset/)
  * [The New CSS Reset](https://elad2412.github.io/the-new-css-reset/)
  * [A Modern CSS Reset](https://www.joshwcomeau.com/css/custom-css-reset/)
  * [My CSS resets](https://keithjgrant.com/posts/2024/01/my-css-resets/)
* Additional information
  * [WHATWG suggestions for rendering HTML documents](http://www.whatwg.org/specs/web-apps/current-work/multipage/rendering.html)
  * [How Does CSS Work?](https://elad.medium.com/how-does-css-work-92fe7116916d)
  * [Reboot, Resets, and Reasoning](https://css-tricks.com/reboot-resets-reasoning/)
  * [Understanding the “Initial”, “Inherit” and “Unset” CSS Keywords](https://elad.medium.com/understanding-the-initial-inherit-and-unset-css-keywords-2d70b7121695)
  * [New Viewport Units](https://ishadeed.com/article/new-viewport-units/)
  * [100vh in Safari on iOS](https://www.bram.us/2020/05/06/100vh-in-safari-on-ios/)
