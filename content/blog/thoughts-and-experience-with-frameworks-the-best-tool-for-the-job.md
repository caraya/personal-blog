---
title: "Thoughts and experience with frameworks: The best tool for the job"
date: "2016-12-30"
---

Let's face it. The web has become too big. At every stage on the development process we have several different tools each with a passionate following that will tell you their tool is better than the other tools in that category.

If you've been doing development for any length of time you'll remember that frameworks are not new. We can go as far back as jQuery and libraries developed around that time (August, 2006) to see the evolution of frameworks. When they are first introduced they are good.

Does anyone remember other Frameworks from the early jQuery era?

- MooTools
- Dojo
- Prototype
- script.aculo.us
- Ext Core
- JsPHP
    
    When jQuery and its siblings first came out the browser landscape was very different. These are some of the browsers released in 2006, according to Wikipedia
- Netscape 8.1
    
- Opera 9
- Opera 9.1
- Internet Explorer 7
- Camino 1.0 (Mozilla browser for Macintosh)
- Mozilla Seamonkey 1.0
- Mozilla Suite 1.7.13

The browser landscape was considerably different both in terms of features and in terms of interoperable implementations. This is the tail end of the browser wars. Netscape had become a subsidiary of AOL (1999) and was shutdown (2003)

Most people will stay there until the next generations of frameworks come out or they realize that vanilla Javascript will work better than their library and work consistently across browsers (this wasn't always the case). By never moving beyond jQuery you never learn the real breadth and depth of what you can do with Javascript, only what the frameworks expose to you and what plugin developers think is important.

Sites like [you might not need jQuery](http://youmightnotneedjquery.com/) show that Javascript has evolved enough to do most of what jQuery and other frameworks did and work across browsers. We must also remember that jQuery fixes several [browser specific bugs](https://docs.google.com/document/d/1LPaPA30bLUB_publLIMF0RlhdnPx_ePXm7oW02iiT6o/edit)

My favorite framework/library from this period is Dojo. I will still use it for the occasional fun project.

## My framework, your framework, everyone's frameworks

![](http://noeticforce.com/sites/default/files/styles/article-detail/public/articles/best-javascript-frameworks_0.jpg?itok=At3uyXpN)

This is a sample of Javascript frameworks.

- Angular
- Polymer
- Ember
- React
- React Native
- Aurelia
- Meteor
- Knockout
- Mercury
- Backbone

Frameworks have become large, monolithic constructs that, until fairly recently, presented an all or nothing approach. If you wanted to use a certain subset of features you had to load the core javascript library and any number of additional files that contained the functionality we wanted to use. Unless you concatenate and minimize the files, using frameworks led to code bloat and unnecessary networks requests.

Over time many frameworks emerged and some have managed to survive without major changes while others, like Polymer, have changed as the underlying specifications have changed. The idea is that by presenting a unified custom library we can speed up development and make the application faster.

This may be true but it doesn't mean that they will work consistently in older browsers. I've heard people say that's ok, we got evergreen browsers from all major vendors (Microsoft Edge, Opera and Chrome) automatically update to the latest version, as long as there is no admin policy to the contrary.

What I've seen over the years is that when you adopt a framework you do for the long term. It is not always easy to upgrade and your team must decide whether a point upgrade is worth making any necessary changes.

Some of the questions I ask when I first start considering a framework either starting from scratch or moving to a new framework:

- How does it address accessibility?
- Does it provide an upgrade path?
- How much of the application do we need to rebuild in the new framework?
- How much data needs to change to accommodate the way the new framework does things?
- Is there internal expertise to tackle the challenge of moving to a new framework?

### My experience with frameworks

I first started looking at Angular 1.0 and Polymer 0.5 in late 2014.

Angular came as the hot new kid in town. It is supported and implemented by a team lead by Googlers. I really liked the concept and started doing some serious work learning how to work Angular and Firebase and Angular and Mongolab.

I was happy learning but when the Angular Team first announced Angular 2.0 they had stated that there would be no migrating path between version 1.0 and 2.0 of the framework. To put it mildly I was angry and felt betrayed. I kept the applications that I had but decided that continuing learning the framework was not worth the time it would take to learn both Angular 1 and 2.

Since the initial announcement the Angular team has changed its position and now offers both an upgrade path and a way to build [hybrid Angular 1 and 2 applications](https://angular.io/docs/ts/latest/guide/upgrade.html) but it came too little too late for people who, like me were learning the framework at the time.

The concept of web components really caught my attention. Expanding native HTML as a way to build applications is really interesting and the Polymer abstractions made it very easy to reason through and the support from the Polymer team and Polymer experts has been top notch.

I was less than happy when I found out that the transition from 0.5 to Polymer 1.0 would be completely different. Another learning curve but the Polymer team provided an [upgrade guide](https://www.polymer-project.org/1.0/docs/migration) and the [Polyup](http://polymerlabs.github.io/polyup/) tool to automate the upgrade process.

Polymer 2.0 will be released in early 2017 and, again, it's a completely different syntax that takes advantage of the new V1 syntax for custom elements and shadowDOM and the fact that most browsers have implemented or will soon implement custom elements and shadowDOM.

Hopefully the update process will be just as easy as the 1.0 upgrade :-)
