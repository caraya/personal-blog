---
title: "Working with monospace fonts: fixing an annoying bug"
date: 2026-05-11
tags:
  - Web Typography
  - CSS
  - Variable Fonts
  - Font Loading
---

A persistent CSS quirk often baffles developers: when styling inline `&lt;code>` elements inside a heading, the monospace text appears significantly smaller than the surrounding text. Inspecting the element confirms that the font size inherits perfectly, yet the browser stubbornly renders the monospace text smaller than the rest of the heading.

This discrepancy does not originate in the CSS itself. It stems from a longstanding behavior known as *the user agent fixed-width font size quirk*. Modern browsers maintain distinct default font sizes for standard text and fixed-width text.

This post explores why this discrepancy occurs, how the `font-family: monospace, monospace;` declaration bypasses the browser's parsing engine to solve the issue, and how to stabilize a typography stack when working with modern variable fonts like Recursive.

## The root cause: Browser font preferences

The sizing mismatch originates from the browser's internal user preferences.

Modern browsers maintain separate default font sizes for different typography categories. Inspecting a browser's font settings typically reveals two conflicting defaults:

* **Standard font**: 16px base size.
* **Fixed-width font**: 13px base size.

When the browser's CSS engine calculates the styles for a `<pre>` or `<code>` element, it looks at the `font-family` declaration. If the computed value resolves exactly to the single generic keyword `monospace`, the engine applies the fixed-width font size preference. This immediately drops the element's base size to 13px, making it appear noticeably smaller than the surrounding 16px text.

This effect is compounded when the monospace element is nested inside a larger heading. The heading scales up to 32px (2rem), but the monospace text remains at 13px, creating a jarring visual inconsistency.

Note: It is the keyword, not the HTML tag

This sizing bug is not exclusive to specific HTML elements like `<code>` or `<pre>`. It applies to any HTML element where the computed font family resolves entirely to the generic `monospace` keyword.

The trigger is the CSS keyword itself. Applying `font-family: monospace;` to a standard `<p>` or `<span>` still causes the browser's CSS engine to switch its baseline reference from the standard font preference (typically 16px) to the fixed-width font preference (typically 13px). Because the quirk is tied to how the parser interprets the generic keyword, applying the `monospace, monospace` hack successfully normalizes the baseline size on any element.

## How the comma hack defeats the parser

The `font-family: monospace, monospace;` declaration is a clever exploit of the CSS parser's pattern-matching logic.

Duplicating the keyword (or appending it twice after a custom font) changes how the browser evaluates the rule. The CSS engine sees a comma-separated list rather than the standalone generic keyword. Because it no longer matches the exact string `monospace`, the browser skips the 13px fixed-width override.

Consequently, the element falls back to standard inheritance, adopting the 16px proportional base size of its parent container.

## Variable fonts: Internal consistency vs. external fallbacks

When using a highly versatile variable font like Recursive, developers can transition between proportional and monospace designs using the "MONO" axis. The type designers engineered Recursive so its x-height remains mathematically consistent whether the "MONO" axis is set to 0 or 1.

Despite this internal consistency, developers cannot bypass fallback hacks. The browser's rendering engine and network conditions dictate otherwise.

### The browser parser is blind to the font file

The user agent fixed-width quirk occurs entirely during the CSS parsing phase, long before the browser downloads or analyzes the variable font file.

The CSS engine does not know that Recursive has a perfectly consistent x-height. It only looks at the CSS string. If Recursive fails to load—or while the user is waiting for it to download—the browser falls back to the next value in the stack. If that value is a solitary monospace keyword, the CSS parser immediately applies the 13px penalty, overriding the 16px proportional baseline.

Therefore, appending monospace, monospace to the end of a variable font stack remains mandatory to protect the layout during network failures.

### Implementing the robust variable font stack

To achieve seamless scaling across paragraphs and headings while protecting against network failures and layout shifts, developers must combine the parser hack with parent-relative sizing (em) and a comprehensive @font-face declaration.

#### The @font-face declaration

When defining a variable font like Recursive, specify the supported axes ranges (like weight and slant) within the @font-face block. Developers can also utilize size-adjust to scale the font's visual weight to match the local system fallback font during the flash of unstyled text (FOUT).

