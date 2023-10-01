---
title: "Semantics and HTML"
date: "2016-04-13"
categories: 
  - "technology"
---

HTML documents don’t have many features to include additional semantics. With (X)HTML we could use namespaces but nowadays everyone seems to hate anything related to XML and the [functionality of namespaces](https://www.w3.org/TR/html5/infrastructure.html#namespaces) seems to have changed considerably since [XHTML 1.0](https://www.w3.org/TR/xhtml1/).

But there are ways to add semantics to an HTML page through custom attributes, extensions to HTML or a combination of both.

We’ll explore some of the macine readable semantic additions to HTML:

- Microformats,
- RDFa Lite
- JSON-LD
- Microdata
- data- attributes

We’ll also explore some semantics derived from WAI and WAI-ARIA specifications along with their digital publishing extensions.

Regardless of the format we choose the real trick of working with structured data if figuring out how to match our HTML to the vocabulary and format we’ve chosen to work with. I’ll discuss what vocabulary to use in a later section.

## Microformats

[Microformats](http://microformats.org/) are the oldest semantic additions to the HTML standard to indicate semantic meaning.

### h-card

Take the example below, a piece of straightforward markup for describing a person and information about him:

```
Jane Doe
<img src="janedoe.jpg" alt="Photo of Jane Joe"/>
Professor
20341 Whitworth Institute
405 Whitworth
Seattle WA 98052
(425) 123-4567
<a href="mailto:jane-doe@xyz.edu">jane-doe@illinois.edu</a>
Jane's home page:
<a href="http://www.janedoe.com">janedoe.com</a>
Graduate students:
<a href="http://www.xyz.edu/students/alicejones.html">Alice Jones</a>
<a href="http://www.xyz.edu/students/bobsmith.html">Bob Smith</a>
```

Humans can guess about the content of the div. Some of the inferences we can make and that we’ll assume are correct, are:

- John Doe is a person
- The information in the div refers to John Doe
- He lives in Reykjavik, Iceland
- His email address is `John.Doe@somewhere.com`

A machine, however smart, cannot make that kind of guesses without support. That’s where [h-card](http://microformats.org/wiki/h-card) comes in. It provides a vocabulary that uses class attributes to further describe the information it’s attached to.

One thing that HTML purists object to is that we may need to add additional markup to existing content but most of the markup is semantically neutral `span` tags so I’m OK with that.

Let’s look at what the example looks like marked up:

```
<div class="h-card">
 <img class="u-photo" src="janedoe.jpg" alt="Photo of Jane Joe"/>
 <h1 class="p-name">Jane Doe</h1>
 <h2 class="p-job-title">Professor</h2>
 <div class="h-adr">
   <p><span class="p-street-address">20341 Whitworth Institute<br />
   405 Whitworth<br />
   <span class="p-locality">Seattle</span>
   <span class="p-region">WA<span>
   <span class="p-postal-code">98052</span></span></span></span></p>
   <p class="p-tel">(425) 123-4567</p>
   <a class="u-email" href="mailto:jane-doe@xyz.edu">jane-doe@illinois.edu</a>
   <p>Jane's home page:</p>
   <a class="u-url" href="http://www.janedoe.com">janedoe.com</a>
   Graduate students:
   <a href="http://www.xyz.edu/students/alicejones.html">Alice Jones</a>
   <a href="http://www.xyz.edu/students/bobsmith.html">Bob Smith</a>
```

Even though we added a lot of semantic meaning to our person the markup is invisible to the user; search engines see all the additional information and act upon it.

If we look at the description for `u-photo` in the Wiki we see that it doesn’t have a description so it’s safe to asume that since it starts with a `u` it’s a URL and the `p` URLs refer to a person.

Addresses need a little more attention. If you look at the `p.adr` entry for h-card you’ll see that it suggests that you can `optionally embed an h-adr`.

At first it threw me off until I looked at `h-adr` and what it would be used for. For individuals it is optional as most individuals have one address. If this was a professional bio we could have more than one address, say one for home and one for work and it would look something like this:

```
<p class="h-adr">
  <span class="p-street-address">17 Austerstræti</span>
  <span class="p-locality">Reykjavík</span>
  <span class="p-country-name">Iceland</span>
  <span class="p-postal-code">107</span>
</p>
```

The address also shows how we would add tags for semantic meaning to specific portions of the address. This is a common technique for adding semantics to specific parts of content.

We need to make sure that whenever we add semantic attributes to content we do so appropriately;most of the time this will mean adding containers to the element (`<span>` or `<div>` tags) to put the semantics on.

The Micro Formats wiki provides a list of [h-card Properties](http://microformats.org/wiki/h-card#Properties). Handy when you're adding h-card properties to your document.

## Microdata

We will use the following example to illustrate the implementation of different structured data vocabularies.

```
Jane Doe
<img src="janedoe.jpg" alt="Photo of Jane Joe"/>
Professor
20341 Whitworth Institute
405 Whitworth
Seattle WA 98052
(425) 123-4567
<a href="mailto:jane-doe@xyz.edu">jane-doe@illinois.edu</a>
Jane's home page:
<a href="http://www.janedoe.com">janedoe.com</a>
Graduate students:
<a href="http://www.xyz.edu/students/alicejones.html">Alice Jones</a>
<a href="http://www.xyz.edu/students/bobsmith.html">Bob Smith</a>
```

Microdata is part of WHATWG HTML living standard but a separated by the W3C, I guess, to make it easier to update and implement without having to update the full HTML specification. I chose to follow the W3C implementation.

The Microdata marked example looks like this:

```
<div itemscope itemtype="http://schema.org/Person">
  <span itemprop="name">Jane Doe</span>
  <img src="janedoe.jpg" itemprop="image" alt="Photo of Jane Joe"/>
  <span itemprop="jobTitle">Professor</span>
  <div itemprop="address" itemscope 
         itemtype="http://schema.org/PostalAddress">
    <span itemprop="streetAddress">
      20341 Whitworth Institute <br />
      405 N. Whitworth
    </span>
    <span itemprop="addressLocality">Seattle</span>,
    <span itemprop="addressRegion">WA</span>
    <span itemprop="postalCode">98052</span>
  </div>
  <span itemprop="telephone">(425) 123-4567</span>
  <a href="mailto:jane-doe@xyz.edu" itemprop="email">
    jane-doe@xyz.edu</a>
  Jane's home page:
  <a href="http://www.janedoe.com" itemprop="url">janedoe.com</a>
  Graduate students:
  <a href="http://www.xyz.edu/students/alicejones.html" itemprop="colleague">
    Alice Jones</a>
  <a href="http://www.xyz.edu/students/bobsmith.html" itemprop="colleague">
    Bob Smith</a>
</div>
```

The first elements to notice are `itemscope` and `itemtype`.

The `itemscope` attribute specified creates a new item, a group of name-value pairs until the next `itemscope` attributes appears.

The `itemtype` attribute, if specified, must contain a URLs pointing to a valid vocabulary, in this case the [Person](https://schema.org/Person) vocabulary from [schema.org](https://schema.org/). Inside our Person object we have another scoped item, a [PostalAddress](http://schema.org/PostalAddress) object defined in schema.org

For all children elements we specify an `itemprop` attribute to add one or more properties to the specified item.

## RDFa Lite

RDFa Lite is a W3C specification that uses a vocabulary described in schema.org to describe a set of vocabularies. It is very similar to Microdata

We will use the same example below for RDFa Lite, JSON-LD and Microdata. The basic example looks like this:

```
Jane Doe
<img src="janedoe.jpg" alt="Photo of Jane Joe"/>
Professor
20341 Whitworth Institute
405 Whitworth
Seattle WA 98052
(425) 123-4567
<a href="mailto:jane-doe@xyz.edu">jane-doe@illinois.edu</a>
Jane's home page:
<a href="http://www.janedoe.com">janedoe.com</a>
Graduate students:
<a href="http://www.xyz.edu/students/alicejones.html">Alice Jones</a>
<a href="http://www.xyz.edu/students/bobsmith.html">Bob Smith</a>
```

The example marked up for RDFa is copied below. Compare the result below with the same document marked up wth Microdata. Also note the level of granularity which is similar to what we did with Microformats to begin the exercise.

```
<div vocab="http://schema.org/" typeof="Person">
  <span property="name">Jane Doe</span>
  <img src="janedoe.jpg" property="image" alt="Photo of Jane Joe"/>
  <span property="jobTitle">Professor</span>
  <div property="address" typeof="PostalAddress">
    <span property="streetAddress">
      20341 Whitworth Institute <br />
      405 N. Whitworth
    </span>
    <span property="addressLocality">Seattle</span>,
    <span property="addressRegion">WA</span>
    <span property="postalCode">98052</span>
  </div>
  <span property="telephone">(425) 123-4567</span>
  <a href="mailto:jane-doe@xyz.edu" property="email">
    jane-doe@xyz.edu</a>
  Jane's home page:
  <a href="http://www.janedoe.com" property="url">janedoe.com</a>
  Graduate students:
  <a href="http://www.xyz.edu/students/alicejones.html" property="colleague">
    Alice Jones</a>
  <a href="http://www.xyz.edu/students/bobsmith.html" property="colleague">
    Bob Smith</a>
</div>
```

Since HTML5 does not support namespaces RDFa uses custom attributes to achieve the same goal. `vocab` indicates the URL we want to use and `typeof` indicates the specific object we are describing. Once we do that the search engine knows what all these properties are about and can parse them properly.

`property` tells the RDFa parser the type of object it’s attached to.

We’ll look at the nested div containing our address to see how the markup changes based on the type of content we are creating. The `propety&nbsp;` is an address and its `typeof` is `PostalAddress`.

Here we also use span tags to refined what portions of the content get what semantic meaning. The span tag is neutral: “The \\ element is a generic inline container for phrasing content, which does not inherently represent anything.”

```
  <div property="address" typeof="PostalAddress">
    <span property="streetAddress">
      20341 Whitworth Institute <br />
      405 N. Whitworth
    </span>
    <span property="addressLocality">Seattle</span>,
    <span property="addressRegion">WA</span>
    <span property="postalCode">98052</span>
  </div>
```

## JSON-LD

[JSON for linked data](http://json-ld.org/) or JSON-LD is an extension to the JSON format that allows data from different context or domains to create the metadata.

We’ll start with a definition of linked data, taken from [json-ld.org](http://json-ld.org/):

> Linked Data empowers people that publish and use information on the Web. It is a way to create a network of standards-based, machine-readable data across Web sites. It allows an application to start at one piece of Linked Data, and follow embedded links to other pieces of Linked Data that are hosted on different sites across the Web.

One again, we’re using the same data we used for Microdata and RDFa. The HTML looks like this:

```
Jane Doe
<img src="janedoe.jpg" alt="Photo of Jane Joe"/>
Professor
20341 Whitworth Institute
405 Whitworth
Seattle WA 98052
(425) 123-4567
<a href="mailto:jane-doe@xyz.edu">jane-doe@illinois.edu</a>
Jane's home page:
<a href="http://www.janedoe.com">janedoe.com</a>
Graduate students:
<a href="http://www.xyz.edu/students/alicejones.html">Alice Jones</a>
<a href="http://www.xyz.edu/students/bobsmith.html">Bob Smith</a>
```

The JSON-LD script looks like this:

```
<script type="application/ld+json">
{
  "@context": "http://schema.org",
  "@type": "Person",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Seattle",
    "addressRegion": "WA",
    "postalCode": "98052",
    "streetAddress": "20341 Whitworth Institute 405 N. Whitworth"
  },
  "colleague": [
    "http://www.xyz.edu/students/alicejones.html",
    "http://www.xyz.edu/students/bobsmith.html"
  ],
  "email": "mailto:jane-doe@xyz.edu",
  "image": "janedoe.jpg",
  "jobTitle": "Professor",
  "name": "Jane Doe",
  "telephone": "(425) 123-4567",
  "url": "http://www.janedoe.com"
}
</script>
```

Note that we attach the JSON-LD metadata to a script tag with `application/ld+json`. Because we can’t add JSON directly to HTML we’ve created an external source for the content.

The next difference is that we use JSON syntax but we keep the camel case for all attribute names. The names are the same as those in schema, this makes it easier to track what each propery does accross W3C defined schema types.

# Custom Attributes in your HTML

HTML5 introduced custom `data-` attributes as a way to add arbitrary data to be consumed by the page it’s contained in. More specifically:

> Custom data attributes are intended to store custom data private to the page or application, for which there are no more appropriate attributes or elements. These attributes are not intended for use by software that is independent of the site that uses the attributes. Every HTML element may have any number of custom data attributes specified, with any value. [From HTML 5.1 specification](http://w3c.github.io/html/dom.html#embedding-custom-non-visible-data-with-the-data-attributes)

An example of data attributes looks like this:

```
<div data-height="150" data-height="300">
<p>Content</p>
</div>
```

## What can you use them for?

We can store data to use in both our CSS and Javascript. Some examples include:

- Storing the initial attributes of an element (height, width, opacity) which might be required in later JavaScript or CSS animations
- Adding attributes that will feed scripts in the page

## What shouldn’t I use them for?

While they give a lot of flexibility, custom attributes can be easily abused. Some of the htings we should avoid are:

- Using data attributes as replacements for microformats. Since data attributes can only be used with styles and scripts within the same page we cannot rely on them for information exchange
- Relying on a data attribute being present or absent to style content.

# Accessibility semantics

There are two elements that add semantic meaning to the text they are attached to: `aria-labelledby` and `aria-describedby`. While not strictly structured data formats they help provide structure to our HTML content so I’m including them here.

## aria-labelledby

This attribute provides a link to a short description or label for the element for assistive technology use. We create the link by using the id of an existing element on the page. Assistive technology such as screen readers use the text of the element identified by the value of the aria-labelledby attribute as the text alternative for the element with the attribute.

For images this does not replace the `alt` attribute. You should not omit it nor make it empty (`alt=""`) and should contain the same text than the target of the labelledby attribute.

```
<img src="sunflowers.jpg" aria-labelledby="flower-id" 
alt="Van Goh's oil painting of sunflowers"/>

<p><span id="flower-id">Van Gogh's oil painting of sunflowers</span> 
hangs in Amsterdam's Van Gogh museum.</p>
```

## aria-describedby

aria-describedby is a complementary attribute to `lablledby`. Where labelledby points to an ID of content inside your pages `describedby`addresses a longer description in your document. In the example below we associate form elements with divs hosting the content.

These descriptions are much longer than the labels indicated with `labelledby`.

```
<form action="">
  <fieldset>
    <legend>Login form</legend>
    <div>
      <label for="username">Your username</label>
      <input type="text" id="username" 
        aria-describedby="username-tip" required />

        <div role="tooltip" id="username-tip">
          Your username is your email address</div>
        </div>
    </fieldset></form></span></div>

    <div>
      <label for="password">Your password</label>
      <input type="text" id="password" 
        aria-describedby="password-tip" required />

      <div role="tooltip" id="password-tip">
        Was emailed to you when you signed up
      </div>
    </div>
```

## Additional syntax from digi-pub ARIA module and epub semantic structure

The [Digital Publishing ARIA module ](https://www.w3.org/TR/dpub-aria-1.0/) presents a set of extensions to roles defined in ARIA (see [Section 5.3.3 Document Structure](https://www.w3.org/TR/wai-aria/roles#document_structure_roles)) to provide publishing specific structural semantics. As of epub 3.1 these roles replace the type attribute that has been deprecated as the epub comunity moves away from XHTML and namespaces.

The [list of roles for Digital Publications](https://www.w3.org/TR/dpub-aria-1.0/#role_definitions) contains the full list of ARIA extensions and [EPUB 3 Structural Semantics Vocabulary](http://www.idpf.org/epub/vocab/structure/) contains a list of epub structural semantic vocabulary.

While RDFa, JSON-LD, Microdata and Microformats describe the data itself, they tell you what the element is. ARIA and epub’s structural semantics deal with the structure of the content, how it is organized. This provides additional hooks for assistive technology and styling.

Even if you’re not packaging your content as a digital publication it pays to consider these semantics when building your content.

An example containing multiple units of content looks like this:

```
<section role="doc-introduction">
  <h1>Introduction</h1>
</section>

<section role="doc-foreword">
  <h1>Foreword: Lorem Ipsum</h1>
</section>

<div role="doc-part">
  <h1>Part I: Getting Started</h1>

  <section role="doc-chapter">
    <h1>Chapter 1: The Tools</h1>
  </section>

  <section role="doc-chapter">
    <h1>Chapter 2: The environment</h1>
  </section>

</div>
<section role="doc-apendix">
    <h1>Appendix A: References</h1>
</section>
```

# Choosing a syntax

We’ve discussed several different ways to provide semantic data and semantic inflection to our documents. So the question becomes: which one to use

it depends on several factors. We’ll discuss some in this section… they may not be all.

- authoring style: Are you adding the semantic attributes manually or programattically through scripts?
    
    - manual: Any format other than JSON can be added manually as attributes to your elements
    - generated: You can generate JSON programmatically and insert it in a script tag on the page
- do you want to use existing tags, use attributes that are not part of HTML, or move to a completely different syntax
    
    - microformats uses existing class structure and adds attribute values that will not affect validation and work within HTML document structures
    - RDFa and microdata add elements to HTML5 so it may not validate
    - JSON-LD abstracts the structured data out of the doc. We create a new script tag with a non-standard type value
- what are your goals? Why are you adding metadata?
    
    - If you want to improve search results and provide richer search => Microdata
    - add custom vocabularies => RDFa
    - tie it to CSS => microformat
- Structural semantics can augment any of the structured data formats or can be used on their own to indicate a document’s structure.

# How can we use it?

There are several ways structured semantic data can make development easier. We’ll look at some of these ways. There may be others and if you can think of others way in which we can use structured data

## Custom Scripts

We can use data elements and structured data to provide information to scripts that live in the same page. With the following HTML:

```
<article id="electricCars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
<p>Example</p>
</article>
```

We can extract data from the attributes using the dataset API with something like the code below, where we do the following:

1. Define a constant with the element we want to extract the attributes from
2. Log to console the values of the attributes.
3. Add a new attribute and log its value to the console
4. try resetting an attribute and logging its value to console
    
    // set the element containing our data elements. const article = document.getElementById("electricCars")
    
    // read the values of the data-\* attributes console.log(article.dataset.columns); // "3" console.log(article.dataset.indexNumber); // "12314" console.log(article.dataset.parent); // "cars"
    
    // add a new data-\* item article.dataset.color = "blue"; // read the value to make sure we got it right console.log('the color is ' + article.dataset.color); // the color is blue
    
    // remove a data-\* item article.dataset.columns; // log its value to console console.log(article.dataset.columns); // Blank or underfined // The above doesn't seem to work with Firefox Developer Edition. Try delete delete article.dataset.columns; // Note that the attribute no longer exists. If you need it again you must // add it back using the add syntax above // if we try to read the data-columns property it should return undefined console.log(article.dataset.columns); // Undefined

## Styling content based on structured data

We can also create CSS based on our structured data. For example, we can take all div elements with a `property="address"` attribute and do something with them

**Attributes** div \[property="address"\] { border: 1px solid black; }

**Data Attributes**

Example

. var article = document.getElementById('electriccars'); article.dataset.columns // "3" article.dataset.indexNumber // "12314" article.dataset.parent // "cars" . article\[data-columns='3'\] { width: 400px; } article\[data-columns='4'\] { width: 600px; }

Another example takes the roles that we created to indicate structure for our content:

```
<section role="doc-introduction">
  <h1>Introduction</h1>
</section>

<section role="doc-foreword">
  <h1>Foreword: Lorem Ipsum</h1>
</section>

<div role="doc-part">
  <h1>Part I: Getting Started</h1>

  <section role="doc-chapter">
    <h1>Chapter 1: The Tools</h1>
  </section>

  <section role="doc-chapter">
    <h1>Chapter 2: The environment</h1>
  </section>

</div>
<section role="doc-apendix">
    <h1>Appendix A: References</h1>
</section>
```

An adds CSS to break the printed pages before and after each of the sections so that Paged Media renderers like Prince XML will start each section on a new page:

```
<style>
@media print {
  /* section has a role attribute 
   * 
   * If it does page break before and after
   */
  section[role]{
    page-break-before: always;
    page-break-after: always;
  }

  section[role="doc-introduction"],
  section[role="doc-foreword"] {
    /*
     * For introduction and foreword
     * 
     * use page numbering at bottom center
     * use chapter title at the top right
     */
    display: block;
    page: main;
    counter-reset: page 1
  }

  @page main {
    @top-right { 
      content: string(chapter-title)
    }
    @bottom-center {
      content: counter(page)
    }
  }
}
```

# Vocabulary Repositories

## Schema.org

RDFa 1.1, JSON-LD and Microformats use the schemas defined and explained at [schema.org](http://schema.org/) for their data models. The schemas have examples for all the formats listed.

- [schema organization](http://schema.org/docs/schemas.html)
- [Event schema](http://schema.org/Event)
- [CreativeWork schema](http://schema.org/CreativeWork)
- [Review schema](http://schema.org/Review)
- [Organization schema](http://schema.org/Organization)
- [Person schema](http://schema.org/Person)
- [Place schema](http://schema.org/Place)

## Microformats.org

- [h-card](http://microformats.org/wiki/h-card) for business cards
- [h-review](http://microformats.org/wiki/h-card) for marking reviews
- [rel="license"](http://microformats.org/wiki/rel-license) to indicate that the destination of that hyperlink is a license for the current page
- [rel="tag"](http://microformats.org/wiki/rel-tag) to indicate that the destination of that hyperlink is an author-designated "tag" (or keyword/subject) for the current page
- [XOXO 1.0: Extensible Open XHTML Outlines](http://microformats.org/wiki/xoxo)

## ARIA and DPUB-ARIA

- [DPUB-ARIA Roles](https://www.w3.org/TR/dpub-aria-1.0/#roles) \*

# Links and Resources

- [HTML: Structured Data](http://www.lynda.com/HTML-tutorials/HTML-Structured-Data/) course from Lynda.com
- [Web Data Commons - RDFa, Microdata, and Microformat Data Sets](http://webdatacommons.org/structureddata/): Extracting Structured Data from the Common Web Crawl
- Vocabularies
    
    - [Microformats](http://microformats.org/wiki/Main_Page)
    - RDFa 1.1 Lite
        
        - [RDFa 1.1 Lite](https://www.w3.org/TR/rdfa-lite/) Specification
        - [RDFa 1.1 Lite Primer](https://www.w3.org/TR/xhtml-rdfa-primer/) W3C Working Group Note
    - [JSON-LD](https://www.w3.org/TR/json-ld/)
        
        - [Specification](https://www.w3.org/TR/json-ld/)
        - [JSON-LD documentation](http://json-ld.org/learn.html)
        - [Javascript implementation](#)
        - [JSON-LD Playground](http://json-ld.org/playground/)
    - Microdata
        
        - [Specification](https://www.w3.org/TR/microdata/)
    - [Google Schemas](https://developers.google.com/schemas/)
- Validators
    
    - [Indiewebify me h-card validator](http://indiewebify.me/validate-h-card/)
    - [Google structured data testing tool](https://developers.google.com/structured-data/testing-tool/)
    - [http://microformats.org/wiki/validators](http://microformats.org/wiki/validators)
