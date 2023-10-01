---
title: "Web Performance Improvement: The Client Side Of The Equation"
date: "2018-05-16"
---

We've looked at a lot of server-side tricks to reduce the page load and improve users' experience when accessing our content. Now we'll look at client-side client hints and tools to optimize our content.

## Client side resource hints

The basic way to preload a resource is to use the `<link />` element with three attributes:

- `rel` tells the browser the relationship between the current page and the resourced linked to
- `href` gives the location of the resource to preload
- `as` specifies the type of content being loaded. This is necessary for content prioritization, request matching, application of correct content security policy, and setting of the correct Accept request header.

```html
<link rel="preload" href="late_discovered_thing.js" as="script">
```

### Early loading fonts and the crossorigin attribute

Loading fonts is just the same as preloading other types of resources with some additional constraints

```html
<link rel="preload"
      href="font.woff2"
      as="font"
      type="font/woff2"
      crossorigin>
```

You must add a crossorigin attribute when fetching fonts since they are fetched using anonymous mode CORS. Yes, even if your fonts are of the same origin as the page.

The type attribute is there to make sure that this resource will only get preloaded on browsers that support that file type. Only Chrome supports preload and it also supports WOFF2, but not all browsers that will support preload in the future may support the specific font type. The same is true for any resource type you’re preloading and which browser support isn’t ubiquitous.

### Responsive Loading Links

Preload links have a media attribute that we can use to conditionally load resources based on a media query condition.

What’s the use case? Let’s say your site’s large viewport uses an interactive map, but you only show a static map for the smaller viewports.

You want to load only one of those resources. The only way to do that would be to load them dynamically using Javascript. If you use a script to do this you hide those resources from the preloader, and they may be loaded later than necessary, which can impact your users’ visual experience, and negatively impact your SpeedIndex score.

Fortunately, you can use preload to load them ahead of time, and use its media attribute so that only the required script will be preloaded:

```html
<link rel="preload"
      as="image"
      href="map.png"
      media="(max-width: 600px)">

<link rel="preload"
      as="script"
      href="map.js"
      media="(min-width: 601px)">
```

### Resource Hints

In addition to preload and server push, we can also ask the browser to help by providing hints and instructions on how to interact with resources.

For this section, we’ll discuss

- DNS Prefetching
- Preconnect
- Prefetch
- Prerender

#### DNS prefetch

This hint tells the browser that we’ll need assets from a domain so it should resolve the DNS for that domain as quickly as possible. If we know we’ll need assets from example.com we can write the following in the head of the document:

```html
<link rel="dns-prefetch" href="//example.com">
```

Then, when we request a file from it, we’ll no longer have to wait for the DNS lookup. This is particularly useful if we’re using code from third parties or resources from social networks where we might be loading a widget from a `<script>`.

#### Preconnect

Preconnect is a more complete version of DNS prefetch. In addition to resolving the DNS it will also do the TCP handshake and, if necessary, the TLS negotiation. It looks like this:

```html
<link rel="preconnect" href="//example.net">
```

#### Prefetching

This is an older version of preload and it works the same way. If you know you’ll be using a given resource you can request it ahead of time using the prefetch hint. For example an image or a script, or anything that’s cacheable by the browser:

```html
<link rel="prefetch" href="image.png">
```

Unlike DNS prefetching, we’re actually requesting and downloading that asset and storing it in the cache. However, this is dependent on a number of conditions, as prefetching can be ignored by the browser. For example, a client might abandon the request of a large font file on a slow network. Firefox will only prefetch resources when “the browser is idle”.

Since we know have the preload API I would recommend using that API (discussed earlier) instead.

#### Prerender

Prerender is the nuclear option, since it will load all of the assets for a given document like so:

```html
<link rel="prerender" href="http://css-tricks.com">
```

Steve Souders wrote a great explanation of this technique:

> This is like opening the URL in a hidden tab – all the resources are downloaded, the DOM is created, the page is laid out, the CSS is applied, the JavaScript is executed, etc. If the user navigates to the specified href, then the hidden page is swapped into view making it appear to load instantly. Google Search has had this feature for years under the name Instant Pages. Microsoft recently announced they’re going to similarly use prerender in Bing on IE11.

But beware! You should probably be certain that the user will click that link, otherwise the client will download all of the assets necessary to render the page for no reason at all. It is hard to guess what will be loaded but we can make some fairly educated guesses as to what comes next:

- If the user has done a search with an obvious result, that result page is likely to be loaded next.
- If the user navigated to a login page, the logged-in page is probably coming next.
- If the user is reading a multi-page article or paginated set of results, the page after the current page is likely to be next.

