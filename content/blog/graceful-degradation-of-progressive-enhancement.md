---
title: "Graceful Degradation of Progressive Enhancement?"
date: "2014-03-07"
categories: 
  - "technology"
  - "tools-projects"
---

## Why does it matter?

As a designer I've been around the block long enough to have suffered the nightmare of having to code deffensively for multiple browsers. Back when Javascript was new and we were still trying to figure out best practices it was not uncommon to see code that branched according to browser vendor and version. We ended up with insanely hard to read and brittle to maintain CSS and Javascript files and we were at the mercy of vendors who may introduce incompatibilities and new features without caring that other vendors may not support them or may support them differently than they do.

who remembers code like the one below (not 100% accurate but it illustrate the idea)

```js
// define the browsers we will use
ie = navigator.useragent= "Internet Explorer";
n4 = navigator.useragent= "Netscape Navigator" && useragent.version = 4;
// Netscape and IE do things differently, take that into account in the code below

if (ie) {
  // Do the IE specific code here
}

if (n4) {
  // Do the Netscape thing here
}

// Do the stuff they both support equally
```

we have moved very far from those beginnings.

## Defining the terminology

Before we delve too deep into the discussion of which one is btter, let's define the terms we will use.

### Progressive enhancement

Progressive enchancement starts with a base template and begins to add features depending on whether they are supported by each invidual browser. This may involve alternate scripting or alternate ways of displaying content.

> In Progressive Enhancement (PE) the strategy is deliberately reversed: a basic markup document is created, geared towards the lowest common denominator of browser software functionality, and then the designer adds in functionality or enhancements to the presentation and behavior of the page, using modern technologies such as Cascading Style Sheets or JavaScript (or other advanced technologies, such as Flash or Java applets or SVG, etc.). All such enhancements are externally linked, preventing data unusable by certain browsers from being unnecessarily downloaded
> 
> PE is based on a recognition that the core assumption behind "graceful degradation" — that browsers always got faster and more powerful — was proving itself false with the rise of handheld and PDA devices with low-functionality browsers and serious bandwidth constraints. In addition, the rapid evolution of HTML and related technologies in the early days of the Web has slowed, and very old browsers have become obsolete, freeing designers to use powerful technologies such as CSS to manage all presentation tasks and JavaScript to enhance complex client-side behavior.
> 
> From: [Wikipedia](http://en.wikipedia.org/wiki/Progressive_enhancement)

### Gracefule degradation

Graceful degradation take the opposite approach. Rather tha use a base template to start, it starts with all the bells and whistles and provides ways for browsers that do not support the features to get as close as possible to the original experience as they can with the understanding that it will not be the same as the experience for modern or cuting edge browsers.

> The main difference between the graceful degradation strategy and progressive enhancement is where you start your design. If you start with the lowest common denominator and then add features for more modern browsers for your web pages, you're using progressive enhancement. If you start with the most modern, cutting edge features, and then scale back, you're using graceful degradation.
> 
> From: [About.com](http://webdesign.about.com/od/webdesignglossary/g/graceful-degradation.htm)

## So, which one do we use?

The answer as with many other things on the web is: **_It Depends_**

From a coder's perspective we want to always have access to the latest and greatest technology we've worked so hard to develop; but the browser market is still too fragmented in the support of standards for designers and developers to say that technologies are the only ones that will be used in a given project.

If using **_Progressive Enhancement_** we build a basic site and, as necessary, adding the advanced features to make the site look like we want it by inking additional CSS and Javascript files to accomplish the tasks we want to enhance.

If we go the **_Graceful Degradation_** we build the page as we want it to look in modern browsers and then make sure that reduced functionality will not make the site unusable.

As I research more about Progressive Enhancement and Graceful Degradation I will post the findings and results of the research.
