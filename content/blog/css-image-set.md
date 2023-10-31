---
title: "CSS image-set"
date: "2023-04-19"
---

CSS provides its own syntax for working with responsive images where it is appropriate.

This works in a smiliar way to the `srcset` attribute in HTML. It lets authors specify images either by resolution or format and let the browser decide the best option to use.

Although the most recent versions of browsers (Chrome/Edge 113, Safari 16.4 with some limitations and Firefox 113) all claim to support the unprefixed version of `image-set()` I've chose to write the examples with both `-webkit-` prefixed and unprefixed versions as a defensive measure. This ensures that the images will display in more browsers than it would if we only used the unprefixed version.

## Resolution / Pixel density

The first method is to work with resolution. We use x values to represent the target resolution for the image. There are other possible resolution units that we can use, but `x` is the most widely supported so I'll stick with that.

This example has two separate resolutions, one for regular displays (`1x`) and one for higher resolution images (`2x`).

The format of the images doesn't matter for this particular case.

```css
.example {
  background-image: -webkit-image-set(
    url("grey-wolf-1x.jpg") 1x,
    url("grey-wolf-2x.jpg") 2x
  );
  background-image: image-set(
    url("grey-wolf-1x.jpg") 1x,
    url("grey-wolf-2x.jpg") 2x
  );
}
```

You can also provide the files without the `url()` notation. The example below will also work.

```css
.example {
  background-image: image-set(
    "wolf.jpg" 1x,
    "wolf-2x.jpg" 2x
  );
  background-image: -webkit-image-set(
    "wolf.jpg" 1x,
    "wolf-2x.jpg" 2x
  );
}
```

## Supported formats

Another way we can use `image-set()` is to configure it with multiple image formats. The browser will pick the first format that it supports and use it.

As developers we need to make sure that we cover enough ground without going overboard.

Do we really need three images for each background image we want to use? Probably not.

The jpeg version is our fallback (more on fallbacks later) so it has to go. Both WebP and AVIF are supported in the current version of all major browsers. WebP has better support in older browsers but doesn't compress as well as AVIF.

If you can, create the different formats during your build process. Even though it's no longer supported, the [Squoosh CLI](https://www.npmjs.com/package/@squoosh/cli) is still my favorite tool to convert images; mostly because it allows me to convert images to WebP, AVIF and JPG using [MozJPEG](https://github.com/mozilla/mozjpeg#readme)

```css
.example {
  background-image: image-set(
    url("image1.avif") type("image/avif"),
    url("image1.webp") type("image/webp"),
    url("image2.jpg") type("image/jpeg")
  );
  background-image: -webkit-image-set(
    url("image1.avif") type("image/avif"),
    url("image1.webp") type("image/webp"),
    url("image2.jpg") type("image/jpeg")
  );
}
```

## Fallback

There is always a possibility that a browser will not be able to work with either a resolution or type `image-set()`. To make suree that we still get a background image, make sure to add a `background-image` without an image set.

```css
.example {
  background-image: url("wolf-pack.jpg");
  background-image: image-set(
    "wolf-pack.avif" type("image/avif"),
    "wolf-pack.jpg" type("image/jpeg")
  );
  background-image: -webkit-image-set(
    "wolf-pack.avif" type("image/avif"),
    "wolf-pack.jpg" type("image/jpeg")
  );
}
```

## Browser support

I compiled the following table using data from MDN and [caniuse.com](https://caniuse.com/mdn-css_properties_background-image_image-set).

Even though all browsers support the unprefixed syntax, you should still code defensively and provide both the `-webkit-` prefixed and unprefixed syntaxes with the prefixed one first.

| Browser | version | Resolution | File Types | Gradients | Prefixed? |
| --- | :-: | :-: | :-: | :-: | :-: |
| Chromium Browsers | 113 | ✅ | ✅ | ✅ | No |
| Safari | 16.4 | ✅ | ✅ | ✅ | No |
| Firefox | 113 | ✅ | ✅ | ✅ | No |

## Accessibility considerations

CSS images don't provide accessibility information. Screen readers will not read CSS background images so you must be careful when using images in CSS to communicate essential content.
