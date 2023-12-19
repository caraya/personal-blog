---
title: "Firefox on life support"
date: 2024-12-12
tags:
  - Browsers
  - Firefox
---

A few days ago, I came across [Firefox on the brink?](https://www.brycewray.com/posts/2023/11/firefox-brink/). In the article, the author wonders if we're seeing the final decline of Firefox.

According to the article, the US Web Design System provides a set of standards and guidelines for US Federal Government websites. Part of these guidelines include browser support:

> The current major version of the design system (3.0.0) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/).
>
> Source: [Browser Support](https://designsystem.digital.gov/documentation/developers/#browser-support-2)

When the article was written (11/30/2023) Firefox usage was hovering around 2.2%. The numbers don't appear to have changed when I visited the US analytics website on 12/10/2023 but it may be possible that the data hasn't been updated since the analytics service is transitioning to a new provider.

But what happens if the support falls under 2% for government websites and the digital service drops support for Firefox?

According to Firefox on the brink:

> * Once Firefox slips below the 2% threshold in the [US] government’s visitor analytics, USWDS tells government web devs they don’t have to support Firefox anymore.
> * When that word gets out, it spreads quickly to not only the front-end dev community but also the corporate IT departments for whom some web devs work. Many corporations do a lot of business with the government and, thus, whatever the government does from an IT standpoint is going to influence what corporations do.
> * Corporations see this change as an opportunity to lower dev costs and delivery times, in that it provides an excuse to remove some testing (and, in rare cases, specific coding) from their development workflow.
>
> &hellip; and just like that, in less time than you might think, Firefox — the free/open-source browser that was supposed to save the world from the jackboots of Internet Explorer (which had killed Firefox’s ancestor, Netscape Navigator) — is reduced to permanent status as a shrinking part of the fractured miscellany that litters the bottom of browser market-share charts.

There are also other potential consequences. With only two rendering engines left in the market (Blink for Chromium browsers and WebKit for Safari) the pace of innovation will slow down, potentially to a crawl.

Chromium and Blink have a written procedure to develop new features. WebKit has decided not to implement them because of perceived privacy concerns.

If they are the only two major rendering engines in the market there is no real way to stimulate either browser to change their stance on development or to force them to work together so we'll have a unified platform to develop apps.

There is a related area that concerns me.

Other tools use browser market share to make determinations about the tasks they are performing.

Browserslist provides a list of targeted browsers matching preset criteria. It is the list that tools like Autoprefixer, Babel, ESLint, and PostCSS use to determine when to use a polyfill or provide compatibility layers.

Would Browserslist include Firefox in its list of supported browsers?

Browserslist default query covers the following browsers:

* Those with at least 0.5% support
* The last 2 versions of each browser
* Firefox ESR
* Browsers that are not dead (meaning that they've had official support and security updates within the last 24 months)

| Browser | Version | Percentage |
| :--- | :---: | :---: |
| Chrome for Android | 119 | 36.4% |
| Chrome | 120 | 0.02% |
^^ | 119 | 14.7% |
^^ | 118 | 5.4% |
^^ | 117 | 0.70% |
^^ | 109 | 1.8% |
| Safari on iOS | 17.1 | 2.6% |
^^ | 17.0 | 1.6% |
^^ | 16.6-16.7 | 5.2% |
^^ | 16.3 | 0.58% |
^^ | 16.1 | 0.64% |
^^ | 15.6-15.7 | 0.68% |
| Edge | 120 | 0.00% |
^^ | 119 | 3.5% |
^^ | 118 | 0.82% |
| Safari | 17.1 | 0.69% |
^^ | 17.0 | 0.44% |
^^ | 16.6 | 2.1% |
^^ | 15.6 | 0.52% |
| Firefox | 120 | 0.37% |
^^ | 119 | 1.4% |
^^ | 115 | 0.37% |
| Samsung Internet | 23 | 1.8% |
^^ | 22 | 0.25% |
| Opera | 104 | 0.66% |
^^ | 103 | 0.16% |
^^ | 102 | 0.91% |
| Opera Mobile | 73 | 1.1% |
| UC Browser for Android | 15.5 | 0.79% |
| Android Browser | 119 | 0.51% |
| Firefox for Android | 119 | 0.29% |
| QQ Browser | 13.1 | 0.14% |
| KaiOS Browser | 3.0-3.1| 0.00% |
^^ | 2.5 | 0.07%
| Opera Mini | all | 0.06% |
[Browserslist default ]

While it aims for the widest possible support globally, in my opinion, it is too permissive and it will add unnecessary bloat to web applications.

Let's change the defaults to those browsers with more than 2% support, just like the UWDS does for their projects.

If I run the query `> 2%` in the [browserslist playground](https://browsersl.ist/#q=%3E+2%25%0A&region=alt-na) to only query for browsers with more than 2% of support, we get some interesting numbers:

| Browser | Version | Percentage |
| :--- | :---: | :---: |
| Chrome for Android | 119 | 36.4% |
| Chrome | 119 | 14.7% |
^^ | 118 | 5.4%|
| Safari on iOS | 17.1 | 2.6% |
^^ | 16.6-16.7 | 5.2% |
| Edge | 119 | 3.5% |
| Safari | 16.6 | 2.1% |
[List of browsers with 2% support or larger globally]

| Browser | Version | Percentage |
| :--- | :---: | :---: |
| Chrome | 119 | 16.2% |
^^ | 118 | 8.9% |
| Chrome for Android | 119 | 15.0% |
| Safari on iOS | 17.1 | 3.7% |
^^ | 16.6-16.7 | 7.5% |
| Safari | 16.6 | 5.2% |
| Edge | 119 | 4.6% |
[List of browsers with 2% support or larger in North America]

So what happens if your browser doesn't appear in the Browserslist list?

Most of the tools using Browserslist use it to decide if they should use older techniques or polyfills for specific browsers.

For example, Babel's `preset/env` will use the browserslist values to decide if any plugins or core-js features need to be included in the transpiled project.

So, if a browser doesn't appear in the results of a browserslist queries, it will not use modern features supported by the browser creating larger code bundles or unnecessary prefixes added to your stylesheets.

Rather than use the default, you can query based on the features that you need for your site. This would give you even more flexibility in the Javascript you use in your code since it would be tailored for the site's visitors.
