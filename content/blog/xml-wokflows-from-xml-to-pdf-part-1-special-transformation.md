---
title: "XML Wokflows: From XML to PDF: Part 1:  Special Transformation"
date: "2015-02-11"
categories: 
  - "technology"
  - "tools-projects"
  - "xml-workflow"
---

Rather than having to deal with [XSL-FO](http://www.w3.org/TR/2006/REC-xsl11-20061205/), another XML based vocabulary to create PDF content, we'll use XSLT to create another HTML file and process it with [CSS Paged Media](http://dev.w3.org/csswg/css-page-3/) and the companion [Generated Content for Paged Media](http://www.w3.org/TR/css-gcpm-3/) specifications to create PDF content.

I'm not against XSL-FO but the structure of document is not the easiest or most intuitive. An example of XSL-FO looks like this:

```markup
<?xml version="1.0" encoding="iso-8859-1"?> (1)

<fo:root xmlns:fo="http://www.w3.org/1999/XSL/Format"> (2)
  <fo:layout-master-set> (3)
    <fo:simple-page-master master-name="my-page">
      <fo:region-body margin="1in"/>
    </fo:simple-page-master>
  </fo:layout-master-set>

  <fo:page-sequence master-reference="my-page"> (4)
    <fo:flow flow-name="xsl-region-body"> (5)
      <fo:block>Hello, world!</fo:block> (6)
    </fo:flow>
  </fo:page-sequence>
</fo:root>
```

1. This is an XML declaration. XSL FO (XSLFO) belongs to XML family, so this is obligatory.
2. Root element. The obligatory namespace attribute declares the XSL Formatting Objects namespace.
3. Layout master set. This element contains one or more declarations of page masters and page sequence masters — elements that define layouts of single pages and page sequences. In the example, I have defined a rudimentary page master, with only one area in it. The area should have a 1 inch margin from all sides of the page.
4. Page sequence. Pages in the document are grouped into sequences; each sequence starts from a new page. Master-reference attribute selects an appropriate layout scheme from masters listed inside `<fo:layout -master-set>`. Setting master-reference to a page master name means that all pages in this sequence will be formatted using this page master.
5. Flow. This is the container object for all user text in the document. Everything contained in the flow will be formatted into regions on pages generated inside the page sequence. Flow name links the flow to a specific region on the page (defined in the page master); in our example, it is the body region.
6. Block. This object roughly corresponds to `<div>` in HTML, and normally includes a paragraph of text. I need it here, because text cannot be placed directly into a flow.

Rather than define a flow of content and then the content CSS Paged Media uses a combination of new and existing CSS elements to format the content. For example, to define default page size and then add elements to chapter pages looks like this:

```css
@page {
  size: 8.5in 11in;
  margin: 0.5in 1in;
  /* Footnote related attributes */
  counter-reset: footnote;
  @footnote {
    counter-increment: footnote;
    float: bottom;
    column-span: all;
    height: auto;
    }
  }

@page chapter {
  @bottom-center {
    vertical-align: middle;
    text-align: center;
    content: element(heading);
  }
}
```

The only problem with the code above is that there is no native broser support. For our demonstration we'll use Prince XML to tanslate our HTML/CSS file to PDF. In the not so distant future we will be able to do this transformation in the browser and print the PDF directly. Until then it's a two step process: Modifying the HTML we get from the XML file and running the HTML through Prince to get the PDF.

## Modifying the HTML results

We'll use this opportunity to create an xslt customization layer to make changes only to the templates where we need to.

We create a customization layer by importing the original stylesheet and making any necessary changes in the new stylesheet. Imported stylesheets have a lower precedence order than the local version so the local version will win if there is conflict.

Only the templates defined in this stilesheet are overriden. If the template we use is not in this customization layer, the transformation engine will use the template in the base style sheet (book.xsl in this case)

The style sheet is broken by templates and explained below.

```markup
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  version="2.0">
  <!-- First import the base stylesheet -->
  <xsl:import href="book.xsl"/>

  <!-- Define the output for this and all document children -->
  <xsl:output name="xhtml-out" method="xhtml"
    indent="yes" encoding="UTF-8" omit-xml-declaration="yes" />
```

The first difference in the customization layer is that it imports another style sheet (`book.xsl`). We do this to avoid having to copy the entire style sheet and, if we make changes, having to make the changes in multiple places.

We will then override the templates we need in order to get a single file to pass on to Prince or any other CSS Print Processor.

```markup
  <!-- Root template matching book -->
  <xsl:template match="book">
    <html>
      <head>
        <xsl:element name="title">
          <xsl:value-of select="metadata/title"/>
        </xsl:element>
        <!-- Load Typekit Font -->
        <script src="https://use.typekit.net/qcp8nid.js"></script>
        <script>try{Typekit.load();}catch(e){}</script>
        <!-- Paged Media Styles -->
        <link rel="stylesheet" href="css/pm-style.css" />
        <!--
          Load Paged Media definitions just so I won't forget it again
        -->
        <link rel="stylesheet" href="css/paged-media.css"/>
        <!--
              Use highlight.js and style
        -->
        <xsl:if test="(code)">
          <link rel="stylesheet" href="css/styles/railscasts.css" />
          <!-- Load highlight.js -->
          <script src="lib/highlight.pack.js"></script>
          <script>
            hljs.initHighlightingOnLoad();
          </script>
        </xsl:if>
        <!-- <script src="js/script.js"></script> -->
      </head>
      <body>
        <xsl:attribute name="data-type">book</xsl:attribute>
          <xsl:element name="meta">
            <xsl:attribute name="generator">
              <xsl:value-of select="system-property('xsl:product-name')"/>
              <xsl:value-of select="system-property('xsl:product-version')"/>
            </xsl:attribute>
          </xsl:element>
        <xsl:apply-templates select="/" mode="toc"/>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
```

Most of the root template deals with undoing some of the changes we made to create multiple pages.

We've changed the CSS we use to process the content. We use paged-media.css to create the content for our media files, mostly setting up the different pages based on the data-type attribute.

We use pm-styles.css to control the style of our documents specifically for our printed page application. We have to take into account the fact that Highlight.js is not working properly with Prince's Javascript implementation and that there are places where we don't want our paragraphs to be indented at all.

We moved elements from the original section templates. We test whether we need to add the Highlight.JS since we dropped the multipage output.

## Overriding the section template

Sections are the element type that got the biggest makeover. What we've done:

- Remove filename variable. It's not needed
- Remove the result document element since we are building a single file with all our content
- Change way we check for the type attribute in sections. It will now terminate with an error if the attribute is not found
- Add the element that will build our running footer (p class="rh") and assign the value of the secion's title to it

```markup
  <!-- Override of the section template.-->
  <xsl:template match="section">
    <section>
      <xsl:choose>
        <xsl:when test="string(@type)">
          <xsl:attribute name="data-type">
            <xsl:value-of select="@type"/>
          </xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:message terminate="yes">
            Type attribute is required for paged media. 
            Check your section tags for missing type attributes
          </xsl:message>
        </xsl:otherwise>
      </xsl:choose>
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
      <!-- 
        Running header paragraph.  

        This will be take out of the regular flow of text so 
        it doesn't matter if we add it or not
      -->
      <xsl:element name="p">
        <xsl:attribute name="class">rh</xsl:attribute>
        <xsl:value-of select="title"/>
      </xsl:element> <!-- closses rh class -->
      <xsl:apply-templates/>
    </section>
  </xsl:template>
```

## Metadata

The Metadata section has been reworked into a new section with the title data-type. We set up the container section and assign title to the data-type attribute. We then apply all children templates.

```markup
<!-- Metadata -->
<xsl:template match="metadata">
  <xsl:element name="section">
    <xsl:attribute name="data-type">titlepage</xsl:attribute>
    <xsl:apply-templates/>
  </xsl:element>
</xsl:template>
```

## Table of contents

The table of content creates anchor links (a href='#id') to the title h1 tags we create in the step below. We can do it this way because XSLT guarantees that all calls to generate-id for a given element (in this case the section/title elements) will return the same value for a given execution.

```markup
<!-- Create Table of Contents ... work in progress -->
<xsl:template match="toc">
  <section data-type="toc">
    <h1>Table of Contents</h1>
    <nav>
      <ol>
        <xsl:for-each select="//section">
          <xsl:element name="li">
            <xsl:element name="a">
              <xsl:attribute name="href">
                <xsl:value-of select="concat('#', generate-id(.))"/>
              </xsl:attribute>
              <xsl:value-of select="title"/>
            </xsl:element>
          </xsl:element>
        </xsl:for-each>
      </ol>
    </nav>
  </section>
</xsl:template>
```

## Titles

The table of content is commented for now as I work on improving the content and placement of the table contents in the final document.

The title element has only one addition. We add an ID attribute created using XPath's generate-id function on the parent section element.

```markup
  <xsl:template match="title">
    <xsl:element name="h1">
      <xsl:attribute name="id">
        <xsl:value-of select="generate-id(..)"/>
      </xsl:attribute>
      <xsl:if test="string(@align)">
        <xsl:attribute name="align">
          <xsl:value-of select="@align"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:if test="string(@class)">
        <xsl:attribute name="class">
          <xsl:value-of select="@class"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:value-of select="."/>
    </xsl:element> <!-- closes h1 -->
  </xsl:template>
</xsl:stylesheet>
```

With all this in place we can now look to the CSS Paged Media file.
