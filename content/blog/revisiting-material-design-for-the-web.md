---
title: Revisiting Material Design For The Web
data: 2024-07-08
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

```js
<script type="importmap">
  {
    "imports": {
      "@material/web/": "https://esm.run/@material/web/"
    }
  }
</script>
```

```js
  <script type="module">
    import '@material/web/all.js';
    import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

    document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
  </script>
```

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

### Individual Components

```js
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/checkbox/checkbox.js';

import '@material/web/list/list.js';
import '@material/web/list/list-item.js';

import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

Use the &lt;component-name> tag in HTML markup. Refer to the [component docs] for more guidance on using each component.

```html
<script type="module" src="./index.js"></script>

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

#### Quick Build

```bash
npm install rollup @rollup/plugin-node-resolve
```

Create a bundle from an entry point index.js file:

```bash
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

Use the generated bundle in a &lt;script> "src" attribute:

```bash
<script src="./bundle.js"></script>
```

#### The Build Process

<https://lit.dev/docs/tools/production/>

```bash
npm i --save-dev rollup \
  @web/rollup-plugin-html \
  @web/rollup-plugin-copy \
  @rollup/plugin-node-resolve \
  @rollup/plugin-terser \
  rollup-plugin-summary
```

```js
// Import rollup plugins
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
    // copy({
    //   patterns: ['images/**/*'],
    // }),
  ],
  output: {
    dir: 'build',
  },
  preserveEntrySignatures: 'strict',
};
```

#### Serving the content

**Install Web Dev Server**:

```bash
npm i --save-dev @web/dev-server
```

Then add the following to the "scripts" section in package.json:

```bash
"start": "web-dev-server build/index.html--open --watch"
```

**Start the server**:

```bash
web-dev-server --node-resolve --open
wds --node-resolve --open
```

**Run in watch mode, reloading on file changes**:

```bash
web-dev-server --node-resolve --watch --open
```

**Transform JS to a compatible syntax based on the user agent**:

```bash
web-dev-server --node-resolve --open --esbuild-target auto
```

## Building a Layout

## Should we use it?

<https://github.com/material-components/material-web/tree/main/docs/components>
