---
title: "Docbook, XML and ebooks:Creating eBooks the old fashioned way"
date: "2012-04-06"
categories:
  - "technology"
---

One of the most traditional ways to author content for multiple distribution channels is to roll up your sleeves, write XML and then convert it to your target format. For this exercise we will use [Docbook](http://www.docbook.org/). Without going into too much detail, Docbook was initially created in 1991 as a means to create computer software manuals and other technical documentation. Over the years Docbook has evolved into a general purpose XML authoring language. Along with the authoring standard, what structures we can use to author our content, the authors of the Docbook standard have also created a set of stylesheets to convert our base XML files into different formats. One of the formats that you can convert your XML files is epub.

More information about the history of Docbook can be found in the [Docbook: The Definitive Guide](http://docbook.org/tdg51/en/html/ch01.html#s.shorthistory) website

## Getting Started

Below is a skeleton XML file for a Docbook-based book.

```xml
<?xml version="1.0" encoding="utf-8"?>
<book xmlns='http://docbook.org/ns/docbook' version="5.0" xml:lang="en">
<title>The Adventures of Sherlock Holmes</title>
<info>
 <author>
   <personname>
     <firstname>Arthur</firstname>
     <surname>Conan Doyle</surname>
   </personname>
 </author>
</info>
<chapter>
 <title>A Chapter</title></chapter></book></p>

<p><para>Content is required in chapters too.</para>
```

Once we have the XML document ready (filling out the skeleton with as many chapters as we need to complete our content), we need two things:

* A set of XSLT stylesheets to convert our XML into HTML and ePub
* A processor to actually run the transformation The stylesheets are located at

[http://sourceforge.net/projects/docbook/files/docbook-xsl-ns/1.76.1/](http://sourceforge.net/projects/docbook/files/docbook-xsl-ns/1.76.1/) where you can choose if you want .zip or .tag.gz compressed archives. In addition download the file at [http://sourceforge.net/projects/docbook/files/epub3/docbook-epub3-addon-b3.zip](http://sourceforge.net/projects/docbook/files/epub3/docbook-epub3-addon-b3.zip) and [http://sourceforge.net/projects/docbook/files/epub3/README.epub3](http://sourceforge.net/projects/docbook/files/epub3/README.epub3). To enable ePub3 support follow the instructions on the README.epub3 file.

The stock Docbook style sheets produce ePub 2 compliant books. This is ok for now as most readers that support ePub support this version. There is experimental support for ePub 3 compliant books, which we will follow for this article as it gives us access to all the multimedia features of ePub3.

As far as XSLT processors there are two that I recommend. One is Saxon; currently at version 9.4 and available from its publisher [Saxonica](http://saxonica.com/download/download.xml) on a trial basis. Yes, it is commercial software but after years of using it I highly recommend the investment. It is written in Java and provides a full set of features, extensions and advanced implementations of XML related technologies. For our purposes it's enough that it will take the XML, process it with the style sheets and give us the output we want.

The second processor I recommend is XSLTProc. written in C and bundled with Most UNIX/Linux/OSX installations it can be downloaded/updated from the [xmlsoft.org](http://xmlsoft.org/downloads.html) web site. Download and install both LibXML and LibXSLT and install them in the same order (LibXML first and then LibXSLT) or it will not work as you think it will.

The commands to create the ebooks using Xsltproc are:

```bash
xsltproc /Users/carlos/docbook/1.0/xslt/epub3/chunk.xsl ebook.xml
```

This produces an output that should look like this:

```bash
Writing OEBPS/bk01-toc.xhtml for book
Writing OEBPS/ch01.xhtml for chapter
Writing OEBPS/ch02.xhtml for chapter
Writing OEBPS/index.xhtml for book
Writing OEBPS/docbook-epub.css for book
Generating EPUB package files.
Generating image list ...
Writing OEBPS/package.opf for book
Writing OEBPS/../META-INF/container.xml for book
Writing OEBPS/../mimetype for book
Generating NCX file ...
Writing OEBPS/toc.ncx for book
< ?xml version="1.0" encoding="UTF-8"?> '
```

## Final Details

We are done generating the content and the files we need in order to generate the eBook. To finish the process we need to do the following (taken from the README.epub3 file):

**Manually copy any image files used in the document into the corresponding locations in the $base.dir directory.**

For example, if your document contains:

```xml
<imagedata fileref="images/caution.png"></imagedata>
```

If the base.dir attribute is set up to the ebook1/OEBPS, you would copy the file to: ebook1/OEBPS/images/caution.png. You can get a list of image files from the manifest file (ebook1/OEBPS/package.opf in our example) that is created by the style sheet.

Currently the stylesheets will *not* include generated image files for callouts, header/footers, and admonitions. These files have to be added manually.

**cd to the directory containing your mimetype files, which would be ebook1 in this example.**

**Run the following zip commands to create the epub file**

```bash
zip -X0 sherlock-holmes.epub mimetype
zip -r -X9 sherlock-holmes.epub META-INF OEBPS [/bash]
```

The first command adds the 'mimetype' file first and uncompressed. The -X option excludes extra file attributes (required by epub3). The numbers indicate the degree of compression. The -r option means recursively include all directories. The "sherlock-holmes.epub" in this example is the output file.

## Validation

Because we have done most of the work manually we need to validate the result of our work. For that we will use the epubcheck3 tool available from its [Google Code Project repository](http://code.google.com/p/epubcheck/wiki/EPUBCheck30).

```bash
java -jar /Users/carlos/Java/epubcheck-src-3.0b3/dist/epubcheck-3.0b3.jar sherlock-holmes.epub
```

Hopefully we'll see a result like this

```bash
Epubcheck Version 3.0b3 No errors or warnings detected.
```
