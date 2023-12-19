---
title: "Measuring Performance Tasks with Playwright"
date: 2023-01-10
tags:
  - Javascript
  - Testing
---

As I was writing my previous post about Playwright and writing tests I came across [an article](https://www.checklyhq.com/blog/how-playwright-can-monitor-third-party-resources/) that explained how to run performance measurements inside Playwright tests.


## Core Web Vitals

The example runs against your app's local server and will generate the [Largest Contentful Paint](https://web.dev/articles/lcp) value using [performance observers](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) combined with Playwright commands.

Because the local server will not act like your regular server (there are no network requests) the results will be significantly faster than they would be against your production site. You should take this into account when evaluating the tests and, if possible, should also test against your production site.

The CWV tests are broken into separate tests for each of the measurements I want to take.

### before we start

Before we write the test, we'll leverage the `beforeEach` Playwright hook to load the page we want to test before we run each test.

This hook means that we only have to change the URL in one place and not have to change it in multiple locations.

```js
const TEST_URL = "http://localhost:8080";

test.beforeEach(async ({ page }) => {
	await page.goto(TEST_URL);
});
```

### Largest Contentful Paint (LCP)

[Largest Contentful Paint](https://web.dev/articles/lcp) measures how long it takes for the largest image or text block visible within the viewport to render, relative to when the user first navigated to the page.

As currently specified in the [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/), the types of elements considered for Largest Contentful Paint are:

* `<img>` elements
* `<image>` elements inside `<svg>` elements
* Poster images inside `<video>` elements (the poster image load time is used)
* An element with a background image loaded via the `url()` function (and not as a CSS gradient)
* Block-level elements containing text nodes or other inline-level text elements children
* The first frame painted for auto-playing `<video>` elements
* The first frame of an animated image format, such as an animated GIF

The target value is **2.5 seconds** or less.

The test creates a performance observer and observes the `largest-contentful-paint` event to report to the user.

```js
// Test for Largest Contentful Paint (LCP)
test('Largest Contentful Paint (LCP) test', async ({ page }) => {
	const lcp = await page.evaluate(async () => {
		return new Promise((resolve) => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				resolve(entries[ entries.length - 1 ]);
			}).observe({
              type: 'largest-contentful-paint',
              buffered: true
            });
		});
	});

	if (lcp) {
		// Adjust threshold as needed
		expect(lcp.startTime).toBeLessThan(2500);
	}
});
```

### Time To First Byte (TTBF)

[TTFB](https://web.dev/articles/ttfb) measures the time between the request for a resource and when the first byte of the response arrives.

TTFB is the sum of the following request phases:

* Redirect time
* Service worker startup time (if applicable)
* DNS lookup
* Connection and TLS negotiation
* Request, until the first byte of the response has arrived

TTFB is not a Core Web Vitals metric, so sites don't have to meet the "good" TTFB threshold, as long as it doesn't impede their ability to score well on the Core Web Vitals metrics.

A low TTFB is crucial for getting markup out to the client as soon as possible.

If the site loads an application shell and then hydrates it via Javascript, then a low TTFB is especially important so the hydration can happen as quickly as possible.

A server-rendered site that does not require as much client-side work could have a higher TTFB (it'll take longer to get bytes to the client), but better FCP and LCP values than a client-rendered experience since the HTML has already been generated.

The TTFB "good" target is **0.8 seconds (800 milliseconds) or less** for the 75th percentile of users, meaning that the page loads in 0.8 seconds or less for 75% of our users.

The test will calculate TTFB as the difference in milliseconds between the `requestStart` and `responseStart` events.

```js
// Test for Time to First Byte (TTFB)
test('Time to First Byte (TTFB) test', async ({ page }) => {
	const ttfb = await page.evaluate(async () => {
		return new Promise((resolve) => {
			window.performance.mark('start');
			resolve(performance.timing.responseStart - performance.timing.requestStart);
		});
	});

	if (ttfb) {
		expect(ttfb).toBeLessThan(800); // Adjust threshold as needed
	}
});
```

### First Input Delay (FID)

[First Input Delay](https://web.dev/articles/fid) measures the time between a user's first interaction with a page (that is, when they click a link, tap on a button, or use a custom, JavaScript-powered control) and the time when the browser can start processing event handlers in response to that interaction.

FID doesn't measure the event processing time itself nor the time it takes the browser to update the UI after running event handlers.

Sites should target a First Input Delay of 100 milliseconds or less for the 75th percentile of page loads, segmented across mobile and desktop devices.

As pointed out in the Web.dev article, there are issues when measuring FID:

Not all users will interact with your site and have an FID value to measure. The task we defined forces the issue by generating a synthetic click event but it would still be better to track real users in the field.

There are differences between the `first-input` API and the FID metric calculated for Core Web Vitals:

* The API will dispatch `first-input` entries for pages loaded in a background tab but those pages should be ignored when calculating FID
* The API will also dispatch `first-input` entries if the page was backgrounded before the first input happened, but those pages should also be ignored when calculating FID
  * Inputs are only considered if the page was in the foreground the entire time
* The API does not report `first-input` entries when the page is restored from the back/forward cache, but FID should be measured in these cases since users experience them as distinct page visits
* The API does not report inputs that occur within iframes but the metric does as they are part of the user experience of the page and should be considered in FID measurement.

The test will create a performance observer and observer `first-input` entries. If there is more than one item reported, it will take the first one.

We then expect the FID value to be less than 100 milliseconds.

The recommended value for FID is 100 milliseconds or less for the 75th percentile.

```js
// Test for First Input Delay (FID)
test('First Input Delay (FID) test', async ({ page }) => {
	// Wait for 500ms after the page loads
	await page.waitForTimeout(500);

	// Simulate a mouse click (adjust the selector as needed)
	await page.click('#skip');

	// Evaluate FID after the interaction
	const fid = await page.evaluate(async () => {
		return new Promise((resolve) => {
			new PerformanceObserver((entryList) => {
				const entries = entryList.getEntries();
				if (entries.length > 0) {
					resolve(entries[ 0 ]);
				}
			}).observe({
        type: 'first-input',
        buffered: true
      });
		});
	});

	if (fid) {
		expect(fid.processingStart - fid.startTime).toBeLessThan(100); // Adjust threshold as needed
	}
});
```

### Cumulative Layout Shift (CLS)

[CLS](https://web.dev/articles/cls) measures the largest burst of layout shift scores for every **unexpected** layout shift that occurs during the entire lifespan of a page.

A layout shift occurs any time a visible element changes its position from one rendered frame to the next.

A session window (a group of layout shifts), is when one or more layout shifts occur in rapid succession with less than one second in between each shift and a maximum of five seconds for the total window duration.

The largest burst is the session window with the maximum cumulative score of all layout shifts within that window.

The test will create a new performance observer and observe all `layout-shift` performane entries that don't have the `hadRecentInput` attribute attached to them (if the layout shift has the attribute, it means that the use initiated the layout shift.)

The Cumulative Layout Shift should be **equal or less than 0.1 seconds (100 milliseconds).**

```js
test('Cumulative Layout Shift (CLS) test', async ({ page }) => {
	const cls = await page.evaluate(async () => {
		return new Promise((resolve) => {
			let clsValue = 0;
			new PerformanceObserver((entryList) => {
				for (const entry of entryList.getEntries()) {
					if (!entry.hadRecentInput) {
						clsValue += entry.value;
					}
				}
				resolve(clsValue);
			}).observe({ type: 'layout-shift', buffered: true });
		});
	});

	if (cls) {
		expect(cls).toBeLessThan(0.1);
		// Adjust threshold as needed
	}
});
```

### Interaction to Next Paint (INP)

[Interaction to Next Paint](https://web.dev/articles/inp) measures responsiveness to user interactions by observing the latency of all user interactions that occur throughout the lifespan of a user's visit to a page. The final INP value is the longest interaction observed.

We define an interaction as a set of event handlers fired during the same logical user gesture. For example, "tap" interactions on a touchscreen device include multiple events, such as pointerup, pointerdown, and click. An interaction can be driven by JavaScript, CSS, built-in browser controls (such as form elements), or a combination thereof.

An interaction's latency consists of the single longest duration of a group of event handlers that drives the interaction, from the time the user begins the interaction to the moment the next frame is presented with visual feedback.

The test will measure the duration of a click event using two [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now) events, one captured before and one captured after the click event on a designated selector.

It then uses `expect` to measure if the returned value is under our target value.

A good target value for INP is **200 milliseconds (0.2 seconds)** or under for the 75th percentile.

```js
test('Measure interaction to next paint', async ({ page }) => {
	async function measureInteractionToPaint(selector) {
		return page.evaluate(async (selector) => {
			return new Promise((resolve) => {
				// Listen for the next paint event
				requestAnimationFrame(() => {
					const startTime = performance.now();

					// Simulate the interaction
					document.querySelector(selector).click();

					requestAnimationFrame(() => {
						const endTime = performance.now();
						resolve(endTime - startTime);
					});
				});
			});
		}, selector);
	}

	// Measure the interaction to paint time for a specific element
	const time = await measureInteractionToPaint('#yourElementId');

  // Assertions with expect
	expect(time).toBeLessThan(100);
});
```

### Notes on Core Web Vitals

Core Web Vitals are important and you should test if your site passes, the tests, as created for this post, are a good starting point. They will not replace Real User Metrics (RUM) like what you would get from the Chrome User Experience (CrUX) report or from building your own RUM measurements on your app.

## Links and resources

* Core Web Vitals
  * [LCP](https://web.dev/articles/lcp)
  * [TTFB](https://web.dev/articles/ttfb)
  * [FID](https://web.dev/articles/fid)
  * [CLS](https://web.dev/articles/cls)
  * [INP](https://web.dev/articles/inp)
* <https://www.checklyhq.com/blog/how-playwright-can-monitor-third-party-resources/>
* <https://blog.logrocket.com/how-to-practically-use-performance-api-to-measure-performance/>
