---
title: "Web Components: Why use web components?"
date: "2015-09-21"
categories:
  - "technology"
  - "web-components"
templateEngineOverride: false
---

I can think of a few reasons why we should build and use web components.

### Clean and DRY Code

If you look at the source code of any large web application you'll see that it's a mess of divs and enough tags to make it really hard to follow.

Gmail looks bad in the sense that the source is almost impossible to follow and understand, the class names only make sense to the people developing the application and, most likely, no one else.

\[caption id="attachment\_786601" align="aligncenter" width="800"\][![Screenshot of browser showing source code for Gmail](https://publishing-project.rivendellweb.net/wp-content/uploads/2015/06/gmail-source.png)](http:https://publishing-project.rivendellweb.net/wp-content/uploads/2015/06/gmail-source.png) Source code for Gmail\[/caption\]

So does Facebook

\[caption id="attachment\_786600" align="aligncenter" width="800"\][![Screenshot of browser view source showing Source code for Facebook](https://publishing-project.rivendellweb.net/wp-content/uploads/2015/06/facebook-source.png)](http:https://publishing-project.rivendellweb.net/wp-content/uploads/2015/06/facebook-source.png) Screenshot of browser view source showing Source code for Facebook\[/caption\]

What if we could change all the ‘div soup’ into something that makes more sense and it's eaier to read?

Using Polymer we can define a fictional company-module tag with the following information and using an existing iron-icon component (downloadable from the Polymer site):

```markup
<dom-module id="company-info">
  <link rel="import" type="css" href="company-info.css">
  <template>
    <content></content>
    <iron-icon icon="star" hidden$="{{!starred}}"></iron-icon>
  </template>
  <script>
    Polymer({
      is: 'company-info',
      properties: {
        starred: Boolean
      }
    });
  </script>
</dom-module>
```

And then instantiate the element for company MYX like so:

```markup
<company-info starred>
  <img src="company-logo.jpg" alt="company logo for MYX">
  <span>MYX Corporation</span>
</company-info>
```

Using vanilla web components, we can define a `my-avatar` tag that looks like this:

```markup
<my-avatar service="twitter" username="caraya"></my-avatar>
```

We can then use Javascript to define the attributes necessary for the custom element to work. The code looks like this.

```javascript
var MyAvatarPrototype = Object.create(HTMLElement.prototype);
MyAvatarPrototype.createdCallback = function() {
  var username = this.getAttribute('username');
  var service = this.getAttribute('service');
  var url = 'http://avatars.io/' + service + '/' + username;
  var img = document.createElement( 'img' );
  img.setAttribute('src', url);
  this.appendChild(img);
};
document.registerElement('my-avatar', {
  prototype: MyAvatarPrototype
});
```

It is clear to read, you can immediately see what each portion is supposed to do and how they all fit together. As a content creator you don't need to worry about the backend stuff, that's still transparent to you.

### Interoperability

Another thing to consider is interoperability. Right now all major CSS frameworks have their own implementations for things such as button and if you want to use Bootstrap's button in a Foundation app, it's just not worth it, you have to add Bootstrap's bloat to foundation's bloat without knowing how will the CSS and Javascript from each framework interact with other scripts and style sheets.

Web components cut the likelihood of interoperability issues.

Because Shadow DOM hides the CSS on your component from the host page, we don't need to worry about the component styles affecting the page and vice versa. There are ways to pierce the boundary between host and components but that will most definitely change before Shadow DOM becomes a recommendation.

Vanilla JS components, X-Tags / Bricks and Polymer web components

### Composability

Since we can put components from multiple sources or multiple components from a single source, we can compose an application from smaller single-purpose components and compose a more complex application from them.

Because components are composable and Google provides a large [catalog](https://elements.polymer-project.org/) of components for people to build our applications with, we can concentrate on our own application specific or task specific components and build larger applications without having to reinvent the wheel every time (also known as keeping our code DRY)
