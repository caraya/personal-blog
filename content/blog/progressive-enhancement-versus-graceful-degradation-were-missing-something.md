---
title: Progressive Enhancement versus Graceful Degradation - We're missing something
date: 2024-05-20
tags:
  - Web
  - Development
---

This [article](https://meiert.com/en/blog/april-24-is-js-naked-day/) made me think, again, about one of the eternal battles of the web: Graceful Degradation versus Progressive Enhancement but it also made me think about something new.

I'm all for Graceful Degradation myself, but I also feel that both arguments miss the point.

The post will, again, review the definitions of Progressive Enhancement and Graceful Degradation and will cover why I think we're all missing the point.

## Definitions

The definitions for these terms haven't changed much over the years but it's important to bring them back to the front to have a context for the following section.

Graceful Degradation
: A design philosophy that centers around trying to build a modern website or app that will work in the newest browsers, but falls back to an experience that while not as good still delivers essential content and functionality in older browsers.
: Polyfills can be used to build in missing features with JavaScript, but acceptable alternatives to features like styling and layout should be provided where possible, for example by using the CSS cascade, or HTML fallback behavior.
: Source: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation). [^1]


Progressive Enhancement
: A strategy for web design that emphasizes core web page content first. This strategy then progressively adds more nuanced and technically rigorous layers of presentation and features on top of the content as the end user’s browser or Internet connection permits.
: The proposed benefits of this strategy are that it allows everyone to access the basic content and functionality of a web page, using any browser or Internet connection, while also providing an enhanced version of the page to those with more advanced browser software or greater bandwidth.
: Source [Wikipedia](https://en.wikipedia.org/wiki/Progressive_enhancement).

## What we're missing

There are a few items that I think we're missing when we talk about the debate between the two camps.

Long before we start talking about what strategy to use, we should remember that Javascript support is not uniform. All browsers support a default core set of web APIs defined in the [Browser Baseline](https://developer.mozilla.org/en-US/blog/baseline-unified-view-stable-web-features/) but that's not a complete snapshot.

Take extending built-in elements as an example. This is part of the custom elements specification and it's already implemented in some browsers.

But Safari (WebKit) has decided that they will not implement them. That leaves developers the choice of not implementing the API or using a polyfill.

This is not as terrible since you can have regular custom elements. Instead of `fancy-button is="button"` you can create a `fancy-button` custom element.

But this is more serious when the API is core to your application and it's not pollyfilable or it's not easy to create a polyfill.

[WebUSB](https://developer.chrome.com/docs/capabilities/usb) allows web applications to connect with USB devices across browsers and operating systems. It creates interesting possibilities for web apps that interact with physical devices... but only when using Chromium browsers (Chrome, Edge, Opera) since it won't work in Safari and Firefox, and it's unlikely to work any time soon.

The polyfill examples I've seen use WebUSB, which is not supported in two of our four target browsers so code like what appears in [Porting USB applications to the web. Part 1: libusb](https://web.dev/articles/porting-libusb-to-webusb) would not work as a polyfill

In situations like using WebUSB, I can't see either approach working.

You can't progressively enhance a WebUSB application since there is no native browser/USB interface to start from, and WebUSB is not supported in two of the four major browsers.

You can't gracefully degrade a WebUSB application since there is no replacement for the API short of figuring out how to compile a cross-platform library to WebAssembly and write the glue code to make them work together.

So what do we do with situations like these? What do we do when some browsers decide not to implement APIs and make it impossible to use without major workarounds? Would this become another era of "Best used with" signs on websites? [^2]

Some of you may say that we shouldn't implement features that are not supported across browsers. But that would mean that, as developers, we're forced to work with the least common denominator.

Before starting a new project we should check if all our target browsers support the APIs that we want to use. We should also evaluate alternative APIs or third-party modules that can replace the native web API.

[^1]: Definitions taken from [WebGlossary.info](https://webglossary.info/). All definitions are licensed under CC BY–SA 4.0.

[^2]: During the browser wars of the 1990s between Netscape and Microsoft, website owners would put icons to indicate which browser the site supported since both Netscape Navigator and Internet Explorer supported competing, and totally incompatible, technologies to accomplish the same task. See
