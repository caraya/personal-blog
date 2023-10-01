---
title: "Gulp Workflow: Transpilations and JavaScript processing"
date: "2016-03-09"
categories: 
  - "technology"
---

Transpilation allow us to use features of an input language into another. Recently Javascript has become a favorite target for Transpilers. The languages I’ve chosen to add are:

[ES6](http://www.ecma-international.org/ecma-262/6.0/) through [Babel](http://babeljs.io/): ES6/ES2015 is the current specification for Ecmascript / Javascript standard. Because it is not evenly supported we still need to transpile it into ES5 which is better supported on browsers today.

The ES6/Babel transpilation requires both `gulp-babel` and `babel-preset-es2015`. Install them with the following command:

```
npm install --save dev  gulp-babel babel-preset-es2015
```

The task looks like this:

```
// Transpiles ES6 to ES5 using Babel
gulp.task('babel', function () {
  return gulp.src('app/es6/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/js/'))
    .pipe($.size({
      pretty: true,
      title: 'Babel'
    }));
});
```

There is an extra task for Babel, an experimental process to compile everything still at the proposal stage for ECMA TC39 (the groups that decides on the standard for the language.)

Because the committee can move this proposals through the [development process](https://tc39.github.io/process-document/) or drop them without warning this is a fun experiment but be careful with how you use it. It may stop working at any time.

Install the extra preset:

```
npm install --save-dev babel-preset-stage-0
```

And use the following task to run it. Note that we’ve moved the content to an experimental directory under JS to make sure that we differentiate it from our regular Javascript content.

```
// Transpiles ESNext to ES5 using Babel
gulp.task('babel', function () {
  return gulp.src('app/es6/**/*.js')
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['stage-0']
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('app/js/experimental'))
    .pipe($.size({
      pretty: true,
      title: 'Babel'
    }));
});
```

[Coffeescript](http://coffeescript.org/) is one of the first transpiled languages that converts to Javascript. It caught my attention because, when it was first released, it did more than Javascript did at the time and it was far more expressive than ES5.

The plugin to install is `gulp-coffee`. The command is

```
    npm install --save-dev gulp coffee
```

and the task looks like this

```
gulp.task('coffee', function () {
  gulp.src('app/coffee/**/*.coffee')
    .pipe($.sourcemaps.init())
    .pipe($.coffee())
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('app/js/'))
      .pipe($.size({
      pretty: true,
      title: 'Coffee'
    }));
});
```

The last language I chose to transpile into ES5 is [Typescript](http://www.typescriptlang.org/). Started as a Microsoft project, Typescript came to my radar when I started hearing the Angular.js team at Google would use it as the prefered (only) scripting language in Angular 2.

Typescript provides functionality beyond that available in ES5. For a good review see [Rise of Typescript?](http://developer.telerik.com/featured/the-rise-of-typescript/)

We need to install `gulp-typescript`, `gulp-tslint` and `tslint` itself with the following command: npm install --save-dev gulp-typescript gulp-tslint tslint

The task looks like below:

```
// EXPERIMENTAL TYPESCRIPT SUPPORT
// Not sure I want to keep it so be warned
// uses  (peer dep of gulp-tslint)
gulp.task('typescript', function () {
  return gulp.src('app/ts/**/*.ts')
    .pipe($.ts({
      noImplicitAny: true,
      out: 'scripts-ts.js',
      target: 'es5'
    }))
    .pipe($.tslint())
    .pipe($.tslint.report("verbose", { emitError: false }))
    .pipe(gulp.dest('app/js'));
});
```

All the transpiled files will be placed in the `js` directory so we can do linting and style shecking. That comes next :)

## Javascript style and Syntax Validation

In the beginning there was [jslint](http://www.jslint.com/) and it was ok. The tool was initially developed by Douglas Crockford (author of [Javascript: The Good Parts](http://shop.oreilly.com/product/9780596517748.do)) and, as most of his work, it’s a love/hate relationship (at least it is for me.) but it was the only tool to check your code against user stupidity so I continued using it both as a command line tool, an extension to [Brackets](http://brackets.io/).

[JSHint](http) is a community driven fork of JSLint. According to the website:

> JSHint is a community-driven tool to detect errors and potential problems in JavaScript code and to enforce your team's coding conventions. It is very flexible so you can easily adjust it to your particular coding guidelines and the environment you expect your code to execute in. JSHint is open source and will always stay this way.

JSHint also works in command line, as a Brackets extension and it’s been my chosen linter for build workflows.

To install the plugin:

```
npm install --save-dev gulp-jshint jshint-stylish
```

The task is farily simple. It runs jshint and then pipes the output to a reporter, `jshint-stylish` to prettyprint the output.

```
gulp.task('js-lint', function () {
  return gulp.src(['gulpfile.js', 'app/js/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
```

[JSCS](http://jscs.info/) is another linter for Javascript. The reason why I use it in addition to JSHint is that works with preset patterns. They are configured in a `.jscsrc`file. I’ve chosen to work with Google’s preset as documented in the [Google Javascript Style Guide](#).

Instal the plugin with

```
npm install --save-dev gulp-jscs
```

The task looks like this:

```
//Run jscs on all file under js
gulp.task('js-style', function () {
  return gulp.src(['app/js/**/*.js'])
    .pipe(jsstyle())
    .pipe($.jscs.reporter())
    .pipe($.size({
      pretty: true,
      title: 'jscs'
    }));
});
```
