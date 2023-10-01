---
title: "Static Site Generators: Why and why not?"
date: "2016-02-10"
categories: 
  - "technology"
---

All the talk I hear about front end web development has to deal with frameworks, the best way to optimize Javascript and CSS and the best way to minimize the number of HTTP requests. But that’s not the only thing that happens.

The early web was text and text only.

The the [￼first draft of CSS￼ was released in 1994](https://www.w3.org/People/howcome/p/cascade.html) and the [first Javascript implementation didn’t come around until 1995](https://www.w3.org/community/webed/wiki/A_Short_History_of_JavaScript) (with the first beta release of Netscape Navigator 2.0.) And it became a technological competition and it hasn’t really ended, just shifted from browsers and what technology they support to what technology buillt on top of the browser we should be using.

There are times when building a prototype or a site that doesn’t change often or even a blog doesn’t need the overhead of a language like PHP, a framework like Angular or an application like Wordpress to display the content.

Ebooks are also static. I think of them as enhanced static sites so some of the same tools we use to generate static sites can be used to generate ebook content.

## Why go static?

The simplest way to build static content is to manually build your HTML, CSS and, if needed, Javascript. This is the way the web used to work… It is time consuming and error-prone but it still gives you the option of creating clean HTML and CSS that you can then enhance with your framework or library of choice.

Static site generators automate the process. They give you tools and processes to generate static content. As we’ll see brlow, vendors like Github have bundled static generators with their web hosting services and have introduced them to a wider audience than they would have reached on their own (I have to wonder if Jekyll’s popularity is due to it being used in Github Pages or not.)

Until I saw Brian Rinaldi speak about static sites at an sfhtml5 meetup that I got intrigued again by automated static site building. Brian’s presentation is shown below

<iframe width="560" height="315" src="https://www.youtube.com/embed/R-fJWOO1bjE?rel=0" frameborder="0" allowfullscreen></iframe>

Programmers are lazy… Once upon a time Lary Wall described the virtues of a programmer as [laziness, impatience, and hubris](http://www.perl.com/pub/1998/08/show/onion.html): We want things to be fast, we want to do as little as possible to accomplish them and we want to be proud of what we do.

Static site generators can help with these. After the intital configuration you can add as many pages of content as you want without having to code every single page. Most static generators are geared towards blogs but not all of them. In some of the generators below we can build any website. We’ll look at the details when we discuss individual frameworks.

The generator you use may come down to individual preferences. [staticgen.com](http://www.staticgen.com/) provides a comprehensive list of generators that you can filter based on what you wan the tool to have or not have.

### The Github effect

One of the things that, in my opinion, drove up adoption of static site generators in general and Jekyll in particular is Github. As part of the service, you can build a site for each repository you manage.

One of the options for the repositories is to create a branch for a website (`gh-pages`) and then automatically generate a Jekyll-based website for it. You can see what a Github Pages site looks like; This is the repository page for my eBook Experiments repository.

![](//publishing-project.rivendellweb.net/wp-content/uploads/2016/01/github-pages-site-1.png)

Even better is that, after the intial site generation you can go in and manually edit and add to the site as your comfort level with the technology increases.

Going into details regarding Github Pages is beyond the scope of this post. I found a tutorial from the Github team that will cover the content (remember laziness?) :-)

<iframe width="560" height="315" src="https://www.youtube.com/embed/4TrOCv5Kukk?rel=0" frameborder="0" allowfullscreen></iframe>

## Why not static?

One of the main reasons I would not use a static generator is the amount of external content to pull into a site. While it’s true that most generators have plugins to handle comment forms, syntax highighters and most other functionality that you’d expect on a website.

You should think whether that functionality is really needed, whether it’ll increase the load time of your site and whether the extra HTTP requests, round trips to the server and increased load time of your site are worth it.

The final aspect that would turn me away from static site generators is the learning curve. Sooner or later (and in my experience it’s always been sooner) you will have to delve into the underlying language of the tool and that may be too much of a time sink for some people: Why do we need to bother with a static site generator if it’s going to take this long?

I hope to answer that question as we develop a sample site.
