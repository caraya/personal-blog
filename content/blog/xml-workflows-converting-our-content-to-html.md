---
title: "XML workflows: Converting our content to HTML"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

One of the biggest advantages of working with XML is that we can convert the abstract tags into other markups. For the purposes of this project we'll convert the XML created to match the schema we just created to HTML and then use tools like [PrinceXML](http://www.princexml.com) or [AntenaHouse](http://www.antennahouse.com) we'll convert the HTML/CSS files to PDF

## Why HTML

HTML is the default format for the web and for most web/html based content such as ePub and Kindle. As such it makes a perfect candidate to explore how to generate it programmatically from a single source file.

HTML will also act as our source for using CSS paged media to create PDF content.

## Why PDF

Rather than having to deal with [XSL-FO](http://www.w3.org/TR/2006/REC-xsl11-20061205/), another XML based vocabulary to create PDF content, we'll use XSLT to create another HTML file and process it with [CSS Paged Media](http://dev.w3.org/csswg/css-page-3/) and the companion [Generated Content for Paged Media](http://www.w3.org/TR/css-gcpm-3/) specifications to create PDF content.

Where there is a direct equivalent between our model and the [HTML5.1 nightly specification](http://www.w3.org/html/wg/drafts/html/master/sections.html) I've quoted the relevant section of the HTML5 spec as a reference and as a rationale of why I've done things the way I did.

In this document we'll concentrate on the XSLT to HTML conversion and will defer converting HTML to PDF to a later article.

# Creating our conversion style sheets

To convert our XML into other formats we will use XSL Transformations (also known as XSLT) [version 2](http://www.w3.org/TR/xslt) (a W3C standard) and [version 3](http://www.w3.org/TR/xslt-30/) (a W3C last call draft recommendation) where appropriate.

XSLT is a functional language designed to transform XML into other markup vocabularies. It defines template rules that match elements in your source document and processing them to convert them to the target vocabulary.

In the XSLT template below, we do the following:

1. Declare the file as an XML document
2. Define the root element of the style sheet (xsl:stylesheet)
3. Indicate the namespaces that we'll use in the document and, in this case, tell the processor to exclude the given namespace
4. Strip whitespace from all elements and keep it in the code elements
5. Create the default output we'll use for the main document and all generated pages (discussed later)
6. Create a default template to warn us if we missed anything

```xml
<?xml version="1.0" ?>
<!-- Define stylesheet root and namespaces we'll work with -->
<xsl:stylesheet
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:epub="http://www.idpf.org/2007/opf"
  exclude-result-prefixes="dc epub"
  xml:lang="en-US"
  version="2.0">
  <!-- Strip whitespace from the listed elements -->
  <xsl:strip-space elements="*"/>
  <!-- And preserve it from the elements below -->
  <xsl:preserve-space elements="code"/>
  <!-- Define the output for this and all document children -->
  <xsl:output name="xhtml-out" method="xhtml" indent="yes" encoding="UTF-8" omit-xml-declaration="yes" />

  <!--
    Default template taken from http://bit.ly/1sXqIL8

    This will tell us of any unmatched elements rather than
    failing silently
  -->
  <xsl:template match="*">
    <xsl:message terminate="no">
      WARNING: Unmatched element: <xsl:value-of select="name()"/>
    </xsl:message>

    <xsl:apply-templates/>
  </xsl:template>

  <!-- More content to be added -->
</xsl:stylesheet>
```

This is a lot of work before we start creating our XSLT content. But it's worth doing the work up front. We'll see what are the advantages of doing it this way as we move down the style sheet.

Now to our root templates. The first one is the entry point to our document. It performs the following tasks:

1. Match the root element to create the skeleton for our HTML content
2. In the title we insert the value of the `metadata/title` element
3. In the body we 'apply' the templates that match the content inside our document (more on this later)

```xml
<!-- Root template, matching / -->
<xsl:template match="book">
  <html>
  <head>
    <xsl:element name="title">
      <xsl:value-of select="metadata/title"/>
    </xsl:element>
    <xsl:element name="meta">
      <xsl:attribute name="generator">
        <xsl:value-of select="system-property('xsl:product-name')"/>
        <xsl:value-of select="system-property('xsl:product-version')"/>
      </xsl:attribute>
    </xsl:element>
    <xsl:element name="meta">
      <xsl:attribute name="vendor">
        <xsl:value-of select="system-property('xsl:vendor-url')" />
      </xsl:attribute>
    </xsl:element>
    <xsl:element name="meta">
      <xsl:attribute name="vendor-URL">
        <xsl:value-of select="system-property('xsl:vendor-url')" />
      </xsl:attribute>
    </xsl:element>
    <link rel="stylesheet" href="css/style.css" />
    <xsl:if test="(code)">
      <!--
            Use highlight.js and docco style
          -->
      <link rel="stylesheet" href="css/styles/docco.css" />
      <!-- Load highlight.js -->
      <script src="lib/highlight.pack.js"></script>
      <script>
        hljs.initHighlightingOnLoad();
      </script>
    </xsl:if>
    <!--
      Comment this out for now. It'll become relevant when we add video
      <script src="js/script.js"></script>
    -->
  </head>
  <body>
    <xsl:apply-templates/>
    <xsl:apply-templates select="/" mode="toc"/>
  </body>
  </html>
</xsl:template>
```

We could build the CSS style sheet and JavaScript files as part of our root template but we chose not to.

Working with the style sheet as part of the XSLT style sheet allows the XSLT stylesheet designer to embed the style and parametrize the stylesheet, thus making the stylesheet customizable from the command line.

For all advantages, this method ties the styles for the project to the XSLT stylesheet and requires the XSLT stylesheet designer to remain involved in all CSS and JavaScript updates.

By linking to external CSS and JavaScript files we can leverage expertise independent of the Schema and XSLT style sheets. Book designers can work on the CSS, UX and experience designers can work on JavaScript and other CSS areas, book designers can work on the Paged Media style sheets and authors can just write.

Furthermore we can reuse our CSS and JavaScript on multiple documents.

## Table of contents

> The table of content template is under active development and will be different depending on the desired output. I document it here as it is right now but will definitely change as it's further developed.

There is a second template matching the root element of our document to create a table of content. At first thought this looks like the wrong approach

We leverage XSLT modes that allow us to create templates for the same element to perform different tasks. In `toc mode` we want the root template to do the following:

1. Create the section and nav and ol elements
2. Add the title for the table of contents
3. For each section element that is a child of root create these elements
    
    1. The `li` element
    2. The a element with the corresponding href element
    3. The value of the href element (a concatenation of the section's type attribute, the position within the document and the .html string)
    4. The title of the section as the 'clickable' portion of the link

```xml
<xsl:template match="/" mode="toc">
  <section data-type="toc"> (1)
    <nav class="toc"> (1)
      <h2>Table of Contents</h2>
      <ol>
        <xsl:for-each select="book/section">
          <xsl:element name="li"> (3.1)
            <xsl:element name="a"> (3.2)
              <xsl:attribute name="href"> (3.2)
                <xsl:value-of select="concat((@type), position(),'.html')"/> (3.3)
              </xsl:attribute>
              <xsl:value-of select="title"/> (3.4)
            </xsl:element>
          </xsl:element>
        </xsl:for-each>
      </ol>
    </nav>
  </section>
</xsl:template>
```

## Metadata and Section

With these templates in place we can now start writing the major areas of the document, `metadata` and `section`.

### Metadata

The metadata is a container for all the elements inside. As such we just create the div that will hold the content and call `xsl:apply-templates` to process the children inside the metadata element using the apply-template XSLT instruction. The template looks like this

```xml
<xsl:template match="metadata">
  <xsl:element name="div">
    <xsl:attribute name="class">metadata</xsl:attribute>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
```

### Section

The section template, on the other hand, is more complex because it has a lot of work to do. It is our primary unit for generating content fifiles, takes most of the same attributes as the root template and then processes the rest of the content.

Inside the template we first create a vairable to hold the name of the file we'll generate. The file name is a concatenation of the following elements:

- The type attribute
- The position in the document
- the string ".html"

The result-document element takes two parameters: the value of the file name variable we just defined and the xhtml-out format we defined at the top of the document. The XHTML format may look like overkill right now but it makes sense when we consider moving the generated content to ePub or other fomats where strict XHTML conformance is a requirement.

We start generating the skeleton of the page, we add the default style sheet and do the first conditional test of the document. Don't want to add stylesheets to the page unless they are needed so we test if there is a code element on the page and only add highlight.js related stylesheets and scripts.

In the body element we add a section element, the main wrapper for our content.

For the section we conditionally add attributes to the element. We use only add a data-type attribute to body if there is a type attribute in the source document. We do the same thing for id and class.

```xml
<xsl:template match="section">
  <!-- Variable to create section file names -->
  <xsl:variable name="fileName" select="concat((@type), (position()-1),'.html')"/>
  <!-- An example result of the variable above would be introduction1.xhtml -->
  <xsl:result-document href='{$fileName}' format="xhtml-out">
    <html>
      <head>
        <link rel="stylesheet" href="css/style.css" />
        <xsl:if test="(code)">
          <!--
            Use highlight.js and github style
          -->
          <link rel="stylesheet" href="css/styles/docco.css" />
          <!-- Load highlight.js -->
          <script src="lib/highlight.pack.js"></script>
          <script>
            hljs.initHighlightingOnLoad();
          </script>
        </xsl:if>
      </head>
      <body>
        <section>
          <xsl:if test="string(@type)">
            <xsl:attribute name="data-type">
              <xsl:value-of select="@type"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:if test="string(@class)">
            <xsl:attribute name="class">
              <xsl:value-of select="@class"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:if test="string(@id)">
            <xsl:attribute name="id">
              <xsl:value-of select="@id"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:apply-templates/>
        </section>
      </body>
    </html>
  </xsl:result-document>
</xsl:template>
```

## Metadata content

We process the content of the metadata separate than the structure. We take our primary metadata elements, ISBN and edition and wrap a paragraph tag around them. We can later reuse the element or change its appearance using CSS.

```xml
<xsl:template match="isbn">
  <p>ISBN: <xsl:value-of select="."/></p>
</xsl:template>

<xsl:template match="edition">
  <p>Edition: <xsl:value-of select="."/></p>
</xsl:template>
```

For authors we do the following:

1. For each individual in the group we take the first name and the surname
2. Wrap the name around an li element to build an unnumbered list. We can style the list with CSS later

For editors and other roles we do the same thing

1. For each individual in the group we take the first name and the surname
2. We concatenate the type/role to create a full title (production editor for example)
3. Wrap the name and the title with an li element that we can style with CSS later

```xml
<xsl:template match="metadata/authors">
  <h2>Authors</h2>
  <ul>
    <xsl:for-each select="author">
      <li>
        <xsl:value-of select="first-name"/>
        <xsl:text> </xsl:text>
        <xsl:value-of select="surname"/>
      </li>
    </xsl:for-each>
  </ul>
</xsl:template>

<xsl:template match="metadata/editors">
  <h2>Editorial Team</h2>
  <ul class="no-bullet">
    <xsl:for-each select="editor">
      <li>
        <xsl:value-of select="first-name"/>
        <xsl:text> </xsl:text>
        <xsl:value-of select="surname"/>
        <xsl:value-of select="concat(' - ', type, ' ', 'editor')"></xsl:value-of>
      </li>
    </xsl:for-each>
  </ul>
</xsl:template>

<xsl:template match="metadata/otherRoles">
  <h2>Production team</h2>
  <ul class="no-bullet">
    <xsl:for-each select="otherRole">
      <li>
        <xsl:value-of select="first-name" />
        <xsl:text> </xsl:text>
        <xsl:value-of select="surname" />
        <xsl:text> - </xsl:text>
        <xsl:value-of select="role" />
      </li>
    </xsl:for-each>
  </ul>
</xsl:template>
```

### Titles and headings

Headings are primarily used to create sections of content. We use the same heading levels as HTML with the addition of a `title` tag that also maps to a level 1 heading. We've put `title` and `h1` in separate templates to make it possible and easier to generate different code for each heading.

Working with XSLT is not the same as using CSS where you can declare rules for the same attribute multiple times (with the last one winning); when writing transformations you can only have one per element otherwise you will get an error (there are exceptions to the rule but let's not worry about that just yet.)

According to the spec:

> These elements \[h1 to h6\] represent headings for their sections. The semantics and meaning of these elements are defined in the section on headings and sections. These elements have a rank given by the number in their name. The h1 element is said to have the highest rank, the h6 element has the lowest rank, and two elements with the same name have equal rank. h1–h6 elements must not be used to markup subheadings, subtitles, alternative titles and taglines unless intended to be the heading for a new section or subsection. Instead use the markup patterns in the [Common idioms without dedicated elements](http://www.w3.org/html/wg/drafts/html/master/common-idioms.html#common-idioms) section of the specification. **_\- 4.3.6 The h1, h2, h3, h4, h5, and h6 elements, Berjon et al. 2013_**

All elements have the same attribute set: align, class and id.

The remaining headings, h2 through h6, all have the same attributes and the templates are structured the same way.

```xml
<xsl:template match="title ">
  <xsl:element name="h1">
    <xsl:if test="@align">
      <xsl:attribute name="align">
        <xsl:value-of select="@align"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:value-of select="."/>
  </xsl:element>
</xsl:template>

<xsl:template match="h1">
  <xsl:element name="h1">
    <xsl:if test="@align">
      <xsl:attribute name="align">
        <xsl:value-of select="@align"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:value-of select="."/>
  </xsl:element>
</xsl:template>
```

### Blockquotes, quotes and asides

Blockquotes, asides and quotes provide sidebar-like content on our document. According to the W3C:

> The blockquote element represents content that is quoted from another source, _optionally_ with a citation which must be within a footer or cite element, and _optionally_ with in-line changes such as annotations and abbreviations. Content inside a blockquote other than citations and in-line changes _must_ be quoted from another source, whose address, if it has one, _may_ be cited in the cite attribute. \[emphasis mine\] **_\- 4.51 the Blockquote element , Berjon et al. 2013_**

The cite HTML provides attribution to the blockquote it is used in. To prevent confusion and to make it's meaning clear the document model uses the `attribution` tag instead, their purpose is identical and during the transformation the attribution will become a `cite` element. According to spec:

> The cite element represents a reference to a creative work. It must include the title of the work or the name of the author (person, people or organization) or an URL reference, which may be in an abbreviated form as per the conventions used for the addition of citation metadata. \[emphasis mine\] **_\- 4.51 the Cite element , Berjon et al. 2013_**

```xml
<xsl:template match="blockquote">
  <xsl:element name="blockquote">
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates />
  </xsl:element>
</xsl:template>

<!-- BLOCKQUOTE ATTRIBUTION-->
<xsl:template match="attribution">
  <xsl:element name="cite">
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
```

The `q` element is the inline equivalent to `blockquote` and has been replaced in our markup by the `quote` element. As stated in the HTML5 specification:

> The q element represents some phrasing content quoted from another source. Quotation punctuation (such as quotation marks) that is quoting the contents of the element must not appear immediately before, after, or inside q elements; they will be inserted into the rendering by the user agent. Content inside a q element must be quoted from another source, whose address, if it has one, may be cited in the cite attribute. The source may be fictional, as when quoting characters in a novel or screenplay. If the cite attribute is present, it must be a valid URL potentially surrounded by spaces. To obtain the corresponding citation link, the value of the attribute must be resolved relative to the element. User agents may allow users to follow such citation links, but they are primarily intended for private use (e.g. by server-side scripts collecting statistics about a site's use of quotations), not for readers. The q element must not be used in place of quotation marks that do not represent quotes; for example, it is inappropriate to use the q element for marking up sarcastic statements. The use of q elements to mark up quotations is entirely optional; using explicit quotation punctuation without q elements is just as correct. **_\- 4.5.7 The q element, Berjon et al. 2013_**

```xml
<xs:element name="quote">
<xs:complexType mixed="true">
  <xs:attribute name="cite" type="xs:anyURI" use="optional"/>
  <xs:attributeGroup ref="genericPropertiesGroup"/>
</xs:complexType>
</xs:element>
```

Asides are primarily used fpr content realted to the main flow of the document. I use it mostly for notes indirectly related to the main content, for example, to explain that there are other ways to generate Schemas apart from W3C's Schema. It is good to know this but it won't change the information in the main content flow.

Per Spec:

> The aside element represents a section of a page that consists of content that is tangentially related to the content around the aside element, and which could be considered separate from that content. Such sections are often represented as sidebars in printed typography. The element can be used for typographical effects like pull quotes or sidebars, for advertising, for groups of nav elements, and for other content that is considered separate from the main content of the page. **_\- 4.3.5 The aside element, Berjon et al. 2013_**

```xml
<xsl:template match="aside">
  <aside>
    <xsl:if test="type">
      <xsl:attribute name="data-type">
        <xsl:value-of select="@align"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </aside>
</xsl:template>
```

### Div and Span

div and span elements are neutral, they don't have meaning on their onw but they can get their meaning from attributes such as `class`, `data-*`, and `id`. Divs are meant as block level elements and siblings or children to sections where `span` is used inline, like a child to our `para` elements.

According to the specification:

> The div element has no special meaning at all. It represents its children. It can be used with the class, lang, and title attributes to mark up semantics common to a group of consecutive elements. Authors are strongly encouraged to view the div element as an element of last resort, for when no other element is suitable. Use of more appropriate elements instead of the div element leads to better accessibility for readers and easier maintainability for authors. **_\- 4.4.14 The div element, Berjon et al. 2013_**

```xml
<xsl:template match="div">
  <xsl:element name="div">
    <xsl:if test="@align">
      <xsl:attribute name="align">
        <xsl:value-of select="@align"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
```

The span element on its own is meaningless. We can give it meaning with the attributes we pass to it. We can give it a class or id for CSS styling or a type to generate semantic meaning for the contained text.

When we start working on an ePub implementation we can also add the epub:type attribute to create an even more detailed semantic map of our content.

> The span element doesn't mean anything on its own, but can be useful when used together with the global attributes, e.g. class, lang, or dir. It represents its children. **_\- 4.5.28 The span element, Berjon et al. 2013_**

```xml
<xsl:template match="span">
  <xsl:element name="span">
    <xsl:if test="@type">
      <xsl:attribute name="data-type">
        <xsl:value-of select="@type"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:value-of select="."/>
  </xsl:element>
</xsl:template>
```

### Paragraphs

The paragraph is our basic unit of content. Paragraphs are usually represented as blocks of text but they can be styled anyway we choose with the proper CSS.

```xml
<xsl:template match="para">
  <xsl:element name="p">
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
```

### Styles

Styles are used to indicate typograhical styles such as strong, emphsis, strikethrough and underline.

```xml
<xsl:template match="strong">
  <strong><xsl:apply-templates /></strong>
</xsl:template>
```

Since we're working with print and visual media only we use only `strong` to indicate bold elements. I've never understood how do strong and `b` work in screen and printed pages or in screen displays.

May have to implement `b` when developing the accessibility component for the document schema.

```xml
<xsl:template match="emphasis">
  <em><xsl:apply-templates/></em>
</xsl:template>
```

As with strong, I've decided to only use `emphasis` to indicate italics and save `i` for a future revision when, and if, it becomes necessary

```xml
<xsl:template match="strike">
  <strike><xsl:apply-templates/></strike>
</xsl:template>
```

Although the strikethrough element has been deprecated in the HTML5 standard, it's still worth having as it can also be the target for CSS that accomplishes the same goal.

The CSS way is to assign a `text-decoration: line-through` instruction to the strike selector.

```xml
<xsl:template match="underline">
  <u><xsl:apply-templates/></u>
</xsl:template>
```

While there is a `u` element it has different semantics than underline. Like strike the correct way to do it is with CSS; in this case using `text-decoration: underlike` for the chosen element.

## Links and anchors

Links are the essence of the web. They allow you to navigate within the document you're in or move to external documents. I've taken shortcuts and made the label attribute (used for accessibility) and the content of the link the same text. This reduced the ammount of typing we have to do but run the risk of becoming too inflexible.

```xml
<xsl:template match="link">
  <xsl:element name="a">
    <xsl:if test="(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:attribute name="href">
      <xsl:value-of select="@href"/>
    </xsl:attribute>
    <xsl:attribute name="label">
      <xsl:value-of select="@label"/>
    </xsl:attribute>
    <xsl:value-of select="@label"/>
  </xsl:element>
</xsl:template>
```

When working with links there are times when we want to link to sections within the same document or to specific sections in another document or to specific sections inside a paragraph or to a figure. To do this we need anchors that will resolve to the following HTML:

\[code lang=html\]

````
The transformation element looks like this:

```xml
<xsl:template match="anchor">
  <xsl:element name="a">
    <xsl:attribute name="id">
    </xsl:attribute>
  </xsl:element>
</xsl:template>
</code></pre>

Not sure if I want to make this an empty element or not

Most if not all the elements in our document model can use the id attribute so there is no realy need for the anchor element.

However the empty element <anchor id="home"/> appeals to my ease of use paradigm but it may not be as easy to understand for peope who are not familiar with XML empty elements

<h2>Code blocks</h2>

Code elements create <a href="https://help.github.com/articles/github-flavored-markdown/#fenced-code-blocks">fenced code blocks</a> like the ones from <a href="https://help.github.com/articles/github-flavored-markdown/">Github Flavored Markdown</a>.

We use <a href="https://www.google.com/fonts/specimen/Source+Code+Pro">Adobe Source Code Pro</a> font. It's a clean and readable font designed specifically for source code display.

We highlight our code with <a href="https://highlightjs.org/">Highlight.js</a>. This makes the class attribute mandatory as we need it to tell highlight.js what syntax library to use

<pre><code class="language-xml"><xsl:template match="code">
  <xsl:element name="pre">
    </xsl:element><xsl:element name="code">
      <xsl:attribute name="class">
        <xsl:value-of select="@language"/>
      </xsl:attribute>
      <xsl:value-of select="."/>
    </xsl:element>

</xsl:template>
</code></pre>

<h2>Lists and list items</h2>

When I first conceptualized this project I had designed a single list element and attributes to produce bulleted and numbered lists. This proved to difficult to implement so I went back to two separate elements: <code>ulist</code> for bulleted lists and <code>olist</code> for  numbered lists.

Both elements share the <code>item</code> element to indicates the items inside the list. At least one item is required a list.

<pre><code class="language-xml"><xsl:template match="ulist">
  <xsl:element name="ul">
    <xsl:if test="string(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="string(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>

<xsl:template match="olist">
  <xsl:element name="ol">
    <xsl:if test="string(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="string(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>

<xsl:template match="item">
  <xsl:element name="li">
    <xsl:if test="string(@class)">
      <xsl:attribute name="class">
        <xsl:value-of select="@class"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:if test="string(@id)">
      <xsl:attribute name="id">
        <xsl:value-of select="@id"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:value-of select="."/>
  </xsl:element>
</xsl:template>
</code></pre>

<h2>Figures and Images</h2>

<blockquote>
  The figure element represents some flow content, optionally with a caption, that is self-contained (like a complete sentence) and is typically referenced as a single unit from the main flow of the document.
  
  The element can thus be used to annotate illustrations, diagrams, photos, code listings, etc.
  
  A figure element's contents are part of the surrounding flow. If the purpose of the page is to display the figure, for example a photograph on an image sharing site, the figure and figcaption elements can be used to explicitly provide a caption for that figure. For content that is only tangentially related, or that serves a separate purpose than the surrounding flow, the aside element should be used (and can itself wrap a figure). For example, a pull quote that repeats content from an article would be more appropriate in an aside than in a figure, because it isn't part of the content, it's a repetition of the content for the purposes of enticing readers or highlighting key topics.
  
  <strong><em>- 4.4.11 The figure element, Berjon et al. 2013</em></strong>
</blockquote>

Figures, captions and the images inside present a few challenges. Because we allow authors to set height and width on both figure and the image inside we may find situations where the figure container is narrower than the image inside.

To avoid this issue we test whether the figure width value is smaller than the width of the image inside. If it is, we use the width of the image as the width of the figure, otherwise we use the width of the image inside.

We do the same thing for height in order to avoid squished images of captions that draw over the image because it's too small. If the height of the figure is smaller than the height of the image we use the height of the image, otherwise we use the height of the figure element.

For both height and width we concatenate the attribute value with the string 'px' to make sure that it works in both straight CSS and with Prince and other CSS PDF generators

Alignments can be different, it is possible to have a right-aligned image to live inside a centered container.

The data model for our content allows both figures and images to be used in the document. This is so we don't have to insert empty captions to figures just so we can add an image. If we don't want a caption we can insert the image directly on our document.

Contrary to the HTML specification we use figure only to display images. We have a specialized template to address code blocks for program listings and can create additional elements

```xml

  
    
      
        
      
    
    
      
        
      
    
    
      
        
          
        
      
      
        
          
        
      
    
    
      
        
          
        
      
      
        
          
        
      
    
    
      
        
      
    
    
    
  









  
    
      
    
    
      
    
    
      
        
      
    
    
      
        
      
    
    
      
        
      
    
    
      
        
      
    
    
      
        
      
    
  

```
````
