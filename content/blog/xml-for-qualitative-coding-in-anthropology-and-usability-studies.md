---
title: "XML for Qualitative Coding in Anthropology and Usability Studies"
date: 2026-01-21
tags:
  - XML
  - Qualitative Coding
  - Data Analysis
  - Research Methods
  - Coding Strategies
  - Data Extraction
---

Qualitative coding transforms unstructured text (interviews, field notes) into structured data to reveal patterns. When combined with XML (Extensible Markup Language), you create a dataset that is both human-readable and machine-computable.

This post outlines effective coding strategies and an XML-based workflow for anthropological and usability studies, along with code examples for extracting insights.

## Coding Strategies

Here are four high-value strategies for anthropological and usability studies.

### Attribute Coding (The "Who" and "Where")

* **Goal**: Log essential descriptors about the participant or the setting.
* **When to use**: At the very beginning of the file or session.
* **Application**:
  * Anthropology: Demographics (Age, Clan, Village).
  * Usability: User ID, OS Version, Session Length.

### In Vivo Coding (The "Verbatim")

* **Goal**: prioritize the participant's voice by using their exact words as the code.
* **When to use**: When the specific terminology used by a culture or user group is significant.
* **Application**:
  * Anthropology: Cultural terms that have no direct translation.
  * Usability: How a user describes a feature (e.g., calling the "Hamburger Menu" the "Three Lines thing").

### Magnitude Coding (Sentiment and Intensity)

* **Goal**: Capture the emotional weight or frequency of a phenomenon.
* **When to use**: When "how much" matters as much as "what."
* **Application**:
  * Anthropology: Intensity of ritual adherence.
  * Usability: Frustration levels (Low/Med/High) or Success/Failure of a task.

### Structural/Topic Coding

* **Goal**: Label segments of text according to the specific interview question or broad topic being discussed.
* **When to use**: To slice the data for later analysis (e.g., "Show me everything anyone said about the 'Checkout Process'").

## The XML Workflow

To implement this, we treat the text as a tree structure. We wrap specific phrases in tags that represent our codes.

### The Tags

Instead of generic XML, we use semantic tag names or a generic seg (segment) tag with specific attributes.

#### Option A: Semantic Tags (Readable)

Best for simple coding schemes.

```xml
<u who="#Subject_A">
  I felt <seg type="emotion" subtype="anger">very angry</seg> when the app crashed.
</u>
```

#### Option B: Attribute-Heavy (Computational)

Best for complex, multi-layered coding.

```xml
<u who="#Subject_A">
  <seg ana="#emotional_response #anger #high_intensity">
    very angry
  </seg>
</u>
```

## The Workflow Lifecycle

1. **Transcription**: Convert audio/video to plain text. We can use AI tools to speed up this step or you can do it manually.
2. **Structural Markup**: Wrap the text in the base XML structure (identifying speakers, timestamps, and questions).
3. **Thematic Markup**: A researcher reads the XML and wraps specific phrases in coding tags.
4. **Extraction**: Use XSLT or Python to parse the XML and generate frequency tables or pull quotes.

### Best Practices for XML Coding

* **Unique IDs**: Give every major code an @id. This allows you to cross-reference specific quotes later.
* **Nested Codes**: XML allows nesting. You can place a `<sentiment>` code inside a `<usability_issue>` code.
* **Standoff Properties**: Keep participant metadata in a `<header>` block, not repeated in every single utterance.

## Implementation Examples

Once your data is coded, you need tools to extract the insights. Below are three code examples for extracting "Pull Quotes" (high-intensity sentiments or high-severity issues).

Here is a brief section you can insert right before "Implementation Examples". It bridges the gap between the XML structure and the code that follows.

!!! note  **Understanding XML Namespaces**
You will notice the `xmlns="http://www.tei-c.org/ns/1.0"` attribute in the root of the data file. This is an XML Namespace.

Namespaces are critical in professional data workflows because they prevent "naming collisions." Just as a User class in your application might conflict with a User class in a third-party library, an XML tag like `<title>` could refer to a book title, a job title, or a legal deed.

In TEI, every tag technically has a "surname." The parser sees `<seg>` as `{http://www.tei-c.org/ns/1.0}seg`.

