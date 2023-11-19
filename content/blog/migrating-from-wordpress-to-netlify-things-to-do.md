---
title: "Migrating from WordPress to Netlify: WOrking on Lighthouse Scores"
date: 2023-11-16
youtube: true
---

After a few weeks of running the blog on Netlify I decided to take a look at how it's working.

Each time Netlify publishes a new version of the blog, it runs Lighthouse against the published version.

The two areas I was surprised with are performance and PWA so I decided to dive deeper into them.

!!! note **Note**:
The Service Worker and the manifest are working and would let me install the site as an app, just not a full PWA as Google recommends.
!!!

!!! danger **Something to watch out for**
Lighthouse is fickle and results can and will vary greatly depending on where you run the tests from.

For example, running the tests when Netlify publishes a deploy will produce significantly better results than running against the same deployed site from
!!!

## Performance

Remove `netlify-identity-widget.js` and the admin directory
: We're not using the Netlify CMS for this blog so the directory and the idenity script are no longer necessary

Give the header image explicit width and height
: Reference: [Optimize Cumulative Layout Shift](https://web.dev/articles/optimize-cls)
: This prevents layout shifts.
: <lite-youtube videoid="AQqFZ5t8uNc"></lite-youtube>

Compress text files with Brotli
: This will reduce the size of all text assets: HTML, CSS and Javascript.
: Requires adding custom headers to Netlify, as explained in [Custom headers](https://docs.netlify.com/routing/headers/)
: Netlify already does this, but the docs on custom headers may be useful for other headers later

Minimize CSS
: Reduce the size of CSS assets without mangling it.
: Since we use PostCSS, I've added CSSNano to the PostCSS workflow. I'm using the default preset while I research if the advanced preset would give me any advantages

## PWA

These recommendations are to get the full PWA in Lighthouse, meaning that it's what Google wants you to do to be a PWA. The service worker is caching content and the manifest is doing what it's supposed to do.

Addressing these issues will make it work better in mobile browsers and, while my primary audience is on desktop, it's always good to have a wider reach.

The issues are:

Manifest doesn't have a maskable icon
: A maskable icon ensures that the image fills the entire shape without being letterboxed when installing the app on a device
: Reference: [Manifest doesn't have a maskable icon](https://developer.chrome.com/docs/lighthouse/pwa/maskable-icon-audit/)
: **solution**: Create maskable icons and include them in the manifest following the instructions

Does not set a theme color for the address bar
: Failures: No `<meta name="theme-color">` tag found.
: Reference: [Does not set a theme color for the address bar](https://developer.chrome.com/docs/lighthouse/pwa/themed-omnibox/)
: **Solution**: Add the meta tag as required

Create a performance budget
: This is not strictly a performance consideration but it's something to keep you honest as you devlop the site
: Reference: [Use Lighthouse for performance budgets](https://web.dev/articles/use-lighthouse-for-performance-budgets)

Content is not sized correctly for the viewport
: The viewport size of 546px does not match the window size of 360px.
: Reference: [Content is not sized correctly for the viewport](https://developer.chrome.com/docs/lighthouse/pwa/content-width/)
: This is trickier for me since there are two things that worry me about this:
: It doesn't tell you where in the page there will be conflicts and even the responsive mode doesn't help in showing you where the actual overflow happens. The page I'm running lighthouse against doesn't have any content that would overflow so I'm trying to figure out how to debug the issue.

Does not provide a valid apple-touch-icon
: For ideal appearance on iOS when users add a progressive web app to the home screen, define an `apple-touch-icon`.
: It must point to a non-transparent 192px (or 180px) square PNG. Learn More.
