---
title: Is HTML Really Dead?
date: 2025-10-01
tags:
  - HTML
  - Web Development
  - Best Practices
---

A recent article, [HTML is dead, long live HTML](https://acko.net/blog/html-is-dead-long-live-html/), presents a provocative take on the state of HTML in modern web development. While it raises interesting points, I believe the conclusion misses the mark.

Here's my perspective on why HTML, and the DOM, is not only alive but remains the essential, evolving foundation of the web.

## The DOM is Not Just a Document

The [Document Object Model (DOM)](https://dom.spec.whatwg.org/) is the backbone of any webpage. It creates a structured, live representation of a document, allowing languages like javascript to dynamically alter its content, structure, and style. [HTML](https://html.spec.whatwg.org/) is simply the standard language we use to create that initial structure.

While frameworks like React, Vue, and Angular provide powerful abstractions for building user interfaces, they all ultimately produce HTML to be parsed by the browser. A solid understanding of the underlying technology is still crucial.

The article I'm responding to states:

> The achilles heel is the DOM's SGML/XML heritage, making everything stringly typed. React-likes do not have this problem, their syntax only looks like XML. Devs have learned not to keep state in the document, because it's inadequate for it.

This view is outdated. The DOM has evolved far beyond its SGML/XML roots. Modern browsers implement the DOM using the WebIDL (Web Interface Definition Language), creating a rich, programmable interface &mdash; not just a "stringly typed" document. Instead of old-school DTDs or Schemas, [WebIDL](https://webidl.spec.whatwg.org/) defines the objects, properties, and methods available to developers. For example, here's how WebIDL could define a simple graphical window interface:

```webidl
[Exposed=Window]
interface Paint { };

[Exposed=Window]
interface SolidColor : Paint {
  attribute double red;
  attribute double green;
  attribute double blue;
};

[Exposed=Window]
interface Pattern : Paint {
  attribute DOMString imageURL;
};

[Exposed=Window]
interface GraphicalWindow {
  constructor();
  readonly attribute unsigned long width;
  readonly attribute unsigned long height;

  attribute Paint currentPaint;

  undefined drawRectangle(double x, double y, double width, double height);

  undefined drawText(double x, double y, DOMString text);
};
```

This code defines a strongly typed API, which is far more powerful than the simple text-based structure the original article criticizes and is used by all modern browsers.

## Attributes vs. Properties: Know The Difference

Yes, the HTML living standard lists nearly 200 attributes, but this isn't a flaw; it's a feature of a mature and versatile language. These attributes are not meant to be used all at once. They fall into two categories:

* **Global attributes**: These can be used on almost any HTML element. Some examples: `id`, `class`, `style`, and `title`.
* **Specific attributes**: These are designed for particular elements where they have a specific, semantic purpose. You wouldn't use the `src` attribute on a `<p>` tag, or the `href` attribute on an `<h1>`.

Crucially, developers learned not to keep application state in the DOM because it was never designed for that purpose. HTML was created at CERN to share research documents. Its core design, which we've built upon for decades, was for hypertext, not complex state management.

### A Concrete Example: The &lt;video> Element

The &lt;video> element is a perfect illustration of the relationship between declarative HTML attributes and programmatic DOM properties. Some properties directly "reflect" an attribute, while others provide real-time state information and are only accessible via javascript.

#### Properties That Reflect HTML Attributes

Changing the HTML attribute updates the DOM property, and vice-versa.

| DOM Property | HTML Attribute | Description |
|:---: | :---:| --- |
| src | src | The URL of the video file. |
| poster | poster | An image URL to show before the video plays. |
| autoplay | autoplay | Whether the video should start playing automatically. |
| loop | loop | Whether the video should repeat after it ends. |
| controls | controls | Whether to display the browser's default video controls. |
| width | width | The width of the video display area in pixels. |
| height | height | The height of the video display area in pixels. |
|(and others...) | (...) | |

#### Properties Without HTML Attributes

These provide real-time information about the video's state and can only be accessed and manipulated with javascript. You cannot set these in your HTML file.

| DOM Property | Description |
|:---: | --- |
| currentTime | The current playback position in seconds (read/write). |
| duration | The total length of the video in seconds (read-only). |
| paused | A boolean that is true if the video is paused (read-only). |
| ended | A boolean that is true if the video has finished playing (read-only). |
| volume | The audio volume, from 0.0 (silent) to 1.0 (loudest). |
| playbackRate | The speed at which the video is playing (e.g., 2.0 is double speed). |
| videoWidth | The intrinsic width of the video file in pixels (read-only). |
| (and many others...) | (...) |

This clear separation allows HTML to declare the initial setup while Javascript handles the dynamic state.

## The Promise: Don't Break the Web

HTML and the DOM must honor the promise of backward compatibility. This means browsers must support older content, no matter when it was created. This commitment is why the [1996 Space Jam](https://www.spacejam.com/1996/) website still works perfectly today, nearly 30 years later, without any code changes.

This isn't a bug; it's the web's greatest feature.

### What Was Left Behind

As HTML evolved into its modern form, many tags were deprecated or made obsolete. This was a deliberate shift to make HTML more semantic and to separate content structure (HTML) from presentation (CSS). Most of the removed tags, like &lt;font> and &lt;center>, were for visual formatting that is now handled by CSS.

Notably, some tags like &lt;b>, &lt;i>, and &lt;s> were redefined with new semantic meanings and remain a valid part of HTML. For instance, &lt;s> now represents content that is no longer correct or relevant.

## Semantic HTML and Web Components

In the age of XML, you could define your own custom vocabularies with DTDs or Schemas. That approach has been superseded by a far more powerful and native solution: Web Components.

Using the Custom Elements API, you can create your own reusable HTML tags with encapsulated styling and behavior that the browser understands natively. They integrate seamlessly with existing HTML and are the modern successor to the dream of a fully extensible web vocabulary.

## The Nuclear Option

If you truly dislike the breadth of modern HTML, you can still use XML as your authoring language. The process involves:

1. Defining a strict vocabulary for your content using a [DTD](https://www.tutorialspoint.com/dtd/index.htm) or [XML Schema](https://www.w3.org/TR/xmlschema11-1/).
2. Writing your content in an XML file that conforms to your schema.
3. Using an [XSLT](https://www.w3.org/TR/xslt-30/) (Extensible Stylesheet Language Transformations) stylesheet to transform your custom XML into the HTML that the browser will render.

This is a powerful but complex approach that requires specialized skills in XML and XSLT, which is why it isn't common in modern web development.

## Conclusion: A Resilient Foundation

HTML isn't a relic; it's a resilient, evolving foundation. It has survived and adapted for over three decades while maintaining its core promise of backward compatibility.

While modern frameworks provide powerful abstractions, they all stand on the shoulders of this standard. HTML may have its quirks, but it's far from dead. It's the foundation that makes the modern web possible.
