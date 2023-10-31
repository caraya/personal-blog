---
title: "Web Components: How to use web components?"
date: "2015-09-30"
categories:
  - "technology"
  - "web-components"
templateEngineOverride: false
---

When I first started working with Web Components I looked at the biggest way to use them. In creating my own components I own all of the component, the scripts, the encapsulated CSS and the responsibility of making sure that they worked and worked well with other components and other elements in the page.

In learning how to use Web Components we'll look at both the big and the small picture: Creating full custom components and createying type extension custom elements.

### Custom Components

The ability to create fully customized and reusable elements is what attracted me to Polymer and the concept of web components. The elements we create can be as simple or as complex as we need them to be.... We can also add other components to enhance the functionality of our components.
The example below (taken from the Polymer Project's home page) shows what a custom element built with Polymer 1.0 looks like.

```markup
<dom-module id="contact-card">
  <link rel="import" type="css" href="contact-card.css">
  <template>
    <content></content>
    <iron-icon icon="star" hidden$="{{!starred}}"></iron-icon>
  </template>
  <script>
  Polymer({
    is: 'contact-card',
    properties: {
      starred: Boolean
    }
 });
 </script>
</dom-module>
```

And how we use the component on our document.

```markup
<contact-card starred>
 <img src="profile.jpg" alt="Eric's photo">
 <span>Eric Bidelman</span>
</contact-card>
```

### Extending existing elements (Type Extension Custom Elements)

There are times when a custom element is too much. We might need a smaller chunk of functionality or we may need to enhance an already-existing element instead of creating a whole new element. You can create a custom element that extends a native HTML element and its features. This is called a Type Extension Custom Element. To use the element, use the original tag and specify the custom tag name using the is attribute.

```markup
<input is="x-component"></div>
```

To define a type extension:

- Create the base prototype object using the prototype of the extended element, instead of HTMLElement.
- Add an extends key in the second argument to document.registerElement(), specifying the tag name of the extended element.

Following is an example code when extending the input element:

```javascript
var XComponent = document.registerElement('x-component', {
 extends: 'input',
 prototype: Object.create(HTMLInputElement.prototype)
});
```

Notice that it extends: 'input' and its prototype is based on HTMLInputElement instead of HTMLElement. Now you can use `&lt;input is="x-component">` inside your document. By doing so, you can have extended APIs on top of basic input element's features.

#### Github's example

\[caption id="attachment\_786599" align="aligncenter" width="272"\][![Github Relative Time on display](/images/2015/06/gh-relative-time.png)](http:/images/2015/06/gh-relative-time.png) Github Relative Time on display\[/caption\]

GitHub has a component that displays date and time as shown above. Notice they are not absolute dates/times but relative to the browser's current time. GitHub uses a Type Extension Custom Element accomplish this. The HTML code looks like this:

\[caption id="attachment\_786598" align="aligncenter" width="747"\][![HTML source for time type extension custom element](/images/2015/06/gh-time-tag.png)](http:/images/2015/06/gh-time-tag.png) HTML source for time type extension custom element\[/caption\]

There some things to notice:

- time tag is used as a base element
- datetime attribute indicates an absolute date/time
- `is='time-ago'` specifies a type extension
- The tag's content indicates a relative date/time
- This is done on the fly as a type extension.

Even if web components are not supported or Javascript is disabled we will still be able to see when the file was last changed. If you disable Javascript from your browser's

For more details about time-elements, check webcomponents.org's [How GitHub is using Web Components in production](http://webcomponents.org/articles/interview-with-joshua-peek/).
