---
title: "Open Type features"
date: "2015-08-03"
categories: 
  - "typography"
---

Open Type fonts have a set of features that make typographical work easier both in print and, where supported, on the web. These features can be enabled. These are a subset of all the Open Type features available.

- "c2sc" : small caps from caps: Substitutes capital letters with small caps
- "calt" : contextual alternates: Applies a second substitution feature based on a match of a character pattern within a context of surrounding patterns
- "clig" : contextual ligatures: Applies a second ligature feature based on a match of a character pattern within a context of surrounding patterns
- "dlig" : discretionary ligatures: [Ligatures](https://www.wikiwand.com/en/Typographic_ligature) to be applied at the user's discretion
- "hist" : historical character alternatives: Obsolete forms of characters to be applied at the user's discretion
- "hlig" : historical ligatures: Obsolete ligatures to be applied at the user's discretion
- "kern" : enable use of embedded kerning table
- "liga" : common ligatures: Replaces a sequence of characters with a single ligature glyph
- "nalt" : alternate annotation: Provides user access to circled digits, inverse letters etc.
- "salt" : stylistic alternatives: Either replaces with, or displays list of, stylistic alternatives for a character
- "smcp" : small caps: Substitutes lower-case letters with small caps versions
- "ss01 -- ss05": alternate stylistic set 1 through 5: Replaces character with one from a font-specific set of alternatives
- "swsh" : swashes: Either replaces character with or displays multiple [swashed](https://www.wikiwand.com/en/Swash_(typography)) versions
- "zero" : slashed-zero: Replaces the digit 0 with slashed 0

Adobe has [more information about Open Type features](http://partners.adobe.com/public/developer/opentype/index_tag3.html), both the ones listed above and additional features used in desktop publishing. When in doubt use the name above to check Adobe's list. Furthermore make sure that the font you want to work with supports the features we intend to use.

The best way to check what opentype features a font supports is to check the font specimen, if available. If not contact the foundry or the font creator to check on feature support.

To enable these features in CSS use something like the code below to account for most modern browser versions:

```css
body {
  -moz-font-feature-settings: "liga=1, dlig=1";
  -ms-font-feature-settings: "liga", "dlig";
  -webkit-font-feature-settings: "liga", "dlig";
  -o-font-feature-settings: "liga", "dlig";
  font-feature-settings: "liga", "dlig";
}
```

This feature is a prime candidate for autoprefixer or some other automation tool. Repeating the same sequence of value-pair for 3 or 4 different alternatives is a nightmare; according to [caniuse.com](http://caniuse.com/#search=font-feature-settings), Only IE, Chrome/Opera and Firefox support the feature and Chrome/Opera support it behind the -webkit flag.

For a better explanation and specific examples, check this [Typekit Help](http://help.typekit.com/customer/portal/articles/1789736) article
