---
title: "Archival Web: Exploring the Past, And Improving the Future"
date: 2026-05-04
tags:
  - Research
  - CSS
  - Web Development
  - Web History
---

The web has evolved significantly since its creation, and with it, the technologies that power it. Chief among them is CSS, which has undergone significant changes since it was first introduced in 1996. As developers look to the future of web development, it is important to look back and understand the history of CSS, how it has evolved, and what lessons the industry can learn from its past.

This post explores the history of CSS, from its early days to its current state, and how developers can use that knowledge to improve future web development practices. It also examines tools and techniques for analyzing archival CSS and applying those insights to modern workflows.

## A brief history of CSS

Before diving into front-end archaeology, it is important to review the history of CSS and how it evolved over the years. This provides context for the exploration of archival CSS and highlights the significance of the analysis tools discussed later in this post.

### Before CSS: The early days of web styling

When the first web pages were created in the early 1990s, there was no standard way to style content. Web developers had to rely on HTML tags and attributes to control the appearance of their pages.

```html
<h1 color="red">Hello World</h1>
```

This approach was limited and often resulted in inconsistent styling across different browsers. Some of the most commonly used attributes for styling in this era included:

* **align**: Used on elements like `div`, `p`, `h1` to `h6`, `img`, and `table` to control the horizontal alignment of content (e.g., left, center, right).
* **bgcolor**: Defined the background color for elements such as `body`, `table`, `tr`, `td`, and `th`.
* **width** and **height**: Used with images (`img`) and tables (`table`, `td`, `th`) to specify dimensions in pixels or percentages.
* **border**: Defined the border thickness around elements like `table` and `object`.
* **cellpadding** and **cellspacing**: Controlled the space within table cells and between table cells and borders, respectively.
* **hspace** and **vspace**: Added horizontal and vertical whitespace (margins) around elements such as `img` and `object`.
* **color**: Used within the now-deprecated `<font>` tag to specify text color.
* **size**: Also used within the `<font>` tag to set the font size.
* **face**: Specified the font family within the `<font>` tag.
* **background**: Specified a background image for the `body` of the page.
* **text**: Defined the default text color for the `body` element.
* **link**, **alink**, **vlink**: Specified colors for unvisited, active, and visited links, respectively, for the `body` element.

In its early days, the web was created as a document-sharing network; the focus was on content, not presentation. As the web evolved, these inline styles became problematic because developers had to duplicate styling attributes manually across multiple elements and pages.

### CSS 1

The original Cascading Style Sheets specification attempted to unify the style of the web by introducing a separate language for styling content. This allowed developers to define styles in a more structured way and apply them consistently across multiple pages.

Published in 1996, this specification marked the official introduction of CSS and its associated terms and concepts. While it was a significant step forward in web development, it was also limited in its capabilities. For example, it did not support layout or positioning, and it had limited support for fonts and colors.

During the late 1990s browser wars, Microsoft and Netscape prioritized platform locking over standards, leading to inconsistent, buggy CSS implementations, with developers caught in the middle.

### The browser wars and proprietary CSS

In the mid-to-late 1990s, the "Browser Wars" between Netscape Navigator and Microsoft Internet Explorer (IE) turned CSS into a digital minefield. While the World Wide Web Consortium (W3C) published the CSS 1 recommendation in 1996, the two titans treated standards as mere suggestions, prioritizing market dominance over interoperability.

#### The proliferation of proprietary elements

Rather than following a unified roadmap, both browsers raced to release exclusive features to lure users, often inventing their own HTML tags that required specific rendering engines.

* Microsoft Internet Explorer's `<marquee>`: Introduced a scrolling text effect that only worked in IE.
* Netscape's `<blink>` and `<multicol>`: The infamous blinking text and a tag for multi-column layouts were unique to Netscape.
* Netscape's `<layer>`: Used for positioning elements, often conflicting with other layout methods. It also introduced severe usability and accessibility issues.
  * Layering Wars: Netscape pushed the `<layer>` tag for positioning, while Microsoft pushed "Dynamic HTML" (DHTML) using CSS absolute positioning. Netscape eventually lost this battle, but not before thousands of sites were built using the incompatible `<layer>` syntax.

