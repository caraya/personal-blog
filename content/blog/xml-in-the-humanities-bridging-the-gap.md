---
title: XML in the Humanities - bridging the gap
date: 2026-01-19
tags:
  - Digital Humanities
  - XML
---

My background is in humanities and I've never stopped researching how to integrate technology into humanities research. XML has been a core technology in this space for decades.

In this post, I will explore why XML remains relevant for humanities scholars, what it is, and how to use it effectively.

## Is XML a good tool for humanities?

Yes, absolutely. XML (eXtensible Markup Language) is currently the undisputed "gold standard" for text-based Digital Humanities (DH) research and long-term digital preservation.

While newer, lightweight formats like JSON (JavaScript Object Notation) currently dominate modern web development and API data transfer, XML remains superior for the humanities. This is because XML excels at handling semi-structured data.

Most humanities data—novels, historical manuscripts, legal codes, and poetry—is rarely as rigid or tabular as a spreadsheet row or a relational database table. Instead, it possesses:

* **Deep Hierarchy**: A poem is contained within a section, within a chapter, within a book.
* **Mixed Content**: Text often flows around metadata; for example, a sentence might contain a date, a person's name, and a footnote reference all woven together.
* **Overlapping Structures**: A physical page break might occur in the middle of a logical sentence.

XML allows you to model these complexities precisely where other formats fail, acting as a bridge between the ambiguity of human language and the rigidity of machine processing.

## What is XML?

XML stands for eXtensible Markup Language. It is a text-based format derived from SGML (Standard Generalized Markup Language) designed to store and transport data.

* **Markup**: It uses "tags" (keywords enclosed in angle brackets < >) to wrap around data. These tags describe what that data is, rather than what it looks like.
* **Extensible**: Unlike HTML, which has a fixed, finite set of tags (like `<p>` for paragraph or `<div>` for division), XML allows—and encourages—you to invent your own tags. If you are studying 19th-century ship logs, you can invent tags like `<shipName>`, `<windSpeed>`, or `<cargoType>` to suit your specific research material.
* **Hierarchical (The Tree Model)**: XML structures data in a strict "tree" format consisting of parents, children, and siblings. This perfectly mirrors the nested structure of physical books (Book > Chapter > Paragraph > Sentence) or linguistic structures (Sentence > Clause > Phrase > Word).

### The Core Concept: Semantics vs. Presentation

In a word processor like Microsoft Word, you might make text bold to indicate it is important. Visually, the reader understands this, but a computer only sees "bold text"—it doesn't know why it is bold. It could be a heading, a warning, or a shout.

In XML, you explicitly tag the semantic meaning: `<important type="warning">`. This separates the content (the data) from the display (the presentation). This separation allows you to process that single source of information in unlimited ways:

* **Web**: Render it in red text.
* **Voice Assistant**: Read it with increased volume.
* **Database**: Extract it to count how many "warnings" occur in the text.

## What would you use it for?

In the humanities, scholars use XML primarily for Text Encoding, Data Preservation, and Interchange.

### Digital Editions (TEI)

The most widespread use case in DH is creating "Digital Scholarly Editions." A scholar might take a physical manuscript from the 18th century and transcribe it into XML to make it accessible and searchable.

* **Preserving Metadata (The Header)**: Every XML file can have a header section detailing the provenance. Who wrote it? When? Who transcribed it? Where is the original physical object held?
* **Annotating Content (Named Entity Recognition)**: You can mark specific entities within the text to turn strings of characters into data points.

Example: `<persName ref="#napoleon">Napoleon</persName>` links the text string "Napoleon" to a database entry for the historical figure.

Example: `<placeName>Waterloo</placeName>` allows for geographic mapping.

Example: `<date when="1815-06-18">June 18, 1815</date>` normalizes "June 18" into a machine-readable ISO format.

* **Handling Variants (Critical Apparatus)**: If two versions of a poem exist (e.g., a draft vs. a published version), XML can store both in the same file using a `<app>` (apparatus) tag, allowing readers to dynamically switch between versions or view them side-by-side.

### Archival Description (EAD)

Archives and libraries use XML (specifically the EAD or Encoded Archival Description standard) to create "finding aids." A finding aid describes a collection of documents. Because archival collections are hierarchical (Collection > Series > Box > Folder > Item), XML is the perfect data structure. Using EAD allows researchers to search across thousands of archives globally (like the "ArchiveGrid") because they all use the same underlying XML structure to describe their holdings.

### Linguistic Analysis

Linguists use XML to tag speech or text corpora. This often involves "POS tagging" (Part-of-Speech tagging). XML keeps the original word connected to its grammatical metadata in a structured way.

Example: `<w lemma="be" pos="VERB">is</w>`

This allows a researcher to search for all forms of the verb "to be" (is, are, was, were) instantly.

## What technologies are out there?

XML is not just a file format; it is a family of technologies known as the "X-Stack." To work with XML effectively, you need to understand the ecosystem that supports it.

### The Standards (Schemas)

You rarely "freestyle" XML in professional DH work. Instead, you follow a standard schema—a strict rulebook that defines exactly what tags you can use and where they can go. This ensures that data is consistent and can be shared between institutions.

