---
title: Revisiting Material Design For The Web
data: 2024-07-24
tags:
  - Web Components
  - Web Design
  - Material Design
---

Material Design 3 is a very good design library coming from Google and it's the latest version of their [Material Design](https://m3.material.io/) design language.

There are versions of Material for all the languages and libraries Google makes available:

* [Web](https://m3.material.io/develop/web)
* [Flutter](https://m3.material.io/develop/android/jetpack-compose)
* Android
  * [MDC Android](https://m3.material.io/develop/android/mdc-android)
  * [Jetpack Compose](https://m3.material.io/develop/android/jetpack-compose)
* [Angular](https://material.angular.io/)

This post will concentrate on Material Design Web and try to do the following:

* Explain what is Material Design
* Explain how to build a design/layout with Material Design Web
* Decide if the library is still worth using since it went into [maintenance mode](https://github.com/material-components/material-web/discussions/5642#discussion-6805266) due to Google reassigning the engineering team working on Material Web to work on implementing Material for Wiz (before the merge with Angular)

## Getting Started

The Material Design Web [Quick Start](https://github.com/material-components/material-web/blob/main/docs/quick-start.md) provides a good way to look at Material Design for evaluation.

### The Kitchen Sink Approach

The easiest way to build material design is to use the `all.js` import, what I call the kitchen sink. The `all.js` import will import all available Material Design components, making them available for you to play with.

The first step is to load Roboto from Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
```

Then we create an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), a JSON object object that allows developers to control how the browser resolves module specifiers when importing JavaScript modules. It maps the text used as the module specifier in an import statement or import() operator and the corresponding value that will replace the text when resolving the specifier.

For more information about import maps, check the [Importing Modules Using Import Maps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#importing_modules_using_import_maps) section of the [Javascript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) page in MDN.

```js
<script type="importmap">
  {
    "imports": {
      "@material/web/": "https://esm.run/@material/web/"
    }
  }
</script>
```

The next block is a module script, (`script` tag with `type=module`). In it, we can use `import` statements to load all the material design modules that we need.

The import statements use the local reference (`@material/web`) instead of the full remote URL.

In theory, this should also work with references to the node_modules directory so we could work offline during development but I haven't quite figured out how to do it.

```js
  <script type="module">
    import '@material/web/all.js';
    import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  </script>
```

We then use the classes and elements we imported to build the content of the page.

You can use whatever is available on the [documentation website](https://material-web.dev/) to build your site.

```html
<h1 class="md-typescale-display-medium">Hello Material!</h1>
  <form>
    <p class="md-typescale-body-medium">Check out these controls in a form!</p>
    <md-checkbox></md-checkbox>
    <div>
      <md-radio name="group"></md-radio>
      <md-radio name="group"></md-radio>
      <md-radio name="group"></md-radio>
    </div>
    <md-outlined-text-field label="Favorite color" value="Purple"></md-outlined-text-field>
    <md-outlined-button type="reset">Reset</md-outlined-button>
  </form>
  <style>
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  </style>
```

Note that this is not meant for production since it will invariably load code that your project won't use. For production code, you should import individual components and use a build system to bundle them together for wide browser support.

### Loading Individual Components

Rather than use the kitchen sink approach, we'll look at a granular approach towards importing components to build the project.

We first install the packages from Material Web Components by installing the full `@material/web` package.

```bash
npm install @material/web
```

Next, we create an `index.js` file to hold the imports for the project. This will not be referenced in the HTML; we'll use it to build the bundle that we link to in the HTML.

After importing the typography component, we use [adoptedStyleSheets](https://developer.mozilla.org/en-US/docs/Web/API/Document/adoptedStyleSheets) to append the stylesheet to the existing style sheets array.

```js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';

import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

Either in the `head` or the `body` of the page, we reference `bundle.js` in a `script` tag. We'll look at how to generate the bundle later in the post.

Use the &lt;component-name> tag in HTML markup. Remember that whenever you add a component, you have to add the corresponding import declaration to the `index.js` file.

```html
<script type="module" src="./bundle.js"></script>

<h1 class="md-typescale-display-medium">Hello Material!</h1>

<label>
  Material 3
  <md-checkbox checked></md-checkbox>
</label>

<div>
  <md-outlined-button>Back</md-outlined-button>
  <md-filled-button>Next</md-filled-button>
</div>

<div>
  <md-list style="max-width: 300px;">
    <md-list-item>
      Fruits
    </md-list-item>
    <md-divider></md-divider>
    <md-list-item>
      Apple
  </md-list-item>
    <md-list-item>
      Banana
    </md-list-item>
    <md-list-item>
      <div slot="headline">Cucumber</div>
      <div slot="supporting-text">Cucumbers are long green fruits that are just as long as this multi-line description</div>
    </md-list-item>
    <md-list-item
        type="link"
        href="https://google.com/search?q=buy+kiwis&tbm=shop"
        target="_blank">
      <div slot="headline">Shop for Kiwis</div>
      <div slot="supporting-text">This will link you out in a new tab</div>
      <md-icon slot="end">open_in_new</md-icon>
    </md-list-item>
  </md-list>
</div>
```

Now, we can look at how to build the `bundle.js` file.

#### Quick Build

The easiest way to build bundles of material components is to do a quick command line installation.

Install the following Node modules:

* Rollup
* Rollup `node-resolve` plugin

```bash
npm install rollup @rollup/plugin-node-resolve
```

Then create a bundle from the index.js entry point file by running the following command.

```bash
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

Use the generated bundle in a &lt;script> "src" attribute:

```bash
<script src="./bundle.js"></script>
```

#### The Build Process

A build process better suited for production builds is documented in
[lit.dev](https://lit.dev)'s [Building for production](https://lit.dev/docs/tools/production/).

We install Rollup and the necessary Rollup plugins.

```bash
npm i --save-dev rollup \
  @web/rollup-plugin-html \
  @web/rollup-plugin-copy \
  @rollup/plugin-node-resolve \
  @rollup/plugin-terser \
  rollup-plugin-summary
```

Next, we create a Rollup configuration file (`rollup.config.mjs`) so I don't have to manually type the build command every time.

```js
import { rollupPluginHTML as html } from '@web/rollup-plugin-html';
import {copy} from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import terser  from '@rollup/plugin-terser';
import summary from 'rollup-plugin-summary';

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: 'index.html',
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify JS
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    summary(),
    // Optional: copy any static assets to build directory
    copy({
      patterns: ['images/**/*'],
    }),
  ],
  output: {
    dir: 'build',
  },
  preserveEntrySignatures: 'strict',
};
```

We can add scripts to the `scripts` section of the `package.json` configuration file.

```json
  "scripts": {
    "build": "rollup -c"
  },
```

To run the build, run:

```bash
npm run build
```

#### Serving the content

So far we've built the content and built the bundle of all components required to display the content we created.

Install [Web Dev Server](https://modern-web.dev/docs/dev-server/overview/):

```bash
npm i --save-dev @web/dev-server
```

Then add the following to the "scripts" section in package.json:

```bash
```json
  "scripts": {
    "start": "web-dev-server build/index.html--open --watch"
  },
```

To run the server, run the following command on a terminal:

```bash
npm start
```

## Would I use Material Design V3?

This is where I found the first issue with this iteration of Material Design that led me not to consider version 3 of Material Design. Instead, it's better to consider version 2 of the material web components or to move to a different set of web components that implement a design system.

Material Web Components V3 provides components for the elements in a page but none of the [canonical layouts](https://m3.material.io/foundations/layout/canonical-layouts/overview) the Material Design guidelines propose we use.

These layouts were in the Material Design Components Roadmap for Q4 2024 but, since the project is now in maintenance mode, the roadmap is no longer valid and there are no plans to implement them or to review and publish third-party PRs that do.

Likewise, shape and motion system tokens have not been implemented and, since they were planned for Q1 2024, they are not likely to be implemented any time soon.

There are also components under development in the [labs](https://github.com/material-components/material-web/tree/main/labs) directory with elements that address some of the issues that I mentioned earlier. But, again, because the project is in maintenance mode, there's no guarantee that any further work will be done on them.

So where does it leave us when it comes to developing layouts with Material Design V3?

At first, I thought about taking the Material Design V2 web components and modifying them to work with V3 components and using the design guidelines from the later version. The design paradigms are significantly different and I need to do further research to see if this is feasible.

Another alternative is to leverage container components from a third-party library. I'm researching alternatives that won't include paid solutions like Web Awesome Pro. Again, more research is needed.

The last, and least appealing, option is to create our own components to fill in the blanks. This requires a detailed understanding of web components and material design... my skills are not there yet.

But none of these options would make material (web) components attractive enough to use now. There are better alternatives that provide fuller functionality.
