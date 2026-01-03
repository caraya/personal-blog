---
title: What is CSS?
date: 2026-02-25
tags:
  - CSS
  - Web Development
---

Defining CSS4, just like we defined CSS2 and HTML5 before it, is a tricky because CSS is continuously evolving and it's not a single monolithic specification that you can add features to, like the anual ECMAScript specifications. Instead, CSS is made up of many different modules, each with its own specification and development timeline.

This post will explore ways in which we can rethink CSS4 as a concept, how we can approach its definition and what it may mean for web developers.

## Historical Context

To understand why CSS 4 is a complex topic, it's important to look back at the history of CSS and how it has evolved over time.

Before CSS, web pages were styled using HTML attributes and tags, which led to inconsistent and hard-to-maintain designs. The dominant browsers of the time, Netscape Navigator and Internet Explorer, had their own proprietary ways of handling styles, leading to a fragmented web development experience.

For example, to change the font color of text in HTML, you would use the `<font>` tag with a `color` attribute:

```html
<p><font color="red">This text is red.</font></p>
```

And you had to repeat the styling for all instances of that text color throughout the document, leading to bloated and hard-to-maintain code.

### CSS1 and CSS2

Cascading Style Sheets (CSS) was first proposed in 1994 by Håkon Wium Lie and developed to separate document content (HTML) from its presentation. This allowed for more efficient, consistent, and flexible web design.

Instead of embedding style information directly in HTML elements, CSS allowed developers to define styles in a separate stylesheet. This separation of concerns made it easier to maintain and update the look and feel of a website.

```css
.red {
  color: red;
}
```

and then in html

```html
<p class="red">This text is red.</p>
```

So we can apply the same style to multiple elements of the same or different types without duplicating the style information.

CSS also saved developed from duplication of style information across multiple pages and in all elements of the same type on a page. You can also define styles in external stylesheets that can be reused across multiple pages.

Key Milestones in CSS History

| Date | Event | Description |
| :---: | --- | --- |
| Oct 1994 | CSS Proposed | Håkon Wium Lie, while working at CERN with Tim Berners-Lee, publishes the first draft of the "Cascading HTML Style Sheets" proposal. |
| Dec 1996 | CSS Level 1 (CSS1) Recommendation | The World Wide Web Consortium (W3C) published the first official CSS specification. It included features for font properties, text alignment, colors, margins, and the basic box model. |
| May 1998 | CSS Level 2 (CSS2) Recommendation | CSS2 was released, expanding on CSS1 with new capabilities such as positioning, z-index, and support for different media types (e.g., print, screen). |
| June 2011 | CSS 2.1 Recommendation | A revision to CSS2 was published to fix errors and officially incorporate browser-implemented features that were widely used in practice. |

### The Current State of CSS

CSS2 was significantly larger than CSS1, introducing many new features and capabilities. However, the fact that CSS2 was a monolithic specification made it difficult to release since different parts of the specification were at different levels of maturity and browser support.  You couldn't release CSS2 until all parts were ready, which slowed down the formal adoption of the specification.

After the release of CSS 2 in 1998, CSS became a set of modular specifications, each focusing on different aspects of styling and layout and developed independently. This modular approach allowed for faster development and eliminated the bottlenecks the working group faced during the CSS2 development process.

## The CSS Process

### Incubation In Community Groups

**Status**: Just an Idea

**Developer Action**: Share use cases; do not implement.

