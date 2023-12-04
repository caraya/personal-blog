---
title: "Testing front-end code"
date: 2024-01-08
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

We then use `defineConfig` inside `modules.exports` to define the full configuration. The first part sets the parameters for the testing.

| Option | Description |
| --- | --- |
| forbidOnly | Whether to exit with an error if any tests are marked as test.only. Useful on CI. |
| fullyParallel | have all tests in all files to run in parallel. |
| projects | Run tests in multiple configurations or on multiple browsers |
| reporter | The reporter to use. See Test Reporters to learn more about which reporters are available.|
| retries | The maximum number of retry attempts per test. See Test Retries to learn more about retries. |
| testDir | Directory with the test files.
| use | Options with use{} |
| webServer | To launch a server during the tests, use the webServer option |
| workers | The maximum number of concurrent worker processes to use for parallelizing tests. Can also be set as percentage of logical CPU cores, e.g. '50%'. See /Parallelism and sharding for more details. |


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
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
```

```js
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
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

  ],
```

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

```js
// @ts-check
const { test, expect } = require('@playwright/test');
```

```js
test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});
```

```js
test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
```

### Running the tests

```bash
npx playwright test
```

```bash
npx playwright show-report
```

### Headless versus headed

## Links and Resources

* [Playwright](https://playwright.dev/)
* [Testing Your Frontend Code : Part I (Introduction)](https://medium.com/@giltayar/testing-your-frontend-code-part-i-introduction-7e307eac4446)
* [Testing Your Frontend Code: Part II (Unit Testing)](https://hackernoon.com/testing-your-frontend-code-part-ii-unit-testing-1d05f8d50859#.xf5q3crth)
* [Testable Frontend: The Good, The Bad And The Flaky](https://www.smashingmagazine.com/2022/07/testable-frontend-architecture/)
* [Testing Pipeline 101 For Frontend Testing](https://www.smashingmagazine.com/2022/02/testing-pipeline-101-frontend-testing/)
