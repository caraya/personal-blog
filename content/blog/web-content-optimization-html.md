---
title: "Web Content Optimization: HTML"
date: "2015-11-02"
categories:
  - "technology"
---

Tasks that minimize HTML are available for [Grunt](https://github.com/gruntjs/grunt-contrib-htmlmin) and [Gulp](https://github.com/jonschlinkert/gulp-htmlmin) and both are based on the [HTML minifier](https://github.com/kangax/html-minifier) tool.

| Option | Description | Default |
| --- | --- | --- |
| `removeComments` | [Strip HTML comments](http://perfectionkills.com/experimenting-with-html-minifier/#remove_comments) | `false` |
| `removeCommentsFromCDATA` | [Strip HTML comments from scripts and styles](http://perfectionkills.com/experimenting-with-html-minifier/#remove_comments_from_scripts_and_styles) | `false` |
| `removeCDATASectionsFromCDATA` | [Remove CDATA sections from script and style elements](http://perfectionkills.com/experimenting-with-html-minifier/#remove_cdata_sections) | `false` |
| `collapseWhitespace` | [Collapse white space that contributes to text nodes in a document tree.](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_whitespace) | `false` |
| `conservativeCollapse` | Always collapse to 1 space (never remove it entirely). Must be used in conjunction with `collapseWhitespace=true` | `false` |
| `preserveLineBreaks` | Always collapse to 1 line break (never remove it entirely) when whitespace between tags include a line break. Must be used in conjunction with `collapseWhitespace=true` | `false` |
| `collapseBooleanAttributes` | [Omit attribute values from boolean attributes](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_boolean_attributes) | `false` |
| `removeAttributeQuotes` | [Remove quotes around attributes when possible.](http://perfectionkills.com/experimenting-with-html-minifier/#remove_attribute_quotes) | `false` |
| `removeRedundantAttributes` | [Remove attributes when value matches default.](http://perfectionkills.com/experimenting-with-html-minifier/#remove_redundant_attributes) | `false` |
| `preventAttributesEscaping` | Prevents the escaping of the values of attributes. | `false` |
| `useShortDoctype` | [Replaces the doctype with the short (HTML5) doctype](http://perfectionkills.com/experimenting-with-html-minifier/#use_short_doctype) | `false` |
| `removeEmptyAttributes` | [Remove all attributes with whitespace-only values](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_or_blank_attributes) | `false` |
| `removeScriptTypeAttributes` | Remove `type="text/javascript"` from `script` tags. Other `type` attribute values are left intact. | `false` |
| `removeStyleLinkTypeAttributes` | Remove `type="text/css"` from `style` and `link` tags. Other `type` attribute values are left intact. | `false` |
| `removeOptionalTags` | [Remove unrequired tags](http://perfectionkills.com/experimenting-with-html-minifier/#remove_optional_tags) | `false` |
| `removeIgnored` | Remove all tags starting and ending with `< %`, `%>`, `< ?`, `?>` | `false` |
| `removeEmptyElements` | [Remove all elements with empty contents](http://perfectionkills.com/experimenting-with-html-minifier/#remove_empty_elements) | `false` |
| `lint` | [Toggle linting](http://perfectionkills.com/experimenting-with-html-minifier/#validate_input_through_html_lint) | `false` |
| `keepClosingSlash` | Keep the trailing slash on singleton elements | `false` |
| `caseSensitive` | Treat attributes in case sensitive manner (useful for custom HTML tags.) | `false` |
| `minifyJS` | Minify Javascript in script elements and  attributes (uses [UglifyJS](https://github.com/mishoo/UglifyJS2)) | `false` (could be `true`, `false`, `Object` (options)) |
| `minifyCSS` | Minify CSS in style elements and style attributes (uses [clean-css](https://github.com/GoalSmashers/clean-css)) | `false` (could be `true`, `false`, `Object` (options)) |
| `minifyURLs` | Minify URLs in various attributes (uses [relateurl](https://github.com/stevenvachon/relateurl)) | `false` (could be `Object` (options)) |
| `ignoreCustomComments` | Array of regex'es that allow to ignore certain comments, when matched | `[ ]` |
| `processScripts` | Array of strings corresponding to types of script elements to process through minifier (e.g. `text/ng-template`, `text/x-handlebars-template`, etc.) | `[ ]` |
| `maxLineLength` | Specify a maximum line length. Compressed output will be split by newlines at valid HTML split-points. |  |
| `customAttrAssign` | Arrays of regex'es that allow to support custom attribute assign expressions (e.g. `'<div flex?="{{mode != cover}}"></div>'`) | `[ ]` |
| `customAttrSurround` | Arrays of regex'es that allow to support custom attribute surround expressions (e.g. {% raw %}`<input {{#if value}}checked="checked"{{/if}}/>`{% endraw %}) | `[ ]` |
| `customAttrCollapse` | Regex that specifies custom attribute to strip newlines from (e.g. `/ng\-class/`) |  |
| `quoteCharacter` | Type of quote to use for attribute values (' or ") | " |

## Installation Instructions

From NPM for use as a command line app:

```bash
npm install html-minifier -g
```

From NPM for programmatic use:

```bash
npm install html-minifier
```

From Git:

```bash
git clone git://github.com/kangax/html-minifier.git
cd html-minifier
npm link .
```

### Usage

For command line usage please see `html-minifier --help`

### Node.js

```js
var minify = require('html-minifier').minify;
var result = minify('<p title="blah" id="moo">foo</p>', {
  removeAttributeQuotes: true
});
result; // '<p title=blah id=moo>foo</p>'
```

#### Grunt Task

```javascript
grunt.initConfig({
  htmlmin: {                                     // Task
    dist: {                                      // Target
      options: {                                 // Target options
        removeComments: true,
        collapseWhitespace: true
      },
      files: {                                   // Dictionary of files
        'dist/index.html': 'src/index.html',     // 'destination': 'source'
        'dist/contact.html': 'src/contact.html'
      }
    },
    dev: {                                       // Another target
      files: {
        'dist/index.html': 'src/index.html',
        'dist/contact.html': 'src/contact.html'
      }
    }
  }
});
```

### Gulp Plugin

```javascript
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');

gulp.task('minify', function() {
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'))
});
```

## HTML versus web components

Over the past few weeks I've been looking at Polymer and web components again and it led me to wonder if web components are a better solution to transport and performance issues we are discussing in this series. I'm not sure what the answer is yet but it'd be an interesting research project.
