---
title: "Empathy in Design and Development: Analytics as a User Research Tool"
date: "2017-10-04"
---

Another thing to do when looking at what our users do on our site is to see where they come from and what device they are browsing with. I used to not care as much about where users were coming from as much as I cared about what browsers they were using.

But then I started looking at the logs and some strange browsers appeared in the logs. Not many and not often enough to warrant making changes but enough to take a look at these funky browsers: Opera Mini and UC browser.

Opera Mini and UC browsers are proxy browsers. Rather than do all the processing in the device they send the URL to a central server to do the rendering and, limited, Javascript and CSS. The server sends a single file containing the server rendered version of your page (without most of your CSS and Javascript) back to the client at a fraction of the size of the individual resources put together. As you can imagine this helps when you access the web with low end devices that will not handle your 2MB of Javascript gracefully.

The reason why this is important is **learning about your user**. It helps you figure out the combination of geographical location, browser and (mobile) devices for your users. If you're working on emerging markets or if you have users from countries you were not expecting it may help you to research those browsers.
