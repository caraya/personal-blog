---
title: "Case Study: Building a Polymer application"
date: "2016-06-01"
categories: 
  - "ebook-publishing"
---

One of the first applications I created with Polymer 0.5 was a project viewer that would list all project ideas I was working on. It had 2 versions with different backends: a JSON file and a Firebase enabled one. At some point the Firebase version stopped working so I decided to revisit the JSON backend to update; it was also time to put all the lessons I’ve learned about Polymer 1.x to work.

The application is built around 3 components:

- **project-app** is the shell for the application containing layout elements. This could have been done as an autobinding template in index.html but I’ve always liked to keep them separate
- **project-menu** holds icons and links to auxiliary information
- **project-list** contains the bulk of our content. This is where we load out JSON data using **iron-ajax** and display it inside **paper-card** elements. When we build an API for our projects or decide to move the backend to a nosql database we can move the AJAX call from a local file to hit the API or the datbase as needed.

There is no CRUD for the project. That could be an interesting next step but right now I need a way to display the ideas so I’ll lave it as is for now. May revisit the idea when moving the backend to Firebase.

## index.html

The index file is simple. It just contains the `project-app` element.

```markup
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Polymer experiment for displaying list of projects from JSON file">
  <meta name="author" content="Carlos Araya">
  <title>Carlos Araya Portfolio and Project List</title>
  <script src="bower_components/webcomponentsjs/webcomponents.js"></script>
  <link rel="import" href="project-app.html">
</head>
<body>
  <project-app></project-app>
</body>
</html>
```

The first case is as simple as we can make it. The HTML file contains a script tag to add `&nbsp;webcomponents.js` and the element we want to add to the page.

We could add the logic of `project-app` directly to this file using [auto binding templates](https://www.polymer-project.org/1.0/docs/devguide/templates#dom-bind). It would then look like this:

```markup
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="">
  <meta name="author" content="Carlos Araya">
  <title>Carlos Araya Portfolio and Project List</title>
  <script src="bower_components/webcomponentsjs/webcomponents.js"></script>

  <link rel="import" href="elements.html">
</head>
<body>
<template id="t" is="dom-bind">
  <style>
    :host {
      margin: 0;
      font-family: 'Roboto', 'Noto', sans-serif;
      background-color: #eee;
    }

    app-header {
      color: #fff;
      background-color: #3f51b5;
    }

    app-drawer {
      --app-drawer-width: 300px;
    }
  </style>

  <app-drawer-layout>
    <app-drawer>
      <project-menu></project-menu>
    </app-drawer>
    <app-header-layout>
      <app-header>
        <app-toolbar>
          <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
          <div title>Project List</div>
        </app-toolbar>
      </app-header>


      <project-list></project-list>

    </app-header-layout>
  </app-drawer-layout>

</template>

</body>
</html>
```

This version builds onto the original by adding an HTML Import link for `elements.html` which in turns contains imports for all the elements in the application I’ll explain why I did it this way when I discuss build processes.

Next we copy the template from element from `project-app` and add it to the index page. We add the `is="dom-bind"` attribute to tell Polymer to stap the content of the template right away.

Which version of index.html you use depends on your requirements. If you require portability or think you may want to use the element in a different project then having a separate `project-app` element is the way to go as you’ll be able to drop it right into the next app.

If this is a single use element then the auto binding template on the second example works better. The content of the template is automatically stamped into the host document and you don’t need to have an extra element to do so. Just remember that Polymer elements already do everything you can do in an autobinding template so that shouldn’t be the deciding factor.

I will work with a separate project-app element which I’ll refer to in the next section.

## project-app

Project-app is the standalone container for the application: it uses [app-layout](https://elements.polymer-project.org/elements/app-layout) element and its components to wrap our project specific items: `project-menu` for the sidebar and `projec-list` for our primary content.

```markup
<link rel="import" href="elements.html">
<dom-module id="project-app"> 
  <template>
```

Any styles we put inside the template will be local to that element. Polymer uses a shim to handle custom properties (a.k.a: CSS variables) and we use them to handle the width of the drawer.

```markup
    <style>
      body {
        margin: 0;
        font-family: 'Roboto', 'Noto', sans-serif;
        background-color: #eee;
      }

      app-header {
        color: #fff;
        background-color: #3f51b5;
      }

      app-drawer {
        --app-drawer-width: 300px;
      }
    </style>
```

We use the elements from `app-layout` to build the structure of the application. [app-drawer-layout](https://elements.polymer-project.org/elements/app-layout?active=app-drawer-layout) is the outermost container for the application shell; it holds the `project-menu` element that will hold the menu items.

[app-header-layout](https://elements.polymer-project.org/elements/app-layout?active=app-header) is the body of the application. The one item that needs explanation is the [paper-icon-button](https://elements.polymer-project.org/elements/paper-icon-button) element, more specifically the `drawer-toggle` attribute. This attribute will do magic behind the scenes and hide the menu until a media query is triggered, it will then hide the left drawer panel and show the menu icon. When you click on the menu the drawer will appear; you can dismiss it by clicking elsewhere eon the screen.

This element will also contain `project-list`.

```markup
    <app-drawer-layout>
      <app-drawer>
        <project-menu></project-menu>
      </app-drawer>
      <app-header-layout>
        <app-header>
          <app-toolbar>
            <paper-icon-button icon="menu" drawer-toggle></paper-icon-button>
            <div title>Project List</div>
          </app-toolbar>
        </app-header>


        <project-list></project-list>

      </app-header-layout>
    </app-drawer-layout>

  </template>
```

The final stage is make this into a Polymer element with the script holding a Polymer object that defines it as a project-app element.

```markup
      <script>
        Polymer({
          is: "project-app"
        });
      </script>

    </dom-module>
```

If we’re working on progressive web applications we may want to trim the contents of `elements.html` to just hold the minimal content to stamp out project-app and then cache index.html, elements.html and project-app on Service Worker install.
