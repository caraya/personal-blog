---
title: Ruby on Rails for Javascript?
date: 2024-07-22
tags:
  - Javascript
  - Framework
---

Laravel for PHP and Ruby on Rails for Ruby provide a full set of opinionated, 'batteries included' of tools, libraries and processes to create web applications.

In [Why We Don't Have a Laravel For JavaScript... Yet](https://wasp-lang.dev/blog/2024/05/29/why-we-dont-have-laravel-for-javascript-yet), Vinny (a DevRel engineer at Wasp) discusses his views on why Javascript doesn't have an opinionated framework like Ruby on Rails or Laravel.

I have a different opinion of why Javascript doesn't have an equivalent tool and will discuss it in this post, along with a set of tools to build an equivalent platform.

I will also base the content of this post on Ruby on Rails, which is what I'm most familiar with.

## What Rails offers

Rails is a very opinionated framework that offers everything you need to build a web application but it's worth digging into why this is.

I've taken the two aspects I consider most important from the Rails Doctrine document when it comes to building your own framework.

### Convention over configuration

When and how should the community discuss the details of basic app configuration and setup?

How much detail should we debate about how our framework will work, as DHH asks in the [Rails Doctrine](https://rubyonrails.org/doctrine):

> Who cares what format your database primary keys are described by? Does it really matter whether it’s “id”, “postId”, “posts_id”, or “pid”? Is this a decision that’s worthy of recurrent deliberation? No.

Many decisions like this need to happen throughout a project's development and that would benefit from one person or one small team making the decisions regarding framework features.

Convention over configuration (CoC) makes it easier for people new to the framework or tool to start working on a new project with it.

It also makes it easier for experienced users to customize the framework's behavior when it becomes necessary.

However, you should be careful... It's tempting to configure every part of the framework so that users don't have to worry, but most applications worth building have some elements that are unique in some way. It may only be 5% or 1%, but it’s there.

### Omakase: Let someone else make choices

One of the pillars of the Rails Doctrine is that the menu is omakase. DHH, the creator of Rails, explains the reason for this approach:

> How do you know what to order in a restaurant when you don’t know what’s good? Well, if you let the chef choose, you can probably assume a good meal, even before you know what “good” is. That is omakase. A way to eat well that requires you neither be an expert in the cuisine nor blessed with blind luck at picking in the dark.
>
> For programming, the benefits of this practice, letting others assemble your stack, is similar to those we derive from Convention over Configuration, but at a higher level. Where CoC is occupied with how we best use individual frameworks, omakase is concerned with which frameworks, and how they fit together.

Rather than using "the best tool for the job" take a step back and look at a set of tools that work well together. Before we use the best tool, we need to define what best is. Just like the restaurant problem, let the framework developers choose what set of tools works best and use these combined tools.

There are several advantages to taking away individual choices and providing a common set of tools and configurations.

Working from this common set of tools and configurations gives the community a common ground and makes it easier to support and train people to use them.

If we have a common toolbox then we're all working to solve the same problems. Since frameworks like the one discussed here have many moving parts that must work together flawlessly so if one developer has a problem, other developers likely have it too and one fix will solve the problem for everyone.

You can customize the framework. Once you become familiar with the framework and how the components interact with each other you can customize the components or swap them for different components that better suit the needs of your project.
<!--
### Why doesn't this work in Javascript?

 -->

## What would this look like?

Here are some of the basic ideas about the framework. These are preliminary thoughts, not a finished project.

### Templating Engine(s)

One of the first questions I asked myself was whether I wanted to include a single templating engine.

Most of the time I prefer to work with [Nunjucks](https://mozilla.github.io/nunjucks/) but see the need for flexibility. I can see other frameworks being used. A list of possible selections:

* [Handlebars](https://handlebarsjs.com/)
* [Mustache](https://mustache.github.io/)
* [Closure Templates (Soy)](https://github.com/google/closure-templates)
* [DoT](https://olado.github.io/doT/)
* [EJS](https://ejs.co/)

The idea is that we can declare the templating engine when we create the new application using the command line interface, something like

### Custom ORM

This may be the most important part of the framework. I would love to emulate [Active Record](https://guides.rubyonrails.org/v5.0/active_record_basics.html) in a Javascript ORM.

What I like the most is how the two-directional matches between classes and database tables. Some examples from Rail's [Active Record Basics](https://guides.rubyonrails.org/active_record_basics.html):

| Model / Class	| Table / Schema |
| :---: | :---: |
| Article | articles |
| LineItem | line_items |
| Deer | deers |
| Mouse | mice |
| Person | people |

It may require third-party libraries to achieve similar functionality in Javascript but it should be doable.

The ORM should be able to write to different databases.

At the very least, it should be able to create databases and tables in [SQLite](https://www.sqlite.org/), [MariaDB](https://mariadb.org/) and [PostgreSQL](https://www.postgresql.org/).

### Styling: PostCSS versus SCSS/SASS

Styling is a very interesting discussion. Should we use SCSS/SASS or should we use PostCSS and regular CSS? Should we provide the tools to use both individually?

I'm partial to PostCSS since it allows us to use regular CSS and enhance what we already have

Like Babel's preset-env, PostCSS also has a [preset-env](https://www.npmjs.com/package/postcss-preset-env) plugin pack that will allow developers to implement future features based on browser support from [Can I Use](https://caniuse.com/css-all) and MDN's [browser-compat-data](https://github.com/mdn/browser-compat-data).

On the other hand, SCSS provides programming-like tools like `@if and @else`, `@for to` and `@for through` and many others listed in the SASS[at-rules](https://sass-lang.com/documentation/at-rules/) page.

### Custom CLI

To get all these features working, we need a special type of CLI tool.

The idea is to write a separate task for each process that we want to run and then have a "driver" that will load and run the appropriate tool when prompted.

## Final thoughts

For this to work, we need to give up the notion that we each know what's best. We need to trust that the chef knows what to put in the Omakase menu and that, for most general types of applications, the Omakase offering will work.
