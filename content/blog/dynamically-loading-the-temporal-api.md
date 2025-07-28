---
title: Dynamically loading the Temporal API
date: 2025-09-01
tags:
  - Javascript
  - API
  - Temporal
baseline: true
---

<baseline-status featureid="temporal"></baseline-status>

<baseline-status featureid="bigint"></baseline-status>

Temporal is a new API designed to handle dates and times in Javascript. It is designed as a replacement for the existing Date API, without taking over the Date namespace.

Unfortunately, it is not yet available in all browsers, so we need to dynamically load it when it is not natively available.

This post will explore how to dynamically load the Temporal API in a web application. It will also cover a subtlety in feature detection and how to use the temporal API once it's loaded.

## The problem

I like the Temporal API better than the existing Date one so I'd rather work with Temporal rather than Date. However, the Temporal API is not yet available in all browsers so you have two options:

1. Test if the browser supports the Temporal API and use the date API if it does not

		This means that you'll be writing two different code paths to handle the same functionality, which is not ideal

		Some of the things you can do with Temporal are not possible with the Date API, so you may end up having to use a third-party library anyways

2. Use the Temporal API regardless of browser support

		This requires dynamically loading the Temporal polyfill when the API is not natively available. You can then use the Temporal API regardless of browser support

We'll work with the second option, which is more future-proof and allows us to use the Temporal API in all browsers.

## The solution

The solution checks if the Temporal API is available in the global scope.

If it is, we use it directly.

If it is not available, we dynamically import the Temporal polyfill from a CDN and then use it in the application code.

We pass the returned Temporal object to the `runApp` function, which contains the main logic of the application.

We call `initializeAndRunApp` to start the application, which checks for the Temporal API and loads the polyfill if necessary.

```js
async function initializeAndRunApp() {
  console.log("Initializing application...");

  if (globalThis.Temporal) {
    console.log("✅ Temporal API is natively supported.", "success");
    runApp(globalThis.Temporal);
  } else {
    console.log(
      "⚠️ Temporal API not supported. Dynamically loading polyfill...",
      "warn"
    );
    try {
      const { Temporal } = await import(
        "<https://cdn.skypack.dev/@js-temporal/polyfill>"
      );

      console.log("✅ Polyfill loaded successfully.", "success");
      runApp(Temporal);
    } catch (error) {
      console.error(`❌ Failed to load the Temporal polyfill: ${error.message}`);
    }
  }
}

// --- Start the application ---
initializeAndRunApp();
```

The `runApp` function is where the main logic of the application resides. It takes one parameter, `Temporal`, which is either the native Temporal API or the polyfill loaded from the CDN.

This allows us to use the same code regardless of whether the Temporal API is natively available or not.

```js
function runApp(Temporal) {
  console.log("🚀 Application is running.", "info");

  const today = Temporal.Now.plainDateISO();
  const fiveDaysFromNow = today.add({ days: 5 });

  console.log(`Today's date: ${today.toString()}`);
  console.log(`Date in 5 days: ${fiveDaysFromNow.toString()}`);
}
```

## Drawbacks

While dynamically loading the Temporal API has many advantages, there are some drawbacks to consider:

1. The Temporal polyfill I chose to use requires native [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt) support in the browser.

		The reason is that the Temporal API is designed to handle nanosecond precision for timestamps. These values are far too large to be safely represented by JavaScript's standard Number type, which can lead to precision errors. BigInt was introduced specifically to handle arbitrarily large integers, making it a perfect fit and a necessary foundation for Temporal's high-precision calculations.

		Native BigInt support is Baseline widely available, so this is rarely a limitation in practice.

2. Delayed Execution

		The application logic cannot run until after the polyfill has been downloaded and executed. If the user is on a slow network, there will be a noticeable delay between when the page loads and when the parts of your app that depend on Temporal become interactive. This can lead to a "flash" of a non-functional or loading state.

		Caching the polyfill in the browser's cache or in a service worker can help mitigate this issue, but it won't help if the user is visiting your site for the first time or if the cache has been cleared.

3. Asynchronous Complexity

		Dynamically loading a script introduces asynchronous behavior into your application's startup sequence. As seen in the demo, this requires using async/await and structuring your code to explicitly wait for the polyfill before proceeding. This adds a layer of complexity compared to simply including the script in your main bundle.

4. Network Failure

		The dynamic import is a network request that can fail. You must wrap the import() in a try...catch block to handle potential network errors, CDN issues, or ad-blockers that might prevent the polyfill from loading. Without this error handling, a failed download would crash your application's startup process.

## Aside: window.temporal vs Temporal in window

There are two common, and slightly different, ways to check if the Temporal API is natively available in the browser:

* checking if `window.Temporal` is truthy
* checking if `'Temporal' in window` returns true

Here’s the breakdown of the difference:

* `window.Temporal` accesses the value of the Temporal property on the window object. If the property doesn't exist, this expression evaluates to undefined. In a conditional `if (window.Temporal)`, it checks if the value is "truthy".
* `'Temporal' in window` checks for the existence of the Temporal property on the window object. It returns a boolean (true or false) and doesn't care what the value is, only that the key exists.

The difference becomes clear if a property exists but has a "falsy" value (like false, 0, "", null, or undefined).

In the specific case of checking for Temporal, both methods will work reliably:

* If Temporal is supported, `window.Temporal` will be an object, which is truthy. `'Temporal' in window` will be true
* If Temporal is not supported, `window.Temporal` will be undefined, which is falsy. `'Temporal' in window` will be false.

So, for this purpose, you can use them interchangeably. This may not be the case for other APIs, so it's worth keeping in mind.



## Examples

These examples assume that the Temporal API is available in the environment either natively or via a polyfill.

One thing to keep in mind is that **the Temporal API is designed to be immutable**, meaning that all operations return a new instance rather than modifying the original object. This is a key difference from the Date API, which mutates the original Date object.

### PlainDate

The first block of examples shows how to use the [Temporal.Now](https://tc39.es/proposal-temporal/docs/Temporal/Now.html) methods to get the current date, time in different formats:

```js
// Get the exact moment in time, independent of location (UTC)
console.log('Instant:', Temporal.Now.instant().toString());