#### Incompatible technologies and the box model

Even when both browsers supported the same feature, they implemented them differently, creating a "forked" web.

* **The Box Model Inconsistency**: One of the most famous frustrations was the CSS Box Model. IE calculated the width of an element by including padding and borders inside the defined width. The W3C standard, however, specified that padding and borders should be added to the width.
* **JScript vs. JavaScript**: Microsoft created JScript, a reverse-engineered version of Netscape's JavaScript. Minor differences in how they handled the Document Object Model (DOM) meant scripts written for one browser frequently crashed the other.

#### The burden of triple coding

The chaos reached a peak where developers were often forced into a triple coding workflow. To ensure a site worked for everyone, development teams essentially maintained three distinct versions:

* **The IE Version**: Tailored to the proprietary IE box model and `document.all` scripting.
* **The Netscape Version**: Built using `<layer>` tags or specific JavaScript "resize hacks" because Netscape 4.x often lost CSS styling when the window resized.
* **The W3C "Future" Version**: A version that strictly followed W3C standards. Developers wrote this version as a "placeholder for sanity," hoping that one day browsers (like the upcoming Opera or Phoenix/Firefox) would finally render it correctly.

To manage this, developers used "browser sniffing" to serve the appropriate version. A conceptual logic gate for a layout looked like this:

```js
/**
 * Conceptual "Triple Coding" Logic
 * Used to route users to the browser-specific version of a site.
 */
function getSiteVersion() {
  const agent = navigator.userAgent.toLowerCase();

  // 1. Netscape 4.x (Proprietary <layer> support)
  if (agent.includes("mozilla/4") && !agent.includes("msie")) {
    return "Serving the <layer> based layout for Navigator.";
  }

  // 2. Internet Explorer (Proprietary DHTML / IE Box Model)
  if (agent.includes("msie")) {
    return "Serving the DHTML/IE Box Model layout for Internet Explorer.";
  }

  // 3. The W3C "Standards" Path (The theoretical target)
  return "Serving the W3C-compliant layout for modern browsers.";
}
```


#### "Best viewed with" campaigns

As a result of this fragmentation, websites were peppered with "Best Viewed with Internet Explorer" or "Optimized for Netscape Navigator" badges. Many sites used rigid browser sniffing scripts; visiting an IE-optimized site with Netscape often resulted in a splash screen blocking entry until the user downloaded a different browser.

#### Impact on developers: The dark ages

For developers, this era was defined by extreme inefficiency.

