---
title: "The Trap of CDNs"
date: "2014-10-22"
categories: 
  - "technology"
---

## The problem

There is a tricky issue when working with CDN during development. CDN requires an active Internet connection to actually load the script referenced as the source. If you are not online then jQuery will not load the first time you access the page or application and all other scripts will fail as they depend on jQuery (which couldn't load from the CDN and had not local backup)

I first came across this issue when building a site that used carousels and jQuery based animations. I started working on the project while on the train and using the standard Google CDN load mechanism. None of the scripts in the page worked. It wasn't until I saw the following snippet in the HTML5 Boilerplate that made things easier to work with.

## A solution

The trick below uses jQuery but it also applies to any JavaScript library loaded through CDN.

\[code lang=html\] <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script> <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"></script>')</script> \[/code\]

We first load jQuery 1.11.1 from the Google CDN as we normally would.

Right after we load it from CDN we test if the jQuery object exists and, using a logical or statement (`||`). If it exists we use that and if it doesn't then we load a local version of jQuery using `document.write` to inject the script tag into the document.

## Pros and Cons

If you're not careful this system defeats the idea of having CDNs . You end up with multiple copies of jQuery or other libraries spread throughout your projects that your browser, most likely will not cache. This will adversely affect performance.

As I don't expect this situation to happen very often. If Google's CDN goes down there are more serious issues to worry about than my app not working; still this is a good workaround to prevent my content not displaying properly just because of a CDN.