Before entering the official standards track, ideas are "incubated" in Community Groups (see the W3C
s [Business and Community Groups](https://www.w3.org/community/) page for a full list).  These groups produce Community Group Reports, which are not standards. They serve to prove there is enough interest and feasibility to form a formal Working Group.

**Stability**: Experimental. The idea might be abandoned completely or it may be pushed into standards track working groups.

**Implementation**: Browsers may offer "Origin Trials" to test the concept, but features here often disappear or change entirely.

### Editor’s Draft (ED)

**Status**: Internal Sketchpad

**Developer Action**: Ignore for production.

Editors create this initial version to track active discussions within the Working Group. It represents the "bleeding edge" of a spec.

**Stability**: Highly volatile.

**Implementation**: Browsers rarely implement features at this stage.

### Working Draft (WD)

**Status**: Public Review

**Developer Action**: Experiment with caution.

The W3C publishes this version to gather review and feedback from the community and other organizations.

**Stability**: Low. The API syntax and behavior often undergo significant changes (breaking changes) before the next stage.

**Implementation**: You might find experimental implementations, but do not rely on them.

### Candidate Recommendation (CR)

**Status**: Call for Implementation

**Developer Action**: Start testing and writing polyfills.
The spec is now considered "feature complete." The W3C explicitly signals browser vendors to implement the specification to prove it works in the real world.

**Stability**: Moderate to High. The core features are set, though edge cases might trigger adjustments.

**Implementation**: Browsers often ship these features behind flags or in "Nightly" builds. This is the safest time to begin learning the new API.

### Proposed Recommendation (PR)

**Status**: Final Endorsement

**Developer Action**: Treat as stable.

The W3C Advisory Committee reviews the final specification. This stage is a formality to ensure all legal and organizational requirements are met before the final release.

**Stability**: High. Only critical technical errors will cause changes at this stage.

**Implementation**: Most modern browsers likely support the feature by now.

### W3C Recommendation (REC)

**Status**: Web Standard

**Developer Action**: Safe for production.

The consensus is reached. The W3C officially endorses the specification as a standard for the Web.

**Stability**: Frozen. Future changes will occur in a new version (Level) of the spec.

**Implementation**: You can rely on consistent behavior across compliant browsers.

### Maintenance: Errata & Edited Recommendations

Even after a spec becomes a Recommendation, the community may find typos or small technical errors. These are handled in two ways:

* Errata: A separate list of known errors and their corrections is maintained (usually linked from the spec header). These do not change the official document immediately.
* Edited Recommendation: If the errata are significant but do not add new features, the W3C may publish an "Edited Recommendation." This updates the official text to include the fixes without restarting the entire standardization process.

## Why Do We Need CSS4?

Although CSS3 and HTML5 are widely used terms, they don't represent single specifications. HTML5 defines what became the HTML living standard, plus a set of well defined related specifications and technologies, CSS3 is a collection of modules at different levels of maturity and browser support.

The need for CSS4 has been around for several years, the CSS Working Group has a [discussion thread](https://github.com/w3c/csswg-drafts/issues/4770) started in 2020 about defining CSS4.

Some of the arguments in favor of defining CSS4 include:

> So CSS3 was a unique one-off opportunity. Rather than one big spec, break them into parts and start them all off at “Level 3” but then let them evolve separately. That was very on purpose, so things could move quicker independently.
>
> The problem? It was almost too effective. CSS3, and perhaps to a larger degree, “HTML5”, became (almost) household names. It was so successful, it’s leaving us wanting to pull that lever again. It was successful on a ton of levels:
>
> &mdash; [Chris Coyier](https://css-tricks.com/css4/)

I agree that the success of HTML5 and CSS3 as marketing terms has created a desire for a similar versioned term to rally around but both CSS and HTML have moved to specifications that either evolve continously (the HTML Living Standard) or are modular and versioned independently (CSS).

Figure 1 shows the components that made up HTML5 by 2014.

<figure>
  <img src="/images/HTML5_APIs_and_related_technologies_taxonomy_and_status.svg" alt="HTML5 Taxonomy">
  <figcaption>What made up HTML5 around 2014</figcaption>
</figure>

HTML5 was further complicated because, for a while, the W3C maintained a versioned copy of the WHATWG HTML Living Standard as HTML5.1, HTML5.2, etc. But eventually the W3C stopped the practice and now the only "official" version of HTML is the continuously evolving [HTML Living Standard](https://html.spec.whatwg.org/) maintained by WHATWG.

CSS presents a different challenge. Even if we were to define CSS4 as a collection of all the latest CSS modules, those modules are at different levels of maturity and browser support. Even for modules that are still consider under development, there might be features that have been implemented in browsers, without being part of a finalized specification.

> I’ve wondered if version numbers impact web technology choices. Slapping a version number on a collection of APIs can create a sense of excitement, velocity, and newness around a technology. The version number becomes shorthand for a handful of new features. Excitement around new features compounds in to popularity as people glom on to the new shiny. And people, being who we are, tend to pick things based on their popularity rather than merit.
>
> A single number bump replaces a mountain of marketing. Every discerning technologist knows it only makes sense to invest in technologies that are moving forward. To invest in a stagnant technology would be a dereliction of duty.
> I think this has effected web technologies deeply. HTML5 was released in 2008 and its handful of new elements and APIs was a boom for the language. Even Steve Jobs advocated for it over Flash. Web Standards had won, Firefox and Webkit were our champions. “We need to upgrade to HTML5” was a blanket excuse for auditing your website and cleaning up your codebase.
>
> &mdash; [David Rupert](https://daverupert.com/2019/04/perceived-velocity/)

The problem is not bumping the version number itself, but rather what we include in those versions and how do we encourage adoption. With CSS we could try bundling all current modules into one monolithic specification. It then becomes a process exercise in deciding what to include, what to leave out, and whether the resulting single specification is actually useful for developers.

The specification would have to change drastically from the current emphasis on implementer and modular development to one that focuses on developer experience and adoption. This would be a significant shift in how we develop and maintain CSS; either as additional work for the CSS Working Group or as a community-driven effort.

> Unpopular opinion: CSS and HTML need to increment their version numbers again so we can convince business to invest in these technologies. 😂
>
> &mdash; [Nicole Sullivan](https://twitter.com/stubbornella/status/1083768515524349952)

I would question that's the purpose on selling CSS to businesses? Like the web experienced with Javascript frontend frameworks, businesses will always chase something that is easy to use over understanding the underlying technology. Version numbers may help sell a technology, but they don't help developers actually use it.

Again, the challenge is the changes we'd have to make to the output the CSSWG produces. How do we keep both the current specifications and a new developer-focused version in sync? How do we decide what features to include or exclude? How do we market it to developers and businesses? Who gets to drive the process?

> I am proposing that we web developers, supported by the W3C CSS WG, start saying “CSS4 is here!” and excitedly chatter about how it will hit the market any moment now and transform the practice of CSS.
>
> Of course “CSS4” has no technical meaning whatsoever. All current CSS specifications have their own specific versions ranging from 1 to 4, but CSS as a whole does not have a version, and it doesn’t need one, either.
>
> Regardless of what we say or do, CSS 4 will not hit the market and will not transform anything. It also does not describe any technical reality.
>
> &mdash; [PPK](https://www.quirksmode.org/blog/archives/2020/01/css4_is_here.html)

This is a valid, but dangerous, approach. Marketing a non-existent specification could lead to confusion and frustration among developers who expect a clear set of features, with support and guidance.

If we say there's a CSS4 specification coming people, at least those beginning their learning experience, will expect it to exist and be usable. If it doesn't, or if it's not what they expected, it could lead to unexpected reactions.

CSS3 had the advantage that the modules it was based on were all at level 3, so there was a clear technical set of modules to point to, and that made sense to developers. With CSS4, there is no set of modules at level 4, so defining it becomes more complicated.

### Different Ways Of Defining CSS4

There are several ways we could approach defining CSS4:

1. Completed Specifications
2. Single Monolithic Specification
3. The Living Standard Approach
4. Developer Specific Version
5. List Of All Available Features
6. Features Supported In Browsers Today

These approaches make different assumptions and tradeoffs about what CSS4 means, who it's for, and how it should be developed and maintained.

The first question to ask is who is the target audience for CSS4? Browser implementers? The business people who make the decision of what to implement based on version numbers? or web developers who want a clear set of features to use in their projects?

Furthermore, authoring a separate CSS4 specification would require significant effort and coordination among the CSS Working Group members and the broader web development community. It would also require ongoing maintenance to keep it up to date with the latest developments in CSS.

#### Single Monolithic Specification

A straightforward approach to defining CSS4 is to create a single monolithic specification that includes all the features and capabilities of CSS up to a certain point in time. This would be similar to how CSS2 was defined, but it would be a much larger and more complex document.

I can think of two approaches to creating such a specification.

##### The Naive Approach: Completed Specifications

The most naive way to build a CSS 4 specification is to take specifications that have reached recommendation status. One starting point is the [current work](https://www.w3.org/Style/CSS/current-work.en.html) page on the W3C website.

It provides a small list of specifications that have gone through the standardization process and are considered stable. However, this list is not exhaustive and may leave out important features that are widely implemented but part of specifications that haven't reached recommendation status.

##### Definition From The Snapshot

Another, less naive, approach is to use the [Cascading Style Sheets (CSS) — The Official Definition](https://www.w3.org/TR/css/#css-official) listed in the [CSS Snapshot 2025](https://www.w3.org/TR/css/).

This definition includes only specifications that the CSSWG considers stable and for which we have enough implementation experience that we are sure of that stability. The snapshot definition expands on specific sections of CSS2 but doesn't fully replace CSS2.

This type of specification, in whatever form it's presented in, asks a lot of its readers: It assumes that readers (developers or not) are willing to read the CSS2 specification and the overlay the new specifications on top of it to understand the complete picture as specified.

It also assumes that readers are proficient enough to understand the technical nature of the specifications as written.

##### The Living Standard Approach

Another possible solution is to use the *living standard* approach, used by WHATWG for their specifications. It's similar, in concept, to the definition from the snapshot, but it would be continuously updated as new features are added or existing features are modified.

This would reduce dependency on individual specifications since the living standard would be the single source of truth for CSS4 and implementers would work directly from it. It is not, however, a developer-focused, and -friendly, version of CSS.

#### Developer Tailored Version

The conversation started in 2020 in the CSSWG's Github: [[meta] Creating an author-focused entry point summarizing the state of CSS](https://github.com/w3c/csswg-drafts/issues/4752). The idea is to create a version of CSS4 that is tailored specifically for web developers, with a focus on usability and practicality.

The model I think about when I think of this approach is the [HTML Living Standard for Web Developers](https://html.spec.whatwg.org/dev/introduction.html) which is a developer-focused version of the HTML Living Standard. It provides a clear and concise overview of the features and capabilities of HTML, with examples and best practices for using them in real-world scenarios.

Living Standard for Web Developers does a great job of defining the audience for the document:

>This specification is intended for authors of documents and scripts that use the features defined in this specification.
>
> This document is probably not suited to readers who do not already have at least a passing familiarity with web technologies, as in places it sacrifices clarity for precision, and brevity for completeness. More approachable tutorials and authoring guides can provide a gentler introduction to the topic.
>
> In particular, familiarity with the basics of DOM is necessary for a complete understanding of some of the more technical parts of this specification. An understanding of Web IDL, HTTP, XML, Unicode, character encodings, JavaScript, and CSS will also be helpful in places but is not essential.
>
> &mdash; [HTML Living Standard for Web Developers](https://html.spec.whatwg.org/dev/introduction.html#audience)

This approach would require significant effort to create and maintain, as it would need to be kept up to date with the latest developments in CSS. It would also require input and feedback from the web development community to ensure that it meets their needs and expectations.

The first step in this approach would be to define the audience for the document... what skills and knowledge do we expect from the readers? What are their goals and challenges when using CSS? Once we have a clear understanding of the audience, we can start to define the content and structure of the document.

#### Additional Tools

In addition to having a single specificationm we could also provide additional tools to help developers understand and use CSS effectively, regardless of versioning.  The idea behind these tools is to provide developers with a single point of referece for CSS features.

##### List Of All Available Features

A comprehensive list of all CSS features, along with their status (e.g., experimental, stable, deprecated) and browser support information. This would help developers get an idea of what's available but not what they can be used in production today.

You can see an example at [CSS Features](https://css-feature-viewer.rivendellweb.net/#properties).

This is different from [caniuse.com](https://caniuse.com/) in that it would include all features, not just those that are widely supported. It would also provide links to relevant specifications and documentation.

##### Features Available In Browsers Today

This tool would provide a list of CSS features that are supported in modern browsers. This would help developers understand what they can use in production today
