---
title: Revisiting Images For The Web
date: 2024-04-01
tags:
  - Images
  - Tools
---

It's been a while since I've looked at image formats supported on web browsers. The last time I did, AVIF had recently been introduced and Apple had announced support for WebP in Safari and operating systems.

At the time we also had [Squoosh](https://squoosh.app/) as a command line application that could be incorporated directly into Gulp build systems.

The baseline for this post is a series of posts I wrote in 2020: [Revisiting Image Formats for the Web](https://publishing-project.rivendellweb.net/revisiting-images-formats-for-the-web/) and [Image Formats for the Web: HEIC and AVIF](https://publishing-project.rivendellweb.net/image-formats-for-the-web-heic-and-avif/)

But times change.

Squoosh CLI is no longer maintained by the Chrome team due to people leaving the team and fewer people to do the work.

AVIF is now supported in all major browsers

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/avif.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/image/avif.png">
<img src="https://caniuse.bitsofco.de/image/avif.jpg" alt="Data on support for the AVIF feature across the major browsers from caniuse.com">
</picture>

WebP is now fully supported in all browsers

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/webp.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/image/webp.png">
<img src="https://caniuse.bitsofco.de/image/webp.jpg" alt="Data on support for the WebP feature across the major browsers from caniuse.com">
</picture>

JpegXL has partial support. Only Safari and Firefox (behind a flag) support the image format.

Chromium removed support for the format citing lack of support in other browsers. They haven't restored it and I'm dubious that they will with AVIF and WebP available.

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/jpegxl.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/image/jpegxl.png">
<img src="https://caniuse.bitsofco.de/image/jpegxl.jpg" alt="Data on support for the JPEGXL feature across the major browsers from caniuse.com">
</picture>

I also considered HEIF, based on HEVC, but it is only supported in Safari so, at this time, I will skip it as a supported format.

<picture>
<source type="image/webp" srcset="https://caniuse.bitsofco.de/image/heif.webp">
<source type="image/png" srcset="https://caniuse.bitsofco.de/image/heif.png">
<img src="https://caniuse.bitsofco.de/image/jpegxl.jpg" alt="Data on support for the HEIF feature across the major browsers from caniuse.com">
</picture>

To me, these evolutions present these questions:

1. What should we replace Squoosh with?
2. Which of the modern formats (AVIF and WebP) should we use?
3. Should we even bother with JPEG-XL?
4. Should we still provide a JPG or PNG backup?

## What should we replace Squoosh with?

Since we no longer have access to Squoosh's CLI we have to figure out what to replace it with.

[ImageMagick](https://imagemagick.org/) provides a variety of tools that we will use in these tests:

* Resize the TIFF original to a common size
* Convert the resized TIFF file to the appropriate format
* [SSIM](https://en.wikipedia.org/wiki/Structural_similarity_index_measure) and [DSSIM](https://kornel.ski/dssim) comparisons between images

It is a command line available in macOS, Linux and Windows (through [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)).

The scripts in this post are written in macOS (Ventura 13.6.5) and run in Bash 5.2.26 installed via Homebrew.

The scripts on this page should run on Linux and WSL using the same or later versions of Bash.

## Evaluating formats

I will use the same set of test images that I used four years ago.

The process is as follows:

1. For each image, resize it to 800px x 800px
2. Convert the image to each target format (JpegXL, WebP, AVIF, PNG and JPG)
3. Compare each image with the original using SSIM

## The Basic Commands

The first thing to do is to resize the image to a common format so SSIM will work when doing the comparison.

Since we want to preserve the aspect ratio for the image, the size may not remain 800x800 but all images will be the same size.

```bash
convert original.tif -resize 800x800 original-resized.tif
```

The other essential command will convert the TIFF image to a different format. Without any customizations, the command looks like this.

```bash
convert original-resized.tif original-converted.{format}
```

Using `Source-Images/emporium_hi_res.tif` as the source images, the conversion commands would look like this when run from the root of the project directory:

```bash
convert Source-Images/emporium_hi_res.tif emporium_hi_res.jxl
convert Source-Images/emporium_hi_res.tif emporium_hi_res.avif
convert Source-Images/emporium_hi_res.tif emporium_hi_res.webp
convert Source-Images/emporium_hi_res.tif emporium_hi_res.png
convert Source-Images/emporium_hi_res.tif emporium_hi_res.jpg
```

## Automating The Process: All Default Values

Rather than type the values manually every time we want to run the tests, I've written a Bash shell script to automate the process.

It takes the full path to the image we want to convert as its parameter.

The script does the following:

1. Creates an array of the formats that we want to work with
2. Capture the first argument into a variable
3. Removes the file extension
4. Resizes the image and renames it using the file name from step 3 and appends the string `-resized.tif`
5. Loops through the `formats` array and converts the resized file into the corresponding format

```bash
#! /usr/bin/env bash

# 1
formats=(jxl webp avif png jpg)

# 2
source=$1

# 3
intermediate="$(b=${source##*/}; echo ${b%.*})"

# 4
echo "Resizing image"
convert $source -resize 800x800  $intermediate-resized.tif

echo "Starting conversion"

# 5. Loops through the formats
for format in ${formats[@]}
do
  echo "Converting to $format"
  # Run the imagemagick conversion command
  convert $intermediate-resized.tif $intermediate.$format
done
```

### Making It Executable

Before we can run the script we need to make it executable, able to run from the command line.

In a terminal go to the directory where you stored the script and run the following command

```bash
chmod +x convert-image.sh
```

Then you run the script passing the source image as the parameter

```bash
./convert-image.sh image-source/image.tif
```

## First Round of Testing

This first round of testing is done with high-quality [TIFF](https://en.wikipedia.org/wiki/TIFF) source images. I am less interested in the purity of the test and more in the format that produces the smallest file size.

All the conversions use their default settings. We'll address this in the following sections.

I've chosen not to link to the images to play nice with mobile users.

| Results for  USS_California_at_1927_naval_review_NARA_19-LC-19C|||
| Format | Size in Bytes | Readable Size |
|:---: | :---: | :---: |
| tif | 493862 | 482.29KB |
| jxl | 69763 | 68.13KB |
| webp | 25202 | 24.61KB |
| avif | 14108 | 13.78KB |
| png | 239163 | 233.56KB |
| jpg | 97982 | 95.69KB |



| Results for geisha_hi_res|||
|Format   | Size in Bytes | Readable Size|
| :---: | :---: | :---: |
|tif      | 1440372      | 1.37MB    |
|jxl      | 63999        | 62.50KB   |
|webp     | 30038        | 29.33KB   |
|avif     | 16900        | 16.50KB   |
|png      | 637704       | 622.76KB  |
|jpg      | 133194       | 130.07KB  |



| Results for STSCI-H-p2022a-f-4398x3982|||
|Format   | Size in Bytes | Readable Size|
|:---:    | :---:        | :---:     |
|tif      | 1768598      | 1.69MB    |
|jxl      | 64777        | 63.26KB   |
|webp     | 33026        | 32.25KB   |
|avif     | 25719        | 25.12KB   |
|png      | 616645       | 602.19KB  |
|jpg      | 119306       | 116.51KB  |



| Results for honey_coffee_hi_res|||
|Format   | Size in Bytes | Readable Size|
|:---:    | :---:        | :---:     |
|tif      | 1181172      | 1.13MB    |
|jxl      | 104873       | 102.42KB  |
|webp     | 61484        | 60.04KB   |
|avif     | 41495        | 40.52KB   |
|png      | 727316       | 710.27KB  |
|jpg      | 204992       | 200.19KB  |

## Automating The Process (2): Tweaks For Flexibility

In the cases tested, AVIF produced a smaller file size than any of the other formats tested. What happens if we move on to a more common scenario where we don't get to dictate the format of the source images we want to convert?

Another issue is the image quality for each format. We used default settings for all of them and that may not produce optimal results. Furthermore, values are not the same for all formats so we'll have to do further testing to see which value is better for each format.

For this test, we did not resize the image. They will all be the same size as the original and that will inflate the file sizes.

| Results for STScI-H-p2031b-f-3379x3005 at different quality settings||||
| Format | Quality | Size in Bytes | Readable Size |
| :---: | :---: | :---: | :---: |
| tif | | 13876396 | 13.23MB |
| jxl | 30 | 255997 | 250.00KB   |
| ^^ | 40 | 283045 | 276.41KB |
| ^^ | 50 | 318580 | 311.11KB |
| ^^ | 60 | 366263 | 357.68KB |
| ^^ | 70 | 456299 | 445.60KB |
| ^^ | 80 | 607619 | 593.38KB |
| ^^ | 90 | 1014716 | 990.93KB |
| webp | 30 | 214566 | 209.54KB |
| ^^ | 40 | 244326 | 238.60KB |
| ^^ | 50 | 278638 | 272.11KB |
| ^^ | 60 | 311490 | 304.19KB |
| ^^ | 70 | 353038 | 344.76KB |
| ^^ | 80 | 468166 | 457.19KB |
| ^^ | 90 | 918646 | 897.12KB |
| avif | 30 | 116856 | 114.12KB |
| ^^ | 40 | 155702 | 152.05KB |
| ^^ | 50 | 211870 | 206.90KB |
| ^^ | 60 | 310441 | 303.17KB |
| ^^ | 70 | 421590 | 411.71KB |
| ^^ | 80 | 619039 | 604.53KB |
| ^^ | 90 | 1342169 | 1.28MB |
| png | 30 | 13567319 | 12.94MB |
| ^^ | 40 | 12606320 | 12.02MB |
| ^^ | 50 | 12583934 | 12.00MB |
| ^^ | 60 | 12503260 | 11.92MB |
| ^^ | 70 | 12424496 | 11.85MB |
| ^^ | 80 | 12288407 | 11.72MB |
| ^^ | 90 | 12269817 | 11.70MB |
| jpg | 30 | 355049 | 346.73KB |
| ^^ | 40 | 421436 | 411.56KB |
| ^^ | 50 | 490426 | 478.93KB |
| ^^ | 60 | 569025 | 555.69KB |
| ^^ | 70 | 699382 | 682.99KB |
| ^^ | 80 | 918249 | 896.73KB |
| ^^ | 90 | 1812574 | 1.73MB |

The source for `unsplash05` is a JPG file so I'm wondering if there will be a difference in the sizes due to the original's format.

| Results for unsplash05 at different quality settings||||
| Format | Quality | Size in Bytes | Readable Size |
| :---: | :---: | :---: | :---: |
| jpg |  | 1100638 | 1.05MB |
| jxl | 30 | 112922 | 110.28KB |
| ^^ | 40 | 134233 | 131.09KB |
| ^^ | 50 | 159784 | 156.04KB |
| ^^ | 60 | 205376 | 200.56KB |
| ^^ | 70 | 297960 | 290.98KB |
| ^^ | 80 | 518742 | 506.58KB |
| ^^ | 90 | 949470 | 927.22KB |
| webp | 30 | 89902 | 87.79KB |
| ^^ | 40 | 106126 | 103.64KB |
| ^^ | 50 | 122370 | 119.50KB |
| ^^ | 60 | 142956 | 139.61KB |
| ^^ | 70 | 162538 | 158.73KB |
| ^^ | 80 | 253286 | 247.35KB |
| ^^ | 90 | 703114 | 686.63KB |
| avif | 30 | 34930 | 34.11KB |
| ^^ | 40 | 52896 | 51.66KB |
| ^^ | 50 | 82762 | 80.82KB |
| ^^ | 60 | 140360 | 137.07KB |
| ^^ | 70 | 206032 | 201.20KB |
| ^^ | 80 | 395226 | 385.96KB |
| ^^ | 90 | 901366 | 880.24KB |
| png | 30 | 8392381 | 8.00MB |
| ^^ | 40 | 8287773 | 7.90MB |
| ^^ | 50 | 8053678 | 7.68MB |
| ^^ | 60 | 7672848 | 7.32MB |
| ^^ | 70 | 7521386 | 7.17MB |
| ^^ | 80 | 7254771 | 6.92MB |
| ^^ | 90 | 7072989 | 6.75MB |
| jpg | 30 | 175094 | 170.99KB |
| ^^ | 40 | 215119 | 210.08KB |
| ^^ | 50 | 258003 | 251.96KB |
| ^^ | 60 | 359722 | 351.29KB |
| ^^ | 70 | 418431 | 408.62KB |
| ^^ | 80 | 903699 | 882.52KB |
| ^^ | 90 | 1209308 | 1.15MB |

Because different projects have different requirements, you should always evaluate formats and quality settings against your target population, some of which may still be on metered mobile plans.

### Adding SSIM comparison

As an optional component, I've added  [Structural Similarity Index Measure (SSIM)](https://en.wikipedia.org/wiki/Structural_similarity_index_measure) comparisons to the result.

SSIM calculates the Structural Similarity Index between 2 given images using values between 0 and 1 with these values representing different levels of similarity between the images.

SSIM = 1
: This is the maximum value SSIM can attain, indicating that the two images being compared are identical, at least in terms of the elements SSIM uses to compare them.

0 < SSIM < 1
: Values greater than 0 but less than 1 indicate varying degrees of similarity. The closer the value is to 1, the more similar the two images are.

SSIM = 0
: This would theoretically represent no correlation between the images.
: However, in practice, SSIM values are rarely, if ever, zero or negative. Very low SSIM values close to 0 would indicate that the images have very little in common, at least from the SSIM perspective.

Depending on the type of image and the quality you select, the values can vary greatly, making your selection easier.

In this example using the `unsplash05` image as the source, we get very similar results so the quality and file size become my guiding factors.

| Results for unsplash05 at different quality settings with SSIM score|||||
| Format | Quality | Size in Bytes | Readable Size | SSIM |
|:---:|:---:|:---:|:---:|:---:|
| jpg | N/A | 1100638 | 1.05MB | 1 |
| jxl | 30 | 112922 | 110.28KB | 0.944868 |
| ^^ | 40 | 134233 | 131.09KB | 0.947791 |
| ^^ | 50 | 159784 | 156.04KB | 0.950932 |
| ^^ | 60 | 205376 | 200.56KB | 0.954998 |
| ^^ | 70 | 297960 | 290.98KB | 0.961485 |
| ^^ | 80 | 518742 | 506.58KB | 0.972575 |
| ^^ | 90 | 949470 | 927.22KB | 0.985386 |
| webp | 30 | 89902 | 87.79KB | 0.939526 |
| ^^ | 40 | 106126 | 103.64KB | 0.943543 |
| ^^ | 50 | 122370 | 119.50KB | 0.946264 |
| ^^ | 60 | 142956 | 139.61KB | 0.948896 |
| ^^ | 70 | 162538 | 158.73KB | 0.951101 |
| ^^ | 80 | 253286 | 247.35KB | 0.957089 |
| ^^ | 90 | 703114 | 686.63KB | 0.974157 |
| avif | 30 | 34930 | 34.11KB | 0.937875 |
| ^^ | 40 | 52896 | 51.66KB | 0.945047 |
| ^^ | 50 | 82762 | 80.82KB | 0.951741 |
| ^^ | 60 | 140360 | 137.07KB | 0.95829 |
| ^^ | 70 | 206032 | 201.20KB | 0.962341 |
| ^^ | 80 | 395226 | 385.96KB | 0.971444 |
| ^^ | 90 | 901366 | 880.24KB | 0.990101 |
| png | 30 | 8392381 | 8.00MB | 1 |
| ^^ | 40 | 8287773 | 7.90MB | 1 |
| ^^ | 50 | 8053678 | 7.68MB | 1 |
| ^^ | 60 | 7672848 | 7.32MB | 1 |
| ^^ | 70 | 7521386 | 7.17MB | 1 |
| ^^ | 80 | 7254771 | 6.92MB | 1 |
| ^^ | 90 | 7072989 | 6.75MB | 1 |
| jpg | 30 | 175094 | 170.99KB | 0.944332 |
| ^^ | 40 | 215119 | 210.08KB | 0.950758 |
| ^^ | 50 | 258003 | 251.96KB | 0.954254 |
| ^^ | 60 | 359722 | 351.29KB | 0.959387 |
| ^^ | 70 | 418431 | 408.62KB | 0.96423 |
| ^^ | 80 | 903699 | 882.52KB | 0.976782 |
| ^^ | 90 | 1209308 | 1.15MB | 0.995872 |

## Caveats and Conclusions

These images are provided as examples. These and other images are stored in the companion [GitHub repo](https://github.com/caraya/image-conversion-tests) so you can test with them. You can also run the script against your site's images.

**In my testing, AVIF consistently produced the smallest file sizes across quality**. As usual, your mileage may vary.

Even though it's not absolutely necessary, you should always consider using the [picture] element with a PNG or JPG fallback, something like this

```html
<picture>
  <source srcset="photo.avif" type="image/avif" />
  <source srcset="photo.webp" type="image/webp" />
  <img src="photo.png" alt="photo" />
</picture>
```

Like working with video [video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) elements, the browser will load the first supported format, so order does matter.

Note the use of the `srcset` attribute. This is required when `source` is the child of a `picture` element. This is different than working with `video` or `audio` elements where the `src` attribute is required.

I still need to finetune how the quality settings go since the same value can mean different things based on formats. There is little documentation regarding passing quality settings between ImageMagick to the underlying delegate for that format.

This project relies on a third-party tool and how it's configured. Package managers may not offer the configuration that you need to run these experiments.

If your package manager doesn't offer the configuration that you want then an option may be to install ImageMagick and all related libraries from source code. Basic installation instructions are explained in [Install from Source](https://imagemagick.org/script/install-source.php). Note that this requires additional installations and it's not recommended for people who are not familiar with manual software compilation and installation.
