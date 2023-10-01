---
title: "Case Study: Building Polymer Applications, Part 3"
date: "2016-06-08"
categories: 
  - "technology"
---

## project-list

The `project-list` element is the meat of the application and uses some interesting techniques I've learned from working on creating Polymer elements. This is an example of the JSON model used on their element. It has been redacted for length.

```javascript
{
  "description": "The VR/AR web seems to be the latest buzz word in the web community.",
  "name": "Moving 2D content to a 3D world",
  "notes": "",
  "stage": "Idea",
  "type": "Code",
  "url": {
    "code": "",
    "other": "",
    "writeup": ""
  }
}
```

Knowing the structure of the JSON data will help make sense of the data bindings I used below:

```markup
<dom-module id="project-list">
  <template>
```

In the `elements.html` file we include `iron-flex-layout` which gives us access to CSS mixins we can incorporate into our style sheets to create flex layouts.

The three @apply rules below are equivalent to manually creating a row wrap flex layout with space between items.

We do the same thing to layout the links in card-actions.

```css
    <style is="custom-style">
      body {
        margin: 0;
      }

      :host {
        --paper-card-header: {
          background-color: #3f51b5;
          color: white;
          text-align: center;
        };
      }

      .cards-container {
        width: 98%;
        /* Mixins equivalent to flex: row wrap */
        @apply(--layout-horizontal);
        @apply(--layout-wrap);
        /* Space between items */
        @apply(--layout-justified);

      }

      .card-content {
        color: #333;
        background-color: white;
        text-align: left;
      }

      .card-actions {
        /* Mixins equivalent to flex: row wrap */
        @apply(--layout-horizontal);
        @apply(--layout-wrap);
        /* Space between items */
        @apply(--layout-justified);
      }
```

Most paper elements have mixins defined. In this instance we use the default values for the mixins changing the header, the header text and the header color.

```css
      paper-card {
        margin-bottom: 3em;
        height: 25%;
        width: 47.5%;

        @apply(--paper-card-header);
        @apply(--paper-card-header-text);
        @apply(--paper-card-header-color);

      }
```

As an added visual cue, I’ve removed the link underline by default and bring it back when the user hovers I believe that this combined with the different link color is enough to tell users this is a link.

```css
      a {
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
```

We use media queries to change the layout when the total width of the screen is smaller than 900 pixels (including the 300 pixels for the menu.) we turn the layout to vertical and we make the paper card elements 100% of the width of the containing element

```css
      @media screen and (max-width: 900px){
        .cards-container {
          @apply(--layout-vertical);
        }

        paper-card {
          width: 100%;
        }
      }


    </style>
```

We use [iron-ajax](https://elements.polymer-project.org/elements/iron-ajax) to load the project data from the JSON file.

The `auto` parameter will make the request fire automatically.

`handle-as` tells Polymer what type of response to expect.

`last-response` gives us the content of the response. We do an [automatic data binding](https://www.polymer-project.org/1.0/docs/devguide/data-binding) with the content so we can use it later in the element.

```markup
    <iron-ajax auto
               url="projects.json"
               handle-as="json"
               last-response="{{projects}}"></iron-ajax>
```

I use a repeating template (`template is="dom-repeat`) to create one instance of the template for each element in the source (in this case our JSON array.) We use one way bindings on this portion of the element. Since we’re only interested in displaying the data and not change it we’re ok with just letting the data from from the parent (iron-ajax) down into the template.

I’ve also aliased the projects array to project. This makes it easier to read and reason through the code for myself-6-months-from-now and for other people interested in reading the code.

```markup
    <div class="cards-container">
      <template is="dom-repeat" items="{{projects}}" as="project">
          <paper-card heading>
              <h1>[[project.name]]</h1>
            <div class="card-content">
              <h3><strong>Project Stage: [[project.stage]]</strong></h3>
```

Description and project notes are written in [Markdown](https://daringfireball.net/projects/markdown/). To acommodate this (I’m lazy and Markdown is much easier to write than HTML) I’ve included the [marked-element](https://elements.polymer-project.org/elements/marked-element) which is a Polymer wrapper around the [Marked](https://github.com/chjj/marked) Markdown library.

```markup
              <h3>Description:</h3>

              <marked-element markdown="[[project.description]]">
                <div class="markdown-html"></div>
              </marked-element>

              <h3>Project Notes</h3>

              <marked-element markdown="[[project.notes]]">
                <div class="markdown-html"></div>
              </marked-element>
```

The links in the Links section use a different type of template to only stamp if the element is present. The [dom-if templates](https://www.polymer-project.org/1.0/docs/api/dom-if) take a single parameter (`if`) with the condition to test. If the condition is truthy (something that evaluates to true) then the content of the template is stamped, otherwisse it’s skiped.

Because not all links have content and I don’t want to not use them, I wrap them around dom-if templates. If they have content they will return true and the link inside will show up on the resulting card. If not it will be left blank.

```markup
              <h3>Links</h3>
              <div class="card-actions">
                <template is="dom-if" if="{{project.url.code}}">
                  <paper-button><a href="[[project.url.code]]">Code</a></paper-button>
                </template>
                <template is="dom-if" if="{{project.url.writeup}}">
                  <paper-button><a href="[[project.url.writeup]]">Writeup</a></paper-button>
                </template>
                <template is="dom-if" if="{{project.url.other}}">
                  <paper-button><a href="[[project.url.other]]">Other</a></paper-button>
                </template>
              </div>
            </div>
          </paper-card>
      </template>
    </div>

  </template>

  <script>
    Polymer({

      is: 'project-list'
    });
  </script>
</dom-module>
```

## Next steps

Some of the things I’d like to do:

- Research why iPad portrait use displays weird. It may have to do with media queries. The way I calculate the width to change the display may be done incorrectly
- Move the backend to [Firebase](https://firebase.google.com) using the [Polymerfire collection](https://github.com/firebase/polymerfire/).
- Oncce the backend is moved to Firebase, wire CRUD functionality
