---
title: "Modernizr and Prefix Free"
date: "2013-12-05"
categories: 
  - "technology"
---

As a designer we all hit the point where we want to use a specific feature of HTML5 and you don't know what browsers support what version of the specification in question. This is particulary important when we're asked to support older browsers where the same script we use to trigger a feature may be ignored or have unexpected results.

In the CSS front we have to deal with "prefix hell". In their efforts to be in the bleeding edge of CSS feature development, and to show how the features may work in standard implementations, browser vendors (all of them) have released features under prefix. While cutin dge development is important it is not so important to drive developers crazy trying to remember whether a given browser needs prefix for a given property (sometimes different versions of the same browser will support different syntaxes for the same property) and if we don't code our CSS defensively, we may fnd that as vendors fully support properties, our code may stop working.

That's where Modernizr and Prefix Free come in.

## What are these tools?

These tools are here to make your life and your code easier to manage. They provide features that will, in the end, future proof your

**Modernizr** is a set of three complementary utilities:

- A set of CSS classes added to your page's `html` tag which will let you style your content based on whether a feature is supported by a given browser.
- A set of JavaScript boolean values for each tested property that allow you to branch your code deppending on whether the property is supported in the browser you're using.
- A conditional resource loader that loads resources based on results from tests for the features that you need for your page or app.

**Prefix Free** is a JavaScript library that eliminates the hassle of remembering which vendor supports which CSS property or syntax. It does this by adding the needed prefixes to a CSS stylesheet automatically (using JavaScript behind the scenes). This will also help with having to deal with inconsistencies between browser (I hope) and in future proofing your scripts for when all vendors drop prefixes.

## Why should we use these tools?

From my perspective the main reason to use these tools is to make your workflow more manageable. It makes sense to code JavaScript only if the feature you're testing for is present and to provide a workaround if it is not.

There is also the ability to future proof your JavaScript and CSS. We don't need to do browser detection on our code but rather test and detect the features we are interested in working on. We can style our CSS according to whether a browser supports a given feature rather than do a one-size-fits-all layout... as browser support increases we will be able to eventually eliminate the non supporting CSS code.

There is also the freedom of using a single form of the prefixed content. Prefixfree will intercept the stylesheet and only add prefixes where they are needed.

## Examples

### Modernizr

In CSS we can use Modernize to code for both the browsers that support the features we are trying to work with and for those who don't. Let's take, for example, CSS columns, how to handle them for browsers that support them and how to provide a "graceful degradation" solution for browsers that can't.

```
.csscolumns {
  column-width: 15em;
  column-gap: 2em;          
  column-rule: 4px solid green;
  padding: 5px;
  column-fill: balance;
  height: 400px;
}

.no-csscolumns {
  width: 60%;
  border: 1px solid #000;
}
```

What this will do is for the browsers who support CSS columms (indicated by the .csscolumns class) and provide different styles for those browsers that don't support the feature we are working with (in this case indicated by the .no-csscolumns class)

Modernizr also creates a javascript object, modernizr, and populates with booleans that reflect the features the browser supports or doesn't support. We can test these features with if statements (which we do in the JavaScript example below to test for Canvas support).

```
<script>
  if (Modernizr.canvas) {
    alert("This browser supports HTML5 canvas!");
    // The rest of the code that relies on canvas
    // goes here
  }
  else {
    // Polyfill or code for older browsers goes here
  }
</script>
```

When using JavaScript we can also chaing tests to make sure the browser supports all the features that we need without having to make more than one modernizr.load calls.

```
<script>
  // We are interested in canvas and WebGL 
  if (Modernizr.canvas) && (Modernizr.webgl) {
    alert('Your browser supports canvas and WebGL')
    // The code that relies on either feature goes here
  }
  else {
    // Polyfill or code for older browsers goes here
  }
</script>
```

