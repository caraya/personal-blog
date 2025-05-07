---
title: Image processing with ImageMagick
date: 2025-05-28
tags:
  - Web
  - Image Processing
  - Image Magick
---

[Image Magick](https://imagemagick.org/index.php) is a powerful command-line tool for image processing. It can be used to convert, edit, or compose images in various formats.

I first heard of Image Magick from Phillip Greenspun's [Panda](https://philip.greenspun.com/panda/) project, which uses it to add borders and a copyright message.

This post will explore ways to use Image Magick for image processing, both modifying existing images and composing new images from existing images and text.

## Background: What is Image Magick?

ImageMagick was created in 1987 by John Cristy when working at DuPont, to convert 24-bit images (16 million colors) to 8-bit images (256 colors), so they could be displayed on most screens at the time. It was freely released in 1990 when DuPont agreed to transfer copyright to ImageMagick Studio LLC, still currently the project maintainer organization.

## Using Image Magick

The syntax, as many command-line tools, is a somewhat cryptic, but it is very powerful.  The core of ImageMagick is the `magick` command, which can be used to perform a variety of operations on images.

### Convert image to a different format

The basic syntax to convert an image from PNG to JPG is:

```bash
magick image.png image.jpg
```

This will convert `image.png` to `image.jpg`. The convert command is the main command for Image Magick, and it can be used to perform a wide variety of operations on images.

### Chaining commands

You can chain multiple commands in a single line. The following command will resize the image to 50% of its original size and save it as a PNG file:

```bash
magick image.jpg \
-resize 50% \
output/image-resized-50.png
```

ImageMagick’s command-line tools (e.g. magick or convert) process your operations exactly in the order you specify them, from left to right. Under the hood there are three categories of command-line parameters, each behaving slightly differently:

Image Settings
: These persist from the point you specify them until they’re either overridden or until the command ends. They affect subsequent image reads, operators, and writes (but not anything done before you set them).

Image Operators
: These act immediately on the current image in memory and then “forget” it. If you need to apply the same operator again, you must repeat it on the command line.

Image Sequence Operators
: Commands like `-append`, `-composite`, `-morph` (and others) consume (and potentially replace) all currently loaded images—think things.

### Converting to grayscale

You can turn the image to grayscale with a command like this:

```bash
magick input/image.jpg \
-grayscale Rec709Luma \
output/image-grayscale.webp
```

There are several different intensity methods available for grayscale conversions:

* Rec601Luma
* Rec601Luminance
* Rec709Luma
* Rec709Luminance
* Brightness
* Lightness

Test each method to see which one works best for your image.



### Adding text to an image

```bash
magick input/image.jpg \
-fill white -stroke black \
-pointsize 350 -gravity center \
-annotate 0 'TEXT' output/image-text.png
```

### Working with multiple files

```bash
magick mogrify -path output -format webp -resize 500x input/*
```

!!! warning **Warning:**
As with many tools that modify images, you should always keep the original image. The `mogrify` command will overwrite the original image, so be careful when using it.
!!!

## Customizing images

The first use of ImageMagick I saw was in Phillip Greenspun's [Philip and Alex's Guide to Web Publishing](https://philip.greenspun.com/panda/) book, which uses it to add borders and a copyright message after being processed from Kodak PhotoCD originals.

The original command was part of Perl script designed to process large batches of images. I've simplified it to a single command for demonstration purposes.

```bash
magick cover02.webp \
-bordercolor black -border 5 \
-gravity southeast \
-fill white -font Helvetica -pointsize 20 \
-annotate +10+10 'copyright Carlos Araya' \
cover02-annotated.webp
```

The individual components of the command are:

* `cover02.webp` is the input image
* `-bordercolor black -border 5` adds a 5 pixel black border
* `-gravity southeast` anchors subsequent drawing at the lower-right
* `-fill white` makes the text white (so it shows up against the image)
* `-font Helvetica -pointsize 20` chooses a legible font and size (tweak as needed)
* `-annotate +10+10 'copyright Carlos Araya'` draws the text 10 px left and 10 px up from the bottom-right corner
* `cover02-annotated.webp` is the output image

The `-gravity` uses cardinal directions (`north`, `south`, `east`, `west`,`center`, `northeast`, `northwest`, `southeast`, and `southwest`) to position the text.

## Creating composite images

As Ethan Marcotte's [Magick images](https://ethanmarcotte.com/wrote/magick-images/) post describes, you can use ImageMagick to create composite images. The following command creates a composite image from a background image and a foreground image, and adds text to it.

```bash
magick background.png \
  \( foreground.jpg -gravity center -crop 600x630+0+0 -geometry +0+0 +gravity \) -composite \
  \( -size 500x216 -background transparent -gravity SouthWest \
     -font YWFTVermont-Light -pointsize 48 -interline-spacing 5 \
     -fill white caption:'The World-Wide Work.' \
     -geometry +652+336 \
  \) -composite \
  \( -background transparent -gravity SouthWest \
     -font Untitled-Sans-Bold -pointsize 20 \
     -fill white label:'10 MARCH 2024' \
     -geometry +652+570 \
  \) -composite \
  -layers flatten merged.png
```

The command is divided into three parts:

1. The first part creates a composite image from the background and foreground images
2. The second part adds a text caption to the image
3. The third part adds a date as text to the image

We start with the background image (`magick background.png`) as the base for the full composite.

### First parentheses group

```bash
\( foreground.jpg -gravity center -crop 600x630+0+0 -geometry +0+0 +gravity \) -composite
```

`foreground.jpg`
: Opens the foreground image.

`-gravity center`
: Sets the reference point for subsequent operations to the center of the image.

`-crop 600x630+0+0`
: Crops a 600×630-pixel rectangle, centered (because of the gravity), with no offset (+0+0).

`-geometry +0+0`
: (After cropping) resets any placement offsets—ready for compositing at the default location.

`+gravity`
: Clears the gravity setting so later geometry offsets aren’t interpreted relative to center.

`-composite`
: Overlays this cropped foreground on top of the current canvas (the background).

### Second parentheses group (main caption)

```bash
\( -size 500x216 -background transparent -gravity SouthWest \
   -font YWFTVermont-Light -pointsize 48 -interline-spacing 5 \
   -fill white caption:'The World-Wide Work.' \
   -geometry +652+336 \
\) -composite
-size 500x216
```

Creates a new “virtual” blank image of width 500px and height 216px.

`-background transparent`
: Makes that blank canvas fully transparent.

`-gravity SouthWest`
: Positions the text relative to the bottom-left corner of that canvas.

`-font … -pointsize 48 -interline-spacing 5 -fill white`
: Sets the font family, size, line spacing, and text color.

`caption:'The World-Wide Work.'`
: Renders the given multi-line (if needed) text into the canvas, wrapping within 500×216.

`-geometry +652+336`
: When compositing, offsets this caption image +652px to the right and +336px down from the SouthWest corner of the background.

`-composite`
: Overlays the caption onto the working image.

### Third parentheses group (date label)

```bash
\( -background transparent -gravity SouthWest \
   -font Untitled-Sans-Bold -pointsize 20 -fill white \
   label:'10 MARCH 2024' \
   -geometry +652+570 \
\) -composite
```

This is very similar to the caption step, but uses `label:` (single-line) rather than `caption:`, a different font/size, and places it at a different offset (`+652+570`).

### Final pieces

`-layers flatten`
: After all the composites, this merges all layers down into one final image.

`merged.png`
: Writes out the resulting flattened image to merged.png.

## Conclusion

ImageMagick is a powerful tool for image processing and it can be used to create complex images via command line.

To keep things DRY, you can automate ImageMagick tasks with a script (either Bash or Node). You can use the script to batch process multiple images and apply the same transformations consistently across all of them. This can save time and ensure uniformity in your image processing tasks.

You can also use ImageMagick in combination with other tools, such as [Sharp](https://sharp.pixelplumbing.com/), or other image processing libraries, to create more complex workflows. For example, you can use ImageMagick to modify an image and then use Sharp to compress them further.

Final note: There is an ImageMagick [Node module](https://www.npmjs.com/package/imagemagick) available, but it hasn't been updated in 12 years. I would be cautious about using it as it is may not be compatible with the latest version of ImageMagick. Instead, you can use the command line directly from Node.js using the `child_process` module.

You can include ImageMagick scripts in your build process, so that images are automatically processed when you build your site. This can help to ensure that your images are always optimized for the web and ready for use.
