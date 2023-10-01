---
title: "Progressive Subcompact Publications: Introduction"
date: "2016-11-21"
---

For the past few months I’ve been working at Google building a set of instructor-led courses on how to build progressive web applications. This has made me think of how to push some of these concepts into what I call “Progressive subcompact publications”. These concepts are different than ePub Next and any number of formats vining for use, each of which have issues that are hard to overcome:

- They seek to replace the installed EPUB (and Kindle) user base. Since most users of iBooks and Kindles are locked in to their devices and readers this is not a good idea
- There will never be uniform buy in to new specs or ways to publish content and, unless you can get a majority of publishers to implement your specification, schema or idea you will be competing with a behemoth that is very slow to evolve (not questioning the reasons, just making a statement)
- Some people are trying to establish their format as a defacto standard (use this instead of what you already have) and that’s dangerous

- It’s dangerous if you fail to get full buy in because it segments the market even further
- it’s dangerous if you succeed because the defacto standard becomes a dejure standard and you have to support it and work all the warts that were ok when you were developing it (check the Javascript specifications for the amount of baggage carried over to keep old code from breaking)

Instead I’m looking at progressive web applications as a starting point for an exploration of how far we can push the web as a publishing medium.

## What are progressive web applications

Alex Rusell coined the term “Progressive Web Applications” in [Progressive Web Apps: Escaping Tabs Without Losing Our Soul](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/). It is an umbrella term for a series of technologies and best practices to make our users experience feel more like native applications without loosing what makes the web awesome. The characteristics of these apps (as defined in the post) are:

- Responsive: to fit any form factor
- Connectivity independent: Progressively-enhanced with Service Workers to let them work offline
- App-like-interactions: Adopt a Shell + Content application model to create appy navigations & interactions
- Fresh: Transparently always up-to-date thanks to the Service Worker update process
- Safe: Served via TLS (a Service Worker requirement) to prevent snooping
- Discoverable: Are identifiable as “applications” thanks to W3C Manifests and Service Worker registration scope allowing search engines to find them
- Re-engageable: Can access the re-engagement UIs of the OS; e.g. Push Notifications
- Installable in mobile: to the home screen through browser-provided prompts, allowing users to “keep” apps they find most useful without the hassle of an app store
- Linkable: meaning they’re zero-friction, zero-install, and easy to share. The social power of URLs matters.

Note that none of these ideas involve implementing new technologies. They are all in the specification pipeline at W3C or WHATWG and have multiple browser implementations already in the market.

These technologies also don’t stop you from using the new, shinny and awesome stuff coming down in CSS, Javascript and related APIs and technologies. Nothing stops you from using WebGL 2.0, CSS Grids and other awesomeness coming soon to browsers.

We will also briefly explore what it would take to make PSPs into full desktop and mobile applications using Electron and Apache Cordoba / Adobe PhoneGap. Again this is not meant to be a perfect solution but an exploration of possibilities.

## What is subcompact publishing

> It seems that perfection is attained, not when there is nothing more to add, but when there is nothing more to take away. Antoine de Saint Exupéry

The term [Subcompact Publishing](http://craigmod.com/journal/subcompact_publishing/) was coined by Craig Mod to describe a new and different publishing methodology rooted in the digital world rather than an extension of traditional publishing methods and systems.

According to Mod:

- Subcompact Publishing tools are first and foremost straightforward and require few to no instructions. Compare this to the instructions on how to navigate the current crop of digital magazines

![tutorials03](//publishing-project.rivendellweb.net/wp-content/uploads/2016/11/tutorials03-300x225.png)

![tutorials06](//publishing-project.rivendellweb.net/wp-content/uploads/2016/11/tutorials06-300x225.jpg)

- The editorial and design decisions around them react to digital as a distribution and consumption space. We no longer buy print magazines but read them online. How can we leverage the online publishing and reading experiences?
- They are the result of dumping our publishing related technology on a table and asking ourselves — what are the core tools we can build with all this stuff? Don’t think of online as just an extension of print but explore what things you can do only online and how that enhances the reader’s experience
    

Furthermore Craig describes subcompact publications as having the following characteristics:

- **Small issue sizes (3-7 articles / issue)**
- **Small file sizes**
- **Digital-aware subscription prices**
- **Fluid publishing schedule**
- **Scroll (don’t paginate)**
- **Clear navigation**
- **HTML(ish) based**
- **Touching the open web**

Reading the essay it shows that it’s geared towards magazines but, with a few modifications, it applies equally to books and other long form content. For this project, geared towards books and other collection types of publications, I’ve changed some of the definitions of Subcompact Publishing as listed below:

- **Small issue sizes (3-7 articles / issue) / Small file sizes** Because we are using technologies that allow us to load content on demand and to cache the content on the user's browser the need to keep the content small, both issue size and file size becomes less relevant. We can load the shell of our book independently of the content and load the content in smaller bites. For example we can load the first 10 chapters of a book right away and then load the rest of the content on demand. This does not mean we should forget about best practices in compressing and delivering the content but with Service Workers and caching available we can worry more about the content itself rather than how it's delivered. If we add http2 and server push to the mix the speed gain becomes significant if implemented correctly
- **Fluid publishing schedule** Because we can update the content of our web publications whenever it's necessary we can push new or updated content at any point, without having to worry about releasing the entire package again or having to go through a vendor's store approval process
- **Scroll (don’t paginate)** Unless we have a compelling reason
- **Clear navigation** We have trained our users to accept certain metaphors for navigating our web applications. There is no compelling reason to change that now and, if there is, it better be a very good reason
- **HTML based** Here is the main divergent point from Craig's conception of subcompact publications. PSPs are meant for the web and, if the developer chooses, for HTML-based publishing formats. iBooks and, especially, Kindle are closed ecosystems where it's very difficult to get in to the ecosystem beyond using the tools they provide to adapt your format to their specifications... It is already hard enough to work with different browsers and the uneven CSS support… none of the existing tools handle epub readers and their own prefixing requirements
- **Using the open web** One of the biggest draws of the web is that it requires no installation proccess or approval for content delivery to the end users. Leveraging this makes the idea of Progressive Subcompact publications easier to work with, even if DRM and other rights management issues are not tackled from the start

This is how a progressive web application looks like. It may also be how our web reading experiences look like in the not too distant future.
