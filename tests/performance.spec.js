// @ts-check
const { test, expect } = require("@playwright/test")
// Define the URL for testing
const TEST_URL = 'https://publishing-project.rivendellweb.net';

test.describe('Performance-related tests', () => {
	test.describe('Core Web Vitals', () => {
		// Navigate to the page before each test
		test.beforeEach(async ({ page }) => {
			await page.goto(TEST_URL);
		});

		// Test for Largest Contentful Paint (LCP)
		test('Largest Contentful Paint (LCP) test', async ({ page }) => {
			const lcp = await page.evaluate(async () => {
				return new Promise((resolve) => {
					new PerformanceObserver((entryList) => {
						const entries = entryList.getEntries();
						resolve(entries[ entries.length - 1 ]);
					}).observe({ type: 'largest-contentful-paint', buffered: true });
				});
			});

			if (lcp) {
				expect(lcp.startTime).toBeLessThan(2500); // Adjust threshold as needed
			}
		});

		// Test for Cumulative Layout Shift (CLS)
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
				expect(cls).toBeLessThan(0.1); // Adjust threshold as needed
			}
		});

		// Test for Time to First Byte (TTFB)
		test('Time to First Byte (TTFB) test', async ({ page }) => {
			const ttfb = await page.evaluate(async () => {
				return new Promise((resolve) => {
					window.performance.mark('start');
					resolve(performance.timing.responseStart - performance.timing.requestStart);
				});
			});

			if (ttfb) {
				expect(ttfb).toBeLessThan(600); // Adjust threshold as needed
			}
		});

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
					}).observe({ type: 'first-input', buffered: true });
				});
			});

			if (fid) {
				expect(fid.processingStart - fid.startTime).toBeLessThan(100); // Adjust threshold as needed
			}
		});

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

			// Additional logging if needed
			console.log('Long Tasks:', longTasks);
	});

	test('should measure time from interaction to next paint', async ({ page }) => {
    // Function to measure time from interaction to paint
    async function measureInteractionToPaint(selector) {
      return page.evaluate(async (selector) => {
        return new Promise((resolve) => {
          // Listen for the next paint event
          requestAnimationFrame(() => {
            const startTime = performance.now();

            // Simulate the interaction
            document.querySelector(selector).click();

            // Listen for the next paint after the interaction
            requestAnimationFrame(() => {
                const endTime = performance.now();
                resolve(endTime - startTime);
            });
          });
        });
      }, selector);
    }

    // Measure the interaction to paint time for a specific element
    const time = await measureInteractionToPaint('main'); // Replace with your element selector

    // Assertions with expect
    expect(time).toBeLessThan(100); // Expect the paint to occur within 100 milliseconds

    // Additional logging if needed
    console.log(`Time from interaction to paint: ${time}ms`);
});

	})
})

test.describe('3rd Party Tests', () => {
	test("Tests if page will work when 3rd party resources are blocked", async ({ page }) => {
		page.route("**", (route) => {
			const requestURL = route.request().url()

			if (requestURL.match(/http:\/\/publishing-project.rivendellweb.net/)) {
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

		await page.goto("http://publishing-project.rivendellweb.net")

		console.log(errors)
		expect(errors.length).toBe(0)
	})
})
