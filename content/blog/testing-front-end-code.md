---
title: "Testing front-end code"
date: 2024-01-08
youtube: true
tags:
  - JS
  - Testing
---

While building the new blog, I started thinking about testing front-end code again.

In this post I will revisit [Playwright](https://playwright.dev/) Test class, and look at the types of testing that we can do to ensure that the site works as intended.

## Why test front-end code?

I get caught in a deceptively simple question: Why do we need to test the front-end?

Because testing will help you catch errors that you don't see. I've had multiple instances where I thought I typed one thing and I had typed something completely different.

Testing can also help you identify potential performance bottlenecks before you deploy your application.

## Using Playwright Test

The `@playwright/test` package is the testing portion of Playwright. In addition to the core automation features available to Playwright, it provides testing-specific features like `test` and `expect`.

Rather than installing the package, we use [npm init](https://docs.npmjs.com/cli/v10/commands/npm-init) to create a `package.json` file if one is not present or update the project's `package.json` with Playwright-related information.

```bash
npm init playwright@latest
```

### Playwright configuration

One of the things that Playwright adds to an existing project is a configuration file. I've modified the default configuration file.

We first load the required functions from `@playwright/test` and optionally require `dotenv` to store sensitive information in an `.env` file.

```js
const { defineConfig, devices } = require('@playwright/test');
// require('dotenv').config();
```

We use Common.js' `modules.exports` to export the the full configuration defined with `defineConfig`. The first part sets the parameters for the testing.

| Option | Description |
| :---: | --- |
| testDir | Directory with the test files.
| fullyParallel | have all tests in all files to run in parallel. See [Parallelism and sharding](https://playwright.dev/docs/test-parallel) for more details. |
| retries | The maximum number of retry attempts per test. See Test Retries to learn more about retries. |
| forbidOnly | Whether to exit with an error if any tests are marked as test.only. Useful on CI.<br><br>In the example we use a ternary operator to only set value to true if we're running on a CI environment|
| reporter | The reporter to use. See [Test Reporters](https://playwright.dev/docs/test-reporters) to learn more about available reporters.|
| workers | The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. '50%'.<br><br>In this example we use a ternary operator to set the workers to 2 when working in CI environments and to 0 or the undefined value otherwise.<br><br>See [Parallelism and sharding](https://playwright.dev/docs/test-parallel) for more information.|
| use | Options for the `use{}` global configuration test. |

```js
module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
  },
```

The `projects` section, as specified below, tells Playwright what browsers to use when running the tests. The example includes desktop and mobile browsers.

```js
  projects: [
    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },
		{
			name: "Firefox",
			use: {...devices['Desktop Firefox']}
		},
		/* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
```

Playwright configuration also allows us to configure a local web server that will run before starting the tests. This allows Playwright to work against the local copy of the application.

```js
  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:8080',
  //   reuseExistingServer: !process.env.CI,
  // },
});
```

### Writing the tests

To start we require the parts of `@playwright/test` that we will need. For basic tests these parts are `test` and `expect`.

The `@ts-check` declaration in the comment at the very top of the file will make it easier for VS Code to typechek the Javascript file.

```js
// @ts-check
const { test, expect } = require('@playwright/test');
```

Playwright tests do two things:

* Perform actions
* Assert the state against expectations

### Navigation

Before we can work on an objectin our target page we need to navigate to that page using the `goto` method of the `page` object.

```js
test('has title', async ({ page }) => {
  await page.goto('https://publishing-project.rivendellweb.net');

  // Once the page.goto promises return we
  // can do something with the results
});
```

We can also use the page fixture to set the viewport size for the tests that we want to run.

```js
const page = await browser.newPage();
await page.setViewportSize({
  width: 640,
  height: 480,
});
await page.goto('https://publishing-project.rivendellweb.net');
```

This will run all subsequent tests in the smaller vieport size.

For more information on the page fixture, see the [page](https://playwright.dev/docs/api/class-page) documentation.

### Locators

<lite-youtube videoid="9RJMNU4eNEc"></lite-youtube>

Once we've pointed Playwright to a page, we need to tell it the specific element of the page we want to work with using locators.

There are several typesof locators, but I will look at the two that have been the most valuable to me: CSS selectors and simple locators.

Selectors are tricky because they can be a fixture like the page object or in more specific selectors.

The first example uses the `toHaveTitle` locator to test if the page title contains the string "Publishing Project".

```js
test('has title', async ({ page }) => {
  await page.goto('https://publishing-project.rivendellweb.net');

  await expect(page).toHaveTitle(/Publishing Project/);
});
```

The second example uses a simple locator with the `:has-text` pseudo class.

```js
test('has title', async ({ page }) => {
  await page.goto('https://publishing-project.rivendellweb.net');

  await page.locator('article:has-text("Playwright")').click();
});
```

The [locators guide](https://playwright.dev/docs/locators) has basic information about locators: How to use them and what are the recommended locators to use.

There are additional locators built into Playwright. Look at [Other locators](https://playwright.dev/docs/other-locators)

### Assertions

So far we've told Playwright the URL of the page and the specific element within the page we want to test. Now we need to tell Playwright what the actual test it. We do this with a combination of the `expect` functions and assertion matchers.

The assertions in the list below will continue retrying until they succeed or timeout.

!!! note **Note**
You must use `await` with these assertions
!!!

<p>&nbsp;</p>

| Assertion | Description |
| :---: | --- |
| await expect(locator).toBeAttached() |Element is attached |
| await expect(locator).toBeChecked()| Checkbox is checked |
| await expect(locator).toBeDisabled() | Element is disabled |
| await expect(locator).toBeEditable() |Element is editable |
| await expect(locator).toBeEmpty()	| Container is empty |
| await expect(locator).toBeEnabled() | Element is enabled |
|await expect(locator).toBeFocused() |Element is focused |
| await expect(locator).toBeHidden() | Element is not visible |
| await expect(locator).toBeInViewport() | Element intersects viewport |
| await expect(locator).toBeVisible() | Element is visible |
|await expect(locator).toContainText() | Element contains text |
| await expect(locator).toHaveAttribute() |Element has a DOM attribute |
| await expect(locator).toHaveClass() |Element has a class property |
| await expect(locator).toHaveCount()	|List has exact number of children |
| await expect(locator).toHaveCSS() | Element has CSS property |
| await expect(locator).toHaveId() | Element has an ID |
| await expect(locator).toHaveJSPropert() |Element has a JavaScript property |
|await expect(locator).toHaveScreenshot() |Element has a screenshot |
| await expect(locator).toHaveText() |Element matches text |
| await expect(locator).toHaveValue() |Input has a value |
| await expect(locator).toHaveValues() |Select has options selected |
| await expect(page).toHaveScreenshot() |Page has a screenshot |
| await expect(page).toHaveTitle() | Page has a title |
| await expect(page).toHaveURL() | Page has a URL |
| await expect(response).toBeOK() | Response has an OK status |

### Hooks

Most of the time there are tasks that we will want to run before or after each test or before or after we run all our tests.

Some of these tasks may include:

* Set/tear down a test database
* Prepare navigation or locators that will be shared among tests

In the example below, we use the `beforeEach` hook to go to the site we want to test.

```js
test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto('https://publishing-project.rivendellweb.net');
});

test('my test', async ({ page }) => {
  expect(page.url()).toBe('https://publishing-project.rivendellweb.net');
});
```

The hooks that I use more often are listed in the table below.

`BeforeAll` and `afterAll` will run before all the tests execute.

`beforeEach` and `afterEach` will run before each test.

| Hook | Description |
| --- | --- |
| beforeEach | Runs before each test |
| afterEach | Runs after each test |
| beforeAll | Runs once per worker before all tests|
| afterAll | Runs once per worker after all tests |

## Running the tests

To run the tests you've created, run the following command if you want to run the tests in the command line.

```bash
npx playwright test
```

The following command will run a UI so you can choose what tests to run and in what order.

```bash
npx playwright test --ui
```

If you run the CLI command, you can get a GUI with the results with the following command:

```bash
npx playwright show-report
```

Finally, you can run the following command to debug your playwright tests:

```bash
npx playwright test --debug
```

## Example tests

I've created examples of Playwright tests to illustrate the topics that we've covered in this post.

The tests cover a basic set of tasks that you can accomplish with Playwright. They are offered as a starting point.

**Example 1: Find and click a button containing "Submit".**

```js
test('has title', async ({ page }) => {
	await page.goto('https://example.com');

	await page.getByText('Submit').click();
})
```

**Example 2: Find a link with text starting with "Learn More" and navigate to it.**

```js
test('Find link with "Learn more text"', async ({ page }) => {
	await page.goto('https://example.com');

	await page.getByText(/Learn More/).click();
})
```

**Example 3: Find and fill the second element containing the text "Product Name".**

```js
test('Find and fill the second product name item', async ({ page }) => {
	await page.goto('https://example.com/products');

	await page.locator('.product-name')
		.nth(1) // 0 based
		.fill('My Awesome Product');
})
```

**Example 4: Find all buttons with the class "primary-button" and click the first one.**

```js
test('Find primary-button buttons', async ({ page }) => {
	await page.goto('https://example.com');

	await page.locator('button.primary-button')
		.first()
		.click();
})
```

**Example 5: Find and clear the input element with the id "username".**

```js
test('Clear user name input', async ({ page }) => {
	await page.goto('https://example.com/login');

	await page.locator('#username').clear();
})
```

**Example 6: Find the element with specific attributes and click it.**

```js
test('Click about link', async ({ page }) => {
	await page.goto('https://example.com');

	await page.locator('a[href="/about"]').click();
})
```

**Example 8: Find the checkbox element labeled "Remember Me" and check it.**

```js
test('check remember me checkbox', async({ page }) => {
	await page.goto('https://example.com/login');

	const rememberMeCheckbox = page.getByLabel('Remember Me');
	await rememberMeCheckbox.check();
})
```

## Headless versus headed

By default Playwright will run the tests in headless mode. There may be times when you want to see how Playwright interacts with the page. To do so, run playwright with the `--headed` flag.

```bash
npx playwright test --headed
```

## Links and Resources

* [Playwright](https://playwright.dev/)
* [Testing Your Frontend Code : Part I (Introduction)](https://medium.com/@giltayar/testing-your-frontend-code-part-i-introduction-7e307eac4446)
* [Testing Your Frontend Code: Part II (Unit Testing)](https://hackernoon.com/testing-your-frontend-code-part-ii-unit-testing-1d05f8d50859#.xf5q3crth)
* [Testable Frontend: The Good, The Bad And The Flaky](https://www.smashingmagazine.com/2022/07/testable-frontend-architecture/)
* [Testing Pipeline 101 For Frontend Testing](https://www.smashingmagazine.com/2022/02/testing-pipeline-101-frontend-testing/)
