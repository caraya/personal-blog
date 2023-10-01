---
title: "Why XHTML is still the best answer for web publishing"
date: "2014-02-12"
categories: 
  - "ebook-publishing"
  - "technology"
---

Brad Neuberg wrote an [article](http://codinginparadise.org/ebooks/html/blog/making_epub3_play_nice_with_html5.html) about making ePub3 "play nice" with HTML5. I read it and initially agreed with it but, upon second reading and some thought I disagree with the essence of his argument.

Brad opens his argument with the following two bullet points:

> - The first is a version of HTML5 that uses XML's rules: everything has to be well formed and there can't be any mistakes in how you create your markup. This is commonly known as XHTML5, to indicate the HTML5 standard but based on XML. XHTML5 tends to be used in specialized back end systems to do text processing as there are fairly sophisticated tools for working with it, and it also turns out to be what EPUB3 uses.
> - The second is tag soup HTML5: you don't have to close your tags and processing is much looser and closer to the older HTML4 standard. Tag soup HTML5 dominates the open web; it's probably 99.9% of all the content you would access with a conventional web browser.

He further argumes that because tag soup is the dominant use of HTML5 that all tools should be using it and that XHTML 5 should only be used in back end systems.

In twitter conversation he argues, erroneously in my opinion, that it was the strictness and the restrictions it placed on content authors that caused the split with WHATWG and the creation of HTML 5. It was the move to an XML only environment and the creation of a completely separate mime type (application/xhtml+xml) for XHTML applications that caused the split.

Very few, if any, authors actually publish XHTML. They publish HTML in XHTML compatibility mode without actually changng the mime type of HTML documents or setting up the appropriate default namespace as required for XHTML compliance

> First, the future is creating high quality markup in HTML5 and then publishing it into different channels.

In that we agree.

We need a common base to create our content, but let's also remember that HTML or XHTML cannot do everything.

## Creating good coding habbits

If name spaces were not an issue, I would still have an issue with tag soup HTML: it promotes laziness and it makes the code hard to read and understand.

Look at the following example:

```
<html>
<title>Sample document</title>

<h1>Sample document

<p>Lorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem <em> and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random text</p>

<p>Lorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem <em> and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random text

<p>Lorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random textLorem <em><b>and some random text</em></b> Lorem Ipsum and some random textLorem Ipsum and some random textLorem Ipsum and some random text
```

In the example above, a more or less classic example of a tag soup web document we can see the following issues:

- There is no distinction between the head and the body of the document
- The charset of the document is not defined
- There re mutiple instances of incorrectly nested tags

HTML5 provides mechanisms for user agents to work around inconsistencies outline above. It does not encourage authors to use this system to write HTML content.

> ### Why does this new HTML spec legitimise tag soup?
> 
> Actually it doesn’t. This is a misconception that comes from the confusion between conformance requirements for documents, and the requirements for user agents.
> 
> Due to the fundamental design principle of supporting existing content, the spec must define how to handle all HTML, regardless of whether documents are conforming or not. Therefore, the spec defines (or will define) precisely how to handle and recover from erroneous markup, much of which would be considered tag soup.
> 
> For example, the spec defines algorithms for dealing with syntax errors such as incorrectly nested tags, which will ensure that a well structured DOM tree can be produced.
> 
> Defining that is essential for one day achieving interoperability between browsers and reducing the dependence upon reverse engineering each other.
> 
> However, the conformance requirements for authors are defined separately from the processing requirements. Just because browsers are required to handle erroneous content, it does not make such markup conforming.
> 
> For example, user agents will be required to support the marquee element, but authors must not use the marquee element in conforming documents.
> 
> It is important to make the distinction between the rules that apply to user agents and the rules that apply to authors for producing conforming documents. They are completely orthogonal.
> 
> From: [wiki.whatwg.org/wiki/FAQ#Why\_does\_this\_new\_HTML\_spec\_legitimise\_tag\_soup.3F](wiki.whatwg.org/wiki/FAQ#Why_does_this_new_HTML_spec_legitimise_tag_soup.3F)

Specific requirements for authoring HTML5 documents can be found here: [Conformance requirements for authors](http://www.w3.org/TR/html5/introduction.html#conformance-requirements-for-authors). It again reinforces the idea that because it is possible to create malformed tag soup documents you shouldn't do it.

## Elements from other XML-based name spaces

We can not add these elements to a tag soup-based html document. Whether this is a major issue will depend on your project needs but unless WHATWG/W3C provide an alternative, name spaces are the way to go

ePub 3 uses elements from the following namespaces in order to add functionality to ePub-based publications.

| Prefix | Namespace URI |
| --- | --- |
| epub | http://www.idpf.org/2007/ops |
| m (MathML) | http://www.w3.org/1998/Math/MathML |
| pls | http://www.w3.org/2005/01/pronunciation-lexicon |
| ssml (Speech Synthesis Markup Language) | http://www.w3.org/2001/10/synthesis |
| svg (Scalable Vector Graphics) | http://www.w3.org/2000/svg |
An example of XML vocabularies used in ePub 3 documents. Taken from [EPUB Content Documents 3.0](http://www.idpf.org/epub/30/spec/epub30-contentdocs.html)

## Javascript support for namespaced content

While technically it would be possible to convert epub:type to epub-type I fail to see the reason why we should. Both Javascript and CSS allow us to query for ePub namespaced (or any other kind of) attributes. we can either query bu class containing the attribute:

```
//select the first element that has the "content" class name
  var content = document.getElementsByClassName("content")[0];
  //a returns undefined but it still stores the correct value
  var a = content.getAttributeNS('http://www.idpf.org/2007/ops', 'type');
  alert(a); // shows the value of type for that element
```

We can also wrap our code in ePub specific containers. ePub make available the `navigator.epubReadingSystem` property which we can use to execute all our ePub realted code without affecting the rest of our script.

```
// If the user agent is an ePub Reading System
  if (navigator.epubReadingSystem) {
    feature = touch-events;
    // Test for the touch events feature
    var conformTest = navigator.epubReadingSystem.hasFeature(feature);
    // Output if the feature is supported
    alert("Feature " + feature + " supported?: " + conformTest);
}
```

See [http://code.google.com/p/epub-revision/wiki/epubReadingSystem](http://code.google.com/p/epub-revision/wiki/epubReadingSystem) for more information.

## CSS

As far as CSS is concerned namespace support was introduced as a [draft document in June of 2013](http://dev.w3.org/csswg/css-namespaces/). Support is not widespread but when it is, we'll be able to do something like this:

```
@namespace "http://www.w3.org/1999/xhtml"; /* This defines the default namespace*/
@namespace epub "http://www.idpf.org/2007/ops"; /* this defines the namespace "epub" */

table {
  border: 1px solid black
}
epub|type {
  display: block;
}
```
