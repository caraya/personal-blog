---
title: "Creating epub3 content.opf file"
date: "2021-09-13"
---

One of the hardest files in an epub book is the `content.opf` manifest file. This file tells an epub reader what files are in a specific rendition of an ebook.

There are three components to a `content.opf` file:

Metadata

Provides information about the book using a combination of meta tags and Dublin Core metadata elements

The normative reference is in the EPUB 3.2 package specification [metadata section](https://www.w3.org/publishing/epub3/epub-packages.html#sec-pkg-metadata)

Manifest

The manifest element provides an exhaustive list of the Publication Resources that constitute the given Rendition, including the media type, the file path and the media encoding

See the [Manifest section](https://www.w3.org/publishing/epub3/epub-packages.html#sec-pkg-manifest) of the EPUB 3.2 specification for more information

Spine

The spine element defines an ordered list of manifest item references that represent the default reading order of the given Rendition

There are aditional sections that are optional and, as such, not covered in this post. See the [legacy section](https://www.w3.org/publishing/epub3/epub-packages.html#sec-pkg-legacy) of the EPUB package specification for more information.

The code below shows an abbreviated `content.opf` file for the book The Charriots of Apollo, available on Github.

```xml
<?xml version='1.0' encoding='utf-8'?>
<package 
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns="http://www.idpf.org/2007/opf" 
  version="2.0" unique-identifier="bookid">

  <metadata>
    <meta content="cover-image" name="cover"/>
    <dc:identifier id="bookid">urn:uuid:e051fd59-ac90-4600-91df-e5a242309af6</dc:identifier>
    <dc:title>Chariots for Apollo: A History of Manned Lunar Spacecraft</dc:title>
    <dc:creator>Courtney G. Brooks, James M. Grimwood, Loyd S. Swenson</dc:creator>
    <dc:date>1979</dc:date>
    <dc:publisher>NASA History Office</dc:publisher>
    <dc:language>en</dc:language>
  </metadata>

  <manifest>
    <item href="toc.ncx" id="ncx" media-type="application/x-dtbncx+xml"/>
    <item href="stylesheet.css" id="css" media-type="text/css"/>
    <item href="cover.jpg" id="cover-image" media-type="image/jpeg"/>
    <item href="cover.html" id="cover" media-type="application/xhtml+xml"/>
    <item href="title.html" id="title" media-type="application/xhtml+xml"/>
    <item href="contents.html" id="contents" media-type="application/xhtml+xml"/>
    <item href="foreword.html" id="foreword" media-type="application/xhtml+xml"/>
    <item href="preface.html" id="preface" media-type="application/xhtml+xml"/>
    <item href="ch1.html" id="ch1" media-type="application/xhtml+xml"/>
    <item href="ch1-1.html" id="ch1-1" media-type="application/xhtml+xml"/>
    <item href="images/c002a.jpg" id="c002a" media-type="image/jpeg"/>
    <item href="images/c002b.jpg" id="c002b" media-type="image/jpeg"/>
    <item href="images/c002c.jpg" id="c002c" media-type="image/jpeg"/>
    <item href="contract.gif" id="contract" media-type="image/gif"/>
  </manifest>

  <spine toc="ncx">
    <itemref idref="cover" linear="no"/>
    <itemref idref="title"/>
    <itemref idref="contents"/>
    <itemref idref="foreword"/>
    <itemref idref="preface"/>
    <itemref idref="ch1"/>
    <itemref idref="ch1-1"/>
    <!-- more files commented out -->
  </spine>
</package>
```

## Proposed solution

Use [xmlbuilder2](https://www.npmjs.com/package/xmlbuilder2) to handle XML generation and [YAML](https://www.npmjs.com/package/js-yaml) to create the metadata section from a human-readable text file.

The project proposes a three-stage generator:

The first stage generates the metadata from a human-readable text file and produces the top of our XML file.

The second stage generates the manifest. This is the hardest part as we need to provide a generated id and the media type for each file. We also need to consider that there are only some types of files that we can use in the ebook by default.

The third stage is the spine. This is just a list of references to the manifest items by their IDs.

## Setting up the module imports and variables

Node projects need to import all the module dependencies before they are used. These include built-in Node modules like `fs` and `path` and third-party modules like `xmlbuilder2` and `js-yaml`.

I've chosen to work with ES2015 modules rather than Common JS as a learning tool.

```js
// Node built-in modules
import fs from 'fs';
import path from 'path';

// Third party modules
import { create } from 'xmlbuilder2';
import { v4 as uuidv4 } from 'uuid';
import * as yaml from 'js-yaml';
import mime from 'mime-types';
```

Before we start coding the tool itself, we need to set up the environment and the variables we will use

We first set the environment to the value of the `NODE_ENV` environment variable. We will use this to determine whether or not to log items to the console. As the script grows we may want to do things specific in the production or development mode and not in the other.

We capture the URLs for the namespaces we will use later when we build the XML document. This is where we would add additional namespaces as necessary.

The `bookid` variable holds a unique UUID generated from the uuidv4 package. This will be the unique ID for the book. For a commercial book, we will also need the `ISBN` or `IBSN-13` number.

`data` hold the result of parsing the YAML file holding our metadata information. `creators` is an array of all the creators (authors) of the book. To make the file more complete we should also add contributors, editors, translators, and other staff who worked on the book.

Finally, `manifestItems` and `spineItems` are placeholders for the data about the manifest and spine that we will generate in later sections.

```js
let environment = process.env.NODE_ENV

const dc = 'http://purl.org/dc/elements/1.1/';
const idpf = 'http://www.idpf.org/2007/opf';

const bookid = uuidv4();

let data = readMetadata();
let creators = Array.from(data.creators);

let manifestItems = [];
let spineItems = [];
```

## Building the metadata section

To work on the metadata section I chose to read the data from a [YAML](https://yaml.org/) file. This file is easy to read and edit and is a human-readable text file.

For example, the `metadata.yaml` file that I used to validate the project looks like this:

```yaml
---
title: "Chariots for Apollo: A History of Manned Lunar Spacecraft"
creators:
  - Courtney G. Brooks
  - James M. Grimwood
  - Loyd S. Swenson
date: 1979
publisher: "NASA History Office"
```

The Javascript code will read the YAML file and throw an error if there is any problem reading the file. We assign the content of the file was assigned to the `data` variable.

```js
function readMetadata() {
  try {
    let fileContents = fs.readFileSync('metadata.yaml', 'utf8');
    let data = yaml.load(fileContents);

    // console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
}
```

Now that we've read the file we have the data we need to build the metadata portion of the OPF document.

## Getting the data for the manifest

Getting the data for the manifest section of the file is more complicated. Because we don't know what the structure of the book is ahead of time, we need to capture the data we need on the fly.

The only assumption we make on this file is that whatever content we will use in the book will be in the `OEBPS` folder. This is the reason why the `readManifestFiles` folder uses a default value for the `dirPath` parameter

We read the directory specified in `dirPath` using [readdirSync](https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options) and then we iterate over the files in the directory. We use [statSync](https://nodejs.org/api/fs.html#fs_fs_statsync_path_callback) to get the file stats.

For each file we get, we check if it's a directory and if it is we call `readManifestFiles` again.

If it's a file we check that it's not `.DS_Store`.

We then open a second if block containing exceptions to the rule that an extension is 5 characters long. The code uses the [mime-types](https://www.npmjs.com/package/mime-types) module to do the mime type lookups.

If the file matches any of the indicated 4-characters-long extensions then we push a special value for the `@id` field; that's the only difference.

For all other files we push information about the file to the `manifestItems` array:

- `@id` is the name of the file minus its extension
- `@mime-type` is the mime type of the file that we get by running `mime.lookup` on the file name
- `@href` is the path to the file relative to the folder defined in the `dirPath` parameter

The `@` attribute in front of the variable names will tell the XML generator to treat these as attributes of the element we are generating.

```js
(function readManifestFiles(dirPath = 'OEBPS') {
  try {
    let files = fs.readdirSync(dirPath)

    manifestItems = manifestItems || []

    files.forEach(function (file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        manifestItems = readManifestFiles(dirPath + "/" + file, manifestItems)
      } else {

        if (!file.includes('.DS_Store')) {
          if (
            (mime.lookup(file) === 'application/x-dtbncx+xml')  ||
            (mime.lookup(file) === 'text/css')                  ||
            (mime.lookup(file) === 'image/svg+xml')             ||
            (mime.lookup(file) === 'image/jpg')                 ||
            (mime.lookup(file) === 'image/png')                 ||
            (mime.lookup(file) === 'image/gif')                 ||
            (mime.lookup(file) === 'image/jpeg')) {
            manifestItems.push(
              {
                '@id': file.slice(0, -4),
                '@mime-type': mime.lookup(file),
                '@href': path.join(dirPath, "/", file)
              },
            )
          } else {
            manifestItems.push(
              {
                '@id': file.slice(0, -5),
                '@mime-type': mime.lookup(file),
                '@href': path.join(dirPath, "/", file)
              },
            )
          }
        }
      }
    })

    return manifestItems
  } catch (e) {
    console.error(e)
  }
})();
```

We make this function an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) (Immediately Invoked Function Expression) so it runs as soon as it is defined.

## Generating the data for the spine

The function that collects the data for the spine is a simpler version of the code we used to get the manifest data.

It loops through the files at the root of the `dirPath` directory and pushes information to a separate `spineItems` array.

The only difference is that we have one file on the spine that requires special handling. The item with the `idref` of `cover` needs to have the `linear` attribute set to `no`.

To do that we check if the file name includes `cover` in the name and if it does we push the `linear` attribute with a value of `no` into the `spineItems` array.

Otherwise, we just push the `@idref` field with the file name minus the extension.

```js
(function readSpineFiles(dirPath = 'OEBPS') {
  try {
    let files = fs.readdirSync(dirPath)

    spineItems = spineItems || []

    files.forEach(function (file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        return
      } else {
        if (!file.includes('.DS_Store') && (!file.includes('style'))) {
          if (file.includes('cover')) {
            spineItems.push({
              '@idref': file.slice(0, -5),
              '@linear': 'no',
            })
          } else {
            spineItems.push(
              {
                '@idref': file.slice(0, -5),
              },
            )
          }
        }
      }
    })

    return spineItems
  } catch (e) {
    console.error(e)
  }
})();
```

Now that we have all the data we need, we can generate the OPF document.

## Generating the OPF document

The commands we use to create the OPF document use the [xmlbuilder2](https://www.npmjs.com/package/xmlbuilder2) package. In future iterations, I may push this code into its own function.

The code foes the following:

1. The `create` element creates the XML declaration
2. `ele` declarations create the elements that we need
    
    - They can have one or two arguments, the first argument is the namespace and the second is the element name
3. `att` declare the attributes for the element they are attached to.
    
    - They have two arguments. The first argument is the attribute name and the second is the attribute value
4. `txt` represent text nodes
    
    - They have a single attribute, the text to be added
5. `up` indicate the closing of the previously created element
    
    - **We should have matching numbers of `ele` and `up` declarations**

```js
let root = create({ version: '1.0' })
  .ele(idpf, 'package')
    .att('http://www.w3.org/2000/xmlns/', 'xmlns:dc', dc)
    .att('version', '2.0')
    .att('unique-identifier', bookid)
    .ele('metadata')
      .ele('meta')
        .att('content', 'cover-image')
        .att('name', 'cover')
      .up()
      .ele(dc, 'identifier')
        .att('id', 'bookid')
        .txt('urn:uuid:' + bookid)
      .up()
    .ele(dc, "title")
      .txt(`${data.title}`)
    .up()
    .ele({
      "dc:creator": creators
    })
    .up()
    .ele(dc, "published")
      .txt(`${data.date}`)
    .up()
    .ele(dc, "publisher")
      .txt(`${data.publisher}`)
    .up()
  .up()
  .ele('manifest')
    .ele({
      'item': manifestItems
    })
    .up()
  .up()
  .ele('spine')
    .ele({
      'itemref': spineItems
    })
    .up()
  .up()
.up();
const xml = root.end({ prettyPrint: true });
```

I want to highlight one use of the `ele` function. When you call it with brackets, it creates a set of elements based on external data.

This example will create one `item` element for each item in the `manifestItems` array with all the necessary attributes as defined in the array. Since the array defined all elements as attributes, the result is a properly formatted `item` element.

Because we don't hardcode the number of items, it will work with any number of items in the array.

```js
  .ele({
    'item': manifestItems
  })
  .up()
```

We do the same to create the spine children elements.

## Writing the XML content to a file

The final step is to actually write the XML content to a file. For that we use [writeFileSync](https://nodejs.org/api/fs.html#fs_fs_writefilesync_file_data_options).

```js
// write the result to a file in utf8
fs.writeFileSync(
  'content.opf', xml, 'utf8'
);
```

## Notes on usage

To use the generator do the following:

1. Install Node dependencies
2. Set NODE\_ENV to production
3. Copy your books OEBPS directory to the root of the generator project
4. Run the generator

```bash
npm i # 1
export NODE_ENV=production # 2
copy /path/to/your/book/OEBPS . # 3
node index.mjs # 4
```
