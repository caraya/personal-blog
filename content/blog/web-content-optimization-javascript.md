---
title: "Web Content Optimization: Javascript"
date: "2015-10-28"
categories: 
  - "technology"
---

Optimizing Javascript is nothing more than eeliminating as much white space as we possibly can and, if we want to, to mangle the names of variables down to as few letters as possible. The idea is that the fewer characters the smaller the file will be and the less bandwidth it'll consume and the faster it will transfer and the quicker your scripts will become available and run.

**Be particularly careful when mangling variables. The mangling may have unexpected results**

## Uglify

Uglify was the first command line and build process minimizer I found for Javascript. It will both minimize and mangle scripts. It also provides additional functionality but, for the purpose of this article, we'll only concentrate on compressing and mangling Javascript files.

### Command Line

Uglify's fist version is the command line interface installed through Grunt:

```
[16:30:21] carlos@rivendell books-as-apps 16542$ npm install -g uglifyjs
```

That runs using

```
uglifyjs [input files] [options]
```

You can revert the order (options first and then input files) but you need to put 2 dashes (--) between the options and the input so Uglify will not consider the files part of the input. The command looks like this:

```
uglifyjs --compress --mangle -- input.js
```

## Grunt and other build tools

Uglify has plugins for Grunt, Gulp and other build systems and task runners. The Grunt task below will perform the following steps:

- Combine `video.js` and `highlight.pack.js` into `script.min.js`
- Avoid any mangling of text by setting mangle to false under options
- Create a sourcemap (`script.min.map`)

```javascript
uglify: {
  dist: {
    options: {
      mangle: false,
      sourceMap: true,
      sourceMapName: 'css/script.min.map'
    },
    files: {
      'js/script.min.js': [ 'js/video.js', 'lib/highlight.pack.js']
    }
  }
},
```

## Closure Compiler

Google's [Closure Compiler](https://developers.google.com/closure/compiler/?hl=en) is another tool, written in Java, that allows you to compress your scripts. It is part of the [Closure collection](https://developers.google.com/closure/?hl=en) of tools that facilitate web development.

> Closure Compiler requires a version of Java (either JDK or JRE) to be installed on your system. You can download Java (if not already installed on your system) from [Oracle Technology Network](http://www.oracle.com/technetwork/java/index.html) or the [Open JDK Project](http://openjdk.java.net/install/)

[Compressing Javascript](https://developers.google.com/speed/articles/compressing-javascript) provides a good introduction to using the command line tool to compress your files. According to the documentation the different parameters for compression are:

- Whitespace Only mode simply removes unnecessary whitespace and comments. Selecting "Whitespace Only" mode and pressing compile presents you with a single file of JavaScript with 164K of source code, 28% smaller than the original 227K of source code.
    
- Simple mode is a bit more sophisticated. It optimizes JavaScript function bodies in several ways, including renaming local variables, removing unneeded variables and code, and replacing constant expressions with their final value (such as converting "1+3" to "4"). It, however, won't remove any functions or variables that might be referenced outside your JavaScript. It shrinks the code by 42% from 227K to 132K
    
- Advanced mode does even more sophisticated changes to your code. Try selecting "Advanced" optimizations, compile the code, and look at the results. This code looks much less like your original code; it renames all functions to short names, deletes functions it does not believe are used, replaces some function calls with the function body, and does several other optimizations that shrinks the code even further. Typically, you can't use Advanced Mode on existing JavaScript code without providing some additional information about functions in the code that need to be visible elsewhere and code elsewhere that might be called from within your JavaScript. However, it's worth noting that the Advanced mode cut the code size from 227K to 86K - 62% smaller than the original code. If you'd like this file to load in 1/3 the time of the original, you might find it worthwhile to give Advanced mode all the information to do this change correctly.
    

```javascript
  'closure-compiler': {
    frontend: {
      closurePath: '/src/to/closure-compiler',
      js: 'static/src/frontend.js',
      jsOutputFile: 'static/js/frontend.min.js',
      maxBuffer: 500,
      options: {
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        language_in: 'ECMASCRIPT5_STRICT'
      }
    }
  }
```

## Tools

- [UglifyJS 2](http://lisperator.net/uglifyjs/)
- [Uglify Grunt Task](https://github.com/gruntjs/grunt-contrib-uglify)
- [Uglify Gulp Plugin](https://github.com/gruntjs/grunt-contrib-uglify)
- [Google Closure Compiler](https://developers.google.com/closure/compiler/?hl=en)
- [Closure Compiler Grunt Task](https://github.com/gmarty/grunt-closure-compiler)
- [Closure Compiler Gulp Plugin](https://www.npmjs.com/package/gulp-closure-compiler)
