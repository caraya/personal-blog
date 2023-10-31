---
title: "Building a fuller Starter Kit"
date: "2023-04-17"
---

I've built a Gulp system to generate HTML and PDF files. It works really well for that purpose.

I saw Adam Argyle's [Shortstack](https://github.com/argyleink/shortstack) starter project and it made me think it might be time to revisit bundling and CSS generation.

This experiment will look at the following areas:

* Browserslist
  * A sensible [browserslist](https://browsersl.ist/#q=defaults) default
* CSS
  * [PostCSS](https://postcss.org/) for the following:
    * bundle all CSS into one file
    * import from NPM, local or remote URLs
    * [postcss-preset-env](https://preset-env.cssdb.org/) for latest CSS features
* JS
  * [Rollup](https://rollupjs.org/) to do the following:
    * bundle code*
    * treeshake
    * import from NPM, local or remote URLs
  * [babel-preset-env](https://babeljs.io/docs/en/babel-preset-env) for latest JS features.
* Servers
  * [Browsersync](https://www.browsersync.io/)
    * A static Browsersync server for the production code

This is also an exercise for me as a developer to trust the defaults and only change them when it's absolutely necessary. I will explain why as we go.

## Browserslist defaults

Browserslist provides a list of browsers to run code against.

In this project the tools that use it are the preset-env plugins for CSS (postcss-preset-env) and Javascript (babel-preset-env) so we want to make sure that we tailor the list to something that makes sense.

The default browserslist configuration is equivalent to the following string:

```text
> 0.5%, last 2 versions, Firefox ESR, not dead
```

It took me a little while to parse what theis means but it boils down to these requirements:

* The last two versions of a browser
* Has at least 0.5% market share
* Includes Firefox ESR
* Is actively developed

This will give you 88.7% global browser support.

You can refine this query based on your analytics or specific country data.

One interesting way to customize the query with features.

The following query takes the default browsers that support ES modules plus all supported versions of Node.js

```text
defaults and supports es6-module,
maintained node versions
```

For this project we'll just keep the defaults as they are and tweak them as necessary with the understanding that this will be the lowest common denominator approach.

You can play with browserslist configurations in the [playground](https://browsersl.ist/#)

## CSS and PostCSS

The primary purpose I see for tools like PostCSS is to allow us to use newer CSS in production by converting it to CSS that is more widely supported.

Some of these features are in some browsers and some depends on polyfills to work on any current browsers at all.

PostCSS uses common.js, so the first stage is to require all the necessary modules.

`preset-env` contains most of the modules that we'll need, that reduces the number of plugins we have to install. We'll talk about possible exceptions later in this section.

```js
const postcssPresetEnv  = require('postcss-preset-env')
const postcssImport     = require('postcss-import')
const importUrl         = require('postcss-import-url')
const cssnano           = require('cssnano')
```

We define two configuration blocks. One for development work and one for production.

The development configuration lists the plugins in the order that we want to run them.

We import all the CSS file in the `app/css` directory using the `post-css` plugin.

We resolve all external URL imports using the `postcss-import-url` plugin.

Using these two plugins first gives us a single file to run the remaining plugins against.

We then run `postcss-preset-env` to run all the associated plugins against our code.

We should to run at `stage 0` meaning that we use all features, even those that haven't started the standardization process with the CSS Working group.

The full list of features supported by `postcss-preset-env` is [in their website](https://preset-env.cssdb.org/features/).

I decided not to polyfill some features since they are not supported across browsers. These properties are:

* Logical properties and values
* prefers color scheme media query
* gap

You can skip additional polyfills by adding the PostCSS feature name to the `features` array with a value of false.

```js
const dev = {
  plugins: [
    importUrl(),
    postcssImport({
      path: 'app/css',
    }),
    postcssPresetEnv({
      stage: 0,
      features: {
        'logical-properties-and-values': false,
        'prefers-color-scheme-query': false,
        'gap-properties': false,
      }
    }),
  ]
}
```

The production configuration is the same as development with the addition of [CSSNano](https://cssnano.co/) to minimize the resulting stylesheet.

I've always debated whether to minimize code or not since I learned web development by looking at other people's code. I understand the need to minimize bytes sent to the client but I don't want to be the guy that stops others from learning.

```js
const prod = {
  plugins: [
    importUrl(),
    postcssImport({
      path: 'app/css',
    }),
    postcssPresetEnv({
      stage: 0,
      features: {
        'logical-properties-and-values': false,
        'prefers-color-scheme-query': false,
        'gap-properties': false,
      }
    }),
    cssnano({
      preset: 'default'
    }),
  ]
}
```

We then do a little trickery to import the right module for use. If the `process.env.NODE_ENV` variable is set to production then we export the `prod` configuration and if not we export `dev`.

```js
module.exports = process.env.NODE_ENV === 'production'
  ? prod
  : dev
```

### Adding additional plugins

As good as the `preset-env` plugin is, it can't cover everything and, sooner rather than later, there will be features you want to use that are not included in the preset list of plugins.

At that point you'll have to decide if you want to use the feature and, if you do, what plugin to use for the feature.

Installing PostCSS plugins is fairly straightforward:

1. Install the plugin via NPM
2. Add the plugin to the configuration file under the plugins section
   1. Some plugins may need to be run in a certain order for them to work. Make sure to read the plugin's `readme` file and test with your setup

## Babel and Bundling with Rollup

Bundling and transpiling Javascript is similar to what we did with PostCSS, it just uses different tools.

Following up Shortstack's lead, I chose [Rollup](https://rollupjs.org/) as my bundler. It gives me a lot more flexibility than WebPack and the configuration is easier for me to understand.

Like we did with PostCSS, we've broken the configuration into two sections, one for development (`dev`) and one for production (`prod`).

As usual, we import the modules that we want to use.

Some of these modules will only be used in the production task but, since we wrote both tasks in a single file, we do only one import block.

```js
import resolve from '@rollup/plugin-node-resolve'
import { default as importHTTP } from 'import-http/rollup.js'
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'
import compiler from '@ampproject/rollup-plugin-closure-compiler'
```

In development mode we take the input (`index.js`) and output it as an esm module in `bundle.js`.

We then resolve all imports using `plugin-node-resolve` to locate imports in the `node_modules` tree and `importHTTP` to download and import files using URL, for example, from a CDN.

We also have the option of importing CSS files, if we're working with CSS in JS solutions. I've configured the `postcss` plugin not to inject the CSS import statement into the head of the HTML document. I do this manually in the HTML page.

We then run Babel using the [preset-env](https://babeljs.io/docs/babel-preset-env) to transpile modern code to code supported in the browsers specified in `browserslist`.

```js
const dev = {
  input: 'app/js/index.js',
  output: {
    file: 'app/bundle.js',
    format: 'esm',
    sourcemap: 'inline',
  },
  plugins: [
    resolve(),
    importHTTP(),
    postcss({
      inject: false,
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      "presets": [
        ["@babel/env"]
      ]
    }),
  ],
  watch: {
    exclude: ['node_modules/**'],
  }
}
```

For production, we follow the same process and we add minification using both the [terser](https://www.npmjs.com/package/@rollup/plugin-terser) and [closure compiler](https://github.com/ampproject/rollup-plugin-closure-compiler). I have yet to test the combination in larger projects to see if it's worth it to keep both or if either one on their own would be enough.

```js
const prod = {
  input: 'app/js/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    importHTTP(),
    postcss({
      extract: true,
      minimize: { preset: 'default' },
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      "presets": [
        ["@babel/env"]
      ]
    }),
    terser(),
    compiler(),
  ]
}
```

Again we create a [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) and test for the value of the `NODE_ENV` environmental variable and set the type of build accordingly.

```js
export default process.env.NODE_ENV === 'production'
  ? prod
  : dev
```

### Configuring babel-preset-env

Configuring Babel's preset-env is tricky.

One one had we want to support as many browsers as we can.

On the other hand we want to use modern Javascript features that require later versions of the Javascript specification.

Babel preset-env uses [browserslist](https://browsersl.ist/) to decide what features to polyfill.

The defaults query is equivalent to this:

```text
> 0.5%, last 2 versions, Firefox ESR, not dead
```

It means that we support all browsers that meet any of these requirements:

* Have more than a 5% market share
* Are the last two versions of the browser
* Is [Firefox ESR](https://www.mozilla.org/en-US/firefox/enterprise/) that gets updated once a year
* Is not dead according to their definition. These are browsers without official support or updates for more than 24 months

The problem I see is that we can't rely on "the last 2 versions" to cover the features that we want.

Yes, all browsers that pass the Browserslist test meet our baseline requirements:

* Classes (ES2015)
* Arrow functions (ES2015)
* Generators (ES2015)
* Block scoping (ES2015)
* Destructuring (ES2015)
* Rest and spread parameters (ES2015)
* Object shorthand (ES2015)
* Async/await (ES2017)

So the biggest question becomes what browser combinations, or what ECMAScript versions to package for.

In an ideal world we would be able to use all features available to Javascript in browsers for every project.

The reality is not quite as nice.

Not all recent versions of all browsers support the same Javascript features or all the same versions. So we might end up transpiling code only because one browser doesn't support a given feature.

It requires fine tuning and lots of careful consideration of what you want to do. I've chosen to start with the defaults settings and experiment with changes from there.

## Browser Sync as server

The final component is the server. [Browsersync](https://browsersync.io/) is still my prefered option mostly because of its capability of mirroring actions across browsers open to the same page.

We can start two different servers.

One will serve the the content during development, before we package it for production. The server will reload the page whenever the content is updated.

The other one will work serve the static site we built for production.

We set the servers up so that they won't open a new window in the default browser when Browsersync starts and we disable browser notifications. In addition to this, the production server disables [ghost mode](https://browsersync.io/docs/options#option-ghostMode) for additional security.

```json
"scripts": {
  "dev:server": "browser-sync app --files \"app/**/*, !app/css/**, !app/js/**\" --no-open --no-notify",

"prod:server": "browser-sync dist --no-open --no-notify --no-ghost-mode"
}
```

## Conclusions

Yes, I know that there are tools like [Vite](https://vitejs.dev/) provides most, but not all, of the features we've created in this project.

Using Vite means we would either have to create our own template to run when we initialize a new Vite project (which may be where this project goes next) or we have to manually set up the PostCSS configuration ourselves every time we initialize a project.

But this was a fun learning experience and a good starting point to create a Vite package.
