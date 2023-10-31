---
title: Working with local fonts
date: 2023-11-01
---

Web fonts are awesome but there are times when they are not enough.

There may be foundries that don't provide web versions of their fonts or licenses to use their fonts on the web.

Chromium browsers now have the choice of using local fonts for your web projects. This will allow users to take full advantage of the fonts they own for their projects without violating licenses or other potential legal issues.

## Feature detection

Since the feature is only supported in Chrome and Edge but not on other Chromium Browser like Opera or Samsung Internet, Firefox or Safari, we need to code defensively and test if the feature is supported.

We do this by checking if the `window` object contains a [querlyLocalFonts](https://developer.mozilla.org/en-US/docs/Web/API/Window/queryLocalFonts) method. If it does then we can use it to work with local fonts.

Otherwise we'll have to come up with an alternative like only using web fonts,  sticking to the known [web-safe fonts](https://blog.hubspot.com/website/web-safe-html-css-fonts), or using [system font stacks](https://css-tricks.com/snippets/css/system-font-stack/)

```js
if ("queryLocalFonts" in window) {
  // The Local Font Access API is supported
  console.log("Yay!!! Local Font Access if allowed")
} else {
  // The Local Font Access API is NOT supported
  console.log("Booo!!! Local Font Access is not allowed, coming up with a new strategy")
}
```

## Query for local fonts

At the most basic level we can use the API to query for all local fonts installed on a user's system.

In the `logFontData()` function we log information about each local font installed on the user's system.

You can past the block below on your browser's DevTools to see how it works. Remember that this will only work on Chromium and Edge.

```js
async function logFontData() {
  try {
    const availableFonts = await window.queryLocalFonts();
    for (const fontData of availableFonts) {
      console.log(fontData.postscriptName);
      console.log(fontData.fullName);
      console.log(fontData.family);
      console.log(fontData.style);
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

## Query for specific fonts

We can also query for information about specific fonts in the user's system.

`queryLocalFonts` takes an optional parameter.An array of Postscript names for the fonts that we want to match.

We've modified the `logFontData()` function to only retrieve information about Verdana, Verdana Bold and Verdana Italic. All other fonts will be ignored.

```js
async function logFontData() {
  try {
    const availableFonts = await window.queryLocalFonts(
      {
        postscriptNames:
        [
          'Verdana',
          'Verdana-Bold',
          'Verdana-Italic'
        ],
      });
    for (const fontData of availableFonts) {
      console.log(fontData.postscriptName);
      console.log(fontData.fullName);
      console.log(fontData.family);
      console.log(fontData.style);
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

## A more complex examples

The previous two sections show how to log font data. This example will actually use the local fonts on a web page.

The code will do the following:

1. Query for allowed local fonts
2. Create an element to style
3. Create a list of fonts to select from and a selection handler
4. Populate the list with the available fonts
5. Add all of the elements to the page
6. Handle error, e.g. user cancelled the operation

```js
useLocalFontsButton.onclick = async function() {
  try {
    // 1
    const array = await self.queryLocalFonts();

    // 2
    const exampleText = document.createElement("p");
    exampleText.id = "exampleText";
    exampleText.innerText = "The quick brown fox jumps over the lazy dog";
    exampleText.style.fontFamily = "dynamic-font";

    // 3
    const textStyle = document.createElement("style");
    const fontSelect = document.createElement("select");
    fontSelect.onchange = e => {
      const postscriptName = fontSelect.value;
      console.log("selected:", postscriptName);
      // An example of styling using @font-face src: local matching.
      textStyle.textContent = `
        @font-face {
          font-family: "dynamic-font";
          src: local("${postscriptName}");
        }`;
    };

    // 4
    array.forEach(font => {
      const option = document.createElement("option");
      option.text = font.fullName;
      // postscriptName can be used with @font-face src: local to style elements.
      option.value = font.postscriptName;
      fontSelect.append(option);
    });

    // 5
    document.body.appendChild(textStyle);
    document.body.appendChild(exampleText);
    document.body.appendChild(fontSelect);
  } catch(e) {
    // 6
    console.error(`Local font access not available: ${e.message}`);
  }
};
```

This is similar to what word processors like Word or Pages, Typesetting programs like InDesign, or image manipulations programs like Photoshop do to let you use fonts in the applications.

Unlike the previous demos, you can't run this from the console. It must be run on a server. You can see a working [Demo](https://caraya.github.io/local-font-access/) hosted on Github Pages.

## Privacy Considerations

As mentioned in [Local fonts as fingerprint vector](https://developer.chrome.com/en/articles/local-fonts/#local-fonts-as-fingerprint-vector) local fonts used the `local()` function of the `@font-face` declaration can be abused in browser fingerprinting.

Malicious websites could use a combination of fonts loaded using `local()` functions inside `@font-face` declarations, and attempt to render text set in these fonts on a canvas and measure the glyphs. If the glyphs match the known shape of the corporate font like Google Sans, the attacker has a hit. If the glyphs do not match, the attacker knows that a default replacement font was used since the corporate font was not installed.

Abuse of `local()` downloaded fonts has become so prevalent that the WebKit team [decided](https://webkit.org/tracking-prevention/) to "only include web fonts and fonts that come with the operating system, not locally user-installed fonts in the list available fonts".

## Links and Resources

* [Local Font Access API](https://wicg.github.io/local-font-access/) &mdash; Specification
* [Local Font Access API](https://developer.mozilla.org/en-US/docs/Web/API/Local_Font_Access_API) &mdash; MDN
* [Use advanced typography with local fonts](https://developer.chrome.com/en/articles/local-fonts/) &mdash; Chrome Developers
