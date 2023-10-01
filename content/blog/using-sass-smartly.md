---
title: "Using SASS smartly"
date: "2013-12-18"
categories: 
  - "technology"
  - "tools-projects"
---

This is a continuation to my earlier post on SASS: [SASS, SCSS and Modular Design](https://publishing-project.rivendellweb.net/sass-scss-css-and-modular-design/). This presents new ideas and more advanced mixins, tools and concepts.

## During development, watch what you're doing

An additional parameter to the SASS command line tool allows you to watch files for changes and then automatically recompile them. This reduces the commands that you have to type at the terminal and it makes it easier to track changes. The command I use to watch the folder containing my SASS is:

```
sass \
  --scss \ # tells SASS that we're using the SCSS syntax
  --update \ # compile the files to CSS
  --style expanded \ # use the expanded SASS/SCSS syntax
  --line-numbers \ # prints originating SCSS file and line number for debugging
  --line-comments \ 
  --watch \ # Makes sass update on change
  scss/:css/ # source SCSS and target CSS folders
```

I usually create a shell script with this command so I don't have to type it over and over.

## Start small, build big

Partials, mixins and SASS extension mechanism give you the ability to create small building blocks that you can then use as needed in larger blocks and applications.

### Extension and placeholder selectors

([http://12devs.co.uk/articles/handy-advanced-sass/](http://12devs.co.uk/articles/handy-advanced-sass/))

Your SASS stylesheets will grow quickly if you use the @include directive; this is unavoidable since it duplicates all the instructions that it is adding to each rule it is used in. Fortunately SASS gives us @extend which will group declarations together instead of copying from one into another

A Basic Example

```
.inline-block {
  display: inline-block; 
  vertical-align: baseline; 
  *display: inline; 
  *vertical-align: auto;
  *zoom: 1;
}

.btn {
  @extend .inline-block;
  padding: 0.5em 1em;
}

.foo {
  @extend .inline-block;
  color: red;
}
```

CSS Output

```
// selectors are grouped
.inline-block, .btn, .foo {
  display: inline-block; 
  vertical-align: baseline; 
  *display: inline; 
  *vertical-align: auto;
  *zoom: 1;
}

.btn {
  padding: 0.5em 1em;
}

.foo {
  color: red;
}
```

Instead of adding the styles from .inline-block into both of our .btn and .foo declarations, the extend directive grouped our classes alongside the .inline-block class, reducing duplication significantly.

### Placeholder Selectors

In the previous example our .inline-block class was also generated amongst the group of declarations and had we not even extended the .inline-block class, it still would have been output in our final CSS file. This is not ideal and is exactly where Placeholder Selectors come in handy.

Any CSS declared within a placeholder will not be compiled in your final CSS file unless it has been extended (think abstract classes in languages like Java or C++). It also means that other developers cannot inadvertently hook onto these styles in their markup. It may be a better and less troublesome method to extend classes to extend placeholders instead.

Placeholders are declared and extended exactly the same way as classes except the dot is replaced with a percentage symbol:

```
%inline-block {
  display: inline-block; 
  vertical-align: baseline; 
  *display: inline; 
  *vertical-align: auto;
  *zoom: 1;
}

.btn {
  @extend %inline-block;
  padding: 0.5em 1em;
}

.foo {
  @extend %inline-block;
  color: red;
}
```

CSS Output

```
.btn, .foo {
  display: inline-block; 
  vertical-align: baseline; 
  *display: inline; 
  *vertical-align: auto;
  *zoom: 1;
}

.btn {
  padding: 0.5em 1em;
}

.foo {
  color: red;
}
```

Now, the selectors are grouped as before but without an .inline-block class in the group. Much better :-)

### Partials are your friends

I hate having to search a large file for a given piece of code. Thankfully I don't have to work with just one file... that's what partials are for. Similar to Ruby on Rails partials, partials in SASS allow you to break large stylesheets based on function, use or any other criteria you want to use.

In order to create a partial just follow your standard development practices and save the file with an underscore as the first character in the file name. To create a partial that contains your base variables, you can name it `_base-vars.scss`. and reference it from all other files using the variables or functionality implemented in the partial.

As discussed elsewhere we can then structure our content with only the partials that we need for a given project. Furthermore we can experiment with ideas and concepts without having to worry about polluting our production code until the experiment is ready to go

## Build variable libraries

Rather than repeat values over and over in many different stylesheets, we can build a library with values of things that are not likely to change or that will repeat themselves multiple times at different levels.

> _Note that this is a suggested way of organizing SASS content, not the only one. Use whatever makes the most sense for you and your project_

Take the following snippet of a variable library:

```
# Link Colors
$magenta: #FF00FF
$blue: #000011
$dark_grey: #eee

# Border Properties
# We have 3 different thickness 
$thin: 1 * 1px
$medium: $thin * 2px
$thick: $thin * 3px
$base_border_style: solid    
$border_color: $dark_grey
```

We can then use all the properties we defined in another round of mixins that will be used directly on our SASS stylesheets, like so:

```
@mixin solid-thin {
  border-width: $thin;
  border-style: solid;
  border-color: $border_color 
}
```

And finally use our solid-thin mixing wherever we need the same characteristics, like so:

```
blockquote {
  @include solid-thin;
}
```

So now if we ever need to change the vaues for any of our solid thin mixin, we only need to change them in one place and then recompile our SASS. The resulting CSS will pick the changes without having to worry if we got them everywhere... we know we did.

## Keep your CSS DRY

A concept that is popular in nthe development community (I think it originated in Rails) is DRY, don't repeat yourself. This is particularly dangerous in large development teams or large codebases.

### Mixins with variable attribute values

**(and default values when we need them)**

Although this is not needed anymore (I believe all browsers now support border radius natively) this was the first time when I realized the power of mixing and how far we can really take them.

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

The code snipet above sets a variable for the default radius (5 pixels) and uses it when we don't provide a value. These two declarations are the same:

```
.case1 {
  @include border-radius();
}

.case1 {
  @include border-radius(5px);
}
```

### Extending our SASS

### Don't reinvent the wheel

I'm all for learning with your own code but there are times when it's worth taking a look at what other people have done. There are several SASS-based frameworks available. The two I refer to the most are:

- [http://bourbon.io](http://bourbon.io)
- [http://compass-style.org](http://compass-style.org)

### Useful Mixins and Tools for your own code

#### Better mediaqueries using @content

Mediaqueries are a pain in the ass. So much repetition and so error prone makes for cranky developers and cranky developers make things not fun for people around them.

In addition to bubbling media queries, we can use the @content variable to feed in the content that is specific to that media query.

```
// breakpoints defined in settings
$break-medium:  31em !default;
$break-large:   60em !default;
$break-x-large: 75em !default;          

@mixin breakpoint($type, $fallback:false, $parent:true) {

  @if $type == medium {
    @media (min-width: $break-medium) {
      @content;
    }
  }

  @if $type == large {
    @media (min-width: $break-large) {
      @content;
    }
  } 

  @if $type == x-large {
    @media (min-width: $break-x-large) {
      @content;
    }
  }

  @if $fallback {
    @if $parent {
      .#{$fallback} & {
        @content;
      }
    } @else {
      .#{$fallback} {
        @content;
      }
    }
  }
}
```

here are some uses for the mixing above:

```
.features__item {
  width: 100%;
}

.foo {
  color: red;
}

.bar {
  color: green;

  // use inside a declaration
  @include breakpoint(medium) {
    color: red;
  }

  @include breakpoint(large, lt-ie9) {
    color: blue;
  }
}

// use outside any declarations
@include breakpoint(medium) {
  .features__item {
    width: 50%;
  }

  .foo {
    color: blue;
  }
}

// remember to tell the fallback that 
// it's not within a declaration
@include breakpoint(large, lt-ie9, false) {
  .features__item {
    width: 25%;
  }

  .foo {
    color: green;
  }
}
```

and the resulting CSS:

```
features__item {
  width: 100%;
}

.foo {
  color: red;
}

.bar {
  color: green;
}

@media (min-width: 31em) {
  .bar {
    color: red;
  }
}

@media (min-width: 60em) {
  .bar {
    color: blue;
  }
}

.lt-ie9 .bar {
  color: blue;
}

@media (min-width: 31em) {
  .features__item {
    width: 50%;
  }

  .foo {
    color: blue;
  }
}

@media (min-width: 60em) {
  .features__item {
    width: 25%;
  }

  .foo {
    color: green;
  }
}

.lt-ie9 .features__item {
  width: 25%;
}

.lt-ie9 .foo {
  color: green;
}
```

#### Clearfix

```
@mixin clearfix() {
    &:before,
    &:after {
        content: "";
        display: table;
    }
    &:after {
        clear: both;
    }
}
```

#### Normalize.css

- [https://raw.github.com/JohnAlbin/normalize.css-with-sass-or-compass/master/\_normalize.scss](https://raw.github.com/JohnAlbin/normalize.css-with-sass-or-compass/master/_normalize.scss)

#### Vertical Rhythm

From: [http://codepen.io/sturobson/pen/jFKlJ](http://codepen.io/sturobson/pen/jFKlJ)

Vertical Rhythm is simply when a body of text is aligned to evenly spaced horizontal lines (think of your lined paper from grade school), making it more cohesive and easier to read.

```
@mixin font-size($size, $keyword: null, $line-height:$doc-line-height) {
// note that the numeric font-size is required to allow the line-height to be generated correctly.

// the addition of the $keyword has been borrowed from this technique - http://seesparkbox.com/foundry/scss_rem_mixin_now_with_a_better_fallback

  @if $keyword{ 
    font-size: $keyword; 
  }
  @else {
    font-size: 0px + $size;
    font-size: $size / $doc-font-size +rem;
  } 
  // because you have to include the font size as a number for the keyword you can still get the line-height 
    
  line-height: round($line-height / $size*10000) / 10000;
  margin-bottom: 0px + $line-height;
  margin-bottom: ($line-height / $doc-font-size)+rem ;
}
```

### Calculate REM size

One of the issues I find with using `em` as my sizing unit is that the values don't remain constant; they are relative to the parent element.

CSS3 introduced a new unit for sizing: `rem`.

> The em unit is relative to the font-size of the parent, which causes the compounding issue. The rem unit is relative to the root—or the html—element. That means that we can define a single font size on the html element and define all rem units to be a percentage of that.

html { font-size: 62.5%; /\* =12px\*/ } 
body { font-size: 1.4rem; } /\* =14px \*/
h1   { font-size: 2.4rem; } /\* =24px \*/

> I'm defining a base font-size of 62.5% to have the convenience of sizing rems in a way that is similar to using px.

Code and idea originally from [Stubornella](http://www.stubbornella.org/content/2013/07/01/easy-peasy-rem-conversion-with-sass/)

```
@function calculateRem($size) {
  $remSize: $size / 16px;
  @return #{$remSize}rem;
}
```

```
@mixin fontSize($size) {
  font-size: $size; //Fallback in px
  font-size: calculateRem($size);
}
```

```
h1 {
  @include fontSize(32px);
}
```

Becomes:

```
h1 {
  font-size: 32px;
  font-size: 2rem;
}
```

#### Build a grid with SASS

- [http://www.creativebloq.com/web-design/create-flexible-grids-using-sass-9134524](http://www.creativebloq.com/web-design/create-flexible-grids-using-sass-9134524)

## Programming-like functions and commands.

> **Please note that the material discussed below is not meant for day to day coding but more for larger projects where you're building the infrastructure for other people to use. Hide as much of these details from your developers :)**

SASS also allows you to create program-like funtionality that we can later include into our SASS files and then into our CSS. Let's take a look at the example below:

```
@function cp($target, $container) {
  @return ($target / $container) * 100%;
}
```

It removes the need to run the same calculation every time we need to calculate an element's width in relation to a container. Say we have a div we call `nav` that we want to be 650px width in a container that is 1000px wide; the sass declaration for this element's width will look like this:

```
#nav {
  width: calc-percent(650px, 1000px);
}
```

and will produce the following CSS:

```
#nav {
  width: 65%;
}
```

### Other control mechanisms

**@if**

The @if directive takes a condition to evaluate and returns the nested styles if the condition is truthy (not false or null).

```
p {
  @if 1 + 1 == 2 { border: 1px solid;  }
  @if 5 < 3      { border: 2px dotted; }
  @if null       { border: 3px double; }
}
```

Since only the first condition is true, the rule is compiled to:

```
p {
  border: 1px solid; 
}
```

Specifying what to return if the condition is falsey can be done using the @else statement. If the @if statement fails, the @else if statements are tried in order until one succeeds or the @else is reached. For example in the following SASS rule:

```
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```

the first else statement is true, so the rule resuls in:

```
p {
  color: green; 
}
```

**@for**

The @for directive iterates over it’s contents a set number of times passing a variable whose value increases for each iteration. For instance, if you find yourself repeating similar CSS you can save yourself a lot of manual work by using a for loop.

The directive has two forms: @for $var from <start> through <end> and @for $var from <start> to <end>. For the form from ... through, the range includes the values of and , but the form from ... to runs up to but not including the value of .

$var can be any variable name, like $i; <start> and <end> are SassScript expressions that should return integers.

```
@for $i from 1 through 3 {
  .item-#{$i} { width: 2em * $i; }
}
```

is compiled to:

```
.item-1 {
  width: 2em; }
.item-2 
  width: 4em; }
.item-3 {
  width: 6em; }
```

If you use the @for $var from <start> to <end> the result will be different. Fore example:

```
$columns: 4;

@for $i from 1 to $columns {
  .cols-#{$i} {
    width: ((100 / $columns) * $i) * 1%;
  }
}
```

This will only iterate 3 times instead of 4 so would not generate our final .cols-4 declaration in the example above.

**@each**

The @each directive takes the item from the list and outputs styles with the listed values

```
$people: Aragorn, Legolas, Gimli, Gandalf;

@each $name in $people {
  .icon-#{$name} {
    background-image: url(/images/icons/#{$name}.png);
  }
} 
```

compiles to:

```
.icon-Aragorn {
  background-image: url(/images/icons/Aragorn.png);
}

.icon-Legolas {
  background-image: url(/images/icons/Legolas.png);
}

.icon-Gimli {
  background-image: url(/images/icons/Gimli.png);
}

.icon-Gandalf {
  background-image: url(/images/icons/Gandalf.png);
}
```

**@while**

The @while statement will continually iterate and output it’s nested styles until it’s condition evaluates to false. This can be used to achieve more complex looping than the @for statement is capable of. For example:

```
$column: 4;

@while $column > 0 {
  .cols-#{$column} {
    width: 10px * $column;
  }
  $column: $column - 2;
}
```

This will only loop twice as we are subtracting 2 from the $column variable in each iteration so when it attempts to loop a third time, $column will not be greater than 0 and the output would be:

```
.cols-4 {
  width: 40px;
}

.cols-2 {
  width: 20px;
}
```
