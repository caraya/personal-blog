---
title: "PWA Starter: Introduction"
date: "2017-10-30"
---

Last year I worked at Google creating [ILT curriculum for Progressive Web Applications](https://developers.google.com/web/ilt/pwa/). It's a great idea and I think the final product worked well, but it's not complete. If you're getting started you need hand holding but what if you've built PWAs before and want a reference or examples that will do what you want so you can either modify them for your project or copy it as is.

I'm making assumpttions that you're already familiar with the technologies that make up a progressive web application so I won't delve too much in the details about what they are. I'm also assuming that you've already created your build system, minimize your scripts and style sheets and other performance optimizations.

Also note that **we're only working on the technical side of a PWA**. When we look at the PWA Checklist we'll see that there are other aspects to a good and exemplary PWA than what we cover in detail below.

If you're interested in learning more about PWAs you can check the [manual](https://google-developer-training.gitbooks.io/progressive-web-apps-ilt-concepts/content/) my team wrote for PWA concepts.

## Quick Recap

<iframe width="560" height="315" src="https://www.youtube.com/embed/eodArdGRIVQ?rel=0" frameborder="0" allowfullscreen></iframe>

Frances Berriman and Alex Rusell [coined the term](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/) **progressive web application** in 2015 to describe a set of technologies that enable web content (sites or applications) to behave more like native mobile apps without loosing the advantages of the web. According to the Alex these applications would work like this:

> 1. The site begins life as a regular tab. It doesn’t have super-powers, but it is built using Progressive App features including TLS, Service Workers, Manifests, and Responsive Design.
> 2. The second (or third or fourth) time one visits the site — roughly at the point where the browser it sure it’s something you use frequently — a prompt is shown by the browser (populated from the Manifest details)
> 3. Users can decide to keep apps to the home screen or app launcher
> 4. When launched from the home screen, these apps blend into their environment; they’re top-level, full-screen, and work offline. Of course, they worked offline after step 1, but now the implicit contract of “appyness” makes that clear.
> 
> Alex Russell: [Progressive Web Apps: Escaping Tabs Without Losing Our Soul](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/)

### For sites or apps only?

<iframe width="560" height="315" src="https://www.youtube.com/embed/KRSTpo6gqqU?rel=0" frameborder="0" allowfullscreen></iframe>

Naming progressive web applications can be a little tricky. Do the technologies only apply to web applications or can we use the technologies when building web sites?

I think that we don't need to make the distinction. These technologies will work just as well with websites when used properly. Granted there are new technologies in the web stack that are more appropriate for applications than sites (thinking about the payment API)

As Aaron Gustafson points out:

> “Web apps” in this context can be any website type—a newspapers, games, books, shopping sites—it really doesn’t matter what the content or purpose of the website is, the “web app” moniker is applicable to all of them. The term could just have easily been progressive web site and it may be helpful to think of it as such. It doesn’t need to be a single page app. You don’t need to be running everything client side. There are no particular requirements for the type of PWA you are developing. Aaron Gustafson — [Progressive Web App And The Windows Ecosystem](https://www.aaron-gustafson.com/notebook/progressive-web-apps-and-the-windows-ecosystem/)

I like to think that the PWA is a better way to build our web content that combine the best things of the web for an experience that works almost like a native application. We get ease of use and a technology stack that we're familiar and comfortable with (PWAs don't dictate the stack you use, only that they have a manifest and a service worker) and a rapidly growing set of APIs available.

See Aaron's full presentation from Microsoft Build to get a better idea of progressive enhancement in the context of a PWA:

<iframe src="https://channel9.msdn.com/Events/Build/2017/B8075/player?format=html5" width="640" height="360" allowfullscreen frameborder="0"></iframe>

### Toolkit or Recipes?

PWAs are a toolkit that will give you the tools and methods to create your applications and sites. You're expected to write more code but you also decide the functionality

To avoid issues like those [faced with App Cache](https://alistapart.com/article/application-cache-is-a-douchebag) service workers make no assumptions about how you will cache your content and what else you can and will do with the tools you have available.

In this post we'll talk about the technologies that make a basic PWA: web application manifest and service worker and discuss basic ways of configuring them.

### Rememeber: HTTPS only!

For a PWA to work it must be served through HTTPS with a modern encryption schema. As we'll see in the service worker section they are powerful and any mistakes you make when creating them can have serious security repercusions. so TLS/HTTPS only.
