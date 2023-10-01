---
title: "Athena: Revisiting a possible digital publishing flow"
date: "2015-11-18"
categories: 
  - "technology"
---

# Athena: Revisiting a possible digital publishing flow

From a technical stand point. Web Components and the Polymer Project in particular provide a way to compose larger applications from base components and to provide flexible and powerful APIs to make our applications look great and feel powerful.

What attracted me to Polymer when I first started working with the technology in 2013 was that it's flexible but still enforces discipline and pushes good coding conventions into your project. It also hides details and complexity of doing things correctly

I've written before about what an online reading experience may look like in [Books as web apps](https://publishing-project.rivendellweb.net/books-as-web-apps-2/) and about Athena in particular in [Athena: What an ofline web reading experience may look like](https://publishing-project.rivendellweb.net/athena-what-an-ofline-web-reading-experience-may-look-like/)

Jeff Posnick's [offline ereader](https://jeffy.info/offline-ereader/index.html) was an early influence on the ideas and concepts for Athena.

Craig Mod's work on digital reading and subcompact publishing have informed a lot of my thinking and the ideas behind Athena.

## Specs and Standards

Web Components are a family of specifications that allow for extensions to the basic HTML tags either by extending existing ones or creating your own. These new tags are self contained units with their own encapsulated CSS and Javascript.

The technologies that make web components and their corresponding specifications are:

