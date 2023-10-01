---
title: "Case Study: MOBI publishing from Docbook"
date: "2013-11-23"
categories: 
  - "ebook-publishing"
---

## BACKGROUND

In October of last year (2012) i was contacted by a German developer to do consulting on Docbook based ebook design and publishing. Because I had recently started a full time job I had to turn him down.

4 months later things had slowed down at work enough for me to reach out and check with the potential client to check if I could offer any assistance. I was sad to find out that he had given up and pretty much abandoned the project.

I offered to run the project for free in exchange of being allowed to write a case study on the experience.

This is the first time I work with content I didn't author. It might have had something to do with some of the issues discussed throughout or it might not.

## Source material and initial challenges.

The source material was a set of Docbook XML files along with the corresponding images in the screenshot directory. Since i cloned the files from a Github repository i shouldn’t have been surprised that thee were more inages tha those i needed and in different formats. This only became aparent later in the process.

The main file (index.xml) used XInclude to reference the rest of the content. Working on an integrated file (Docbook and XInclude have their own separate namespaces) required some modifications to my XML validation process. It wasn’t anything major (just use a different grammar file) but it’s important to keep it in mind for when using XInclude in the future.

## FILES TO NOTICE

- **build.xml** The Apache Ant build script
- **local-style.css** Additional CSS classes to make the ePub document look nicer. It will only work with Kindle Fire devices (those supporting the KF8 format)
- **docbook-custom.xsl** The Docbook customization layer.

This project also makes use of open source fonts for the ePub3 and KF8 versions:

