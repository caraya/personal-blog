---
title: "Migrating from WordPress to Netlify: Things to do"
date: 2023-12-04
youtube: true
---

After a few weeks of running the blog on Netlify I decided to take a look at how it's working.

Each time Netlify publishes a new version of the blog, it runs Lighthouse against the published version.



The two areas I was surprised with are performance and PWA so I decided to dive deeper into them.

## Performance

Remove `netlify-identity-widget.js` and the admin directory
: We're not using the Netlify CMS for this blog so the directory and the idenity script are no longer necessary

Give the header image explicit width and height
: This prevents layout shifts as explained in [Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls)
: <lite-youtube videoid="AQqFZ5t8uNc"></lite-youtube>

## PWA

Manifest doesn't have a maskable icon
: A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device

Does not set a theme color for the address bar
: Failures: No `<meta name="theme-color">` tag found.
: <https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/>

Create a performance budget
: <https://web.dev/articles/use-lighthouse-for-performance-budgets>

Content is not sized correctly for the viewport
: The viewport size of 546px does not match the window size of 360px.
: <https://developer.chrome.com/docs/lighthouse/pwa/content-width/>

Does not provide a valid apple-touch-icon
: For ideal appearance on iOS when users add a progressive web app to the home screen, define an `apple-touch-icon`.
: It must point to a non-transparent 192px (or 180px) square PNG. Learn More.
