---
title: "Trimming the CSS fat"
date: "2015-02-17"
categories: 
  - "technology"
  - "tools-projects"
---

# Trimming the CSS fat

After reading India Amos [Degristling the sausage: BBEdit 11 Edition](http://ink.indiamos.com/2015/02/12/degristling-the-sausage-bbedit-11-edition/) I thought I'd share my tricks for making CSS files as small as possible. While I learned these tricks as a front end developer they apply equally to creating content for e-books.

One thing that has always stopped me from fully embracing frameworks is that they use an insane amount of code and it's really difficult to trim until I'm done with a project and, at that time, I usually don't want to have to look at CSS for a few weeks.

In researching front end techniques I've discovered a few techniques to make CSS development more bearable and to cut the size of our CSS files at the same time.

The main requirement for the chosen tools is that they have both a command line tool or a grunt/gulp build system plugin.

For tools like CodeKit, a Macintosh application, or Prepros, cross platform, they must support all the tool discussed.

Both of these task runners, and the plugins that run within them, depend on [Node.js](http://nodejs.org/) and [NPM](https://www.npmjs.com/). They both must be installed on your system before any of the tools discussed will work.

## SASS

> SASS and related libraries require Ruby and the SASS gem. Ruby is installed in most (if not all) Linux and OS X systems. To install SASS just do `gem install sass`

I've been a fan of SASS ever since I first read about it a few years ago. It allows you to build more complex structures that you can with pure CSS.

Part of the fat trimming is the use of variables and reducing the number of redundant selector rules that we write.

I have written about [SASS and some of its features](https://publishing-project.rivendellweb.net/sass-scss-css-and-modular-design/)

I followed it up with [this post](http://wp.me/p3KUjB-lP3) about advanced features to make CSS more manageable.

## Grunt/Gulp Build System

After a long time saying I didn't need a build system but, the more tools and techniques I've discovered. the harder it gets to remember the command line tools you have to use to accomplish these tasks

[Grunt](http://gruntjs.com/) is the first task runner I saw and the one I still work with. It works in discrete tasks. It is very configuration heavy; the Gruntfile.js configuration file is full of instructions for how to run each task.

In the example below we define our tasks, along with the options and settings for each, and finally we define a custom task that includes all the steps we want to take.

```

/*global module */
/*global require */
(function () {
  "use strict";
  module.exports = function (grunt) {
    // require it at the top and pass in the grunt instance
    // it will measure how long things take for performance
    //testing
    require("time-grunt")(grunt);

    // load-grunt will read the package file and automatically
    // load all our packages configured there.
    // Yay for laziness
    require("load-grunt-tasks")(grunt);

    grunt.initConfig({
      // SASS RELATED TASKS
      // Converts all the files under scss/ ending with .scss
      // into the equivalent css file on the css/ directory
      sass: {
        dev: {
          options: {
            style: "expanded"
          },
          files: [{
            expand: true,
            cwd: "scss",
            src: ["*.scss"],
            dest: "css",
            ext: ".css"
          }]
        },
        production: {
          options: {
            style: "compact"
          },
          files: [{
            expand: true,
            cwd: "scss",
            src: ["*.scss"],
            dest: "css",
            ext: ".css"
          }]
        }
      },
     scsslint: {
        allFiles: [
          "scss/*.scss",
          "scss/modules/_mixins.scss",
          "scss/modules/_variables.scss",
          "scss/partials/*.scss"
        ],
        options: {
          config: ".scss-lint.yml",
          force: true,
          colorizeOutput: true
        }
      },

      autoprefixer: {
        options: {
          browsers: ["last 2"]
        },

        files: {
          expand: true,
          flatten: true,
          src: "scss/*.scss",
          dest: "css/"
        }
      },

      // CSS TASKS TO RUN AFTER CONVERSION
      // Cleans the CSS based on what"s used in the specified files
      // See https://github.com/addyosmani/grunt-uncss for more
      // information
      uncss: {
        dist: {
          files: {
            "css/tidy.css": ["*.html", "!docs.html"]
          }
        }
      }
    }); // closes initConfig

    // CUSTOM TASKS
    // Usually a combination of one or more tasks defined abov

    // Prep CSS starting with SASS, autoprefix et. al
    grunt.task.registerTask(
      "prep-css",
      [
        "scsslint",
        "sass:dev",
        "autoprefixer",
        "uncss"
      ]
    );
  }; // closes module.exports
}()); // closes the use strict function
```

[Gulp](http://gulpjs.com/) is a stream oriented task runner where the emphasis is connecting (piping) the output one task to the input of the next. In the example below we create a task and then pipe the different plugins as input until the last pipe is for the destination of the product.

```

var cssc   = require("gulp-css-condense"),
    csso   = require("gulp-csso"),
    more   = require("gulp-more-css"),
    shrink = require("gulp-cssshrink");

gulp.task("styles", function () {
    return sass("./styles", {
        loadPath: "./vendor/bootstrap-sass/assets/stylesheets"
    }).on("error", console.warn.bind(console, chalk.red("Sass Errorn")))
        .pipe(autoprefixer())
        .pipe(combinemq())
        .pipe(cssc())
        .pipe(csso())
        .pipe(more())
        .pipe(shrink())
        .pipe(gulp.dest("./build/css"));
});
```

## Combine Media Queries

The first optimization is to consolidate our Media Queries using [Combine MQ](https://github.com/frontendfriends/node-combine-mq). The idea behind this is to reduce the number of Media Queries and their associated rules.

We do this reduction first to make sure that we won't have to run Autoprefixer and UnCSS again after reducing the number of Media Queries in our final CSS file.

There are [Grunt](https://github.com/frontendfriends/grunt-combine-mq) and [Gulp](https://github.com/frontendfriends/grunt-combine-mq) plugins available

## AutoPrefixer

Autoprefixer helps in dealing with 'prefix hell' for the most part.

In their race to be first to implement a css feature, vendors added it behind a vendor-specific prefix (-webkit for Safari, Chrome and Opera, -o for Opera before they adopted Webkit, -moz for Firefox and -ms for Microsoft) to hide it for the browsers that had not adopted it or implemented differently.

> Note that Autoprefixer does not handle ePub specific vendor prefixes. There are PostCSS tools that will do it for you when/if needed. I've chosen not to implement these postcss plugins

That left developers having to figure out which elements had which vendor prefixes and to update them when/if the vendor finally decided to drop the prefix altogether.

[Autoprefixer](https://github.com/postcss/autoprefixer) is a command line tool that will take care of vendor prefixes. It uses [caniuse.com](http://caniuse.com/) to determine what prefixes to apply to which element.

You can also specify how far back to go for prefixes. Examples of valid browser values:

- `last 2 versions`: the last 2 versions for each major browser.
- `last 2 Chrome versions`: the last 2 versions of Chrome browser.
- `> 5%`: versions selected by global usage statistics.
- `> 5% in US`: uses USA usage statistics. It accepts \[two-letter country code\].
- `Firefox > 20`: versions of Firefox newer than 20.
- `Firefox >= 20`: versions of Firefox newer than or equal to 20.
- `Firefox < 20`: versions of Firefox less than 20.
- `Firefox <= 20`: versions of Firefox less than or equal to 20.
- `Firefox ESR`: the latest \[Firefox ESR\] version.
- `iOS 7`: the iOS browser version 7 directly.

You can also target browsers by name:

- Android for Android WebView.
- BlackBerry or bb for Blackberry browser.
- Chrome for Google Chrome.
- Firefox or ff for Mozilla Firefox.
- Explorer or ie for Internet Explorer.
- iOS or ios\_saf for iOS Safari.
- Opera for Opera.
- Safari for desktop Safari.
- OperaMobile or op\_mob for Opera Mobile.
- OperaMini or op\_mini for Opera Mini.
- ChromeAndroid or and\_chr for Chrome for Android (mostly same as common Chrome).
- FirefoxAndroid or and\_ff for Firefox for Android.
- ExplorerMobile or ie\_mob for Internet Explorer Mobile.

Autoprefixer is available as a command line tool, a [Grunt Plugin](https://github.com/nDmitry/grunt-autoprefixer) and a [Gulp Plugin](https://github.com/Metrime/gulp-autoprefixer)

## UnCSS

> User-interface libraries like Bootstrap, TopCoat and so on are fairly prolific, however many developers use less than 10% of the CSS they provide (when opting for the full build, which most do). As a result, they can end up with fairly bloated stylesheets which can significantly increase page load time and affect performance. grunt-uncss is an attempt to help with by generating a CSS file containing only the CSS used in your project, based on selector testing. From [Grunt UnCSS](https://github.com/addyosmani/grunt-uncss)

[Uncss](https://github.com/giakki/uncss) takes a set of HTML files, a css stylesheet and produces a new stylesheet with only those rules actually used in the HTML files. The idea is to reduce the size of the CSS being pushed to the client.

Shrinking the size of our CSS file(s) may not seem like a big deal but it becomes important when you use large libraries like [Bootstrap](http://getbootstrap.com) or [Zurb Foundation](http://foundation.zurb.com) or when your own CSS libraries become too large to handle (special cases can be killers.)

Addy Osmani, the creator and maintainer claims that he has reduced the CSS size on a multi page Bootstrap project from over 120KB to 11KB.

![UnCSS Size Reduction](https://camo.githubusercontent.com/986f80f311f534223b46dfd3addcf1e7257698eb/687474703a2f2f692e696d6775722e636f6d2f7568574d414c482e676966)

There are UnCSS plugins for [Grunt](https://github.com/addyosmani/grunt-uncss) and [Gulp](https://github.com/ben-eb/gulp-uncss) available

## CSSO or other minimizers

Now that we have a prefixed CSS file with only the classes we need we can look at further size reduction by doing optional compressions. I've chose to be somehwat conservative and choose two possible options of the many minimizers available through NPM and Grunt.

If you want to see a more detailed comparison check [sysmagazine comparison of CSS and Javascript processors](http://sysmagazine.com/posts/181880/)

### CSS Optimizer

We will first run the CSS file through [CSS Optimizer](http://css.github.io/csso/). What brought this plugin to my attention is that it not only does the traditional minimizations. According to the documentation it can perform:

- Safe transformations:
    
    - Removal of whitespace
    - Removal of trailing ;
    - Removal of comments
    - Removal of invalid @charset and @import declarations
    - Minification of color properties
    - Minification of 0
    - Minification of multi-line strings
    - Minification of the font-weight property
- Structural optimizations:
    
    - Merging blocks with identical selectors
    - Merging blocks with identical properties
    - Removal of overridden properties
    - Removal of overridden shorthand properties
    - Removal of repeating selectors
    - Partial merging of blocks
    - Partial splitting of blocks
    - Removal of empty ruleset and at-rule
    - Minification of margin and padding properties

As with the other tools, there are [Grunt](https://github.com/t32k/grunt-csso) and [Gulp](https://github.com/ben-eb/gulp-csso) plugins available.

### CSS Shrink

While CSSO may have gotten as small as possible, I'd rather make sure. That's where CSS Shrink comes in.

You may be wondering why is Carlos being so obsessive with reducing the size of his CSS files?

Fair question. Here's the answer:

Images are loaded asynchronously. We can load JavaScript asynchronously if we so choose. CSS is the only component of your web page that only loads synchronously and most browsers will block rendering the page until all your CSS downloads. That's why it pays for it to be the smallest we can make it and combined the CSS into as few files as possible.

[CSS Shrink](https://github.com/stoyan/cssshrink) provides that second level of compression, just to make sure we didn't miss anything :-)

As usual, plugins for [Grunt](https://github.com/JohnCashmore/grunt-cssshrink) and [Gulp](https://www.npmjs.com/package/gulp-cssshrink/) are available.

## CodeKit/Prepros: One tool to rule them all

I know that some developers would rather not use command line tools. There are applications that provide almost equivalent functionality.

[CodeKit](https://incident57.com/codekit/) (Mac only) and [Prepros](https://prepros.io/) (Mac and Windows)

The screenshot below shows Codekit's UI with a project open

![Codekit Project UI](//publishing-project.rivendellweb.net/wp-content/uploads/2015/02/codekit-working-project.png)

The second screenshopt shows SCSS compilation options on the right side of the screen.

![Codekit Compilation Options](//publishing-project.rivendellweb.net/wp-content/uploads/2015/02/codekit-transform-interface.png)

I own a copy of Codekit more from curiosity than from any actual use but realize that it may be better for developers who are not comfortable with command line interfaces.

## Code Repository and Additional Goodies

I've created a [Github Repository](https://github.com/caraya/publishing-toolset) to go along with the ideas in this article. It's a drop-in structure for a new project and it's also an opinionated skeleton for new projects.

Issues, comments and Pull Requests are always welcome
