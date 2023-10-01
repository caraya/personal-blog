---
title: "Choosing your tools smartly"
date: "2016-02-03"
categories: 
  - "technology"
---

> A grocery store in Melno Park, California sets up a special display to sell jam. At certain times, the display had six flavors to choose from. At other times, the display had 24 choices. Each person who came by the sample booth was given a $1 coupon to purchase. The displays were up for a total of 10 hours. Here are the results:  
> **_The display with 24 choices_**  
> \* Number of people who stopped by: 145 \* Number of people who bought from the display (based on coupon redemption): 4 \* Percentage redemption: 4%  
> **_The display with six choices_**
> 
> - Number of people who stopped by: 104
> - Number of people who bought from the display (based on coupon redemption): 31
> - Percentage redemption: 31% What appeared to customer as a typical promotion was actually a sociological experiment. The attendants handing out samples were research assistants of one Dr. Sheena Iyengar, the S.T. Lee Professor of Business at Columbia Business School. She was studying the effect that the number of purchase choices has on the propensity to actually make a purchase. From [Too Much Choice: The Jam Experiment](https://peopletriggers.wordpress.com/2013/08/31/too-much-choice-the-jam-experiment/)

While the data from the study may or may not be enough to verify its validity it does bring an interesting point. **How many choices are too many?**

Reading Addy Osmani's [Front-end Choice Paralysis](http://addyosmani.com/blog/front-end-choice-paralysis/) coupled with some of my own learning time allocation for front-end technologies (like choosing not to learn Angular 2 and concentrate on Polymer 1.0 or learning SASS and its ecosystem instead of worrying about Less) make me wonder if we are not being spoiled by too many choices.

Before you jump on me with 'choices are good, choices help developers' Let me start by saying that with fewer numbers I'd agree with you but we have too many options and, sometimes, we don't even look at the framework before deciding we will use it for our project.

## CSS Frameworks

This [Google Spread sheet](https://docs.google.com/spreadsheets/d/1bb_Sn1glpSGZe_IAIKB4nHawOLwx5ONmY_ULMlRJNsg/edit#gid=0) present 8 CSS frameworks. I seem to remember that there were more in the spreadsheet at some point. Researching if it's the same or if there's another one circulating out there that has more options.

It does not account for newer versions of Frameworks with changed performance and feature support. For example Bootstrap 4 is now written in SCSS/SASS rather than Less and both Bootsrap 4 and Foundation 6 supports flex-based grid layouts but you have to recompile your project for the changes to take effect.

Rather than what framework to use we should be looking at what features do we need and how do different frameworks provide them then we can decide what framework to use based on the features we need, the way the framework provides them and as a third consideration what other features the framework provides

## Javascript

[Todo MVC](http://todomvc.com/) does a similar work for Javascript frameworks. But here it gets more complex, are you using pure Javascrtip? jQuery? a client-side framework? server-side framework? languages that compile to Javascript? Combinations of different technologies?

> Developers these days are spoiled with choice when it comes to [selecting](http://coding.smashingmagazine.com/2012/07/27/journey-through-the-javascript-mvc-jungle/)a **MV framework** for structuring and organizing their JavaScript web apps. Backbone, Ember, AngularJS… the list of new and stable solutions continues to grow, but just how do you decide on which to use in a sea of so many options? To help solve this problem, we created TodoMVC - a project which offers the same Todo application implemented using MV _concepts in most of dethe popular JavaScript MV_ frameworks of today. From the [Todo MVC](http://todomvc.com/) Introduction

## Why I'm not happy

There is no week when at least 1 article like this: [21 Best JavaScript Frameworks for Programmers 2015](http://www.k2ice.com/top-21-best-javascript-frameworks-for-programmers-2015/) where there is no rationalization for their choice of platforms to include in the selection or sample code where we can test the assertions. What criteria do we use to evaluate technology? Do we make our assumptions and biases explicit when choosing what we consider the best of a given type of product.

CSS tends to be less of an issue as in my opinion all the frameworks claim to be leaner than the others and provide some advanced feature over other frameworks.

If we need anything, in my opinion, is a common evaluation framework. For Javascript TodoMVC provides a good starting point and we need to push it forward but I don't think there's an equivalent testing ground for CSS. Some of the things I look at when looking at a framework and that most beginners would need to know/see are:

- Learning Resources
- Documentation
- Community
    
    - Github statistics
        
        - Number of stars
        - Number of forks
    - Open versus closed pull requests
        
        - How many closed requests are rejected?
    - Open versus closed issues
- Framework Size (uncompressed and minimized)
    
    - Framework on its own
    - Framework + dependencies
- Backwards compatibility
- How does a sample project look like
- Sample application metrics
    
    - Lines of code
    - Number of dependencies

This is not an exhaustive list and sometimes I add criteria or take it away but having a common criteria for evaluation would help people figure out if the new framework is worth the effort of reimplementing your application with it.

## The web is far more complex today

We need frameworks. We don't need to be married to them. We don't need to change our frameworks whenever something new comes up, at least not without evaluating what the alternatives are.

Do not jump to the latest and greatest just because it's the latest and greatest and you think only the ltest and greatest toolset will make you marketable. What feature(s) of the new framework make it compelling enough for you to learn and/or switch your project to it? How much work will it take to switch? Why is this framework better than the one you learned 2 months ago?

Links and resources

- [Journey through the Javascript junlgle](http://www.smashingmagazine.com/2012/07/journey-through-the-javascript-mvc-jungle/) -- Addy Osmani in Smashing Magazine
- [AngularJS vs. Backbone.js vs. Ember.js](https://www.airpair.com/js/javascript-framework-comparison)\- - Best comparison of JavaScript Frameworks I've found
