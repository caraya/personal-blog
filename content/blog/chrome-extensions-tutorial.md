---
title: Chrome Extensions Tutorial
date: 2025-12-29
tags:
  - Chrome
  - Extensions
---

Chrome, and all browsers, support extensions, which are small software programs that customize the browsing experience. They enable users to tailor Chrome functionality and behavior to individual needs or preferences.

As I research Chrome V3 extensions to build AI tools, I thought I'd take a look at how to build a simple Chrome extension from scratch using Manifest V3. This post will guide you through creating a basic "Focus Mode" extension that toggles a sepia background on the current webpage to help reduce distractions.

We will cover the essential concepts:

1. manifest.json: The core file that tells Chrome what your extension is and what it needs.
2. Popup: The small HTML window that appears when you click the extension's icon.
3. Service Worker: The event-based background script that replaces old "background pages."
4. Content Script: A script we inject into a webpage to modify it.
5. Permissions: How to ask for the necessary access (like running scripts or accessing the active tab).
6. Storage: How to save small pieces of data, like whether our focus mode is on or off.

## Step 1: Project Setup

First, create a new folder to hold all your extension's files. Let's name it focus-mode-extension.

Inside this folder, you will create the following files:

* `manifest.json`
* `popup.html`
* `popup.js`
* `background.js`
* `content.js`
* `style.css` (for our popup and content script)

## Step 2: The Manifest (manifest.json)

Every extension needs a manifest.json file. It's the blueprint. It defines the extension's name, version, and capabilities.

Create a new file named manifest.json inside your focus-mode-extension folder and add this code:

```json
{
  "manifest_version": 3,
  "name": "Focus Mode",
  "version": "1.0",
  "description": "Toggles a sepia background on the current page to help you focus.",
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "action": {
    "default_popup": "popup.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "icons": {
    "16": "images/icon16.png",
    "48": "images/icon48.png",
    "128": "images/icon128.png"
  }
}
```

What this does:

* `"manifest_version": 3`: Tells Chrome we are using the latest, most secure manifest version.
* `"name"`, `"version"`, `"description"`: Basic information about your extension."permissions": This is crucial. We ask for:
* `"permissions"`: This is crucial. We ask for:
  * `"activeTab"`: Grants us temporary access to the currently active tab when the user interacts with our extension. This is much more secure than asking for access to all tabs all the time.
  * `"scripting"`: Allows us to use the chrome.scripting API to inject our content.js file into the page.
  * `"storage"`: Lets us use the chrome.storage API to save the on/off state of our toggle.
  * `"action"`: Defines what happens when the user clicks your extension's icon in the toolbar. We tell it to open popup.html.
  * `"background"`: Registers our service worker, background.js. In Manifest V3, this script runs only when it's needed (e.g., when the extension is first installed).
  * `"icons"`: (Optional, but recommended) Defines the icons for your extension. For this tutorial, you can skip this or create a folder named images and add your own 16x16, 48x48, and 128x128 PNGs.

## Step 3: The Popup (popup.html and style.css)

The popup is the user interface. It's just a standard HTML file.

Create popup.html and add the following:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <div class="header">
      <span>Focus Mode</span>
    </div>
    <div class="content">
      <label class="switch">
        <input type="checkbox" id="focus-toggle">
        <span class="slider"></span>
      </label>
    </div>
  </div>
  <!-- We link our JavaScript file at the end of the body -->
  <script src="popup.js"></script>
</body>
</html>
```

Now, let's add some style. Create style.css to make our popup and toggle look nice.

```css
/* style.css */

/* --- Popup Styles --- */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  width: 200px;
  margin: 0;
  background-color: #f9f9f9;
}

.container {
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #4a90e2;
  color: white;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 12px;
  text-align: center;
}

.content {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* --- Toggle Switch Styles --- */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #4a90e2;
}

input:checked + .slider:before {
  transform: translateX(22px);
}

/* --- Focus Mode Page Style --- */
/* This class will be added to the body of the main web page */
.focus-mode-on {
  background-color: #fdf6e3 !important;
  color: #586e75 !important;
}
```

Note: We added `.focus-mode-on` at the end. This is the style our content script will apply to the web page, not the popup.

## Step 4: The Content Script (content.js)

A content script is the only part of your extension that can access and modify a webpage's DOM. Our content script will be very simple: it will just add or remove the .focus-mode-on CSS class from the page's `<body>` element.

Create content.js:

```javascript
// content.js
document.body.classList.toggle('focus-mode-on');
```

That's it! We put the toggle logic in popup.js. This script's only job is to flip the class.

## Step 5: The Background Service Worker (background.js)

In Manifest V3, the service worker is event-driven. It wakes up, does a job, and then shuts down. We'll use it for one thing: to listen for when the extension is first installed and set a default value in storage.

Create background.js:

```js
// background.js

