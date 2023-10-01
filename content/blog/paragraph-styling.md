---
title: "Paragraph Styling"
date: "2015-07-13"
categories: 
  - "typography"
---

Most the time we spend engaged with text is with paragraphs and that's where I put a lot of my research time when working on a new project. You may be asking why put so much work on how the paragraphs look... As you will see in the example below there are many elements that are involved in controlling paragraph appearance.

<p class="codepen" data-height="1018" data-theme-id="2039" data-slug-hash="yNXbBj" data-default-tab="result" data-user="caraya">See the Pen <a href="http://codepen.io/caraya/pen/yNXbBj/">Playing with paragraph type</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script src="//assets.codepen.io/assets/embed/ei.js" async></script>

With the content above we can now start playing with type. Do the following activities to get a feel for how much type can change:

1. Change the font-size on `div#example4 p:first-child` to 1.5em
    - Does the size of the first paragraph change your reaction to it? Does size matter?
2. Remove the reference to "fira\_sanslight" to see what would the text look like in Arial
3. Remove the reference to Arial to see what the text would look like in the system's Sans Serif font
    - What are the differences between the three fonts?
4. Change the font-size attribute to 1.5em and the line-height to 1 Is it harder to read?
5. Change the line-height to 1.5. Does it get easier?
6. Chang the reference to "Stone Humanist" to Verdana. Can you describe the changes?
    - Does the line height change how easy or hard it is to read the text?
7. Change the width attribute of `div#example4` to 50%
    - Does the text become harder to read as it gets narrower?
8. Change the word spacing from normal to .25em
9. Change the word spacing from .25em to -.25em
    - Does the text become harder to read as it gets sspread further apart? As it gets condensed together?
10. Change the letter spacing from 0 to .25em.
11. Change the letter spacing from .25em to -.25em
    - Does the text become harder to read as it gets sspread further apart? As it gets condensed together?

The typeface you select does make a difference. While we may not conciously notice how the text changes the changes affect the way text looks and the way we interact with it. I know I hit you with a lot of activities and questions for this little paragraph exercise so feel free to play with some, all or none of the activities above.

But whether you use them or not, you get the idea of how much work goes into making paragraphs read well.

### Drop caps

Most (if not all) of us have seen the big initial capital letter on the first paragraph of a chapter. We can do th is with CSS. One version of the effect looks like the code below using first--of-type and first-letter to identify the first letter of the first paragraph and the styles to apply to t his pseudo element

```css
p:first-of-type:first-letter {
  font-size: 3em;
  line-height: 0.9em;
  float: left;
  padding-right: 0.15em;
}
          
```

Unfortunately older browsers don't support the :first-of-type selector (looking at IE7 and possibly IE8) so we have to work around and tie the drop cap to the first letter of the first element. Most of the time this will be an h1 or other heading element but it can be any element you want. Note that you will have to hardcode what the first element is and change your SASS/CSS every time you change the first element

If you don't care about supporting older browsers then this is a non-issue but coding defensively is always a good practice :)

```css
h1 + p:first-letter {
  font-size: 3em;
  line-height: 0.9em;
  float: left;
  padding-right: 0.15em;
}
          
```

<p data-height="821" data-theme-id="2039" data-slug-hash="LVLyVP" data-default-tab="result" data-user="caraya" class="codepen">See the Pen <a href="http://codepen.io/caraya/pen/LVLyVP/">Example of drop cap using sibbling selectors</a> by Carlos Araya (<a href="http://codepen.io/caraya">@caraya</a>) on <a href="http://codepen.io">CodePen</a>.</p>

<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
