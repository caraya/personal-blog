---
title: "Using PageSpeed Insights during development"
date: "2020-09-16"
---

Sometimes it's good to have performance data results as we build our projects. It tells us what we need to work on and where we can tweak things to improve performance.

[PageSpeed Insights](https://developers.google.com/speed/docs/insights/v5/get-started) provides command-line and a website-based tool to measure a site's performance. It combines its own data with information obtained from the [CrUX Report](https://developers.google.com/web/tools/chrome-user-experience-report).

## Installing PSI CLI

The first version of PSI we will install is the CLI version. We install this globally to make sure we can test from anywhere.

```bash
npm i -g psi
```

Once you publish your site to staging or production you can use the `psi` command to check the site for performance.

```bash
psi https://layout-experiments.firebaseapp.com/
```

```txt
--------------------------------------------------------

Summary

URL:          layout-experiments.firebaseapp.com
Strategy:     mobile
Performance:  89

Field Data

The Chrome User Experience Report does not have sufficient real-world speed data for this page.


Lab Data

Cumulative Layout Shift                    | 0.09
First Contentful Paint                     | 1.5s
Largest Contentful Paint                   | 2.0s
Speed Index                                | 3.4s
Time to Interactive                        | 5.7s
Total Blocking Time                        | 310ms

Opportunities

Eliminate render-blocking resources        | 311ms

--------------------------------------------------------
```

While running against a well know domain like `google.com` produces the following result.

```bash
psi https://google.com
```

In the Google.com results, the field data section comes from the CrUX report. Something that wasn't available for the smaller site we tested earlier.

```txt
--------------------------------------------------------

Summary

URL:          google.com
Strategy:     mobile
Performance:  72

Field Data

CUMULATIVE_LAYOUT_SHIFT_SCORE              | 0ms
First Contentful Paint (FCP)               | 1.2s
First Input Delay (FID)                    | 40ms
LARGEST_CONTENTFUL_PAINT_MS                | 1.7s

Lab Data

Cumulative Layout Shift                    | 0
First Contentful Paint                     | 1.8s
Largest Contentful Paint                   | 1.9s
Speed Index                                | 1.8s
Time to Interactive                        | 5.7s
Total Blocking Time                        | 1,260ms

Opportunities

Avoid multiple page redirects              | 780ms
Remove unused JavaScript                   | 1.4s

--------------------------------------------------------
```

This is the easiest way to test a site using PSI but it doesn't lend itself to working with a build system or working with a local development environment before publishing it to staging.

We'll tackle the two issues separately.

## Adding PSI to Gulp-based workflow

The first step is to create the gulp tasks to run PSI both for desktop and mobile profiles. There are plenty of articles that walk you through the process of setting up PSI in Gulp, and getting Gronk to work with PSI in Gulp but they are more than five years old and everything has changed.

The syntax for defining tasks in Gulp has changed and the metrics that PSI reports are different enough that the tasks no longer work out of the box.

We first require our tools, Gulp, and PSI.

The site constant points to the site we want to test, in this case [HTML5 Rocks](http://www.html5rocks.com).

```js
const gulp = require('gulp');
const psi = require('psi');

const site = 'http://www.html5rocks.com';
```

The tasks for mobile and desktop are almost identical. The only things that change in the tasks are the name and the value for `strategy`. Rather than copy both tasks, I'll show the `mobile` task and point out any differences in the `desktop` task.

PSI returns a single category, performance, we use [console.table](https://developer.mozilla.org/en-US/docs/Web/API/Console/table) to display the data in a more readable way than the default JSON output.

Next, we display a table with the three [core web vitals](https://web.dev/vitals/#core-web-vitals) and first contentful paint.

Finally, we dive into each metric to get a finer distribution. What percentage of users fall into which bucket.

```js
gulp.task('mobile', () =>{
  return psi(site, {
    nokey: 'true',
    strategy: 'mobile',
  }).then((data) => {
    console.log('Lighthouse Data');
    console.table(data.data.lighthouseResult.categories);
    console.log('Core Web Vitals');
    console.table(data.data.originLoadingExperience.metrics);
    console.log('FCP Distribution');
    console.table(data.data.originLoadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.distributions);
    console.log('LCP Distribution');
    console.table(data.data.originLoadingExperience.metrics.LARGEST_CONTENTFUL_PAINT_MS.distributions);
    console.log('CUMULATIVE_LAYOUT_SHIFT_SCORE');
    console.table(data.data.originLoadingExperience.metrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.distributions);
    console.log('FIRST_INPUT_DELAY_MS');
    console.table(data.data.originLoadingExperience.metrics.FIRST_INPUT_DELAY_MS.distributions);
  });
});
```

But we still have a problem. PSI will not work with local sites. If you point PSI to localhost:3000 it will not work.

So how do we get around this?

One way is to use `ngrok` directly from the command line. This command will run `ngrok` and provide you with a link that you can give others to view the site on your development machine.

```bash
ngrok http -host-header=rewrite  rivendellweb.local:10004
```

We're still not there. PSI will not work through your router and will not translate your local network addresses into something that can be viewed from the outside.

To run `ngrok` with the Gulp tasks we created to get data from PSI, I've created three additional tasks:

- _ngrok-url_: Creates the ngrok tunnel that we'll use later
- _psiDONE_: Signals task completion. If we don't use something like this task, the process will hang
- _runPSI_: Runs tasks in sequence: ngrok-url, desktop, mobile and psiDONE

```js
gulp.task('ngrok-url', function(cb) {
  return ngrok.connect(10004, function(err, url) {
    url = site;
    console.log('serving your tunnel from: ' + url);
    cb();
  });
});

gulp.task('psiDONE', function() {
  console.log('we\'re done!');
  process.exit();
});

gulp.task('runPSI', gulp.series(
    'ngrok-url',
    'desktop',
    'mobile',
    'psiDONE',
));
```

With all these tasks you now can monitor your site's Lighthouse performance score and web vitals. It does not replace running these tests in staging or production but it's a good indicator for what you need to work during development.

## Conclusions and Credits

I don't know if this method for gathering performance data is still relevant but I always keep it in my pocket, with or without ngrok, to make sure I can get the data before publishing the site to a live server.

I am not certain how much additional latency `ngrok` adds to the process.

The two resources that inspired this post:

- Una Kravets article [Setting up PageSpeed Insights to test Performance Locally via Gulp](https://una.im/gulp-local-psi/)
- Addy Osmani's [psi-gulp](https://github.com/addyosmani/psi-gulp-sample/) example
