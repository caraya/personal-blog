---
title: "XML Wokflows: From XML to PDF: Part 2: CSS"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

With the HTML ready, we can no look at the CSS stylesheet to process it into PDF.

The extensions, pseudo elements and attributes we use are all part of the CSS Paged Media or Generated Content for Paged Media specifications. Where appropriate I've translated them to work on both PDF and HTML.

## Book defaults

The first step in creating the default structure for the book using `@page` at-element.

Our base definition does the following:

1. Size the page to letter (8.5 by 11 inches), width first
2. Use CSS notation for margins. In this case the top and bottom margin are 0.5 inches and left and right are 1 inch
3. Reset the footnote counter.
4. Using the @footnote attribute do the following
    
    1. Increment the footnote counter
    2. Place footnote at the bottom using another value for the float attribute
    3. Span all columns
    4. Make the height as tall as necessary

```css
/* STEP 1: DEFINE THE DEFAULT PAGE */
@page {
  size: 8.5in 11in; (1)
  margin: 0.5in 1in; (2)
  /* Footnote related attributes */
  counter-reset: footnote; (3)
  @footnote {
    counter-increment: footnote; (4.1)
    float: bottom; (4.2)
    column-span: all; (4.3)
    height: auto; (4.4)
    }
  }
```

In later sections we'll create named page templates and associate them to different portions of our written content.

## Page counters

We define two conditions under which we reset the page counter: When we have a book followed by a part and when we have a book followed by the a first chapter.

We do **not** reset the content when the path if from book to chapter to part.

```css
body[data-type='book'] > div[data-type='part']:first-of-type,
body[data-type='book'] > section[data-type='chapter']:first-of-type { counter-reset: page; }
body[data-type='book'] > section[data-type='chapter']+div[data-type='part'] { counter-reset: none }
```

## Matching content sections to page types

The next section of the style sheet is to match the content on our book to pages in our style sheet.

The book is broken into sections with data-type attributes to indicate the type of content; we match the section\[data-type\] element to a page type along with some basic style definitions.

We will further define the types of pages later in the style sheet.

```css
/* Title Page*/
section[data-type='titlepage'] { page: titlepage }

/* Copyright page */
section[data-type='copyright'] { page: copyright }

/* Dedication */
section[data-type='dedication'] {
  page: dedication;
  page-break-before: always;
}

/* TOC */
section[data-type='toc'] {
  page: toc;
  page-break-before: always;
}
/* Leader for toc page */
section[data-type='toc'] nav ol li a:after {
  content: leader(dotted) ' ' target-counter(attr(href, url), page);
}

/* Foreword  */
section[data-type='foreword'] { page: foreword }

/* Preface*/
section[data-type='preface'] { page: preface }

/* Part */
div[data-type='part'] { page: part }

/* Chapter */
section[data-type='chapter'] {
  page: chapter;
  page-break-before: always;
}

/* Appendix */
section[data-type='appendix'] {
  page: appendix;
  page-break-before: always;
}

/* Glossary*/
section[data-type='glossary'] { page: glossary }

/* Bibliography */
section[data-type='bibliography'] { page: bibliography }

/* Index */
section[data-type='index'] { page: index }

/* Colophon */
section[data-type='colophon'] { page: colophon }
```

## Front matter formatting

For each page of front matter contnt (toc, foreword and preface) we define two pages: left and right. We do it this way to acommodate facing pages with numbers on ooposite sides (for two sided printout)

For the front matter we chose to use Roman numerals on the bottom of the page

```css
/* Comon Front Mater Page Numbering in lowercase ROMAN numerals*/
@page toc:right {
  @bottom-right-corner { content: counter(page, lower-roman) }
  @bottom-left-corner { content: normal }
}

@page toc:left  {
  @bottom-left-corner { content: counter(page, lower-roman) }
  @bottom-right-corner { content: normal }
}


@page foreword:right {
  @bottom-center { content: counter(page, lower-roman) }
  @bottom-left-corner { content: normal }
}

@page foreword:left  {
  @bottom-left-corner { content: counter(page, lower-roman) }
  @bottom-right-corner { content: normal }
}


@page preface:right {
  @bottom-center {content: counter(page, lower-roman)}
  @bottom-right-corner { content: normal }
  @bottom-left-corner { content: normal }
}

@page preface:left  {
  @bottom-center {content: counter(page, lower-roman)}
  @bottom-right-corner { content: normal }
  @bottom-left-corner { content: normal }
}
```

## Pages formatting

We use the same system we used in the front matter to do a few things with our content.

We first remove page numbering from the title page and dedication by setting the numbering on both bottom corners to normal.

```css
/* Common Content Page Numbering  in Arabic numerals 1... 199 */
@page titlepage{ /* Need this to clean up page numbers in titlepage in Prince*/
  margin-top: 18em;
  @bottom-right-corner { content: normal }
  @bottom-left-corner { content: normal }
}

@page dedication { /* Need this to clean up page numbers in titlepage in Prince*/
  page-break-before: always;
  margin-top: 18em;
  @bottom-right-corner { content: normal }
  @bottom-left-corner { content: normal }

}
```