// Get the current wall-clock time in the system's time zone
console.log('Zoned Date Time:', Temporal.Now.zonedDateTimeISO().toString());

// Get the current date in the system's time zone
console.log('Plain Date:', Temporal.Now.plainDateISO().toString());
```

[Temporal.PlainDate](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate) represents a calendar date without a time or time zone. It's ideal for birthdays, holidays and other cases when all you need is the date without time-related information.

The [Temporal.PlainDate.from()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/from) method creates a Temporal.PlainDate instance from various inputs. In this case we create a date from an array of year, month and day.

```js
const date = Temporal.PlainDate.from({
	year: 2025,
	month: 7,
	day: 25
});
console.log('Original Date:', date.toString());
```

[Temporal.PlainDate.with()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/with) returns a new `Temporal.PlainDate` object representing this date with some fields replaced by new values. Because all Temporal objects are designed to be immutable, this method essentially functions as the setter for the date's fields.

```js
// .with() creates a new object with specified properties changed
const BastilleDay = date.with({
	month: 7,
	day: 14
});
console.log('Bastille Day:', BastilleDay.toString());
```

[Temporal.PlainDate.add()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/add) and [Temporal.PlainDate.subtract()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/subtract) methods allow you to add or subtract a duration from a date, returning a new date.

```js
// .add() and .subtract() work with Temporal.Duration objects
const duration = Temporal.Duration.from({
	days: 20
});
const later = date.add(duration);
console.log('20 days later:', later.toString());

const earlier = date.subtract({
	months: 1,
	days: 5
});
console.log('1 month and 5 days earlier:', earlier.toString());
```

### since() and until()

The [.since()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/since) and [.until()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/PlainDate/until) methods calculate the difference between two dates, returning a [Temporal.Duration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/Duration) object.

When using these methods, the default is to use years as the largest unit. However, you can specify a different largest unit using the `largestUnit` option. This is useful to avoid ambiguity in the result, especially when dealing with dates that span multiple years or months.

```js
const date1 = Temporal.PlainDate.from('2019-01-15');
const date2 = Temporal.PlainDate.from('2025-03-20');

const difference = date2.since(date1);
console.log('Difference (default):', difference.toString());

// You can specify the largest unit to avoid ambiguity
const differenceInMonths = date2.since(date1, {
	largestUnit: 'month'
});
console.log('Difference (months):', differenceInMonths.toString());

// Or round to a single unit
const differenceInDays = date2.since(date1, {
	largestUnit: 'day'
});
console.log('Difference (total days):', differenceInDays.days);
```

The default for `since()` and `until()` only returns a single unit (like 1 year or two months). If you want to build something more complex you will have to do it manually.

If we want to calculate the difference in years, months and days, we can use the following approach:

```js
const date1 = Temporal.PlainDate.from('2019-01-15');
const date2 = Temporal.PlainDate.from('2025-03-20');

const duration = date1.until(date2, {
	largestUnit: 'year'
});

const parts = [];

