---
title: "Application Shells and Service Workers: Introduction"
date: "2016-05-09"
categories: 
  - "technology"
---

# Application Shells and Service Workers

We’ll work through the process of manually adding a service worker without tools or web components. We will then look at building a progressive web application using service workers, sw-toolbox and sw-precache. As we go along we’ll touch on diverse subjects such as:

- Offline as progressive enhancement
- Speed still matters
- Different cache strategies for Service Workers
- sw-toolbox
- Service worker web components
- Progressive Web Applications

## what's a service worker

To start I’ll provide two different definition of what a Service Worker is and then we’ll draw some comparisons and a more detailed definition.

From [Introduction to ServiceWorker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/):

> A service worker is a script that is run by your browser in the background, separate from a web page, opening the door to features which don't need a web page or user interaction. Today, they already include features like push notifications and in the future it will include other things like, background sync, or geofencing. The core feature discussed in this tutorial is the ability to intercept and handle network requests, including programmatically managing a cache of responses.

From the [ServiceWorker specification](https://www.w3.org/TR/service-workers/):

> Service workers are generic, event-driven, time-limited script contexts that run at an origin. These properties make them natural endpoints for a range of runtime services that may outlive the context of a particular document, e.g. handling push notifications, background data synchronization, responding to resource requests from other origins, or receiving centralized updates to expensive-to-calculate data (e.g., geolocation or gyroscope)

Service workers are a type of [web workers](https://www.w3.org/TR/workers/) that support features that don’t require active web pages or user interaction. Their current main use is to provide content caching and offline access and, in the future, will support additional features like Push Notification, Background Sync, Geofencing and others.

Service workers treat you like an adult (in the words of Jake Archibald) by not making any assumptions about what you want to do or how do you want to accomplish it as there are no default ServiceWorker settings or functions. This makes Service Workers harder to learn and to work well with but they make developers responsible for their code.

## Why Service Workers?

Service Workers make the web closer to native apps in a mobile device. Until Service Workers appeared we couldn’t do anything offline and the experience in mobile was fully dependent on the network. If the network died we were relegated to play the dinosaur game when using Chrome or hoping our network would return soon if working on other browsers.

By providing cache and offline access our web content, powerered by Service Workers, gets closer to native without loosing what makes the web awesome… Our content is still HTML, CSS and Javascript, we still reference and discover out content with URLs but now our content remains available when the network is flaky or not available or, as Jeremy Keith discovered, when our server is offline because of maintenance.

Second and subsequent visits to a page under ServiceWorker control will load faster because all the content that hasn’t changed will be served from the local cache rather than the network. In order to update the cache with new content we only need to change 1 character in the ServiceWorker, this will trigger the new version of the worker and update the content as needed.

Service Workers are the basis for a set of new web platform features that will further enhance the user experience: [Push Notification](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web?hl=en) and [Background Sync](https://developers.google.com/web/updates/2015/12/background-sync?hl=en) among others.

For an introduction to ServiceWorker see the video from a presentation by Jake Archibald for [SFHTML5](http://www.meetup.com/sfhtml5/)’s Perf Like a Pirate, 2014

<iframe width="560" height="315" src="https://www.youtube.com/embed/Rr2vXDIVerI?rel=0" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
