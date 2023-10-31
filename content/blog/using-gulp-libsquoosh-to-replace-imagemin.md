---
title: "Using gulp-libsquoosh to replace Imagemin"
date: "2021-09-15"
---

All my Javascript projects include [imagemin](https://github.com/imagemin/imagemin/), a tool that allows you to convert images between different formats and do some level of processing to the images as it converts them.

Unfortunately, the project is in life support mode and the original maintainer stopped working on it years ago according to the [pinned issue](https://github.com/imagemin/imagemin/issues/385) in the repository issue tracker.

So it's time to take a look at the alternatives and see how well they work in a [Gulp](https://gulpjs.com/)\-based Javascript project.

[Squoosh](https://squoosh.app/) is an image compression and manipulation tool. The main difference between Squoosh and Imagemin is that Squoosh has created [WebAssembly](https://webassembly.org/) version for encoders and decoders for all the formats it supports. So it'll work in any modern browser that supports WASM and doesn't need to concern itself with native codec compilation.

Squoosh also provides an experimental [command line](https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli) tool. That tool also has a Gulp plugin ([gulp-libsquoosh](https://github.com/pekeq/gulp-libsquoosh))

These ar the formats that I want to work with. They are supported in most major browsers and can be used with the [picture](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) to provide the best possible compression for the user, regardless of the browser they use:

| Format | Extension | Browser Support |
| --- | --- | --- |
| PNG | .png | all |
| JPEG | .jpg, .jpeg | all |
| WebP | .webp | Chromium browsers, Firefox, Safari on macOS Big Sur and later |
| AVIF | .avif | Chrome, Firefox 92 and later |

Squoosh supports two additional formats that I'm not using because they lack support in production browsers: I may take a look at JPEGXL in the future.

| Format | Extension | Browser Support |
| --- | --- | --- |
| WebP2 | .wp2 | No current browser supports the format |
| JPEG XL | .jxl | behind flags in Edge, Firefox, Chrome and Opera |

To confirm the support, check [caniuse.com](https://caniuse.com/).

The first pass at using the plugin is converting to formats the plugin supports and I want to use using the default settings for each format.

```js
const gulp =require('gulp');
const squoosh = require('gulp-libsquoosh');

gulp.task('squoosh', () => {
  return gulp.src('src/original-images/**/*.{png,jpg,avif}')
      .pipe(squoosh({
        oxipng: {},
        webp: {},
        avif: {},
        mozjpg: {},
      })
          .pipe(dest('src/images')),
      );
});
```

`gulp-squoosh` will also resize images to the specified dimensions. This example will resize all images to be half their width and height (`(width / 2)` x `(height / 2)`).

When using both values, the image will be resized to those specific dimensions.

When either width or height is specified, Squoosh will resize the image to the specified size preserving aspect ratio.

```js
const gulp = require('gulp');
const squoosh = require ('gulp-libsquoosh');

gulp.task('squoosh', () => {
  retrurn gulp.src('src/original-images/**/*.{png,jpg,avif}')
  .pipe(
    squoosh({
        encodeOptions: {
          oxipng: {},
          webp: {},
          avif: {},
          mozjpg: {},
        },
        preprocessOptions: {
          resize: {
            enabled: true,
            width: Math.round(src.width / 2),
            // height: Math.round(src.height / 2),
          },
        },
      }))
});
```

You can also choose what formats to convert to based on the format of the source image. Not all format conversions make sense for all source formats so it's nice to have more granular control over the results we want.

In this case, we use the file extension to determine the source image format and use the information to decide what formats to convert to with what settings.

```js
const path = require('path');
const gulp = require('gulp');
const squoosh = require('gulp-libsquoosh');

gulp.task('squoosh', () => {
  return gulp.src('src/original-images/**/*.{png,jpg,webp}')
  .pipe(
    squoosh((src) => {
      const extname = path.extname(src.path);
      console.log(extname);

      let options = {
        encodeOptions: squoosh.DefaultEncodeOptions[extname],
      };

      if (extname === '.jpg') {
        options = {
          encodeOptions: {
            jxl: {},
            mozjpeg: {},
          },
        };
      }

      if (extname === '.png') {
        options = {
          encodeOptions: {
            avif: {},
          },
        };
      }

      return options;
    }),
  )
  .pipe(gulp.dest('dist/images'));
});
```

***The code in the previous example is not working. It reports an error about the path expecting a string but receiving undefined. I've raised an issue in the gulp-squoosh repository to see the best way to fix it.***

One final piece of research is to see whether you can use the same Squoosh encoder to run multiple commands and how many commands will Squoosh run before the WASM codecs run out of memory.

If they can be run multiple times and the number of runs is acceptable, it would allow gulp-squoosh to also replace [gulp-responsive](https://www.npmjs.com/package/gulp-responsive) to create multiple retina images from the same source.
