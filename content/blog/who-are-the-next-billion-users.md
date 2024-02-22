---
title: "Who are the next billion users and how do we accommodate them"
date: "2016-07-06"
categories:
  - "design"
  - "ebook-publishing"
  - "thoughts-and-ideas"
---

Where are the next billion users for our applications come from? When answering this question we have to be careful. The answer itself is easy, the implications of the answer, not so much. I'll leverage 2 presentations to support the rest of the essay.

Tal Oppenheimer from Google's Chrome team made a very interesting and thought provoking presentation about building the web for the next billion users and what we should consider when building our experiences.

Bruce Lawson from Opera takes a different view of the next billion users. He warns us about where these users are coming from and what we need to do on our end to make their experience with you app better.

We, western web developers, are spoiled by choice. We have above average bandwidth, devices are powerful and have plenty of storage and we have both desktop and mobile devices for everyday use as well as development. We can also argue about build tools and about frameworks and debate the little minutiae of front end web development

But not all our users have the same hardware we do and bandwidth doesn’t cost the same everywhere. Not all developers have the same resources than we do.

If we take for a fact that the next billion users will come from Asia (not counting Japan) and Africa then we definitely have to change our mindset as developers.

* [Internet Statistics for Africa](http://www.internetworldstats.com/stats1.htm)
* [Internet Statistics for Asia](http://www.internetworldstats.com/stats3.htm)

I'll pick [India](http://www.internetworldstats.com/asia.htm#in) and [China](http://www.internetworldstats.com/asia.htm#cn) as two examples of what the next billion users may look like. I will not cover political censorship or the Great firewall in China. I don't know how the firewall works and it's outside my area of expertise. I also don't want to deal with politics.

## Infrastructure and cost

The first thing we need to consider is how much does it cost to go online. Even if connectivity is expensive we have better infrastructure and, in metropolitan areas, we have better options for speed and they continue to improve.

In countries like India the number of internet users has increased but not at the same rate as infrastructure and therefore the cost of that infrastructure is higher in India than it would be elsewhere.

Some times we forget that Javascript or no Javascript is more than having it turned on or off but also of it being available. Do we plan for what happens if a JavaScript request times out or if the user agent

The idea behind Progressive Enhancement is to have content for all browsers, regardless of capabilities. Most apps I’ve interacted with will present blank screens when Javascript fails… for whatever reason.

What happens when your connection is so slow that the request times out regardless of how much you’re compressing your data. Or what happens when you’re using a proxy browser like Opera Mini in its current incarnation where most Javascript and CSS is not supported in the payload the server sends to the browser?

Aaron Gustafson’s [Understanding Progressive Enhancement](http://alistapart.com/article/understandingprogressiveenhancement) presents the best defintion of progressive enhancement and graceful degradation:

> THE GRACEFUL DEGRADATION PERSPECTIVE Graceful degradation focuses on building the website for the most advanced/capable browsers. Testing in browsers deemed “older” or less capable usually takes place during the last quarter of the development cycle and is often restricted to the previous release of the major browsers (IE, Mozilla, etc.). Under this paradigm, older browsers are expected to have a poor, but passable experience. Small fixes may be made to accommodate a particular browser. Because they are not the focus, little attention is paid beyond fixing the most egregious errors.



> THE PROGRESSIVE ENHANCEMENT PERSPECTIVE Progressive enhancement focuses on the content. Note the difference: I didn’t even mention browsers. Content is the reason we create websites to begin with. Some sites disseminate it, some collect it, some request it, some manipulate it, and some even do all of the above, but they all require it. That’s what makes progressive enhancement a more appropriate paradigm. It’s why Yahoo! swiftly adopted it and used it to create their Graded Browser Support strategy.

I am normally an advocate for progressive enhancement but for it to be an effective strategy we need to have content to enhance.

## The browser landscape

One of the biggest surprises when researching this article was the difference browser landscape between the China, India and the US and the appearance of new browsers in the landscape that, while available in the US, have a significantly larger market share in Asia.

The tables below are taken from [stat counter](http://gs.statcounter.com/) and reflect data from June 2015 to June 2016.

![StatCounter-browser-IN-monthly-201506-201606-bar](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/StatCounter-browser-IN-monthly-201506-201606-bar)

![Top 9 Mobile & Tablet Browsers in China from June 2015 to June 2016](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/StatCounter-browser-CN-monthly-201506-201606-bar)

![StatCounter-browser-US-monthly-201506-201606-bar](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/StatCounter-browser-US-monthly-201506-201606-bar)

> ***I’m making the assumption that the version of Opera used in India and China is Opera Mini and that UC Browser is also a proxy browser***

[Opera Mini](http://www.opera.com/mobile/mini) and [UC Browser](http://www.ucweb.com/ucbrowser/) are proxy browsers. They work by sending your request to a remote server that fetches the resources for your page, filters some of the content, and returns a compressed blob to the device to render. Because of the way the current version of these browsers fetch the content they don’t handle Javascript or most things we take for granted.

## How do we create content?

When we look at this question we should look at the following aspects:

* The actual content we create
* Handling device limitations and how it affects the content we create.

### Cultural awareness on the content we create

Different audiences require different content and addressing issues that may not seem relevant. These are some examples:

In his presentation Bruce Lawson suggest we don’t require a last name because there are people in Asia who only use one name and requiring a last name means they can’t register for our service.

Even in countries that speak the same language words can have different meanings.

I’m a Spanish native speaker and always thought that guagua only means baby as it did where I grew up. But according to [Wikitionary](https://en.wiktionary.org/wiki/guagua) it may also mean bus in other areas where people speak the language.

Colors can have different meanings depending on the user’s cultural background. In the table below, taken from [http://blog.globalizationpartners.com/culturally-customized-website.aspx](https://web.archive.org/web/20111104184034/http://blog.globalizationpartners.com/culturally-customized-website.aspx), we can see how different cultures perceive color. How does the perception of color affect how people see your brand and content?

| &nbsp; | 	Countries |||||
| Color | USA | China | India | Egypt | Japan
| :---: | --- | --- | ---| ---| --- |
| Red | Danger<br>Love<br>Stop| Good fortune<br>Luck<br>Joy | Luck<br>Fury<br>Masculine| Death| Anger<br>Danger |
| Orange| Confident<br>Dependable<br>Corporate | Fortune<br>Luck<br>Joy| Sacred (the Color Saffron)| Virtue<br>Faith<br>Truth| Future<br>Youth<br>Energy |
| Yellow | Coward<br>Joy<br>Hope |Wealth<br>Earth<br>Royal | Celebration | Mourning | Grace<br>Nobility |
| Green | Spring<br>Money<br>New | Health<br>Prosperity<br>Harmony | Romance<br>New<br>Harvest | Happiness<br>Prosperity | Eternal life |
| Blue | Confident<br>Dependability<br>Corporate | Heavenly<br>Clouds | Mourning<br>Disgust<br>Chilling | Virtue<br>Faith<br>Truth | Villainy |
| Purple | Royalty<br>Imagination | Royalty | Unhappiness | Virtue | Wealth |
| Black | Funeral<br>Death<br> | Evil | Heaven<br>Neutral<br>High Quality | Evil | Death |
| White | Purity<br>Peace<br>Holy | Mourning | Fun<br>Serenity<br>Harmony | Joy | Purity<br>Holiness |

### Working with the constraints of users’ devices

Another thing to consider is device capabilities. As developers we should not think that everyone everywhere will have the same type of hardware we have available

How do you handle the limitations of proxy browsers when they are the main browser used by your target audience? Both UC Browser and Opera Mini are soon releasing (if they haven’t already) versions that will support more of the technologies to create Progressive Web Applications. Will it be enough to render your content as you intended? Will it be a close approximation?

If you decide to gracefully degrade your content how do you handle Proxy Browsers, since they will be your lowest common denominator?

## Testing simulated speed and testing on devices

To get an idea of what would a slow connection would do to your application throttle the connection. This is only available in Chrome Dev Tools under the network tab

![DevTools network throttling](https://developers.google.com/web/tools/chrome-devtools/profile/network-performance/imgs/throttle-selection.png)

It’s a good approximation to what the experience is for users in that type of connection but it’s just that, an approximation. We should still test in the devices we expect our users to have and use.

We should also test on actual devices mirroring, as close as possible, the devices we expect our users to have

![Device pile by Adactio on Flicker (cc by 2.0)](https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/6153522068_0437d550f7_z)

In addition to the variety of devices that we have in western countries (some of them shown in the image above) we have many other devices specific to regions or countries.

Do you recognize any of these phones?

* [Nokia X2 \_01-3610](http://www.gsmarena.com/nokia_x2_01-3610.php)
* [Samsung E1282T](http://www.gsmarena.com/samsung_e1282t-5362.php)
* [Nokia 2690](http://www.gsmarena.com/nokia_2690-3004.php) These are the top three mobile phones used in India in 2015 based on Opera agregate data and presented by Bruce Lawson at Velocity. Look at the specs and form factors of these phones. How does it affect the design and development process?

One last aspect we need to consider is the size of our web content against what it’ll cost users to access it. India’s internet is slower and more expensive than we would expect.

In her presentation Tal Oppenheimer gives the example of some people in INdia having to spend salary equivalent to 17 hours of work to buy a 500MB data package.

If we accept that the standard web application developed in the US is 2MB in size (combination of HTML, CSS, JS, images and any additional content) How much are we asking our users in India (and other places with similar access cost) to spend just to interact with our content? How much are users choosing not to interact with our application because of its cost?

## Conclusion

There are many factors to consider when working with the next billion users. This essay rises questions and beings the process of learning more about who the next users of our apps will be.
