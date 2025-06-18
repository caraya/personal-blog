---
title: Caniuse Web Component
date: 2025-07-02
tags:
  - Web Components
  - Javascript
  - HTML
---

Caniuse provides a visual representation of browser support for various web features. Rather than generating a static image using the [caniuse embed](https://caniuse.bitsofco.de/) to display data, I've created a web component that dynamically fetches and displays the data for a specific feature.

This post explains how to create a web component that fetches and displays Caniuse data for a specific feature, using the Caniuse database. It also addresses some issues I've found with custom elements over the years.

## Web Component breakdown

In this section we'll break down the `caniuse-support` web component script. It does a lot of things so we'll go through it in steps, explaining each part as we go

### Class Declaration

The core of the component is encapsulated within the `CaniuseSupport` class, which extends `HTMLElement`. This inheritance is what makes it a Web Component.

```js
class CaniuseSupport extends HTMLElement {
    // class content will go here
}
```

### Static Properties

We define several static properties that belong to the class itself, not to instances of the class. These properties are used for configuration and caching.

`static BROWSER_INFO`: This object maps internal browser IDs (like 'edge', 'firefox') to more user-friendly names. It's used to display browser names in the support matrix.

```js
static BROWSER_INFO = {
	'edge': { name: 'Edge' },
	'firefox': { name: 'Firefox' },
	'chrome': { name: 'Chrome' },
	'safari': { name: 'Safari' },
	'ios_saf': { name: 'Safari on iOS' },
	'and_chr': { name: 'Chrome for Android' },
	'and_ff': { name: 'Firefox for Android' },
};
```

`static _db` and `static _dbPromise`: These are used for caching the caniuse database. `_db` will hold the parsed JSON data once fetched, and `_dbPromise` will hold the Promise of the fetch operation to prevent multiple simultaneous fetches. The underscore prefix `_` is a common convention for "private" or internal properties, though in JavaScript, they are still publicly accessible.

!!! note Underscore (`_`) versus private class fields**

Since the 2022 version of the standard, developers have been able to use private class fields (denoted with a `#` prefix) for true encapsulation. However, the underscore prefix (`_`) remains a widely used convention.

The differences are as follows:

Underscore Prefix (_) - A Convention, Not Enforcement

* **Convention**: Using an underscore (e.g., `_myPrivateMethod()`) is a long-standing convention among JavaScript developers to indicate that a method or property is intended for internal use within the class and should not be accessed directly from outside
* **Accessibility**: Despite the convention, methods and properties prefixed with an underscore are fully accessible from outside the class. They are public members. This means you can still call `instance._myPrivateMethod()` or access `instance._myPrivateProperty` from anywhere in your code
* **No Encapsulation**: It offers no true encapsulation or data hiding. It relies solely on developer discipline to respect the convention.

Private Class Fields (#) - True Encapsulation

* Private class fields use a hash symbol (`#`) as a prefix for class fields (both properties and methods). For example, `#myPrivateMethod()` or `#myPrivateProperty`.
* **True Privacy**: Methods and properties defined with `#` are truly private. They are not accessible from outside the class or even from subclasses. Attempting to access them externally will result in a TypeError
* **Enforced Encapsulation**: This provides strong encapsulation, meaning the internal workings of your class are hidden and protected from external interference.
* **Scope**: Private fields are scoped to the class instance. They can only be accessed from within the class body itself.

Key Differences Summarized:

| Feature | Underscore Convention (_) | 	Private Class Fields (#) |
| --- | --- | --- |
| Privacy Level | Conventional ("soft private") | Truly private ("hard private") |
| Accessibility | Accessible from anywhere | Only accessible from within the defining class |
| Enforcement | Relies on developer discipline | Enforced by JavaScript runtime (throws TypeError) |
| Encapsulation | None (just a hint) | Strong encapsulation|
| Syntax | _methodName<br>_propertyName| #methodName<br>#propertyName|
| Introduced In | Historical convention | ECMAScript 2022 (ES2022) |

Which of the two methods you choose depends on your project's requirements and the level of encapsulation you need. If you want to ensure that certain methods or properties are truly private and not accessible from outside the class, use private class fields with the `#` prefix. If you're following a convention and want to indicate that something is intended for internal use only, the underscore prefix is still widely recognized and used.
!!!

```js
static _db = null;
static _dbPromise = null;
```

### Constructor

The constructor is called when an instance of CaniuseSupport is created (e.g., `<caniuse-support></caniuse-support>`).

```js
constructor() {
	super();
	this.attachShadow({ mode: 'open' });
	this._initialized = false;
	this._container = null;
}
```

* **super()**: Calls the constructor of the parent class (`HTMLElement`), ensuring proper initialization of the element itself
* **this.attachShadow({ mode: 'open' })**: This creates a Shadow DOM for the component. A Shadow DOM provides encapsulation, meaning the component's internal structure and styles are isolated from the rest of the document. mode: 'open' means JavaScript from the main document can still access the Shadow DOM.
* **this._initialized** and **this._container**: These are instance properties used to manage the component's state and its internal DOM structure.

### Static observedAttributes Getter

This static getter defines which attributes the component should observe for changes. When one of these attributes changes, the `attributeChangedCallback` method will be invoked.

```js
static get observedAttributes() {
    return ['feature-id'];
}
```

### Lifecycle Callbacks

Web Components have specific lifecycle callbacks that are invoked at different stages of their existence.

* **connectedCallback()**: Called when the custom element is first connected to the document's DOM
  * It ensures that the component is initialized only once and then triggers the initial rendering based on the feature-id attribute
* **attributeChangedCallback(name, oldValue, newValue)**: Called when one of the attributes specified in observedAttributes changes
  * This allows the component to react dynamically to changes in its feature-id attribute without needing to be re-created
* **initialize()**: This method sets up the basic structure within the Shadow DOM.
  * It creates a `style` element and injects `INJECTED_STYLES` (which contain CSS for the component, built with Tailwind CSS)
  * It creates a `div` element (`_container`) that will serve as the main wrapper for all dynamic content rendered by the component

```js
connectedCallback() {
	if (!this._initialized) {
			this.initialize();
	}
	this._featureId = this.getAttribute('feature-id');
	this.render();
}

attributeChangedCallback(name, oldValue, newValue) {
    if (this._initialized && name === 'feature-id' && oldValue !== newValue) {
			this._featureId = newValue;
			this.render();
    }
}

initialize() {
	const style = document.createElement('style');
	style.textContent = INJECTED_STYLES;
	this.shadowRoot.appendChild(style);

	this._container = document.createElement('div');
	this.shadowRoot.appendChild(this._container);
	this._initialized = true;
}
```

### Static _fetchDb()

This asynchronous static method fetches the caniuse database. It uses a caching mechanism to avoid redundant fetches.

```js
static async _fetchDb() {
	if (this._db) return this._db;
	if (!this._dbPromise) {
		this._dbPromise = fetch('https://cdn.jsdelivr.net/npm/caniuse-db/data.json')
			.then(response => {
				if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
				return response.json();
			})
			.then(data => { this._db = data; return this._db; }); // Cache the fetched data
	}
	return this._dbPromise; // Return the promise of the fetch operation
}
```

It checks if `_db` (the cached data) exists. If so, it returns it immediately.

If not, it checks if `_dbPromise` (a pending fetch) exists. If not, it initiates a fetch request to the caniuse data JSON file.

The fetch call returns a Promise. The `.then()` blocks handle the response checking for HTTP errors and parsing the JSON data.

Once the data is successfully fetched and parsed, it's stored in `_db` for future use.

The `_dbPromise` is returned, allowing await calls to wait for the data to be available.

### render()

The asynchronous `render()` method is the main rendering logic of the component. It fetches data and then calls helper methods to build the UI.

```js
async render() {
	if (!this._container) return; // Ensure container is initialized
	this._container.innerHTML = this._renderLoading(); // Show loading state

	if (!this._featureId) {
		this._container.innerHTML = this._renderMessage('No feature ID provided.'); // Handle missing feature ID
		return;
	}

	try {
		const db = await CaniuseSupport._fetchDb(); // Fetch the database
		const featureData = db.data[this._featureId]; // Extract data for the specific feature

		if (!featureData) {
			this._container.innerHTML = this._renderMessage(`Feature '${this._featureId}' not found.`); // Handle feature not found
			return;
		}
		this._container.innerHTML = this._buildLayout(featureData); // Build and display the main layout
	} catch (error) {
		console.error('Failed to fetch or render caniuse data:', error);
		this._container.innerHTML = this._renderMessage('Could not load support data. Please check the console.'); // Handle errors
	}
}
```

This method is responsible for rendering the component's content based on the provided feature ID.

It first shows a loading message.

It checks if `_featureId` is provided. If not, it displays an error message.

It awaits the `_fetchDb()` call to get the caniuse database.

It then attempts to retrieve the specific feature's data using `this._featureId`.

If the feature data is not found or an error occurs during fetching/processing, it displays appropriate error messages.

Otherwise, it calls `_buildLayout()` to construct the HTML for the feature's support matrix and injects it into `_container`.

### _getSupportInfo(stats)

This helper method parses the raw support statistics for a given browser and determines the support status (yes, partial, no) and the version it started.

```js
_getSupportInfo(stats) {
	if (!stats) return { status: 'no', version: null, noteNumbers: [] };

	let firstSupported = null;
	let firstPartial = null;
	const versions = Object.keys(stats).sort((a, b) => parseFloat(a) - parseFloat(b));

	let supportData = null;

	for (const version of versions) {
		const supportString = stats[version];
		if (supportString.includes('y') && !firstSupported) {
			firstSupported = { version, supportString };
			break;
		}
		if (supportString.includes('a') && !firstPartial) {
			firstPartial = { version, supportString };
		}
	}

	if (firstSupported) {
			supportData = { status: 'yes', ...firstSupported };
	} else if (firstPartial) {
		supportData = { status: 'partial', ...firstPartial };
	} else {
		return { status: 'no', version: null, noteNumbers: [] };
	}

	const parts = supportData.supportString.split(' ');
	const noteNumbers = parts.slice(1).map(p => p.replace('#', ''));

	return { status: supportData.status, version: supportData.version, noteNumbers };
}
```

It iterates through the browser versions, sorted numerically.

It looks for 'y' (yes) for full support and 'a' (partial) for partial support.

It prioritizes full support over partial support.

It extracts any associated note numbers (e.g., #1, #2) from the support string, which link to detailed notes.

### _renderLoading()

Returns the HTML string for the loading state.

```js
_renderLoading() {
	return `<div class="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center text-gray-500">
	<svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
		<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
		<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	</svg>
	<p class="mt-4">Loading support data for <strong class="font-semibold text-gray-700">${this._featureId || ''}</strong>...</p>
</div>`;
}
```

This uses Tailwind CSS classes for styling and includes an SVG spinner.

### _renderMessage(message)

Returns the HTML string for displaying a general message (e.g., error or no feature ID).

```js
_renderMessage(message) {
	return `<div class="bg-white rounded-xl shadow-lg p-8 text-center text-gray-600">${message}</div>`;
}
```

Also uses Tailwind CSS for basic styling.

### _buildLayout(featureData)

`_buildLayout` is the most complex rendering method for the component. It's responsible for generating the full support matrix and notes.

```js

```

* It iterates over `CaniuseSupport.BROWSER_INFO` to get each browser.
* For each browser
  * it calls `_getSupportInfo()` to determine its support status
  * It collects `relevantNoteNumbers` (notes actually referenced by the support strings)
  * It constructs an HTML string for each browser, including an icon (✅, ⚠️, ❌), status text, and color, based on the support status

All these individual browser HTML strings are join('')ed to form the browserItems string.

### Notes Section

```js
let notesHtml = '';
const generalNotes = featureData.notes;
const allNumberedNotes = featureData.notes_by_num;

const filteredNumberedNotes = {};
if (allNumberedNotes) {
	for (const num of relevantNoteNumbers) { // Only include notes that are actually referenced
		if (allNumberedNotes[num]) {
			filteredNumberedNotes[num] = allNumberedNotes[num];
		}
	}
}

if (generalNotes || Object.keys(filteredNumberedNotes).length > 0) {
	let generalNotesHtml = generalNotes ? `<p class="mb-2">${generalNotes}</p>` : '';

	let numberedNotesHtml = '';
	if (Object.keys(filteredNumberedNotes).length > 0) {
		const notesList = Object.entries(filteredNumberedNotes)
			.map(([num, noteText]) => `<li>${noteText.replace(/^\d+:\s*/, '')}</li>`) // Remove leading "number: " from note text
			.join('');
		numberedNotesHtml = `<ul class="list-disc pl-5 space-y-1">${notesList}</ul>`;
	}

	notesHtml = `
		<div class="p-4 sm:p-6 border-t border-gray-200 bg-gray-50/50">
			<details>
					<summary class="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 list-none">
						<span class="flex items-center">
							Notes
							<svg class="w-4 h-4 ml-2 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
						</span>
				</summary>
				<div class="prose prose-sm mt-3 text-gray-600 max-w-none">
					${generalNotesHtml}
					${numberedNotesHtml}
				</div>
			</details>
		</div>
	`;
}
```

Create the notes section if notes data exists for the relevant browsers.

It checks for `generalNotes` and `notes_by_num` from the featureData.

It filters `notes_by_num` to only include notes that were actually referenced by the browser support strings (`relevantNoteNumbers`).

It formats these notes into an HTML list.
The entire notes section is wrapped in a `<details>` and `<summary>` element, allowing it to be collapsible.

Finally, it combines the feature title, status, browser support items, and the notes section into the complete HTML structure.

### Custom Element Registration

```js
if (!customElements.get('caniuse-support')) {
	customElements.define('caniuse-support', CaniuseSupport);
}
export default CaniuseSupport;
```

* **customElements.get('caniuse-support')**: Checks if a custom element with this name has already been defined. This prevents errors if the script is loaded multiple times
* **customElements.define('caniuse-support', CaniuseSupport)**: Registers the `CaniuseSupport` class as a new custom element with the tag name `<caniuse-support>`. Once defined, you can use this HTML tag directly in your web page.
