---
title: Micro front-ends
date: 2024-06-30
draft: true
---

Over the last few years I've been working at understanding micro front ends, what they are and how they work.

I think I'm finally understanding what micro frontends are, how they work and why they are important for large scale projects. This post is my attempt at documenting my understanding.

## Micro frontends

The idea behind micro front ends is related to microservices. As a project grows, it becomes segmented with different teams building different parts of the project.

In this post I'll present my research on and understanding of micro front-ends and how would they work in production

## The Good

Micro front ends provide several advantages over monolithic applications.

Different components can be deployed independently, without having to wait for the entire application to be deployed or updated. This is particularly important when deploying code fixes for security issues.

Because each feature is developed independently, each team has more autonomy and can work at their own pace.

Rather than have a single codebase, each team has their own codebase that includes the front end code. This makes the codebase simpler to work with and reason through.

## The Bad

For all the good things that we get with micro front ends, there are some drawbacks.

* Payload size
* Environment differences
* Operational and governance complexity

## How do they work

There are two sides to micro front ends: HTML/CSS and how they communnicate, usually through Javascript.

If I'm understanding micro front ends correctly, we have to provide a way for the components to talk to each other.

Some techniques to build applications from micro front end based components are:

Server-side template composition
: [Micro Frontends Patterns#12: Server Side Composition](https://dev.to/okmttdhr/micro-frontends-patters-13-server-side-composition-1of5)

Build-time composition
: [Micro Frontends Patterns#13: Build Time Composition](https://dev.to/okmttdhr/micro-frontends-patterns-14-build-time-composition-3kol)

Client-side composition
: [Micro Frontends Patterns#9: Client Side Composition](https://dev.to/okmttdhr/micro-frontends-patterns-14-build-time-composition-3kol)

JAMStack
: [Micro Frontends Patterns#4: JAMstack](https://dev.to/okmttdhr/jamstack-4bo0)

Run-time compostion via Web Components
: How to build Micro-Frontend Architecture with Web Components and BFF [Part 1](https://www.kallemarjokorpi.fi/blog/how-to-build-micro-frontend-architecture-and-bff.html) and [Part 2](https://www.kallemarjokorpi.fi/blog/how-to-build-micro-frontend-architecture-with-web-components-and-bff-part-22.html)

## Links and Resources

* [Micro Frontends](https://martinfowler.com/articles/micro-frontends.html)
* [Micro Frontends](https://microfrontends.com/)
* [Micro Frontends: extending the microservice idea to frontend development](https://micro-frontends.org/)
* [Understanding micro frontends](https://frontendmastery.com/posts/understanding-micro-frontends/)
* [The first book on Front-end Reactive Architectures](https://codeburst.io/the-first-book-on-front-end-reactive-architectures-6e58c661e5ac)
* [Cross micro frontends communication](https://dev.to/luistak/cross-micro-frontends-communication-30m3)
* Webpack [Module Federation](https://webpack.js.org/concepts/module-federation/)
