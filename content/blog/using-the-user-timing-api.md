---
title: Using The User Timing API
date: 2025-05-07
tags:
  - Performance
  - Javascript
  - Web
---
The [User Timing](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/User_timing) API allows you to measure the performance of your web application. It provides a simple way to create custom metrics that you can use to measure the performance of your application.

In this post, we'll look at what is the User Timing API, how you can use it to instrument your code, how you can and measure the performance of your web application.

## What is the User Timing API?

The browser adds information (*performance entries*) to the browser's performance timeline including entries provided by the [Resource Timing API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing) that determine the time it takes to fetch a resource like an image.

There is no way for the browser to determine what is happening in your application. The User Timing API is an extension to the browser's performance timeline and helps you to measure and record vustom performance data for your application.

The advantages of this API over [Date.now()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) or [performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), are that:

* You can name the markers
* They integrate with browser performance tooling
* How they integrate with performance APIs like [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver)

## How to add marks and measures?

The User Timing API allows you to create custom performance metrics. You can use it to measure the time it takes for a specific piece of code to execute, or the time it takes for a specific event to occur.

This example, taken from this blog, shows how to use the user timing API to measure the time it takes to load a file or a group of files.

For each item we want to measure we create two marks, one where we want to start measuring and one where we want to end. Along with the ending mark, we create a measure to calculate the time between the two marks.

```html
<script>
	performance.mark('start load css');
</script>
<link rel="preload" href="/css/index.css" as="style">
<link rel="stylesheet" href="/css/index.css">
<script>
	performance.mark('end load css');
	performance.measure('load css', 'start load css', 'end load css');
</script>

<script defer="" src="https://tinylytics.app/embed/qBUTwx2TFjavF6-RT8uP.js"></script>

<script>
	performance.mark('start load prism scripts');
</script>
<script
	defer=""
	src="/js/prism/components/prism-core.js"></script>
<script
	defer=""
	src="/js/prism/plugins/autoloader/prism-autoloader.js"></script>
<script
	defer=""
	src="/js/prism/plugins/toolbar/prism-toolbar.js"></script>
<script
	defer=""
	src="/js/prism/plugins/copy-to-clipboard/prism-copy-to-clipboard.js"></script>
<script
	defer=""
	src="/js/prism/plugins/show-language/prism-show-language.js"></script>
<script>
	performance.mark('end load prism scripts');
	performance.measure(
		'load prism',
		'start load prism scripts',
		'end load prism scripts');
</script>
<script>
	performance.mark('start load prism css');
</script>
<link
	rel="preload"
	href="/css/prism.css" as="style">
<link
	rel="stylesheet"
	href="/css/prism.css">
<script>
	performance.mark('end load prism css');
	performance.measure(
		'load prism css',
		'start load prism css',
		'end load prism css');
</script>
```

The measures will appear in the performance timeline and can be viewed in the performance tab of the developer tools.

## Observing performance measures

The preferred way to get notifications about custom performance measures is to use [PerformanceObserver](https://developer.mozilla.org/en-US/docs/Web/API/PerformanceObserver) objects. They allow you to subscribe to performance marks and measures as they happen.

This example creates a `perfObserver` function that will be called when a performance entry is added to the performance timeline. The `perfObserver` function will log the name and duration of marks and measures to the console.

It then creates a `startPerformanceObserver` function that creates calls `perfObserver` and starts observing performance entries.

```typescript
export function perfObserver(
  list: PerformanceObserverEntryList,
  observer: PerformanceObserver
): void {
  list.getEntries().forEach((entry: PerformanceEntry) => {
    if (entry.entryType === 'mark') {
      console.log(`${entry.name}'s startTime: ${entry.startTime}`);
    }
    if (entry.entryType === 'measure') {
      console.log(`${entry.name}'s duration: ${entry.duration}`);
    }
  });
}

export function startPerformanceObserver(): PerformanceObserver {
  const observer = new PerformanceObserver(perfObserver);
  observer.observe({ entryTypes: ['mark', 'measure'] });
  return observer;
}
```

## Removing performance entries

To clean up all performance marks or measures, use `performance.clearMarks()` or `performance.clearMeasures()` (note that the commands use plural). You can use these methods to remove all performance entries from the performance timeline.

```typescript
// Clear all marks
// Clear all measures
performance.clearMarks();
performance.clearMeasures();
```

Removing specific performance entries, you can pass the name of the mark or measure you want to remove as an argument to `performance.clearMarks()` or `performance.clearMeasures()`.

```typescript
// Removes the marker with the name "myMarker"
performance.clearMarks("myMarker");

// Removes the measure with the name "myMeasure"
performance.clearMeasures("myMeasure");
```

