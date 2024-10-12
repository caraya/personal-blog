---
title: Multilingual Bundles
date: 2024-10-16
tags:
  - Javascript
  - Internationalization
---

Working with international websites can be challenging since there are many aspects that we need to address.

This post will cover a simple way to add internationalized messages available in multiple languages. It will also adress pontential alternatives and enhancements.

## The Code

I've broken the code into three sections.

We define the international strings in an external JSON file (`languages.json`).

For each of the languages that we want to use, we define each string that we want to translate. The names must be the same in all the languages since we'll use them in the script below.

```json
{
  "en": {
    "greeting": "Hello",
    "welcomeMessage": "Welcome to our app!",
    "dynamicGreeting": "Hello, {{name}}!"
  },
  "es": {
    "greeting": "Hola",
    "welcomeMessage": "¡Bienvenido a nuestra aplicación!",
    "dynamicGreeting": "¡Hola, {{name}}!"
  },
  "fr": {
    "greeting": "Bonjour",
    "welcomeMessage": "Bienvenue dans notre application !",
    "dynamicGreeting": "Bonjour, {{name}} !"
  }
}
```

The HTML section has three placeholders for the localized text and a select menu with the available languages.

```html
<h1 id="static-greeting"></h1>
<p id="welcome-message"></p>
<p id="dynamic-greeting"></p>

<select id="language-selector">
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
</select>
```

The script will handle switching the target language and update all dynamic text that we want to replace.

The specific steps:

1. Initialize an array for translations and set the default language
2. Use the fetch API to load `languages.json`
   1. If the response doesn't have an OK code then throw an error, otherwise return the response
   2. Run the `updateText` and `updateDynamicText` functions
   3. Handle errors
3. Updates the static text sections that we want to localize
4. Updates the dynamic text sections that we want localized
5. Adds a `change` event listener to update static and dynamic text for the first time
6. Use the `onload` event to fetch the data for the first time

```js
// 1
let translations = {};
let currentLanguage = 'en';

// 2
function loadTranslations() {
  return fetch('./langugages.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load translations');
      }
      return response.json();
    })
    .then(data => {
      translations = data;
      updateStaticText();
      // Example dynamic name
      updateDynamicText('John');
    })
    .catch(error => {
      console.error('Error fetching translations:', error);
    });
}

// 3
function updateStaticText() {
  if (translations[ currentLanguage ]) {
    document.getElementById('static-greeting').innerText = translations[ currentLanguage ].greeting;
    document.getElementById('welcome-message').innerText = translations[ currentLanguage ].welcomeMessage;
  }
}

// 4
function updateDynamicText(name) {
  if (translations[ currentLanguage ]) {
    const dynamicTemplate = translations[ currentLanguage ].dynamicGreeting;
    const dynamicGreeting = dynamicTemplate.replace('{{name}}', name);
    document.getElementById('dynamic-greeting').innerText = dynamicGreeting;
  }
}

// 5
const languageSelector = document.getElementById('language-selector');

languageSelector.addEventListener('change', function () {
  currentLanguage = this.value;
  updateStaticText();
  // Example dynamic name
  updateDynamicText('John');
});

// 6
window.onload = function () {
  // Fetch translations from the JSON file
  loadTranslations();
};
```

This is a very basic example.

Additional examples could use a third-party library to accomplish this and other tasks.

We may also generalize the functions so the code is easier to read and upgrade as necessary.
