---
title: "Web Content Optimization: Performance Budget and Page Speed Test"
date: "2015-11-09"
categories: 
  - "technology"
---

# Web Content Optimization: Performance Budget

Performance budgeting allows developers to user performance as another part of our design and builld process. There is no reason why a site should weigh in at over 2 **mega** bytes or take more than 10 seconds, and over 30 seconds in a mobile device, to load.

In his post [Performance and Design](http://bradfrost.com/blog/post/performance-as-design/), Brad Frost writes that:

> Too often, any talk of web performance quickly ventures into the land of heavy geekery. Terms like DNS lookups, Gzipping, minifying, far future expires headers, caching, ETags and more are thrown around and consequently lose the attention of most non-techy people. This perpetuates a mentality that performance is solely a technical concern that only developers need to concern themselves with. It’s time for us to treat performance as an essential _design_ feature, not just as a technical best practice.

I wonder if we really consider the weight that all the third party content we add to our site and how it affects the user experience. We need to take action in some fashion. Performance Budgeting is a first step in that direction.

## Optimization Tools

Goggle [Page Speed Insights service](https://developers.google.com/speed/pagespeed/insights/) and [Web Page Test](http://www.webpagetest.org/) provide ways to test your web content and give you feedback on what needs to be changed to improve your site's performance.

### Page Speed Insights

Page Speed Insights gives you a coarse evaluation of your site on both mobile and desktop browsers. This is important because Google now uses "mobile friendliness" as a criteria on ranking your site in the search results.

### Web Page Test

[Page Speed Test](http://www.webpagetest.org/) gives you a finer view f your site's performance and provides additional functionality that is not available through Insights alone. My favorite parts of the toolset are the thumbnails and the performance waterfall, similar to that in Chrome Dev Tools

As an example I did a Page Speed Test of a project I'm currently working on. It is hosted in Github which helps explain some of the results.

\[caption id="attachment\_787085" align="aligncenter" width="565"\]![Page Speed Test Result](https://publishing-project.rivendellweb.net/wp-content/uploads/2015/11/page-speed-test.result.png) Page Speed Test Result\[/caption\]

What I find most useful are the thubnails. They give me a timelapse representation of the site's load time. I usually set them to between 0.5 and 1 second.

This has helped me realie the insane amount of "crap" I put on my web content. Granted most of that content is externa to the site such as Codepen examples and Youtube and Vimeo streaming clips. They still add up and they still make the content slower to appear on screen in a usable way which, in the end, is the only metric that really matters

\[caption id="attachment\_787084" align="aligncenter" width="557"\]![Page Speed Test Results -- Thumbnails and Waterfall](https://publishing-project.rivendellweb.net/wp-content/uploads/2015/11/page-speed-test-thumbs-waterfall.png) Page Speed Test Results -- Thumbnails and Waterfall\[/caption\]

### Grunt perfbudget

If you use Grunt for your web build process, there is a plugin that will let you use Page Speed Test as part of your build process.

The task requires you to get an [API key](http://www.webpagetest.org/getkey.php) from Web Page Test to run.

The task configuration looks like this (API key has been removed)

```
      perfbudget: {
        all: {
          options: {
            url: 'https://caraya.github.io/books-as-apps/typography.html',
            key: 'USE YOUR OWN',
            budget: {
              visualComplete: '4000',
              SpeedIndex: '1500'
            }
          }
        }
      },
```

The two parameters I've configured are:

- _visualComplete_ how long (in miliseconds) the page take to look done (be visually complete, even if there are more elements to load
- _speedIndex_ assigned budget for Speed Index

A sample run of the task configured above looks like this:

```
14:10:26] carlos@rivendell images 16552$ grunt perfbudget
Running "perfbudget:all" (perfbudget) task
-------------------------------------------
Test for https://caraya.github.io/books-as-apps/typography.html       FAILED
-------------------------------------------
visualComplete: 3100 [PASS]. Budget is 4000
SpeedIndex: 1702 [FAIL]. Budget is 1500
Summary: http://www.webpagetest.org/result/150828_TC_162F/
```

I was lenient with myself and still was only 900 miliseconds below my _visuallyComplete_ target adn was over the _speedIndex_ target which caused the task to fail. Back to the drawing board.

It is also worth noting that these numbers are not absolutes. While we should be strict in enforcing and following a performance budget there may be situations where the user's perception of speed may be more important than the actual results of Web Page Test. We'll discuss RAIL and user perception as a performance consideration in a later post.
