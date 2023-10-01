---
title: "Web Content Optimization: Images"
date: "2015-11-04"
categories: 
  - "technology"
---

Unless we are careful when creating them or manipulating them with Photoshop or its equivalent images can become huge very quickly. If we're not careful when saving the images we will find ourselves with images that are way larger than they need to be.

## Photoshop (or your favorite image editor) save for the web

The simplest way to compress your images is to save for web. I can hear your laughter but it still holds true that most of us will use Photoshop, or something similar to it, to create and manipulate images. So it makes sense to figure out how to best compress your images in the platform you create them or manipulate them.

One thing to remember is that compressing your image or reducing its dimensions can cause issues like pixelation and visible loss of quality. I would never say don't compress your images but I will always say use your judgement when doing so.

### Photoshop CC

Photoshop has always provided a **_save for web_** feature. Information for (older versions of) Adobe Photoshop CC can be found in the [Adobe Help](http://help.adobe.com/en_US/creativesuite/cs/using/WS6E857477-27FE-4a88-B8A4-074DC3C65F68.html#WSB3484C68-ECD2-4fa4-B7CC-447A5FE86680) Website.

Newer versions of Photoshop 2015 still maintain the **_save for web_** for leagcy compatbility but now recommend to use the **_export as_** feature instead.

### GIMP

The [GNU Image Manipluation Program (GIMP)](http://www.gimp.org/) provides the facilities to both [scale](http://docs.gimp.org/2.8/en/gimp-tutorial-quickie-scale.html) and [compress](http://docs.gimp.org/2.8/en/gimp-tutorial-quickie-jpeg.html) images. It is an open source equivalent to Photoshop and it's available for most major platforms: Mac, Windows and Linux.

## Command line tools

Lately I've been working on command line tools and build workflows using Grunt and Gulp. Because it is command line based and uses Node as the driving force Gimp and Photoshop do not work or would take much longer to develop than it would take using the tools below.

### Imagemagick

[ImageMagick](http://www.imagemagick.org/) is an older image processing and manipulation package [first released in 1987](http://www.imagemagick.org/script/history.php). While commands like Imagemin (discussed below) are geared only towards image compression, Imagemagick can perform multiple tasks.

The following grunt task illustrate some of the things you can do with Imagemagick.  
\- The first section will create multiple resilution files, like those you'd use for responsive images, for each jpg file with the indicated extension - The second session will take the files from the test directory, resize them and copy the resulting file into the test/resized directory - The last section will take the test/resizeme.jpg file, resize it to a 25x25px image and save the resulting file as resizeme-small.jpg

```
    "imagemagick-hisrc":{
        dev:{
            files:"**/*-2x.jpg",
            suffix:["-2x","-1x","-low"],
        }
    },
    "imagemagick-resize":{
            dev:{
            from:'test/',
            to:'test/resized/',
            files:'resizeme.jpg',
            props:{
                width:100
            }
        }
    },
    "imagemagick-convert":{
        dev:{
        args:['
            test/resizeme.jpg',
            '-resize', '25x25', 
            'test/resized/resizeme-small.jpg']
        }
    }
```

### Imagemin

[Imagemin](https://www.youtube.com/watch?v=4uQMl7mFB6g) is a command line image compression utility that is primarily designed to work as [command line](https://github.com/imagemin/imagemin-cli) and [GUI application](https://github.com/imagemin/imagemin-app)(Mac, Linux and Windows) as well as build workflows such as [Grunt](https://github.com/gruntjs/grunt-contrib-imagemin) and [Gulp](https://github.com/sindresorhus/gulp-imagemin) task runners

It comes bundled with the following optimizers:

- [gifsicle](https://github.com/imagemin/imagemin-gifsicle) — Compress GIF images
- [jpegtran](https://github.com/imagemin/imagemin-jpegtran) — Compress JPEG images
- [optipng](https://github.com/imagemin/imagemin-optipng) — Compress PNG images
- [svgo](https://github.com/imagemin/imagemin-svgo) — Compress SVG images

I've seen [mozjpeg](https://github.com/imagemin/imagemin-mozjpeg)recomended as an alternative compressor for JPEG images.

An example of imagemin as a Grunt task. Please note that the task below only works with jpeg and png images. I know that I don't have any gif or svg images in the project.

```
  imagemin: {
     png: {
          options: {
            optimizationLevel: 7
         },
      files: [ {
         // Set to true to enable the following options…
        expand: true,
        // cwd is 'current working directory'
        cwd: 'images/',
        src: ['**/*.png'],
        dest: 'dist/images/',
        ext: '.png'
     }
]},

     jpg: {
        options: {
            progressive: true,
            use: [mozjpeg()]
        },
        files: [{
            // Set to true to enable the following options…
            expand: true,
            // cwd is 'current working directory'
            cwd: 'images/',
            src: ['**/*.jpg'],
                dest: 'dist/images/',
                ext: '.jpg'
             }]
     }
 },
```

And the (partial) result of running the task above:

```
Running "imagemin" task

Running "imagemin:png" (imagemin) task
Verifying property imagemin.png exists in config...OK
Files: images/Mosaic_Netscape_0.9_on_Windows_XP.png 
  -&gt; dist/images/Mosaic_Netscape_0.png
Files: images/Navigator_1-22.png 
  -&gt; dist/images/Navigator_1-22.png
Files: images/cern-webservices-archive.png 
  -&gt; dist/images/cern-webservices-archive.png
Files: images/coffee2.png 
  -&gt; dist/images/coffee2.png
Files: images/font-in-chrome-mac.png 
  -&gt; dist/images/font-in-chrome-mac.png
Files: images/font-in-spartan-win-vm.png 
  -&gt; dist/images/font-in-spartan-win-vm.png
Files: images/font-terms.png 
  -&gt; dist/images/font-terms.png
Files: images/fonts-in-use-example.png 
  -&gt; dist/images/fonts-in-use-example.png
Files: images/full-width-translated-object.png
  -&gt; dist/images/full-width-translated-object.png
Files: images/hyperreal-org-1996-archive.png 
  -&gt; dist/images/hyperreal-org-1996-archive.png
Files: images/kerning.png 
  -&gt; dist/images/kerning.png
Files: images/mag_001.png
  -&gt; dist/images/mag_001.png
Files: images/mag_002.png 
  -&gt; dist/images/mag_002.png
Files: images/mag_003.png 
  -&gt; dist/images/mag_003.png
Options: interlaced, optimizationLevel=3, progressive

&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"  
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt;    
  images/Mosaic_Netscape_0.9_on_Windows_XP.png (saved 824 B - 1%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"  
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/font-terms.png (saved 23.85 kB - 39%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/cern-webservices-archive.png (saved 22.08 kB - 19%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"    
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/Navigator_1-22.png (saved 19.64 kB - 63%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/kerning.png (saved 854 B - 5%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/font-in-spartan-win-vm.png (saved 77.43 kB - 43%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/font-in-chrome-mac.png (saved 31.71 kB - 23%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/coffee2.png (saved 17.9 kB - 13%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"  
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/fonts-in-use-example.png (saved 23.59 kB - 13%)
&lt;img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="<img draggable="false" class="emoji" alt="✔" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" src="//s.w.org/images/core/emoji/72x72/2714.png"/>" 
  src="//s.w.org/images/core/emoji/72x72/2714.png"/>"  
  src="//s.w.org/images/core/emoji/72x72/2714.png"&gt; 
  images/hyperreal-org-1996-archive.png (saved 21.84 kB - 17%)
. . .
Minified 14 images (saved 799.53 kB)
```
