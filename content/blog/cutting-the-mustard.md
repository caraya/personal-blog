---
title: "Cutting the Mustard"
date: "2016-04-20"
categories: 
  - "technology"
---

# my take on cutting the mustard

I'm old enough to remember doing some serious browser detection when building pages. We had to detect browsers because they worked different enough (even within different platforms of the same version of a browser.)

Browser detection fell out of favor as standards improved and browser vendors decided to work together instead of against each other. The alternative was feature detection where if you knew the feature you wanted to support you could test for it directly. One of the best examples was working with layers and DHTML. Who remembers code like this:

```javascript
var   isNS = document.layers,
      isIE= document.all,
      isW3C = document.getElementById;

if( isNS ){
  console.log('working with Netscape');
  var myReference = document.layers['divID'];
} else {
  if ( isIE ) {
    console.log('working with old IE')
    var myReference = document.all['divID'];
  } else {
    if (isW3C) {
      console.log('Thank Goodness, working with a modern browser')
      var myReference = document.getElementById('divID');
    }
  }
}
```

Thank goodness, we don't have to do this level of testing but we should still test if a feature is supported before we invest time and resources only to realize it's broken.

The BBC News team coined the term ‘cutting the mustard’ in their 2012 blog post titled [Cutting the Mustard](http://responsivenews.co.uk/post/18948466399/cutting-the-mustard) as a way to detect for a minimal set of features needed for modern user experiences without hurting the experience of those users in older or less capable devices.

We can test for each feature or group them together in functions like my `cutsMustard()` which tests for querySelector and addEventListener support.

The function will return true only if both features are supported.

```javascript
function cutsMustard () {
  return ('querySelector' in document) && ('addEventListener' in window)
 }
```

We can use cutsMustard to test for the features as we develop content. If the function returns true, meaning that the features are supported, we can build an experience that uses those features for our users.

If it doesn't we can then offer a different alternative that relies on older standards or uses jQuery or a polyfill to do the same task. An example of how I would do it is listed below:

```javascript
if (cutsMustard()) {
  console.log('we cut the mustard');
  // use the querySelector and eventListenener in your code
} else {
  console.log('don't cut mustard');
  // offer a core user experience with fallbacks
 }
```

Once we have our basic mustard cut, we can refine our content with additional mustard cuts for features that we need but are beyond the basics of our first mustard cut. For example we can use the test below to see if the browser supports IndexedDB.

Support in iOS is so crappy that we'll add a regular expression test to exclude any iOS device from the supported list. We should further refine the iOS test to make sure that only troublesome versions of iOS are excluded from our support test. That is left as an exercise for the reader :-).

```javascript
function supportsIDB () {
  return ('indexedDB' in window)
    && !(navigator.userAgent.match(/(iPad|iPhone|iPod)/g))
}
```

Once we have all the features that we need to test for defined we can cut the mustard in two ways: We can use tests like we've done so far or we can cut the full mustard by testing everything all at once, like the test below that checks out basic cut mustard and whether the browser supports indexedDB.

This method has the advantage of reducing the number of tests that we have to make to make sure all our features are supported. The disadvantage is that we only do one test and we may miss some additional feature. The test looks like this:

```javascript
if (cutsMustard() && supportsIDB()) {
  // we provide minimum features plus IndexedDB
 } else {
  // we don't provide capabilities needed
}
```

## Functional mustard cut: What type of device are we working on?

Another way to look at feature test is a modified way to detect the user agent visiting our page. Take for example iBooks: We'll use features from the epub3 specification and a bit of string matching manipulation to figure out if our user is coming from iBooks.

In our `isIbooks` function we test if the navigator object has an epubReadingSystem`property. Next we test if`epubReadingSystem.name\`, an epub specific property holding the name of the reader, include the string iBooks.

```javascript
function isIbooks () {
  return (‘epubReadingSystem’ in navigator)
    && (navigator.epubReadingSystem.name.includes('iBooks')
    || (window.iBooks);
}
```

We don't care if we're looking at iBooks in iOS os OSX. If we did (and iBooks in OSX doesn't recognize `navigator.epubReadingSystem.name`) we could use something like this to test for iBooks in OSX (see [https://twitter.com/DanielWeck/status/412669371161784321](https://twitter.com/DanielWeck/status/412669371161784321) and [https://twitter.com/acutebit/status/412679039153762304](https://twitter.com/acutebit/status/412679039153762304) for more information):

```javascript
function isIbooksOSX () {
  return ( window.iBooks
    || ( window.location.href && window.location.href.toLowerCase().indexOf("com.apple.bkagentservice")) )
}
```

We could create other test for each reader and combine them with our basic mustard cut to make sure we target only the device and features we need and do not exclude anyone we shouldn't.
