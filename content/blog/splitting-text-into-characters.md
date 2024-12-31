---
title: Splitting text into characters
date: 2025-01-13
tags:
  - Javascript
  - Design
---

[Splitting.js](https://splitting.js.org/) is a JavaScript library that splits text into characters, words, and lines. It can be used to create interesting text animations and effects. However, there are times when it can be overkill since we don't always need the full functionality it provides.

This post will show you how to split text into characters using Javascript and how you can use this technique to style characters individually.

## Splitting text into characters

Rather than manually wrapping each character in a span tag, we can use Javascript to split the text into characters and wrap each character in a span tag.

We wrap the code in an event listener for the `DOMContentLoaded` event to ensure that the script runs after the document has been fully loaded and the text is available.

1. Capture all elements with the class `split`
2. Loop through all matching elements
3. Split the text content of each element into individual characters
4. Transform each character into a span element
5. Join the array of span elements back into a string
6. If the character is a space, return it as-is without wrapping
7. Wrap the character in a span with classes `char` and `charN` (N = 1-based index)
8. Join the array back into a string
9. Replace the element's content with the wrapped characters
10. Call the function to apply the transformation

```js
document.addEventListener('DOMContentLoaded', () => {
  function splitText() {
    // 1
    const elements = document.querySelectorAll('.split');

    // 2
    elements.forEach((element) => {
      // 3
      const text = element.textContent;
      // 4
      const splitCharacters = text.split('');

      // 5
      const wrappedText = splitCharacters.map((char, index) => {
        if (char === ' ') {
          //6
          return char;
        }
        // 7
        return `<span class="char char${index + 1}">${char}</span>`;
      }).join('');
      // 8

      // 9
      element.innerHTML = wrappedText;
    });
  }

  // 10
  splitText();
});
```

## Styling characters individually

In the CSS side, we first set the default for the elements with the class `split`. We also set the position to absolute to allow us to position the characters individually.

```css
.split {
  position: absolute;
  font-size: 9rem;
  text-transform: uppercase;

  color: rebeccapurple;
  font-family: "Rubik Distressed", sans-serif;
  font-weight: 400;
  font-style: normal;

  letter-spacing: 4rem;
  line-height: 1
}
```

Next, we set up the default styles for the characters using the `char` class.

We set the position to `relative` to allow us to position the characters individually on the absolutely positioned container.

We set the padding to create some space around the characters.

Finally, we set a bottom margin to create some space between rows of characters if the text spans multiple lines.

```css
.char {
  position: relative;
  padding: 10px;
  display: inline-block;
  margin-block-end: 1rem;
}
```

Once the code has run, we can use CSS to styles the characters individually. For example, we can change the background color for each character or we can add background color to the odd characters.

In CSS we don't have a way to loop through elements, however we can style even and odd characters using the `nth-child(even)` and `nth-child(odd)` pseudo-classes.

We use `nth-child(even)` and `nth-child(odd)` to set the background for matching characters.

```css
.char:nth-child(even) {
  background: lightblue;
}

.char:nth-child(odd) {
  background: red;
}
```

We can also style individual characters by targeting the specific class for that character. For example, we can style the 6th, 7th, and 12th characters using the following CSS:

```css
.char6 {
  top: -30px;
}

.char7 {
  transform: rotate(15deg);
}

.char12 {
  transform: rotate(-12deg)
}
```

## final thoughts

The code in this post is not a replacement for the full functionality provided by [Splitting.js](https://splitting.js.org/). However, it can be useful when you only need to split text into characters and style them individually without the weight of the full library.

You can use this technique to create animations and transformations, change their colors, or apply other CSS properties to create unique text effects.

One final note. This example will work best with small amounts of text. If you have a large amount of text, this code may not be the best solution.
