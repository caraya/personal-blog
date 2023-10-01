---
title: "Progressive Subcompact Publications: Annotations"
date: "2016-11-28"
---

I still remember the first time I made an annotation from a Kindle book available in their public site ([kindle.amazon.com](http://kindle.amazon.com/)). I saw the possibilities as limitless until I realized that there were limitless as long as you bought the book from Amazon and read it on a Kindle device or application.

Every time I’ve turned around and searched for some way to annotate the web I've come with these two solutions but I've never had a project they work well with. I think PSPs are the perfect place to put this in practice. There are two libraries I think are particularly appropriate: [Emphasis](https://github.com/NYTimes/Emphasis) and [annotator.js](http://annotatorjs.org/) which provide different ways to make and share annotations from your PSPs.

Emphasis provides dynamic paragraph-specific anchor links and the ability to highlight text in a document, it makes the information about the highlighted elements of the page available in the URL hash so it can be emailed, bookmarked, or shared.

annotator provides a more traditional annotation interface that is closer in spirit to the Kindle annotation UI that attracted me to the concept when I first saw it.

![](http://annotatorjs.org/images/thumb-add.png) ![](http://annotatorjs.org/images/thumb-viewer.png)![](http://annotatorjs.org/images/thumb-bookmarklet.png)

Another tool that sounds interesting is MIT’s [Annotation Studio](http://www.annotationstudio.org/) but it seems to be geared towards MIT Hyperstudio’s larger project and not necessarily ready as a standlone solution, that said, your milleage may vary.

The thing to consider if how these annotation tools store the annotations. Do they use server-side databases? If so how do we cache new annotations when the reader is offline? Google Analytics provides a possible example where we store the annotations in indexedDB and then play them back when the user goes online.