- **SourceSansPro-Regular** An open source font from [Adobe](http://blogs.adobe.com/typblography/2012/08/source-sans-pro.html "Adobe Source Sans Pro font announcement")
- **UbuntuMono-Regular** Part of the [Ubuntu Font Family](http://font.ubuntu.com/ "Ubuntu Font Family")

## THE PROCESS

My standard Docbook to ePub process looks like this

1. Prepare the Docbook customization layer
2. Clean the working directory from prior conversion files
3. Validate the XML file using Jing
4. Fix any XML/Docbook structural and syntax errors
5. Repeat the XML validation as many times as necessary
6. use XSLTproc to convert the XML file to (X)HTML
7. Create and test the CSS stylesheets you want to use with your content
8. Copy images, fonts and additional CSS stylesheets to the book directory
9. Zip the content according to the ePub specification requirements
10. Validate the ePub file using epubcheck
11. Fix any ePub validation errors and rerun epubcheck
12. Convert to Mobi and KF8 using kindlegen
13. Test on your target devices

## THE TOOLS

### And and Ant build script

Rather than do all the steps manually I build an Ant build file that takes care of all the steps and the some additional stuff for general house keeping.

I picked Ant rather than a make file because it is truly cross platform. It is written in Java which may cause a problem for the most security conscious people but it is a command line application and in all the years I've used it it has never caused a problem.

The Ant build script is an xml-based file that contains one or more targets to accomplish your project goals.

### XSLTProc

I use XSLTProc as my transformation engine for a variety of reasons. It is a part of the OS X. Developer tools (or you can install it using Homebrew if you don't want the full multi-gig download from Apple) and it is the fastest XSLT 1.0 processor that I'm aware of.

It also handles XInclude without needing extensions or additional software.

For XSLT 2.0 and beyond I will most likely use Saxon. It is java based and authored by the editor of the XSLT specification at the W3C.

### Jing

Until last ear I used XMLlint as my XML validator. When using a RelaxNG vocabulary such as Docbook, it is not enough. When I first encountered this problem it was suggested that I move to Jing, mostly because it was built to validate RelaxNG rather than older W3C Schemas and DTDs.

In order to validate Docbook / XInclude documents you have to download a RelaxNG grammar file from the Docbook website.

### epubcheck

Tool developed by idpf to validate ePub 2 and 3 documents. It is a pain in the ass sometimes as it will not validate things we know are correct but it also has a great group behind it and bugs are fixed fairly quickly.

Current version is 3.0 (final)

### Kindlegen

Kindlegen is a command line tool that allows you to convert your ePub 3 file into a Kindle file for both the older eInk devices as well as the newer Kindle Fire readers.

Because I've automated my workflow I use Kindlegen rather than the Kindle Previewer for the automatic validation. I will still use Kindle Previewer to validate the content.

## THE PROCESS

### Developing your customization layer.

As counterintuitive as this may sound this is always my first step. There are things I know I'll need and they need to be used from the first test of the book conversion.

Some of the things I knew I needed for this particular project:

- **kindle.extensions**: Provides an umbrella for all Kindle-specific changes the stylesheets need to make to the ePub. Since the target platform is the Kindle family of devices we need to make sure that whatever is Kindle specific is addressed
    
- **html.stylesheet**: Adds additional CSS stylesheets to use with your book. This is important as the default stylesheet provides only minimal styling support
    
- **user.manifest.items**: The template, empty by default, allows you to add additional elements to the book package manifest (package.opf). In this particular instance we use it to add fonts for the ePub3 and KF8 (Kindle Fire) formats. ePub2 and eInk kindles (I believe all of them except the white paper model) will ignore material
    

What's a customization layer, why would you create one and how to do it is best covered in Bob Stayton's book [Docbook XSL: The Complete Guide](http://www.sagehill.net/docbookxsl/ "Docbook XSL: The Complete Guide"), particularly chapter 9.

### Create and test the CSS stylesheets

At this time we can't do much with the stylesheets other than set up the default fonts using @font-face CSS rules. My normal process includes adding a font for the body (usually a sans serif font like Adobe Code Sans) and a font for any pre formated styles like program listings or screen captures (using Ubuntu Mono as my font)

There are times when this is all that is needed but more often than not you need to do additional CSS work based on the specific classes and structure created during the conversion process.

### Clean up the working directory from prior conversion files

I know it shouldn't make a difference but I've learned over time to always clean up prior conversion artifacts from the working directory. This has saved a lot of grief when trying to identify problems with the CSS styles in particular. There is no real way to tell if the changes you're making is based on the old or the new code so I tend to err on the side of being OCD

### Validate the XML file using Jing

### Fix any XML/Docbook structural and syntax errors

### Repeat the XML validation as many times as necessary

Run the Docbook file (index.xml in this case) through Jing using a command similr to this:

```
java -jar /path/to/jing/jing -jar /path/to/jing/lib/docbookxi.rng index.xml
```

Before converting the Docbook file into our ePub (X)HTML we need to make sure that the file is valid XML or it'll cause no end of problems later on. Validating the XML gives use the chance to work with the Docbook content and fix any issues that we find.

This is an iterative process: Run Jing, fix any issues that it reports and the run Jing again. The idea is to have no issues in the Docbook XML code.

### Use XSLTproc to convert the XML file to (X)HTML

We will use XSLTproc to convert the valid XML file into a set of (X)HTML pages. At this point I'm confident that the input XML file has no serious issues that will affect the remaining stages of the process.

Two important things to remember are XIncludes and to set ups base directory for the transformed content.

While XSLTProc supports XInclude you have to tell it to use them as it is not a default activity.

XSLTProc, by default, will work in the directory where it is run. We need to tell it not to do that and to create a directory for our ePub content. We use the following command:

```
xsltproc --xinclude --stringparam base.dir OEBPS/ docbook-custom.xsl index.xml
```

1. The first parameter (--xinclude) tells XSLTProc to process any XInclude references and add them to the document
    
2. The second parameter (--stringparam base.dir OEBPS/) tells XSLTProc to create the OEBPS directory if it doesn't exists and to create all the files in this directory.
    
3. docbook-custom.xsl is the Docbook customization layer we created earlier in the process.
    
4. index.xml refers to the main Docbook file. It contains all the XInclude references and will generate all out XHTML content.
    

### Copy images, fonts and additional CSS stylesheets to the book directory

In the step above we only created the XHTML files with their references to images and other internal resources. We now need to copy all additional resources (in this case they are: CSS, fonts, and images) to the corresponding directory. For example, if we referenced the images like this:

```
images/sample.png
```

We would copy the image to:

```
OEBPS/images
```

Otherwise you will get validation errors later in the process. We need to do the same thing with all additional resources.

### Zip the content according to the ePub specification requirements

Ziping the epub book is a two step process.

The first step is to add the mimetype file (generated by Docbook) into the ePub archive without any compression. This is required by the ePub specification.

```
zip -X0 mybook.epub mimetype
```

The second zip command will add the remaining content, the OEBPS directory and the META-INF with normal compression settingsand exclusing all metadata; excluding the metadata is also required by the ePub specification.

```
zip -r -X9 mybook.epub META-INF OEBPS
```

Some people say that it's OK to work both steps in a single zip command but I've had enough issues with it in the past that I always run the two commands even if it's not needed.

### Validate the ePub file using epubcheck

### Fix any ePub validation errors and rerun epubcheck

Running [epubcheck](https://code.google.com/p/epubcheck/ "epubcheck") will detect a variety of ePub specific errors that can happen with your HTML's structure, the CSS, whether content should be present or not, among other events.

These errors may or may not have been caught by Jing when we validated the XML structure of the document. I'm assuming that if we get this far the HTML product is valid and will pass structural validation without a problem.

This is also an itertive process. If there are errors you will have to go back to your HTML, CSS or XML manifest package, make any changes, zip the content again and validate it. I know it's a pain in the ass but right now it's the only way to do it.

To run epubcheck type the following command:

```
java -jar /path/to/epubcheck/epubcheck.jar mybook.epub
```

### Convert to Mobi and KF8 using kindlegen

Once you have validated your ePub3 file you can use Kindlegen to convert it to both eInk (KF6) and Kindle Fire (KF8) formats. The resulting Mobi file contains both versions, you have no choice.

Kindlegen is a command line application chosen because it is easier to merge with the command line based Ant workflow. Another possibility worth exploring but it's beyond the scope of this essay.

Tu run Kindlegen run it like this:

```
/path/to/kindlegen mybook.epub
```

If there are any errors at this point the fixes have to be made on the XHTML documents, then zipped and validated as ePub before validating it again as Mobi. Warnings are, for the most part, OK. Make a note of what they are and, if so inclined, report them to the docbook-apps mailing list.

### Test on your target devices

The final thing to do is test in as many actual devices as you can. It is important to test in as many devices as you can; the experience with the cloud readers is definitely not the same as reading in the device, particularly the older Kindle and Kindle DX devices that only support the KF6 format (no fonts, no colors, no audio and video).

Once you are happy with the final product you can submit it through the KDP program.

Happy publishing!
