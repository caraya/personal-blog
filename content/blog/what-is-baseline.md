---
title: What Is Baseline?
date: 2024-05-31
tags:
  - Web
  - Features
  - Baseline
---

If you use web.dev or MDN, you may have seen blocks indicating baseline availability like those in Figures 1 and 2.

![Baseline message as shown on web.dev](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1717014095/webdev-baseline_v0be1b.png)

![Baseline message as it appears on MDN](https://res.cloudinary.com/dfh6ihzvj/image/upload/v1717014095/mdn-baseline_olvxqk.png)

So what does this mean?

Web Platform Baseline (baseline) provides clear information about browser support for web platform features.

It gives developers clear information about which web platform features are ready to use in your projects today.

The core browsers used to determine baseline support are:

* Chrome (desktop and Android)
* Edge
* Firefox (desktop and Android)
* Safari (macOS and iOS)

There are two stages of feature baseline status:

Newly Available:
: The feature becomes supported by all of the core browsers and is considered interoperable.
: You may still have to provide fallbacks for older versions of the core browsers that don't support the feature.

Widely Available:
: 30 months since the feature became newly interoperable.
: This time gives corporate IT teams and other groups that restrict browser versions on their network time to test and deploy browsers that support interoperable features.
: The feature can be used by most sites without worrying about browser support.

Understanding what features are available in the Baseline feature list makes it easier to build a core feature set for your applications that will work out of the box without polyfills or fallbacks.
