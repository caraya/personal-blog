---
title: "Web Vitals and Google Analytics"
date: 2026-07-13
tags:
  - Web Vitals
  - Google Analytics
  - Performance Monitoring
---

This guide covers how to capture Core Web Vitals locally using pure ES Modules (without a bundler or import maps) and route that data to an analytics platform so you can monitor real user performance.

## Local Setup & Implementation

To avoid third-party dependencies and build steps, host the library locally and use native browser modules.

### Download the Library

Download the self-contained ES Module version of the web-vitals library directly from a CDN.

1. Navigate to <https://cdn.jsdelivr.net/npm/web-vitals@5.2.0/+esm> in your browser.
2. Save the contents of that page to your project directory at `/js/web-vitals.js`.

### Create the Tracking Logic

Create a file named `/js/vitals.js`. Because you aren't using import maps or bundlers, you must use the exact import path (including the `.js` extension) for the local module.

```js
import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

function logMetric(metric) {
  console.log(`Metric: ${metric.name} | Value: ${Math.round(metric.value)}`);
}

export function initializeLocalWebVitals() {
  onCLS(logMetric);
  onINP(logMetric);
  onLCP(logMetric);
}

initializeLocalWebVitals();
```

### Optimize the HTML Loading

To get the best performance and avoid request waterfalls, load the tracking logic as an external script in the `<head>` of your HTML document.

Use `<link rel="modulepreload">` to make the browser download the `web-vitals.js` module in parallel with your logic script.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Self-Hosted Web Vitals</title>

  <!-- 1. Preload the library in the background -->
  <link rel="modulepreload" href="/js/web-vitals.js">

  <!-- 2. Load the logic script (automatically deferred until HTML is parsed) -->
  <script type="module" src="/js/vitals.js"></script>
</head>
<body>
  <h1>Performance Tracking Enabled</h1>
</body>
</html>
```

## Routing Data to Analytics

Once the local setup is verified in your console, replace the `console.log` with a function that transmits the data to your analytics platform.

Two key principles for sending Web Vitals data:

1. Use `metric.delta` instead of `metric.value`: Some metrics (like CLS and INP) update multiple times throughout a page's lifecycle. Sending the delta ensures you only send the change since the last report, preventing double-counting.
2. Include `metric.id`: This unique identifier allows your analytics tool to group multiple updates from the exact same page load together.

### Option A: GA4 via Unified Parameter (Conserves Quota)

This method sends all metrics through a single `metric_value` parameter. This saves your GA4 custom metric quota (using 1 slot instead of 3). To preserve CLS precision in an integer-like field, multiply CLS by 1,000 (for example, `0.125` becomes `125`).

Update your `/js/vitals.js` file:

```js
import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

function sendToGoogleAnalytics(metric) {
  if (typeof window.gtag !== 'function') return;

  const metricValue = metric.name === 'CLS' ? Math.round(metric.delta * 1000) : Math.round(metric.delta);

  window.gtag('event', 'web_vitals', {
    metric_name: metric.name,
    metric_id: metric.id,         // Crucial for deduplication
    metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
    metric_value: metricValue,
  });
}

export function initializeLocalWebVitals() {
  onCLS(sendToGoogleAnalytics);
  onINP(sendToGoogleAnalytics);
  onLCP(sendToGoogleAnalytics);
}

initializeLocalWebVitals();
```

### Option B: GA4 via Distinct Parameters (Preserves Precision)

This method routes each metric to its own dedicated parameter. This uses 3 custom metric slots in GA4, but allows you to view the exact original decimal value for CLS in your reports without doing any mental math or division.

Update your `/js/vitals.js` file:

```js
import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

function sendDistinctToGoogleAnalytics(metric) {
  if (typeof window.gtag !== 'function') return;

  const params = {
    metric_id: metric.id,         // Crucial for deduplication
    metric_rating: metric.rating, // 'good', 'needs-improvement', or 'poor'
  };

  // Route the value to a specific parameter based on the metric name
  if (metric.name === 'CLS') {
    params.cls_value = metric.delta;             // Sent as standard decimal
  } else if (metric.name === 'INP') {
    params.inp_value = Math.round(metric.delta); // Sent as milliseconds
  } else if (metric.name === 'LCP') {
    params.lcp_value = Math.round(metric.delta); // Sent as milliseconds
  }

  window.gtag('event', 'web_vitals', params);
}