The final example uses [modernizr.load](http://modernizr.com/docs/#load), also known as [yepnope.js](http://yepnopejs.com/) to conditionally load resources (JavaScript polyfills and associated resources) based on features supported by a given browser. In its simplest form, we use the loader to tell the browser what resources to load:

```
// We call Modernizr.load
  Modernizr.load({
  // and ask it to test if geolocation is supported
  test: Modernizr.geolocation,
  // if it is load the geo.js file (full of geolocation goodness)
  yep: 'geo.js',
  // otherwise tell it to load the polyfill (not so good but 
  // better than  nothing)
  nope: 'geo-polyfill.js'
});
```

In a more complext example we can tell modernizr to test for multiple CSS3 and HTML5 properties, load resources conditionally based on the feature tests and the load resources regardless.

```
// Call Modernizr.load
  Modernizr.load({
    // Ask it for the features that we need on the script
    test: Modenizr.canvas && Modernizr.webgl,
    // These are the scripts we load if the features are supported
    yep: [main.js, support.js, style.css],
    // These are the polyfills and scripts we use when features
    // are not supported.
    nope: [webgl-polyfill.js, canvas-polyfill.js],
    // These resources will be loaded regardless. 
    // This method is also aliased as load: 
    both: analytics.js
  })
```

It may not be the fastest way to load your resources but it is the most flexible and the most user friendly I've found so far. [Require.js](http://requirejs.org/) is definitely more powerful but it imposes requirements on the way you structure your applications/sites.

One last thing. If you've used [HTML5 Boilerplate](http://html5boilerplate.com/) you've probably seen code like this where we load jQuery from a CDN and immediately test whether jQuery is available and if it's not then we load a local copy:

```
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js"></script>
<script>window.jQuery || 
document.write('<script src="js/libs/jquery-1.7.1.min.js">\x3C/script>')</script>
```

You can use Modernizr to duplicate the functionality like so:

```
Modernizr.load([
  {
    // We first load jQuery using CDN
    load: '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.js',
    complete: function(){
      //Once that completes we test if jQuery is available
      if ( !window.jQuery){
        // If it's not available then we load jQuery locally
        Modenizr.load('path/to/local/jquery.min.js')
      }
    }
  },
  {
    // This will wait for jQuery, either remote or 
    // local fallback, to load before executing

    load: 'My-local-jquery-script.js'
  }
]);
```

### Prefix Free

Now that we know what CSS we'll be loading on to our pages, let's make it lighter, shall we?

We use prefix free by loading the following JavaScript in the `<head>` of our page, before any CSS is actually loaded. The head of our document looks like this:

```
<script src='//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js'><script>
  <link rel="stylesheet" href="styles.css">
```

and in our CSS rules, instead of doing:

```
div .background {  
  background: -webkit-gradient(linear, left top, right top, from(#2F2727), color-stop(0.05, #1a82f7), color-stop(0.5, #2F2727), color-stop(0.95, #1a82f7), to(#2F2727));
  -webkit-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
  -moz-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
  -ms-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
  -o-linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
  linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
}
```

we can just do:

```
div .background {  
  background: linear-gradient(left, #2F2727, #1a82f7 5%, #2F2727, #1a82f7 95%, #2F2727);
}
```

And Prefixfree will take care of adding the correct prefixes to the code so we don't have to. Is it perfect? No, of course not.

Lea Verou, Prefix Free's creator lists several shortcomings on the project website

- Prefixing code in @import-ed files is not supported
- Prefixing cross-origin linked stylesheets is not supported, unless they are CORS-enabled ([More information on CORS](http://enable-cors.org/))
- Unprefixed linked stylesheets won’t work locally in Chrome and Opera.
- Unprefixed values in inline styles (in the style attribute) won’t work in IE and Firefox < 3.6.
- Unprefixed properties will not work in Firefox < 3.6.

Also please note that Prefixfree will not overwrite any properties that are already prefixed. If you know you need to work with a given prefixed property you can write it in your style sheet and Prefixfree will ignore the property and associated rule.

## Conclusion

Modeernizr and Prefixfree provide a reasonable workflow for front end development. They simplify your scripts (now it's fine to have multiple scripts because we can load only those we need for a given page in an application) and they make your CSS cleaner and easier to read.
