---
title: "Progressive Subcompact Publications: UI for the performance obsessed"
date: "2016-12-02"
---

As consumers of information we’ve all become more demanding. We want the content faster and we want to be engaged with the content we access online. PSPs should be no different in their performance to traditional web applications.

Rather than provide a one-size-fits-all solution I present some of the data Nielsen first articulated in 1993’s _Usability Engineering _ We’ll use these values to draw some basic conclusions that will start the thinking about performance and how PSPs can work towards achieving those performance goals.

- **0.1 seconds** — Operations that are completed in 100ms or fewer will feel instantaneous to the user. This is the gold standard that you should aim for when optimizing your websites.
- **1 second** — Operations that take 1 second to finish are generally OK, but the user will feel the pause. If all of your operations take 1 second to complete, your website may feel a little sluggish.
- **10 seconds** — If an operation takes 10 seconds or more to complete, you’ll struggle to maintain the user’s attention. They may switch over to a new tab, or give up on your website completely. Of course this depends on what operation is being completed. For example, users are more likely to stick around if they’ve just submitted their card details in the checkout than if they’re waiting to load a product page.
- **16 milliseconds** — Given a screen that is updating 60 times per second, this window represents the time to get a single frame to the screen (1000 ÷ 60 = ~16). People are exceptionally good at tracking motion, and they dislike it when their expectation of motion isn’t met, either through variable frame rates or periodic halting.

We want to get to the site’s first meaningful paint on initial load in as close to 1000 milliseconds as possible.

Animations should take no more than 16 milliseconds in order to reach 60 frames a second.

## Performance Optimizations

We can optimize our resources so that time to first meaningful interaction is as short as possible. First load will also cache the resources needed for our application shell and then dynamically . We want to optimize this to last as little as possible.

This is not just speech for the sake of speech. Take the following graphic (from Soasta’s [Page bloat update: The average web page is more than 2 MB in size](https://www.soasta.com/blog/page-bloat-average-web-page-2-mb/)). How can we minimize the number of resources to load and cache the first time we access a page? How many of these resources can be reused on pages across the site? How can we optimize images to reduce their size?

![](https://www.soasta.com/wp-content/uploads/2015/06/page-bloat-images.png)

We have gotten lazy or, possibly, made the wrong assumptions. The graphic below, also from Soasta’s blog post, show how the size of our web content has changed over the years… and it shows no signs of decreasing.

![](https://www.soasta.com/wp-content/uploads/2015/06/page-bloat-May15-page-composition.png)

I've added an image compression step to my build file based [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) to make sure that I reduce the size of the images on my apps and sites. The Gulp plugin comes bundled with the following **losless** compression tools

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — Compress GIF images
- [jpegtran](https://github.com/imagemin/imagemin-jpegtran) — Compress JPEG images
- [optipng](https://github.com/imagemin/imagemin-optipng) — Compress PNG images
- [svgo](https://github.com/imagemin/imagemin-svgo) — Compress SVG images

The actual Gulp task looks is this:

```javascript
gulp.task('imagemin', function() {
  return gulp.src('src/images/originals/**')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ],
      use: [mozjpeg()]
    }))
    .pipe(gulp.dest('src/images'))
    .pipe($.size({
      pretty: true,
      title: 'imagemin'
    }));
});
```

As usual, your mileage may vary.