// Listen for when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  // Set the initial state of 'focusMode' to 'false' in chrome.storage
  chrome.storage.local.set({ focusMode: false }, () => {
    console.log('Focus Mode is set to false by default.');
  });
});
```

This ensures that the first time our popup opens, it has a value to read from storage.

## Step 6: The Popup's Brain (popup.js)

This is where all the logic comes together. This script runs only when the popup is open. It needs to:

* Find the toggle switch in popup.html.
* Check chrome.storage to see if focus mode is already on or off.
* Update the switch's position to match the stored value.
* Listen for when the user clicks the switch.
* When clicked:
  * Save the new on/off state to chrome.storage.
  * Use chrome.scripting.executeScript to run our content.js file and our CSS in the active tab.

Create popup.js:

```js
// popup.js

// Wait for the popup's HTML content to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const focusToggle = document.getElementById('focus-toggle');

  // 1. Get the current tab to query its focus mode state
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0] || !tabs[0].id) return; // Exit if no active tab

    const tabId = tabs[0].id;

    // 2. Get the saved state for this specific tab
    // We use a key like `focus-mode-tab-123` to store state per-tab
    const storageKey = `focus-mode-tab-${tabId}`;

    chrome.storage.local.get([storageKey], (result) => {
      const isEnabled = result[storageKey] || false;
      focusToggle.checked = isEnabled;
    });

    // 3. Add listener for when the toggle is clicked
    focusToggle.addEventListener('change', () => {
      const newState = focusToggle.checked;

      // 4. Save the new state to storage for this tab
      chrome.storage.local.set({ [storageKey]: newState });

      // 5. Inject/remove the CSS and content script
      if (newState) {
        // When turning ON
        chrome.scripting.insertCSS({
          target: { tabId: tabId },
          files: ['style.css']
        });
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      } else {
        // When turning OFF
        // We re-run the content script to toggle the class off
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      }
    });
  });
});
```

I initially thought about using removeCSS, but removeCSS requires a CSS string, not a file. A simpler and more robust method is to just re-run content.js. Since content.js toggles the class, running it again will safely remove the class, achieving the "off" state. This is a much cleaner approach.

## Step 7: Load and Run Your Extension

You're done! All the files are created. Now let's load it into Chrome.

1. Open Chrome and type chrome://extensions in the address bar, then press Enter.
2. In the top-right corner, find the "Developer mode" toggle and turn it ON.
3. Three new buttons will appear. Click the "Load unpacked" button.
    1. A file dialog will open. Navigate to and select your focus-mode-extension folder (the one containing manifest.json).

Your "Focus Mode" extension will appear in the list! You should also see its icon in your Chrome toolbar.

Try it out!

Go to any webpage (e.g., a news article), click your new extension's icon, and flip the "Focus Mode" toggle. The page background should change. Click it again, and it should change back.

Congratulations, you've built a complete Manifest V3 Chrome extension!

## Step 8: Core Concepts & Further Reading

As you build more complex extensions, you'll want to refer to the official documentation. Here are the most important resources based on what we covered:

* [Core Concepts](https://developer.chrome.com/docs/extensions): The main homepage for all extension documentation.
* [Manifest V3 Overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3): Explains the high-level changes and goals of Manifest V3.
* [Service Workers](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers): A critical guide to understanding the new event-driven background script model.
* [chrome.action API](https://developer.chrome.com/docs/extensions/reference/api/action): Documentation for the toolbar icon and popup.
* [chrome.scripting API](https://developer.chrome.com/docs/extensions/reference/api/scripting): The API you used to inject code with `executeScript` and `insertCSS`.
* [chrome.storage API](https://developer.chrome.com/docs/extensions/reference/api/storage): Details on `storage.local`, `storage.sync`, and `storage.session`.

## Browser Compatibility

Firefox: Firefox has excellent support for the WebExtension API, which is what Manifest V3 is built on. To make this work in Firefox, you would primarily need to adjust your manifest.json. Firefox uses a "browser_specific_settings" key for its store-related metadata. The core APIs (storage, scripting, action) work very similarly.

Edge: Microsoft Edge is built on Chromium, so most of the same APIs and concepts apply. However, you should test your extension thoroughly in Edge to catch any potential issues.

Safari: Safari has its own extension model, and while it has started to support some WebExtension APIs, there are still significant differences. You would need to rewrite parts of your extension to make it compatible with Safari's extension framework.
