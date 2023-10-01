---
title: "ePub package.opf generator"
date: "2014-10-11"
categories: 
  - "technology"
---

This is the first pass at a script to generate a basic `package.opf` file for epub3 ebooks using Python 2.X.

## What it does

When you run it from the root of your ebook, the script will create a `package.opf` file, populate it with basic metadata as required by the epub3 specification, it will also create metadata and spine sections based on the content of the OEBPS directory.

## How does the script do it

The script only uses modules from the default library. I want the a portable script and I don't want to worry whether a module is compatible with 2.X and 3.X, compatible with either version or if uses a different syntax on each version.

At the top of the script we use the environment 'shebang' to declare the location of the Python executable without hard coding it.

We import the following modules, each for a specific purpose:

- **_mimetypes_** to find the mime type of our files automatically
- **_glob_** to create the list of files under OEBPS
- **_os_** and **_os.path_** to create the items we populate our package file with

After loading the modules the first thing we do is initialize our mime-type database. This will make sure, as much as possible, that we match the file with the correct mime-type.

We then open our package.opf file in write mode.

The last step in this stage is to create the glob expression that will tell the rest of the scripts what files to work with.

We are now ready to create the content we'll write to the file.

```python
#!/usr/bin/env python 

import mimetypes
import glob
import os
import os.path

# Initialize the mimetypes database
mimetypes.init()
# Create the package.opf file
package = open('package.opf', 'w')

# WARNING: This glob will add all files and directories 
# to the variable. You will have to edit the file and remove
# empty directories and the package.opf file reference from
# both the manifest and the spine
package_content = glob.glob('OEBPS/**/*')
```

The second stage is to create the templates for the XML portions of the package. There are two things to notice with this part.

- The XML elements are empty. I only create attributes as necessary
- I create static templates and don't use dynamic content because all the modules I found had issues when working with namespaces.

The three templates will be used when building the file.

```python
template_top = '''<package xmlns="http://www.idpf.org/2007/opf"
  unique-identifier="book-id"
  version="3.0" xml:lang="en">
  <metadata >
    <!-- TITLE -->
    <dc:title></dc:title>
    <!-- AUTHOR, PUBLISHER AND PUBLICATION DATES-->
    <dc:creator></dc:creator>
    <dc:publisher></dc:publisher>
    <dc:date></dc:date>
    <meta property="dcterms:modified"></meta>
    <!-- MISC INFORMATION -->
    <dc:language>en</dc:language>
    <dc:identifier id="book-id"></dc:identifier>
    <meta name="cover" content="img-cov" />
  </metadata>
  <manifest>
  '''

template_transition = '''</manifest>
  <spine toc="ncx">'''

template_bottom = '''</spine>
</package>

```

The enumeration builds the dynamic section of the file. We first create two variables to hold the content and spine of the manifest.

For each element of our `package_content` (the content of the OEBPS directory) we do the following:

- Set the basename variable to the part of the current item
- Get the mime type for the item
- Add the item XML tag to the manifest assigning it an ID, the base path and the mime type
- Add the item to the spine by creating the idref element with an ID matching the one we used for the item tag above

When we complete this section, we have a list of all the files under OEBPS and are now ready to, finally, build the package file.

```python
manifest = ""
spine = ""

for i, item in enumerate(package_content):
  basename = os.path.basename(item)
  mime = mimetypes.guess_type(item, strict=True)
  manifest += 't<item id="file_%s" href="%s" media-type="%s"/>n' % (i+1, basename, mime[0])
  spine += 'nt<itemref idref="file_%s" />' % (i+1)
```

After all the work, actually creating the file is almost anti climatic. We print each section in the following order:

- template\_top
- manifest
- template\_transition
- spine
- template\_bottom

```python
# I don't remember my python all that well to remember 
# how to print the interpolated content. 
# This should do for now.
package.write(template_top)
package.write(manifest)
package.write(template_transition)
package.write(spine)
package.write(template_bottom)
```

An example of the complete file looks like this:

```xml
<package xmlns="http://www.idpf.org/2007/opf"
  unique-identifier="book-id"
  version="3.0" 
  xml:lang="en">
  <metadata >
    <!-- TITLE -->
    <dc:title></dc:title>
    <!-- AUTHOR, PUBLISHER AND PUBLICATION DATES-->
    <dc:creator></dc:creator>
    <dc:publisher></dc:publisher>
    <dc:date></dc:date>
    <meta property="dcterms:modified"></meta>
    <!-- MISC INFORMATION -->
    <dc:language>en</dc:language>
    <dc:identifier id="book-id"></dc:identifier>
    <meta name="cover" content="img-cov" />
  </metadata
  <manifest>
    <item id="file_1" href="styles.css" media-type="text/css"/>
    <item id="file_2" href="type" media-type="None"/>
    <item id="file_3" href="book_cover.jpg" media-type="image/jpeg"/>
  </manifest>

  <spine toc="ncx">
    <itemref idref="file_1" />
    <itemref idref="file_2" />
    <itemref idref="file_3" />
  </spine>
</package>
```

## Thing to remember

This is not a complete solution. It is a starting point and it will require manual edits before it passes validation. It is still better than starting from scratch, at least in my opinion.

## Things to work on

The first thing I need to figure out is how to skip or remove empty folders. In the example above the media folder needs to be removed manually before the package file will pass epubcheck validation.

Another thing I'll have to research is whether the glob expression takes all the files we need. For geeks, how many levels deep does the glob expression go?
