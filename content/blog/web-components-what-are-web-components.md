---
title: "Web Components: What are web components?"
date: "2015-09-16"
categories: 
  - "technology"
  - "web-components"
---

Web Components are a set of technologies that allow developers to create custom tags for their web projects. The technologies that make up web components are:

- [Custom Elements](http://w3c.github.io/webcomponents/spec/custom/) allows you to create custom tags for your project-specific needs. These can be brand new tags like book-index or extensions of existing elements with added UI or functionality (super-button or footnote-link)
- [HTML Templates](http://www.w3.org/TR/html5/scripting-1.html#the-template-element) defines a template for your new element. These templates are inert until you instantiate your elements in your page
- [Shadow DOM](http://www.w3.org/TR/shadow-dom/) encapsulates CSS to your custom element. This makes the styles in your components independent of your main document. It has proved to be one of the most problematic aspects of web components but I still think that it's the most useful... if it wasn't then browser vendors wouldn't use it in sliders and video elements
- [HTML Imports](http://www.w3.org/TR/2014/WD-html-imports-20140311/) extends the link element that we use to import CSS style sheets to import web components stored in an HTML element using a similar syntax like so: `<link rel="import" href="/path/to/some/import.html"/>`

By themselves each standard under the umbrella of web components is awesome but it's the combination of these technologies that has really deep implications for web developers everywhere.

The first way to build web components is to use the bare specifications: custom elements, templates, HTML imports and shadow DOM. This is the most direct yet most complex way to build components. Both X-Tags and Polymer abstract the complexities from the specifications as we'll see below. For more information on web components check the [Introduction to Web Components](http://www.w3.org/TR/2013/WD-components-intro-20130606/) from the S3C

X-Tags provides a partial implementation of web components. Mozilla believes that ES6 modules will be a better solution than HTML imports for the same task. See [https://developer.mozilla.org/en-US/Apps/Tools\_and\_frameworks/Web\_components](https://developer.mozilla.org/en-US/Apps/Tools_and_frameworks/Web_components) for more information on X-Tags (the library) and Bricks (the components built with X-Tags)

Polymer provides the basics of web components and opinionated sugar on top of web components to make building applications easier.

**_One thing to note is that, if you've worked with Polymer before 1.0, Polymer has changed considerably from prior versions. See [the 1.0 release blog post](https://blog.polymer-project.org/announcements/2015/05/29/one-dot-oh/) for more information about changes and how to get started and [Road to Polymer](http://chuckh.github.io/road-to-polymer/) for ideas and processes on upgrading existing Polymer apps._**
