---
title: "Case Study: Building Polymer Applications, Part 2"
date: "2016-06-06"
categories: 
  - "technology"
---

## project-menu

`project-menu` is a presentational element that only contains icons, links and linkable icon elements. It’s a good example of how we can compose custom elements with regular HTML content.

As will all out elements we import `elements.html` to make sure we have everything we need to get started. We then define our dom-module to be project menu by assigning its ID.

```markup
<link rel="import" href="elements.html">

<dom-module id="project-menu">
  <template>
```

Inside the template we define the styles for our elements.

```markup
    <style>
      body {
        margin: 0;
        font-family: 'Roboto', 'Noto', sans-serif;
        background-color: #eee;
      }

      :host {
        display: block;
        --iron-icon-width: 48px;
        --iron-icon-height: 48px;
      }

      paper-item {
        --paper-item: {
          cursor: pointer;
        };
      }

      .menu-container {
        margin-left: 1em;
      }
      paper-item {
        display: block;
        padding-left: 1em;
        margin-bottom: 2vh;
      }

      paper-item a {
        text-decoration: none;
      }



    </style>
    <div class="menu-container">

      <h4>Resume</h4>
        <paper-menu>

          <paper-item>
            <a href="https://www.dropbox.com/s/1vznecsjyu2tw18/carlos_araya_one_page.pdf?dl=0">
              <iron-icon icon="link"></iron-icon>
              Resume
            </a>
          </paper-item>

        </paper-menu>

      <h4>Work Related Social Media</h4>
        <paper-menu>
```

Each `paper-item` element has four components:

- the `paper-item` element itself tells Polymer what type of custom element this is
- a link to the correct site
- an `iron-icon` element with either a built-in icon or an SVG icon located on the image folder
- the text of the link

There may be better ways to compose this type of elements but I'm comfortable with this one.

```markup
          <paper-item>
            <a href="https://publishing-project.rivendellweb.net/">
              <iron-icon icon="link"></iron-icon>
              Publishing Project
            </a>
          </paper-item>


          <paper-item>
            <a href="https://plus.google.com">
              <iron-icon src="images/Google_plus.svg"></iron-icon>
              Google Plus
            </a>
          </paper-item>

          <paper-item>
            <a href="https://www.linkedin.com/in/carlosaraya">
              <iron-icon src="images/linkedin.svg"></iron-icon>
              LinkedIn
            </a>
          </paper-item>

          <paper-item>
            <a href="https://codepen.io/caraya/">
              <iron-icon src="images/codepen-logo.svg"></iron-icon>
              Code Pen
            </a>
          </paper-item>

          <paper-item>
            <a href="https://twitter.com/elrond25">
              <iron-icon src="images/Twitter-Logo.svg"></iron-icon>
              Twitter
            </a>
          </paper-item>

          <paper-item>
            <a href="https://github.com/caraya">
              <iron-icon src="images/Octicons-mark-github.svg"></iron-icon>
              Github
            </a>
          </paper-item>
        </paper-menu>

     </div>
  </template>
```

We then instantiate the element.

```markup
  <script>
    Polymer({

      is: 'project-menu',

    });
  </script>
</dom-module>
```

This is about as simple as a menu can get. We don't use animations and we don't have sub menus to animate. Yet it gives a good initial idea of how to build a menu and provides a good starting points for enhancements.