**Why this matters for your code**: If you try to find `seg` using a standard XML parser without declaring the namespace, your script will return zero results. The examples below explicitly handle this by registering the TEI namespace before searching.
!!!

### XML Code Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>Usability Study: Mobile Checkout Flow</title>
      </titleStmt>
      <publicationStmt>
        <p>Internal Research Data</p>
      </publicationStmt>
      <sourceDesc>
        <recordingStmt>
          <recording type="audio">
            <date when="2025-10-14"/>
          </recording>
        </recordingStmt>
      </sourceDesc>
    </fileDesc>

    <encodingDesc>
      <classDecl>
        <taxonomy xml:id="usability_codes">
          <category xml:id="sentiment">
            <catDesc>Emotional state of the user</catDesc>
            <category xml:id="sent_anger_high">
              <catDesc>High Intensity Anger</catDesc>
            </category>
            <category xml:id="sent_joy_med">
              <catDesc>Medium Intensity Joy</catDesc>
            </category>
          </category>
          <category xml:id="issues">
            <catDesc>Usability problems encountered</catDesc>
            <category xml:id="issue_crit_crash">
              <catDesc>Critical Severity: App Crash</catDesc>
            </category>
            <category xml:id="issue_min_confusion">
              <catDesc>Minor Severity: UI Confusion</catDesc>
            </category>
          </category>
        </taxonomy>
      </classDecl>
    </encodingDesc>
  </teiHeader>

  <text>
    <body>
      <div type="session">
        <head>Participant 004 - Checkout Task</head>

        <u who="#interviewer">
          So, please try to buy the socks. Tell me what you are thinking.
        </u>

        <u who="#subject_004">
          Okay. I'm clicking the cart icon.

          I see the <seg type="term">shopping bag thingy</seg>.

          Wait, nothing is happening. I'm clicking it again.

          <seg type="issue" ana="#issue_crit_crash">
            The screen just went totally black. It crashed.
          </seg>

          <seg type="sentiment" ana="#sent_anger_high">
            This is incredibly frustrating. I would honestly delete the app right now.
          </seg>
        </u>

         <u who="#interviewer">
          I'm sorry about that. Let's restart the app.
        </u>

        <u who="#subject_004">
           Okay, it's back. I'm trying to pay.

           <seg type="issue" ana="#issue_min_confusion">
             I can't tell if the 'Pay Now' button is active or greyed out.
           </seg>

           It looks weird.
        </u>
      </div>
    </body>
  </text>
</TEI>
```

Things to note:

**`<taxonomy>` and `<category>` (Header)**
: Instead of writing severity="high" directly in the text (which makes typos easy), TEI prefers defining these concepts in the Header. We created IDs like #sent_anger_high and #issue_crit_crash.

**`@ana` (Analysis Attribute)**
: In the body, we use `<seg ana="#issue_crit_crash">`. This points back to the header. This makes the data computable; you can change the description in the header without searching/replacing the whole document.

**`<u>` (Utterance)**
: Standard TEI tag for spoken text, replacing the generic div or custom turn tags.

### Python Extraction (Backend/Data Science)

This script uses the Python Standard Library to parse the XML and print high-priority quotes to the console. For the extraction to work, we must define the TEI namespace (`ns`) to find tags. We also search the `ana` attribute (analysis) for our specific IDs.

```python
import xml.etree.ElementTree as ET
import os

def extract_tei_quotes(xml_filepath):
    if not os.path.exists(xml_filepath):
        print(f"Error: File '{xml_filepath}' not found.")
        return

    tree = ET.parse(xml_filepath)
    root = tree.getroot()

    # TEI uses a namespace, so we must define it to find tags
    ns = {'tei': 'http://www.tei-c.org/ns/1.0'}

    print(f"--- Pull Quotes (TEI Extraction) ---")

    # Helper to find the speaker ID from the parent <u> (Utterance) tag
    def get_speaker(element):
        # In ElementTree, we can't easily get parent, so we assume context or look up
        # For simplicity in this script, we'll iterate through utterances first
        return "Unknown"

    # Iterate through all Utterances (u) to maintain speaker context
    for u in root.findall(".//tei:u", ns):
        speaker = u.get('who', 'Unknown')

        # 1. Find Segments with "High Intensity" codes
        # We look for segs where the 'ana' attribute contains '_high'
        for seg in u.findall(".//tei:seg", ns):
            ana = seg.get('ana', '')

            if 'high' in ana:
                print(f"\n[High Intensity | Speaker: {speaker}]")
                print(f"\"{seg.text.strip()}\"")
                print(f"(Code: {ana})")

            # 2. Find Critical Issues
            if 'crit' in ana:
                print(f"\n[Critical Issue | Speaker: {speaker}]")
                print(f"\"{seg.text.strip()}\"")
                print(f"(Code: {ana})")

