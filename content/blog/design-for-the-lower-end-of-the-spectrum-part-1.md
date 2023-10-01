---
title: "Design for the lower end of the spectrum: Part 1"
date: "2018-09-10"
---

Ever since I've been on the web (1994) I've been a part of a tension between the right and the easy way to do things, between tables and CSS, between frameworks, between techniques, between technologies and, it seems, between desktop and mobile or between native apps and well done mobile.

With all the hardware limitations that we get with mobile, the web is still well placed to target emerging markets and lower end devices and poor network connectivity.

To frame the post; the talk below by Alex Russell at [Samsung Create](https://samsungcreate.com/) last April illustrates some of the issues that the web faces in mobile devices.

<iframe width="560" height="315" src="https://www.youtube.com/embed/VpixmppRbZU?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

I bring it up because Alex has been giving the same (or very similar) talk since 2016 or thereabouts. The issues he describes have not changed and that's sad... particularly because we can do things about some of these aspects and understand those things that we cannot change will help us craft our experiences to ameliorate those problems.

In the rest of this essay, I will address some of these issues along with a few others that, I believe, make the web a good development platform.

### Developer facing issues

We've let the web grow fat. We've forgotten that a lot of people live in a world where iPhones and high-end desktop machines are not the norm. The information below shows how far we've let things go.

Later, I will present possible solutions to these issues.

> The values in this section represent the median of all values the HTTP archive provides. Individual values may fall over and under those listed here and the average value will be higher.

The point is that as developers we are lazy. None of the issues below are built into the platform and, later, we'll see how we can address them:

| Issue | Source |
| --- | --- |
| Images are still the largest portion of any page download. The median size for an image is 649.9 KB for desktops and 493.4 KB for mobile. These numbers are going down, but they are still bad when you consider that the average desktop site makes 33 requests for images and the average mobile site makes 28 requests. | HTTP Archive [State of Images](https://httparchive.org/reports/state-of-images) |
| The median payload of scripts with a mime containing script or json is 402.9 KB for desktop and 361 KB for mobile. The value doesn't indicate if the payload is compressed or not. | HTTP Archive [State of Javascript](https://httparchive.org/reports/state-of-javascript) |
| Even if we leave Javascript and images aside, the median desktop site sends 1511.2 KB down the wire. Mobile is slightly better, it "only" sends 1253.9 KB | HTTP Archive [State of Javascript](https://httparchive.org/reports/state-of-javascript) |
| Mobile performance is improving but it's not ideal. It takes a median of 7.6 seconds from the time the navigation starts until the layout stabilizes, web fonts are visible, and the page is responsive to user input | HTTP Archive [Loading Speed](https://httparchive.org/reports/loading-speed) |
| It takes a median of 9.4 seconds from the time the navigation starts until the page is fully interactive and the network is idle. The performance metrics comes from Lighthouse and are only available for mobile | HTTP Archive [Loading Speed](https://httparchive.org/reports/loading-speed) |

## Framing technical issues

Depending on where you do business most, if not all, your users will come online in mobile devices and they won't be top of the line iPhone X, iPad Pro or high-end Android devices like what we have in Urban areas of the US and Canada.

Even in the United States and Canada, we should not rely on high-speed connections or that all our users will have good 3G, 4G, and LTE connectivity, particularly in rural areas or in places where it's not feasible to build high-speed mobile infrastructure.

Likewise, we shouldn't believe that the throttled network settings in Chrome or other browsers. These simulations may change the characteristics of your network connection: slow it down or introduce additional latency or delays to the mix, but they will never be able to simulate other parts of the equation: waking up the CPUs, waking the cellular modem, the handshake between the phone and the closest cell tower and, from there, the TCP handshake, SSL connection, and rendering of the page. They are a good starting point but, as the only testing, it won't cut the mustard.

It's always good to test on the devices that your target demographic will be using. Most of these devices will be cheap and underpowered compared with what you would normally use and they may be a closer approximation to what you will see in the field.

### Understanding mobile devices

In order to understand why mobile and desktop performance is so different, we need to understand what makes a mobile device.

Unlike desktop machines where we can expect the same performance from all the cores in the CPU (symmetrical multiprocessing), mobile devices are unlikely to use the same type of cores in their configuration. They are likely to have some powerful cores and some less powerful.

When looking at mobile CPU specs, the important questions you should ask are:

- What type of cores does it use?
- What clock rate do the cores run at?
- How many are they?

Why does the number of core matters and why should we care?

Two reasons:

- What cores fire at what time to execute what task
    
    - Advertised speed is seldom the speed you get on a regular basis
    - How does the asymmetrical core configuration affect performance
- How the layout of the SOC (System on a Chip) affects heat dissipation?
    
    - How does heat dissipation affect performance?
    - Does a hot phone perform as well as a cold one?

The whole point of having cores with different characteristics is that the more powerful cores will see limited use and the lower-powered cores will be used more often because they consume less power overall... and power usage is a concern because we want the battery to last as long as possible and, at the same time don't want the device to overheat, right?

Overheating is always a cause for concern. It usually means that we're hitting the CPU or GPU in your SOC harder than normal (generating heat) and they are drawing more power from the battery (generating heat). This makes the phone hotter than normal.

As developers, we may think this doesn't touch us but it does. Think about it, the larger we keep the CPU (either high end or low end) running the more power it will use (draining the battery) and generate heat.

## Framing the business case

We've all heard the 3-second rule for page load. A variation of _**If your page takes longer than 3 seconds to load users will go away**_.

According to Tami Everts in the [Akamai Blog](https://developer.akamai.com/blog/2016/09/14/mobile-load-time-user-abandonment):

- 46% of consumers say that waiting for pages to load is their least favorite thing about shopping via mobile
- Average load time for mobile sites is 19 seconds over 3G \[The HTTP Archive data uses median values instead\]
- 53% of visits to mobile sites are abandoned after 3 seconds
- Comparing faster sites (5 seconds) to slower ones (19 seconds), the faster sites had average session lengths that were 70% longer and bounce rates that were 35% lower
- Mobile sites that loaded in 5 seconds earned almost double the revenue of sites that took 19 seconds to load

So, if your company's page loads faster than the competition, users are more likely to use (and stay on) your site and not theirs.

Furthermore, if you're building native applications you need multiple teams working with multiple codebases to be up to date and have feature parity, which is not always easy or even possible to do.
