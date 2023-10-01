---
title: "Application Shells and Service Workers: Caching Strategies"
date: "2016-05-16"
categories: 
  - "technology"
---

# Caching strategies: what, how, when

Jake Archibald’s [Offlline Cookbook](https://jakearchibald.com/2014/offline-cookbook/) outlines several strategies to use Service Workers. The two most common ones are cache-first and network-first.

In a `cache-first` situation we check the cache for the resource we requested and if it’s not in the cache then we fetch it from the network. This works on second and subsequent visits as on first visit the cache will be empty.

`network first` is the opposite. We fetch the resource from the network and if that fails we check the cache for the resource.

I use a third strategy I dubbed `network-only` which is nothing more than the traditional fetch strategy. I use it when the resource is too large to store in the cache. Videos are what comes to mind when thinking abou this.

Check the Offline Cookbook for other scenarios and techniques for using Service Workers.
