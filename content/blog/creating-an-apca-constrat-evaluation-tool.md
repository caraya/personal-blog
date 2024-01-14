---
title: Creating an APCA constrat evaluation tool
date: 2024-06-30
tags:
  - Javascript
  - Color
  - Accessibility
draft: true
---

APCA is the upcoming color contrast algorithm for the web. It will be included in WCAG 3.0, currently under development.

APCA presents
 additional requirements that are not present in previous contrast specifications. These requirements present additional challenges for a validation tool.

This post will explore these additional requirements as we build an APCA contrast checker using [Color.js](https://colorjs.io) as the validating tool.

The simplest example hardcodes the colors into variables and demonstrates the following:

* How color.js uses colors in any supported format (they are converted to sRGB colors internally)
* How to use the APCA contrast method with color.js
* How flipping the colors will produce different results, one of which is wrong for the contrast test that we want

```js
import Color from "https://colorjs.io/dist/color.js";

// Simplest example
let text = new Color("p3", [0.9, 0.8, 0.1]);
let background = new Color("slategrey");
let contrast = background.contrast(text, "APCA");
let wrongContrast = text.contrast(background, "APCA");

console.log(contrast); // -> -41
console.log(wrongContrast); // -> 38.2
```

A smarter approach would be to create a function to process the contrast.

```js
function calculateContrast(text, background) {
  let textColor = new Color(text);
  let backgroundColor = new Color(background);

  let contrast = backgroundColor.contrast(textColor, "APCA");

	console.log(`The APCA contrast between
	${text} and ${background}
	is ${contrast.toFixed(4)}`);
}
```

Now we have a function to calculate the APCA contrast value between text and background colors. Now we need to dig into the family of APCA specifications to figure out what values "pass" the APCA tests since the same contrast will not pass all available APCA Readability Criterion (ARC).

Unlike WCAG contrast tests that use a single contrast value in all instances, APCA has several levels of conformance within the same test.

!!! note Note:
The specification is not final so these definitions, as everything else in the world of APCA and ARC, may change between the time this was written and when the specification becomes final. The authoritative source of truth is always the [ARC website](https://readtech.org/ARC/)
!!!

To understand ARC requirements we need to look at some definitions they use:

Fluent Readability for Block/Body Text
: * A block or column of more than two continuous lines of content text that uses a readable font with an `x-height` of ~19px or less

Fluent Readability for primary content that is not body text
: * Up to two and a half lines of continuous text
: * Includes headlines, captions, and images of text, if they contribute to content
: * primary navigation and primary menus
: * asides, tool-tips, spoilers, "continued"
user entered text in forms, fields, etc
: * does not include text the user controls or adjusts in size or color

Large Fluent header/title content
: * Fluent subcategory of "large content" such as big, bold headlines, and generally referring to text larger than 36px

Soft Readability for small sub-fluent secondary or ancillary content
: * Non-primary content with relaxed readability needs.
: * Applies to certain aspects of dataviz (call-outs, de-enhanced aspects of visual hierarchy)
: * Category can include secondary/tertiary nav such as to TOS/EULA
: * May include byline, short duplicative captions, footer matter

Spot readability for sub-fluent "non-content"
: * Non-content text of an incidental nature.
This category includes non-informative placeholder text, disabled controls, copyright/trademark/license bugs (but not actual license or legal text blocks)
: * Logo or Branding, brand-related logo, symbol, service mark.
: * This category relates to specific colors that are required as part of a brand or logotype.
: * Incidental Text in Images text in images not critical to the understanding, nor specifically contributing to the content.

There are also use cases for non-text use cases but they are not relevant to the objectives for this post.

Now that we have definitions under our belts, we can look at the different conformance levels and their requirements.

The `bronze` conformance level only covers the primary text for the page.

The Lc values are what we get from running our `calculateContrast` function.

The different minimum required values are

Lc 90
: This is the preferred level for fluent text and columns of body text with a font/weight combination no smaller than:
:	* 18px/weight 300
: * 14px/weight 400 (normal)
: * non-body text with a font no smaller than 12px.
: Also a recommended minimum for extremely thin fonts with a minimum size of 24px with weight of 200.
: Lc 90 is a suggested **maximum** for very large and bold fonts (greater than 36px at weight 700), and large areas of color.

Lc 75
: The minimum level for columns of body text with a font no smaller than:
: * 24px and 300 weight
: * 18px and 400 weight
: * 16px and 500 weight
: * 14px and 700 weight
: This level may be used with non-body text with a font no smaller than 15px and 400 weight.
: Lc 75 should be considered a minimum for larger text where readability is important

Lc 60
: The minimum level recommended for content text that is not body, column, or block text.
: In other words, text you want people to read. The minimums should be no smaller than:
: * 48px weight 200
: * 36px weight 300
: * 24px weight 400
: * 21px weight 500
: * 18px weight 600
: * 16px weight 700
: These values are based on Helvetica, the reference font. The contrast may not be the same for the fonts you chose for your website.

Lc 45
: The minimum for larger, heavier text such as headlines, and large text that should be fluently readable but is not body text.
: This is also the minimum for pictograms with fine details, or smaller outline icons, no less than 4px in its smallest dimension.
: Font sizes:
: * 36px weight 400
: * 24px weight 7000

Lc 30
: The absolute minimum for any text not listed above, which means non-content text considered as "spot readable"

Lc 15
: The absolute minimum for any non-text that needs to be discernible and differentiable, but does not apply to semantic non-text such as icons, and is no less than 15px in its smallest dimension.
: This may include dividers, and in some cases, large buttons or thick focus visible outlines, but does not include fine details which have a higher minimum.
: Designers should treat anything below this level as invisible, as it will not be visible to many users. This minimum level should be avoided for any items important to the use, understanding, or interaction of the site.

For silver-level conformance, there is more work to do. It is not enough to produce contrast values and compare them with your text.

You should also compare your font with the reference fonts used in creating the reference values that should work for what they deem common sans-serif fonts and many serif fonts:

> Values shown are for common sans-serif fonts (e.g., Helvetica, Arial, Verdana, Montserrat, Roboto, Calibri, Trebuchet)
>
> Many serif fonts should use values for the row above (e.g., Times, Georgia, Cambria, Courier), and especially should be compared in terms of x-height.
>
> Source: [APCA Contrast Calculator](https://www.myndex.com/APCA/) under APCA Font Table: Silver Level

Furthermore:

> Due to the vast variety of font designs, designers should visually compare an unusual font to a standard font such as Helvetica, using the size and weight of Helvetica that most closesly matches the appearance of the tested font as a guide.

To demonstrate whether the contrast between two colors meets the different APCA criteria, we'll have to create blocks of text matching the different criteria so the developer can evaluate whether the contrast works or not.

To illustrate these different levels of contrast, we build blocks with matching font sizes and weight values.

The functions are specific to the Lc level that we want to illustrate. I've used the function to generate Lc90 text.

The function takes three parameters: the text for the block (`text`), the foreground/text color (`textColor`) and the background color (`backgroundColor`).

Next, the function initializes the parameters we want to use in the examples into an array of arrays.

The following step is to create a `div` element and add classes to it using the `classList.add` method.

The core of the class adds attributes with values pulled from the `lc90TestParams` array, from outside the function (`readingText`), and static values where we don't want them to change.

The main issue with the code as it stands is that it uses inline style attributes. It should be possible to use CSS variables but for demonstration purposes, this is OK.

```js
function buildLc90Content(text, textColor, backgroundColor) {
  const lc90TestParams = [
    ["18", 300],
    ["14", 400],
  ];

  lc90TestParams.forEach((elem) => {
    let contentDiv = document.createElement("div");
    contentDiv.classList.add(`test-block`);
    contentDiv.classList.add(`block-lc90-${elem[0]}-${elem[1]}`);

    contentDiv.textContent = `${readingText}`;

    contentDiv.style.color = `${textColor}`;
    contentDiv.style.backgroundColor = `${backgroundColor}`;
    contentDiv.style.fontFamily = "Raleway";
    contentDiv.style.padding = "2rem";
    contentDiv.style.fontSize = `${elem[0]}px`;
    contentDiv.style.fontWeight = `${elem[1]}`;
    contentDiv.style.marginBlockEnd = "4rem";

    document.getElementById("lc90Tests").appendChild(contentDiv);
  });
}
```

The `handleFormSubmit` function handles what to do once the user clicks the submit button on the form.

We capture the values of the two input boxes.

We then run the APCA and WCAG contrast calculations, display the results and display the content for different contrast levels.

```js
function handleFormSubmit(e) {
  e.preventDefault();
  const textColor = document
		.getElementById("textColor")
		.value;

  const backgroundColor = document
		.getElementById("backgroundColor")
		.value;

  displayApcaContrastValue(textColor, backgroundColor);
  displayWcagContrastValue(textColor, backgroundColor);

  buildLc90Content(readingText, textColor, backgroundColor);
  buildLc75Content(readingText, textColor, backgroundColor);
  buildLc60Content(readingText, textColor, backgroundColor);
  buildLc45Content(readingText, textColor, backgroundColor);
}
```

The `handleFormReset` function removes the content from all the elements of the page by setting the `innerHTML` attribute to the empty string.

```js
function handleFormReset() {
  document
		.getElementById("textColor")
		.value = "";
  document
		.getElementById("backgroundColor")
		.value = "";

  const apcaValueContent = document.getElementById("apcaValue");
  apcaValueContent.innerHTML = "";

  const wcagValueContent = document.getElementById("wcagValue");
  wcagValueContent.innerHTML = "";

  const containers = document.querySelectorAll(".test-container");
  containers.forEach((container) => {
    container.innerHTML = "";
  });
}
```

The final step is to attach `submit` and `reset` events to the form element so we can actually run the code when we submit and reset the form.

```js
document
  .getElementById("colorForm")
  .addEventListener("submit", handleFormSubmit);

document
  .getElementById("colorForm")
  .addEventListener("reset", handleFormReset);
```

## Aside: Comparison between APCA and WCAG

The values for APCA contrast as significantly different than those of WCAG 2 since they measure different things.

There is a bridge specification between APCA and WCAG. This specification will produce roughly equivalent APCA and WCAG values

A few things to consider:

* The Bridge PCA will produce different WCAG values from the default WCAG algorithm
* WCAG will produce the same contrast value for two colors, regardless of which one is used for the text or background, PCA will produce different values based on which color is text and which one is background.

Unfortunately, Color.js doesn't support the Bridge PCA algorithm so the values calculated on the tools I'm describing in this post are generated without using the Bridge PCA.

In the table below, `should` and `may` are used in the accordance with [RFC 2119](https://datatracker.ietf.org/doc/html/rfc2119).

| Conformance Level | Type | APCA value | WCAG Compatible Ratio| Notes |
| --- | :---: | :---: | :---: | --- |
| AA enhanced | should |  Lc 15 | 1.1:1 to 2:1 | Invisibility point. Minimum for disabled non-text elements.
| ^^ | ^^ | Lc 30 | 1.6:1 to 2.5:1 | Minimum for non-content text such as placeholders or inactive/disabled text.
| ^^ | ^^ | Lc 45 | 2.2:1 to 3:1 | Minimum for logotypes.
| ^^ | shall | Lc 60 | 3:1 to 3.8:1 | Large font only, no body text. Non-text okay |
| ^^ | ^^ | Lc 75 | 4.5:1 to 5.3:1 | 16px minimum for body text, 13px minimum otherwise |
| ^^ | ^^ |Lc 90 | 8:1 to 9:1 | 14px minimum body text, 11px minimum otherwise |
| ^^ | may | Lc 90 | 8:1 to 9:1 | Suggested maximum for very large and bold elements, larger than 35px <br><br>The indicated WCAG 2 style ratio can be used as it adjusts slightly for greater flexibility, and maintains both backwards compatibility with WCAG 2 and forwards compatibility to APCA |
|AAA, Enhanced | should | Lc 30 | 1.6:1 to 2.5:1 | Minimum for disabled elements (not hidden)
| ^^ | ^^ | Lc 45 | 2.2:1 to 3:1 | Minimum for incidental non-content text such as placeholders, or inactive/disabled texts, with a minimum size of 16px |
| ^^ | shall | Lc 60 | 3:1 to 3.8:1 |Minimum for logotypes and essential non-text |
| ^^ | ^^ | Lc 75 | 4.5:1 to 5.3:1 | Large font only (24px and larger), no body text |
| ^^ | ^^ | Lc 90 | 8:1 to 9:1 | 19px minimum for body text, 16px minimum other content text, 12px minimum for non-content text (such as placeholders) |
| ^^ | may | Lc 85 | 7:1 | Suggested maximum for very large and bold elements, larger than 35px.|

## Links and resources

* APCA
  * [A catalog of Myndex Research content](https://git.myndex.com/)
  * [APCA Contrast Calculator](https://www.myndex.com/APCA/)
  * [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)
  * [APCA Readability Criterion](https://readtech.org/ARC/)
* [Does the contrast ratio actually predict the legibility of website text?](https://www.cedc.tools/article.html)
* [Color.js](https://colorjs.io)
