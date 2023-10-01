---
title: "Learning About Responsive Images"
date: "2016-02-08"
categories: 
  - "technology"
---

> **_Specification and API subject to change. Be aware that the specification is not finalized and it may change in incompatible ways. Do not use responsive images in production yet. If you do you do so at your own risk_**

Once upon a time we were cool by just putting an image (or more) in our web content. Brownie points if we added a background image… bonus points if the colors in the image did not conflict with the colors of the text or the links :o)

But now we have to worry about how fast our content loads, whether we are providing a good experience for users whether they are in a slow 2G connection or the fastest corporate wired broadband and everything in between.

And the biggest cause of slowdowns are images!

According to the HTTP archive data for January 15, 2016 images took 1163KB out of a total of 1961KB average total size.

![](//chart.googleapis.com/chart?chs=400x225&cht=p&chco=007099&chd=t:1163,69,67,406,95,156,2&chds=0,1163&chdlp=b&chdl=total%201961%20kB&chl=Images+-+1163+kB%7CHTML+-+69+kB%7CStylesheets+-+67+kB%7CScripts+-+406+kB%7CFonts+-+95+kB%7CVideo+-+156+kB%7COther+-+2+kB&chma=%7C5&chtt=Average+Bytes+per+Page+by+Content+Type "Average Bytes per Page by Content Type")

And then breaks down the average size of an individual response per file format.

![](//chart.googleapis.com/chart?chxl=1:%7CVideo%7CCSS%7CJS%7CHTML%7CSVG%7CPNG%7CJPG%7CGIF&chdlp=b&chdl=average%20response%20size%20(kB)&chxtc=0,6&chxs=0,676767,11.5,0,l%7C1,676767,11.5,1,lt,67676700&chxr=1,0,160%7C0,0,206&chxt=x,y&chbh=22&chs=640x310&cht=bhg&chco=3B356A&chds=0,206&chd=t:4,24,17,7,5,15,14,196&chm=N**+kB,676767,0,,12,,:4:&chma=%7C0,5&chtt=Average+Individual+Response+Size "Average Individual Response Size")

The graphic and associate information can be found in the [http archive](http://httparchive.org/interesting.php?a=All&l=Jan%2015%202016&s=Top1000)

## So what can we do about this?

The first aspect to consider is how we export the images from our photo applications. It may not sound like much but even shaving a few kilobytes from the image size can really enhance the user experience.

I’ve been using [imagemin](https://www.npmjs.com/package/imagemin) both as a standalone tool and as part of my grunt and gulp build processes and I can see savings of up to 1MB for a site that used 20 images.

These are production time decisions and, while we can revisit them, we can not make major changes to them.

But what if we could create multiple versions of an image based on the browser screen size and resolution and then tell the browser which one to use based on media queries?

Answer all those convoluted (and sometimes confusing questions) are what responsive images seek to answer.

## Use Cases and Applications

### HDPI versus normal resolution

One my biggest pet peeves has always been having to hack around delivering images to HDPI (retina) devices and normal devices without having to create multiple pages.

Responsive images solve this by adding an `x` component to the `srcset` attribute like in the example below. If the has a regular display the small (`1x`) image will be displayed but if we’re in a Retina display (or better I’d assume) then the larger image (`2x`) will be served.

It is important to realize that the size of the image is the same regardless of the resolution used. The `x` attribute indicates resultions, nothing else.

```
<img srcset="small.jpg 1x, large.jpg 2x"
   src="small.jpg"
   alt=“Lucas, former pack leader” />
```

### Fluid Images

I was thrilled when I discovered that making the width of an image 100% and the height auto would automatically resize them. I then learned about image preloading and how much it impacts performance and loading times… and how much it hinders really responsive images.

> Image preloading is, according to Steve Souders, “the single biggest performance improvement browsers have ever made.” Images are often the heaviest elements on a page; loading them ASAP is in everyone’s best interest. Thus, the first thing a browser will do with a page is scan the HTML for image URLs and begin loading them. The browser does this long before it has constructed a DOM, loaded external CSS or painted a layout. Solving the fluid-image use case is tricky, then; we need the browser to pick a source before it knows the image’s rendered size. From: [Responsive Images Done Right: A Guide To <picture> And srcset](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/)

The problem with trying to preload responsive images is that the browser has no idea of what image to load until the attributes are processed and this may lead to the wrong DPI or resolution being delivered to the client. But the browser does know the viewport, the resolution and other elements we can test with media queries which we can use to tailor our content to the device we are working with.

Let’s change the example above and assume that we have 3 sizes for the image

- large.jpg (1024 × 768 pixels)
- medium.jpg (640 × 480 pixels)
- small.jpg (320 × 240 pixels)

We will introduce two new attributes for our `img` tag: `w` units and the `sizes` attribute. In the `srcset` attribute we define 3 different sies for the image but rather than define it pixels we define them as `w` units. The lage image is `1024 pixels` and expressed as `1024w` the same thing happens for the medium and small images. You can have as many images as you think are necessary.

The `sizes` attribute constrains the size of the viewport. In our example there is one media query test and a default value: `sizes="(min-width: 36em) 33.3vw, 100vw` tells us that if the layout is larger than 36em we display the images at 1/3 the width of the window and if the media-query fails (because the width is smaller than the indicated value) we display the image at full viewport width.

```
<img srcset="large.jpg  1024w,
  medium.jpg 640w,
  small.jpg  320w"
  sizes="(min-width: 36em) 33.3vw, 100vw"
   src="small.jpg"
   alt=“Lucas, former pack leader” />
```

We can have multiple media queries in the sizes attribute. Say, for example, we want the images to be 50% of the viewport width if the monitor is 40em or larger, 33.3% if the viewport is between 36 and 40em and 100% if it’s 36em or narrower. The code would look like this:

```
  sizes="
    (min-width: 40em) 50vw,
    ( (min-width: 36em) and (max-width: 40em) ) 33.3vw, 
    100vw"
```

**_TODO: Verify that the second value for the sizes attribute is valid for sizes. Have asked RCIG on twitter_** **_TODO: Research if we can put this in a SCSS mixin and drive it from stylesheets instead of putting it directly in the HTML_**

### Switching image types while supporting older browsers

In an ideal world, all browser would support all image formats so we can take advantage of the formats stregths and avoid their weaknesses. But this is not the case. To handle this we’ll introduce a new element: `picture` and repurpose the `source` attribute from the `audio` and `video` elements.

In the example below the browser will take the first image format it supports and if it doesn’t support any of the formats listed in the `source` children it will default to the `img` element. The same thing will happen if the browser doesn’t support the `picture` element at all.

```
<picture>
   <source type="image/svg" src="iwc-logo.svg" />
   <source type="image/png" src="iwc-logo.png" />
   <img src="iwc-logo.gif" 
       alt="International Wolf Center " />
</picture>
```

### Art Direction

The most complicated use case for responsive images is art direction. I’ve listed it last because it makes uses of all the other element and attributes we’ve seen so far. It also introduced a new attribute for the `source` element: `media` to use media queries to match the source against.

The first `source` child on the example below works for viewports wider than 36em. It uses the fluid responsive image with one different: There is only one value for the sizes attribute… this is ok since we have tested for the width of our viewport in the source element itself.

If the viewport is narrower than 36em the media query for the first source will fail into the second source attribute which is a fixed with high density versions of the image.

Any `img` child of a picture element that isn’t a source is treated as fallback content and hidden in supporting browsers. I had assumed that the same would be true of the `img` child element. This is not the case… the `img` tag is required in the picture element without it you will get no results…. at all.

```
<picture>
   <source media="(min-width: 36em)"
     srcset="large.jpg  1024w,
     medium.jpg 640w,
     small.jpg  320w"
     sizes="33.3vw" />
   <source srcset="cropped-large.jpg 2x,
     cropped-small.jpg 1x" />
   <img src="small.jpg" 
     alt="Lucas, the former Pack Leader" />
</picture>
```

## Polyfilling for older browsers

[Picturefill Responsive Image Polyfill](http://scottjehl.github.io/picturefill/) [https://davidwalsh.name/responsive-images](https://davidwalsh.name/responsive-images)

## Browser Support

[Can I Use picture?](http://caniuse.com/#feat=picture) Data on support for the picture feature across the major browsers from caniuse.com.

[Can I Use srcset?](http://caniuse.com/#feat=srcset) Data on support for the srcset feature across the major browsers from caniuse.com.

## Links and Resources

- [Picturefill Responsive Image Polyfill](http://scottjehl.github.io/picturefill/)
- [Responsive image breakpoints generation](https://www.smashingmagazine.com/2016/01/responsive-image-breakpoints-generation/) — Smashing Magazine (2016)
- [Responsive Image Breakpoint Generator](http://www.responsivebreakpoints.com/) Online Tool
- [Embedded content](https://html.spec.whatwg.org/multipage/embedded-content.html) in the HTML Living Standard
- [Responsive images in practice](http://alistapart.com/article/responsive-images-in-practice) — A List Apart
- [One solution to reponsive images](https://www.smashingmagazine.com/2014/02/one-solution-to-responsive-images/) — Smashing Magazine (2014)
- [Responsive Images Done Right: A Guide To \\ And srcset](https://www.smashingmagazine.com/2014/05/responsive-images-done-right-guide-picture-srcset/) — Smashing Magazine (2014)
- [The state of responsive images](http://www.webdesignerdepot.com/2015/08/the-state-of-responsive-images/) — Web Designer Depot (2015)
- [Responsive image container](https://blog.yoav.ws/responsive_image_container/) — Yoav’s blog