export function initializeLocalWebVitals() {
  onCLS(sendDistinctToGoogleAnalytics);
  onINP(sendDistinctToGoogleAnalytics);
  onLCP(sendDistinctToGoogleAnalytics);
}

initializeLocalWebVitals();
```

### Option C: Sending to a Custom Backend (Privacy-First)

Since you are hosting the library locally to avoid third parties, you may also want to send this data to your own server. The most reliable way to send analytics data without blocking the main thread or losing data on page unload is the `navigator.sendBeacon()` API.

Update your `/js/vitals.js` file:

```js
import { onCLS, onINP, onLCP } from '/js/web-vitals.js';

const ANALYTICS_ENDPOINT = '/api/analytics/vitals';

function sendToCustomEndpoint(metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    id: metric.id,
    path: window.location.pathname,
  });

  // sendBeacon guarantees delivery even if the user closes the tab
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
  } else {
    // Fallback for older browsers
    fetch(ANALYTICS_ENDPOINT, {
      body,
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export function initializeLocalWebVitals() {
  onCLS(sendToCustomEndpoint);
  onINP(sendToCustomEndpoint);
  onLCP(sendToCustomEndpoint);
}

initializeLocalWebVitals();
```

If you use this custom endpoint method, your backend will receive standard POST requests. Group records in your database by the `id` field. For example, if you receive 3 CLS events with the same `id`, sum their `delta` values to get the final CLS score for that user's specific page view.

## Registering Custom Definitions in GA4

If you implemented Option A or B, GA4 automatically receives your custom parameters. However, it will not display them in reports until you map them in the Admin panel.

### Understanding the Event Connection

You do not need to pre-register the `web_vitals` event itself. The JavaScript snippets in this guide already trigger an event named `web_vitals` (using `window.gtag('event', 'web_vitals', ...);`). By creating the custom definitions below and mapping them to specific event parameters, you instruct GA4 to process these parameters on incoming events, including `web_vitals`.

### Understanding Dimensions vs. Metrics

The web-vitals library generates the `metric_id` and `metric_rating` values automatically. You do not need to write custom logic to calculate them.

* **metric_rating**: The library compares the raw performance value against official Core Web Vitals thresholds. For example, if the Largest Contentful Paint (LCP) takes 2.1 seconds, the library evaluates that against the standard 2.5-second threshold and assigns a rating of `good`. The library outputs one of three string values: `good`, `needs-improvement`, or `poor`.
* **metric_id**: The library generates a unique, random string identifier for the current page lifecycle. Metrics like CLS and INP update multiple times throughout a page visit. By attaching this unique ID to every event, the library allows Google Analytics (or your custom backend) to group all updates from a single page view together. This enables the analytics platform to deduplicate events and calculate the final score.

### Why register these as custom dimensions?

In Google Analytics 4, distinguish between quantitative data (metrics) and qualitative data (dimensions):

* **Metrics are for math**: A metric is a number you measure, sum, or average. You must register `metric_value` (the actual score, such as `2500` for LCP or `125` for CLS) as a custom metric so GA4 can calculate user averages over time.
* **Dimensions are for grouping and filtering**: A dimension describes or categorizes your data. You cannot average the word `good`, so `metric_rating` must act as a dimension used to segment reports. Similarly, while `metric_id` contains numbers, you do not sum or average page IDs. You use the ID strictly as a label to group individual updates, making it a dimension.

**Important note on event parameters:**

The event parameter fields for both custom metrics and custom dimensions are combo boxes, not strict dropdown menus. While they auto-populate with parameters that Google Analytics has already processed, you can manually type any parameter name directly into the field if it has not appeared yet. Because of this, you do not need to wait for data to process, and the order in which you create your metrics and dimensions does not matter.

### Navigation Steps

1. Log in to Google Analytics and open your property.
2. Click the `Admin` gear icon in the left navigation.
3. In property settings, open `Data display`.
4. Click `Custom definitions`.

#### Setup for Option A: Unified Parameter

If you implemented Option A in your tracking logic, follow these steps to set up your GA4 definitions.

1. Register the custom metric.
   In `Custom definitions`, stay on the `Custom metrics` tab, click `Create custom metric`, and create one metric:
   * Metric name: `Metric Value`
   * Scope: `Event`
   * Event parameter: `metric_value`
   * Unit of measurement: `Standard` (this supports both time-based values like LCP/INP and unitless values like CLS).
2. Register custom dimensions.
   Switch to the `Custom dimensions` tab, click `Create custom dimension`, and create these three event-scoped dimensions:
   * Dimension name: `Metric Name` | Event parameter: `metric_name`
   * Dimension name: `Metric ID` | Event parameter: `metric_id`
   * Dimension name: `Metric Rating` | Event parameter: `metric_rating`

#### Setup for Option B: Distinct Parameters

If you implemented Option B in your tracking logic, follow these steps to set up your GA4 definitions.

1. Register custom metrics.
   In `Custom definitions`, stay on the `Custom metrics` tab, click `Create custom metric`, and create three event-scoped metrics:
   * Metric name: `CLS Value` | Event parameter: `cls_value` | Unit: `Standard`
   * Metric name: `INP Value` | Event parameter: `inp_value` | Unit: `Milliseconds`
   * Metric name: `LCP Value` | Event parameter: `lcp_value` | Unit: `Milliseconds`
2. Register custom dimensions.
   Switch to the `Custom dimensions` tab, click `Create custom dimension`, and create two event-scoped dimensions:
   * Dimension name: `Metric ID` | Event parameter: `metric_id`
   * Dimension name: `Metric Rating` | Event parameter: `metric_rating`

After creating these, it can take 24 to 48 hours for data to begin populating in standard reports.

Because `metric_id` and `metric_rating` are shared parameters used by all three metrics, you only need to create these dimensions once. GA4 will automatically apply them to the CLS, INP, or LCP values sent in the same event. You also do not need a Metric Name dimension for this option, as the distinct value parameter already identifies the metric.

## Viewing Your Data in GA4

Once your tracking code is live and your custom definitions are registered, you need to know where to find this data in the Google Analytics interface.

### Immediate Verification (DebugView)

Because standard reports can take 24 to 48 hours to process new custom dimensions, verify your setup immediately with DebugView.

In GA4, go to `Admin > Data display > DebugView`.

Navigate your website using a browser extension like Google Analytics Debugger, or use preview mode in Google Tag Manager.

Interact with the page (click somewhere to trigger INP) and scroll around.

Watch the DebugView timeline. You should see a `web_vitals` event appear. Click it to verify that your parameters (for example, `metric_name`, `metric_rating`, `metric_value`, or `cls_value`) are attached.

### Standard Event Reports (After 24 to 48 Hours)

Once data has processed, you can see a high-level overview in the standard reports.

Navigate to `Reports > Engagement > Events` in the left sidebar.

Look for `web_vitals` in the event table and click on it.

This opens an event-specific dashboard where you will see cards automatically generated for your newly registered Custom Dimensions (like a breakdown of Metric Rating).

### Creating Custom Dashboards (Explorations)

The standard reports are limited. To analyze performance in depth, use Explorations. This is where registering custom definitions pays off.

Click `Explore` in the left navigation menu.

Select Blank to create a new exploration.

* Under the Variables panel on the far left, click the + next to Dimensions. Search for and import Event name, Metric Name, and Metric Rating.
* Click the + next to Metrics. Search for and import your custom metric(s) (e.g., Metric Value, or CLS Value, INP Value, etc.) as well as Event count.

Now, build your report in the Settings panel:

* Drag Event name into the Filters box, and set it to exactly match `web_vitals`.
* Drag Metric Name and Metric Rating into the Rows box.
* Drag your custom metric(s) (e.g., Metric Value) into the Values box.

You now have a custom table that breaks down your Core Web Vitals and shows how many users experience `good`, `needs-improvement`, or `poor` performance for each metric.
