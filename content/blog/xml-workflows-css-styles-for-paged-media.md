---
title: "XML Workflows: CSS Styles for Paged Media"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

This is the generated CSS from the SCSS style sheets (see the scss/ directory for the source material.) I've chosen to document the resulting stylesheet here and document the SCSS source in another document to make life simpler for people who don't want to deal with SASS or who want to see what the style sheets look like.

Typography derived from work done at this URL: http://bit.ly/16N6Y2Q

The following scale (also using minor third progression) may also help: [http://bit.ly/1DdVbqK](http://bit.ly/1DdVbqK)

Feel free to play with these and use them as starting point for your own work :)

The project currently uses these fonts:

- Roboto Slab for headings
- Roboto for body copy
- Source Code Pro for code blocks and preformated text

## Font Imports

Even though SCSS Lint throws a fit when I put font imports in a stylesheet because they stop asynchronous operations, I'm doing it to keep the HTML files clean and because we are not loading the CSS on the page, we're just using it to process the PDF file.

Eventually I'll switch to locally hosted fonts using bulletproof font syntax ([discussed here](http://www.paulirish.com/2009/bulletproof-font-face-implementation-syntax/) and available for use at [Font Squirrel](http://www.fontsquirrel.com/tools/webfont-generator).

At this point we are not dealing with [font subsetting](http://bit.ly/1ul3XBx) but we may in case we need to.

```css
@import url(http://fonts.googleapis.com/css?family=Roboto:100italic,100,400italic,700italic,300,700,300italic,400);
@import url(http://fonts.googleapis.com/css?family=Roboto+Slab:400,700);
@import url(http://fonts.googleapis.com/css?family=Source+Code+Pro:300,400);
```

## Defaults

Now that we've loaded the fonts we can create our defaults for the document. The `html` element defines vertical overflow and text size adjustment for Safari and Windows browsers.

```css
html {
overflow-y: scroll;
-ms-text-size-adjust: 100%;
-webkit-text-size-adjust: 100%;
}
```

The `body` selector will handle most of the base formatting for the the document.

The selector sets up the following aspects of the page:

- background and font color
- font family, size and weight
- line height
- left and right padding (overrides the base document's padding)
- orphans and widows

```css
body {
background-color: #fff;
color: #554c4d;
font-family: 'Roboto', 'Helvetica Neue', Helvetica, sans-serif;
font-size: 1em;
font-weight: 100;
line-height: 1.1;
orphans: 4;
padding-left: 0;
padding-right: 0;
widows: 2;
}
```

## Blockquotes, Pullquotes and Marginalia

It's fairly easy to create sidebars in HTML so I've played a lot with pull quotes, blockquotes and asides as a way to move the content around with basic CSS. We can do further work by tuning the CSS

```css
aside {
border-bottom: 3px double #ddd;
border-top: 3px double #ddd;
color: #666;
line-height: 1.4em;
padding-bottom: .5em;
padding-top: .5em;
width: 100%;
}

aside .pull {
margin-bottom: .5em;
margin-left: -20%;
margin-top: .2em;
}
```

The `magin-notes*` and `content*` move the content to the corresponding side of the page without having to create specific CSS to do so. The downside is that, as with many things in CSS, you are stuck with the provided values and will have to modify them to suit your needs.

```css
.margin-notes,
.content-left {
font-size: .75em;
margin-left: -230px;
margin-right: 20px;
text-align: right;
width: 230px;
}

.margin-notes-right,
.content-right {
font-size: .75em;
margin-left: 760px;
margin-right: -20px;
position: absolute;
text-align: left;
width: 230px;
}

.content-right {
font-size: .75em;
margin-left: 760px;
margin-right: -20px;
position: absolute;
text-align: left;
width: 230px;
}

.content-right ul,
.content-left ul {
list-style: none;
}
```

The opening class style creates a large distinguishing block container for opening text. This is useful when you have a summary paragraph at the beginning of your document or some other opening piece of text to go at the top of your document

```css
.opening {
border-bottom: 3px double #ddd;
border-top: 3px double #ddd;
font-size: 2em;
margin-bottom: 10em;
padding-bottom: 2em;
padding-top: 2em;
text-align: center;
}
```

Blockquotes present the enclosed text in larger italic font with a solid bar to the left of the content. Because the font is larger I've added

```css
blockquote {
border-left: 5px solid #ccc;
color: #222023;
font-size: 1.5em;
font-style: italic;
font-weight: 100;
margin-bottom: 2em;
margin-left: 4em;
margin-right: 4em;
margin-top: 2em;
}
blockquote p {
padding-left: .5em;
}
```

The pullquote classes were modeled after an ESPN article and look something like this:

![example pullquote](//publishing-project.rivendellweb.net/wp-content/uploads/2015/02/example-pullquote.png)

The original was hardcoded to pixels. Where possible I've changed the values to em to provide a more responsive

```css
.pullquote {
border-bottom: 18px solid #000;
border-top: 18px solid #000;
font-size: 2.25em;
font-weight: 700;
letter-spacing: -.02em;
line-height: 2.125em;
margin-right: 2.5em;
padding: 1.25em 0;
position: relative;
width: 200px;
}
.pullquote p {
color: #00298a;
font-weight: 700;
text-transform: uppercase;
z-index: 1;
}
.pullquote p:last-child {
line-height: 1.25em;
padding-top: 2px;
}
.pullquote cite {
color: #333;
font-size: 1.125em;
font-weight: 400;
}
```

## Paragraphs

The paragraph selector creates the default paragraph formatting with a size of 1em (equivalent to 16 pixels) and a line height of 1.3 em (20.8 pixels)

```css
p {
font-size: 1em;
margin-bottom: 1.3em;
}
```

To indent all paragraphs but the first we use the sibling selector we indent all paragraphs that are the next sibling of another paragraph element (that is: the next child of the same parent).

The first paragraph doesn't have a paragraph sibling so the indent doesn't happen but all other paragraphs are indented

```css
p + p {
text-indent: 2em;
}
```

Rather than use pseudo elements (`:first-line` and `:first-letter`) we use classes to give authors the option to use these elements.

```css
.first-line {
font-size: 1.1em;
text-indent: 0;
text-transform: uppercase;
}

.first-letter {
float: left;
font-size: 7em;
line-height: .8em;
margin-bottom: -.1em;
padding-right: .1em;
}
```

## Lists

The only thing we do for list and list items is to indicate what type of list we'll use as our default square for unordered list and Arabic decimals for our numbered lists.

```css
ul li {
list-style: square;
}

ol li {
list-style: decimal;
}
```

## Figures and captions

The only interesting aspect of the CSS we use for figures is the counter. The `figure figcaption::before` selector creates automatic text that is inserted before each caption. This text is the string "Figure", the value of our figure counter and the string ": ".

This makes it easier to insert figures without having to change the captions for all figures after the one we inserted. The figure counter is reset for every chapter. I'm researching ways to get the figure numbering across chapters.

```css
figure {
counter-increment: figure_count;
margin-bottom: 1em;
margin-top: 1em;
}
figure figcaption {
font-weight: 700;
padding-bottom: 1em;
padding-top: .2em;
}

figure figcaption::before {
content: "Figure " counter(figure_count) ": ";
}
```

## Headings

Headings are configured in two parts. The first one sets common attributes to all headings: `font-family`, `font-weight`, `hyphes`, `line-height`, margins and `text-transform`.

It's this attribute that needs a little more discussion. Using text-transform we make all headings uppercase without having to write them that way

```css
h1,
h2,
h3,
h4,
h5,
h6 {
font-family: 'Roboto Slab', sans-serif;
font-weight: 400;
hyphens: none;
line-height: 1.2;
margin: 1.414em 0 .5em;
text-transform: uppercase;
}
```

In the second part of our heading styles we work on rules that only apply to one heading at a time. Things such as size and specific attributes (like removing the top margin on the h1 elements) need to be handled need to be handled individually

```css
h1 {
font-size: 3.157em;
margin-top: 0;
}

h2 {
font-size: 2.369em;
}

h3 {
font-size: 1.777em;
}

h4 {
font-size: 1.333em;
}

h4,
h5,
h6 {
text-align: inherit;
}
```

## Different parts of the book

There are certains aspects of the book that need different formatting from our defaults.

We use the element\[attribute=name\] syntax to identify which section we want to work with and then tell it the element within the section that we want to change.

For example, in the bibliography (a section with the `data-type='bibliography` attribute) we want all paragraphs to be left aligned and all paragraphs to have no margin (basicallwe we are undoing the indentation for paragraphs with sibling paragraphs within the bibliography section)

```css
section[data-type='bibliography'] p {
text-align: left;
}
section[data-type='bibliography'] p + p {
text-indent: 0 !important;
}
```

The same logic applies to the other sections that we're customizing. We tell it what type of section we are working with and what element inside that sectin we want to change.

```css
section[data-type='titlepage'] h1,
section[data-type='titlepage'] h2,
section[data-type='titlepage'] p {
text-align: center;
}

section[data-type='dedication'] h1,
section[data-type='dedication'] h2 {
text-align: center;
}
section[data-type='dedication'] p {
text-align: left;
}
section[data-type='dedication'] p + p {
text-indent: 0 !important;
}
```

## Preformatted code blocks

A lot of what I write is technical and requires code examples. We take a two pronged approach to the fenced code blocks.

We format some aspects our content (wrap, font-family, size, line height and wether to do page breaks inside the content) locally and hand off syntax highlighting to [highlight.js](https://highlightjs.org/) with a style to mark the content differently.

```css
pre {
overflow-wrap: break-word;
white-space: pre-line !important;
word-wrap: break-word;
}
pre code {
font-family: 'Source Code Pro', monospace;
font-size: 1em;
line-height: 1.2em;
page-break-inside: avoid;
}
```

## Miscelaneous classes

Rather than for people to justify text we provide a class to make it so. I normally justify at the div or section level but it's not always necessary or desirable.

Code will be used in a future iteration of the code to highlight inline snippets (think of it as an inline version of the <pre><code> tag combination)

```css
.justified {
text-align: justify;
}

.code {
background-color: #e6e6e7;
opacity: .75;
}
```

## Columns

The last portion of the stylesheet deals with columns. I've set up 2 set of rules for 2 and 3 column with similar attributes. In the SCSS source these are created with a column mixin.

```css
.columns2 {
column-count: 2;
column-gap: 3em;
column-fill: balance;
column-span: none;
line-height: 1.25em;
width: 100%;
}
.columns2 p:first-of-type {
margin-top: 0;
}
.columns2 p + p {
text-indent: 2em;
}
.columns2 p:last-of-type {
margin-bottom: 1.25em;
}

.columns3 {
column-count: 3;
column-gap: 10px;
column-fill: balance;
column-span: none;
width: 100%;
}
.columns3 p:first-of-type {
margin-top: 0;
}
.columns3 p:not:first-of-type {
text-indent: 2em;
}
.columns3 p:last-of-type {
margin-bottom: 1.25em;
}
```
