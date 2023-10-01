---
title: "HTML as a single source format"
date: "2014-03-23"
categories: 
  - "technology"
---

In this essay I will take what may be an unpopular position: **_Using HTML with XML syntax (XHTML) is currently the best format to put your content in because it is easier to convert from XHTML/CSS_** to pretty much any other format. In making this case we'll explore and work in the following areas and answer the following questions:

## Definitions

When we speak about XHTML in this document we refer to an HTML document using XHTML syntax. I will not change the mime type on the server to fully comply with XHTML restrictions.

## Why XHTML

The two main reasons I advocate XHTML as an authoring format are

### XHTML enforces code clarity and authoring discipline

XHTML limits the freeform structure of HTML5. Documents conforming to XHTML specifications must have, at a minimum:

- A DOCTYPE declaration
- An HTML element
- A HEAD element
- TITLE element
- BODY element

The structure written as XHTML tags looks like this:

\[xml\] <!DOCTYPE html> <html> <head> <title>Title Goes Here<title> <head> <body> <h1>Content Area</h1> <body> <html> \[/xml\]

This minimal structure must comply with the requirements below

**All XHTML tag names & attribute names must be in lowercase**

All XHTML attributes and elements must be in lower case

The following elements are not legal XHTML:

\[xml\] <DIV CLASS="chapter">Chapter 1</div>

<Div Class="chapter">Chapter 1</div> \[/xml\]

**All XHTML elements must close**

All elements must be closed, this includes both our standard tags such as the paragraph tag

\[xml\] <p>This is a paragraph</p> \[/xml\]

to empty elements such as images and form inputs elements

\[xml\] <img src="images/test.png" height="800" width="600" alt="Test image" />

<input type="submit" value="Submit" /> \[/xml\]

**All XHTML elements must be properly nested**

XHTML insists on proper nesting of the elements on our content. This is no longer legal

\[xml\] <p>This is the content of a paragraph

<p>This is our second paragraph \[/xml\]

And it should be writen like this:

\[xml\] <p>This is the content of a paragraph</p>

<p>This is our second paragraph</p> \[/xml\]

**All XHTML attribute values must be quoted**

In addition to being lowercased, attributes must be quoted. Rather than:

\[xml\] <div class=chapter>Chapter 1</div> \[/xml\]

It has to be written like this:

\[xml\] <div class="chapter">Chapter 1</div> \[/xml\]

## Because it is structured, we can use transformation tools to convert to/from XHTML

A lot of the discussions I've had with people seem to focus in the drawbacks of XHTML format as end users. One of the strengths W3C cited when moving to XHTML as the default format for the web was how easy it was for machines to read it and covert it to other formats.

I'll cover two examples using [Markdown](http://daringfireball.net/projects/markdown/): straigth transformation and converting Markdown into templated XHTML and an example of using [XSLT 1.0](http://www.w3.org/TR/xslt) to covert one flavor of XHTML into another using Xsltproc

### From markdown to html, straight up

One of the goals of Markdown is to: **_allow you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML)._** The original tool and all its ttranslations to other languages are built to allow the conversion; where they are different is in the number of extensions to the core markdown language and the language the tools themselves are written on.

For these examples I chose Python Markdown mostly because it's the language and the tool I'm familiar with. We will use the markdown file for the Markdown home page at Daring Fireball [http://daringfireball.net/projects/markdown/index.text](http://daringfireball.net/projects/markdown/index.text)

Below is a portion of the resulting XHTML code:

\[xml\] <h2>Introduction</h2>

<p>Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML).</p>

<p>Thus, "Markdown" is two things: (1) a plain text formatting syntax; and (2) a software tool, written in Perl, that converts the plain text formatting to HTML. See the <a href="/projects/markdown/syntax">Syntax</a> page for details pertaining to Markdown's formatting syntax. You can try it out, right now, using the online <a href="/projects/markdown/dingus">Dingus</a>.</p>

<p>The overriding design goal for Markdown's formatting syntax is to make it as readable as possible. The idea is that a Markdown-formatted document should be publishable as-is, as plain text, without looking like it's been marked up with tags or formatting instructions. While Markdown's syntax has been influenced by several existing text-to-HTML filters, the single biggest source of inspiration for Markdown's syntax is the format of plain text email.</p>

<p>The best way to get a feel for Markdown's formatting syntax is simply to look at a Markdown-formatted document. For example, you can view the Markdown source for the article text on this page here: <a href="http://daringfireball.net/projects/markdown/index.text">http://daringfireball.net/projects/markdown/index.text</a></p> \[/xml\]

The conversion process itself is simple. Using the Perl version it looks like this:

```
markdown content/webgl-2d-scale.md > test.html
```

### From Markdown to templated XHTML

As part of my sunshine-markdown project I've researched ways to convert markdown to XHTML. as

```
[10:30:54] carlos@rivendell sunshine-markdown 4826$ ./sunshine --verbose
processing:  content/webgl-2-textures.md
processing:  content/webgl-2d-matrices.md
processing:  content/webgl-2d-rotation.md
processing:  content/webgl-2d-scale.md
processing:  content/webgl-2d-translation.md
processing:  content/webgl-2d-vs-3d-library.md
processing:  content/webgl-3d-camera.md
processing:  content/webgl-3d-orthographic.md
processing:  content/webgl-3d-perspective.md
processing:  content/webgl-3d-textures.md
processing:  content/webgl-and-alpha.md
processing:  content/webgl-animation.md
processing:  content/webgl-boilerplate.md
processing:  content/webgl-fundamentals.md
processing:  content/webgl-how-it-works.md
processing:  content/webgl-image-processing-continued.md
processing:  content/webgl-image-processing.md
processing:  index.md 
```

Sunshine is hardcoded to put the content of each markdown file into a template that looks something like this:

\[xml\] < ?xml version="1.0" encoding="UTF-8"?>  %(title)s

# %(title)s

%(content)s

\[/xml\]

### Using XSLT to convert XHTML into ePub-ready XHTML

One of the things we forget is that, because XHTML is structured content we can use XSLT and XPATH to convert it to other XML-based dialects, such as the XHTML dialect required for ePub3 conformance. A basic template to convert a `div` into a section with the proper attributes for ePub work may look something like this:

\[xml\] < ?xml version="1.0"?>\[/xml\]
