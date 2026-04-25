---
title: "Avoiding Overengineering: How to Balance Simplicity and Complexity"
date: 2026-06-22
tags:
  - Web Development
  - Complexity
---

For 13 years, I relied on WordPress to run my blog. While it was a great tool, it was also a pain to maintain and update. Security issues, plugin conflicts, and performance problems were common. I also had to pay for hosting and domain registration.

In 2020, I switched to a static site generator. WordPress’s migration to a React-based block architecture felt too complex and inflexible for my needs. I chose [Eleventy](https://www.11ty.dev/) because it was simple, fast, and easy to use. I also liked that it was built on Node.js, which I already knew.

There is no single best solution for building web applications. Every project has unique requirements. The real challenge is to avoid unnecessary complexity by making thoughtful, context-specific decisions, rather than following trends or adding features for their own sake.

## A brief history of web servers and HTTP

To understand the trade-offs of using a static site generator, it helps to look at how the web evolved from simple document sharing to a complex application platform. In the early 1990s, the web was a straightforward system for sharing static documents using basic protocols and simple servers. As browsers improved and the web became more interactive, new features like forms and server-side scripting increased both capability and complexity.

Each new version of HTTP (from 1.0, 1.1, 2, and now 3) introduced optimizations—such as persistent connections, multiplexing, and better compression—to support richer, more dynamic web applications. These advances enabled the modern web’s power and flexibility, but also contributed to the growing complexity and maintenance burden developers face today.

In short, the evolution of web protocols made today’s sophisticated apps possible, but also set the stage for the overengineering challenges we now encounter.

Each leap in protocol capability has empowered developers, but also increased the risk of building systems that are more complex than necessary. This growing complexity is at the heart of the overengineering dilemma faced by many modern web projects.

## The present: HTTP/3 and the future of the web

HTTP/3, standardized in 2022, builds on the [QUIC protocol (RFC 9000)](https://datatracker.ietf.org/doc/html/rfc9000) to further reduce latency and improve reliability for modern web applications. By addressing limitations in previous versions—such as connection setup speed, multiplexing, and resilience to network changes—HTTP/3 enables even more dynamic and responsive web experiences.

However, like earlier protocol advances, these improvements also contribute to the web’s growing complexity. Each new protocol feature makes it easier to build sophisticated apps, but also increases the potential for overengineering and maintenance challenges.


## Overengineering and the "bear in a bicycle"

The analogy of a "bear on a bicycle" refers to the software engineering complexity that arises when a simple, functional requirement is over-engineered, resulting in a system that is functional but unnecessarily absurd, difficult to maintain, and hard to understand.

The server is just one part of a larger overengineering problem in the web ecosystem. The tools and frameworks we use to build web applications have also become more complex and powerful, but also more difficult to learn, maintain, reason about, secure, and use.

* Does your website really need a database?
* Does your website really need a UI framework or library?
* Does your website really need a build system?

We should ask the same question about every component of our web applications. Do we really need a complex build system, a state management library, or a testing framework? Or can we get by with simpler tools and techniques?

[TypeScript](https://www.typescriptlang.org/) and [Dart](https://dart.dev/) are powerful languages for building web applications. But if you're willing to accept the trade-offs, JavaScript is still a perfectly good language for building web applications. It has a much lower barrier to entry and can be used with a wide variety of tools and frameworks without a build system.

React, Angular, and Vue are powerful frameworks for building web applications, but they also have a steep learning curve and can be difficult to maintain and debug. They require a lot of boilerplate code and configuration, which can be overwhelming for beginners.

### Full-fledged CMSs

Content Management Systems (CMSs) are a good example of the trade-offs between simplicity and complexity in web development.

You can use a CMS like [WordPress](https://wordpress.org/) or [Drupal](https://www.drupal.org/). These are powerful tools that help you build complex websites with many features. However, they also come with a lot of overhead and complexity. You need to learn their interfaces, manage plugins and themes, and deal with security issues. If you want a decoupled frontend, you’ll also need to use the platform’s REST or GraphQL APIs and your favorite frontend framework.

The main advantage of a CMS is that it gives you many features for free, such as user management, content editing, and media handling. However, if you don't need all of these features, or if you want more control over your website's design and functionality, a CMS might be overkill.

### Static site generators

On the opposite end of the spectrum is a static site generator like [Eleventy](https://www.11ty.dev/) (soon to become Build Awesome), [Hugo](https://gohugo.io/), or [Jekyll](https://jekyllrb.com/), made popular by GitHub Pages. These tools let you build a website by writing simple templates and content files, then generating static HTML, CSS, and JavaScript that can be served by any web server.

While you don't get the full feature set of a CMS, you don't have to worry about plugin conflicts, themes, or security vulnerabilities. You also have more control over your website's design and functionality, and you can use any tools and frameworks you want to build your frontend.

### Creating your own solution

You can also choose to build your own solution from scratch. This is the most complex option, but it gives you the most control over your website's design and functionality. You might use a simple web server like [Fastify](https://www.fastify.io/) or [Koa](https://koajs.com/), or build your own server using Node.js or another language.

However, as with any approach, having full control does not guarantee simplicity. Without careful, context-specific decision-making, it’s easy to fall into the trap of overengineering—adding unnecessary features, tools, or abstractions that increase complexity without clear benefit. That’s why evaluating your actual needs and constraints is so important, regardless of which path you choose.

[Ponyfoo](https://ponyfoo.com) is a great example of this approach and the overengineering that can come with it.

The author admits the site was over-engineered. In [How Pony Foo is ridiculously over-engineered — and why that is awesome](https://ponyfoo.com/articles/most-over-engineered-blog-ever), he describes the process as a deliberate learning experience to explore new technologies, design patterns, and architectural techniques. The site is a custom, full-stack application featuring a complex, automated build system and deployment pipeline. It was built using a wide variety of technologies, including Node.js, TypeScript, React, GraphQL, and Docker, evolving through numerous iterations of custom server-side and client-side rendering engines.

Even if we don’t build our own solution from scratch, we can still end up with an over-engineered application. This can happen if we use too many tools and frameworks, or if we add features we don’t really need.

When working on this blog, I chose Eleventy, a static site generator, to keep things simple and avoid the overhead and complexity of a full-fledged CMS. I wanted more control over my website’s design and functionality, and I didn’t need all the features a CMS provides. However, I ended up building a large number of custom elements and plugins to add features that weren’t part of the static site generator, which adds the overhead of different codebases and maintenance.

These are two extremes of the spectrum, and there are many other options in between. The important thing is to evaluate the trade-offs to best fit the project’s needs and your own preferences and skills.

## The drawbacks of simplicity

Static sites are great for content blogs, but they are not pain-free.

In [Abandoning the Static Site](https://schier.co/blog/abandoning-the-static-site), Greg Schier argues that:

> In the six years of using a static site, I’ve written fewer posts than I did in the single year of using a dynamic site. Why? Because updating static sites is a pain. 🤕 Having to run a local server to preview content makes it difficult to publish updates quickly (especially from mobile devices) and even the slightest change requires re-deployment, resulting in wasted time.

As static site generators become more complex and feature-rich, the choices we make have a larger impact. For example, if you store your static Eleventy site in a GitHub repository, you can configure Netlify to automatically deploy your site whenever you push changes. This is a great way to keep your site up to date without having to manually upload files or run commands. However, it also means you need to be careful about what you commit to the repository, and you need to make sure your build process is working correctly.

[The Static Site Paradox](https://kristoff.it/blog/static-site-paradox/) presents a similar argument:

> In front of you are two personal websites, each used as a blog and to display basic contact info of the owner:
>
> 1. One is a complex CMS written in PHP that requires a web server, multiple workers, a Redis cache, and a SQL database. The site also has a big frontend component that loads as a Single Page Application and then performs navigation by requesting the content in JSON form, which then gets “rehydrated” client-side.
>
> 2. The other is a collection of static HTML files and one or two CSS files. No JavaScript anywhere.
>
> If you didn’t know any better, you would expect almost all normal users to have [2] and professional engineers to have something like [1], but it’s actually the inverse: only a few professional software engineers can “afford” to have the second option as their personal website, and almost all normal users are stuck with overcomplicated solutions.

It's a paradox because the simplicity of static sites is also their main drawback. They are not as easy to update and maintain as dynamic sites, and they require more technical knowledge to set up and use. This can lead to fewer updates and less engagement with the site.

Content authoring is the first pain point. Static site generators typically require you to write content in Markdown or another markup language, which can be a barrier for non-technical users. Even for technical users, it can be time-consuming to write and format content in Markdown, especially if you want to include images, videos, or other media.

Tools like [TinaCMS](https://tina.io/) and [Netlify CMS](https://www.netlifycms.org/) can help by providing a user-friendly interface for editing content, but they also add complexity and maintenance overhead, partially defeating the purpose of using a static site generator in the first place.

There’s also the issue of still requiring dynamic components for certain features, like comments, search, and analytics. These features can be added to a static site using third-party services. They can also be implemented to work with a static site, like [Pagefind](https://pagefind.app/) for search or [Staticman](https://new.staticman.net/) for comments, but they add complexity and can be difficult to integrate.

## Conclusion: Evaluating the trade-offs

The trade-offs between simplicity and complexity in web development are not always clear-cut. It depends on the specific needs of the project, the skills and preferences of the developers, and the resources available.

You must also consider your users. As Nicolás Bevacqua points out in [Double-Edged Sword of the Web](https://ponyfoo.com/articles/double-edged-sword-web), the web can be both empowering and limiting, depending on how it is used.

Additionally, analytics can be used to improve the user experience by informing the development of features. However, this is a separate consideration from the trade-offs discussed in Bevacqua’s article.

In the end, the choice remains with the developer. It’s important to evaluate the trade-offs and make informed decisions about the tools and frameworks you use to build your web applications, and to be mindful of the potential for overengineering and a brittle system.
