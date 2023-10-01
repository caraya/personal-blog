---
title: "Gulp Workflow: Introduction"
date: "2016-03-02"
categories: 
  - "technology"
---

I haven't always advocated the need to have a build system but I've always used one: [Make](https://www.gnu.org/software/make/), [Ant](https://www.gnu.org/software/make/), [RAKE](https://www.wikiwand.com/en/Rake_(software)), shell scripts and other tools sought to make compiling code and building projects easier and less error prone by taking human typing and human memory out of the equation.

JavaScript has several task runners for accomplishing the repetitive or tedious tasks. When I started researching task automation with JavaScript the only alternative was [Grunt.js](http://gruntjs.com/) and it was good if a little too verbose.

Over time other tools emerged: [Gulp](http://gulpjs.com/), [Broccoli](http://broccolijs.com/) and [Brunch](http://brunch.io/) among others but I stuck with Grunt because I like the declarative language and the plugin ecosystem.

The more I see Gulp work and the more projects I’m interested and invested in the more motivated I got to start learning it.

Time to get to work.

# Gulp: What it is and how does it work

Gulp is a stream oriented task runner. It solves the problem of repetition. Many of the tasks that web developers find themselves doing over and over on a daily basis can be simplified by becoming automated. Automating repetitive tasks = more time to do non repetitive tasks = more productivity.

It is different that other task runners such as Grunt because it works with streams and allows you to pipe the output of one plugin in a given task to another making it easier to group similar work in the same task.

## The Gulp workflow

This is the basic sequence of events for a Gulp task

1. Define the task that we want to carry out (with or without prerequisites)
2. Load the files to process
3. (Optional) Once files are in the stream, make one or more changes to them. Because Gulp processes the streams in memory, we don't need to write to temporary directories between modifications
4. Write the files (with any modifications) to a specified destination

## The API

Gulp’s built-in API is surprisingly simple. It only has 5 methods:

- **gulp.task**: Define a task
- **gulp.src**: Read files in
- **gulp.dest**: Write files out
- **gulp.watch**: Watch files for changes

Everything else is a plugin or is defined based in one or more of the tasks above.

## Basic example

Make sure you’ve run `npm init` before you run the command below and execute the script. Then you can install `gulp-sass`

```
npm install --save-dev gulp-sass
```

The simplest example is this 2 task demo:

```
// Makes gulp itself available to the build file
var gulp = require('gulp'),
// watch is a built in command in gulp
// Requires the gulp-sass
sass = require('gulp-sass');

gulp.task('sass', function () {
  // Get source files with gulp.src
  return gulp.src('app/sass'/**/*.scss') 
    // Sends it through a gulp plugin
    .pipe(sass())
    // Outputs the file in the destination folder
    .pipe(gulp.dest('app/css')) 
});
```

Running the first task (`gulp sass`) will run the sass command (using libsass) on the files specified in `gulp.src`. You’d have to type the command every time you want to make changes.

```
gulp.task('watch', ['sass']  function(){
  gulp.watch('app/scss/**/*.scss', ['sass']); 
})
```

The second command automates the updates of our SASS content. If we run `gulp watch` Gulp will run the SASS command and then wait for you to make any changes to the SASS files specified in the watch command. If you make any changes

## What this build file will do

These are the tasks we’’ll try to accomplish in this project.

- Transpile ES6, Coffee Script and Typescript to ES5 so it can run in modern browsers without restriction
- Have the tools (Babel) to experiment with future Ecmascript features
- Document the SCSS files and put the result in the sassdoc directory
- Compile SCSS syntax SASS files using Ruby SASS and scss-lint
- Autoprefix and minify the compiled CSS
- Run UNCSS in the CSS/HTML combinations
- Run Imagemin in the image directory
- Create multiple images for `srcset` attributes
- Copy content to the distribution directory
- Publish content to Github Pages
- Serve content locally whether content being developed or content ready for distribution

## Before we start

Before we jump in to a working gulpfile example we need to visit some ancillary topics that impact writing our gulpfiles.

### Globbing

Globs (short for globals) are shortcuts that you use when working with filesystem paths in your Unix or OS X files. Examples of Glob patterns supported by Node’s glob package:

- \* Matches 0 or more characters in a single path element
- ? Matches 1 character
- \[…\] Matches a range of characters, similar to a RegExp range. If the first character of the range is ! or ^ then it matches any character not in the range.
- !(pattern|pattern|pattern) Matches anything that does not match any of the patterns provided.
- ?(pattern|pattern|pattern) Matches zero or one occurrence of the patterns provided.
- +(pattern|pattern|pattern) Matches one or more occurrences of the patterns provided.
- (a|b|c) Matches zero or more occurrences of the patterns provided
- @(pattern|pat\*|pat?erN) Matches exactly one of the patterns provided
- \*\* If a "globstar" is alone in a path portion, then it matches zero or more directories and subdirectories searching for matches. It does not crawl symlinked directories.

These are important as they’ll provide easier ways to declare multiple files and directories as the source of our Gulp tasks

### NPM and package.json

Before we can start working with Gulp we need to set up an NPM package file (`package.json`) to make sure that when we install a plugin we record the action and we only have to do it once.

In the directory where you will start the project type

```
npm init
```

Most of the default values are ok.

This will create the package.json file for us.

As the first installation we'll install gulp itself

```
npm install --save-dev gulp
```

This will install the Gulp plugin and its functionality and make it available for our project. More on that below

Gulp takes an input stream (1 or more files specified in the `gulp.src` attribute to the task function) , piped through 1 or more plugins using `.pipe` and written to a destination file or directory using `gulp.dest`.
