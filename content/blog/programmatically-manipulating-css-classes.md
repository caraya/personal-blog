---
title: Programmatically manipulating CSS classes
date: 2023-10-18
---

When working with Javascript there will be times when we need to change the CSS we apply to the web pages we're working on.

Javascript provides two methods to manipulate an HTML element's classes: [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) and [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList).

For this post we'll concentrate in `classList` since it provides methods to manipulate the class attribute and it avoids the string manipulation that you'd have to do when working with `className`.

`classList` is a **read-only** property that returns a live space-separated list of the class attributes of the element that we can manipulate using `classList` methods

The classList methods are:

[add()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/add)
: Adds one or more tokens to the element's class attribute, skipping duplicates

[remove()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/remove)
: Removes the specified token from the list

[replace()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/replace)
: Replaces the old token (the first parameter) with the new value (the second parameter)
: If the old token doesn't exist, `replace()` will return false and **will not** add the second token to the class attribute

[toggle()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/toggle)
: Cycles through states of the specified attribute
: If the attribute exists then `toggle()` will remove it and return false
: If the attribute doesn't exist, `toggle()` will add it and return true

[contains()](https://developer.mozilla.org/en-US/docs/Web/API/DOMTokenList/contains)
: Searches the class attribute. Returns true if the class is present and false otherwise

## Examples

I created a Codepen to illustrate how `classList` works.

The HTML defines the structure of the demo. The box with id of `myBox` will change based on the buttons we push.

Each button exercises a different method of `classList` discussed earlier. `scan` doesn't have a button because we used in the Javascript without producing visible results.

```html
<div class="content-wrapper">
  <div id="myBox" class="box thin">
    <p>content</p>
  </div>

  <div class="button-row">
    <button id="addBtn">Add Class</button>
    <button id="removeBtn">Remove Class</button>
    <button id="replaceBtn">Replace Class</button>
    <button id="toggleBtn">Toggle Class</button>
    <button id="scanBtn">Scan for box Class</button>
  </div>
</div>
```

The CSS provides all the styling for the demo. Some of these styles like `.content-wrapper`, `.box`, and `.button-row` are structural; they define the look of the app. The others are used in the demo to show changes resulting from using the `classList` methods.

```css
.content-wrapper {
  margin-block-start: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.box {
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-row {
  margin-block: 2em;
  width: 200px;
  display: flex;
  flex-flow: row wrap;
  gap: 0.75em;
}

button: {
  width: 45px;
}

.thin {
  border: 5px solid black;
}

.thick {
  border: 10px solid black;
}

.hotpink {
  background: hotpink;
  color: white;
}

.blue {
  background: navy;
  color: white;
}
```

The Javascript code does the bulk of the work since it actually trigger the class changes.

In the first part of the code we capture references to the box and the buttons on the page using [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector). If you have more than one element that matches the query then `querySelector` will only return the first ocurrence, if you want to work with all the matching elements use [querySelectorAll](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll)

```js
const myBox = document.querySelector("#myBox");

const add = document.querySelector("#addBtn");
const remove = document.querySelector("#removeBtn");
const replace = document.querySelector("#replaceBtn");
const toggle = document.querySelector("#toggleBtn");
```

The next step is to define event listeners for each button we created.

The remove (`removeBtn`) and replace (`replaceBtn`) use `classList.contains` to test if the class or classes we want to remove or replace exists before taking action.

This is particularly important with the `classList.replace` method since it will throw an error if the class we want to replace doesn't exist. So to avoid errors, making sure you're replacing a class that exists or provide a workaround like what we did here.

```js
addBtn.addEventListener("click", (evt) => {
  myBox.classList.add("hotpink");
});

removeBtn.addEventListener("click", (evt) => {
  if (myBox.classList.contains("hotpink")) {
    myBox.classList.remove("hotpink");
  }
  if (myBox.classList.contains("blue")) {
    myBox.classList.remove("blue");
  }
});

replaceBtn.addEventListener("click", (evt) => {
  if (!myBox.classList.contains("hotpink")) {
    myBox.classList.add("hotpink");
    myBox.classList.replace("hotpink", "blue");
  } else {
    myBox.classList.replace("hotpink", "blue");
  }
});

toggleBtn.addEventListener("click", (evt) => {
  myBox.classList.toggle("thick");
});
```

The full Codepen is shown below.

<iframe height="481.7393798828125" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/caraya/embed/rNoZjEB?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/caraya/pen/rNoZjEB">
  Untitled</a> by Carlos Araya (<a href="https://codepen.io/caraya">@caraya</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
