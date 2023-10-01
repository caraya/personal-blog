---
title: "What kind of web do we want?"
date: "2016-06-27"
---

The web, technology wise, is in a great place.

We’ve grown closer to parity with native apps, that’s the gist of progressive web applications, we can have pretty close to the same experience form web apps as we can from native.

Javasacript has improved both in terms of speed and interoperability. New [HTML5 APIs](http://html5index.org/index.html) have contributed to Javascript resurgence and popularity. It’s also new features in ES6 (ratified in 2015) like classes, standardized modules and other APIs make it fun and useful to code in vanilla Javascript.

CSS has moved forward y leaps and bounds. We can do a lot of things that lead directly to our current [Responsive Web Design](http://alistapart.com/article/responsive-web-design) paradigm. The scope of CSS will only make sense when you look at the [complete list of CSS specifications](https://www.w3.org/Style/CSS/specs.en.html).

Yet we forget that not everyone has access to the latest and greatest devices and technologies. We forget that Javascript may not be available to peple everywhere or that the computers they are using may not be up to speed to support the latest and greatest features of our web applications.

[Chris Heilmann](https://twitter.com/codepo8) tackles some of these question in his JSConf.Asia 2015 presentation. I will follow up on some Chris’s presentation and address some additional items that I think are also essential.

<iframe width="560" height="315" src="https://www.youtube.com/embed/cl1wzzjmheI" frameborder="0" allowfullscreen></iframe>

## To Javascript or not to Javascript?

Matt Griffin’s [The Future of The Web](http://alistapart.com/article/the-future-of-the-web) sums up the current debate really well.

Progressive web applications has again reignited the debate between progressive enhancement and the extensible web camp.

On the Extensible Web side…

> … we can see the people who think JavaScript is the way forward for the web. And there’s some historical precedent for that. When Brendan Eich created JavaScript, he was aware that he was putting it all together in a hurry, and that he would get things wrong. He wanted JavaScript to be the escape hatch by which others could improve his work (and fix what he got wrong). Taken one step further, JavaScript gives us the ability to extend the web beyond where it currently is. And that, really, is what the Extensible Web Manifesto folks are looking to do. The web needs to compete with native apps, they assert. And until we get what we need natively in the browser, we can fake it with JavaScript. Much of this approach is encapsulated in the idea of progressive web apps (offline access, tab access, file system access, a spot on the home screen)—giving the web, as Alex Russell puts it, a fair fight.

On the other hand…

> … in the progressive enhancement camp, we get folks that are worried these approaches will leave some users in the dust. This is epitomized by the “what about users with no JavaScript” argument. This polarizing question—though not the entire issue by far—gets at the heart of the disagreement.

I think it’s good to remind ourselves what happens when we turn off Javascript in our browsers because it addresses a deeper issue on the modern web. What happens when you’re not “good enough” for the content you want to access? What happens when your device doesn’t support an API and it wasn’t polyfilled for your application? Living in a world of evergreen browsers doesn’t mean these issues are not important or that we shouldn’t keep them front and center.

Eevee [accidentally left Javascript off](https://eev.ee/blog/2016/03/06/maybe-we-could-tone-down-the-javascript/) after debugging on her browser and then experienced the painful side of the modern web... It doesn't work as intended, if it works at all.

if you want to get a taste for what this feels like and how it (doesn’t) work do the following: Turn off Javascript on your browser. Here are instructions for:

- [Chrrome](http://www.technipages.com/google-chrome-enable-or-disable-javascript)
- [Firefox](http://www.wikihow.com/Disable-JavaScript)
- [Edge](https://kb.iu.edu/d/bcyv#edge)
- [Safari](https://www.engadget.com/2011/01/04/quickly-enable-or-disable-javascript-in-safari/)
- [Opera](http://pchelp.ricmedia.com/enable-disable-javascript-opera/)

Once it is disabled use the web like you would normally and realize how different the experience is. And it doesn’t have to be Javascript turned off, it can be any of these situations that can cause your Javasctipt not to load:

- Slow/old computer
- Slow connection
- Slow computer **and** slow connection
- Old browser on a computer they don’t control
- Someone trying mirror your site for offline access
- Search engine crawler or the Internet Archive
- Text only browser (Lynx, Links, Emacs W3)
- Your CDN goes down
- Corrupted JavaScript

It all turns into a matter of what's the base experience that we're enhancing. Will I be able to accomplish my task if I don't have JavaScript enabled? Will I be able to submit that form if it doesn't get all the fancy upgrades from React or Angular? Will the elements that would have been upgraded by Polymer still work when no JavaScript means no Polymer? Will the site work in my slow connection or via a text browser?

I'm guilty of not bothering to check. The worst example:

_**I have a project list built with Polymer that fetches data from MongoDB hosted in MLab. Do you see the problem? Even if we always had fast and reliable network (we don't) if JavaScript is disabled for any reason the entire experience goes down the drain.**_

How many times do we check our apps to make sure they still work in poor connectivity, when JavaScript is disabled or how tools other than web browsers (screen readers and screen magnification devices come to mind) interact with our content? Did we check to see if we structured the content of the app in a way that the screen reader won’t go crazy trying to read alll the information on the page and drive us nuts trying to understand what it’s reading to us?

I seldom, if ever, do.

And it’s as basic as this: **_it doesn’t matter how cool or powerful an experience we provide to our users if they can’t access it in some fashion after all the bells and whistles are taken away._**

Marcy Sutton reminds us that making content accessible is not hard and shouldn't be but we need to be smart about it.

<iframe src="https://player.vimeo.com/video/118697675?title=0&amp;byline=0&amp;portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

When working in higher education I remember several colleagues working with the disability support group on campus to test products and technologies. What would be the equivalent of doing that for a business? How expensive would it be?

## What is core, what is an enhancement?

Yes, we are talking about apps and interaction heavy sites but, at some point, we must provide a core we can enhance. Scott Jenson has an interesting G+ post on the subject titled [My Issues with Progressive Enhancement](https://plus.google.com/+ScottJenson/posts/S23BqQsEuvR). He asks:

> What I'm chaffing at is the belief that when a page is offering specific functionality, Let's say a camera app or a chat app, what does it mean to progressively enhance it?

Jeremy Keith gives what to me is the the [best answer](https://adactio.com/journal/7774) I’ve heard so far:

> If that were what progressive enhancement meant, I’d be with him all the way. But progressive enhancement is not about offering all functionality; progressive enhancement is about making sure that your core functionality is available to everyone. Everything after that is, well, an enhancement (the clue is in the name). The trick to doing this well is figuring out what is core functionality, and what is an enhancement. There are no hard and fast rules. Sometimes it’s really obvious. Web fonts? They’re an enhancement. Rounded corners? An enhancement. Gradients? An enhancement. Actually, come to think of it, all of your CSS is an enhancement. Your content, on the other hand, is not. That should be available to everyone. And in the case of task-based web thangs, that means the fundamental tasks should be available to everyone …but you can still layer more tasks on top.

Even in reading applications we need to ask ourselves these questions. They drive development and they should also drive UX/UI design.

What's the core of our user experience? To get people content that they want to engage with in some form regardless of the level of technology that we use to access the content

## The shinny new thing syndrome

How often do we hear about the newest, greatest and fastest library? Have you seen articles like:

- [Top 10 web development trends and predictions for 2015](http://www.zingdesign.com/top-10-web-development-trends-and-predictions-for-2015/)
- [The Languages And Frameworks You Should Learn In 2016](http://tutorialzine.com/2015/12/the-languages-and-frameworks-you-should-learn-in-2016/)
- [5 Technologies Disrupting Web Design in 2015](http://www.howdesign.com/web-design-resources-technology/web-tech-developments-disrupting-web-design-in-2015/)

So what’s wrong with the existing tools and technologies? It seems like the community is looking at doing things their way rather than working together to implement a best of breed solution.

We have what I call the “new and shinny” syndrome. We latch on to the latest and greatest technology rather than make sure the existing technology is working fine before we measure whether the application needs to be updated at all.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_yCz1TA0EL4?rel=0" frameborder="0" allowfullscreen></iframe>

Furthermore, as Paul mentiones in the video above, there is some serious cost involved in moving from one framework to another and, some times between versions of the same Framework. What is the learning curve to learn React over Angular or to Learn Angular instead of Polymer?

I never stopped to consider the cost of having to learn new frameworks as I’ve managed to keep myself on a fairly strict diet of frameworks and technologies on my development stack. But I do realize that sometimes it’s not up to the individual developer or team. Some times the tools you use in a project are dictated by what the project makes available to you.

I found myself on this conundrum when I first started working with Javascript task runners and build systems. I started using Grunt for my personal projects and I was OK, may not have been the best but it was the tool I grew comfortable with. When I started working with Polymer, particularly the Polymer Starter Kit, I found out that the project used Gulp and that there was no equivalent Grunt tasks, so I had to learn Gulp and then I was too lazy to switch back to Grunt; I can still understand what they do but I no longer remember the rationale for the scripts. If I have to make changes I’m more likely to create a brand new Gulp script than fixing the existing Grunt tool.

For task runners and build systems we have so many options to make it dangerous to even suggest one. The ones I found when searching:

- [Grunt](http://gruntjs.com/)
- [Gulp](http://gulpjs.com/)
- [Gobble](https://github.com/gobblejs/gobble/wiki)
- GNU Make (yes, this is still an option)
- [Brunch](http://brunch.io/)
- [Broccoli](http://broccolijs.com/)
- [Pint](http://www.pintjs.com/)
- [Fly](https://github.com/brj/fly/blob/master/README.md)
- [NPM](https://www.npmjs.com) (not its primary function)
- Ant (Java based)
- [Jake](http://jakejs.com/)

All these systems perform the same task, getting your files ready for production, in slightly different ways.

I can only imagine what would happen with Frameworks and how many times would you have to switch projects if all you do is use the latest and greatest framework.
