---
title: "Incorporating accessibility evaluation into your build process"
date: "2017-05-08"
---

I have to admit that I don't pay as much attention to accessibility as I should. I don't have enough of an audience to merit warranting the extra work that installing accessibility tools and running the tests periodically entail. But what if I could run the accessibility tests every time I run my build process? Then it would only be an issue of acting on the accessibility suggestions and that's a lot easier than running the tests.

While at Smashing Conference I talked to one of the presenters and discussed the possibility of building a skeleton build system that contained some of the most often used task, **and accessibility and a way to test if your gulp plugins are out of date or present a security risk**.

This post presents the accessibility part of the build system and shows how you could incorporate accessibility evaluation into your Grunt or Gulp based system. If you use other task runners or build systems that you'd want to see incorporated into this post or in an update please send me the code... I'll be happy to add it.

## What Tool?

I've chosen to work with [AxeCore](https://github.com/dequelabs/axe-core) from [Deque](https://www.deque.com/) for a number of reasons:

- It's open source and the code is available on Github for review and extensions if needed
- There are plugins for Gulp and Grunt
- If needed there are also extensions for Firefox and Chrome
- It's actively supported and promoted by the Deque team

## Strategy

The idea behind using a build system is to automate the tedious tasks involved in front-end development. Using Axe Core and gulp-axe-webdriver we add accessibility to the list of t hings we automate. One way to run the system would be like this:

1. Build the web content
2. Configure your build system to run Axe Core on the directories containing your build
3. Review the report
4. Make changes and run the report again as needed

## What build system?

Build system selection is a touchy subject, almost up there with Mac versus PC and Coke versus Pepsi. I began using Grunt and later, because of Polymer, moved to Gulp. Fortunately Axe-core provides plugins for both.

If you're using a different build system or task runner I'll assume that you know what you're doing or know where to get help with issues you may encounter.

Now here we go.

### Gulp