- [HTML Templates in the HTML Living Standard](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element)
- [HTML Imports Editor's Draft](https://w3c.github.io/webcomponents/spec/imports/)
- [Shadow DOM Editor's Draft](http://www.w3.org/TR/shadow-dom/)
- [Custom Elements Editor's Draft](http://w3c.github.io/webcomponents/spec/custom/)

These custom elements can be used in multiple works and by multiple authors. Once we create our master elements we can import them and reuse them anywhere we need/want to.

Using web components force us to be strict in the content of our elements and to be clear in the structure of our reading aplications since we have to specifiy the child elements and the structure from the first component we choose to create.

Web components are not an all-or-nothing proposition. You can extend existing tags and use them alongside your regulat content Github does this with their relative time tags. Rather than use a JS library like [moment](http://momentjs.com/) the extended the time element to acomplish the same task. If you look at any `time&nbsp;` tags on Github you will see this attribute: `is="time-ago"`, a type extension custom element. If the browser support custom elements then the browser displays relative time (3 months ago) and if it doesn't then the browser displays the full date... and the user does not even note the difference.

We also need to look at ServiceWorkers and associated specifications to better understand the capabilities they bring to the table.

- [Service Workers Working Draft](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/)
- [Push API Working Draft](https://slightlyoff.github.io/ServiceWorker/spec/service_worker/)
- [Web Background Synchronization Unofficial Proposal](https://slightlyoff.github.io/BackgroundSync/spec/)

## HTTPS Only

One thing that may catch developers by surprise is that some aspects of this project, primarily the Service Worker and related technologies, will only work with secure connections.

Browser vendors are pushing for SSL and understandably so. ServiceWorkers, and other new web features, are very powerful but are easy to abuse and allow malicious users to create man in the middle attacks.

Most browser vendors will flag regular HTTP as insecure in the not too distant future

## Working with third party content/code/material

We can also create components for most existing libraries, fonts and web resources. The Polymer project does this with the [marked-element](https://elements.polymer-project.org/elements/marked-element) and [font-roboto](https://github.com/PolymerElements/font-roboto/) components.

In the case of `marked-element` there are two elements in the repository: `marked-import` and `marked-element`. The only content of the `marked-import` element is a script tag to import the marked library:

```
<script src='../marked/lib/marked.js'></script>
```

Because of this the only thing we need to do in `marked-element` is to use an HTML Import to pull `marked-import` into our current element:

```
<link rel="import" href="marked-import.html"/>
```

This takes care of including the marked.js library and save us from having to remember to add the library in every page that we want to use `marked-element` in.

Fonts work the same way. The wrapper around the [Roboto](https://www.google.com/fonts/specimen/Roboto) font simply links to the fonts in the Google font library, like so:

```
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,300,300italic,400italic,500,500italic,700,700italic"/>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700"/>q
```

Once this is done we can import `font-roboto` into any component we want to use the font in.

There is another component ([font-roboto-local](https://github.com/PolymerElements/font-roboto-local)) that does a local `@font-face` import for all possible weights and styles of the font. We can use that repository as a model for using our own fonts in web components.

## Use Cases

These are the three main uses cases I see for Athena publications. The first two are based on short publication looks. The third use case is based on what media and resources will serve the story best. Enhancing existing content lets us choose which part of the Athena toolkit we’ll use with the content we’re working on… at the very least convert the project into an offline capable application.

### Long Form Content

As initally conceived Athena was a long-form content creation tool and that's where I see its strength. Adding app-like functionality only enhances the reading experience, doesn't replace it.

Some types of long form content I envision are:

### Early access

The Early Access Publications idea is based in existing programs like [Manning’s MEAP](https://www.manning.com/meap-program) and O’Reilly’s [Early Release](http://shop.oreilly.com/category/early-release.do?sortby=publicationDate&page=2) programs where the book content is published as soon as it’s ready (and sometimes as soon as the author is done writing it.)

The advantage of this kind of publication is that it tightens the feedback loop between readers, reviewers, editors and authors. It also allows for collaborative editing: whoever has access to the git repository can make changes and accept changes coming from the community (whether this repository is public or private.)

O’Reilly Media uses Ilia Grigorik’s book [High Performance Browser Networking](http://chimera.labs.oreilly.com/books/1230000000545) as a [case study](http://sites.oreilly.com/oreillyatlas/atlas-case-studies/ch01.html) on the benefits of this tighter loop.

Using Service Workers we can update the content seamlessly and use push notifications to alert users of new content without having to worry about last access times.

### SERIAL PUBLICATIONS (MAGAZINES AND THE LIKE)

Serials are periodical publications. Magazines are the ones that come to mind fitst but they are not the only ones. Shorter content like [Atavist](https://atavist.com/) books and stories or the longer content available from [O’Reilly Atlas](https://atlas.oreilly.com/) with the added advantage of offline access.

This way a book is never really done. We can continue to work on stories and tell new stories as long as we want to and the stories can get that continual polish that makes for a good reading experience. If we need/want to, we can also provide CSS Paged Media Stylesheets that will allow to create a PDF version of the text/images we make available.

### INTERACTIVE BOOKS

When I was thinking about interactive books there were two that came to mind: The first one was the [Defiance companion iBook](http://bit.ly/13Zfb3c) and Al Gore’s [Our Choice](http://bit.ly/13pgtnd) as presented at [TED](http://www.ted.com/talks/mike_matas) in 2011.

Before all the new CSS, HTML5 and Javascript technologies became mainstream it was very difficult (if not right out impossible) to create create experiences like the ones above.

Now the almost impossible is merely difficult. The technologies in those books is available as open web APIs at different levels of standardization and you can create equivalent experiences from the Applications that you run in your mobile devices.

# athena-components

The idea behind the `athena-components` repository is to create a set of components to use when creating articles like Snowfall or Climbing Everest. When thre repository is finished we can hand code our content. In a future iteration I hope to use the [Polymer Designer](https://polymer-designer.appspot.com/) as a visual editor for the components we choose to make available.

## Polymer Designer

Although it's possible to build documetns with the components manually that's far from an ideal situation. The Polymer Project create Polymer Designer as a demonstration of how to visually compose and create Polymer applications.

With the upgrade to Polymer 1.0 the designer app has lost some elements and gained some elements . It can now be built as either a web-based or a desktop application using Github's [Electron](http://electron.atom.io/) (formerly known as Atom Shell.) that runs on OS X, Linux and Windows machines.

## What's inside

Out of the box the toolset will contain the following components and functionality.

- Master Layout have the basics of the document
- Layout Components
    
    - athena-layout-standard (centered, 1 column)
    - athena-layout-multicol (multicolumn, using CSS where supported)
- Video
    
    - google-youtube
    - athena-vimeo
    - athena-video-local
- audio
    
    - athena-audio
    - athena-soundcloud
    - athena-audio-local
- Text
    
    - athena-document (Markdown)
    - athena-doc-container
- Data Visualization
    
    - athena-d3-chart
    - athena-d3-bar
    - athena-d3-container
    - athena-viz-container
- Images
    
    - athena-images
    - athena-responsive-images
        
        - athena-hero-images
- Service Workers and Associated Technologies from Polymer
    
    - platinum-sw
    - platinum-push-messaging
    - platinum-https-redirect

It is important to realize that these are the default components and can be easily expanded to suit your needs. The component repository can also be the starting point of a community of developers, both as a curated collection of publishing-related components and as a learning experience for all developers involved.
