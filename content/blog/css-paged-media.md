---
title: "CSS paged media"
date: "2013-12-24"
categories: 
  - "ebook-publishing"
  - "technology"
---

In paged media the content of the document is split into one or more discrete pages. Paged media includes paper, transparencies, pages, Microsoft Word documents, Adobe PDF (portable document format) files among others

> **This needs to be tested with modern browsers. As far as I know this is only supported on Chrome and, maybe, Firefox**
> 
> **I am currently working on a sample page and associated stylesheet to test the concept and see how well it works. See the bottom of this post for more information**

We no longer need to convert our documents into PDF or Word in order to print them. Using paged media and good layout and typography there is no reason not to expect high quality print results from our web content.

This is not a widely supported technology in browsers but it's getting there and, when it does, it'll make `HTML` an even better format to publish content.

There are formatters; programs that will take an HTML file and the style sheet and output a file suitable for printing. Some of the formatters include:

- [Antenna House](http://www.antennahouse.com/)
- [WKHTMLtoPDF](https://code.google.com/p/wkhtmltopdf/)
- [xhtml2pdf](http://www.xhtml2pdf.com/)
- [PhantomJS](http://phantomjs.org)? If we can capture the page then we might be able to use PhantomJS to print the page instead.

This is not quite the ideal I had in mind when I first started looking at Paged Media but until browser support gets better than it may just have to do.

Before we jump in to the code, there's one great article from A List Apart that covers book making with CSS: [Building books with CSS](http://alistapart.com/article/building-books-with-css3)

## Defining Pages: the @page rule

CSS defines a "page box", a box of finite dimensions where content is rendered. It is formed by two areas:

- **The page area**: The page area includes the boxes laid out on that page. The edges of the page area act as the initial containing block for layout that occurs between page breaks.
- **The margin area**: which surrounds the page area.

You can specify the dimensions, orientation, margins, etc. of a page box within an @page rule. The dimensions of the page box are set with the 'size' property. The dimensions of the page area are the dimensions of the page box minus the margin area.

For example, the following @page rule sets the page box size to 8.5 x 11 inches and creates '1in' margin on all sides between the page box edge and the page area:

```
<style tyle="text/css">
<!--
@page { size:8.5in 11in; margin: 1in; }
-->
</style>
```

You can use the `margin, margin-top, margin-bottom, margin-left, and margin-right` properties within the @page rule to set margins for your page same as you would for your regular CSS rules.

## Setting Page Size:

The `size` property specifies the size and orientation of a page box. There are four values which can be used for page size:

- **auto:** Same as the target paper size.
- **landscape:** Vertical layout, larger side of the page are left and right
- **portrait:** Horizontal layout, larger sides of the pare are top and bottom
- **length:** Length values for the 'size' property create an absolute page box. Values are entered manually.

We'll concentrate in `length` for this document. Once we've done some testing we will go back to how the `auto, portrait and landscape` value interact with the other parameters set up on the stylesheet

The example belows explicitly says the dimensions of the page to 8.5in by 11in. The pages created from the example requires paper that is 8.5"x11" or larger.

```
<style tyle="text/css">
<!--
@page {
  size: 8.5in 11in;  /* width height */
}
-->
</style>
```

Once you create a named page layout, you can use it in your document by adding the page property to a style that is later applied to an element in your document. For example, this style renders all the tables in your document on landscape pages:

```
<style tyle="text/css">
<!--
@page { size : portrait }
@page rotated { size : landscape }
table { page : rotated }
-->
</style>
```

If the browser encounters a `<table>` element in your document and the current page layout is the default portrait layout, it will print the table in a new landscape page.

## Left, right, and first pages:

When printing double-sided documents, the page boxes on left and right pages should be different. This can be expressed through two CSS pseudo-classes below:

```
<style tyle="text/css">
@page :first {
  size: 8.5in 11in;
}
@page :left {
  margin-left: 2.5in;
  margin-right: 1in;
}

@page :right {
  margin-left: 1in;
  margin-right: 2.5in;
}
</style>
```

The margins are mirror opposites from each other. When printed the pages will acommodate the margins for binding by providing additional space on the spine side.

The first page has it's own pseudo class. Using the :first attribute we can style our first page independently from the rest of our content and make our first or title page look different like we do in the example below:

```
<style tyle="text/css">
<!--
@page { 
  margin: 1in /* All margins set to 2cm */
} 

@page :first {
  margin-top: 4in    /* Top margin on first page 10cm */
}
-->
</style>
```

## Controlling pagination

Unless you specify otherwise, a page break only happens when there is a change in the page format or when the content fills the current page. To force or suppress page breaks, use the `page-break-before, pagebreak-after,` and `page-break-inside` properties.

Keywords for both `page-break-before` and `page-break-after` properties are: `auto, always, avoid, left,` and `right`.

The keyword `auto` is the default, it generate page breaks as needed. The keyword `always` forces a page break before or after the element, while `avoid` suppresses a page break immediately before or after the element. The `left` and `right` keywords force one or two page breaks, so that the element is rendered on a left-hand or right-hand page.

Suppose your document has level-1 headers start new chapters, with sections denoted by level-2 headers. We will start chapters on a new, right-hand page, but don't want section headers to be split across a page break from the subsequent content. You can achieve this using following rule:

```
<style tyle="text/css">
<!--
h1 { page-break-before : right }
h2 { page-break-after : avoid }
-->
</style>
```

Use only the `auto` and `avoid` keywords with the `page-break-inside` property. To prevent tables from being broken accross pages, if possible, you would use the following rule:

```
<style tyle="text/css">
<!--
table { page-break-inside : avoid }
-->
</style>
```

## Controlling widows and orphans:

> **Widow** A paragraph-ending line that falls at the beginning of the following page/column, thus separated from the rest of the text.
> 
> **Orphan** A paragraph-opening line that appears by itself at the bottom of a page/column.
> 
> A word, part of a word, or very short line that appears by itself at the end of a paragraph. Orphans result in too much white space between paragraphs or at the bottom of a page.
> 
> From [Wikipedia](http://en.wikipedia.org/wiki/Widows_and_orphans)

Generally, printed pages do not look attractive with single lines of text stranded at the top or bottom. Most printers try to leave at least two or more lines of text at the top or bottom of each page.

- The **orphans** property specifies the minimum number of lines of a paragraph that must be left at the bottom of a page.
- The **widows** property specifies the minimum number of lines of a paragraph that must be left at the top of a page.

Here is the example to create 4 lines at the bottom and 3 lines at the top of each page:

```
<style tyle="text/css">
@page{
  orphans:4; 
  widows:2;
}
</style>
```

## Initial stab at paged media stylesheet

See the [test stylesheet](http://labs.rivendellweb.net/paged-media/paged-media.css) for a possible way to make this work and the [HTML document](http://labs.rivendellweb.net/paged-media/paged-media.html) I'm using to experiment with the technology.