if __name__ == "__main__":
    extract_tei_quotes("usability_study_data.xml")
```

### Typescript Extraction (React/Angular/Web/Node)

!!! note  **Transpilation or Third Party Tool Required**
We assume that you will transpile this code to run in a browser or use TSX or similar tool to run in Node.js.

React and Angular can be configured to transpile TS to JS so there are no changes needed
!!!

This function parses the TEI XML string and extracts pull quotes with high intensity or critical issue codes.

```typescript
interface PullQuote {
  text: string;
  type: 'sentiment' | 'issue';
  codeRef: string; // The ID of the code (e.g., #sent_anger_high)
  source: string;
}

export function extractQuotesFromTei(xmlString: string): PullQuote[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const quotes: PullQuote[] = [];

  // TEI uses Namespaces.
  // In simple DOM parsing, getElementsByTagName often ignores namespaces,
  // but querySelector requires escaping or specific syntax.
  // We will iterate over all 'seg' tags for simplicity.
  const segments = xmlDoc.getElementsByTagName('seg');

  Array.from(segments).forEach((node) => {
    const ana = node.getAttribute('ana') || "";

    // Helper to find speaker (closest <u who="..."> ancestor)
    const utterance = node.closest('u');
    const speaker = utterance ? utterance.getAttribute('who') || "Unknown" : "Unknown";

    // 1. Check for High Intensity
    if (ana.includes('high')) {
      quotes.push({
        text: node.textContent?.trim() || "",
        type: 'sentiment',
        codeRef: ana,
        source: speaker
      });
    }

    // 2. Check for Critical Issues
    if (ana.includes('crit')) {
      quotes.push({
        text: node.textContent?.trim() || "",
        type: 'issue',
        codeRef: ana,
        source: speaker
      });
    }
  });

  return quotes;
}
```

### XSLT Transformation (Reporting)

This XSLT snippet transforms the XML directly into an HTML fragment. This is useful for generating static reports without writing any application logic.

```xml
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" indent="yes"/>

  <!-- Root Match: Create a container div instead of a full HTML page -->
  <xsl:template match="/">
    <div class="report-container">
      <h1>Participant Pull Quotes</h1>
      <!-- Find all high intensity segments or high severity issues -->
      <xsl:apply-templates select="//segment[@intensity='high'] | //issue[@severity='high']"/>
    </div>
  </xsl:template>

  <!-- Template for High Intensity Segments -->
  <xsl:template match="segment">
    <div class="quote-card sentiment">
      <p>"<xsl:value-of select="."/>"</p>
      <small>
        Type: <xsl:value-of select="@value"/> |
        Speaker: <xsl:value-of select="ancestor::turn/@speaker"/>
      </small>
    </div>
  </xsl:template>

  <!-- Template for High Severity Issues -->
  <xsl:template match="issue">
    <div class="quote-card issue">
      <p>"<xsl:value-of select="."/>"</p>
      <small>
        Issue: <xsl:value-of select="@type"/> |
        Speaker: <xsl:value-of select="ancestor::turn/@speaker"/>
      </small>
    </div>
  </xsl:template>
</xsl:stylesheet>
```

## Conclusion

XML remains a powerful tool for qualitative coding in anthropology and usability studies. Its hierarchical structure, extensibility, and compatibility with various processing tools make it ideal for capturing complex human experiences. By adopting XML-based coding strategies and workflows, researchers can enhance their data's richness and accessibility, ultimately leading to deeper insights and more impactful findings.