if (duration.years > 0) {
  parts.push(`${duration.years} year${duration.years > 1 ? 's' : ''}`);
}
if (duration.months > 0) {
  parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
}
if (duration.days > 0) {
  parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`);
}

const resultString = parts.join(', ');
console.log(resultString);
// Expected output: 6 years, 2 months, 5 days
```

Both `since()` and `until()` usually return the same values; these two statements will produce the same result:

```js
const date1 = Temporal.PlainDate.from('2019-01-15');
const date2 = Temporal.PlainDate.from('2025-03-20');

const duration1 = date1.until(date2);
const duration2 = date2.since(date1);
```

Which one to use depends on your use case. The usual recommendation is to use whatever reads like a natural sentence in your code.

### ZonedDateTime

[Temporal.ZonedDateTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime) includes date-time instant, the time zone and the calendar, making time zone conversions trivial and explicit.

The following example creates a `Temporal.ZonedDateTime` from an array of date-time components.

```js
const meetingTime = Temporal.ZonedDateTime.from({
  year: 2025,
  month: 11,
  day: 5,
  hour: 10,
  timeZone: 'America/New_York'
});

console.log('Meeting in New York:', meetingTime.toString());
```

We then convert it to other time zones using the [withTimeZone()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/withTimeZone) method, which returns a new `Temporal.ZonedDateTime` object with the specified time zone.

```js
const inLondon = meetingTime.withTimeZone('Europe/London');
console.log('Meeting in London:', inLondon.toString());

const inTokyo = meetingTime.withTimeZone('Asia/Tokyo');
console.log('Meeting in Tokyo:', inTokyo.toString());
```

Given a time zone, conversion from UTC to local time is straightforward: you first get the offset using the time zone name and the instant, then add the offset to the instant. **The reverse is not true**: conversion from local time to UTC time, without an explicit offset, is ambiguous, because one local time can correspond to zero, one, or many UTC times.

Because of daylight saving time transitions in March, one hour disappeared from the local time, and in November, we have two hours that have the same wall-clock time.

To handle the ambiguity in the November Daylight change, you can use the [disambiguation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal/ZonedDateTime/disambiguation) option when converting from local time to UTC. The options are:

* `earlier`: Use the earlier of the two possible UTC times
* `later`: Use the later of the two possible UTC times
* `reject`: Throw an error if the local time is ambiguous

```js
const ambiguousTime = Temporal.ZonedDateTime.from(
    '2025-11-02T01:30:00[America/New_York]',
    { disambiguation: 'earlier' }
);
console.log('Ambiguous time (earlier):', ambiguousTime.toString());
```

When we `spring forward` in March, the issues are different. The core issue is no longer an ambiguous time, but an invalid or "skipped" time. In this case we need to look at the `offset` option, which tells Temporal how to handle these non-existent times.

On March 9, 2025, in the America/New_York time zone, the clocks do the following:

1. They run from 12:00:00 AM to 1:59:59 AM EST (Eastern Standard Time, UTC-5)
2. At 2:00:00 AM, they "spring forward" directly to 3:00:00 AM EDT (Eastern Daylight Time, UTC-4)

The entire hour from 02:00:00 to 02:59:59 does not exist.

The options to create a ZonedDateTime for 02:30:00 on that day are:

offset: 'prefer' (The Default)
: This option tries to preserve the wall-clock time. If the time is invalid, it moves it forward to the next valid time while keeping the duration. This is the default behavior.
: **Reasoning**: Temporal sees that 2:30 AM EST is invalid because that's when the time jump happens. It "prefers" to keep the time of day, so it pushes the result forward by one hour to the next valid instant, which becomes 3:30 AM in the new Daylight Time (EDT, UTC-4).

```js
const invalidTime = Temporal.ZonedDateTime.from(
	'2025-03-09T02:30:00[America/New_York]',
	{
		offset: 'prefer'
	}
	// This is the default, so it can be omitted
);
console.log(invalidTime.toString());

// Output:
// 2025-03-09T03:30:00-04:00[America/New_York]
```

offset: 'use'
: This option tries to use the UTC offset from the time zone. In this "skipped time" scenario, it behaves identically to 'prefer'.
: **Reasoning:** It attempts to use the time zone's offset, finds the time is invalid, and resolves it by moving to the next valid time, just like 'prefer'.

```js
const invalidTime = Temporal.ZonedDateTime.from(
	'2025-03-09T02:30:00[America/New_York]',
  {
		offset: 'use'
	}
);
console.log(invalidTime.toString());

// Output:
// 2025-03-09T03:30:00-04:00[America/New_York]
```

offset: 'reject'
: This is the strict option. It refuses to create a date for a non-existent time and throws an error instead.
: **Reasoning:** The API correctly identifies that 2025-03-09T02:30:00 does not exist in this time zone and, as instructed, throws a RangeError.

```js
try {
    const invalidTime = Temporal.ZonedDateTime.from(
      '2025-03-09T02:30:00[America/New_York]',
      {
				offset: 'reject'
			}
    );
} catch (e) {
    console.log(e.name); // Logs the type of error
}

// Output:
// RangeError
```

The disambiguation option (`earlier`, `later`, etc.) has no effect in this "spring forward" scenario. It is only used when a wall-clock time is ambiguous (occurs twice), not when it's invalid (doesn't occur at all).

## Conclusion

There is a lot more to the Temporal API than what we've covered here, but this should give you a good starting point to explore further. The documentation for the Temporal API is available on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal) and the [TC39 proposal](https://tc39.es/proposal-temporal/docs/).
