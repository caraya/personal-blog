---
title: "Even more performance measurements"
date: 2024-01-16
tags:
  - Performance
  - Javascript
---

## Measuring long tasks in our code

```js
// Test for long tasks
test('should capture long tasks on the page', async ({ page }) => {
	// Function to capture long tasks
	async function captureLongTasks(durationThreshold) {
return page.evaluate((threshold) => {
		return new Promise((resolve) => {
			const longTasks = [];
			const observer = new PerformanceObserver((list) => {
					for (const entry of list.getEntries()) {
						if (entry.duration > threshold) {
							longTasks.push(entry);
						}
					}
			});
			observer.observe({ entryTypes: ['longtask'] });

			// Assuming the long tasks will be captured within a certain time frame
			setTimeout(() => {
				observer.disconnect();
				resolve(longTasks);
			}, 5000); // Adjust the timeout as needed
			});
		}, durationThreshold);
	}

	// Capture long tasks
	// 50ms as the threshold for long tasks
	const longTasks = await captureLongTasks(50);

	// Assertions with expect
	expect(longTasks).toBeInstanceOf(Array);
	// Expect no more than 5 long tasks
	expect(longTasks.length).toBeLessThanOrEqual(5);
});
```

## Does the page generate errors if external resources don't load?

```js
test("Tests if page will work when 3rd party resources are blocked", async ({ page }) => {
  page.route("**", (route) => {
    const requestURL = route.request().url()

    if (requestURL.match(/http:\/\/localhost:8080/)) {
      route.continue()
    } else {
      route.abort()
    }
  })

  // monitor emitted page errors
  const errors = []
  page.on("pageerror", (error) => {
    errors.push(error)
  })

  await page.goto("http://localhost:8080")

  console.log(errors)
  expect(errors.length).toBe(0)
})
```

## The impact of service workers on performance measurement

## The impact of the device you're testing with
