---
title: "Web Components: Where to use web components?"
date: "2015-10-05"
categories: 
  - "technology"
  - "web-components"
---

I'm mostly familiar with using Web Components (specifically Polymer) as the front end for either JSON or Firebase backends. My research has turned to how do we make web components play nice with other frameworks, MVC and otherwise.

Sole Penadés talks about Web Components and also what to expect when using web components with other frameworks :)

<iframe src="https://player.vimeo.com/video/121954532" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen="" allowfullscreen=""></iframe>

We can take two approaches to Web Components: Whole cloth or progressive enhancement.

Whole cloth is building a custom element hierarchy with the associated elements needed to achieve your application goals. It may require multiple elements like the ones below where each element is defined and imported in a separate document with its own CSS and Javascript associated with each element.

```markup
<my-app>
  <my-app-header>
    <iron-icon></iron-icon>
    <my-title></my-title>
    <my-app-menu></my-app-menu>
  </my-app-header>

  <my-app-body>
    <content></content>
  </my-app-body>
</my-app>
```

A progressive enhancement approach is what Github did. Instead of going full bore with defining new components, they enhanced portions of their application application by extending what is already there as we discussed above. Taking the `my-avatar` element we created earlier we'll revisit the code to make it work as a component.

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

And then call it as we normally would:

```markup
<my-avatar username='myname' service='twitter'></my-avatar>
```

A third alternative when using Polymer (and only Polymer) is to use auto binding templates. With these templates we can use Polymer tools outside polymer custom elements. You create the auto-binding template by using a template with the `is=dom-template` attribute.

Once you create the template you can use all Polymer techniques and tricks inside your main document without having to create a custom element for it as show in the example below.

```markup
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="components/webcomponentsjs/webcomponents-lite.js"></script>
  <link rel="import" href="components/polymer/polymer.html">
  <link rel="import" href="components/iron-ajax/iron-ajax.html">

</head>
<body>

  <!-- Wrap elements with auto-binding template to -->
  <!-- allow use of Polymer bindings in main document -->
  <template id="t" is="dom-bind">

    <iron-ajax url="http://..." last-response="{{data}}" auto></iron-ajax>

    <template is="dom-repeat" items="{{data}}">
        <div><span>{{item.first}}</span> <span>{{item.last}}</span></div>
    </template>

  </template>

</body>
<script>
  var t = document.querySelector('#t');

  // The dom-change event signifies when the template has stamped its DOM.
  t.addEventListener('dom-change', function() {
    // auto-binding template is ready.
  });
</script>
</html>
```

### So which one should we use?

As with everything on the web the answer is, **it depends**.

Type extension elements have the draw that, if they don't work (either because Javascript is disabled, polyfills are not available or custom elements are not supported), content will still be displayed to the user.

For larger projects where type extension elements are not enough, full blown custom elemets are necessary with all the additional weight and performance penalties they carry if you're not careful when implementing them.

Paul Lewis' blog post [Polymer for the performance obsessed](https://aerotwist.com/blog/polymer-for-the-performance-obsessed/) outlines some of the requirements to improve a Polymer application's performance. It would be interesting to see how much of the post (given where Paul works) is applicable to vanilla components and x-tag built elements

In the end the type of component you use depends on your project and your needs.
