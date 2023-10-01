---
title: "Web Content Optimization: CSS Autoprefixer"
date: "2015-10-21"
categories: 
  - "technology"
---

CSS vendor prefixes are both a blessing and a curse.

They are a blessing because, as originally designed, they allow browser vendors to implement new CSS features that were not part of any final specification in a way that could be easily changed when the specification changes or is withdrawn; and, once the specification is finalized, vendors can drop the prefix and developers can use the new properties as they would any other CSS property.

They are a curse because, as good as the theory was, it never really worked that way. The web is littered with prefixed selectors long after the specification in question was finalized. In order to maintain backwards compatibility developers have to do multiple prefixed versions of a property even when the final version has been released.

For example, depending on how far back you need to support browsers, the code for rounded corners look like this:

```css
.round {
  -webkit-border-radius: 12px; 
  -moz-border-radius: 12px; 
  border-radius: 12px;

  /* 
  Prevent background color leak outs 
  See: 
    https://css-tricks.com/almanac/properties/b/border-radius/
    http://tumble.sneak.co.nz/post/928998513/fixing-the-background-bleed
  */
  -webkit-background-clip: padding-box; 
  -moz-background-clip:    padding-box; 
  background-clip:         padding-box;
}
```

We can all agree that doing this kind of repetitive tasks is a pain. Fortunately there are several ways in which we can eliminate the duplication of work. We can create SASS mixins and place holder selectors where we can hardcode the prefixed versions. That would be good for the short term but doesn't address the bloat problem in our CSS... eventually we will no longer need the prefixed versions but the CSS code will still be littered with prefixes that no one but older browsers really need or want.

A second alternative is use tools like Autoprefixer. It is another Node based tool that installs with the NPM command, like so:

```
[23:49:19] carlos@Rivendell npm install -g autoprefixer
```

and provides a command line tool by default. To get and idea of the options available you can use the `autoprefixer --help` command that produces a result like the one below.

```
[23:49:19] carlos@Rivendell typography-sass 16563$ autoprefixer --help
Usage: autoprefixer [OPTION...] FILES

Parse CSS files and add prefixed properties and values.

Options:
  -b, --browsers BROWSERS  add prefixes for selected browsers
  -o, --output FILE        set output file
  -d, --dir DIR            set output dir
  -m, --map                generate source map
      --no-map             skip source map even if previous map exists
  -I, --inline-map         inline map by data:uri to annotation comment
      --annotation PATH    change map location relative from CSS file
      --no-map-annotation  skip source map annotation comment is CSS
      --sources-content    Include origin CSS into map
      --no-cascade         do not create nice visual cascade of prefixes
      --safe               try to fix CSS syntax errors
  -i, --info               show selected browsers and properties
  -h, --help               show help text
  -v, --version            print program version
```

Given a list of browsers to support and a list of CSS files to inspect it will query [Caniuse.com](http://caniuse.com/) data to determine what, if any, vendor prefixes need to be added to your code and will insert those prefixes where appropriate.

Take for example the following CSS code:

```css
a {
  width: calc(50% - 2em);
  transition: transform 1s;
}
```

and running Autoprefixer to add prefixes for the last 2 versions of major browsers using this command:

```
autoprefixer -b "last 2 versions"
```

produces:

```css
a {
  width: calc(50% - 2em);
  -webkit-transition: -webkit-transform 1s;
          transition: transform 1s
}
```

While SASS mixins may be easier to work with if you're just writing CSS; Autoprefixer makes a nice addition to a development toolchain. You don't have to remember what supported browser need an extension for what property, particularly if you consider that different versions of a browser may have different prefixes for a property or none at all.

- [CSS Tricks article](https://css-tricks.com/autoprefixer/)