* **The Rise of CSS Hacks**: To manage the three-way split, developers invented "hacks" (like the Box Model Hack) that used CSS syntax errors to target specific browser versions within a single file.
* **The "Flash" Escape**: Frustrated by the inability to create consistent layouts, many abandoned the open web for Adobe Flash, which guaranteed a "pixel-perfect" experience across all browsers via a plugin. In 2007, Microsoft introduced Silverlight as a competitor to Flash, but it never gained the same traction and was eventually discontinued in 2021.
* **Birth of the [Web Standards Project](https://www.webstandards.org/) (WaSP)**: In 1998, developers formed WaSP to lobby browser makers to support W3C standards, eventually leading to the modern, interoperable web used today. The project successfully completed its mission and ceased operations in 2013.

### CSS 2 and 2.1

By 2002, the browser wars were largely considered over, with Internet Explorer dominating around 95% of the market share. However, the damage was long-lasting and insidious. Microsoft's dominance meant that they had little incentive to fix their broken CSS implementation, and many developers simply coded for IE, ignoring standards altogether.

Released in 1998, CSS 2 significantly expanded the capabilities of the web, moving beyond simple font and color tweaks to true layout control. Key features included:

* **Absolute and Relative Positioning**: The ability to place elements anywhere on the page using `top`, `left`, `right`, and `bottom`.
* **Z-index**: The introduction of "stacking layers," allowing elements to overlap.
* **Media Types**: The early seeds of responsive design, allowing developers to define separate styles for screen and print.
* **Generated Content**: The introduction of `:before` and `:after` pseudo-elements.
* **Advanced Selectors**: The ability to target elements based on attributes (e.g., `input[type="text"]`).

#### The crisis of browser support

While the W3C defined these features, the browsers—locked in a cutthroat war simply refused to implement them consistently. By this time, IE had won the market share battle, removing any incentive to fix their broken CSS implementation or introduce new W3C features. Netscape, on the other hand, was in free fall and was eventually discontinued in 2008.

* **The "Vicious Cycle"**: Developers avoided CSS 2 because it was broken in IE or Netscape; browser makers avoided fixing CSS 2 because no one was using it.
* **The Broken Box Model**: Microsoft’s refusal to adopt the standard box model meant that a "standard" CSS 2 layout physically broke when viewed in the world’s most popular browser.
* **Stagnation**: This lack of support led to the "Table Layout" era, where developers used invisible HTML tables to hack together layouts, creating code that was bloated, inaccessible, and a nightmare to maintain.

#### The role of the Web Standards Project (WaSP)

The Web Standards Project (WaSP), formed in 1998 by Jeffrey Zeldman and others, acted as the diplomatic corps of the developer world.

* **Convincing Microsoft**: WaSP used a carrot-and-stick approach. They publicly shamed browsers that failed standards tests (like the famous Acid1 Test) while simultaneously providing Microsoft and Netscape engineers with the documentation and business use cases required to justify following the rules.
* **The "IE5 Mac" Turning Point**: WaSP’s influence helped lead to Internet Explorer 5 for Mac, which became the first browser to achieve near-100% CSS 1 support. This proved to the industry that standards-compliant rendering was possible.

#### The impact of new competitors

The standards revolution was won through market pressure from new, agile competitors.

##### Opera and the Acid tests

Opera was an early champion of standards. The browser was often the first to implement CSS 2 features correctly, providing a reference for what the web should look like. Opera engineers were instrumental in creating the Acid2 Test, a visual test that only rendered a smiley face if the browser perfectly supported CSS 2.1.

##### The Firefox Phoenix

When Firefox (originally Phoenix) rose from the ashes of Netscape, it was built on the Gecko engine, which prioritized standards from day one. Firefox gave users a faster, safer, and correctly rendered alternative to IE6. As Firefox’s market share climbed, Microsoft could no longer ignore the broken state of IE.

##### The Chrome acceleration

By the time Google Chrome arrived in 2008, the landscape shifted dramatically. Chrome's WebKit engine (and later Blink) was so fast and compliant that it forced a rapid release cycle across the industry. Microsoft was finally forced to abandon the proprietary IE architecture and eventually rebuilt their browser (Edge) on the same Chromium engine as Chrome.

#### The solution: DOCTYPE switching

The most ingenious solution to the support crisis was "DOCTYPE Switching." To avoid breaking the millions of legacy sites written for IE’s old box model, browsers introduced "Quirks Mode."

If a developer included a proper W3C <!DOCTYPE> at the top of their HTML, the browser operated in "Standards Mode" and followed the W3C specifications. If the tag was missing, the browser fell back to "Quirks Mode" to maintain backward compatibility with old, non-standard code. This elegant solution allowed the web to move forward without breaking historical content.

### The current state of CSS

CSS 2 was significantly larger in scope than CSS 1. However, it remained a monolithic specification that attempted to cover all aspects of styling in one document. This made it difficult for browser vendors to implement and for developers to track changes.

After finishing CSS 2.1, the CSS Working Group shifted to a modular approach, breaking the specification into smaller, more manageable components. This allowed for the faster development and implementation of new features.

Key developments in recent years include:

* **Layout and responsive design**
  * [Flexbox (Flexible Box Layout)](https://www.w3.org/TR/css-flexbox-1/): Introduced as a one-dimensional layout model, Flexbox provides an efficient way to arrange, align, and distribute space among items in a container.
  * [CSS Grid Layout](https://drafts.csswg.org/css-grid-3/): A powerful two-dimensional layout system that enables the creation of complex grid structures, offering full control over element placement without relying on frameworks or floats.
  * [Media Queries](https://www.w3.org/TR/mediaqueries-4/): A cornerstone of responsive web design, media queries allow developers to apply styles based on device characteristics like screen size and orientation.
  * [Container Queries](https://www.w3.org/TR/css-contain-3/#container-features): An evolution of responsive design, container queries allow components to adapt their styles based on the size of their parent container rather than the global viewport size, making components context-aware.
* **Visual effects and interactivity**
  * [Transitions](https://www.w3.org/TR/css-transitions-1/) and [Animations](https://www.w3.org/TR/web-animations-1/): CSS now natively supports smooth transition effects and complex @keyframes animation rules, eliminating the need for JavaScript-based animation libraries for basic movement.
  * Border Radius, Box Shadows, and Gradients: These features enable the creation of modern visual elements (e.g., rounded corners, drop shadows) using pure CSS, eliminating the legacy need for images or complex layout hacks.
  * [2D and 3D Transformations](https://www.w3.org/TR/css-transforms-1/): Properties like rotate(), scale(), and translate() allow elements to be transformed in 2D or 3D space.
  * [Backdrop Filters](https://drafts.csswg.org/filter-effects-2/): The backdrop-filter property enables visual effects like background blurring (the "frosted glass" look) for elements positioned behind the target element.
* **Maintainability and advanced selectors**
  * [CSS Variables (Custom Properties)](https://www.w3.org/TR/css-variables-1/): The introduction of custom properties improves the maintainability and modularity of stylesheets by allowing the definition of reusable, dynamically updatable values.
  * [New Selectors](https://www.w3.org/TR/selectors-4/): New pseudo-classes like :nth-child(), :is(), :where(), and the powerful :has() parent selector provide flexible and precise ways to target DOM elements.
  * [Cascade Layers (@layer)](https://www.w3.org/TR/css-cascade-5/#cascade-layers): This feature provides a structured way to organize and balance the cascade priority of styles, making it easier to manage specificity in large projects.

## CSS archaeology

With the history of CSS established, developers can turn their attention to the practice of CSS archaeology. This involves analyzing and understanding the CSS of older websites, particularly those from the late 1990s and early 2000s, to gain insights into how web development evolved.

Many sites remain "frozen in time," providing a perfect snapshot of web development practices from a specific era. Analyzing the CSS of these sites reveals the exact techniques and challenges developers faced, informing modernization strategies.

When commissioned to update or maintain legacy platforms, researching the archival CSS helps developers understand the original design intention. Furthermore, studying these historical patterns highlights which legacy constraints still silently influence modern browser behaviors.

### Target patterns for archival analysis

When analyzing archival CSS, the goal is to identify patterns and techniques that defined specific periods of web development. A comprehensive analysis looks for:

* The use of proprietary tags and attributes (e.g., `<layer>`, `document.all`).
* IE 5 through 11 specific hacks and workarounds.
* Prefixed attributes and properties:
  * `-moz-`: Mozilla browsers (Netscape, Firefox).
  * `-webkit-`: WebKit browsers and Chrome before they forked into Blink.
  * `-o-`: Opera browsers.
  * `-ms-`: Microsoft browsers (Internet Explorer, Edge before Chromium adoption).
  * `-khtml-`: Konqueror browser, the source WebKit forked from.
* The use of tables for layout and the associated CSS styling techniques.
* Adherence to the compatibility living standard.
* Usage of quirks mode vs. standards mode (DOCTYPE presence and type).
* The presence of browser sniffing scripts used to serve different styles to different rendering engines.
* The use of CSS hacks (e.g., the Box Model Hack) to target specific browser versions.

For every pattern identified, developers can analyze its original purpose, how it was implemented, and what modern techniques have safely replaced it.

### Creating the analyzer tool

The core of the tool relies on a JSON set of rules defining the historical patterns to search for.

Each rule includes an `id`, `category`, `regex`, `severity`, `purpose`, and `modernReplacement`. The `regex` field contains a regular expression to search for the specific pattern in the source code. The `purpose` field explains why the pattern was historically necessary, and the `modernReplacement` field suggests modern standardization techniques.

An example of the JSON rule structure:

```json
[
  {
    "id": "ie6-star-html",
    "category": "IE6 Hacks",
    "regex": "\\* html [.#]?[\\w-]+",
    "severity": "High",
    "purpose": "Star HTML hack (IE6 parser bug).",
    "modernReplacement": "Standard selectors."
  },
  {
    "id": "ie6-underscore",
    "category": "IE6 Hacks",
    "regex": "_\\w+\\s*:",
    "severity": "High",
    "purpose": "Underscore prefix hack.",
    "modernReplacement": "Standard properties."
  }
]
```

The regular expressions in each rule match specific legacy patterns. While expressed as strings in the JSON, the engine converts them into executable regular expression objects at runtime.

The second component of the tool is `analysisRules.ts`, the core detection engine. Its job is to load pattern definitions, turn them into usable regular expressions, scan the input one line at a time, and return structured findings for the UI.

The `RULES` constant converts each JSON rule into a runtime object with a real `RegExp`. A JSON entry like `"regex": "-moz-[\\w-]+\\s*:"` becomes `new RegExp(rawRule.regex, 'gi')`, utilizing the `g` (global) and `i` (case-insensitive) flags.

The `analysisRules` function executes the following flow:

* Splits the input into lines using `input.split('\n')`.
* Creates an empty findings array.
* Tests every rule against each line.
* If a rule matches, it pushes a normalized result object containing:
  * **line**: The 1-based line number.
  * **content**: The trimmed source line.
  * **category**: The rule category.
  * **severity**: The rule severity.
  * **purpose**: The historical purpose.
  * **modernReplacement**: The suggested modern replacement.

Two critical implementation details ensure accuracy:

A `firedRuleIds` Set prevents the exact same rule from being recorded multiple times for the same line.

Executing `rule.regex.lastIndex = 0` resets the regex state before testing. Because the regular expressions use the `g` flag, JavaScript `RegExp` objects retain internal position state across calls. Failing to reset `lastIndex` causes unpredictable skipped matches.

The function returns an array of `AnalysisFinding` objects. The React UI in the analyzer utilizes a two-pane display to render these findings. It provides a text box for the source code on the left and presents the structured results in a user-friendly table on the right.

### Enhancing the tool: Adding JavaScript detection

In addition to analyzing CSS, the tool can analyze JavaScript code for patterns related to legacy CSS manipulation, such as `document.all`, `document.layers`, and other proprietary methods that affected styling before standard DOM APIs existed.

To accommodate these patterns, the architecture uses a second JSON file containing rules specific to JavaScript.

```json
[
  {
    "id": "js-document-all",
    "category": "JS: Browser Detection",
    "language": "JS",
    "regex": "document\\.all\\b",
    "severity": "High",
    "purpose": "document.all: IE-only proprietary DOM collection, used as a browser sniff flag and for direct element style access.",
    "modernReplacement": "document.getElementById() / document.querySelector(), combined with feature detection."
  },
  {
    "id": "js-document-layers",
    "category": "JS: Browser Detection",
    "language": "JS",
    "regex": "document\\.layers\\b",
    "severity": "High",
    "purpose": "document.layers: Netscape 4 proprietary API for CSS-positioned layer objects.",
    "modernReplacement": "Standard DOM: document.getElementById() with CSS positioning."
  }
]
```

The `analysisRules` engine merges both CSS and JavaScript rules into a single array, applies them to the input code, and displays the detected language context within the UI.

## Future work

The tool serves as a proof of concept for CSS archaeology. Potential future improvements include (completed items are struck through):

* Expanding the rule set to cover more patterns and techniques from different eras of web development.
* While the current tool will fetch URLs, it will only parse and analyze CSS. A future enhancement is to also fetch and analyze JavaScript files, looking for patterns related to CSS manipulation and browser detection included in the `jsRules.json` file.
* Adding a feature to automatically suggest code changes based on the findings, potentially utilizing AI to generate pull requests with modernized CSS.
* Adding a feature to capture and analyze code from live websites. This is significantly more complex than analyzing static code, as it requires fetching and parsing the live DOM, handling dynamic content, and mitigating CORS issues. Key challenges include:
  * URL fetching in the browser frequently hits CORS limits.
  * Server-side fetching is more reliable but remains vulnerable to bot protection, auth walls, and dynamic rendering limits.
  * External assets introduce edge cases like relative URL resolution, multi-file bundling, and massive minified scripts.
  * Designing useful UX around partial success and timeout failures per resource.
