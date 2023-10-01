---
title: "Web Components: How to build web components?"
date: "2015-09-28"
categories: 
  - "technology"
  - "web-components"
---

To illustrate how to create web components we'll use the same element for all three methods. The end result will look like the example below:

```markup
  <my-avatar service="twitter" username="caraya"></my-avatar>
```

We'll look at the differences between a script based approach used in x-tags and a declarative take using Polymer.

### Using vanilla Javascript

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

or with tags and scripts:

```markup
<template id="myAvatar">
    <img src=" ">
</template>
<script>
function addAvatar(service, username) {
  var t = document.querySelector("#myAvatar");
  // This will stamp out the element into our DOM
  var comment = t.content.cloneNode(true);
  // Build the URL
  var serviceURL = '"http://avatar.io/" + service + "/" + username'
  // Populate content.
  comment.querySelector('img').src = serviceUrl;
  comment.querySelector('.comment-text').textContent = text;
  document.body.appendChild(comment);
}
</script>
```

### X-Tags

X-tags implementation of Web Components lacks the capability to import elements; their justification is that they are waiting to see if Javascript modules will work to avoid standards and technologies that duplicate each other.

```javascript
//<script type='text/javascript' src='scripts/x-tag-core.min.js'></script>    
//<script type='text/javascript'>
xtag.register('my-avatar', {
  // The 'content' property generates templated content
  // and automatically adds it to each new element you create
  content: '<div class="avatar"></div><img class="avatar" />',
    lifecycle: {
      created: function() { 
        this.xtag.img = this.lastElementChild;
        // In the next release we're adding default attribute values
        // so you won't have to do these if () checks
        if (!this.service) this.service = 'twitter';
        if (!this.username) this.username = 'name';
      }
  },
  accessors: {
    service: {
      attribute: {},
      set: function(val){
        this.xtag.img.src = 'http://avatars.io/' + val + '/' + this.username;
      }
    },
    username: {
      attribute: {},
      set: function(val){
        this.xtag.img.src = 'http://avatars.io/' + this.service + '/' + val;
      }
    }
  }
});
```

### Polymer

Polymer has gotten more complicated since I last played with it in the 0.5 but it's still fairly easy to implement and modify. We'll explore some of the changes from 0.5 to 1.0 and some of the syntactic sugar that makes working with web components fun.

The example below is the Polymer version of our my-avatar tag.

```markup
<dom-module id="my-avatar">
  <style>
    .avatar {
      border: 0;
    }
  </style>
  <template>
    <img class='avatar' src='http://avatars.io/{{service}}/{{username}}'>
  </template>
</dom-module>
<script>
  'use strict';
  Polymer({
    is: 'my-avatar',
    properties: {
      service: {
        type: String,
        value: '',
        notify: true
      },
      value: {
        type: String,
        value: '',
        notify: true
      }
    }
  });
</script>
```

There is a very interesting presentation from ForwardsJS 3 that covers why you should be using web components now.

<iframe width="560" height="315" src="https://www.youtube.com/embed/AvgS938i34s" frameborder="0" allowfullscreen></iframe>
