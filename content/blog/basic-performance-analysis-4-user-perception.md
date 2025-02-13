---
title: Basic Performance Analysis (4) - User perception
date: 2025-02-24
tags:
  - Web
  - Performance Optimization
  - User Experience
---

Most of the time we measure the time it takes for a page to load, the number of requests, the size of the assets, etc. But we often forget that the user's perception of performance is not always aligned with these metrics. In essence, how fast is fast enough?

This post will try to answer this question and explore perceived performance as a way to improve the user experience.

## Defining perceived performance

The definition I'm using here based on [Psychology of Speed: A Guide to Perceived Performance](https://calibreapp.com/blog/perceived-performance):

Perceived performance refers to how fast or responsive a website or app feels compared to how fast or responsive it is, as reported by metrics. The idea is to make the users think that the site is fast by providing feedback and updates as soon as possible, even if it means not all content is ready, as long as some of it is.

## How to do it

There are many ways to make the users feel that the site is fast. Let's look at some of them.

Minimize initial load
: Download [above the fold](https://en.wikipedia.org/wiki/Above_the_fold) content that the user is going to interact with immediately first, and the rest of the content "in the background". The total amount of content downloaded may actually increase, but the user only waits on a very small amount, so the download feels faster.
: [Defer](https://developer.mozilla.org/en-US/docs/Web/API/HTMLScriptElement/defer) scripts and [lazy load](https://web.dev/articles/browser-level-image-lazy-loading) images that aren't used or visible on the initial page load.
: Optimize the assets you load. Images and video should be served in the most optimal format, compressed, and in the correct size.
: Use [responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Responsive_images) to serve the correct size and format for the user's device. Same with video, use multiple [source](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source) elements to serve the best format for the user.

Prevent content reflow
: Prevent images or other assets causing content from moving up or down on the page, like the loading of third party advertisements, it can make the page feel like it is still loading and is bad for perceived performance. Content reflowing is especially bad for user experience when not initiated by user interaction.
: Make sure you explictly size all your media assets. This way the browser will know the dimensions to allocate before the image is rendered (yes, width and height attributes are still important).

Avoid font file delays
: Font choice is important. Selecting an appropriate font can greatly improve the user experience. From a perceived performance point of view, "suboptimal fonts importing" can result in flicker as text is styled or when falling back to other fonts.
: Use `font-display: swap` to avoid the flash of invisible text (FOIT) or flash of unstyled text (FOUT) when loading web fonts. This will cause the browser to use a fallback font until the web font is loaded, which can make the text appear faster. You can also use `font-display: optional` to allow the browser to decide whether to use the fallback font or not. This can be useful if you want to prioritize speed over the exact font being used.
: Make fallback fonts the same size and weight so that when fonts load the page change is less noticeable.

Interactive elements are interactive
: Make sure visible interactive elements are always interactive and responsive. If input elements are visible, the user should be able to interact with them without a lag.
: Users feel that something is laggy when they take more than 50ms to react. They feel that a page is behaving poorly when content repaints slower than 16.67ms (or 60 frames per second) or repaints at uneven intervals.
: Make things like type-ahead a [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) so that the user can start typing and see the results as soon as the JavaScript is loaded.

Make task initiators appear more interactive
: Making a content request on keydown rather than waiting for keyup (when you press the key rather than when you release it) can reduce the perceived load time of the content by 200ms. Adding an interesting but unobtrusive 200ms animation to that keyup event can reduce another 200ms of the perceived load. You're not saving 400ms of time, but the user doesn't feel like they're waiting for content until, well, until they're waiting for content.

Use [Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/)
: Skeletons provide a way to show users that content is loading, even if it's not ready yet. This can be done by showing a placeholder for the content that will be loaded, which can be a simple outline or a more detailed representation of the content.

Disguise the wait by ofering users something to do while content loads
: This is best illustrated in this example taken from Smashing Magazine's [Why Performance Matters, Part 2: Perception Management](https://www.smashingmagazine.com/2015/11/why-performance-matters-part-2-perception-management/) (emphasis mine)
: > In 2009, the management team at an airport in Houston, Texas, faced an [unusual type of complaint](https://www.nytimes.com/2012/08/19/opinion/sunday/why-waiting-in-line-is-torture.html). Passengers were not satisfied with the long waits to claim their baggage upon arrival. In response, executives at the airport increased the number of baggage handlers. This decreased the waiting time to eight minutes, which is a very good result [compared to other airports in the US](https://awt.cbp.gov/). Surprisingly, this did not drop the number of complaints.
: >
: > The executives researched the problem and figured out that, indeed, the first bags took about eight minutes to show up on the baggage carousel. However, passengers took only one minute to reach the carousel. So, on average, passengers would wait seven minutes before the first bags appeared. **Speaking in psychological terms, the active phase was only one minute, while the passive wait was seven minutes**.
: >
: > Using their knowledge of perception management, executives came up with a nontrivial solution. They moved arrival gates further away from the main terminal and routed bags to the furthest carousel. This increased walking time for passengers to six minutes, leaving only two minutes for the passive wait. In spite of the longer walk, complaints dropped to nearly zero.
: > Baggage handling at the Houston airport (as pretty much at any airport) can be viewed as an example of the preemptive start technique. From a psychological point of view, starting the handling process as early as possible, while passengers are experiencing the active phase of the wait, “moves” the start event marker for passengers from the real start (when they leave the aircraft and baggage handling begins) to a new point on the timeline. **This is what we call the preemptive start: starting work before the user realizes it**.

## Conclusion

All these techniques should already be part of a developer's toolkit and they require additional work, but they can greatly improve the user experience.

The user's perception of performance is not always aligned with the metrics we use to measure performance, so it's important to consider both when optimizing a site.

## Links and resources

* [This is Success: Why 1000/100/6/50ms?](https://docs.google.com/document/d/1bYMyE6NdiAupuwl7pWQfB-vOZBPSsXCv57hljLDMV8E/edit?tab=t.0#heading=h.116kzlmx4qct) &mdash; Chrome Team
* [Fluent 2014: Ilya Grigorik, "Speed, Performance, and Human Perception"](https://www.youtube.com/watch?v=7ubJzEi3HuA) &mdash; Fluent 2014
* [Psychology of Speed: A Guide to Perceived Performance](https://calibreapp.com/blog/perceived-performance)
* [Perceived Performance & What Users Really Think](https://www.spectrumnetdesigns.com/perceived-performance/)
* [unusual type of complaint](https://www.nytimes.com/2012/08/19/opinion/sunday/why-waiting-in-line-is-torture.html)
* [Why Waiting Is Torture](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/)
* [Psychology of Speed: A Guide to Perceived Performance](https://calibreapp.com/blog/perceived-performance)
* Smashing Magazine's series on perceived performance:
  * [Why Perceived Performance Matters, Part 1: The Perception Of Time](https://www.smashingmagazine.com/2015/09/why-performance-matters-the-perception-of-time/)
  * [Why Performance Matters, Part 2: Perception Management](https://www.smashingmagazine.com/2015/11/why-performance-matters-part-2-perception-management/)
  * [Why Performance Matters, Part 3: Tolerance Management](https://www.smashingmagazine.com/2015/12/performance-matters-part-3-tolerance-management/)
