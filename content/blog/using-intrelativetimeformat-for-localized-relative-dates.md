---
title: Using int.relativeTimeFormat for localized relative dates
date: 2025-03-10
tags:
  - Javascript
  - Internationazation
  - Dates
baseline: true
---

One of the things that has always bugged me is how to display relative dates on a web page in the Eleventy template that I chose to use for this blog.

This post will explore the issue, how the template currently displays dates and how to use [intl.RelativeTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RelativeTimeFormat) to display relative dates without using third-party libraries.

## Displaying dates in human readable formats

As currently implemented, The Eleventy template uses the following filter to display dates in a human-readable format.

This code uses the [Luxon](https://moment.github.io/luxon/) library to format dates. This is a lighter alternative to [Moment.js](https://momentjs.com/) and other heavy duty date libraries but it's still a third-party dependency that needs to be loaded before it can be used.

The filter is written in the configuration file like this:

{% raw %}
```js
eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
	return DateTime.fromJSDate(dateObj, { zone: zone || "utc" })
	.toFormat(format || "LLLL dd yyyy");
});
```
{% endraw %}

And then used in the template like the example shown below, as part of a list of metadata for a blog post:

{% raw %}
```html
<ul class="post-metadata">
	<li>
		<time
			class="iconfont published"
			datetime="{{ page.date | htmlDateString }}">{{ page.date | readableDate }}
		</time>
	</li>
</ul>
```
{% endraw %}

The first change is to move from using Luxon to using the built-in `Intl.DateTimeFormat` object to format dates.

This example will format the current date in a human-readable format using the full month name, a 2-digit day  and a 4-digit year. If the date is `2025-03-01`, the output will be March 01, 2025.

```js
const date = new Date();
const options = {
	year: 'numeric',
	month: 'long',
	day: 'numeric' };
const readableDate = new Intl.DateTimeFormat('en-US', options)
	.format(date);
console.log(readableDate);
```

With this code we've removed the Luxon dependency and replaced it with the built-in `Intl.DateTimeFormat` object that is available in all modern browsers (according to caniuse.com)



## Issues to consider

Eleventy is a static site generator so the dates will only change when the site is updated. For this blog, the problem is lessened because the blog gets rebuilt twice a week. For sites with longer lag between updates, the dates may become stale and not make sense to the readers.

Credit for the idea goes to Raymond Camden's [Using Intl.RelativeTimeFormat for Localized Relative Timings](https://www.raymondcamden.com/2024/03/07/using-intlrelativetimeformat-for-localized-relative-timings)
