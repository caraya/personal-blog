---
title: "What do we need to do to test apps in browsers"
date: "2017-10-18"
---

I came across this [question in Quora](https://www.quora.com/What-is-the-fastest-way-to-test-a-website-across-all-browsers-and-browser-version/) and prepared a detailed answer but the more I think about it the more I think it deserves a more elaborate answer because it starts from a false premise, that you must test in all versions of all the browsers available to them.

> What is the fastest way to test a website on all browsers and browser version? [Quora](https://www.quora.com/What-is-the-fastest-way-to-test-a-website-across-all-browsers-and-browser-version/)

Now with context out of the way onto the answer

* * *

There are a few things to do before even considering what the fastest way to test is.

The first one is to acknowledge that it’s impossible to test across all browsers, versions and in all devices, your target audiences are likely to be using

The next aspect of this question is to identify your who’s your target audience? Are they browsing on desktop or mobile? what devices are they using to test(emerging markets tend to go for cheap and underpowered devices and this will affect performance during testing and in the real world)? Do you have access to the devices your target audience is likely to be using?

After you’ve answered these questions you’ll realize that, while it’s nice to do so, you can’t to test in all browsers, only the most likely ones for your market and audience.

Tools like [StatCounter](http://gs.statcounter.com/) can help you research your target browsers to test with based on country, OS, browsers and other parameters.

<iframe width="560" height="315" src="https://www.youtube.com/embed/f6As5HEkG5E" frameborder="0" allowfullscreen></iframe>

Next is to consider the differences between mobile and desktop systems. An earlier answer indicated that all modern browsers worked the same so you could get away with testing in Chrome and Firefox. This is simply not true. The differences in performance between desktop and mobile processor performance can have a huge impact on how your application responds.

There are also Proxy Browsers like Opera Mini, Puffin and UC Browser that do server side rendering with only partial support for CSS and JS (Opera Mini servers will run your JS payload for 5 seconds and then stop). How will your site look on those browsers? Does your app work at all?

You might say that it doesn’t matter but it does… you never know where your users are coming from and if you’re targeting emerging markets proxy browsers are widely used to save money

<iframe width="560" height="315" src="https://www.youtube.com/embed/4bZvq3nodf4" frameborder="0" allowfullscreen></iframe>

The other part of this is that you’ll want a way to automate the tests so you don’t have to manually run tests on all your platforms.

Tools like [Browserstack](https://www.browserstack.com/start) or [Saucelabs](https://saucelabs.com/) can help you with the actual testing but to organize large scale test for all versions of all browsers is not only expensive but also unnecessary if you do your user analysis up front and refine it as your site gets traffic

It’s also important to point out that unless you build your own device lab with older hardware that supports the older browser you’ll never get all versions of all browsers (As far as I know most testing platforms will only go as far back as IE6 but not further than that… and even IE 6, 7, 8 and 9 are unsupported by Microsoft).
