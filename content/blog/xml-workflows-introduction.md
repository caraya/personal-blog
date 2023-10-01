---
title: "XML workflows: Introduction"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

One of the biggest limitations of markup languages, in my opinion, is how confining they are. Even large vocabularies like [Docbook](http://docbook.org) have limited functionality out of the box. HTML4 is non-extensible and HTML5 limits how you can extend it ([web components](http://webcomponents.org/) are the only way to extend HTML5 I'm aware of that doesn't need an update to the HTML specification.)

By creating our own markup vocabulary we can be as expressive as we need without adding complexity for writers and users and without adding unnecessary complexity for the developers building the tools to interact with the markup.

## Why create our own markup

I have a few answers to that question:

In creating your own xml-based markup you enforce separation of content and style. The XML document provides the basic content of the document and the hints to use elsewhere. XSLT style sheets allow you to structure the base document and associated hints into any several formats (for the purposes of this document we'll concentrate on XHTML, PDF created through Paged Media CSS and PDF created using XSL formatting Objects)

Creating a domain specific markup vocabulary allows you think about structure and complexity for yourself as the editor/typesetter and for your authors. It makes you think about elements and attributes and which one is better for the given experience you want and what, if any, restrictions you want to impose on your makeup.

By creating our own vocabulary we make it easier for authors to write clean and simple content. XML provides a host of validation tools to enforce the structure and format of the XML document.

## Options for defining the markup

For the purpose of this project we'll define a set of resources that work with a book structure like the one below:

\[code lang=xml\] <book> <metadata> <title>The adventures of Sherlock Holmes</title> <author> <first-name>Arthur</first-name> <surname>Conan Doyle</surname> </author> </metadata> <section type="chapter"> <para>Lorem Ipsum</para> <para>Lorem Ipsum</para> </section> </book> \[/code\]

It is not a complete structure. We will continue adding elements after we reach the MVP (Minimum Viable Product) stage. As usual, feedback is always appreciated.
