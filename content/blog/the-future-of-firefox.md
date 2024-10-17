---
title: The future of Firefox
date: 2024-10-30
tags:
  - Browsers
  - Firefox
---

A while back I came across [Firefox on the brink?](https://www.brycewray.com/posts/2023/11/firefox-brink/). In the article, the author wonders if we're seeing the final decline of Firefox.

According to the article, the US Web Design System provides a set of standards and guidelines for US Federal Government websites. Part of these guidelines include browser support:

> The current major version of the design system (3.0.0) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/).
>
> Source: [Browser Support](https://designsystem.digital.gov/documentation/developers/#browser-support-2)

When the article was written (10/15/2024) Firefox usage was 1.9% in the last 30-day period.

What happens if the support falls under 2% for government websites and the digital service drops support for Firefox?

According to Firefox on the brink:

> * Once Firefox slips below the 2% threshold in the [US] government’s visitor analytics, USWDS tells government web devs they don’t have to support Firefox anymore.
> * When that word gets out, it spreads quickly to not only the front-end dev community but also the corporate IT departments for whom some web devs work. Many corporations do a lot of business with the government and, thus, whatever the government does from an IT standpoint is going to influence what corporations do.
> * Corporations see this change as an opportunity to lower dev costs and delivery times, in that it provides an excuse to remove some testing (and, in rare cases, specific coding) from their development workflow.
>
> &hellip; and just like that, in less time than you might think, Firefox — the free/open-source browser that was supposed to save the world from the jackboots of Internet Explorer (which had killed Firefox’s ancestor, Netscape Navigator) — is reduced to permanent status as a shrinking part of the fractured miscellany that litters the bottom of browser market-share charts.

There are also other potential consequences. With only two rendering engines left in the market (Blink for Chromium browsers and WebKit for Safari) the pace of innovation will slow down, potentially to a crawl.

The Chromium project has a written procedure to develop new features. WebKit has decided not to implement them because of perceived privacy concerns.

If they are the only two major rendering engines (Blink and WebKit) in the market there is no real way to stimulate either browser to change their stance on development or to force them to work together so we'll have a unified platform to develop apps.

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
| Chrome for Android | 129 | 44.3% |
| Chrome | 129 | 0.01% |
| ^^ | 128 | 2.3% |
| ^^ | 127 | 12.8% |
| ^^ | 126 | 1.5% |
| ^^ | 109 | 1.4% |
| Safari | 18.0 | 0.02% |
| ^^ | 17.6 | 0.42% |
| ^^ | 17.5 | 1.4% |
| Samsung Internet | 25 | 1.3% |
| ^^ | 24 | 0.08% |
| Opera Mobile | 80 | 1.3% |
| UC Browser for Android | 15.5 | 1.1% |
| Firefox for Android | 130 | 0.37% |
| Android Browser | 129 | 0.33% |
| QQ Browser | 14.9 | 0.32% |
| KaiOS Browser | 3.0-3.1 | 0.00% |
| ^^ | 2.5 | 0.05% |
| Opera Mini | all | 0.05% |
| Opera | 114 | 0.00% |
| ^^ | 113 | 0.00% |
| Safari on iOS | 18.0 | 0.16% |
| ^^ | 17.6 | 1.4% |
| ^^ | 17.5 | 8.6% |
| ^^ | 16.6-16.7 | 0.92% |
| ^^ | 15.6-15.8 | 0.74% |
| Edge | 129 | 0.00% |
| ^^ | 128 | 0.92% |
| ^^ | 127 | 3.4% |
| Firefox | 130 | 0.01% |
| ^^ | 129 | 1.1% |
| ^^ | 128 | 0.45% |
| ^^ | 115 | 0.35% |
[Browserslist default ]

While it aims for the widest possible support globally, in my opinion, it is too permissive and it will add unnecessary bloat to web applications.

Let's change the defaults to those browsers with more than 2% support, just like the UWDS does for their projects.

If I run the query `>= 2%` in the [browserslist playground](https://browsersl.ist/#q=%3E+2%25%0A&region=alt-na) to only query for browsers with more than 2% of support, we get some interesting numbers:

| Browser | Version | Percentage |
| :--- | :---: | :---: |
| Chrome for Android | 129 | 24.7% |
| Chrome | 128 | 2.3% |
| ^^ | 127 | 14.1% |
| Safari on iOS | 17.5 | 15.3% |
| Edge | 127 | 5.2% |
[List of browsers with 2% support or larger globally]

If we narrow the results to only North America (`>= 2% in US`), we get a narrower set of results.

| Browser | Version | Percentage |
| :--- | :---: | :---: |
| Chrome for Android | 129 | 24.7% |
| Chrome | 128 | 2.3% |
| ^^ | 127 | 14.1% |
| ^^ | 126 | 3.4% |
| Safari on iOS | 17.6 | 2.6% |
| ^^ | 17.5 | 15.3% |
| Edge | 127 | 5.2% |
| Safari | 17.5 | 3.0% |
[List of browsers with 2% support or larger in North America]

So what happens if your browser (firefox in this case) doesn't appear in the Browserslist list that you selected?

Most of the tools using Browserslist use it to decide if they should use older techniques or polyfills for specific browsers.

For example, Babel and PostCSS `preset/env` plugins will use the browserslist values to decide if any plugins or core-js features need to be included in the transpiled project.

So, if a browser doesn't appear in the results of a browserslist queries, it will not use modern features supported by the browser creating larger code bundles or unnecessary prefixes added to your stylesheets.

Rather than use the default, you can query based on the features that you need for your site.

You can use feature queries (`@supports`) in CSS to only run code if the feature is (or isn't) available.

For example, this code will only execute when the browser does not support subgrid.

```css
@supports not (grid-template-columns: subgrid) {
  /* rules in here */
}
```

In Javascript we have two ways to do  [feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection). The first one is to check if the feature is available in its parent object.

```js
if ("geolocation" in navigator) {
  // Access navigator.geolocation APIs
}
```

The second one is to programmatically create an object and add the property we're testing and see if it persists.

```js
function supports_canvas() {
  return !!document.createElement("canvas").getContext;
}
```

Any of these techniques would help reduce the size of your codebase since we're only using native features when they are supported and choose what, if any, fallback to use when it's not.
