---
title: "Accessibility: Introduction"
date: "2018-01-03"
---

# Using ARIA

Accessibility is one of the most important aspects of development and one that we don't pay as much attention as we should.

We will look at ARIA (Accessible Rich Internet Applications), what it is and how we can use it in our content to help improve the accessibility of web applications and pages. we will also discuss When it's better to use native elements and DOM interactions rather than create our own.

we will also look at ARIA best practices and authoring guidelines. These are particularly suited to custom elements and components we create using Polymer or React-based applications.

As a last step we will look at a page using Voice Over, the screen reader bundled as part of MacOS. This will give us an idea of what a user with visual disabilities experiences when they read the content.

## What is ARIA

[ARIA](https://www.w3.org/TR/wai-aria-1.1/) is a W3C specification that describes how to increase the accessibility of web pages, in particular, dynamic content, and user interface components developed with Ajax, HTML, JavaScript, and related technologies.

The specification provides a set of roles, states, and properties that define accessible user interface elements and can be used to improve the accessibility and interoperability of web content and applications. These semantics are designed to allow an author to properly convey user interface behaviors and structural information to assistive technologies in document-level markup

HTML provides a full suite of accessibility affordances for the built in HTML elements; for example, a button is given the implicity role of button without assiging a `role` or `aria-role` attribute. This is the main reason why we should always use them when possible. Where we have to create our own elements we can use ARIA to provide cues for assistive technology devices on how to handle the custom elements.

One use for ARIA elements and attributes is to give assistive technology devices an association between title and its content.

```html
<h2 id="table1-desc">Table title</h2>

<div class="content" aria-labelledby="table1-desc">
  <p>Content</p>
</div>
```

The example below compares a native button HTML element with a custom element.

The HTML button element looks like this

```html
<button name="button">Click me</button>
```

This has many built in accessibility considerations:

- It's focusable
- It's part of the navigation order for the page
- Can be navigated with keyboard
- It creates a focus ring around it when you click on it

But there are times when we have to create our own element to represent a button either because it's generated dynamically or because we need specific functionality. However, that doesn't meant we can get away with not providing accessibility acommodations.

In the example below we're making a clickable button based on an HTML `a` element with an SVG image as the text. We've also added `tabindex` and `aria-pressed` attributes and assigned a `role` attribute.

Using Javascript we can change the value of aria-pressed attribute. we will look at it when we explore the Javascript portion of our custom element

### Role, Property, State, and Tabindex Attributes

| Role | Attribute | Element | Usage |
| --- | --- | --- | --- |
| \`button\` |  | \`a\` | 
- Identifies the element as a \`button\` widget.
- Accessible name for the button is defined by the text content of the element.

 |
|  | \`tabindex="0"\` | \`a\` | 

- Includes the element in the tab sequence.
- Needed on the \`a\` element because it does not have a \`href\` attribute.

 |
|  | \`aria-pressed="false"\` | \`a\` | 

- Identifies the button as a toggle button.
- Indicates the toggle button is not pressed.

 |
|  | \`aria-pressed="true"\` | \`a\` | 

- Identifies the button as a toggle button.
- Indicates the toggle button is pressed.

 |

 

```html
<a tabindex="0" role="button" id="toggle" aria-pressed="false">
  Mute
  <svg aria-hidden="true">
    <use xmlns:xlink="http://www.w3.org/1999/xlink"
    xlink:href="images/mute.svg#icon-sound"></use>
  </svg>
</a>
```

The CSS will style using [attribute selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Introduction_to_CSS/Attribute_selectors) for the role attribute and aria-pressed attributes and the SVG element. The code below provides the following functionality:

- A base state
- A hover state
- A focus state that removes the default focus ring
- A custom focust state unsing the `::before` pseudo element that replaces the default focus we removed
- The same four states for a button with the `aria-pressed` attribute
- Styling for the SVG element

```css
[role="button"] {
  display: inline-block;
  position: relative;
  padding: .4em .7em;
  border: 1px solid hsl(213, 71%, 49%);
  border-radius: 5px;
  box-shadow: 0 1px 2px hsl(216, 27%, 55%);
  overflow: visible;
  color: #fff;
  text-shadow: 0 -1px 1px hsl(216, 27%, 25%);
  background: hsl(216, 82%, 51%);
  background-image: linear-gradient(to bottom, hsl(216, 82%, 53%), hsl(216, 82%, 47%));
}

[role="button"]:hover {
  border-color: hsl(213, 71%, 29%);
  background: hsl(216, 82%, 31%);
  background-image: linear-gradient(to bottom, hsl(216, 82%, 33%), hsl(216, 82%, 27%));
    cursor: default;
  outline: none;
}

[role="button"]:focus {
  outline: none;
}

[role="button"]:focus::before {
  position: absolute;
  z-index: -1;
  /* button border width - outline width - offset */
  top: calc(-1px - 3px - 3px);
  right: calc(-1px - 3px - 3px);
  bottom: calc(-1px - 3px - 3px);
  left: calc(-1px - 3px - 3px);
  border: 3px solid hsl(213, 71%, 49%);
  /* button border radius + outline width + offset */
  border-radius: calc(5px + 3px + 3px);
  content: '';
}

[role="button"]:active {
  border-color: hsl(213, 71%, 49%);
  background: hsl(216, 82%, 31%);
  background-image: linear-gradient(to bottom, hsl(216, 82%, 53%), hsl(216, 82%, 47%));
  box-shadow: inset 0 3px 5px 1px hsl(216, 82%, 30%);
}

[role="button"][aria-pressed] {
  border-color: hsl(261, 71%, 49%);
  box-shadow: 0 1px 2px hsl(261, 27%, 55%);
  text-shadow: 0 -1px 1px hsl(261, 27%, 25%);
  background: hsl(261, 82%, 51%);
  background-image: linear-gradient(to bottom, hsl(261, 82%, 53%), hsl(261, 82%, 47%));
}

[role="button"][aria-pressed]:hover {
  border-color: hsl(261, 71%, 29%);
  background: hsl(261, 82%, 31%);
  background-image: linear-gradient(to bottom, hsl(261, 82%, 33%), hsl(261, 82%, 27%));
    cursor: default;
}

[role="button"][aria-pressed="true"] {
  padding-top: .5em;
  padding-bottom: .3em;
  border-color: hsl(261, 71%, 49%);
  background: hsl(261, 82%, 31%);
  background-image: linear-gradient(to bottom, hsl(261, 82%, 63%), hsl(261, 82%, 57%));
  box-shadow: inset 0 3px 5px 1px hsl(261, 82%, 30%);
}

[role="button"][aria-pressed="true"]:hover {
  border-color: hsl(261, 71%, 49%);
  background: hsl(261, 82%, 31%);
  background-image: linear-gradient(to bottom, hsl(261, 82%, 43%), hsl(261, 82%, 37%));
  box-shadow: inset 0 3px 5px 1px hsl(261, 82%, 20%);
}

[role="button"][aria-pressed]:focus::before {
  border-color: hsl(261, 71%, 49%);
}

[role="button"] svg {
  margin: .15em auto -.15em;
  height: 1em;
  width: 1em;
  pointer-events: none;
}
```

The script below is licensed according to the [W3C Software License](https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document)

The Javascript takes care of the user interaction with our button.

We first deefine constants for the icon images and create an `init` functions to capture the button and set up event listeners for click and keydown events.

```javascript
const ICON_MUTE_URL  = 'images/mute.svg#icon-mute';
const ICON_SOUND_URL = 'images/mute.svg#icon-sound';

function init () {
  const toggleButton = document.getElementById('toggle');

  // Add event listeners to the various buttons
  toggleButton.addEventListener('click', toggleButtonEventHandler);
  toggleButton.addEventListener('keydown', toggleButtonEventHandler);
}
```

The next function handle events for the button both keyboard and click events.

The `keydown` event will handle pressing either the space key (keycode 32) or the enter key (keycode 13) to trigger the button state.

the `click` event handles both elements with a role of button or are a button element (the tag name is button).

```javascript
function toggleButtonEventHandler (event) {
  const type = event.type;

  // Grab the keydown and click events
  if (type === 'keydown') {
    // If either enter or space is pressed, execute the funtion
    if (event.keyCode === 13 || event.keyCode === 32) {
      toggleButtonState(event);

      event.preventDefault();
    }
  }
  else if (type === 'click') {
    // Only allow this event if either role is correctly set
    // or a correct element is used.
    if (event.target.getAttribute('role') === 'button' || event.target.tagName === 'button') {
      toggleButtonState(event);
    }
  }
}
```

The next function is the heart of the script and changes attributes in the `a` element and the `svg` child.

We set up variables to hold information about the event we're holding, the `aria-pressed` attribute and the value we want to start with (`true`)

We get the icon we want by catching the first use element inside the button and set it to the mute version of the icon.

IF the aria-pressed attribute has a `true` value then we change it to false and swap the icon to the unmuted version.

Finally we set the `aria-pressed` attribute to the new value and the `xlink:href` value to the new ICON.

The `xlink:href` attribute inside the svg element needs a little explanation. Because SVG is an XML-based language the regular href attribute will not work and we have to use [XLINK](https://www.w3.org/TR/xlink11/), a vocabulary designed to link XML-based resourceas.

```javascript
function toggleButtonState (event) {
  let button = event.target;
  let currentState = button.getAttribute('aria-pressed');
  let newState = 'true';

  let icon = button.getElementsByTagName('use')[0];
  let newIconState = ICON_MUTE_URL;

  // If aria-pressed is set to true, set newState to false
  if (currentState === 'true') {
    newState = 'false';
    newIconState = ICON_SOUND_URL;
  }

  // Set the new aria-pressed state on the button
  button.setAttribute('aria-pressed', newState);
  icon.setAttribute('xlink:href', newIconState);
}
```

We set up the `init` function to run when the window is loaded. We could also use `domContentLoaded` instead but in this particular example either event works.

```javascript
window.onload = init;
```

As you can see, implementing our own controls, even one as simple as a button, is a fairly complex task that requires a lot of scripting that the native button element gives you for free. This is always worth considering.
