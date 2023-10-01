---
title: "Reading for everyone"
date: "2016-07-11"
---

> Third in a series. Other two parts are [What kind of web do we want?](https://publishing-project.rivendellweb.net/what-kind-of-web-do-we-want/) and [Who are the next billion users and how do we accommodate them](https://publishing-project.rivendellweb.net/who-are-the-next-billion-users/)

How we build content that will be read wherever and whenever we are regardless of the device we use to access it?

## Reading for everyone

I’ve also found myself in discussions on Medium about [Portable Web Publications](https://www.w3.org/TR/pwp/) and when I asked what happens to people using existing devices (I used Kobo and iBooks as examples) I was told that PWP are web applications not ebooks. So what do you do in devices that don't have a native browser or that use a proxy like UC browser or Opera Mini to save on bandwidth?

We’re all too centered on western bandwidth requirements and devices. We forget that people in other countries have different requirements, additional constrains, and prefered methods to view content.

I love PWAs and I love the concept of reading on the web. But I'm also a realist and understand that, unless we can target as many devices as we can within reason, we're only adding more fragments to a really fragmented market.

## Defining core and accessories

We need a very strict definition of what our core content is: the text of our publication is our core content and everything else is bells and whistles. Our core content has to display in as many devices as possible with the understanding that our normal may not be the normal everywhere.

Who is our target audience? Are we building for a US-only market or are we working towards a more universal distribution system?

How much testing do we need to do? How many devices? Do we pay attention to feature phones and proxy browsers like Opera Mini and UC Browser? How do we handle existing ebook systems like iBooks, Kobo or different versions of Kindle? Can we afford to ignore them or leave them behind? Or do we mind creating multi platform reading experiences?

If we consider the text the core of our reading experiences then all the additions discussed in [Progressive and Subcompact books: Technical Notes](https://publishing-project.rivendellweb.net/progressive-and-subcompact-books-technical-notes/) become secondary to our content

It’s taken me a while to figure out how to progressively enhance an application, what I see as adding things to our base content in roughly this order:

1. Add the home screen tags to the index.html page
2. Add the link to the web app manifest
3. Add Service Worker
4. Add annotator and footnotes functionality
5. (If needed) add any additional scripting or network functionality
6. (if wanted) create CSS to convert the HTML to PDF using PrinceXML or Antenna House

Each of these steps on their own make a reading experience open to everyone. We add capabilities on top of the basic HTML we create for our content. We provide the tools to add the reading app to our mobile device home screen. We provide a service worker bringing with it offline caching, push notifications and background sync. We add annotations and advanced footnote capabilities and optionally we add more online network functionality and CSS for paged printed media.

## Reading for everyone (redux)

There is a lot to think about and plan if we want to build really universal applications. We are not covering all of the requirements. There’s internationalization, taking a deeper dive into accessibility to analyze if we need to implement accessibility constraints beyond what the web platform already provides.
