---
title: "Globalizing Web Content"
date: "2017-12-04"
---

I've always been interested in internationalization (i18n) and localization (l10n) and how they relate to the web. My interest got picked again when I started wondering how much extra work would it be to keep a site or app in multiple languages and how much time and how many additional resources I'd need to get it done.

This goes beyond translating the content; tools like Google Translate make that part easier than it used to be but also the changes and modifications that we need to do to our code to accommodate for the different languages and cultures we want to deploy our application in.

## Difference between l10n and i18n

Before we can jump in and talk about localizing web content and the challenges involved we need to understand the difference between localization (l10n for the 10 letters between l and n in the word localization in English) and Internationalization (i18n for the 18 letters between i and n in the word internationalization in English)

**Localization**

Localization refers to the adaptation of a product, application or document content to meet the language, cultural and other requirements of a specific target market (a locale).

Often thought of as a synonym for translation of the user interface and documentation, localization is often a much more complex issue. It can entail customization related to:

- Numeric, date and time formats
- Use of currency
- Keyboard usage
- Collation and sorting of content
- Symbols, icons, and colors
- Text and graphics containing references to objects, actions or ideas which, in a given culture, may be subject to misinterpretation or viewed as insensitive
- Varying legal requirements

and potentially other aspects of our applications.

Localization may even require a comprehensive rethinking of logic, visual design, or presentation if the way of doing business (eg., accounting) or the accepted paradigm for learning (eg., focus on individual vs. group) in a given locale differs substantially from the originating culture.

**Internationalization**

Definitions of internationalization vary. This is a high-level working definition for use with W3C Internationalization Activity material. Some people use other terms, such as globalization to refer to the same concept.

Internationalization is the design and development of a product, application or document content that enables easy localization for target audiences that vary in culture, region, or language.

Internationalization typically entails:

1. Designing and developing in a way that removes barriers to localization or international deployment. This includes activities like enabling the use of Unicode, or ensuring the proper handling of legacy character encodings (where appropriate), taking care over the concatenation of strings, decoupling the backend code from the UI text, etc
2. Providing support for features that may not be used until localization occurs. For example, adding markup or CSS code to support bidirectional text, or for identifying the language, or adding to CSS support for vertical text or other non-Latin typographic features.
3. Enabling code to support local, regional, language, or culturally related preferences. Typically this involves incorporating predefined localization data and features derived from existing libraries or user preferences. Examples include date and time formats, local calendars, number formats and numeral systems, sorting and presentation of lists, handling of personal names and forms of address, etc.
4. Separating localizable elements from source code or content, such that localized alternatives can be loaded or selected based on the user's international preferences as needed.
5. Notice that these items do not necessarily include the localization of the content, application, or product into another language; they are design and development practices which allow such a migration to take place easily in the future but which may have significant utility even if no localization ever takes place.

## What type of internationalization can we automate?

The following sections on automating i18n work with templating (mustache and similar) or other ways to programmatically generate content.

For the most part, we automate UI internationalization and localize only those aspects of the user interface that will change when we change the language we use. Note that this will work in applications and sites that generate HTML from Javascript.

Depending on the tools we use we may be further limited in what we can and cannot localize programmatically, particularly content other than UI.