## Tools to make your content smaller

These are some of the tools that I use to make my content slimmer, send fewer bytes through the wire and make the bytes I send through the wire load faster.

These are not all the tools that you can use to improve your site's performance. They are the ones I use most frequently. As with many tools, your mileage may vary.

All the tool examples use [Gulp](https://gulpjs.com/). For any other systems, you're on your own.

### UNCSS

[UnCSS](https://github.com/giakki/uncss) takes a CSS stylesheet and one or more HTML files and removes all the unused CSS from the stylesheet and writes it back as CSS.

This is especially useful when working with third-party stylesheets and CSS frameworks where you, as the author may not have control over or may have downloaded the full framework for development and now need to slim it down for production

```javascript
gulp.task('uncss', () => {
  return gulp
    .src('src/css/**/*.css')
    .pipe($.concat('main.css'))
    .pipe(
      $.uncss({
        html: ['index.html']
      })
    )
    .pipe(gulp.dest('css/main.css'))
    .pipe(
      $.size({
        pretty: true,
        title: 'Uncss'
      })
    );
});
```

### Imagemin

[Imagemin](https://github.com/imagemin/imagemin) compresses images in the most popular formats (gif, jpg, png, and svg) to produce images better suited for use in the web.

What I like about Imagemin is that you can configure settings for each image type you're working with.

Note that this uses the older implicit syntax for gulp-imagemin. Newer versions require you to be explicit on what format you're configuring. For the newer syntax check the gulp-imagemin [README](https://www.npmjs.com/package/gulp-imagemin).

```javascript
gulp.task('imagemin', () => {
  return gulp
    .src('src/images/originals/**')
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        use: [mozjpeg()]
      })
    )
    .pipe(gulp.dest('src/images'))
    .pipe(
      $.size({
        pretty: true,
        title: 'imagemin'
      })
    );
});
```

### Critical

Critical above the fold CSS and inline it on your page. This will reduce the load speed of your above the fold content. The example task below will take the above the fold content for all the specified screen sizes and will remove duplicate CSS before inlining it on the head of the page.

```javascript
gulp.task('critical', () => {
  return gulp
    .src('src/*.html')
    .pipe(
      critical({
        base: 'src/',
        inline: true,
        css: ['src/css/main.css'],
        minify: true,
        extract: false,
        ignore: ['font-face'],
        dimensions: [
          {
            width: 320,
            height: 480
          },
          {
            width: 768,
            height: 1024
          },
          {
            width: 1280,
            height: 960
          }
        ]
      })
    )
    .pipe(
      $.size({
        pretty: true,
        title: 'Critical'
      })
    )
    .pipe(gulp.dest('dist'));
});
```

### Generate Responsive Images

One of the biggest pain points of generating responsive images is that we have to create several versions of each image and then add them to the srcset attribute for each image or figure tag.

[gulp-responsive](https://www.npmjs.com/package/gulp-responsive) will help with generating the images, not with writing the HTML. This plugin will let you create as many versions of an image as you need. You can target specific images or, like what I did with this example, target all images in a directory.

```javascript
gulp.task('processImages', () => {
  return gulp
    .src(['src/images/**/*.{jpg,png}', '!src/images/touch/*.png'])
    .pipe(
      $.responsive({
        '*': [
          {
            // image-small.jpg is 200 pixels wide
            width: 200,
            rename: {
              suffix: '-small',
              extname: '.jpg'
            }
          },
          {
            // image-small@2x.jpg is 400 pixels wide
            width: 200 * 2,
            rename: {
              suffix: '-small@2x',
              extname: '.jpg'
            }
          },
          {
            // image-large.jpg is 480 pixels wide
            width: 480,
            rename: {
              suffix: '-large',
              extname: '.jpg'
            }
          },
          {
            // image-large@2x.jpg is 960 pixels wide
            width: 480 * 2,
            rename: {
              suffix: '-large@2x',
              extname: '.jpg'
            }
          },
          {
            // image-extralarge.jpg is 1280 pixels wide
            width: 1280,
            rename: {
              suffix: '-extralarge',
              extname: '.jpg'
            }
          },
          {
            // image-extralarge@2x.jpg is 2560 pixels wide
            width: 1280 * 2,
            rename: {
              suffix: '-extralarge@2x',
              extname: '.jpg'
            }
          },
          {
            // image-small.webp is 200 pixels wide
            width: 200,
            rename: {
              suffix: '-small',
              extname: '.webp'
            }
          },
          {
            // image-small@2x.webp is 400 pixels wide
            width: 200 * 2,
            rename: {
              suffix: '-small@2x',
              extname: '.webp'
            }
          },
          {
            // image-large.webp is 480 pixels wide
            width: 480,
            rename: {
              suffix: '-large',
              extname: '.webp'
            }
          },
          {
            // image-large@2x.webp is 960 pixels wide
            width: 480 * 2,
            rename: {
              suffix: '-large@2x',
              extname: '.webp'
            }
          },
          {
            // image-extralarge.webp is 1280 pixels wide
            width: 1280,
            rename: {
              suffix: '-extralarge',
              extname: '.webp'
            }
          },
          {
            // image-extralarge@2x.webp is 2560 pixels wide
            width: 1280 * 2,
            rename: {
              suffix: '-extralarge@2x',
              extname: '.webp'
            }
          },
          {
            // Global configuration for all images
            // The output quality for JPEG, WebP and TIFF output formats
            quality: 80,
            // Use progressive (interlace) scan for JPEG and PNG output
            progressive: true,
            // Skip enalrgement warnings
            skipOnEnlargement: false,
            // Strip all metadata
            withMetadata: true
          }
        ]
      }).pipe(gulp.dest('dist/images'))
    );
});
```

### Webpack

Webpack (and Rollup and Parcel) are resource bundlers. They will pack together resources to make downloads faster and payloads smaller.

As I documented in [Revisiting Webpack](https://publishing-project.rivendellweb.net/revisiting-webpack/) I don't take advantage of the full Webpack toolkit since most of the processing happens in Gulp before the resources get to Webpack for bundling and I don't feel the need to reinvent the wheel every time I want to work in a project. Before you destroy me on comments or Twitter... this doesn't mean that I won't use Webpack to its fullest if the team or the project warrants it, none of my projects have so far.

Instead, I use Webpack inside Gulp to bundle the resources for my application. I use the same configuration file that I would use for a standalone Webpack-based application but most of the heavy lifting has already been done by the time we get here so we can slim the configuration file to only do Javascript bundling.

```javascript
gulp.task('webpack-bundle', function() {
  return gulp
    .src('src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
});
```

## Summary and final considerations

I realize that and the amount of work we need to put in improving performance is big and that we won't always see the results or that the results will only be small and people won't notice.

But people do notice and they will leave your site if it doesn't load fast enough. According to SOASTA's post [Google: 53% of mobile users abandon sites that take longer than 3 seconds to load](https://www.soasta.com/blog/google-mobile-web-performance-study/)

> 53% of visits to mobile sites are abandoned after 3 seconds. (This corresponds to research we did at SOASTA last year, where we found that [the sweet spot for mobile load times was 2 seconds](https://www.soasta.com/blog/back-to-school-website-performance-monitoring/.)

Whether you want to or not, performance does affect a site's number of visitors and, potentially, the company's bottom line. So please evaluate your site's performance and improve it where you can.

Your users and your boss will be thankful. :)

## Links and Resources

- [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/)
- [Chrome for a Multi-Device World](https://developer.chrome.com/multidevice)
- [Data Saver](https://developer.chrome.com/multidevice/data-compression)
- [New Save-Data HTTP header tells websites to reduce their data usage](https://www.ctrl.blog/entry/http-save-data)
- [Save-Data aware HTTP/2 server push](https://www.ctrl.blog/entry/http2-save-data-push)
- [Speed up with the PageSpeed Modules](https://developers.google.com/speed/pagespeed/module/)
- [Introducing HTTP/2 Server Push with NGINX 1.13.9](https://www.nginx.com/blog/nginx-1-13-9-http2-server-push/)
- [Help Your Users \`Save-Data\`](https://css-tricks.com/help-users-save-data/)
- [Opera Mini](https://www.opera.com/mobile/mini)
- [The need for mobile speed: How mobile latency impacts publisher revenue](https://www.doubleclickbygoogle.com/articles/mobile-speed-matters/)
- [The need for mobile speed (PDF)](https://storage.googleapis.com/doubleclick-prod/documents/The_Need_for_Mobile_Speed_-_FINAL.pdf)
- [Best of 2016: New Google research, measuring SPA and AMP performance, plus 22 mobile stats you should know](https://www.soasta.com/blog/2016-best-web-performance-posts/)
- [Preload Specification](https://w3c.github.io/preload/)
- [HTTP/2 Spec](https://tools.ietf.org/html/rfc7540)
- [Speed Up Sites with htaccess Caching](https://www.askapache.com/htaccess/speed-up-sites-with-htaccess-caching/#Cache-Control_Header)
- [Cache-Control Header](https://www.askapache.com/htaccess/speed-up-sites-with-htaccess-caching/#Cache-Control_Header)
