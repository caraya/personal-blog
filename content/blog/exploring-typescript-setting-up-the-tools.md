---
title: "Exploring Typescript: Setting up the tools"
date: "2020-08-10"
---

Typescript is an interesting language. It's a typed superset of Javascript that you can compile to usable Javascript, either ES5 or later yearly versions of the language.

Because it's not straight Javascript it requires compilation before it can be used in Node or browsers.

## Using built-in tools to work with Typescript

The easiest way to use Typescript is to install the tool themselves and then run them through NPM scripts we set up in `package.json`.

### Compiling

To compile Typescript we need the Typescript compiler (TSC) that comes bundled with the NPM `typescript` package. To install it run the following command.

```bash
npm i -D typescript
```

To run the compiler add the following line to the scripts section of your `package.json`.

```json
"compile": "tsc ./src/**/*.ts"
```

And run the command with:

```bash
npm run compile
```

This will convert all the files ending with `.ts` under the src directory regardless of how deep they are in the hierarchy.

### Linting

Linting Typescript is a little more complicated than Javascript. We still use [ESLint](https://eslint.org/) to lint and fix our code but we need to make sure that when we initialize the linter we tell it that we'll be working with Typescript so that it installs the appropriate packages.

Run:

```bash
npx eslint --init
```

And make sure that when the installer asks you **Does your project use TypeScript?** you answer yes.

It will then install all the packages needed to lint both JS and TS files.

Add the following lines to the script section of your **package.json**

```json
"lint": "eslint ./src/**/*.ts",
"fix": "eslint --fix ./src/**/*.ts",
```

And run the commands as follows:

To lint run: `npm run lint`.

To lint and fix errors, run: `npm run fix`.

## Using Gulp to work with Typescript

If you use Gulp to run and build other aspects of your project it would make sense to use it to process Typescript as well.

The instructions on the next sections assume that you haven't installed or used Gulp before. If you have, some of these instructions may be redundant.

First, install the Gulp CLI globally, this will give you the `gulp` command to make your life easier.

```bash
npm install -g gulp-cli
```

Inside your project run the following command to install Gulp.

```bash
npm install -D gulp@4
```

Now we're ready to install and work with Typescript.

### Compiling

Before working with Typescript we need to install them. To do so run the following command:

```bash
npm install -D gulp-typescript \
 typescript \
 merge2
```

Once the packages are installed

```js
const gulp = require('gulp');
const ts = require('gulp-typescript');
const merge = require('merge2');

gulp.task('default', function() {
  const tsResult = gulp.src('js/**/*.ts')
    .pipe(ts({
      declaration: true
  }));

  return merge([
    tsResult.dts.pipe(gulp.dest('dist/js/definitions')),
    tsResult.js.pipe(gulp.dest('dist/js/js'))
  ]);
});
```

### Linting

Linting Typescript can be a little hard to understand. We still use [ESLint](https://eslint.org/) with Typescript presets. There used to be a TSLint application but the creators decided to merge their work with ESLint.

```bash
npm i -D @typescript-eslint/eslint-plugin \
@typescript-eslint/parser \
gulp-eslint eslint
```

We add the require statement at the top of the file, along with the other declarations.

```js
const eslint = require('gulp-eslint');
```

We then add a task to lint our files. Because it uses the ESLint configuration that we created when working on setting up the command line, there is no need to configure the Gulp task itself.

One way to do it may look like this:

```js
gulp.task('lint', function () {
  return gulp.src(['./src/**/*.ts'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
```

And that's it, we now have a working process to compile and lint Typescript files using NPM and a build system (Gulp in this case).

We'll now move to talk about the language itself in the next post.
