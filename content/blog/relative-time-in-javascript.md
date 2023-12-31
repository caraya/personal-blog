---
title: "Relative Time in JavaScript"
date: "2018-12-12"
---

I wasn't aware that there is a completely separate standard for ECMAScript internationalization (ECMA-402 or the ECMAScript 2019 Internationalization API) that goes beyond the core specification and covers internationalization in a lot more detail than the main specification can.

I came across this spec through a post from [Mathias Bynens](https://twitter.com/mathias) about a new internationalization API available in Chrome 71. The API makes creating relative time strings like '1 week ago' or 'in 2 weeks' easier and faster since it's a part of the proposed internationalization spec.

I've used [moment.js](https://momentjs.com/) but it's a beast in terms of file size (16.4K for the basic package and 66.4K for the full package including locales) and most of the time you will only use a fraction of the locales provided.

The relative time API, as implemented in Chrome,

```js
const rtf = new Intl.RelativeTimeFormat('en', {
  localeMatcher: 'best fit',
  style: 'long',
  numeric: 'auto',
});
```

And then use it like this:

```js
rtf.format(3.14, 'second'); // → 'in 3.14 seconds'

rtf.format(-15, 'minute'); // → '15 minutes ago'

rtf.format(8, 'hour'); // → 'in 8 hours'

rtf.format(-2, 'day'); // → '2 days ago'
```

You can use positive and negative values to indicate time in the future or the past.

This is an interesting API. It provides a smaller, built-in, API to work with relative timings on your page.

## Links and Resources

- [The Intl.RelativeTimeFormat API](https://developers.google.com/web/updates/2018/10/intl-relativetimeformat) (Google Developers)
- [ECMAScript 2019 Internationalization API Specification](https://tc39.github.io/ecma402/)
