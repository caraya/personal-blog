---
title: "Web Content Optimization: CSS Critical Path"
date: "2015-10-26"
categories: 
  - "technology"
---

> Optimizing the critical rendering path is critical for improving performance of our pages: our goal is to prioritize and display the content that relates to the primary action the user wants to take on a page. Ilya Grigorik ([Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/index?hl=en))

The sad truth is that we've become obsessed with speed and how fast does a page load and, for a fast page load, we need to know what to load when. "Above the fold" is a concept inherited from printed media. In the context of web design/development:

> Above the fold is also used in website design (along with "above the scroll") to refer to the portion of the webpage that is visible without scrolling.\[1\] As screen sizes vary drastically\[2\] there is no set definition for the number of pixels that define the fold. This is because different screen resolutions will show different portions of the website without scrolling. Further complicating matters, many websites adjust their layout based on the size of the browser window, such that the fold is not a static feature of the page. A 2006 study by Jakob Nielsen found that 77% of visitors to a website do not scroll,\[3\] and therefore only see the portion of the website that is above the fold. There has been considerable controversy about this finding with other broad studies finding the 76% of visitors scrolled vertically to some extent\[4\] and 22% of visitors scroll to the bottom of the webpage.\[5\] Most web design advice available today encourages designers to place important information at the top of the website, but to prioritize usability and design.\[6\]\[7\]\[8\] From [Wikipedia](https://www.wikiwand.com/en/Above_the_fold)

So not only we have to worry about creating a fast experience (or one that appears fast, at least) but we also need to worry about how to accomplish this in devices that are as diverse as an iPhone 3, a Samsung Note 5 or a 27 in iMac Retina desktop computer.

We'll worry about the what first, then we'll look at the how and, finally, we'll explore some ways to automate the process as part of a build toolchain.

## What is Critical Path for Web Dev.

To put it simply Critical Path in the context of web development are all the assets that we need to load the above the fold section of the document we are working on or the user is viewing. We then put those asses inline inside the HTML document.

By doing this we speed up the load of the page (or at least the perceived page load speed) because the browser no longer has to go into the network to fetch the resource.

#### How do we build the Critical Path CSS

**Command Line**

Penthouse provides a command line tool that works in tandem with Phantom.js to generate the critical path CSS. However when I tested it, the resulting critical path css file was truncated and I couldn't figure out why it truncated it.

There is also discussion about removing the standalone command tool altogether so I won't go into further details. If you're interested you can [grab it from Github](https://raw.githubusercontent.com/pocketjoso/penthouse/master/penthouse.js)

**Build System**

I use Grunt as my build system so it makes sense that I'll go with that to build my Critical Path CSS. I use the [Critical CSS plugin](https://github.com/bezoerb/grunt-critical) for Grunt which takes care of creating the Critical Path CSS and then inlining it into the page for me.

Once the plugin is installed you can add a task to your `Gruntfile.js` like this:

```javascript
module.exports = function (grunt) {
  grunt.initConfig({
    critical: {
      typography: {
        options: {
          base: './',
          css: [
            'css/main.css'
          ],
          width: 1200,
          height: 800
        },
        src: 'typography.html',
        dest: 'dist/typography.html'
      }
    }
  });
}
```

This will take the CSS necessary to render the dimensions indicated (1200 x 800 in this case) and insert in the document, along with scripts to load the rest of the content asynchronously.

Inlining the CSS for our 'above the fold' content will speed up the display of the page, even as it downloads the rest of the content. From a user's perspective the page will have already loaded and scrolling down will just show the rest of it.

## Links and Resources

- [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/index?hl=en) (Google)
- [Authoring Critical Fold CSS](https://css-tricks.com/authoring-critical-fold-css/) (CSS Tricks)
- [How we make RWD sites load fast as heck](https://www.filamentgroup.com/lab/performance-rwd.html) (Filament Group)

Tools:

- [grunt-criticalcss](https://github.com/filamentgroup/grunt-criticalcss)
- [penthouse](https://github.com/pocketjoso/penthouse)
- [critical](https://github.com/addyosmani/critical)
- [grunt-ctirical](https://github.com/bezoerb/grunt-critical)