Now we start working on our chapter pages. The first thing we do is to place our running header content in the bottom middle of the page, regardless of whether it's left or right.

```css
@page chapter {
  @bottom-center {
    vertical-align: middle;
    text-align: center;
    content: element(heading);
  }
}
```

We next setup a blank page for our chapters and tell the reader that the page was intentionally left blank to prevent confusion

````css
@page chapter:blank { /* Need this to clean up page numbers in titlepage in Prince*/
  @top-center { content: "This page is intentionally left blank" }
  @bottom-left-corner { content: normal;}
  @bottom-right-corner {content:normal;}
}

Then we number the pages the same way that we did for our front matter except that we use narabic numerals instead of Roman. 

```css
@page chapter:right  {
  @bottom-right-corner { content: counter(page) }
  @bottom-left-corner { content: normal }
}

@page chapter:left {
  @bottom-left-corner { content: counter(page) }
  @bottom-right-corner { content: normal }
}

@page appendix:right  {
  @bottom-right-corner { content: counter(page) }
  @bottom-left-corner { content: normal }
}

@page appendix:left {
  @bottom-left-corner { content: counter(page) }
  @bottom-right-corner { content: normal }
}

@page glossary:right,  {
  @bottom-right-corner { content: counter(page) }
  @bottom-left-corner { content: normal }
}

@page glossary:left, {
  @bottom-left-corner { content: counter(page) }
  @bottom-right-corner { content: normal }
}

@page bibliography:right  {
  @bottom-right-corner { content: counter(page) }
  @bottom-left-corner { content: normal }
}

@page bibliography:left {
  @bottom-left-corner { content: counter(page) }
  @bottom-right-corner { content: normal }
}

@page index:right  {
  @bottom-right-corner { content: counter(page) }
  @bottom-left-corner { content: normal }
}

@page index:left {
  @bottom-left-corner { content: counter(page) }
  @bottom-right-corner { content: normal }
}
````

## Running footer

We now style the running footer.

```css
p.rh {
  position: running(heading);
  text-align: center;
  font-style: italic;
}
```

## Footnotes and cross references

Footnotes are tricky, they consist of two parts, the footnote-call and the footnote content itself. I'm still trying to figure out what the correct markup should be for marking up footnotes.

We've also defined a special class of links that appends a string and the the destination's page number.

```css
/* Footnotes */
span.footnote {
  float: footnote;
}

::footnote-marker {
  content: counter(footnote);
  list-style-position: inside;
}

::footnote-marker::after {
  content: '. ';
}

::footnote-call {
  content: counter(footnote);
  vertical-align: super;
  font-size: 65%;
}

/* XReferences */
a.xref[href]::after {
    content: ' [See page ' target-counter(attr(href), page) ']'
}
```

## PDF Bookmarks

PDF bookmarks allow you to navigate your content form the left side bookmark menu as show in the image below

![PDF Bookmarks](//publishing-project.rivendellweb.net/wp-content/uploads/2015/02/pdf-bookmarks.png)

For each heading level we do the following things for both Antenna House and PrinceXML:

- Set up the bookmark level
- Set up whether it's open or closed
- Set up the label for the bookmark

Only heading 1, 2 and 3 are set up, level 4, 5 and 6 are only set up as bookmarks only.

```css
section[data-type='chapter'] h1 {
  -ah-bookmark-level: 1;
  -ah-bookmark-state: open;
  -ah-bookmark-label: content();
  prince-bookmark-level: 1;
  prince-bookmark-state: closed;
  prince-bookmark-label: content();
}

section[data-type='chapter'] h2 {
  -ah-bookmark-level: 2;
  -ah-bookmark-state: closed;
  -ah-bookmark-label: content();
  prince-bookmark-level: 2;
  prince-bookmark-state: closed;
  prince-bookmark-label: content();
}

section[data-type='chapter'] h3 {
  -ah-bookmark-level: 3;
  -ah-bookmark-state: closed;
  -ah-bookmark-label: content();
  prince-bookmark-level: 3;
  prince-bookmark-state: closed;
  prince-bookmark-label: content();
}

section[data-type='chapter'] h4 {
  -ah-bookmark-level: 4;
  prince-bookmark-level: 4;
}

section[data-type='chapter'] h5 {
  -ah-bookmark-level: 5;
  prince-bookmark-level: 5;
}

section[data-type='chapter'] h6 {
  -ah-bookmark-level: 6;
  prince-bookmark-level: 6;
}
```

## Running PrinceXML

Once we have the HTML file ready we can run it through PrinceXML to get our PDF using CSS stylesheet for Paged Media we discussed above. The command to run the conversion for a book.html file is:

```bash
$ prince --verbose book.html test-book.pdf
```

Because we added the stylesheet link directly to the HTML document we can skip declaring it in the conversion itself. This is always a cause of errors and frustrations for me so I thought I'd save everyone else the hassle.
