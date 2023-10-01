---
title: "Web Components: Why not use web components?"
date: "2015-09-23"
categories: 
  - "technology"
  - "web-components"
---

[Wilson Page](http://wilsonpage.co.uk/) wrote a lengthy article in Mozilla Hacks about [the state of web components](https://hacks.mozilla.org/2015/06/the-state-of-web-components/). What I found most interesting about the piece are the reasons why web components have not reached recommendation status in the W3C. Quoting the article:

> By now, 4 years on, Web Components should be everywhere, but in reality Chrome is the only browser with ‘some version’ of Web Components. Even with polyfills it’s clear Web Components won’t be fully embraced by the community until the majority of browsers are on-board.
> 
> ## Why has this taken so long?
> 
> To cut a long story short, vendors couldn’t agree. Web Components were a Google effort and little negotiation was made with other browsers before shipping. Like most negotiations in life, parties that don’t feel involved lack enthusiasm and tend not to agree. Web Components were an ambitious proposal. Initial APIs were high-level and complex to implement (albeit for good reasons), which only added to contention and disagreement between vendors. Google pushed forward, they sought feedback, gained community buy-in; but in hindsight, before other vendors shipped, usability was blocked. Polyfills meant theoretically Web Components could work on browsers that hadn’t yet implemented, but these have never been accepted as ‘suitable for production’. Aside from all this, Microsoft haven’t been in a position to add many new DOM APIs due to the [Edge](http://www.microsoft.com/en-us/windows/browser-for-doing) work (nearing completion). And Apple, have been focusing on alternative features for Safari.

When I look at the article outlining alternative proposals and opposition to the concept as specified and currently implemented and polyfilled makes me wonder if this is another example of [bike shedding](http://blue.bikeshed.org/).

If accessibility is an issue, then perhaps you'd be better off without web components until some of the issues outline by Dominic in his [web component accessibility analysis](https://github.com/domenic/html-as-custom-elements/blob/master/docs/accessibility.md) are resolved. These issue will vary depending on the library that you choose to use.

<iframe width="560" height="315" src="https://www.youtube.com/embed/o6yLWihykVA?rel=0" frameborder="0" allowfullscreen></iframe>

Browser adoption and polyfill use are elements to consider. Even though polyfill exist for web components, the polyfills themselves introduce additional complications. How do the polyfills interact with other libraries in your application and viceversa. There used to be ways to pierce shadow boundaries so developers could style components from the 'host' application but that is being worked on or may have already been deprecated.

The situation has improved but it's still not ideal. Most browsers have implemented some of the Web Components specifications or have indicated that they are working on implementation. This disparity in development means that we still need to make the webcomponents.js polyfills available for our applications.

Not all web components specifications can be polyfilled and, although performance has improved, it may still be an issue for mobile devices.

The final decision about using web components is necessarily yours. There are companies that have deployed production applications using Polymer 0.5 and 1.0. Whether the trade off between performance and ease of use is worth it will depend on your needs.
