// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  await page.goto('http://localhost:8080');
});

test.describe('Tests for the homepage', () => {

	test('Check correct URL', async ({ page }) => {
		expect(page.url()).toBe('http://localhost:8080/');
	});

	test('Page has a title', async ({ page }) => {
		expect(page).toHaveTitle("The Publishing Project");
	})

	test('Homepage has 10 items', async ({ page }) => {
		const articles = await page.locator('article.postlist-item');
		expect(articles).toHaveCount(10);
	})

	test.describe('Testing nav menu links', () => {
		test('About link works', async ({ page }) => {
			const aboutLink =  page.locator('li.nav-item').nth(1);
			expect(aboutLink).toContainText('About');
		})

		test('Menu should have 6 links', async({ page }) => {
			const links = page.locator('ul.nav-top-menu > li.nav-item')
			expect(links).toHaveCount(6)
		})
	})
})

