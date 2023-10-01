---
title: "Design for the lower end of the spectrum: Part 2"
date: "2018-09-12"
---

## Framing the issue through social lenses

<iframe width="560" height="315" src="https://www.youtube.com/embed/P9xEC55Kbpk?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Bruce Lawson's presentation about the web around the world and it being our responsibility to keep in mind those people who are not in the wealthy western hemisphere where we take connections and devices for granted.

Designing apps and sites it's not just a matter of creating a good technical framework. It's also about knowing the culture and the people you are building the content for. This may mean a lot of research and, ideally, a visit to the country or countries that you're building your application for.

For example, do not force users to provide a first **and** and last name. In southeast Asia there are people who only use one name; making them lie or make up a name just to use your service means they are not likely to use your service again, or at all.

Bandwidth is an essential consideration. When the 1GB of bandwidth cost a large part of a user's monthly salary, it becomes very important to make the applications (native or web) as small as possible to make them affordable, not in the direct cost of the app but in the cost of the bandwidth it takes to download it.

![Price of 1GB of broadband data as percentage of average income](https://1e8q3q16vyc81g8l3h3md6q5f5e-wpengine.netdna-ssl.com/wp-content/uploads/2017/11/Regional-Broadband-Pricing.png)

Cost of 1GB of mobile prepaid data across 59 low- and middle-income countries at the end of 2016.

Perhaps the most important consideration is to meet your users where they are and in the language, they speak. Using colors may be tricky if you haven't researched their cultural significance. The table below shows how different cultures perceive different colors. You can see that the perceptions can be absolutely different.

| COLOR | USA | China | India | Egypt | Japan |
| --- | --- | --- | --- | --- | --- |
| Red | Danger  
Love  
Stop | Good fortune  
Luck  
Joy | Luck  
Fury  
Masculine | Death | Anger  
Danger |
| Orange | Confident  
Dependable  
Corporate | Fortune  
Luck  
Joy | Sacred (the Color Saffron) | Virtue  
Faith  
Truth | Future  
Youth  
Energy |
| Yellow | Coward  
Joy  
Hope | Wealth  
Earth  
Royal | Celebration | Mourning | Grace  
Nobility |
| Green | Spring  
Money  
New | Health  
Prosperity  
Harmony | Romance  
New  
Harvest | Happiness  
Prosperity | Eternal life |
| Blue | Confident  
Dependability  
Corporate | Heavenly  
Clouds | Mourning  
Disgust  
Chilling | Virtue  
Faith  
Truth | Villainy |
| Purple | Royalty  
Imagination | Royalty | Unhappiness | Virtue | Wealth |
| White | Purity  
Peace  
Holy | Mourning | Fun  
Serenity  
Harmony | Joy | Purity  
Holiness |
| Black | Funeral  
Death  
Evil | Heaven  
Neutral  
High Quality | Evil | Death  
Evil |   |

There is a similar issue with local languages and dialects. It is not a good assumption that most of your users outside the US and Canada speak English but, even if they do, it would help them (and you) enormously if you take the time to translate your content to their language or dialect.

Yet for all the differences in languages and technologies, we are not that different. In his two-part essay in [Smashing magazine](https://www.smashingmagazine.com/2017/03/world-wide-web-not-wealthy-western-web-part-1/) Bruce Lawson addresses this.

> There is a more profound commonality as well. Below are the top-10 domains that Opera Mini users in the US visited in September 2016. (These figures are from Opera’s internal reporting tools; I was Deputy CTO of Opera until November 2016. Now I have no relationship with Opera.)
> 
> 1. google.com
> 2. facebook.com
> 3. youtube.com
> 4. wikipedia.org
> 5. yahoo.com
> 6. twitter.com
> 7. wellhello.com
> 8. addthis.com
> 9. wordpress.com
> 10. apple.com
> 
> The top-10 handsets used to view those websites were:
> 
> 1. Apple iPhone
> 2. Apple iPad
> 3. Samsung Galaxy S Duos 2
> 4. Samsung Galaxy S3
> 5. Samsung Galaxy Grand Prime
> 6. Samsung Galaxy Grand Neo Plus
> 7. Samsung Galaxy Grand Neo GT
> 8. Nokia Asha 201
> 9. Samsung Galaxy Note III
> 10. TracFone LG 306G
> 
> The top-10 domains visited in Indonesia during the same period were:
> 
> 1. facebook.com
> 2. google.com
> 3. google.co.id
> 4. wordpress.com
> 5. youtube.com
> 6. blogspot.co.id
> 7. wikipedia.org
> 8. indosat.com
> 9. liputan6.com
> 10. xl.co.id
> 
> Note the commonalities — keeping in touch with friends and family; search; video; uncensored news and information (Wikipedia) — as well as the local variations. The top-10 handsets in Indonesia are lower-end than those used in the US:
> 
> 1. Nokia X2­01
> 2. Nokia Asha 210
> 3. Nokia C3-00
> 4. Generic WAP
> 5. Nokia Asha 205.1
> 6. Samsung Galaxy V SM-G313HZ
> 7. Nokia 215
> 8. Nokia X2-02
> 9. Samsung GTS5260 Star 2
> 10. Nokia 5130 XpressMusic
> 
> In Nigeria last month, almost the same kinds of websites were viewed — again, with local variations; Nigeria is football-crazy, hence goal.com.
> 
> 1. google.com.ng
> 2. facebook.com
> 3. google.com
> 4. naij.com
> 5. youtube.com
> 6. bbc.com
> 7. opera.com
> 8. wikipedia.org
> 9. goal.com
> 10. waptrick.com
> 
> But the top-10 handsets in Nigeria are lower-end than in Indonesia.
> 
> 1. Nokia Asha 200
> 2. Nokia Asha 210
> 3. Nokia X2-01
> 4. Nokia C3-00
> 5. TECNO P5
> 6. Nokia Asha 205
> 7. Nokia Asha 201
> 8. TECNO M3
> 9. Infinix Hot Note X551
> 10. Infinix Hot 2 X510

Doing some digging on the specs of these phones is eye-opening.

For example the Nokia Asha 210 (number 2 most used phone in Indonesia and Nigeria in 2016 according to the stats above):

- Display: 2.40 inches
- No Front Camera
- Resolution: 240x320 pixels
- RAM: 32MB
- Storage: 64MB

And your content has to work as well on both ends.

## Design as a frame of reference

Google introduced the [Next Billion Users](https://www.blog.google/technology/next-billion-users/) concept as an umbrella for initiatives geared towards the next generation of Internet users.

These users will not be in North America or Western Europe. They will be un Sub Saharan Africa, Asia, and Latin America, places like Brazil, China, India, Indonesia, and Nigeria. They will be using mobile devices that, as a rule, are far less powerful than the devices we take for granted in far less reliable networks 2G and 3G networks.

For the next billion, it's not a matter of mobile first but of mobile only. Their entire online experience is based on the devices they use.

Many of them will use proxy browsers to maximize their bandwidth usage. These browsers (like [Opera Mini](https://www.opera.com/mobile/android)) create a new set of constraints for designers and developers.

> Opera Mini is not the only proxy browser available. It's the one I've tested with and the one I'm most familiar with.

Oper Mini has multiple settings whose names are dependent on version and Operating System. See [Opera Browsers, Modes & Engines](https://dev.opera.com/articles/browsers-modes-engines/) for more information on the different versions of Opera Mini, their support for standards and the rendering engine they use.

For the remainder of this section, I'll assume that Mini is using its most aggressive data saving settings.

<iframe width="560" height="315" src="https://www.youtube.com/embed/6fBS8LOpIQc?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

And the usage of proxy browsers like Opera Mini is why PWAs are well suited to emerging markets and why we should design for these lower-end devices as well as for the high-end phones and tablets that we are used to.

I won't go into the details of how to build a PWA. There's plenty of information online about the subject, including [Progressive Web Apps training curriculum](https://developers.google.com/web/ilt/pwa/) from Google available to use.

PWAs use APIs that make web applications competitive with native apps in a more equal footing.

Through service workers, PWAs provide caching mechanisms so that the content loads faster after the first visit and can intercept requests to modify or completely alter the response the user gets.

PWAs can notify the user about new information and when there is updated content for the user to see using push notifications.

Service workers can provide offline content, either a default offline page or a view of the last content stored in the cache.

Finally, service workers improve the site's performance beyond giving you offline capabilities. Depending on how you choose to cache your content, the browser may not need to fetch content from the network and, instead, it'll get it from the cache... a much faster experience.

And why is this important? Bruce Lawson states it succinctly:

> Recently, my ex-Opera colleague Andreas Bovens and I interviewed a Nigerian and a Kenyan developer who made some of the earliest progressive web apps. Constance Okoghenun said:
> 
> > Nigerians are extremely data sensitive. People side-load apps and other content from third parties \[or via\] Xender. With PWAs \[…\], without the download overhead of native apps \[…\] developers in Nigeria can now give a great and up-to-date experience to their users.
> 
> Kenyan developer Eugene Mutai said:
> 
> > \[PWAs\] may solve problems that make the daily usage of native mobile applications in Africa a challenge; for example, the size of apps and the requirement of new downloads every time they are updated, among many others.
> 
> We are seeing the best PWAs come out of India, Nigeria, Kenya, and Indonesia. Let’s look briefly at why PWAs are particularly well suited to emerging economies. With a PWA, all the user downloads is a manifest file, which is a small text file with JSON information. You, the develop link to the manifest file from the head element in your HTML document, and browsers that don’t understand it just ignore it and show a normal website. This is because HTML is fault-tolerant. The vital point here is that everybody gets something, and nobody gets a worse experience. Bruce Lawson — [World Wide Web, Not Wealthy Western Web (Part 1)](https://www.smashingmagazine.com/2017/03/world-wide-web-not-wealthy-western-web-part-1/)

## Server side performance ideas

From a technical standpoint, we can optimize how we serve our content to users.

Using HTTP/2 (or H/2) servers, configured with SSL, is a good first step to take to make sure that we're serving assets without bundling. This is not ideal, Sérgio Gomes has written about [why we can't stop bundling assets yet](https://sgom.es/posts/2017-06-30-ecmascript-module-loading-can-we-unbundle-yet/) but, if you're not going to bundle then updating to H/2 and enabling SSL/TLS us the next best thing.

The SSL/TLS bit is not optional. Most of the APIs used for PWAs, Service Workers in particular, require secure origins because of how powerful they are and the impact of potential [man in the middle attacks](https://www.incapsula.com/web-application-security/man-in-the-middle-mitm.html) or other kinds of spoofing

The next reasonable step is to serve your static assets through a Content Delivery/Distribution Network (CDN) like [Akamai](https://www.akamai.com/), [Cloudflare](https://www.cloudflare.com/) or [Cloudinary](https://cloudinary.com/) for media assets. These CDNs are designed to distribute your content around multiple data centers around the world and to serve the assets from the closest data center to the user's location.

> At its core, a CDN is a network of servers linked together with the goal of delivering content as quickly, cheaply, reliably, and securely as possible. In order to improve speed and connectivity, a CDN will place servers at the exchange points between different networks. These Internet exchange points (IXPs) are the primary locations where different Internet providers connect in order to provide each other access to traffic originating on their different networks. By having a connection to this high speed and highly interconnected locations, a CDN provider is able to reduce costs and transit times in high-speed data delivery. — [What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/)

Because a CDN serves content from the closest server to the user's location and caches the resources it serves, users get faster downloads and quicker interactions with the content.

We can further enhance our app or site's performance using service workers to create client-side caches off the content the user accesses... Caching is just a starting point for what we can use service workers for.

Because we manually configure all the caching routes, we have much more control over what we cache, what data we return and when do we use the network to retrieve new or updated assets. See [The Offline Cookbook](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/) and [The ServiceWorker Cookbook](https://serviceworke.rs/) for ideas and code on how to use service workers.

I've left out HTTP2 push and resource loading hints because, as Jake Archibald mentions in [HTTP/2 push is tougher than I thought](https://jakearchibald.com/2017/h2-push-tougher-than-i-thought/) there are enough bugs across browser implementations (mostly Edge and Safari) that make it dicey to use them reliably.
