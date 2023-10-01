---
title: "Gulp Workflow: CSS Processing (SASS Post Processing)"
date: "2016-03-21"
categories: 
  - "technology"
---

Now that we’ve generated the CSS files form our SASS content there are a few things left to do.

[Autoprefixer](https://github.com/postcss/autoprefixer) takes care of one of the most tedious tasks in writing CSS: adding vendor prefixes.

Daniel Glazman walks through the [history of CSS vendor prefixes](http://www.glazman.org/weblog/dotclear/index.php?post/2015/07/30/CSS-Vendor-Prefixes) in his blog but the general idea is that vendor prefixes allowed browser and other user agent vendors to implement CSS features undergoing standardization without impacting any future work from the CSS working group.

The problem is that, as the features became widely deployed, it became impossible to withdraw the prefixed features. Furthermore, when specifications became finalized (reached the recommendation stage) vendors dropped prefixes in the following version of the browser… without removing the prefixed version from older releases.

So the result is that now we have at least 3 mjor vendor prefixes (`-ms`, `-webkit` and `-moz`) plus the unprefixed version of some properties to work with. As you can imagine manually accounting for all the different prefixes and the versions of the browsers that supported different versions of a given CSS property is an exercise in frustration and futility.

Autoprefixer uses [caniuse.com](http://caniuse.com/)’s database to determine what versions of popular browsers (IE, Edge, Firefox, Chrome, Safari, Opera, iOS Safari, Opera Mini, Android Browser and Chrome for Android) need prefixes and then, based on your needs and configuration, will automatically add the appropriate prefix to your CSS properties.

[CSSNano](http://cssnano.co/) is a modular and configurable CSS minifier. Remember that we did not compress the output of our SASS task when first creating CSS.

To install plugins:

```
npm install --save-dev gulp-autoprefixer gulp-cssnano gulp-changed
```

This task is an example of how we can pipe multiple plugins into the same task. In this case we’re using 5 plugins:

- Changed
- Autoprefixer
- Source maps
- CSSnano.

The task template looks like this:

```
gulp.task('processCSS', function () {
  return gulp.src('app/css/**/*.css')
    .pipe($.changed('app/css/**/*.css', {extension: '.css'}))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(sourcemaps.init())
    .pipe($.cssnano({autoprefixer: false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe($.size({
      pretty: true,
      title: 'processCSS'
    }));
});
```

## Trimming the CSS fat

Even under the best of circumstances our CSS gets fat and grows classes and selectors that we will not use everywhere if at all. Yet it’s nice to have only one stylesheet to use throughout your project.

[UnCSS](https://github.com/giakki/uncss) trims unused selectors from your CSS based on the HTML files provided. It does this with the following process:

1. The HTML files are loaded by PhantomJS and JavaScript is executed.
2. Used stylesheets are extracted from the resulting HTML.
3. The stylesheets are concatenated and the rules are parsed by css-parse.
4. document.querySelector filters out selectors that are not found in the HTML files.
5. The remaining rules are converted back to CSS.

Install the plugin:

```
npm install --save-dev gulp-uncss
```

The task to run is below

```
gulp.task('uncss', function () {
  return gulp.src('app/css/**/*.css')
    .pipe($.concat('main.css'))
    .pipe($.uncss({
      html: ['*.html']
    }))
    .pipe(gulp.dest('dist/css/all-clean.css'))
    .pipe($.size({
      pretty: true,
      title: 'Uncss'
    }));
});
```

## Generating CSS for above the fold critical path

CSS and Javascript will block the rendering of your page. Javascript provides features to load scripts aynchronously or defer load until after page load. CSS doesn’t provide equivalent features although Filament Group’s [loadCSS](https://github.com/filamentgroup/loadCSS) provides a similar feature for non-critical CSS (Scot Jehl [did the research](https://gist.github.com/scottjehl/87176715419617ae6994) that lead to loadCSS.)

Critical Path CSS is all the CSS that the browser needs to render the content above the fold (the 1st screen of content before we scroll down) without blocking the rendering of the page. This block of CSS is usually inlined on the page to reduce the loading time and the number of bytes pushed through the wire.

If you’re disciplined or use a modular approach to building your SASS style sheets you can build them manually like the example at [gomakethings](http://gomakethings.com/inlining-critical-css-for-better-web-performance/) but it’s not always easy to do, particularly when working with large teams or large ammounts of CSS.

Or, if you’re lazy like me, you can let your build process handle generating and inlining the critical path CSS for you. Depending on the complexity of your CSS the task may not load all the elements that the page needs to render properly. Test the hell out of this task and repeat it over and over wile you tweak your SASS files.

To load the plugin:

```
npm install --save-dev critical
```

The task looks like this:

```
// Generate & Inline Critical-path CSS 
gulp.task('critical', function () {
 return gulp.src('app/*.html')
   .pipe(critical({
     base: 'app/',
     inline: true,
     css: ['app/css/main.css'],
     dimensions: [{
       width: 320,
       height: 480
     }, {
       width: 768,
       height: 1024
     }, {
       width: 1280,
       height: 960
     }],
     minify: true,
     extract: false,
     ignore: ['font-face']
   }))
   .pipe($.size({
     pretty: true,
     title: 'Critical'
   }))
   .pipe(gulp.dest('dist'));
});
```

## Inserting scripts

The last thing we’ll look at about CSS is how to insert bundled scripts into the HTML pages.

Useref let’s you declare blocks of things to be replaced in your HTML page, something like this:

```
<!-- build:css css/combined.css -->
<link href="css/one.css" rel="stylesheet"/>
<link href="css/two.css" rel="stylesheet"/>
<!-- endbuild -->
```

And then use the task below to do the actual replacement:

```
// Parse build blocks in HTML files to replace references to non-optimized 
// scripts or stylesheets.
gulp.task('useref', function () {
  return gulp.src('app/*.html')
    .pipe($.useref({ searchPath: '.tmp' }))
    .pipe(gulp.dest('dist/*.html'));
});
```

As usual, install the plug in like this:

```
npm install --save-dev gulp-useref
```