[Gulp](http://gulpjs.com/) is a stream-based build system and it's easier to configure than Grunt and, possibly, others. If there is no plugin available you can run the tool directly from within a Gulp task.

Fortunately we don't have to do that, there is a plugin (`gulp-axe-webdriver`) available to use. We'll explore the process of configuring Gulp, adding gulp-axe-webdriver, creating a task with the plugin and running it to generate results.

#### Installation and configuration

This section assumes that you haven't installed and configured Gulp before. We'll work on a sample project to illustrate how this works. Note that the commands are geared towards OS X and Linux, where necessary I'll add the Windows commands in a separate section.

Before proceeding make sure that you install Node from the [Node website](https://nodejs.org/en/) if you haven't already. This installer provides Node itself and the NPM package manager.

```bash
// 1
mkdir axe-project
// 2
cd axe-project

// 3
npm init --yes

// 4
npm install -g gulp
// 5
npm install --save-dev gulp gulp-axe-webdriver
```

1. Make a directory
2. Change to the directory you just created
3. Initialize an empty NPM repository using defaults automatically. This will create the project's `package.json` file
4. Install the Gulp package globally to make the gulp command globally available, this we can run gulp directly form the command line
5. Install Gulp and gulp-axe-webdriver for the project as development dependencies (with the `--save-dev` parameter). This will write the files and versions to the package.json file

#### The gulpfile

```javascript
const gulp = require('gulp');
const axe = require('gulp-axe-webdriver');

// AXE CORE A11Y Tests
gulp.task('axe', done => {
  let options = {
    saveOutputIn: './a11yReport.json',
    browser: 'phantomjs',
    urls: ['build/**/*.html']
  };
  return axe(options, done);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['axe']);
```

### Grunt

This section assumes that you haven't installed and configured Grunt before. We'll work on a sample project to illustrate how this works. Note that the commands are geared towards OS X and Linux, where necessary I'll add the Windows commands in a separate section.

Before proceeding make sure that you install Node from the [Node website](https://nodejs.org/en/) if you haven't already. This installer provides Node itself and the NPM package manager.

#### Installation and configuration

```bash
// 1
mkdir axe-project
// 2
cd axe-project

// 3
npm init --yes

// 4
npm install -g grunt-cli
// 5
npm install --save-dev grunt grunt-axe-webdriver
```

1. Make a directory
2. Change to the directory you just created
3. Initialize an empty NPM repository using defaults automatically. This will create the project's `package.json` file
4. Install the Gulp package globally to make the grunt command globally available, this we can run gulp directly form the command line
5. Install Grunt and grunt-axe-webdriver for the project as development dependencies (with the `--save-dev` parameter). This will write the files and versions to the package.json file

#### The gruntfile

```javascript
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    axe: {
      your_browser_target: {
        // Target-specific file lists and/or options go here.
        options: {
        },
        // The default value is an empty array. 
        // At least one URL needed to complete the task.
        urls: [],
        dest: "output.json",
        junitDest: "output.xml"
      },
    }
  });

  // Load the plugin that provides the "axe-webdriver" task.
  grunt.loadNpmTasks('grunt-axe-webdriver');

  // Default task(s).
  grunt.registerTask('default', ['axe']);

};
```

## Reading and understanding the results

Both Gulp and Grunt produce JSON output that we can further process or read as it is.

```
[{
    "violations": [{
        "id": "button-name",
        "impact": "critical",
        "tags": [
            "wcag2a",
            "wcag412",
            "section508",
            "section508.22.a"
        ],
        "description": "Ensures buttons have discernible text",
        "help": "Buttons must have discernible text",
        "helpUrl": "https://dequeuniversity.com/rules/axe/2.1/button-name?application=webdriverjs",
        "nodes": [{
            "any": [{
        "id": "non-empty-if-present",
        "data": null,
        "relatedNodes": [],
        "impact": "critical",
        "message": "Element has a value attribute and the value attribute is empty"
                }, {
        "id": "non-empty-value",
        "data": null,
        "relatedNodes": [],
        "impact": "critical",
        "message": "Element has no value attribute or the value attribute is empty"
                }, {
        "id": "button-has-visible-text",
        "data": "",
        "relatedNodes": [],
        "impact": "critical",
        "message": "Element does not have inner text that is visible to screen readers"
                }, {
        "id": "aria-label",
        "data": null,
        "relatedNodes": [],
        "impact": "critical",
        "message": "aria-label attribute does not exist or is empty"
                }, {
                    "id": "aria-labelledby",
                    "data": null,
                    "relatedNodes": [],
                    "impact": "critical",
                    "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty or not visible"
                }, {
                    "id": "role-presentation",
                    "data": null,
                    "relatedNodes": [],
                    "impact": "moderate",
                    "message": "Element's default semantics were not overridden with role=\"presentation\""
                }, {
                    "id": "role-none",
                    "data": null,
                    "relatedNodes": [],
                    "impact": "moderate",
                    "message": "Element's default semantics were not overridden with role=\"none\""
                }
            ],
            "all": [],
            "none": [{
                "id": "focusable-no-name",
                "data": null,
                "relatedNodes": [],
                "impact": "serious",
                "message": "Element is in tab order and does not have accessible text"
            }],
            "impact": "critical",
            "html": "<button class=\"Header-button Header-navToggle\" data-action=\"toggle-sidebar\">",
            "target": [
                "#frame > .Frame-header > .Header > .Header-button.Header-navToggle"
            ]
        }]
    }]
}]      
```

This example addresses one of the Rules in Axe Core related to button's text. As you can see the JSON is not easy to parse it without help. It's a very good idea to convert the JSON file to HTML or another format that is easier to read and understand

The Axe Core project provides a set of Handlebars templates and tools to convert the JSON file into readable HTML but, sadly, it's beyond my understanding of how to make it work right now. If interested the files are explained in the [HTML Handlebars document](https://github.com/dequelabs/axe-core/blob/develop/doc/examples/html-handlebars.md). I'm working on figuring out how to process the JSON file to convert it to human readable HTML.

## Why bother?

I can hear you saying "this is too much work" and "why should I be the one doing this?" The truth is that accessibility is everyone's responsibility and automating the process in its earliest build phase makes it easier to solve the problem.

Is this the only solution... not, it isn't. Your team may implement additional accessibility tools and evaluations but this is a good initial assessment and orientation for what fixes to make.
