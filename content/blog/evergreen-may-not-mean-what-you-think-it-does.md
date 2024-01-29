---
title: "Evergreen may not mean what you think it does"
date: 2024-02-17
tags:
  - CSS
  - Typography
draft: true
---

Evergreen browsers are those that update themselves automatically, or very close to it, without user intervention.

This is particularly useful when it comes to new features. We don't have to wait for users up upgrade their browsers, the browsers will update themselves, at least in theory.

In [“Evergreen” Does Not Mean Immediately Available](https://css-tricks.com/evergreen-does-not-mean-immediately-available/), the author explains how evergreen auto updates may not work how you expect and users of modern computers may choose not to shut down their browsers and, as a result, not trigger automatic browser updates unless the user clicks on the download button and then clicks the update button to trigger the update.

This is true for Chrome, Edge and Firefox. They release new versions of the browser every four to six weeks (see the [Firefox Release Calendar](https://whattrainisitnow.com/calendar/), [Chrome release schedule](https://chromiumdash.appspot.com/schedule) and [Microsoft Edge release schedule](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-release-schedule#release-schedule)) and those should get pushed to users shortly thereafter.

There is also another potential blocker for evergreen browser updates: corporate IT teams.

* [Firefox ESR](https://www.mozilla.org/en-US/firefox/enterprise/)
* [Chrome Enterprise](https://chromeenterprise.google/browser/)
* [Edge for Business](https://www.microsoft.com/en-us/edge/business/download?form=MA13FJ)

IT teams may block automatic "evergreen" updates until they've had time to test the newer versions to ensure compatibility with corporate applications.

Likewise, an IT team may choose to use a [Long Term Support (LTS)](https://en.wikipedia.org/wiki/Long-term_support) version of a browser as a risk mitigation strategy.
