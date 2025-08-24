---
title: Who are we writing for in the web?
date: 2025-10-15
tags:
  - Web Development
  - Content Strategy
  - User Experience
---

As we write for the web, we face a dual challenge: catering to human readers while also considering how machines will interpret our content. These audiences have very different needs.

For humans, you're creating a well-organized, scannable document that respects their time.

For machines, you're creating a container of clear, extractable facts (or "assertions") that explain the context, meaning, and relationships within your content.

Success lies in serving both audiences simultaneously. This post will explore potential ways to synthesize these approaches.

## Content Structure and Hierarchy

The foundation of effective web content is a logical, predictable structure. Machines and human readers alike appreciate a clear hierarchy, as it allows them to understand the document's purpose and find information efficiently. This structure forms the skeleton upon which search engines and AI models build their understanding.

* **Use Headings Logically**: Your heading structure (`<h1>`, `<h2>`, `<h3>`) is a machine-readable outline of your document. Research shows users scan web pages in an [F-shaped pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) &mdash; reading across the top, then down the left side. Your headings are the primary signposts they use during this scan. A single `<h1>` should be the page title, with subsequent `<h2>` tags for main sections. This allows users to quickly jump to the section they need and helps machines parse the main topics of your content.
* **Embrace Scannable Formats**: As Jakob Nielsen points out in [How People Read Online: New and Old Findings](https://www.nngroup.com/articles/how-people-read-online/), users rarely read word-for-word online. They scan for keywords, headlines, and phrases. To accommodate this:
 	* **Keep Paragraphs Short and Focused**: Aim for paragraphs of 1-3 sentences, each dedicated to a single idea. This creates white space, reduces cognitive load for humans, and makes it easier for AI to isolate individual facts.
 	* **Use Lists for Scannability**: Use bulleted (`<ul>`) or numbered (`<ol>`) lists whenever possible. Humans are drawn to them because they are easy to scan. Machines parse them as explicitly structured data sets, which is why lists are frequently pulled for featured snippets.
* **Make URLs Descriptive**: While machines are moving beyond a purely URL-shaped view of the web, the URL is still the address. A clean, readable URL (`your-site.com/baking/sourdough-bread-recipe`) provides immediate context to both humans and machines, unlike a generic one (`your-site.com/p?id=123`).

### The Inverted Pyramid: Get to the Point

The [Inverted Pyramid](https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/the_inverted_pyramid.html) principle is the most critical structural concept for web writing. It dictates that you put the most important information at the top of the page. You start with the conclusion, then provide the key supporting details, and finish with general background information.

The Structure:

* **The Lead (Top)**: The most important information. The who, what, where, when, why. The direct answer to the user's most likely question.
* **The Body (Middle)**: Important details and supporting evidence.
* **The Tail (Bottom)**: General background information, related topics, and historical context.

Why It Works for Humans
: Online readers are impatient. The inverted pyramid ensures they get the key takeaway immediately, without having to scroll or hunt for it. This respects their time and satisfies their intent quickly, reducing bounce rates.

Why It Works for Machines
: Search engines and AI models give more weight to content that appears at the top of the main body. By placing your main point first, you are giving a powerful signal about the page's primary purpose, making it easier for machines to classify your content and identify it as a relevant answer to a query.

## Writing Style for Humans and AI

Your writing style should prioritize clarity, authority, and brevity. The era of writing for clunky algorithms is over; modern systems reward high-quality content that genuinely helps the reader.

* **Be Succinct (Write 50% Less)**: The single most important rule of writing for the web is to be concise. As a general rule, use about half the words you would for a print document. Brevity respects the reader's time and improves comprehension.
* **Eliminate Fluff**: Cut introductory phrases, unnecessary adjectives, and corporate jargon. Get straight to the point.
* **Use Active Voice**: Active voice is more direct and uses fewer words. (e.g., "We launched a new feature" instead of "A new feature was launched by us.")
* **Write Naturally and Comprehensively**: Search engines understand topics, not just keywords. Your goal is to demonstrate expertise by covering a subject thoroughly.
 	* **Build Topical Authority with Topic Clusters**: If your main topic is "baking sourdough bread," that's your "pillar page." Then, create "cluster" articles on sub-topics like "how to make a sourdough starter" and link them back to the pillar page. This signals to search engines that you are an authority on the entire subject.
 	* **Answer the User's Next Question**: Anticipate what a reader will want to know next. By addressing follow-up questions within your content, you create a more valuable, comprehensive resource.
* **Define and Disambiguate Entities**: When you introduce a person, place, or concept (an "entity"), define it clearly. This helps machines connect your content to the correct entry in their Knowledge Graph. For example, instead of just mentioning "Apple," specify "Apple Inc., the technology company founded by Steve Jobs." You are making a clear, machine-extractable assertion.

## Technical Markup: The Machine's Language

This is where you explicitly translate your human-readable content into a machine-readable format. This code layer is crucial because it removes ambiguity and allows you to defend your assertions in a machine-driven world.

* **Semantic HTML**: Use descriptive HTML5 tags for their intended purpose. Wrap your main blog post in `<article>`, use `<nav>` for your menu, and place supplementary information in an `<aside>`. This creates a well-defined structure that algorithms can parse with greater accuracy.
* **Schema Markup (Structured Data)**: This is the most powerful tool for machine consumption. Schema.org provides a shared vocabulary (usually added via JSON-LD) to explicitly define your content. It's the language that powers rich, interactive results on search pages.
 	* `FAQPage`: For interactive dropdowns in search results.
 	* `HowTo`: For guided rich snippets with steps.
 	* `Recipe`: For recipe carousels with ratings and cook times.
 	* `Product`: For shopping results with price and availability.
 	* `Article`: To specify author, date, and publisher.
 	* `LocalBusiness`: For hours, address, and phone number in map listings.
* **Descriptive Alt Text for Images**: Alt text makes your content accessible and provides vital context to search engines. A good alt text is descriptive and concise.
 	* **Bad Alt Text**: `alt="dog"`
 	* **Good Alt Text**: `alt="a golden retriever puppy chewing on a red squeaky toy in the grass"`
* **Open Graph & Twitter Cards**: These meta tags control how your content appears when shared on social media. By explicitly setting the title, description, and a featured image, you ensure every share creates a rich, professional-looking preview, which improves click-through rates.

## The Page vs. The Assertion

A modern perspective, articulated well by experts like Jono Alderson in [The web isn’t URL-shaped anymore](https://www.jonoalderson.com/conjecture/url-shaped-web/), is that the web is no longer purely "URL-shaped." For decades, we optimized the page because search engines indexed and ranked URLs. Now, AI and advanced search engines see the web as a "graph" of interconnected facts, or "assertions." They open the URL container, extract individual facts (a price, an author's name, a key detail), and integrate them into their knowledge models.

In this new reality, the machine's goal isn't just to rank a page; it's to find the most reliable assertion to answer a query.

### Why the Well-Structured Page Still Reigns

While this shift is real, it doesn't make the page obsolete. In fact, the principles in this guide show that the page remains the essential container and context provider for those assertions.

* **Assertions Need a Coherent Home**: A fact like "proof for 8 hours" is meaningless without context. The Topical Authority we build on a page by answering follow-up questions provides the context that makes an assertion valuable. The page is the vessel that gives individual facts their meaning.
* **Structure Provides Hierarchy**: A machine understands that a fact in an `<h2>` heading is more important than one in a closing paragraph. The page-level structure (headings, lists, inverted pyramid) is what allows machines to understand the relative importance of your assertions.
* **The URL is Still the Address**: A descriptive URL is a critical first signal for both humans and machines, providing high-level context before the page is even analyzed.

While machines are deconstructing our pages into data points, the best way to ensure those data points are clear, credible, and understood correctly is to present them within a logically structured, topically comprehensive, and clearly addressed page. The page has evolved from a simple document into a well-organized delivery mechanism for machine-readable assertions.

## Links and Resources

* [The web isn’t URL-shaped anymore](https://www.jonoalderson.com/conjecture/url-shaped-web/)
* [How People Read Online: New and Old Findings](https://www.nngroup.com/articles/how-people-read-online/)
* [Be Succinct! (Writing for the Web)](https://www.nngroup.com/articles/be-succinct-writing-for-the-web/)
