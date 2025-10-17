---
title: Create A Translation Custom Element
date: 2025-12-01
tags:
  - Javascript
  - Web Components
  - AI
---

I've always struggled with how to integrate AI into web applications. It wasn't until I learned about Transformers.js and the Chrome native AI APIs that I realized how powerful these tools could be.

The first AI component I created was a summarizer that used Chrome's Native AI capabilities and a fallback based on Transformers.js. This allowed to provide an AI-powered summary feature for all browsers.

This post will discuss the creation of a translation custom element that uses AI to translate text content. The component will use Chrome's Native AI capabilities when available and fall back to Transformers.js and a specific model for other browsers.

It will also discuss the challenges faced during development, including handling asynchronous operations and ensuring equivalent functionality across different platforms.

## Component Design Overview

The idea is that the custom element (`<language-translator>`) will take the content in the element we pass as an attribute (`content-selector`) and translate it to the target language specified inside the element.

The `content-selector` attribute will be a CSS selector that points to the element containing the text to be translated. This makes the content flexible, allowing us to translate text from any part of the page.

```html
<language-translator
  content-selector="#source-text">
</language-translator>
```

The component will render the translated text inside itself.

## The Google Built-in Translation API

The built-in [Translation API](https://developer.chrome.com/docs/web-platform/ai/#translation) allows developers to easily integrate translation capabilities into their web applications using models that are downloaded on demand.

Although it only provides a limited set of languages, it is highly optimized for performance and works seamlessly within the browser.

### Why Use the Built-in API?

When working with AI models in the browser, performance and resource usage are critical considerations. The built-in Translation API is optimized for these factors, making it a preferred choice when available.

Using built-in capabilities simplifies the development process, since it abstracts away the complexities of model management and inference.

The API is not experimental and, as such, doesn't require enabling flags in the browser. However, there are limitations:

* **Device capabilities**: The performance of the built-in models may vary depending on the device's hardware capabilities and may not work well, or at all, on low-end devices.
* **Browser Support**: The API is currently only supported in Chromium-based browsers, which limits its availability to users of other browsers. If you want the component to work across all browsers, a fallback mechanism is necessary.
* **Language Support**: The API supports a limited set of languages. You have to check if the languages you need are supported. The fallback mechanism provides wider language support.
* **Model Availability**: The models are downloaded on demand, which introduces latency during the initial translation request. However, once downloaded, subsequent translations are faster.

Even with these limitations, the built-in Translation API is a powerful tool for adding translation capabilities to web applications.

### Implementation

The implementation of the translation logic using the built-in API is encapsulated in the `translate` async method of the custom element.

I've broken down the implementation into sections to better explain each part.

The first block retrieves the content to be translated and the target language the user selected. These values are obtained from the attributes and elements within the ShadowDOM.

```js
async translate() {
  const originalContentEl = this.shadowRoot.querySelector('#original-content');
  if (!originalContentEl) return;

  const contentSelector = this.getAttribute('content-selector');
  if (!contentSelector) {
    originalContentEl.textContent = "Error: 'content-selector' attribute is missing.";
    return;
  }

  const elementToTranslate = document.querySelector(contentSelector);
  if (!elementToTranslate || !elementToTranslate.textContent) return;

  const originalText = elementToTranslate.textContent;
  originalContentEl.textContent = originalText;

  const selectElement = this.shadowRoot.querySelector('#language-select');
  const targetLanguage = selectElement.value;
  const translatedContentEl = this.shadowRoot.querySelector('#translated-content');
```

Now, we can check if the built-in `Translator` and `LanguageDetector` APIs are available in the browser.

If they are we create a `LanguageDetector` instance to detect the source language of the original text. This way we don't have to ask for the source language and we don't have to hardcode it. If the detection fails or returns an invalid result, we throw an error.

Then we creatae the `Translator` instance, passing the detected source language and the target language selected by the user. Calling the `create` method triggers a model download if it hasn't already been downloaded, so we provide a `monitor` callback to track the download progress and update the UI accordingly. This also may appear to hang the UI the first time we create the translator, so we update the UI to inform the user.

```js
if ('Translator' in self && 'LanguageDetector' in self) {
  translatedContentEl.textContent = 'Checking for built-in translator...';
  try {
    const detector = await LanguageDetector.create();
    const detectionResults = await detector.detect(originalText);

    if (
      !Array.isArray(detectionResults) ||
      detectionResults.length === 0 ||
      !detectionResults[0].detectedLanguage
    ) {
      throw new Error("Language detection returned an empty or invalid result.");
    }

    const sourceLanguage = detectionResults[0].detectedLanguage;

    translatedContentEl.textContent = 'Requesting translator. This may trigger a download...';

    const translator = await Translator.create({
      sourceLanguage,
      targetLanguage,
      monitor(m) {
        translatedContentEl.textContent = 'Downloading translation model...';
        m.addEventListener('downloadprogress', (e) => {
          const percentage = (e.loaded / e.total) * 100;
          console.log(`Downloading model: ${percentage.toFixed(2)}%`);
          translatedContentEl.textContent = `Downloading translation model: ${percentage.toFixed(0)}%`;
        });
      },
    });
```

The code implements the streaming version of the translation process, which provides a better user experience by displaying translated text as it becomes available. We chose this strategy as a defense mechanism since we don't know the length of the text being translated ahead of time.

```js
// ---- START: STREAMING IMPLEMENTATION ----
translatedContentEl.textContent = 'Translating (streaming)...';

const stream = translator.translateStreaming(originalText);
translatedContentEl.textContent = '';
for await (const chunk of stream) {
  translatedContentEl.textContent += chunk;
}
// ---- END: STREAMING IMPLEMENTATION ----
```

Finally, we handle errors that may occur during the translation process, such as network issues or unsupported languages. If an error occurs, we log it to the console and update the UI to inform the user.

Finally, if the built-in API is not available, we inform the user that the fallback mechanism will be used.

```js
    } catch (error) {
      const message = `An error occurred with the built-in translator: ${error.message}`;
      console.error('Built-in translation failed:', error);
      translatedContentEl.textContent = message;
    }
  } else {
    const message = "The browser's built-in Translator API was not found.";
    console.log(message);
    translatedContentEl.textContent = message;
  }
}
```

## The fallback With Transformers.js

Rather than using a server-side solution, we can leverage the power of [Transformers.js](https://huggingface.co/docs/transformers.js) to implement the fallback mechanism directly in the browser.

This approach ensures translations in all browsers without relying on external, usually paid, services. It also helps with privacy since the text to be translated never leaves the user's device.

### Model Selection

As with any app working in the browser, we have to be mindful of the size of the model and if it will work in the browser, there may be CORS issues or other limitations so you'll have to test the models you choose to see if they work in your specific use case.

For this example, I chose the [nllb-200-distilled-600M](https://huggingface.co/facebook/nllb-200-distilled-600M) model, which is a distilled version of the NLLB-200 model. It supports 200 languages and is relatively small (600MB). While 600MB is still quite large for a web application, it is manageable.

### Fallback Implementation

The first step is to call the `fallbackTranslateWithWorker` method when the built-in API is not available or if it fails. There is a little code duplication here, but it makes it easier to read.

* The `catch` block handles errors from the built-in API and falls back to the worker if an error occurs.
* The `else` block handles the case where the built-in API is not available at all or the user checked the `force fallback` checkbox in the UI.

```js
catch (error) {
  console.error('Built-in translation failed, falling back to worker:', error);
  const detector = await LanguageDetector.create();
  const detectionResults = await detector.detect(originalText);
  const sourceLanguage = detectionResults[0].detectedLanguage;
  this.fallbackTranslateWithWorker(originalText, sourceLanguage, targetLanguage);
} else {
  console.log("Using fallback translator (API not found or forced by user).");
  this.fallbackTranslateWithWorker(originalText, null, targetLanguage);
}
```

The core of the `fallbackTranslateWithWorker` method is sending a message to the web worker with the text to be translated, the source language (if detected), and the target language.

```js
fallbackTranslateWithWorker(text, sourceLanguage, targetLanguage) {
  // ... Rest of the method ...

  console.time('Fallback Translation');
  this.worker.postMessage({ text, sourceLanguage, targetLanguage });
}
```

#### Why Force The Fallback?

The fallback mechanism supports more languages than the built-in API. If the user selects a target language that is not supported by the built-in API, we can force the fallback mechanism to be used.

We may also want to compare the quality of the translations by running both mechanisms and evaluating the results.

### The Web Worker

The core of the fallback mechanism is implemented in a web worker. This allows us to run the translation process in a separate thread, preventing it from blocking the main UI thread.

```js
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.5/dist/transformers.min.js';

let translator;
```

The NLLB model uses a specific format for language codes, which is different from the standard ISO 639-1 codes. We create a mapping to translate between the two formats. If we want to add more languages, we just add them to this map.

```js
const langCodeMap = {
  en: 'eng_Latn', // English
  es: 'spa_Latn', // Spanish
  fr: 'fra_Latn', // French
  de: 'deu_Latn', // German
  ja: 'jpn_Jpan', // Japanese
  uk: 'ukr_Cyrl', // Ukrainian
  hi: 'hin_Deva', // Hindi
};
```

The `onmessage` event handler does the actual message processing.

* If the type of the message is `PRELOAD`, we call the `loadModel` function to initialize the translator pipeline in the background.
* If the type of the message is `TRANSLATE`, we proceed with the translation process. We first check if the translator is already initialized; if not, we initialize it.

It also uses the language code map to convert the source and target languages to the format expected by the model. If the target language is not supported, we throw an error.

Finally, we call the translator with the text and language parameters, and send the translated text back to the main thread. The result is sent back to the main thread using `postMessage`.

```js
self.onmessage = async (event) => {
  const { text, sourceLanguage, targetLanguage } = event.data;

  try {
    self.postMessage({ status: 'loading-model' });

    if (!translator) {
      translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M');
    }

    self.postMessage({ status: 'translating' });

    const modelSourceLang = langCodeMap[sourceLanguage] || 'eng_Latn';
    const modelTargetLang = langCodeMap[targetLanguage];

    if (!modelTargetLang) {
      throw new Error(`The target language "${targetLanguage}" is not supported by the fallback model map.`);
    }

    const [result] = await translator(text, {
      src_lang: modelSourceLang, // This will now always have a valid value.
      tgt_lang: modelTargetLang,
    });

    self.postMessage({
      status: 'success',
      translatedText: result.translation_text,
    });
  } catch (error) {
    self.postMessage({
      status: 'error',
      message: error.message,
    });
  }
};
```

### Preloading the Model

In the custom element's `connectedCallback`, we check if the built-in API is available. If not, we send a message to the worker to preload the model. This way, when the user initiates a translation, the model is already loaded, reducing latency.

```js
  connectedCallback() {
    const isNativeApiAvailable = 'Translator' in self && 'LanguageDetector' in self;

    if (!isNativeApiAvailable && this.worker) {
      console.log('Native API not found. Instructing worker to preload fallback model.');
      this.worker.postMessage({ type: 'PRELOAD' });
    }

    // More code...
  }
```

In the worker, we handle the `PRELOAD` message by initializing the translator pipeline. We also send status updates back to the main thread to inform the user about the loading process.

```js
self.onmessage = async (event) => {
  const { type, text, sourceLanguage, targetLanguage } = event.data;

  // Handle the two different message types.
  switch (type) {
    case 'PRELOAD':
      // This just kicks off the asynchronous download
      loadModel();
      break;

    case 'TRANSLATE':
      // Code for translation...
  }
};
```

The `loadModel` function initializes the translator pipeline if it hasn't been initialized yet. It logs messages to the console to indicate the loading status and returns the `translatorPromise` object.

```js
function loadModel() {
  if (!translatorPromise) {
    console.log('Fallback model is loading in the background...');
    translatorPromise = pipeline('translation', 'Xenova/nllb-200-distilled-600M');
    translatorPromise.then(() => console.log('Fallback model loading complete.'));
  }
  return translatorPromise;
}
```

## Conclusion And Challenges Faced

The component provides a flexible and reusable solution for adding AI-powered translation to web applications. By leveraging both the built-in Translation API and a fallback mechanism using Transformers.js, it ensures support for all browsers and covers the limitations of each approach.

As with any AI-based project, there are challenges to consider:

1. **Performance**: Running AI models in the browser can be resource-intensive. The fallback model is large (600MB), which may lead to long load times and high memory usage. Preloading the model helps mitigate this issue.
2. **Language Support**: The built-in API supports a limited set of languages, while the fallback model supports more. However, even with wider language support, some languages may not be available.
3. **Error Handling**: Handling errors gracefully is crucial, especially when dealing with network requests and model loading. The component provides feedback to the user during the translation process and informs them of any errors that occur.

Even with these challenges, the translation capabilities encapsulated in a custom element provide a flexible and reusable solution for adding AI-powered translation to web applications.

### Moving Forward

There are several areas for future improvement and exploration beyond the current implementation:

* **Model Optimization**: Explore smaller or more efficient models for the fallback mechanism could improve performance and reduce load times without loosing the number of supported languages.
* **User Interface Enhancements**: Improve the UI to provide a better user experience during the translation process, such as progress indicators or more detailed error messages.
* **Switching between Translators**: Automatically switch between the built-in API and the fallback based on language support beyond the current `force fallback` checkbox.

The full implementation of the custom element can be found on [GitHub](https://github.com/caraya/ai-translator/) for you to explore and use.