```css
@font-face {
  font-family: "Recursive";
  src: url("/fonts/recursive.woff2") format("woff2")
    tech(variations);
  font-display: swap;
  font-weight: 300 1000;
  unicode-range: U+000D, U+0020-007E, U+00A0-00FF, U+0131, U+0152-0153,
    U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2007-200B, U+2010, U+2012-2015,
    U+2018-201A, U+201C-201E, U+2020-2022, U+2026, U+2030, U+2032-2033,
    U+2039-203A, U+203E, U+2044, U+2052, U+2074, U+20AC, U+2122, U+2191,
    U+2193, U+2212, U+2215;
  /*
    Adjust this percentage to visually match the local system monospace fallback
  */
  size-adjust: 96%;
}

:root {
  /* Define variables for easy application across your cascade layers */
  --font-family-sans: "Recursive", sans-serif;
  /* The second monospace declaration is the hack */
  --font-family-mono: "Recursive", monospace, monospace;
  --code-color: #e83e8c;
}
```

Developers could further refine the @font-face declaration by defining multiple font faces for different axis combinations, but the above declaration is sufficient to demonstrate the core principles of a robust variable font stack.

#### Applying the styles to elements

When styling the specific code elements, use the `--font-family-mono` variable, set the desired font variation settings, and explicitly declare font-size: 1em;.

Using 1em ensures the code block scales proportionally with its parent container. If that code block sits inside an `<h2>` that is scaled to 2rem (32px), 1em guarantees the code block matches the heading size instead of reverting to the root 16px.

```css
pre,
code,
kbd,
samp,
var {
  color: var(--code-color);
  /* The variable resolves to: "Recursive", monospace, monospace */
  font-family: var(--font-family-mono);
  font-variation-settings: "MONO" 1, "CASL" 0, "wght" 400, "slnt" 0, "CRSV" 0.501;
  /* Scales the element proportionally to its parent container */
  font-size: 1em;
}

/* Example of proportional text using the same font family */
body {
  font-family: var(--font-family-sans);
  font-variation-settings: "MONO" 0, "CASL" 0, "wght" 400, "slnt" 0, "CRSV" 0;
}
```

## Managing font loading dynamically

When relying on a custom variable font, browsers typically display a system fallback font until the network request completes. This results in a flash of unstyled text (FOUT). To apply specific layout adjustments or reveal the text only after Recursive successfully loads—avoiding FOUT entirely—developers can leverage the CSS Font Loading API.

The `document.fonts.ready` promise resolves when the browser finishes all font loading operations. By awaiting this promise, developers can query the internal FontFaceSet to verify if a specific custom font is available.

The document.fonts.ready promise resolves when the browser finishes all font loading operations. By awaiting this promise, developers can query the internal FontFaceSet to verify if a specific custom font is available.

To optimize performance, utilize a `for...of` loop instead of spreading the `FontFaceSet` into an array. A standard loop evaluates lazily and short-circuits (break) as soon as it finds a match, completely avoiding the allocation of an unnecessary intermediate array in memory. Defining a named function provides clear scope and readability, and stripping any unexpected quotation marks from the font family name ensures cross-browser compatibility. Finally, by returning a boolean, this function allows calling code to await the result and perform additional logic depending on whether the font successfully loaded.

```ts
async function initFontCheck(): Promise<boolean> {
  try {
    const fonts = await document.fonts.ready;
		// initialize isRecursiveLoaded to false before the loop
    let isRecursiveLoaded = false;

    for (const font of fonts) {
      // Strip quotes to handle cross-browser string inconsistencies
      const familyName = font.family.replace(/['"]/g, '');
      if (familyName === 'Recursive') {
        isRecursiveLoaded = true;
        break;
      }
    }

    if (isRecursiveLoaded) {
      document.documentElement.classList.add('font-recursive-loaded');
    }

    return isRecursiveLoaded;
  } catch (error) {
    console.error('Font loading failed:', error);
    return false;
  }
}

// Calling code can use the boolean result
initFontCheck().then((isLoaded) => {
  if (isLoaded) {
    console.log('Typography ready!');
  }
});
```

Once the script detects the font, it adds a `.font-recursive-loaded` class to the root `<html>` element. Developers can then use this class in CSS to seamlessly transition the typography, either by swapping CSS custom properties or animating the text visibility:

```css
/* Hide text initially to prevent FOUT */
body {
  opacity: 0;
  transition: opacity 0.2s ease-in;
}

/* Reveal text smoothly once the custom font is fully loaded */
.font-recursive-loaded body {
  opacity: 1;
}
```

## Conclusion

The monospace sizing discrepancy is one of web typography's most enduring and frustrating quirks. Conquering it simply requires understanding how browsers prioritize user font settings. Even when utilizing meticulously crafted variable fonts like Recursive, the browser's initial parsing phase mandates defensive CSS.

By leveraging the `monospace, monospace` parser hack alongside parent-relative em units, developers force browsers to treat fixed-width fonts with the same proportional respect as standard text. Appending this fallback trick to the end of custom font stacks ensures that inline code blocks remain perfectly sized across all layouts and network conditions.
