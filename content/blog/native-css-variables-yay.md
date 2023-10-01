---
title: "Native CSS Variables (Yay?)"
date: "2015-11-25"
categories: 
  - "technology"
---

# variables in CSS (yay?)

I've raved about variables in SASS and have used them extensively to create themes and write less SCSS for the same result. Now that browsers other than Firefox support the feature, has it in development (Chrome) or is considering implementation Edge it's time to revisit this.

Another reason to take a peek at variables again is Polymer. The new styling system makes extensive use of CSS variables throughout Polymer elements. If interested in the details, check the [Polymer docs](https://www.polymer-project.org/1.0/docs/devguide/styling.html)

But not everything is rosy as far as variables are concerned. You may be in trouble if you nee to develop for browsers other than Firefox or, when other browsers implement the spec, older browsers where support is not possible as they don't support variables or feature detection using `@support`.

## The Pros

In [What CSS Variables Can Do That Preprocessors Can’t](http://www.sitepoint.com/css-variables-can-preprocessors-cant/) Daniel Imms shows how to leverage variables to do things like theming and style encapsulation outside Shadow DOM

If you don't use pre or post processors for your CSS the following code will let you work with a theme.

```
.red-theme {
  --theme-primary: #801515;
  --theme-secondary: #D46A6A;
  --theme-tertiary: #AA3939;
}

button, a {
  background-color: var(--theme-primary);
  color: var(--theme-secondary);
}

h1 {
  color: var(--theme-tertiary);
}
```

You can also work with multiple themes inside the same document. We can add a second them in the code above so now it looks like this:

```
.red-theme {
  --theme-primary: #801515;
  --theme-secondary: #D46A6A;
  --theme-tertiary: #AA3939;
}

.warm-theme {
 --theme-primary: #CC4A14;
 --theme-secondary: #99583D;
 --theme-tertiary: #40FF40;   
}

button, a {
  background-color: var(--theme-primary);
  color: var(--theme-secondary);
}

h1 {
  color: var(--theme-tertiary);
}
```

And then call it like this.

```
<body class="red-theme">
  <nav class="warm-theme">
<button>Blue button</button>
  </nav>
  <main>
<button>Red button</button>
  </main>
</body>
```

The `nav` element will use the values from the `warm-theme` class where the rest of the document will use the values from `red-theme`.

We can take this even further and define multiple classes that we can switch with Javascript. It would look something like this where each class defines different values for an element's padding and then you use in an element or attribute `.list-item` class.

Whenever we change the class the variable will take its value from the corresponding class.

```
.compact {
  --option-padding: 0.1em 0.2em;
}

.cosy {
  --option-padding: 0.3em 0.6em;
}

.comfortable {
  --option-padding: 0.5em 1em;
}

.list-item {
  padding: var(--option-padding);
}
```

## The cons

The comments in Imms's article outline some of the issues with CSS Variables:

> Things might eventually change, but -- for all their coolness -- I feel like CSS variables are unworkable for the foreseeable future. If my CSS3 border-radius fails in IE8, big deal -- I get square corners. If my CSS variable fails in IE8 I get NO color. That's more than likely a complete and utter site-wide showstopper. I understand more and more browsers will support variables over time, but, as far as I can see, there'll never be an elegant fallback for browsers that don't. And to me that dooms the idea of CSS variables.

[CSS Variables are a bad idea](https://www.aaron-gustafson.com/notebook/css-variables-are-a-bad-idea/)Aaron Gustafson argues that CSS variables are not needed. We have pre-processors that will take care of a lot the work so we can do it without having to resort to a technology that hasn't been widely implemented yet.

If you don't use a processor you have to rely on the cascade to have the browser pick up the last value it supports.... If the browser supports variables it will use the last value defined for an attribute; if it doesn't it'll take the first attribute and ignore everything it doesn't understand.

This duplication not only defeats the purpose of variables but it makes the code brittle and harder to mantain. Changing a value in 1 or 2 or even 3 places is ok but more than that is harder on the memory.

```
.red-theme {
  --theme-primary: #801515;
  --theme-secondary: #D46A6A;
  --theme-tertiary: #AA3939;
}

button, a {
  background-color: #801515;
  background-color: var(--theme-primary);
  color: #D46A6A;
  color: var(--theme-secondary);
}

h1 {
  color: #AA3939;
  color: var(--theme-tertiary);
}
```

IT is still a good deffensive coding strategy but it's far from being optimal.

## Choosing yes or no

For modern browsers [Feature Queries](http://caniuse.com/#feat=css-featurequeries) may be a partial solution to using variables without a pre-processor. They provide for testing facilities for specific code. In the example below we test to see if the browser support a specific variable, if it does then we use variables throughout the stylesheet, if not we code without using variables.

```
@supports ( --theme-primary: #801515; ) {
  .red-theme {
    --theme-primary: #801515;
    --theme-secondary: #D46A6A;
    --theme-tertiary: #AA3939;
  }

  button, a {
    background-color: var(--theme-primary);
    color: var(--theme-secondary);
  }

  h1 {
    color: var(--theme-tertiary);
  }
}

@supports not ( --theme-primary: #801515; ) {
  button, a {
    background-color: #801515;
    color: #D46A6A;
  }

  h1 {
    color: #AA3939;
  }
}
```

For browsers that do not support either variables or feature queries it will ignore all the code it doesn't understand and use those that it can understand.

Are we keeping our code DRY? I believe so... even though we have to work with multiple versions of rules and values we avoid writing multiple stylesheets for the same result. The snippet above will work for all modern browsers that support variables and feature queries, browsers that don't support feature queries and those older browsers that will not support modern CSS.
