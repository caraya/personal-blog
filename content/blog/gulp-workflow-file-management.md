---
title: "Gulp Workflow: FIle Management"
date: "2016-03-30"
categories: 
  - "technology"
---

Now for what, to me, is the most tedious part of the workflow… copying things around and doing housekeeping on the files I’m working with.

This is easier now since I don’t have to create directories (did that already) or move things around (only copy) so we set up tasks to copy sets of files and clean up after ourselves.

## Copying things over

Copying files ended up being stranger than I thought it would be. I could set up a big task that would copy everything every time I run it but I realized that such a task would be overkill since some of the files do not update as often as others.

So instead I created specific copy tasks. The first task will copy all content except the directories specified with a `!` as the first character.

There are no task specific plugins to install. It uses Gulp’s default API.

```
// Copy all files at the root level (app)
gulp.task('copyAssets', function () {
  var APP_ASSETS = [
    'app/*',
    '!app/coffee',
    '!app/es6',
    '!app/scss',
    '!app/test',
    '!app/bower_components',
    '!app/fonts',
    '!app/cache-config.json',
    '!**/.DS_Store'
  ];

  return gulp.src([ APP_ASSETS], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({
      pretty: true,
      title: 'copy'
    }));
});
```

Copying content from the `bower_components` directory presents two options. If we’re working with a Polymer based application and we use Vulcanize to concatenate the components we use there are still components that cannot be included in the vulcanized output.

```
gulp.task('copyBower', function () {
  var BOWER_ASSETS = [
    'bower_components/{webcomponentsjs,
platinum-sw,sw-toolbox,promise-polyfill}/**/*'
  ];
  return gulp.src([ BOWER_ASSETS], {
    dot: true
  }).pipe(gulp.dest('dist/elements'))
    .pipe($.size({
      pretty: true,
      title: 'copy'
    }));
});
```

If we are not using Polymer you can still use [Bower](http://bower.io/) to install Javascript and CSS libraries. You can also save the dependencies to a `bower.json` and install them in a different system by using the command `bower install`.

In this case we don’t specify the names of the plugins to copy. Instead we just do a blanket glob to copy everything under `bower_components`

```
gulp.task('copyBower', function () {
  return gulp.src([
    'bower_components/**/*'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({
      pretty: true,
      title: 'copy'
    }));
});
```

Web fonts change seldom, if at all. We copy everything inside the `app/fonts` directory over to the destination folder.

```
// Copy web fonts to dist
gulp.task('copyFonts', function () {
  return gulp.src(['app/fonts/**'])
    .pipe(gulp.dest('dist'))
    .pipe($.size({
      title: 'fonts'
    }));
});
```

## Cleaning up

I’m old enough to remember how leftovers would screw up compilation of a C program. To prevent that I usually create a task or a command to clean up the target directory from all existing crap. In this case the best way to do this is to remove a `.tmp` temporary directory and the `dist` directory that contains the results of all our tasks.

Install the `del` plugin like this:

```
npm install --save-dev  del
```

The task looks like this:

```
// Clean output directory
gulp.task('clean', function () {
 return del.sync([
       'dist/',
   '.tmp'
 ]);
});
```
