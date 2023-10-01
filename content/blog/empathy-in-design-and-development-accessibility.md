---
title: "Empathy in Design and Development: Accessibility"
date: "2017-10-09"
---

Accessibility is like dirty laundry we all know we should worry about it but we never do until we have no choice (and I'm the first one to admit that I suck at being proactive about addressing accessibility issues in my projects).

Let's take this hypothetical example:

Your team close to releasing an application that uses the latest and greatest technologies. It's a progressive web application that uses web components for the front end and Express application to talk to MongoDB and IndexedDB to store data in the user's browser.

The app works wonderfully and your team gets a lot of kudos from users and management.

Then you get a call from a co-worker that tells you the application is not quite working as expected. After you panic and freak out for a few seconds you ask your coworker what is not working as expected.

What he tells you floors you... _the keyboard tab order doesn't work as expected_.

You invite your coworker to your desk and ask him to explain what he means by his comment about tab order. He sits at your computer and starts navigating (or trying to navigate) the app and you realize that it jumps all over the place, not in the order you'd expect it.

The two of you hunker down and figure out that the `tabindex` attribute wasn't used properly. After looking over the code you discovered the following issue

- Developers used it in some elements and not others

Further more when reviewing how to use `tabindex` you discovered that:

- An element with tabindex="0", an invalid value or no tabindex attribute should get focus after elements with positive tabindex values in the sequential keyboard navigation order
- Setting tabindex attribute on a `<div>` element forces us to set tabindex on the div children content, otherwise the content inside the div is ignored when navigating with their keyboard

Your work together in fixing the tabindex issues and pushed the changes. They work and your coworker is happy that the changes work.

The accessibility evaluation firm that you hired to do an audit of your site calls you a few days later and they ask to meet with you and your development team to discuss some of their findings.

The meeting was surprising. They ran pages of your application through a screen reader and your team was amazed at how it sounded. When you look at the report you realize that there are many images with no `alt` attributes and form fields without labels.

They further suggested developers use a screen reader to work over the site. This would help them understand some of the issues facing vision impaired users.

**The actual world**

So how do we address accessibility?

In an ideal world, we would have users with disabilities test your site and give you feedback but the range of accessibility issues is too large to expect every aspect of it to be tested.

We don't realize that the web platform, the technology stack that lives under our frameworks and APIs, does a lot to make the web accessible to people using assistive technologies. When we build our own components or extend the platform it becomes our responsibility to make sure the content remains accessible.

This may cause extra work for you as a developer. For example, you'll have to add accessibility attributes and things that we take for granted when working on the web. Things like keyboard navigation, focus, and the functionality of custom versions of web elements like buttons, checkboxes and other elements.

The W3C Web Accessibility Initiative provides a set of [authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/) that give you an idea of the amount of work that you need to do to make accessible elements. Some times this is by choice but sometimes you don't really have an option and need to build a custom version of an existing element or create something completely new for your application.

If you're using custon elements, the [howto-tabs](https://github.com/GoogleChrome/howto-components/blob/master/elements/howto-tabs/howto-tabs.js) sample element shows how to incorporate labels for customm elements.

If you're working with React you can check [Facebook Accessibility](https://facebook.github.io/react/docs/accessibility.html) will show you the basics and an example of an [accessible accordion](http://merri.github.io/react-tabbordion/) will show you a specific example of how to build accessibility on your React elements and components.

An interesting option is to include tools like [Axe Core](https://github.com/dequelabs/axe-core) command line or [build system plugins](https://github.com/felixzapata/gulp-axe-core) as part of your build process. This will help you identify the issues but it's up to you and your team to fix them. It takes away the excuse that you didn't know how to do it.

[Lighthouse](https://developers.google.com/web/tools/lighthouse/), a tool from Google provides a series of reports that cover performance and accessibility. YOu can run this as [command line utility](https://www.npmjs.com/package/lighthouse), a [Chrome browser extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk?hl=en) or a [build system plugin](https://github.com/GoogleChrome/lighthouse/blob/master/docs/recipes/gulp/gulpfile.js)

Going back to our central premise of walking in our users' shoes let's try using a screen reader for our content. Rob Dodson has created basic tutorials for Voice Over (screen reader built into macOS) and NVDA (a free screen reader for Windows).

<iframe width="560" height="315" src="https://www.youtube.com/embed/5R-6WvAihms?rel=0" frameborder="0" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/Jao3s_CwdRU?rel=0" frameborder="0" allowfullscreen></iframe>

Once we start working with accessibility it's tempting to concentrate in a small area of accessibility and not pay attention to areas that we might not consider accessibility related.

Seren Davies' presentation from Render 2017 covers some of these nonvisual and temporary conditions. This is important because all our users have suffered or will suffer some form of accessibility impairment and we don't always take these issues into consideration.

<iframe width="560" height="315" src="https://www.youtube.com/embed/oG_cYElSZwM?rel=0" frameborder="0" allowfullscreen></iframe>
