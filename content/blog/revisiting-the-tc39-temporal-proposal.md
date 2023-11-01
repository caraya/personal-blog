---
title: "Revisiting the TC39 Temporal Proposal"
date: "2023-04-24"
---

The Javascript Temporal proposal seeks a native fix for long-standing isues with Javascript's Date object as outlined in [Fixing JavaScript Date](https://maggiepint.com/2017/04/09/fixing-javascript-date-getting-started/):

* No support for time zones other than the user’s local time and UTC
* Parser behavior so unreliable it is unusable
* Date object is mutable
* DST behavior is unpredictable
* Computation APIs are unwieldy
* No support for non-Gregorian calendars

Rather than patch the Date object, the proposal creates a new top-level object (Temporal) with the proposed changes Javascript now has:

* First class support for all time zones
* Support for DST-safe arithmetics
* An easy to use API for date computations
* Temporal objects represent fixed dates and times
* Support for non-Gregorian calendars
* Separate classes for date-only, time-only, and other use cases

Support for Temporal is not complete on every browser so we're using a polyfill to make these examples work.

The temporal proposal is at Stage 3 of the [TC39 process](https://tc39.es/process-document/) and, as far as I understand it, it's waiting IETF finishing work on [https://datatracker.ietf.org/doc/draft-ietf-sedate-datetime-extended/](https://datatracker.ietf.org/doc/draft-ietf-sedate-datetime-extended/) before it reaches Stage 4 and gets the go ahead to be implemented without prefixes.

## Getting Started

As with all Node projects we start by installing the Temporal polyfill package.

```bash
npm install -D temporal-polyfill
```

We are working with ES Modules so we need to import Temporal before it works.

```js
import { Temporal } from 'temporal-polyfill'
```

Now that we've imported the module, we're ready to go.

## Plain Date

The first item to consider is how to display a simple date.

`Temporal.Now.plainDateISO()` outputs the current date in the system time zone and ISO-8601 calendar.

```js
const plainDate = Temporal.Now.plainDateISO();
plainDateDisplay.innerHTML = `${plainDate}`;
```

The output of this command is `2023-03-28` when the post was written.

## Plain Date Using Default Locale

The ISO date works in most circumstances. We can convert the ISO time into something that matches the user's locale, the format for the calendar used in the user's computer, we append the `toLocaleString()` wherever we use the date string to get a version of the date string that matches what the Operating System will produce.

```js
const plainDate = Temporal.Now.plainDateISO();
plainDateLocale.innerHTML = `${plainDate.toLocaleString()}`;
```

The resulting string would be `3/28/2023`.

## Custom Date String

Another thing that we can do once we get the date string is to break it down and use only parts of the date or use them in a different order.

In this example the custom date string has only month and year

```js
const plainDate = Temporal.Now.plainDateISO();
plainDateCustom.innerHTML = `${plainDate.month}/${plainDate.year}`;
```

The result is `03/2023`.

## Changing Timezones

We can display the same data for different time zones by using a time zone descriptor as a parameter to `Temporal.Now.plainDateTimeISO()`; for example, to use the date/time for New York, it looks like this:

```js
Temporal.Now.plainDateTimeISO('America/New_York')
```

The [List of Time Zones](https://timezonedb.com/time-zones) contains a list of the Time Zones around the world.

The following example takes the time zones for multiple cities and creates paragraphs with the name of the city, the time zone in parenthesis, and the formated date using the user's computer locale.

```js
// Changing Locale
const cities = {
  'New York': 'America/New_York',
  'London': 'Europe/London',
  'Tokyo': 'Asia/Tokyo',
  'Santiago, Chile': 'America/Santiago',
};

Object.entries(cities).forEach(([name, timeZone]) => {
  let p = document.createElement('p')
  p.append(`${name} (${timeZone}) ${Temporal.Now.plainDateTimeISO(timeZone).toLocaleString()}`);
  plainDateTZ.append(p)
});
```

The result is:

```text
New York (America/New_York) 3/29/2023, 12:33:42 AM
London (Europe/London) 3/29/2023, 5:33:42 AM
Tokyo (Asia/Tokyo) 3/29/2023, 1:33:42 PM
Santiago, Chile (America/Santiago) 3/29/2023, 1:33:42 AM
```

## Relative Times From Today

One of the things I like about Temporal is how it provides convenience functions to make developers' lives easier.

One of these convenience methods is `add`. When appended to a date object it will add (if positive) or substract (if negative) the amount of time of the unit indicated in the parameter to `add`.

In this example, we create a date object for today and then add and substract 5 days using `dateNow.add()`.

```js
const dateNow = Temporal.Now.plainDate('iso8601'); // Gets the current date

plainDateRelative1.innerHTML = `
<strong>Base Date</strong>: ${dateNow.toString()}


5 days from today: ${dateNow.add({days: 5})tring()}</p>
<p>5 days ago: ${dateNow.add({days: -5}).toString()}</p>`
```

The result is:

```text
Base Date 1994-03-27

5 days after initial date: 1994-04-01

5 days before initial date: 1994-03-22
```

## Relative Times From a Given Date

```js
const date2 = Temporal.PlainDate.from('1994-03-27');

plainDateRelative2.innerHTML = `
<p><strong>Base Date</strong>: ${date2}


<p>5 days after initial date: ${date2.add({days: +5}).toString()}</p>
<p>5 days before initial date: ${date2.add({days: -5}).toString()}</p>`
```

## Duration Since

The final aspect of the Temporal API we'll look at is how to create relative durations between two dates. Rather than saying Post published on 3/22/2010, we can say post was published 13 years, one week ago.

This code uses workarounds for APIs that are still being worked on the Intl/ECMA 402 side, hence the verbosity

We first set up the original date that we'll be working from.

Next we set up a function to pluralize a string. We will need this later when formatting the date.

```js
const originalPastDate = Temporal.PlainDate.from("1994-03-27")

function englishPlural(n, singular, plural) {
  return `${n} ${n === 1 ? singular : plural}`;
}
```

If the original date variable is not empty then we build our date objects. We could use one declaration for all the data that we need but I prefer to be more verbose to make it easier to debug.

* **pastDate** holds a temporal object for the original past date
* **today** contains a temporal object for the current date
* **since** Temporal date object representing the difference between the past date and today expressed in days
* **sinceMonths** Temporal date object representing the difference between the past date and today expressed in months
* **sinceYears** Temporal date object representing the difference between the past date and today expressed in years

```js
if (originalPastDate !== null) {
  const browserCalendar = new Intl.DateTimeFormat().resolvedOptions().calendar;
  const pastDate = Temporal.PlainDate.from(originalPastDate).withCalendar(browserCalendar);
  const today = Temporal.Now.plainDate(browserCalendar);
  const since = today.since(pastDate, { largestUnit: 'day' });
  const sinceMonths = since.round({ largestUnit: 'month', relativeTo: today });
  const sinceYears = since.round({largestUnit: 'years', relativeTo: today });
```

The next block of constants creates the strings we'll present to the users. They use `englishPlural` to pluralize the strings if necessary.

`dayString` presents the difference between the past date and today expressed in days

`mothString` presents the difference between the past date and today expressed in months and days

`yearString` presents the difference between the past date and today expressed in years, months and days

```js
  const dayString = englishPlural(since.days, 'day', 'days');
  const monthString =
    `${englishPlural(sinceMonths.months, 'month', 'months')}` +
    (sinceMonths.days !== 0 ? `, ${englishPlural(sinceMonths.days, 'day', 'days')}` : '');
  const yearString =
    `${englishPlural(sinceYears.years, 'year', 'years')}` +
    (sinceYears.months !== 0 ? `, ${englishPlural(sinceYears.months, 'month', 'months')}` : '') +
    (sinceYears.days !== 0 ? `, ${englishPlural(sinceYears.days, 'day', 'days')}` : '');
```

We insert content, that includes the strings we've created, into the page using [innerHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML)

```js
  results.innerHTML = `
    <p>From and including: <strong>${today.toLocaleString()}</strong></p>
    <p>Going back to but not including: <strong>${pastDate.toLocaleString()}</strong></p>
    <p>It's been ${dayString} from the start date to, but not including the end date.</p>
    <p>Or ${monthString} excluding the end date.</p>
    <p>Or ${yearString} years since the start date</p>
  `;
}
```

The results displayed on the page looks like this:

```text
From and including: 3/29/2023

Going back to but not including: 3/27/1994

It's been 10594 days from the start date to, but not including the end date.

Or 348 months, 1 day since the start date, excluding the end date.

Or 29 years, 1 day since the start date
```

## Conclusion

This has just scratched the surface of what we can do with Temporal.

The [Temporal Cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html) covers Temporal in a lot more detail, including using functions and methods that are aware of daylight savings, 12 hour clocks, leap years and other date/time idiosyncrasies.
