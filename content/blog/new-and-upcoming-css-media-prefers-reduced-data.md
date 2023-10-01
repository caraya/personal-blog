---
title: "New and Upcoming CSS: @media (prefers-reduced-data)"
date: "2022-07-27"
---

**Warning:** This feature is only supported behind a flag in Chromium browsers since version 85 and, as far as I know, there is no polyfill. **Do not use this feature in production.**

The `prefers-reduced-data` media query detects if the user has requested the web content that consumes less internet traffic via the browser or operating system's `data-saver` option.

Until the introduction of the `prefers-reduced-data` media query, there was no way to honor the `data-saver` settings.

In a music shop app or in any other application where we have a lot of images representing products, we can ask the browser to remove the images if the user has requested to save data using something like this:

```css
@media (prefers-reduced-data: reduce) {
  .album-cover {
    display: none;
  }
}
```

This will reduce the number of requests and will improve the loading speed and overall performance of your site.

## Notes and links

- [prefers-reduced-data mediaquery](https://www.w3.org/TR/mediaqueries-5/#prefers-reduced-data) spec
- [prefers-reduced-data](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-data) — MDN
- [SaveData And prefers-reduced-data](https://www.smashingmagazine.com/2021/12/core-web-vitals-case-study-smashing-magazine/#savedata-and-prefers-reduced-data) — Smashing Magazine
- Example: [Media Scroller component](https://web.dev/building-a-media-scroller-component/#prefers-reduced-data)
