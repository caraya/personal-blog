---
title: "Media Queries: Not all displays are equal"
date: "2015-07-20"
categories: 
  - "typography"
---

Media queries are a part of the progressive enhancement process. Using Media Queries ([Specification](http://www.w3.org/TR/css3-mediaqueries/) and [first public draft of Level 4 extensions](http://www.w3.org/TR/mediaqueries-4/)) you can use a single CSS style sheet to work with multiple devices.

At its most basic, a media query tells the browser to change selectors and attributes based on a certain value or to load (or not load) a specified resource. For example, you can use media queries when loading a stylesheet with a link element:

```css

<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
```

In this query, The user agen test is the the user agent is 800 pixels wider or narrower and, if it is, it will load the specified style sheet; otherwise it'll skip it.

You can also use media queries inside a stylesheet (internal or external) using the media at-rule.

```css

@media (max-width: 600px) {
  .facet_sidebar {
    display: none;
  }
}
```

In the stylesheet example, the test if for width of 600 pixels or less. If the rule is matches then we will change the display propery of the facet\_siderbar class to hide it. You can have multiple rules inside each media query.

You can also do multiple queries, limit them to specific device types (like screen or print) and even chain queries together. The following example taken from [CSS Tricks.com](https://css-tricks.com/snippets/css/media-queries-for-standard-devices/) provides media queries for some iPhones (the article has additional queries for standard devices.)

```css


/* ----------- iPhone 6 ----------- */

/* Portrait and Landscape */
@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 667px)
  and (-webkit-min-device-pixel-ratio: 2) {

}

/* Portrait */
@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 667px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: portrait) {

}

/* Landscape */
@media only screen
  and (min-device-width: 375px)
  and (max-device-width: 667px)
  and (-webkit-min-device-pixel-ratio: 2)
  and (orientation: landscape) {

}

/* ----------- iPhone 6+ ----------- */

/* Portrait and Landscape */
@media only screen
  and (min-device-width: 414px)
  and (max-device-width: 736px)
  and (-webkit-min-device-pixel-ratio: 3) {

}

/* Portrait */
@media only screen
  and (min-device-width: 414px)
  and (max-device-width: 736px)
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: portrait) {

}

/* Landscape */
@media only screen
  and (min-device-width: 414px)
  and (max-device-width: 736px)
  and (-webkit-min-device-pixel-ratio: 3)
  and (orientation: landscape) {

}
```

This begs a question: **Do we design for devices or resolutions?**

Justin Avery suggests that [we don't need device specific media queries](http://responsivedesign.is/articles/why-you-dont-need-device-specific-breakpoints) and that we should base the media queries we use in the devices and resolutions that we need to support rather than specific devices. He mentions that:

> Over the 4 years we have slowly moved away from device specific breakpoints in favour of content specific breakpoints, i.e. adding a breakpoint when the content is no longer easy to consume.
> 
> With this fundamental shift in thinking we no longer have to fear a new device — a new iPhone width — because we've already fixed our sites to work everywhere.
> 
> \-- Justin Avery

### Making changes for print

One of the best uses I've seen for media queries is to handle priting web content. As I wrote in [Creating print CSS stylesheets](https://publishing-project.rivendellweb.net/creating-print-css-stylesheets/) this is not an alternative to CSS Paged Media but a stop gap to get the online content printed.

What this media query will do is set up the margins (top, left and right to 1 inch and bottom to 1.5), set the line height to 1.5 (18pt in this case), remove any background image and make the text color black.

It will then adjust the size of the h1, h2 and h3 elements and hide video, audio, and object elements. These are normally multimedia elements that may or may not be needed in a printed document. If you don't hide them then the printer will spend large amounts of toner or ink to get your content printed (waste of time in my opinion.)

```css
/* example changes for printing a web page */
@media print {
  body {
    margin: 1in 1in 1.5in;
    font-size: 12pt;
    line-height: 1.5;
    background-image: none;
    color: #000;
  }

  h1 {
    font-size: 2em;
  }

  h2 {
    font-size: 1.75em;
  }

  h3 {
    font-size: 1.5em;
  }

  video, audio, object {
    display: none
  }
}        
```

### Moving forward

While the current Media Query specification defines a large set of [media features](http://www.w3.org/TR/css3-mediaqueries/#media1) to use in our queries, what really excite me are some of the queries (additional [dimensions](http://www.w3.org/TR/mediaqueries-4/#mf-dimensions), [display quality](http://www.w3.org/TR/mediaqueries-4/#mf-display-quality) and [interaction](http://www.w3.org/TR/mediaqueries-4/#mf-interaction) in particular) available in the editor draft for level 4

When these queries are supported in browsers we will be able to query for both screen size and DPI density and serve the appropriate content using CSS. It may look something like this:

```css
/* possible test for screen size and 2x HDPI */
@media screen and (min-width: 800px) and (max-width: 1024px) and (resolution >= 2dppx) {
  .facet_sidebar {
    /* Do something for browsers that go between the two values */
  }
}
```

Just in case you're curious (as I was): dppx represents the number of dots per px unit. Due to the 1:96 fixed ratio of CSS in to CSS px, 1dppx is equivalent to 96dpi, that corresponds to the default resolution of images displayed in CSS as defined by image-resolution (from [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/resolution).)

Even when widely supported you **must** test this in your target devices!

### Links and resources

- [Media Query Level 3 Specification](http://www.w3.org/TR/css3-mediaqueries/)
- [Media Query Level 4 Editor Draft](http://www.w3.org/TR/mediaqueries-4/)
- [MDN Media Query entry](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Media_queries#Media_features)
- [Media Types](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)
- [List of device viewport sizes](http://viewportsizes.com/)
