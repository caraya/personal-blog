---
title: Frameworks, AI, and the modern web developer
date: 2025-03-24
tags:
  - AI
  - Development
  - Web
---

I first started playing with web content in 1994 while in college. Over the years I've see most major changes in web development. From the early days of HTML-only sites, to CGI for server-side processing, to Javascript, Ajax, and many other libraries and frameworks, to AR/VR to now AI.

In this post I will try to address my views on frameworks and their issues, and why I think we should be careful with AI as it is at the time of this writing.

## Prehistory: Before Javascript

The earliest server-side programming was done with Perl using what's called the Commong Gateway Interface or CGI and stored in the server's `cgi-bin` directory.

```perl
#!/usr/local/bin/perl

print "Content-Type: text/html\n\n";
# Note there is a newline between
# this header and Data

# Simple HTML code follows
print "<html> <head>\n";
print "<title>Hello, world!</title>";
print "</head>\n";
print "<body>\n";
print "<h1>Hello, world!</h1>\n";
print "</body> </html>\n";
```

Later, Perl modules like [CGI.pm](https://metacpan.org/pod/CGI) were created to simplify the process of creating CGI scripts in Perl, both form processing and HTML output generation.

The methods in the script below were valid when CGI.pm was first released. They are not supported in newer versions of the module.

```perl
#!/usr/bin/perl -w
# cgi script with CGI.pm.

use CGI;

my $cgi = CGI->new;

print $cgi->header();
print $cgi->start_html(-title => "Hello World!");
print $cgi->h1("Hello World!");
print $cgi->p("This is a simple CGI script.");
print $cgi->end_html();
```

Yes, you could also compile C programs and put them in the `cgi-bin` directory and it would have the same effect but most people went with Perl because it was easier.

## Prehistory: Before frameworks

When Javascript was first introduced in 1995 it was a simple language that was used to add interactivity to web pages. As originally conceived, Javascript was meant as a complement to Java apps running on the browser via the [applets](https://www.oracle.com/java/technologies/applets.html) tag.

One of the first things I remember seeing were interactive rollovers triggered on hover. The rollover effect had two components. The first one was Javascript that would preload the images to avoid delay on first hover and create functions to handle the rollover and rollout events.

```js
// Pre-load the images to avoid delay on first hover
if (document.images) {
  // Declare the image objects
  var button_on = new Image();
  var button_off = new Image();

  // Set the image sources
  // Original button image
  button_off.src = "/api/placeholder/150/40";
  // Highlighted button image
  button_on.src = "/api/placeholder/150/40";
}

// The rollover function
function changeImages() {
  if (document.images) {
    document.images["button1"].src = button_on.src;
  }
}

// The rollout function
function restoreImages() {
  if (document.images) {
    document.images["button1"].src = button_off.src;
  }
}
```

The second component is the (uppercase) HTML that would call the Javascript functions on the mouseover and mouseout events.

```html
<A HREF="javascript:void(0)"
   onMouseOver="changeImages(); return true"
   onMouseOut="restoreImages(); return true">
   <IMG SRC="/api/placeholder/150/40"
     NAME="button1"
    WIDTH="150"
    HEIGHT="40"
    BORDER="0"
    ALT="Home Button">
</A>
```

`<A HREF="javascript:void(0)">`
: This creates a link that doesn't actually navigate anywhere
: In 1996, developers often needed clickable elements but didn't want the page to reload or jump to another location since this would take a full roundtrip to the server and back
: `javascript:void(0)` was the standard way to create a "null" link that executed JavaScript but didn't change the page. It evaluates to undefined and prevents the browser from attempting to load a new page

`onMouseOver="changeImages(); return true"`
: This triggers when the mouse hovers over the link
: `changeImages()` calls our JavaScript function that swaps the image to the "on" state
: `return true` ensures the event completes properly (to avoid browser inconsistencies)

`onMouseOut="restoreImages(); return true"`
: This triggers when the mouse leaves the link
`restoreImages()` calls our function to switch the image back to its original state
: `return true` ensures the event completes properly

The `IMG` tag (yes, it was all caps) inside the link
: `SRC="/api/placeholder/150/40"`. The initial image source that will work if the script cannot run
: `NAME="button1"`. In 1996 JavaScript, browsers will use the  name attribute to identify the image to change (modern JavaScript would use id instead)
: `WIDTH="150" HEIGHT="40"`. You would always specify dimensions as explicit values in their corresponding attributes
: `BORDER="0"`. Removes the blue border that would otherwise appear around images inside links even if the link went nowhere. In modern Web Apps, you would use CSS to remove the border
: `ALT="Home Button"`. Alternative text for accessibility (this was good practice even in 1996)

Going beyond these basic applications of Javascript (that were common to all browsers) was possible but it was a real challenge. The language was not standardized and the browser implementations were inconsistent and incompatible (anyone remember the ***best viewed with*** buttons?).

You would have to write code that would check for the browser and then write different code for each browser. In the example below we create three variables to check wchich browser is being used and then write different code for each one. And this code is future proof: modern browsers will still run the isW3C branch as written.

```js
var isIE = document.all ? true : false;
var isNetscape = document.layers ? true : false;
var isW3C = document.getElementById ? true : false;

if (isIE) {
  document.write("<p>You are using Internet Explorer.</p>");
  // IE-specific code
  document.write("<p>Using document.all for DOM access.</p>");
} else if (isNetscape) {
  document.write("<p>You are using Netscape Navigator.</p>");
  // Netscape-specific code
  document.write("<p>Using document.layers for DOM access.</p>");
} else if (isW3C) {
  document.write("<p>You are using a W3C-compliant browser.</p>");
  // W3C standards-compliant code
  document.write("<p>Using document.getElementById for DOM access.</p>");
} else {
  document.write("<p>Your browser is not recognized.</p>");
}
```

## Early frameworks: jQuery

After the introduction of jQuery in 2006, the need to write different code for different browsers was reduced. jQuery was a library that abstracted the differences between browsers and provided a consistent way to interact with the DOM and handle events.

| Framework/Library | Year Released | Key Features/Significance |
|:---: | :---: | --- |
| [jQuery](https://jquery.com/) | 2006 | One of the earliest and most popular libraries, simplifying DOM manipulation and AJAX calls. |

jQuery addressed browser inconsistencies and unify DOM manipulation across browsers that were not compatible as they are today.

For those who are not aware, browsers had an almost incompatible way of working with Javascript and the DOM. This is the type of issues jQuery addressed.

Rather than writing branching code ourselves, we would use jQuery in two steps: First load the library

```html
<script src="https://code.jquery.com/jquery-1.0.min.js"></script>
```

Then use it to write code like this where jQuery also abstracts browser detection and provides a consistent way to interact with the DOM.

```js
$(document).ready(function () {
  var message = "<p>Your browser is not recognized.</p>";

  if ($.browser.msie) {
    message = "<p>You are using Internet Explorer.</p><p>Using document.all for DOM access.</p>";
  } else if ($.browser.mozilla) {
    message = "<p>You are using Netscape or a Mozilla-based browser.</p><p>Using W3C methods.</p>";
  }

  $("body").append(message);
});
```

We can also use other jQuery functions to simplify the code. For example, the `append` function is a jQuery function that appends the message to the body of the document before an equivalent functionality was introduced to the DOM

## Early Frameworks: Backbone and AngularJS

As the W3C standardized the DOM, Javascript became an international standard through ECMA, and the work of the WASP (web standards project) helped to push the browser vendors to implement the standards, the need for jQuery was reduced but never eliminated (we'll revisit this later).

Then frameworks came into the picture. The first one was the Dojo Toolkit in 205, followed by Backbobe.js, Knockout.js, Sprout Core, AngularJS, Ember.js, React, Meteor, Vue.js, Svelte, Angular, and others.

It is challenging to understand why did these new technologies come into place and why they are important.

The first generation of frameworks worked to establish foundational concepts and best practices for web development. They introduced concepts like MVC (Model-View-Controller), routing, and other concepts essential to Single Page Applications (SPA).

The table below shows a sample of early libraries and frameworks.

| Framework/Library | Year Released | Key Features/Significance |
|:---: | :---: | --- |
| [Dojo Toolkit](https://dojotoolkit.org/) | 2005 | The Dojo Toolkit is an open-source modular JavaScript library (or more specifically JavaScript toolkit) designed to ease the rapid development of cross-platform, JavaScript/Ajax-based applications and web sites. |
| [Backbone.js](https://backbonejs.org/) | 2010 | A lightweight framework that introduced MVC (Model-View-Controller) architecture, influencing later frameworks. |
| [Knockout.js](https://knockoutjs.com/) | 2010 | Knockout is a standalone JavaScript implementation of the Model–View–ViewModel pattern with templates. |
| [Sprout Core](https://sproutcore.com/) | 2010 | SproutCore is an open-source JavaScript web framework. Its goal is to allow developers to create web applications with advanced capabilities and a user experience comparable to that of desktop applications. |
| [AngularJS](https://angularjs.org/) | 2010 | Google's framework focused on building complex web applications with a structured approach. |
| [Ember.js](https://emberjs.com/) | 2011 | Another early framework, known for its conventions and focus on building robust web applications. |
| [Meteor](https://www.meteor.com/) | 2013 | A full-stack JavaScript framework, simplifying application development with real-time data synchronization. |

One end of the first generation of frameworks is Backbone.js. Backbone.js was a lightweight framework that introduced the [MVC (Model-View-Controller) architecture](https://www.freecodecamp.org/news/the-model-view-controller-pattern-mvc-architecture-and-frameworks-explained/) to Javascript. It was a simple framework that provided a way to structure code and separate concerns.

The other end is AngularJS. AngularJS is a complete framework that provided a way to build complex web applications with a structured approach. Through directives, AngularJS also introduced a way to extend HTML with custom elements and attributes.

The earlier frameworks opened conversations about technologies and best practices.

## Modern Frameworks: React and Vue

As the W3C standardized the DOM, Javascript became an international standard through ECMA, and the work of  WASP ([the Web Standards Project](https://www.webstandards.org/)) helped to push the browser vendors to implement the standards, the need for jQuery was reduced but never eliminated (we'll revisit this later). These new frameowkrs were built to work with the new standards and mostly ignored browser-specific code.

| Framework/Library | Year Released | Key Features/Significance |
|:---: | :---: | --- |
| [React](https://react.dev/) | 2013 | Facebook's library, focused on building user interfaces with a component-based approach and virtual DOM. |
| [Vue.js](https://vuejs.org/) | 2014 | A progressive framework, praised for its simplicity, ease of learning, and flexibility. |
| [Svelte](https://svelte.dev/) | 2016 | A compiler-based framework that compiles components to native JavaScript, resulting in faster performance. |
| [Angular](https://angular.dev/) | 2016 | A complete rewrite of AngularJS, focusing on performance, modularity, and mobile development. It was not backwards compatible and provided no migration path from AngularJS. |
| [Aurelia](https://aurelia.io/) | 2015 | A framework aiming for a next-generation UI framework with advanced features and developer-friendly design. |
| [Preact](https://preactjs.com/) | 2015 | A lightweight alternative to React, offering similar functionality with a smaller footprint. |

The second generation of frameworks introduced new concepts and approaches to web development.

React introduced a component-based approach and a virtual DOM. It has also become the go-to framework in the industry for building user interfaces and has been adopted by large companies and open source projects like WordPress as their front-end framework for the block editor.

Vue.js introduced a progressive framework that was praised for its simplicity, ease of learning, and flexibility. You can run Vue applications without a build step, but you can also use it with a build step to add more features and optimizations.

Angular (version 2 and later) provide an incompatible rewrite of AngularJS. This incompatibility was a major issue for developers who had invested time and resources in AngularJS applications. I believe this is the reason why the Angular team is so focused on providing automated migrations between versions and for migrating or introducing new features.

Most, if not all, these frameworks are `all-in-one` solutions that provide everything you need to build a web application. They've also built large ecosystems of third-party libraries to augment their functionality.

New tools were introduced along with these new frameworks to help with the development process. This has caused its own set of issues.

## The issues I see

There are two sets of issues I see with the current state of web development:

* Training and documentation
* Added complexity. Are they necessary all the time?
* Vendor tie-in

These frameworks add complexity where it may not be needed.

The documentation for the frameworks makes a lot of assumptions about the reader's knowledge. This is a problem for new developers who are trying to learn web development. The documentation is written for experienced developers who are already familiar with the concepts and technologies.

How many beginning web developers will learn the basics before jumping into a framework like React or Angular? How many will understand the concepts of the framework before using it?

For example, all components in React are built in classes. How many new developers will research and understand classes before using them?

I hear a lot about not needing to learn CSS and HTML because we can do it in Javascript. While this is true and we can do pretty much every HTML and CSS generation with Javascript, how many new developers will understand the concepts of CSS and HTML before using Javascript to generate them?

The final point is trickier. When you adopt a framework, you are tying yourself to that framework and vendor. If the vendor decides to make incompatible changes then you're stuck with the choice of staying with the old version and keeping the feature or rewriting the code for the new version.

This is what happened with the migration between AngularJS and Angular 2 and is similar to what happens when software deprecates and removes features.

These framework features make the learning curve higher than it needs to be and it encourages people to skip the basics just to get to the flashy stuff that frameworks provide. This is not strictly a problem with the frameworks but with the way they are used and how beginners see frameworks as they gateway to lucrative jobs and projects.

## Adding AI to the mix

AI has become the latest buzzword in development. When it comes to web development, it has made it possible to automate code creation and testing. It doesn't solve the issues I mentioned above but, in my opinion, the issues with AI add even more complexity to the mix.

Unless you build your own RAG agent trained on your codebase, there is no way to ensure consistency in the generated code. This is not a trivial undertaking and it may be beyond most people's skills... a good example of how you might do this with OpenAI is [Customize ChatGPT for Your Codebase: OpenAI](https://dev.to/mrrishimeena/customize-chatgpt-for-your-codebase-openai-14n6), just be aware that even paid ChatGPT accounts limit the number of tokens that you can generate and it can get expensive to go past those limits.

The AI-generated code is not always the best code and it's not guaranteed to work. Again, you should be proficient with the language you're working with to tell if the code is good and how to debug it when it doesn't work.

Even when trained with your codebase, most of the AI frameworks I'm aware of produce non-deterministic code. The code will not always be the same even with the same prompt... you should store the code in your repository and possibly keep multiple copies until you decide which one works best.

Do new programmers truly understand the code they're working with? If all programmers need is a prompt for the AI agent to spit out code, then why should they bother learning the language they're working with?

## Conclusions

I' not saying we shouldn't use frameworks or AI.

I'm saying we shouldn't completely rely on AI to do our work for us. We should understand the basics of the language we're working with and the concepts of the frameworks we're using.

We should also be aware of the limitations of the AI we're using and how to compensate for them.

## Links and resources

* [Perl and CGI](https://www.perl.com/article/perl-and-cgi/)
* [The Fool's Guide to CGI.pm, the Perl module for CGI scripting](https://jkorpela.fi/perl/cgi.html)
* [The Super-Brief History of JavaScript Frameworks For Those Somewhat Interested](https://dev.to/_adam_barker/the-super-brief-history-of-javascript-frameworks-for-those-somewhat-interested-3m82)
* [A Brief History of JavaScript Frameworks](https://primalskill.blog/a-brief-history-of-javascript-frameworks)
* [You might not need jQuery](https://youmightnotneedjquery.com/)
* [JavaScript’s History and How it Led To ReactJS](https://thenewstack.io/javascripts-history-and-how-it-led-to-reactjs/)
* [Will we care about frameworks in the future?](https://paul.kinlan.me/will-we-care-about-frameworks-in-the-future/)
* [Transforming Software Development: The Role of AI and Developer Tools](https://www.wearedevelopers.com/en/magazine/527/transforming-software-development-the-role-of-ai-and-developer-tools)
* [Customize ChatGPT for Your Codebase: OpenAI](https://dev.to/mrrishimeena/customize-chatgpt-for-your-codebase-openai-14n6)
* [Output from AI LLMs is Non-Deterministic. What that means and why you should care.](https://www.sitation.com/non-determinism-in-ai-llm-output/)
* [Managing the non-deterministic nature of generative AI](https://parivedasolutions.com/perspectives/managing-the-non-deterministic-nature-of-generative-ai/)
* [LLM Text Generation: Why is Determinism so Hard to Achieve?](https://www.linkedin.com/pulse/llm-text-generation-why-determinism-so-hard-achieve-max-bohun-b7ozf/)
