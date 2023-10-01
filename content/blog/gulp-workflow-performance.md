---
title: "Gulp Workflow: Performance"
date: "2016-03-23"
categories: 
  - "technology"
---

Performance is one of those areas where perception is just as important as reality, particularly in mobile environments where the browser is only part of the equation, you have to take into account how long will it take for the device to wake up, to initiate the wireless connection, and many other thins that are beyond our control as front-end developers.

I used to think that this wasn’t important until I started looking at what the performance does to users perception and engagement with web content.

The [Akamai study](http://www.akamai.com/html/about/press/releases/2009/press_091409.html) released in 2009 concluded that:

- 47% of people expect a web page to load in two seconds or less
- 40% will abandon a web page if it takes more than three seconds to load
- 52% of online shoppers claim that quick page loads are important for their loyalty to a site
- 14% will start shopping at a different site if page loads are slow, 23% will stop shopping or even walk away from their computer
- 64% of shoppers who are dissatisfied with their site visit will go somewhere else to shop next time.

The [Gomez report](http://www.gomez.com/pdfs/wp_why_web_performance_matters.pdf) published in 2010 found that:

- At peak traffic times, more than 75% of online consumers left for a competitor’s site rather than suffer delays
- 88% of online consumers are less likely to return to a site after a bad experience
- Almost half expressed a less positive perception of the company overall after a single bad experience
- More than a third told others about their disappointing experience

Let’s face it. We all want fast web content. Faster sites offer a better user experience (and make more money if that’s what your goal is.)

So what can we do from the front end to make things better. We’ll look at three things

- Inspect our site for performance using Google’s [Page Speed insights](https://developers.google.com/speed/pagespeed/insights/)
- Create multiple images to use with the new `srcset` attribute for progressive images
- Compress the images using `imagemin`

Before we start go to Page Speed insights and run it with the URL you want to test. We’ll use this as our baseline to measure improvement.

## Performance check using Google Page Speed insights

Google has always considered performance, how fast a page loads, important for both desktop and, particularly, mobile. Most of the things we do in this file work towards towards improving performance by reducing the number of network requests we make and decreasing the number of bytes we ask for in any request so we can render our page as fast as possible.

This is particularly important when looking at getting the page’s ‘first paint’. The critical task listed under CSS accomplishes this by putting the CSS we need to render the first screen in the HTML so we don’t have to wait for the network to deliver it.

Google’s Page Speed Insights test for a variety of techniques that will make the page load faster. The full list is at [Page Speed Insight Rules](https://developers.google.com/speed/docs/insights/rules). Google provides a [Get Started with the PageSpeed insights API](https://developers.google.com/speed/docs/insightss/v2/getting-started) guide.

To install the plugin:

```
npm install --save-dev psi
```

There are two tasks that we run with this plugin. One for one for mobile and one for desktop performance.

One last thing: Use the `nokey` option to try PageSpeed insightss as part of your build process. For more frequent use, we recommend registering for your own API key. For more info check the Get Started guide referenced above.

```
// We do separate tests for mobile and desktop.
gulp.task('psi-mobile', function () {
  return $.psi(site, {
    // key: key
    nokey: 'true',
    strategy: 'mobile'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
  });
});

gulp.task('psi-desktop', function () {
  return $.psi(site, {
    nokey: 'true',
    // key: key,
    strategy: 'desktop'
  }).then(function (data) {
    console.log('Speed score: ' + data.ruleGroups.SPEED.score);
  });
});
```

## Compressing Images

Images are a pain in the ass. They make the largest part of any web page and the larger they are the longer we have to wait for our page to download and become visible.

We have two tasks dealing with image compression

Imagemin will compress jpg (using mozilla's mozjpeg), SVG (using SVGO) GIF and PNG images but WILL NOT create multiple versions for use with responsive images (see process-images task below)

To install the plugins run:

```
npm install --save-dev  gulp-imagemin imagemin-mozjpeg imagemin-webp
```

This is the task we’ll run:

```
gulp.task('imagemin', function () {
  return gulp.src('app/images/**/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [$.mozjpeg()]
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({
      pretty: true,
      title: 'imagemin'
    }));
});
```

`process-images` combines a responsive-image generation task with imagemin but will only work with JPG and PNG images (you don't need to generate optimized SVG and GIF is useless at larger resolutions.)

Responsive images make content more responsive by providing alternatives images for different screen sizes and resolutions. We can accommodate Retina displays and devices from phones to that sexy 30 inch Apple display in the same image tag. The task will also create [WebP](https://developers.google.com/speed/webp/) images in addition to JPG and PNG for browsers that support the format.

I wrote about [responsive images](https://publishing-project.rivendellweb.net/learning-about-responsive-images/) in my blog if you’re interested in the details of how to create the `img` and `srcset` tags needed for responsive images.

This plugin has an unusual requirement. It needs `sharp` to be installed which in turn requires a library to be installed in your system. On my Mac using homebrew I ran this command

```
brew install homebrew/science/vips --with-imagemagick --with-webp
```

For other operating systems check the [Sharp Documentation](http://sharp.dimens.io/en/stable/) for instructions.

To install the plugin:

```
npm install --save-dev  gulp-responsive 
```

The task below seems complex but it is not. Based on the content of the `img` directory it will create the following images based on resolution and density. I’ve excluded the images under touch as they are already sized for their purpose and we don’t need to do any work with them.

```
gulp.task('processImages', function () {
  return gulp.src(['app/images/**/*.{jpg,png}', '!app/images/touch/*.png'])
    .pipe($.responsive({
      '*': [{
        // image-small.jpg is 200 pixels wide
        width: 200,
        rename: {
          suffix: '-small',
          extname: '.jpg'
        }
      }, {
        // image-small@2x.jpg is 400 pixels wide
        width: 200 * 2,
        rename: {
          suffix: '-small@2x',
          extname: '.jpg'
        }
      }, {
        // image-large.jpg is 480 pixels wide
        width: 480,
        rename: {
          suffix: '-large',
          extname: '.jpg'
        }
      }, {
        // image-large@2x.jpg is 960 pixels wide
        width: 480 * 2,
        rename: {
          suffix: '-large@2x',
          extname: '.jpg'
        }
      }, {
        // image-extralarge.jpg is 1280 pixels wide
        width: 1280,
        rename: {
          suffix: '-extralarge',
          extname: '.jpg'
        }
      }, {
        // image-extralarge@2x.jpg is 2560 pixels wide
        width: 1280 * 2,
        rename: {
          suffix: '-extralarge@2x',
          extname: '.jpg'
        }
      }, {
        // image-small.webp is 200 pixels wide
        width: 200,
        rename: {
          suffix: '-small',
          extname: '.webp'
        }
      }, {
        // image-small@2x.webp is 400 pixels wide
        width: 200 * 2,
        rename: {
          suffix: '-small@2x',
          extname: '.webp'
        }
      }, {
        // image-large.webp is 480 pixels wide
        width: 480,
        rename: {
          suffix: '-large',
          extname: '.webp'
        }
      }, {
        // image-large@2x.webp is 960 pixels wide
        width: 480 * 2,
        rename: {
          suffix: '-large@2x',
          extname: '.webp'
        }
      }, {
        // image-extralarge.webp is 1280 pixels wide
        width: 1280,
        rename: {
          suffix: '-extralarge',
          extname: '.webp'
        }
      }, {
        // image-extralarge@2x.webp is 2560 pixels wide
        width: 1280 * 2,
        rename: {
          suffix: '-extralarge@2x',
          extname: '.webp'
        }
      }, {
        // Global configuration for all images
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 80,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Skip enalrgement warnings
        skipOnEnlargement: false,
        // Strip all metadata
        withMetadata: true
      }]
    })
    .pipe(gulp.dest('dist/images')));
});
```
