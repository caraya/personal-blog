---
title: Is the great divide (still) a thing?
date: 2024-09-11
tags:
  - CSS
  - Javascript
  - Competition
youtube: true
---

![Who gets the job?](https://i0.wp.com/css-tricks.com/wp-content/uploads/2019/01/jobbs.png?ssl=1)

In 2019, Chris Coyier wrote [The Great Divide](https://css-tricks.com/the-great-divide/) where he discusses the differences between different types of front end developers.

This post will explore the great divide: what is it, are we still experiencing it, what makes the issue more complicated than what we think and where to go from where we're at right now.

## What is the great divide?

In this context the divide refers to people who have the same job title, ***front end developer*** but with very different skill sets. Paraphrasing [Chris' article](https://css-tricks.com/the-great-divide/):

On one hand, we have a group of developers whose skillsets revolve around Javascript, usually one or more frameworks and a deep understanding of the core language.

On the other hand, there's a group of developers whose skillsets are focused in different areas of front end development, like HTML, CSS, design systems, accessibility, and many others.

So if we're so different, why do we keep the same title?

## Are we still experiencing it

Let's take a trip down memory lane.

The divide began when Javascript, and advanced programming constructs like MVC, functional programming, higher-order functions, and others, became required to build an application front end using libraries like React.

We must also remember that, at the time the debate first came to the fore, most if not all tools were written in Javascript. Writing tools in Go or Rust wouldn't come until later.

Vernon Joyce’s article, “[Is front-end development having an identity crisis?](https://dev.to/assaultoustudios/is-front-end-development-having-an-identitycrisis-2224)” written in 2018, presents a different take on the issue (emphasis mine):

> Traditionally speaking the front-end could be defined as the UI of an application, i.e. what is client-facing. This however seems to have shifted in recent years as employers expect you to have more experience, know more languages, deploy to more platforms and often have a 'relevant computer science or engineering degree'.
>
> Frameworks like Angular or libraries like React require developers to have a much deeper understanding of programming concepts; concepts that might have historically been associated only with the back-end. MVC, functional programming, high-order functions, hoisting... **hard concepts to grasp if your background is in HTML, CSS and basic interactive JavaScript**.
>
> This places an unfair amount of pressure on developers. They often quit or feel that there is no value in only knowing CSS and HTML. Yes technology has evolved and perhaps knowing CSS and HTML is no longer enough; but we have to stop and ask ourselves what it really means to be a front-end developer.
>
> Having started out as a designer I often feel that my technical knowledge just isn't sufficient. 'It secures HTTP requests and responses' wasn't deemed a sufficient answer when asked what an SSL certificate was in a technical interview for a front-end role. Don't get me wrong, these topics are important, but are these very technical details relevant to the role?

This has become even more complicated since these articles were written. We've chosen to move a lot of things we can do in CSS to Javascript, even considered moving CSS generation itself to Javascript so it became tempting to use Javascript for all things, even if it means we have to introduce build steps into our development process.

Some examples:

You can use the [web animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) to run keyframe animations.

You can use Javascript to create 3D animations an augmented reality experiences using [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) and the [Web XR device API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API).

Most UI frameworks and libraries use Javascript to generate the HTML that browsers will render; tools like [JSX](https://react.dev/learn/writing-markup-with-jsx) will convert the code into Javascript objects and from there it will use the Javascript to create HTML to render. There are also libraries like [HAML](https://haml.info/) or [Pug](https://pugjs.org/api/getting-started.html) to abstract the creation of HTML so people when compiled using Javascript.

Rather than creating applications that navigate between pages we moved to [AJAX](https://web.archive.org/web/20050225020534/http://adaptivepath.com/publications/essays/archives/000385.php) (coined by Jesse James Garrett in 2005) as the combination of a series of technologies available at the time (and what replaced them since):

> * [standards-based presentation](https://web.archive.org/web/20050222032831/http://www.adaptivepath.com/publications/essays/archives/000266.php) using XHTML and CSS.
> * dynamic display and interaction using the [Document Object Model](https://web.archive.org/web/20050222032831/http://www.scottandrew.com/weblog/articles/dom_1)
> * data interchange and manipulation using [XML and XSLT](https://web.archive.org/web/20050222032831/http://www-106.ibm.com/developerworks/xml/library/x-xslt/?article=xr) (that have since been replaced by JSON and other lightweight languages)
> * asynchronous data retrieval using [XMLHttpRequest](https://web.archive.org/web/20050222032831/http://www.xml.com/pub/a/2005/02/09/xml-http-request.html) that has evolved into the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
> * [JavaScript](https://web.archive.org/web/20050225020534/http://www.crockford.com/javascript/javascript.html) binding everything together.

Since we don't need to reload pages to get new content, we can create [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application) where AJAX replaces content on an app without reloading the full page.

All these tools and technologies disincentivize learning and using HTML directly, let Javascript handle it.

This is not helped by code bootcamps that, following market trends, concentrate on Javascript-heavy solutions and by employeers who put unrealistic expectations in terms of skills required to work as a front-end developer.

Even WordPress moved from an HTML/PHP to a React-based component architecture for theme and plugin development so now there is a larger incentive for learning React, after all, according to [Hostinger](https://www.hostinger.com/tutorials/wordpress-statistics): "*WordPress is used by 43.4% of all websites. Among those created with a known CMS, the market share is even higher – 62.8%*".

See the [WordPress Developers Resources](https://developer.wordpress.org/) for more information.

Brad Frost's [Front-of-the-front-end and back-of-the-front-end web development](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/) attempts to categorize front-end developers in to front of the front-end and back of the front-end. The differences are mostly on the skills and how they are used.

**Front of the front-end**

> A definition: A front-of-the-front-end developer is a web developer who specializes in writing HTML, CSS, and presentational JavaScript code.
>
> Source: [Front-of-the-front-end and back-of-the-front-end web development](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/)

Their responsibilities may include:

* **Crafting semantic HTML markup** that will work across browsers, assistive technologies, search engines, and other environments that consume HTML
* **Creating CSS code** that control the look and feel of the web experience
* **Authoring JavaScript that primarily manipulates objects in the DOM**
* **Testing across browsers and devices**
* **Optimizing the performance of front-end code** to ensure it works as well in desktop and mobile devices
* **Working with back-of-the-front-end developers** to ensure code compatibility
* **Creating a library of presentational UI components** packaged for public consumption
* **Authoring and documenting a robust, intuitive component API** for the presentational component we create
* **Writing unit tests for the presentational UI component library**
* **Maintaining the presentational components as a product**

**Back of the front-end**

> A definition: A back-of-the-front-end developer is a web developer who specializes in writing JavaScript code necessary to make a web application function properly.
>
> Source: [Front-of-the-front-end and back-of-the-front-end web development](https://bradfrost.com/blog/post/front-of-the-front-end-and-back-of-the-front-end-web-development/)

Their responsibilities can include:

* **Writing application business logic** to handle CRUD functionality and control application state, routing, cache, authentication, and so on.
* **Wiring up, integrating with, and even authoring data sources, services, and APIs**
* **Consuming the UI code authored by the front-of-the-front-end developers** to compose screens and connect real functionality data, and services.
* **Optimizing the performance of JavaScript code**
* **Writing end-to-end, integration, and other tests**
* **Architecting and managing JavaScript-based infrastructure** where it's necessary
* **Managing devops stuff** such as bundlers, deployment tools, CI/CD and others
* **Working with front-of-the-front-end developers** to ensure the UI component library provides all necessary functionality.
* **Working with the product team** to ensure all product states are accurately represented
* **Working with other backend developers and IT** to ensure the right technical infrastructure is in place

While this is a good explanation of the different skills involved, I don't think it goes far enough. Since Brad wrote the article, technologies have evolved and changed and have solved (or made more complicated) the work of a developer (front-end, back-end or full stack).

The line between front-of-the-front-end and back-of-the-front-end can be fuzzy and it's even more so today when we use Javascript to generate styles on the backend with technologies like [CSS-in-JS](https://css-tricks.com/a-thorough-analysis-of-css-in-js/) or [server-side rendering (SSR)](https://www.sanity.io/glossary/server-side-rendering).

Other technologies like [Web Components](https://component-odyssey.com/articles/13-improving-performance-by-changing-two-lines-of-css) encapsulate markup and style in individual components. Shadow DOM hides your component's implementations from the browser so they won't bleed out and your application's styles will not bleed into the component's.

These skillsets vary greatly from developer to developer. It’s totally possible that one developer might be able to perform many tasks across the front-end spectrum and what tasks are required has evolved with the tools  and systems we have in place.

The new technologies we discussed earlier blur the line even further. Who's in charge of creating the code to run CSS-in-JS?  Is it front of the front-end or a back of the front-end developer that needs to create the templates to use in a static site generator? Whose responsibility is it to configure the Static Site Generator?

CSS goes through a similar disincentivization cycle. It's too hard to get to work right, it's too confusing, it's not pefromant enough, it doesn't do what we needed it to, CSS is not a real programming language, it's not Turing Complete.

CSS does enough to accomplish its task, to style the content of the page independent of the markup and what you can do with CSS has improved dramaticall in the last 3 to 5 years.

Like with HTML, all solutions we use to generate CSS (SASS/SCSS, CSS in JS) address some of the perceived shortcomings.

SASS provided [static variables](https://sass-lang.com/documentation/variables/), programming constructs ([@if/@else](https://sass-lang.com/documentation/at-rules/control/if/), [@each](https://sass-lang.com/documentation/at-rules/control/each), [@for](https://sass-lang.com/documentation/at-rules/control/for), [@while](https://sass-lang.com/documentation/at-rules/control/each)), functions (with the [@function](https://sass-lang.com/documentation/at-rules/function/) keyword), and extensibility (via [@mixin and @include](https://sass-lang.com/documentation/at-rules/mixin/)) before CSS implemented some of these features in their specifications.

Encapsulations issues can be addressed with the new [@scope](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope), [nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting/Using_CSS_nesting) and the older [shadow DOM](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) to scope the styles to an element, provide means for the host page styles to affect the or to hide them completely.

CSS keeps implementing new features at a fast pace and that can also cause trouble for front of the front-end developer or whoever ends up in charge of CSS-in-JS.

Which brings us to the final question: Where do we go from here?

## Where to go from where here?

A good thing to do is to define a baseline set of skills that we should all have to some degree. These are important... for example: If we have a good Javascript foundation then it'll be easierto pick up concepts as they are used in Frameworks.

* Semantic HTML: Even if you don't use it, it's always good to have
* CSS: Same thing, even if you use SASS or a CSS-in-JS solution, this is always good to have
* Javascript: This is the Javascript that doesn't include frameworks
* Accessibility: Whatever type of content we create we should be aware of its accessibility implications
* Performance: We should all have at least a basic understanding of what performance is and how we can improve the performance of the sites we work on

I didn't include bundlers or task runners in my basic skills list since there are a lot of alternatives and that is very project dependent or they may serve multiple purposes like Vite.

With a basic set of skills, we can now look at more advanced skills and knowledge.

* Handle any necessary infrastructure requirements and configuration, for example:
  * Bundlers: Pick what your current project is using or what you like best
  * Task runner: Same thing, pick what you like best or what your current project is using
* Testing: Understand the different types of test you may be required to write
  * [Unit](https://aws.amazon.com/what-is/unit-testing/)
  * [End-to-end](https://microsoft.github.io/code-with-engineering-playbook/automated-testing/e2e-testing/)
  * [Integration](https://www.simplilearn.com/what-is-integration-testing-examples-challenges-approaches-article)
* Writing application business logic
* Create and document any necessary APIs
* Write integration code for third-party services and APIs
* Write code using Frameworks or libraries as needed

There are likely more items in each category and they are likely to be specific to a specific teams.
