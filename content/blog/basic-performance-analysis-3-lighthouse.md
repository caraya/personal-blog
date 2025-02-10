---
title: Basic Performance Analysis (3) - Lighthouse
date: 2025-02-19
tags:
  - Web
  - Performance Optimization
  - User Experience
---

This post will explore what is Lighthouse, how to use Lighthouse in Chrome DevTools and Pagespeed Insights and some of its drawbacks and benefits.

## What is Lighthouse?

Lighthouse is an open-source, automated tool to help you improve the quality of web pages. You can run it on any web page, public or requiring authentication. It has audits for performance, accessibility, progressive web apps, SEO, and more.

It is available as a Chrome extension, a Node module, and a CLI tool. Lighthouse can be run in Chrome DevTools, from the command line, or as a Node module. It is also integrated into Google PageSpeed Insights, Chrome UX Report and PageSpeed Test.

In this post we'll focus on how to use Lighthouse in Chrome DevTools and as a Node.js CLI command, along with some observed issues when using the tool.

## Chrome DevTools

To use Lighthouse in Chrome DevTools, navigate to the page you want to test, open DevTools and do one of the following:

* Press `F12` (Windows)
* Type [[ctrl]] + [[I]] (Windows)
* Type [[cmd]] + [[shift]] + [[I]] (Mac)
* Right-click anywhere on the page and select `Inspect`

Once the DevTools are open, click on the `Lighthouse` tab. You will see the initial view, shown in Figure 1.

The default is to run all available audits in an (emulated) mobile device. You can change the audits to run, the device to use: desktop or mobile (the default), and the [user flows](https://github.com/GoogleChrome/lighthouse/blob/HEAD/docs/user-flows.md) that you want to run the tests under.

For this example, we'll use the defaults and run all tests in an emulated mobile device. Click on the `Analyze page load` button to start the tests.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/lighthouse01' alt='Initial view of Chrome DevTools Lighthouse tab'>
	<figcaption>Initial view of Chrome DevTools Lighthouse tab</figcaption>
</figure>

When the test completes, you will see the first results, as shown in Figure 2. The results are divided into four categories: Performance, Accessibility, Best Practices, and SEO. Each category has a score, and you can click on the category to see more details.

Below the results summary we see detailed information about the performance tests run since it's the first category.

Next, it displays individual metrics that make up the performance score. There is an option to expand the metrics to see brief descriptions of each available metric.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/lighthouse02' alt='Initial view of Chrome DevTools Lighthouse tab'>
	<figcaption>Initial view of Chrome DevTools Lighthouse tab</figcaption>
</figure>

Figure 3 shows a film strip view of the site loading on the device used for the test, it will be different depending on whether it's a desktop of mobile emulation. This is followed by opportunities to improve the performance of the site. Each opportunity has a brief description, a link to learn more, and a button to see the details.

<figure>
	<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/lighthouse03' alt='Lighthouse Results and details about the performance tests'>
	<figcaption>Lighthouse Results and details about the performance tests'></figcaption>
</figure>

Figure 4 shows the desktop view of the Lighthouse tab in Chrome DevTools. The initial view is the same as the mobile view, but the results are different since the tests are run on a desktop device.

<figure>
		<img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/lighthouse04' alt='Initial view of Chrome DevTools Lighthouse tab'>
	<figcaption>Initial view of Chrome DevTools Lighthouse tab</figcaption>
</figure>

The results in the Accessibility, Best Practices, and SEO categories are likely to be the same since they are not affected by the device used for the test.

## Running Lighthouse as a Node module

It is also possible to run Lighthouse as a Node-based CLI application. This is useful when you want to automate the testing of multiple pages or sites.

The first step is to install Lighthouse globally.

```bash
npm install -g lighthouse
```

Then you can run the command against a given website. the `--view` flag will open the generated report in the default browser.

```bash
lighthouse https://publishing-project.rivendellweb.net --view
```

Another way to run Lighthouse is to use Lighthouse directly in your code.

This example uses the [lighthouse](https://www.npmjs.com/package/lighthouse) and [chrome-launcher](https://www.npmjs.com/package/chrome-launcher) NPM packages to run Lighthouse against a given URL and save the report to an HTML file.

```js
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const chrome = await chromeLauncher.launch({
	chromeFlags: ['--headless']
});

const options = {
	logLevel: 'info',
	output: 'html',
	onlyCategories: ['performance'],
	port: chrome.port
};

const runnerResult = await lighthouse(
	'https://publishing-project.rivendellweb.net',
	options
);

const reportHtml = runnerResult.report;
fs.writeFileSync(
	'lhreport.html',
	reportHtml
);

console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

chrome.kill();
```

A future extension of this example could be to set the URL to test as a command line argument or to test multiple URLs in a loop.

## Drawbacks and Benefits

While Lighthouse provides a comprehensive set of tools to analyza a website's performance, it has some drawbacks.

### Score volatility

Lighthouse performance scores are not guaranteed to remain constant. Even when you run the same test on the same browsers, the performance values are not guaranteed to be the same.

When I ran lighthouse against the same site, the mobile performance score varied between 77 and 100 and the desktop score varied between 80 and 100 with the same browser and network connection.

The variability in the overall Performance score and metric values may not be due to Lighthouse. When your Performance score fluctuates it's usually because of changes in underlying conditions that include:

* A/B tests
* Changes in ads being served
* Internet traffic routing changes
* Browser extensions that inject JavaScript and add/modify network requests
* Antivirus software

[Lighthouse's documentation on Variability](https://github.com/GoogleChrome/lighthouse/blob/master/docs/variability.md) covers this in more depth.

Saving Lighthouse data can also be problematic since it's not intuitive and the default format is HTML.

You can save the data as JSON (not the default) using the following command:

```bash
lighthouse https://publishing-project.rivendellweb.net \
--output json \
--output-path ./lighthouse.json
```

You can then use the [Lighthouse Report Viewer](https://googlechrome.github.io/lighthouse/viewer/) to view the report.

## Links and resources

* [Introduction to Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
* [Lighthouse](https://developer.chrome.com/docs/lighthouse/)
* [Google Lighthouse: What It Is & How to Use It](https://www.semrush.com/blog/google-lighthouse/)
* [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/getting-started.md)
* [You Might Not Have A Web Performance Problem](https://www.debugbear.com/blog/poor-performance-score-good-performance)
* [Why Optimizing Your Lighthouse Score Is Not Enough For A Fast Website](https://www.smashingmagazine.com/2024/11/why-optimizing-lighthouse-score-not-enough-fast-website/)