* [TEI (Text Encoding Initiative)](https://tei-c.org/): The dominant standard for literature, history, and linguistics. It provides a massive, modular vocabulary of tags for almost every textual phenomenon (drama, poetry, dictionaries, manuscripts). See the full [TEI Guidelines (P5)](https://tei-c.org/guidelines/).
* [EAD (Encoded Archival Description)](https://www.loc.gov/ead/): The international standard for archives. Maintained by the Library of Congress and the Society of American Archivists.
* [MEI (Music Encoding Initiative)](https://music-encoding.org/): Designed for musical notation. It allows for the encoding of the semantic structure of music (notes, pitch, duration) as well as layout and performance data.
* **Schema Languages**: These are the technical languages used to write the "rulebooks" that validate your XML files:
  * [Relax NG](https://relaxng.org/): Often preferred in DH for its flexibility, readability, and ability to handle "mixed content" (text and tags mixed together) cleanly.
  * [W3C XML Schema (XSD)](https://www.w3.org/XML/Schema): The strict industry standard, often used for data exchange between software systems. It is more verbose than Relax NG.
  * [DTD (Document Type Definition)](https://en.wikipedia.org/wiki/Document_type_definition): The original schema language built into the XML specification. It is now largely legacy but still found in older projects.

### The Processors

Once you have XML data, you need tools to query and transform it.

* [XPath (XML Path Language)](https://www.w3.org/TR/xpath-31/): A navigation language. It allows you to point to specific parts of an XML document using a path-like syntax.
  * Example: `/book/chapter/title` selects all titles that are children of chapters.
  * Example: `//note[@type='editorial']` selects all notes anywhere in the document that have the attribute type="editorial".
* [XSLT (Extensible Stylesheet Language Transformations)](https://www.w3.org/TR/xslt-30/): A powerful functional programming language designed specifically to transform XML into other text formats. It is the engine that converts your TEI XML into:
  * HTML for a website.
  * XSL-FO / PDF for a printable book.
  * CSV / JSON for data analysis.
* [XQuery](https://www.w3.org/TR/xquery-31/): A query language (similar to SQL) designed to search large collections of XML files or native XML databases (like eXist-db or BaseX).

### Programming Languages & Tools

You need a mix of specialized domain tools and general-purpose languages.

#### The "Must-Haves"

* XSLT (The Language): You cannot effectively work in text-based DH without XSLT. It is the primary method for "publishing" XML data.
* [Oxygen XML Editor](https://www.oxygenxml.com/): While this is paid proprietary software, it is the absolute industry standard IDE for XML. It provides:
  * Real-time validation against schemas.
  * "Author Mode" (a Word-like visual interface for editing XML tags).
  * Built-in tools for running XSLT and XQuery.

#### General Purpose Languages

* Python: The best language for statistical analysis, text mining, and "data wrangling" of XML.
  * Library: lxml is the high-performance standard. It binds to C libraries, making it incredibly fast for parsing huge XML trees.
  * Library: BeautifulSoup is a popular web-scraping library. It is easier for beginners but is significantly slower and less strict about XML standards than lxml.
* JavaScript / TypeScript: Essential if you want to build interactive web frontends that load XML data directly in the browser (client-side rendering).

## Examples: How to use XML technologies

Here is a practical workflow scenario: Digitizing a historical letter for a web archive.

### Step 1: The XML Data (The Source)

We use a TEI-compliant structure to encode a letter. Note the use of attributes (xml:id, ref) to add semantic depth that isn't visible in the plain text. We capture metadata in the teiHeader and the content in the text body.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Letter from Ada Lovelace to Charles Babbage</title>
        <author>Ada Lovelace</author>
      </titleStmt>
      <publicationStmt>
        <p>Digital Humanities Demo Project, 2025</p>
      </publicationStmt>
      <sourceDesc>
        <msDesc>
           <msIdentifier>
              <repository>British Library</repository>
              <idno>Add MS 37192</idno>
           </msIdentifier>
        </msDesc>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <opener>
        <dateline>
          <!-- We link the place name to an ID for mapping later -->
          <placeName ref="#london" xml:id="pl_01">London</placeName>,
          <!-- We normalize the date to ISO 8601 format -->
          <date when="1843-07-10">10th July 1843</date>
        </dateline>
        <salute>Dear <persName ref="#babbage">Babbage</persName>,</salute>
      </opener>

      <p>I am working very hard on the <term type="mathematical">Bernoulli Numbers</term>.</p>

      <p>Do not forget to send the <del>books</del> <add>diagrams</add> by Tuesday.</p>

      <closer>
        <signed>Yours, <persName ref="#ada">A.L.</persName></signed>
      </closer>
    </body>
  </text>
</TEI>
```

### Step 2: XSLT (The Transformation)

Browsers do not know how to display `<persName>` or `<del>`. We write an XSLT stylesheet to transform these custom XML tags into standard HTML tags. This script matches specific TEI elements and outputs corresponding HTML5 elements with CSS classes for styling.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns:tei="http://www.tei-c.org/ns/1.0">

  <!-- Output configuration: we want clean HTML5 -->
  <xsl:output method="html" indent="yes" html-version="5.0"/>

  <!-- Match the root of the document -->
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="//tei:title"/></title>
        <style>
          .person { color: darkred; font-weight: bold; cursor: pointer; }
          .deletion { text-decoration: line-through; color: gray; }
          .addition { vertical-align: super; font-size: 0.8em; color: green; }
        </style>
      </head>
      <body>
        <article>
            <h1><xsl:value-of select="//tei:title"/></h1>
            <div class="metadata">
                Source: <xsl:value-of select="//tei:repository"/>
            </div>
            <hr/>
            <div class="letter-content">
              <xsl:apply-templates select="//tei:body"/>
            </div>
        </article>
      </body>
    </html>
  </xsl:template>

  <!-- Transform 'p' tags to HTML paragraphs -->
  <xsl:template match="tei:p">
    <p class="text-paragraph"><xsl:apply-templates/></p>
  </xsl:template>

  <!-- Transform deletions to strike-through -->
  <xsl:template match="tei:del">
    <span class="deletion"><xsl:apply-templates/></span>
  </xsl:template>

  <!-- Transform additions to superscript -->
  <xsl:template match="tei:add">
    <span class="addition"><xsl:apply-templates/></span>
  </xsl:template>

  <!-- Transform person names into interactive spans with tooltips -->
  <xsl:template match="tei:persName">
    <span class="person" title="ID: {@ref}">
        <xsl:apply-templates/>
    </span>
  </xsl:template>

</xsl:stylesheet>
```

### Step 3: Python (The Analysis)

If you have a corpus of 1,000 such letters, reading them manually is impossible. We use Python to analyze the XML tree programmatically. The lxml library is preferred here for its speed and full XPath 1.0 support.

```python
from lxml import etree
import collections

# Load the XML file
# In a real scenario, you would loop through a folder of .xml files
tree = etree.parse("letter.xml")

# Define the namespace map (TEI uses a specific namespace URL)
ns = {'tei': '[http://www.tei-c.org/ns/1.0](http://www.tei-c.org/ns/1.0)'}

# 1. Extract the Normalized Date
# XPath: Look for 'date' inside 'dateline' and get the 'when' attribute
try:
    date = tree.xpath('//tei:dateline/tei:date/@when', namespaces=ns)[0]
    print(f"Date of letter: {date}")
except IndexError:
    print("Date not found in document.")

# 2. Extract and Count People
# XPath: Find the text inside all 'persName' tags
people_names = tree.xpath('//tei:persName/text()', namespaces=ns)
# XPath: Find the normalized IDs inside the 'ref' attribute
people_ids = tree.xpath('//tei:persName/@ref', namespaces=ns)

print(f"People mentioned (Text): {people_names}")
print(f"People IDs (Normalized): {people_ids}")

# Simple frequency analysis
counter = collections.Counter(people_ids)
print(f"Most frequent person ID: {counter.most_common(1)}")

# Output:
# Date of letter: 1843-07-10
# People mentioned (Text): ['Babbage', 'A.L.']
# People IDs (Normalized): ['#babbage', '#ada']
# Most frequent person ID: [('#babbage', 1)]
```

### Step 4: Web Display (TypeScript)

For modern web applications (React, Vue, Angular), you might not want to pre-convert everything to HTML using XSLT on the server. Instead, you can fetch the raw XML and parse it directly in the browser's memory using the DOMParser API. This allows for dynamic filtering and client-side interactivity.

```typescript
import React, { useEffect, useState } from 'react';

interface LetterData {
  title: string;
  body: string;
  people: string[];
}

export const XMLViewer: React.FC = () => {
  const [data, setData] = useState<LetterData | null>(null);

  useEffect(() => {
    // 1. Fetch the raw XML file from the public folder
    fetch('/letter.xml')
      .then(response => response.text())
      .then(str => {
        // 2. Parse the string into an XML Document Object Model (DOM)
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "text/xml");

        // 3. Extract data using standard DOM methods
        // Dealing with namespaces in JS can be tricky, simple tag name search often works for simple docs
        const title = xmlDoc.getElementsByTagName("title")[0]?.textContent || "Untitled";

        // Extract body text (stripping tags for a simple preview)
        const bodyText = xmlDoc.getElementsByTagName("body")[0]?.textContent || "";

        // Extract all person names into an array
        const personNodes = xmlDoc.getElementsByTagName("persName");
        const people = Array.from(personNodes).map(node => node.textContent || "");

        setData({ title, body: bodyText, people });
      })
      .catch(err => console.error("Error parsing XML", err));
  }, []);

  if (!data) return <div>Loading XML...</div>;

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h3 className="font-bold text-xl mb-2">{data.title}</h3>

      <div className="mb-4 p-2 bg-gray-50 rounded">
        <strong>People Mentioned:</strong>
        <ul className="list-disc list-inside">
            {data.people.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </div>

      <div className="whitespace-pre-wrap font-serif">
        {data.body}
      </div>
    </div>
  );
};
```
