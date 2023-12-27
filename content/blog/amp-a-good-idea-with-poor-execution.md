---
title: AMP - A good idea with poor execution?
date: 2024-06-30
draft: true
---

In [Speed Trap](https://www.theverge.com/23711172/google-amp-accelerated-mobile-pages-search-publishers-lawsuit), Kristen Radtke paints a rather unflattering picture of Google, the AMP project and possible ulterior motives for them to introduce the technology the way they did (just like The Verge authors assume ulterior motives for everything Google does).

AMP (Accelerated Mobile Pages) is a framework originally created by Google in an attempt to make mobile browsing faster.

I wrote a series of blog posts when AMP was first released expressing my concerns about the framework: [part 1](https://publishing-project.rivendellweb.net/amp-hope-and-fears-part-1/), [part 2](https://publishing-project.rivendellweb.net/amp-hope-and-fears-part-2/) and [part 3](https://publishing-project.rivendellweb.net/amp-hope-and-fears-part-3/)

For the purposes of this post, We'll concentrate on the AMP HTML stack and its components. We will ignore the other technologies since they are built on top of AMP HTML and are not really necessary to get my point across.

For details on how AMP sees AMP working, see: [How AMP works](https://amp.dev/about/how-amp-works).

## What is AMP?

At its core, the AMP  framework is composed of the following:

* A set of conventions on how to write HTML
* A set of web components to be used instead of existing HTML elements to provide encapsulation and enforce their best practices
* A scripting framework that complies with the conventions and prevents many problems that plague the mobile web
* Specialized caches that serve and validate the content

Each of these components provides opinionated and, somewhat, sensible defaults.

At its most basic, an AMP HTML document looks like this:

```html
&lt;!doctype html>
&lt;html amp lang="en">
  &lt;head>
    &lt;meta charset="utf-8">
    &lt;script async src="https://cdn.ampproject.org/v0.js">&lt;/script>
    &lt;title>Hello, AMPs&lt;/title>
    &lt;link rel="canonical" href="https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup/">
    &lt;meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    &lt;style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}&lt;/style>&lt;noscript>&lt;style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}&lt;/style>&lt;/noscript>
  &lt;/head>
  &lt;body>
    &lt;h1 id="hello">Hello AMPHTML World!&lt;/h1>
  &lt;/body>
&lt;/html>
```

Each AMP HTML document must:

| Rule | Description |
|--- | --- |
| Start with the &lt;!doctype html> doctype. | Standard for HTML.|
| Contain a top-level &lt;html ⚡> or &lt;html amp> tag.| Identifies the page as AMP content.|
| Contain &lt;head> and &lt;body> tags. | While optional in HTML, this is required in AMP.|
| Contain a &lt;meta charset="utf-8"> tag right after the &lt;head> tag. | Identifies the encoding for the page.|
| Contain a `&lt;script async src="https://cdn.ampproject.org/v0.js">&lt;/script>` tag inside the &lt;head> tag as early as possible.| Includes and loads the AMP JS library.|
| Contain a &lt;link rel="canonical" href="$SOME_URL"> tag inside their &lt;head>. | the href attribute should point to the page itself. This section exists for legacy reasons. |
| Contain a &lt;meta name="viewport" content="width=device-width" /> tag inside their &lt;head> tag. | Specifies a responsive viewport. |
| Contain the AMP boilerplate code in their &lt;head> tag. |CSS boilerplate to initially hide the content until AMP JS is loaded. |

The body of the page doesn't show anything unusual. The "magic" of the content happens in their element library.

What's important in this example is the structure and the requirements AMP places on content authors.

The doctype tag is part of every HTML document and should be included in every document. But the requirement is not enforced.

Same thing for the &lt;head> and &lt;body> elements. They are required for well-formed HTML documents but because parsers are configured in a much more forgiving way than what the HTML specification says we should do. This is known as [tag soup markup](https://en.wikipedia.org/wiki/Tag_soup)

Canonical links become necessary to improve SEO when you have multiple versions of the same page; they tell some search engine crawlers (Google and Bing) which page they should crawl.

There is a single asynchronous script on the head of the page. This is important since scripts are some of the biggest contributors to page weight and overall page size. Running scripts asynchronously helps improve load time.

The page has a single inline style declaration that can be no larger than 50KB. This is a sensible default that, sadly cannot be enforced on regular web content.

As we can see the defaults AMP enforces are not a bad thing. In my opinion, the web as a whole would benefit from having defaults like this.

## AMP Components

From an author's perspective, the biggest parts of the AMP project are the predefined layout system and the component libraries.

The [AMPHTML Layout System](https://amp.dev/documentation/guides-and-tutorials/learn/amp-html-layout/) seeks to ensure that components can be laid out before any download takes place.

The interesting thing is that the layout attributes are not applied to a root container but they are applied to the children components on the page.

AMP components are custom elements enforcing the AMP standard way of doing things. There is no reason why we couldn't create similar patterns without the limitations that we got when working with AMP-enabled Google Publishing pipelines.

## The publishing system

What I see as the biggest weakness of the AMP ecosystem, and where most of the AMP criticism comes from, is the way that AMP content is served.

[Speed Trap](https://www.theverge.com/23711172/google-amp-accelerated-mobile-pages-search-publishers-lawsuit)

> But AMP came with huge tradeoffs, most notably around how all those webpages were monetized. AMP made it harder to use ad tech that didn’t come from Google, fraying the relationship between Google and the media so badly that AMP became a key component in an antitrust lawsuit filed just five years after its launch in 2020 by 17 state attorneys general, accusing Google of maintaining an illegal monopoly on the advertising industry. The states argue that Google designed AMP in part to thwart publishers from using alternative ad tools — tools that would have generated more money for publishers and less for Google. Another lawsuit, filed in January 2023 by the US Justice Department, went even further, alleging that Google envisioned AMP as “an effort to push parts of the open web into a Google-controlled walled garden, one where Google could dictate more directly how digital advertising space could be sold.”

## So what could we do

Several of these components were spun into a standalone component library, [Bento](https://bentojs.dev/), that takes some of the existing AMP components and
