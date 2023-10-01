---
title: "Gulp Workflow: Basic Setup"
date: "2016-03-07"
categories: 
  - "technology"
---

In the next sections we’ll go through a gulpfile I use to work with my athena-shell project.

The directory structure for the project is like this:

```js
.
├── app
│    ├── bower_components
|    ├── coffee
│    ├── css
│    ├── elements
│    ├── es6
│    ├── images
│    ├── js
│    ├── scss
│    └── styles
├── bower_components
├── dist
└── node_modules
```

The `app` directory is our source, as you can see it has more directories than those in the `dist` destination directory. We have different sources for Javascript transpilation and CSS transformation. Most of the sources will end up in the `js` and `css` directories.

## General setup

We’ll use strict Javascript to make sure as few mistakes as possible get through our final product. Later in the process we’ll set `jshint` to validate our code, including the gulpfile.

The require statements load the corresponding plugin to be used in the gulpfile. Please make sure that you install the plugin before running the gulpfile.

> \*\*NOTE: We don’t require all the packages we use although perhaps we should do so. Instead we use `gulp-load-plugins` (aliased to `$`) to load the plugins as we need them. Whenever you see this construct: `$.plugin-name` it means that we’re loading the plugin dynamically.

```js
'use strict';
// Require Gulp first
var gulp = require('gulp'),
  packageJson = require('./package.json'),
  // Load plugins
  $ = require('gulp-load-plugins')(),
// Javascript
  babel = require('gulp-babel'),
  jshint = require('gulp-jshint'),
  jsstyle = require('gulp-jscs'),
// SASS, SASS tools and sourcemaps
  sass = require('gulp-ruby-sass'),
  scsslint = require('gulp-scss-lint'),
  sassdoc = require('sassdoc'),
  sourcemaps = require('gulp-sourcemaps'),
// Image Processing
  imagemin = require('gulp-imagemin'),
// Cleanup Crew
  del = require('del'),
// Static Web Server stuff
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  historyApiFallback = require('connect-history-api-fallback'),
// Utilities
  runSequence = require('run-sequence');
```

When running Page Speed insights you should register a key as indicated in the [Page Speed insights Getting Started Guide](https://developers.google.com/speed/docs/insightss/v2/getting-started). Once you get the key, uncomment the key variable and enter the string as the value

```js
//var key = '';
var site = 'https://caraya.github.io/athena-template/';
```

Autoprefixer needs to know what browsers to write prefixes for. The variable below lists all the browsers and versions that we’ll auto prefix for. We can change the versions of specific browsers to prefix for and let the tool and caniuse.com deal with the actual task.

```js
var AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];
```
