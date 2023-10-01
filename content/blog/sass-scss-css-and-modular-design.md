---
title: "SASS, SCSS, CSS and Modular Design"
date: "2013-10-15"
categories: 
  - "design"
  - "technology"
  - "tools-projects"
---

## What is SASS?

SASS, syntactically aware style sheet, is a CSS pre-processor and scripting language that allows you flexibility in creating your CSS rules. It provides several programmatic tools to make CSS creation easier.

The language is a superset of CSS3, allowing you to create the same CSS that you do by hand but with many additional features.

## Install SASS

SASS is a Ruby-based command line utility gem. As such it requires Ruby and the Ruby Gems to be installed on your system. Mac and most Linux distributions come with both programs already installed. Windows users can use the [Ruby Installer](http://rubyinstaller.org/) available from Ruby Forge.

Once Ruby and Ruby Gems are installed you can run the following command:

```
$ gem update --system
$ gem install sass
```

## Run SASS from the command line

The best way to work with SASS is to run it from the command line (terminal on Linux and Macintosh, Command on Windows). Assuming SASS was installed as explained above with a command like the following:

```
$ sass \
--update \
--scss \
--style expanded 
--line-numbers --line-comments \
file.scss
```

This command does the following:

- **\--update** tells sass that we're interested in updating the resulting CSS file.
    
- **\--scss** indicates that we are using the SCSS syntax on the source file(s)
    
- **\--style expanded** tells SASS to use the expanded style for the resulting CSS. SASS has 4 styles: nested ( the default), compact, compressed, or expanded.
    

I normally use the expanded style as it makes the CSS result easier to read by me and by anyone else who may be working on the project with me.

- **\--line-numbers** and **\--line-comments** will inset comments regarding the source file and the line number in the original source file for each of your CSS declarations. This makes troubleshooting your SCSS files easier.
    
- **file.scss** is our driver file for the project.
    

There is another option, particularly useful during development. You can have SASS watch either a file or a directory for changes and automatically

```
$ sass \
--scss \
--style expanded 
--line-numbers --line-comments \
--watch input-dir:output-dir
```

The only difference is the **\--watch input-dir:output-dir** which tell SASS both the input directory and the output directory separated by a colon (`:`) and to update the corresponding CSS files every time a file changes in the input directory.\`

## Are SASS and SCSS the same?

SASS is the original syntax for the language, developed along similar lines to the HAML project. The SASS syntax eliminates a lot of the complexities of CSS; You don't need to use `{}` to begin or end a block, you don't need `;` to finish statements in CSS blocks.

SCSS (Sassy CSS) is a separate dialect or syntax for SASS and it's the one we will cover in this document. It is fully compatible with CSS (all valid CSS documents are valid SCSS documents) and it provides an easier entry point to SASS for people who are already familiar with CSS.

## What makes SASS special?

If you've done any amount of work with CSS you will find that you repeat code and patterns over and over in your stylesheets. I've also wished that there ways to reduce the number of statements you have to write to accomplish a given task.

SASS provides a set of shortcuts, patterns and functions that assist designers and developers when building CSS content

### Variables

Rather than having to type the same name or value over and over again, SASS allows you to create variables that you can use throughout your stylesheets. For example we can define our colors as variables and then use the variables wherever we would use the color definition.

```
$red: #cc092f;

/* Link Formatting */

a {
  color: $red;
}
```

The main advantage of variables is that we need to only change one value and then recompile the stylesheet for the changes to be reflected everywhere the variable appeared in the document.

### Nesting

How many times you've found yourself creating CSS like this and then have to remember which elements were you applying the style to.

```
h2 {
  font-size: 36pt;
}

h2 .warning {
  color: #f00;
}

h2 .important {
  font-weight: bold;
}
```

With SASS you can nest the code for your H2 declarations into something that will result in the code above with less typing and a lot more legibility. The SASS code looks like this:

```
h2 {
  font-size: 36pt;
    .warning {
    color: #f00;
    }
    .important {
  font-weight: bold;
    }
}
```

In the example above it's easy to see the result but when you start nesting deeper than two levels you can see how useful this feature is.

### Mixins, parameters and default parameters

One of the most powerful features of SASS are mixins; the ability to insert code in multiple places throughout your stylesheets. For example, you can define a mixin for the border properties of an element:

```
@mixin solid-thin {
  border-width: thin;
  border-style: solid;
}
```

And call it from anywhere in your document using something like:

\`\`

.video video {
  margin: 20px auto;
  border-color: $red;
  @include solid-thin;
}

img {
    margin: 0 auto;
    border-color: $red;
    @include solid-thin;
}

Once again, if we need to make changes we make them where the @mixin declaration is made and it will be reflected everywhere we include the mixin using the @include tag.

You can also use parameters to further modularize the content of your mixin, including the use of default parameter.

```
$radius: 5px !default;

@mixin border-radius($radius) {
  -webkit-border-radius: $radius;
     -moz-border-radius: $radius;
      -ms-border-radius: $radius;
       -o-border-radius: $radius;
          border-radius: $radius;
}
```

and then call it with a value to replace the `$radius` variable or the default of 5px if the a value for the $radius variable is not set.

```
.box {
    @include border-radius(10px);
}
```

You can use mixins to further modularize your code and to make it easier to maintain. The mixins and variables don't need to be included in the same file. We will discuss modularization later in this document.

Another use of mixins is for testing. Rather than write the same piece of code over and over throughout your stylesheets. For example let's say that you're not sure if you want your border to be thin or thick (two predefined values in the CSS standard)

### Inheritance

We've all found ourselves repeating the same CSS fragments over and over again. Look at the example below (and yes, I know it's poor CSS coding, but it will do as an example)

```
.meessage {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: green;
}

.error {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: red;
}

.warning {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
  border-color: yellow;
}
```

By using SASS extension mechanism we can isolate the repeating code in one place and then only code the differences. The code looks like the one below:

```
.meessage {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.success {
  @extend .message;
  border-color: green;
}

.error {
  @extend .message;
  border-color: red;
}

.warning {
  @extend .message;
  border-color: yellow;
}
```

### Mathematical Operations

There are times when we want to do something that requires some sort of calculation to produce a result. Sass has a basic set of math operators like +, -, \*, /, and %. The example below (taken from the [SASS documentation guide](http://sass-lang.com/guide)) calculates percentages for our article and aside tags.

```
.container { width: 100%; }

article[role="main"] {
  float: left;
  width: 600px / 960px * 100%;
}

aside[role="complimentary"] {
  float: right;
  width: 300px / 960px * 100%;
}
```

One thing to note. Whatever we do with calculations needs to be converted to the unit we are working with (percentages in this case) otherwise they will be treated as a string

### Functions

SASS provides a variety of [Functions](http://sass-lang.com/documentation/Sass/Script/Functions.html) that make working with CSS easier.

The functions I use the most are Opacify and Transparentize which change the opacity (transparence level) of a given color without us having to setup special variables or functions to do so.

```
opacify(rgba(0, 0, 0, 0.5), 0.1) 
            => rgba(0, 0, 0, 0.6)
opacify(rgba(0, 0, 17, 0.8), 0.2) 
            => #001

transparentize(rgba(0, 0, 0, 0.5), 0.1) 
            => rgba(0, 0, 0, 0.4)
transparentize(rgba(0, 0, 0, 0.8), 0.2) 
            0=> rgba(0, 0, 0, 0.6)
```

### Enhanced @media and @media queries support

@media directives in SASS behave just like they do in plain CSS, with one extra capability: they can be nested in CSS rules. If a @media directive appears within a CSS rule, it will be pushed up to the top level of the stylesheet, and use all the selectors inside the rule. For example:

```
.sidebar {
  width: 300px;
  @media screen and (orientation: landscape) {
    width: 500px;
  }
}
```

is compiled to:

```
.sidebar {
  width: 300px; }
  @media screen and (orientation: landscape) {
    .sidebar {
      width: 500px; }
}
```

You can also nest media queries on your SASS stylesheets and the selectors will be combined using the and operator on the top level of the resulting CSS file. This SCSS declaration:

```
@media screen {
  .sidebar {
    @media (orientation: landscape) {
      width: 500px;
    }
  }
}
```

is compiled to:

```
@media screen and (orientation: landscape) {
  .sidebar {
    width: 500px; }
}
```

Finally, @media queries can contain Sass Script expressions (variables, functions, and operators) in place of values in the declarations.

### Partials and imports

Partials allow for code modularity. You can create small snippets of SCSS and then call them from another SCSS file.

In order to create the snippets, what SASS calls a fragment, create a normal file but begin the name with an underscore (`_`). This will instruct the SASS compiler (discussed in detail later in this article) to not include the file in the compilation.

Once you have created all the snippets and are happy with the way they look you can create the main file. The instructions for this process will be discussed in the next section, when we talk about the SASS repository project.

## The SASS repository

As I've worked in SASS I've developed a series of snippets and partial files to make my life easier and to share them with the #eprdctn community and other interested parties. The snippets live in their own [github repository](https://github.com/caraya/sass-repo/) which you can clone and send pull requests to.

The idea is that, as we develop new concepts or ideas we can build our partials and share them to get feedback and suggestions for improvements.

### How do the snippets work

Partials (also known as snippets) are full SCSS files that are not processed directly when converting the files to CSS but are included on a master file that I refer to as driver using the `@import` command as shown in the example below, under build index file.

Note that the SCSS files are only referenced by name, not by the full name + extension.

When running the driver file through SASS, it will take each of the partials and add their content to the file that imported them.

### Creating your own

In order to create a partial file just write it out as you would any other SCSS stylesheet but name it with an underscore (`_`) as the first character of the file name; \_toc.scss or \_images.scss.

### Build index file

Once you have your fragments you can add them to your main file (what I call index or driver) using the @import command. The example below will add the content of each partial file in the order they appear in the driver file.

```
/*
Example of a driver SCSS file. Only this file will get processed when we run the SASS command line tool. It will call all the partials as they are found.
*/

@import "_reset";
@import "_multimedia";
@import "_headings";
@import "_lists";
@import "_columns";
@import "_marginalia";
@import "_toc";
@import "_images";
@import "_footnotes";
```

### Compile Stylesheets

Once you have created your fragments and drivers it is time to compile the SASS files into your final CSS; just like we did when compiling a single SCSS file.

```
$ sass \
--update \
--scss \
--style expanded 
--line-numbers --line-comments \
file.scss
```

File.scss in this case is our driver. The fragments will be incorporated in to the driver file in source order.

## What we didn't cover

There is more to SASS than what we've covered so far. These areas are not essentials for beginners, or I haven't figured out how they are essential.

### The Compass framework

The compass framework uses SASS to provide tools and utilities to make it easier to work with CSS in your web sites or applications. As part of the utilities it provides a large set of functions to augment those provided by the default SASS installation.

It is installed separately from SASS using rubygems

```
gem update --system
gem install compass
```

It may need to be installed as an administrator on OS X and Unix systems.

As interesting as it seems, I have yet to find a compelling enough reason to move to Compass from 'plain' SCSS.

One of the biggest drawbacks of compass, in my opinion, is that it requires you to start everything from scratch with its own directory structure; not optimal if you're moving an existing project to the framework. The SASS documentation states that as of SASS 3.1.0 _Compass users can now use the --compass flag to make the Compass libraries available for import. This will also load the Compass project configuration if run from the project root._ I have yet to test it.

Some typographical mixins may convince me it's worth to switch.

## Programming-like functions

In addition to the functions discussed above, SASS 3.1.0 introduces functions directly into SCSS files. In the example below (Taken from the [SASS documentation page](http://sass-lang.com/documentation/file.SASS_CHANGELOG.html#sassbased_functions)) you can see an example of what these functions look like:

```
$grid-width: 40px;
$gutter-width: 10px;

@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}

#sidebar { 
    width: grid-width(5); 
}
```

SASS functions allow us to be even more flexible in our stylesheets by introducing our own logic to the resulting CSS code.

## The experiment continues

I'll post more as I continue to play and experiment with SASS and related tools.

Stay tuned :)
