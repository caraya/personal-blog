---
title: "Web Content Optimization: RAIL: Puting the user first"
date: "2015-11-11"
categories: 
  - "technology"
---

# Rail: Putting the user first

[Paul Irish](http://www.paulirish.com/) and [Paul Lewis](https://aerotwist.com/) wrote an [article](http://www.smashingmagazine.com/2015/10/rail-user-centric-model-performance/) for Smashing Magazine outlining a new way to look at performance by analyzing how users perceive the speed of your site.

Paul Irish presented about RAIL at SFHTML5's AMP Project Presentations. He began by asking the question **_What is slow?_**

- Is changing the DOM slow?
- Are Javascript animations slower than CSS animations?
- Is loading a script in the `head` of the document slow? Is it slower than loading the script before closing the body?

The answer to all these questions is `it depends`. As Paul explains in the Smashin Magazine article:

> While it’s true that different operations take different amounts of time to complete, it’s hard to say objectively whether something is slow or fast without the context of when it’s happening. For example, code running during idle time, in a touch handler or in the hot path of a game loop each has different performance requirements. Put another way, the people using your website or app have different performance expectations for each of those contexts. Like every aspect of UX, we build for our users, and what they perceive is what matters most. In fact, number one on [Google’s ten things we know to be true](http://www.google.com/about/company/philosophy/) is “Focus on the user and all else will follow.” Asking “What does slow mean?,” then, is really the wrong question. Instead, we need to ask “**What does the user feel** when they’re interacting with the things we build?” From [Smashing Magazine](http://www.smashingmagazine.com/2015/10/rail-user-centric-model-performance/#slow)

## The Numbers Change

Based on Jakob Nielsen's research we can throw down some numbers as the basis for performance measurement and how to quantify user's perception.

- 100 miliseconds (0.1 seconds) is the window where the user feels reaction is automatic
- 1 second is the limit for where users feel like a continual uninterrupted thought
- 10 seconds is the limit for users to keep attention on the task they are performing. Longer times will make the user go away
- 16 miliseconds in how long you have to perform a task to keep a target of 60 frames a second (1000 ÷ 60 = 16)

### The RAIL Performance Model

Using the numbers above we can create reasonable performance metrics that take user perception into account.

The TL;DR from the Smashing Magazine article:

> - RAIL is a [model](http://www.smashingmagazine.com/2015/10/rail-user-centric-model-performance/#rail-perf-model) for breaking down a user’s experience into key actions (for example, tap, drag, scroll, load).
> - RAIL provides performance [goals](http://www.smashingmagazine.com/2015/10/rail-user-centric-model-performance/#rail-perf-goals) for these actions (for example, tap to paint in under 100 milliseconds).
> - RAIL provides a structure for thinking about performance, so that designers and developers can reliably target the highest-impact work.

RAIL is based on four aspects:

- **Response**
- **Animation**
- **Idle**
- **Load**

![The 4 components of the RAIL performance model](https://media-mediatemple.netdna-ssl.com/wp-content/uploads/2015/09/img-rail.jpg "The 4 components of the RAIL performance model")

We'll discuss each of these aspects in turn:

#### Response

If a user taps anywhere in your web content they should get a response as quickly as possible, before they notice the lag. The last thing we want is for the user to tap on a button and the response take so long that the user wonders if anything happened.

The main type of response interaction is taping (either with your finger on a mobile device or clicking your mouse or pointer device in laptop or desktop system.)

To respon appropriately we need to - Provide a response within 100 miliseconds - Ideally provide the complete response but, if this is not possible then provide some indication that we're working on the request until it is completed

#### Animation

It's impossible to look around the web and not see animations. Visual animations, scrolling, drag and visual transitions between sections of content; we all take for granted that these will be smooth and it's easier to notice when the animations fail than most any other content.

Examples of animation: - Visual animation: entrance and exit animations, tweened state changes, and loading indicators. - Scrolling: The user starts scrolling and lets go and the page is flung. - Drag: Animation might follow as a result, as when panning a map or pinching to zoom.

This is where the magic 60 frames per second number comes in. In order to make it happen all animations for a given frame need to happen in 16.6 miliseconds or under (1000 ÷ 60 = 16.6)

#### Idle

I was surprised when I saw idle as a component of a performance model until I realized this: When the browser is idle is the best time to actually make it work on long lasting processes.

To make sure we don't turn the idle work into an all consuming thread hog, the RAIL model suggest we break the work in chunks that last no more than 50 miliseconds so that, when the user decides to interact with the page we can respond within 100 miliseconds and not be caught in the middle of an expensive task.

#### Load

When we talk about Page Load in the context of a meaningful and responsive first paint. We want to get the critical path content on to the user's browser as quickly as possible and afterwards the page has to remain responsive, the user can tap, scroll and continue to interact with the site as it finishes loading.

To accomplish this we want to make sure we load the critical path content in a second or less. We need to prioritize the [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/?hl=en) and we can defer non-essential loads to periods of idle time (or lazy-loading them on demand).

### Performance Goals

| Response | Animation | Idle | Page Load |
| --- | --- | --- | --- |
| Tap to paint in less than 100 milliseconds. | Each frame completes in less than 16 milliseconds. | Use idle time to proactively schedule work. | Satisfy the “response” goals during full load. |
|   | Drag to paint in less than 16 milliseconds. | Complete that work in 50-millisecond chunks. | Get first meaningful paint in 1,000 milliseconds. |

## Business Impact

It is not just technology. Performance has been known to affect conversion and retention. Paul and Paul provided the following information in the Smashing Magazine's article:

- Google: [2% slower = 2% less searching per user](http://assets.en.oreilly.com/1/event/29/Keynote%20Presentation%202.pdf)
- Yahoo: [400 milliseconds faster = 9% more traffic](http://www.slideshare.net/stoyan/dont-make-me-wait-or-building-highperformance-web-applications#btnNext)
- AOL: [Faster pages = more page views](http://assets.en.oreilly.com/1/event/29/The%20Secret%20Weapons%20of%20the%20AOL%20Optimization%20Team%20Presentation.pdf)
- Amazon: [100 milliseconds faster = 1% more revenue](http://radar.oreilly.com/2008/08/radar-theme-web-ops.html)
- Shopzilla: [5 seconds faster = 25% more page views, 7 to 12% more revenue](http://www.scribd.com/doc/16877317/Shopzillas-Site-Redo-You-Get-What-You-Measure)
- Aberdeen [Group: 1 second slower = 11% fewer page views, 7% less conversion](http://www.gomez.com/wp-content/downloads/Aberdeen_WebApps.pdf)
- [G￼oogle uses website speed](http://googlewebmastercentral.blogspot.com/2010/04/using-site-speed-in-web-search-ranking.html) ￼in search ranking.

## Dcoumentation and Learning Resources

- “[Optimizing Performance](https://developers.google.com/web/fundamentals/performance/index.html),” Web Fundamentals, Google Developers
- “[Browser Rendering Optimization](https://www.udacity.com/course/browser-rendering-optimization--ud860)” (course), Udacity
- “[Profile](https://developers.google.com/web/tools/profile-performance/index)” (performance), Google Web Tools, Google Developers
- “[The RAIL Performance Model](https://developers.google.com/web/tools/profile-performance/evaluate-performance/rail?hl=en),” Web Fundamentals, Google Developers
