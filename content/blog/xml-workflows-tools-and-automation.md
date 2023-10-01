---
title: "XML Workflows: Tools and Automation"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

Because we use XML we can't just dump our code in the browser or the PDF viewer and expect it to appear just like HTML content.

We need to prepare our content for conversion to PDF before we can view it. There are also front-end web development best practices to follow.

This chapter will discuss tools to accomplish both tasks from one build file.

## What software we need

For this to work you need the following software installed:

- Java (version 1.7 or later)
- Node.js (0.10.35 or later)

Once you have java installed, you can install the following Java packages

- [Saxon](http://sourceforge.net/projects/saxon/files/latest/download?source=files) (9.0.6.4 for Java)

A note about Saxon: OxygenXML comes with a version of Saxon Enterprise Edition. We'll use a different version to make it easier to use outside the editor.

Node packages are handled through NPM, the Node Package Manager. On the Node side we need at least the `grunt-cli` package installed globally. TO do so we use this command:

```bash
$ npm install -g grunt-cli
```

The -g flag will install this globally, as opposed to installing it in the project director.

Now that we have the required sotfware installed we can move ahead and create our configuration files.

## Optional: Ruby, SCSS-Lint and SASS

The only external dependencies you need to worry about are Ruby, SCSS-Lint and SASS. Ruby comes installe in most (if not all) Macintosh and Linux systems; an [installer for Windows](http://rubyinstaller.org/) is also available.

SASS (syntactically awesome style sheets) are a superset of CSS that brings to the table enhancements to CSS that make life easier for designers and the people who have to create the stylesheets. I've taken advantage of these features to simplify my stylesheets and to save myself from repetitive and tedious tasks.

SASS, the main tool, is written in Ruby and is available as a Ruby Gem.

To install SASS, open a terminal/command window and type:

```bash
$ gem install sass
```

If you get an error, you probably need to install the gem as an administrator. Try the following command

```bash
$ sudo gem install sass
```

and enter your password when prompted.

SCSS-Lint is a linter for the SCSS flavor of SASS. As with other linters it will detect errors and potential erors in your SCSS style sheets. As with SASS, SCSSLint is a Ruby Gem that can be installed with the following command:

```bash
$ sudo gem install scss-lint
```

The same caveat about errors and installing as an administrator apply.

> Ruby, SCSS-Lint and SASS are only necessary if you plan to change the SCSS/SASS files. If you don't you can skip the Ruby install and work directly with the CSS files If you want to peek at the SASS source look at the files under the scss directory.

## Installing Node packages

Grunt is a Node.js based task runner. It's a declarative version of Make and similar tools in other languages. Since Grunt and it's associated plugins are Node Packages we need to configure Node.

At the root of the project there's a `package.json` file where all the files necessary for the project have already been configured. All that is left is to run the install command.

```bash
npm install
```

This will install all the packages indicated in configuration file and all their dependencies; go get a cup of coffee as this may take a while in slower machines.

As it installs the software it'll display a list of what it installed and when it's done you'll have all the packages.

The final step of the node installation is to run bower, a front end package manager. It is not configured by default but you can use it to manage packages such as jQuery, Highlight.JS, Polymer web components and others.

## Grunt & Front End Development best practices

While developing the XML and XSL for this project, I decided that it was also a good chance to test front end development tools and best practices for styling and general front end development.

One of the best known tools for front end development is Grunt. It is a Javascript task runner and it can do pretty much whatever you need to do in your development environment. The fact that Grunt is written in Javascript saves developers from having to learn another language for task management.

Grunt has its own configuration file (`Gruntfile.js`) one of which is provided as a model for the project.

As currently written the Grunt file provides the following functionality in the assigned tasks. Please note that the tasks with an asterisk have subtasks to perform specific functions. We will discuss the subtasks as we look at each portion of the file and its purpose.

      autoprefixer  Prefix CSS files. \*
             clean  Clean files and folders. \*
            coffee  Compile CoffeeScript files into JavaScript \*
              copy  Copy files. \*
            jshint  Validate files with JSHint. \*
              sass  Compile Sass to CSS \*
            uglify  Minify files with UglifyJS. \*
             watch  Run predefined tasks whenever watched files change.
          gh-pages  Publish to gh-pages. \*
    gh-pages-clean  Clean cache dir
             mkdir  Make directories. \*
          scsslint  Validate \`.scss\` files with \`scss-lint\`. \*
             shell  Run shell commands \*
              sftp  Copy files to a (remote) machine running an SSH daemon. \*
           sshexec  Executes a shell command on a remote machine \*
             uncss  Remove unused CSS \*
              lint  Alias for "jshint" task.
          lint-all  Alias for "scsslint", "jshint" tasks.
          prep-css  Alias for "scsslint", "sass:dev", "autoprefixer" tasks.
           prep-js  Alias for "jshint", "uglify" tasks.
      generate-pdf  Alias for "shell:single", "shell:prince" tasks.
 generate-pdf-scss  Alias for "scsslint", "sass:dev", "shell:single",
                    "shell:prince" tasks.
      generate-all  Alias for "shell" task.

The first thing we do is declare two variables (module and require) as global for JSLint and JSHint. Otherwise we'll get errors and it's not essential to declare them before they are used.

We then wrap the Gruntfile with a self executing function as a deffensive coding strategy.

When concatenating Javascript files there may be some that use strict Javascript and some that don't; With Javascript [variable hoisting](http://code.tutsplus.com/tutorials/javascript-hoisting-explained--net-15092) the use stric declaration would be placed at the very top of the concatenated file making all the scripts underneat use the strict declaration.

The function wrap prevents this by making the use strict declaration local to the file where it was written. None of the other templates will be affected and they will still execute from the master stylesheet. It's not essential for Grunt drivers (Gruntfile.js in our case) but it's always a good habit to get into.

## Setup

```
/*global module */
/*global require */
(function () {
  'use strict';
  module.exports = function (grunt) {
    // require it at the top and pass in the grunt instance
    // it will measure how long things take for performance
    //testing
    require('time-grunt')(grunt);

    // load-grunt will read the package file and automatically
    // load all our packages configured there.
    // Yay for laziness
    require('load-grunt-tasks')(grunt);
```

The first two elements that work with our content are `time-grunt` and `load-grunt-tasks`.

Time-grunt provides a breakdown of time and percentage of total execution time for each task performed in this particular Grunt run. The example below illustrates the result when running multiple tasks (bars reduced in length for formatting.)

```bash
Execution Time (2015-02-01 03:43:57 UTC)
loading tasks      983ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 12%
scsslint:allFiles   1.1s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 13%
sass:dev           441ms  ▇▇▇▇▇▇▇▇▇ 5%
shell:html          1.5s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 18%
shell:single        1.2s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 14%
shell:prince        2.9s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 36%
Total 8.1s
```

Load-grunt-tasks automates the loading of packages located in the `package.json` configuration file. It's specially good for forgetful people like me whose main mistake when building Grunt-based tool chains is forgetting to load the plugins to use :-).

## Javascript

```
    grunt.initConfig({

      // JAVASCRIPT TASKS
      // Hint the grunt file and all files under js/
      // and one directory below
      jshint: {
        files: ['Gruntfile.js', 'js/{,*/}*.js'],
        options: {
          reporter: require('jshint-stylish')
            // options here to override JSHint defaults
        }
      },

      // Takes all the files under js/ and selected files under lib
      // and concatenates them together. I've chosen not to mangle
      // the compressed file
      uglify: {
        dist: {
          options: {
            mangle: false,
            sourceMap: true,
            sourceMapName: 'css/script.min.map'
          },
          files: {
            'js/script.min.js': ['js/video.js', 'lib/highlight.pack.js']
          }
        }
      },
```

JSHint will lint the Gruntfile itself and all files under the js/ directory for errors and potential errors.

\[20:58:14\] carlos@rivendell xml-workflow 13902$ grunt jshint
Running "jshint:files" (jshint) task

Gruntfile.js
  line 9    col 33  Missing semicolon.
  line 269  col 6   Missing semicolon.

  ⚠  2 warnings

Warning: Task "jshint:files" failed. Use --force to continue.

Aborted due to warnings.

Uglify allow us to concatenate our Javascript files and, if we choose to, further reduce the file size by mangling the code (See this [page](http://lisperator.net/uglifyjs/mangle) for an explanation of what mangle is and does). I've chosen not to mangle the code to make it easier to read. May add it as an option for production deployments.

## SASS and CSS

As mentioned elsewhere I chose to use the SCSS flavor of SASS because it allows me to do some awesome things with CSS that I wouldn't be able to do with CSS alone.

The first task with SASS is convert it to CSS. For this we have two separate tasks. One for development (dev task below) where we pick all the files from the scss directory (the entire files section is equivalent to writing `scss/*.scss`) and converting them to files with the same name in the css directory.

```
      // SASS RELATED TASKS
      // Converts all the files under scss/ ending with .scss
      // into the equivalent css file on the css/ directory
      sass: {
        dev: {
          options: {
            style: 'expanded'
          },
          files: [{
            expand: true,
            cwd: 'scss',
            src: ['*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        },
        production: {
          options: {
            style: 'compact'
          },
          files: [{
            expand: true,
            cwd: 'scss',
            src: ['*.scss'],
            dest: 'css',
            ext: '.css'
          }]
        }
      },
```

There are two similar versions of the task. The development version will produce the format below, which is easier to read and easier to troubleshoot (css-lint, discussed below, tells you what line the error or warning happened in.)

```css
@import url(http://fonts.googleapis.com/css?family=Roboto:100italic,100,400italic,700italic,300,700,300italic,400);
@import url(http://fonts.googleapis.com/css?family=Montserrat:400,700);
@import url(http://fonts.googleapis.com/css?family=Roboto+Slab:400,700);
@import url(http://fonts.googleapis.com/css?family=Source+Code+Pro:300,400);
html {
  font-size: 16px;
  overflow-y: scroll;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
}

body {
  background-color: #fff;
  color: #554c4d;
  color: #554c4d;
  font-family: Adelle, Rockwell, Georgia, 'Times New Roman', Times, serif;
  font-size: 1em;
  font-weight: 100;
  line-height: 1.1;
  padding-left: 10em;
  padding-right: 10em;
}
```

The production code compresses the output. It deletes all tabs and carriage returns to produce cod elike the one below. It reduces the file size by eliminating spaces, tabs and carriage returns inside the rules, otherwise both versions are equivalent.

```css
@import url(http://fonts.googleapis.com/css?family=Roboto:100italic,100,400italic,700italic,300,700,300italic,400);
@import url(http://fonts.googleapis.com/css?family=Montserrat:400,700);
@import url(http://fonts.googleapis.com/css?family=Roboto+Slab:400,700);
@import url(http://fonts.googleapis.com/css?family=Source+Code+Pro:300,400);
html { font-size: 16px; overflow-y: scroll; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }

body { background-color: #fff; color: #554c4d; color: #554c4d; font-family: Adelle, Rockwell, Georgia, 'Times New Roman', Times, serif; font-size: 1em; font-weight: 100; line-height: 1.1; padding-left: 10em; padding-right: 10em; }
```

I did consider adding [cssmin](https://github.com/gruntjs/grunt-contrib-cssmin) but decided against it for two reasons:

SASS already concatenates all the files when it imports files from the modules and partials directory so we're only working with one file for each version of the project (html and PDF)

The only other file we'd have to add, normalize.css, is a third party library that I'd rather leave along rather than mess with.

The `scsslint` task is a wrapper for the scss-lint Ruby Gem that must be installed on your system. It warns you of errors and potential errors in your SCSS stylesheets.

We've chosen to force it to run when it finds errors. We want the linting tasks to be used as the developer's discretion, there may be times when vendor prefixes have to be used or where colors have to be defined multiple times to acommodate older browsers.

```
      // I've chosen not to fail on errors or warnings.
      scsslint: {
        allFiles: [
          'scss/*.scss',
          'scss/modules/_mixins.scss',
          'scss/modules/_variables.scss',
          'scss/partials/*.scss'
        ],
        options: {
          config: '.scss-lint.yml',
          force: true,
          colorizeOutput: true
        }
      },
```

Grunt's [autoprefixer](https://github.com/nDmitry/grunt-autoprefixer) task uses the [CanIUse database](http://caniuse.com/) to determine if properties need a vendor prefix and add the prefix if they do.

This becomes important for older browsers or when vendors drop their prefix for a given property. Rather than having to keep up to date on all vendor prefixed properties you can tell autoprefixer what browsers to test for (last 2 versions in this case) and let it worry about what needs to be prefixed or not.

```javascript
      autoprefixer: {
        options: {
          browsers: ['last 2']
        },

        files: {
          expand: true,
          flatten: true,
          src: 'scss/*.scss',
          dest: 'css/'
        }
      },
```

The last css task is the most complicated one. [Uncss](https://github.com/addyosmani/grunt-uncss) takes out whatever CSS rules are not used in our target HTML files.

```
      // CSS TASKS TO RUN AFTER CONVERSION
      // Cleans the CSS based on what's used in the specified files
      // See https://github.com/addyosmani/grunt-uncss for more
      // information
      uncss: {
        dist: {
          files: {
            'css/tidy.css': ['*.html', '!docs.html']
          }
        }
      },
```

This is not a big deal for our workflow as most, if not all, the CSS is designed for the tags and classes we've implemented but it's impossible for the SASS/CSS libraries to grow over time and become bloated.

This will also become and issue when you decide to include third part libraries in projects implemented on top of our workflow. By running Uncss on all our HTML files except the file we'll pass to our PDF generator (docs.html) we can be assured that we'll get the smallest css possible.

We skip out PDF source html file because I'm not 100% certain that Uncss can work with Paged Media CSS extensions. Better safe than sorry.

## Optional tasks

I've also created a set of optional tasks that are commented in the Grunt file but have been uncommented here for readability.

The first optional task is a Coffeescript compiler. [Coffeescript](http://coffeescript.org/) is a scripting language that provides a set of useful features and that compiles directly to Javascript.

I some times use Coffeescript to create scripts and other interactive content so it's important to have the compilation option available.

```
      // OPTIONAL TASKS
      // Tasks below have been set up but are currently not used.
      // If you want them, uncomment the corresponding block below

      // COFFEESCRIPT
      // If you want to use coffeescript (http://coffeescript.org/)
      // instead of vanilla JS, uncoment the block below and change
      // the cwd value to the locations of your coffee files
      coffee: {
        target1: {
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['*.coffee'],
          dest: 'build/',
          ext: '.js'
      },
```

The following two tasks are for managing file transfers and uploads to different targets.

One of the things I love from working on Github is that your project automatically gets an ssl-enabled site for free. [Github Pages](https://pages.github.com/) work with any kind of static website; Github even offers an automatic site generator as part of our your project site.

For the puposes of our workflow validation we'll make a package of our content in a build directory and push it to the gh-pages branch of our repository. We'll look at building our app directory when we look at copying files.

```
      // GH-PAGES TASK
      // Push the specified content into the repository's gh-pages branch
      'gh-pages': {
        options: {
          message: 'Content committed from Grunt gh-pages',
          base: './build/app',
          dotfiles: true
        },
        // These files will get pushed to the `
        // gh-pages` branch (the default)
        // We have to specifically remove node_modules
        src: ['**/*']
      },
```

There are times when we are not working with Github or pages. In this case we need to FTP or SFTP (encrypted version of FTP) to push files to remote servers. We use an external json file to store our account information. Ideally we'd encrypt the information but until then using the external file is the first option.

```
      //SFTP TASK
      //Using grunt-ssh (https://www.npmjs.com/package/grunt-ssh)
      //to store files in a remote SFTP server. Alternative to gh-pages
      secret: grunt.file.readJSON('secret.json'),
      sftp: {
        test: {
          files: {
            "./": "*.json"
          },
          options: {
            path: '/tmp/',
            host: '< %= secret.host %>',
            username: '< %= secret.username %>',
            password: '< %= secret.password %>',
            showProgress: true
          }
        }
      },
```

## File Management

We've taken a few file management tasks into Grunt to make our lifes easier. The functions are for:

- Creating directories
- Copying files
- Deleting files and directories

We will use the mkdir and copy tasks to create a build directory and copy all css, js and html files to the build directory. We will then use the gh-pages task (described earlier) to push the content to the repository's gh-pages branches

```
      // FILE MANAGEMENT
      // Can't seem to make the copy task create the directory
      // if it doesn't exist so we go to another task to create
      // the fn directory
      mkdir: {
        build: {
          options: {
            create: ['build']
          }
        }
      },

      // Copy the files from our repository into the build directory
      copy: {
        build: {
          files: [{
            expand: true,
            src: ['app/**/*'],
            dest: 'build/'
          }]
        }
      },

      // Clean the build directory
      clean: {
        production: ['build/']
      },
```

## Watch task

Rather than type a command over and over again we can set up watchers so that, any time a file of the indicated type changes, we perform specific tasks.

AS currentlly configured we track Javascript and SASS files.

For Javascript files anytime that the Gruntfile or any file under the Javascript directorie we run the JSHint task to make sure we haven't made any mistakes.

For our SASS/SCSS files, any files under the scss directory, we run the sass:dev task to translate the files to CSS.

```
      // WATCH TASK
      // Watch for changes on the js and scss files and perform
      // the specified task
      watch: {
        options: {
          nospawn: true
        },
        // Watch all javascript files and hint them
        js: {
          files: ['Gruntfile.js', 'js/{,*/}*.js'],
          tasks: ['jshint']
        },
        sass: {
          files: ['scss/*.scss'],
          tasks: ['sass:dev']
        }
      },
```

## Compile and Execute

Rather than using Ant, I've settled on Grunt's shell task to run the compilation steps to create HTML and PDF. This reduces teh number of dependecies for our project and makes it easier to consolidate all the work.

We have three different commands:

- html will create multiple html files using Saxon, a Java XSLT processor
- single will create a single html file using Saxon
- prince will create a PDF based on the single html file using PrinceXML

We make sure that we don't continue if there is an error. Want to make sure that we troubleshoot before we get all the resulting files.

```
      // COMPILE AND EXECUTE TASKS
      shell: {
        options: {
          failOnError: true,
          stderr: false
        },
        html: {
          command: 'java -jar /usr/local/java/saxon.jar -xsl:xslt/book.xsl docs.xml -o:index.html'
        },
        single: {
          command: 'java -jar /usr/local/java/saxon.jar -xsl:xslt/pm-book.xsl docs.xml -o:docs.html'
        },
        prince: {
          command: 'prince --verbose --javascript docs.html -o docs.pdf'
        }
      }


    }); // closes initConfig
```

## Custom Tasks

The custom task uses one or more of the tasks defined above to accomplish a sequence of tasks.

Look at specific tasks defined above for specific definitions.

```
    // CUSTOM TASKS
    // Usually a combination of one or more tasks defined above
    grunt.task.registerTask(
      'lint',
      [
        'jshint'
      ]
    )

    grunt.task.registerTask(
      'lint-all',
      [
        'scsslint',
        'jshint'
      ]
    );

    // Prep CSS starting with SASS, autoprefix et. al
    grunt.task.registerTask(
      'prep-css',
      [
        'scsslint',
        'sass:dev',
        'autoprefixer'
      ]
    );

    grunt.task.registerTask(
      'prep-js',
      [
        'jshint',
        'uglify'
      ]
    );

    grunt.task.registerTask(
      'generate-pdf',
      [
        'shell:single',
        'shell:prince'
      ]
    );

    grunt.task.registerTask(
      'generate-pdf-scss',
      [
        'scsslint',
        'sass:dev',
        'shell:single',
        'shell:prince'
      ]
    );

    grunt.task.registerTask(
      'generate-all',
      [
        'shell'
      ]
    );


  }; // closes module.exports
}()); // closes the use strict function
```
