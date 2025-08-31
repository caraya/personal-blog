---
title: Chrome built-in AI
date: 2025-10-22
tags:
  - AI
  - Browser
---

Rather than using tools like LangChain and LangChart for machine learning, you can use Chrome's built-in AI capabilities for some cases.

This post will explore the Built-in AI features of Chrome, how they work, how to enable them and how to use them with third-party fallbacks for browsers that don't support these features.

## Enabling Gemini Nano in Chrome

*
* **Get the Right Chrome Version**: The version you need depends the API you want to use:
  * For early access to the core `createTextSession()` API, you'll need Chrome 127+ or +higher.
  * For task-specific APIs like `Summarizer` and `LanguageDetector`, you'll need Chrome Stable version 138 or higher.
* **Navigate to Chrome Flags**: Open a new tab and go to `chrome://flags`. This is Chrome's internal page for enabling and disabling experimental features.
* **Enable the Necessary Flags**:
  * Search for `#prompt-api-for-gemini-nano` and set it to Enabled. This flag directly exposes the `window.ai` object to your web pages.
  * Search for `#optimization-guide-on-device-model` and set it to Enabled BypassPrefRequirement. This ensures the model is downloaded and available, even if Chrome's internal pre-flight checks might otherwise prevent it.
* **Relaunch Chrome**: After enabling the flags, you'll be prompted to relaunch your browser. This is a critical step, as the changes won't take effect until you do.
* **Verify Model Download**: Go to `chrome://components`. Find "Optimization Guide On Device Model" and click "Check for update." It may take some time for the model to download, especially on the first run. If you encounter issues, ensure you have a stable internet connection and try relaunching the browser again.

## The createTextSession() API

This is the core API for interacting with Gemini Nano. It creates a new session for text generation and conversational AI, allowing for a wide range of applications.


!!!warning  Note on API Status:
As of now, `createTextSession` is still considered an experimental, early-access feature. You must keep the Chrome flags enabled to use it, even in versions later than 127.
!!!

### Checking for Availability

It's essential to check if the API is available before attempting to use it. This prevents errors on browsers or devices where the feature is not supported.

```js
async function checkModel() {
  if (window.ai) {
    const status = await window.ai.canCreateTextSession();
    // The status can be 'readily', 'after-download', or 'no'.
    console.log(`AI Model Status: ${status}`);
    if (status === 'readily') {
      console.log("Gemini Nano is ready to use!");
    } else if (status === 'after-download') {
      console.log("Model needs to be downloaded. This may take a moment.");
    } else {
      console.log("On-device AI is not available on this browser or device.");
    }
  } else {
    console.log("Built-in AI not available.");
  }
}
checkModel();
```

### Use Cases

* **Content Generation**: Create summaries, write emails, generate creative text, or even help with coding tasks.
* **Chatbots**: Build a responsive and private conversational AI that runs entirely on the client-side.
* **Text Analysis**: Analyze text for sentiment, extract key entities, or classify content without sending data to a server.
* **Text Analysis**: Analyze text for sentiment, extract key entities, or classify content without sending data to a server.

### Configuration Options

When you call `prompt()` or `promptStreaming()`, you can pass an options object to control the model's output:

* **temperature**: A number (usually between 0 and 2) that controls the randomness of the output.
  * Higher values (e.g., 1.0) result in more creative and diverse responses, making it ideal for brainstorming or creative writing.
  * Lower values (e.g., 0.2) produce more deterministic and focused text, which is better for factual answers or summarization.
* **topK**: An integer that narrows the model's selection of the next word to the K most likely options.
  * For example, a topK of 3 means the model will only choose from the top three most probable next words. This can help prevent the model from generating nonsensical or irrelevant words and improves the coherence of the output.

### Working Example

This example demonstrates how to use the configuration options and properly manage the session's lifecycle. It's important to call `session.destroy()` when you're finished to free up system resources.

```js
async function runPrompt() {
  if (window.ai && (await window.ai.canCreateTextSession()) === 'readily') {
    const session = await window.ai.createTextSession();
    console.log("AI session created.");

    const stream = session.promptStreaming(
      "Tell me a short story about a friendly robot who discovers music.",
      { temperature: 0.8, topK: 3 } // Options for more creative output
    );

    let fullResponse = "";
    for await (const chunk of stream) {
      fullResponse += chunk;
      // In a real application, you would update the UI here.
      console.log(chunk);
    }
    console.log("Full response received:", fullResponse);

    session.destroy();
    console.log("AI session destroyed.");
  } else {
    console.log("Built-in AI is not ready.");
  }
}
runPrompt();
```

## Specialized Task APIs (Expert Models)

Beyond the general-purpose `createTextSession`, Chrome provides several "expert models" that are highly optimized for specific tasks, often providing better performance and more accurate results for their designated use case. These APIs are considered stable and do not require flags in their specified Chrome versions.

### The Summarizer API

Available in Chrome 138 stable, this API is designed to condense long-form text into shorter, more digestible formats.

* **Use Cases**: Generating a "TL;DR" for articles, creating key-point summaries of transcripts, or providing a brief teaser for a blog post.
* **Configuration Options**:
  * **type**: Specifies the kind of summary to generate.
    * `'key-points'`: A bulleted list of the most important points.
    * `'tldr'`: A very short, informal summary (Too Long; Didn't Read).
    * `'teaser'`: A summary designed to entice the reader to read the full text.
    * `'headline'`: A single, concise title for the text.
  * format: The output format
    * `'markdown'`: (Default) Formats the output with Markdown (e.g., * for bullet points).
    * `'plain-text'`: Outputs simple, unformatted text.
  * **length**: The desired length of the summary.
    * `'short'`, `'medium'` (Default), `'long'`. The actual output size for these values depends on the chosen type.

## Translator and Language Detector APIs

These two APIs work together to provide powerful, on-device translation. The Language Detector API is available in Chrome 138 stable.

* **Use Cases**: On-the-fly translation of social media posts, translating user support queries, or building multilingual chat applications.
* **Configuration Options**:
  * `sourceLanguage`: The BCP-47 language code of the input text (e.g., 'en-US', 'fr', 'es').
  * `targetLanguage`: The BCP-47 language code for the translated output.

### Implementing Fallbacks with transformers.js

For browsers that don't support the built-in AI, you can provide a fallback using a library like transformers.js from Hugging Face. This "progressive enhancement" approach ensures that users with modern browsers get the best experience, while all other users still get full functionality.

#### Example 1: A Simple Fallback Function

This method is straightforward and useful for single-use cases. The entire logic is contained within a single HTML file. A button triggers a function that first checks for the native Summarizer API and uses it if available. If not, it dynamically loads and runs the transformers.js library.

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Summarizer with Simple Fallback</title>
  <!-- Load Open Props for styling and a basic reset -->
  <link rel="stylesheet" href="https://unpkg.com/open-props">
  <link rel="stylesheet" href="https://unpkg.com/open-props/normalize.min.css">
  <style>
    body {
      background-color: var(--gray-1);
      padding: var(--size-8);
      font-family: var(--font-sans);
    }
    .container {
      max-width: 65ch; /* Use a readable width */
      margin-inline: auto;
      background-color: var(--surface-1);
      padding: var(--size-6);
      border-radius: var(--radius-3);
      box-shadow: var(--shadow-3);
    }
    #summarize-btn {
      margin-top: var(--size-4);
      background-color: var(--blue-6);
      color: white;
      font-weight: var(--font-weight-7);
      padding-block: var(--size-2);
      padding-inline: var(--size-4);
      border-radius: var(--radius-2);
      border: none;
      cursor: pointer;
      transition: background-color .2s ease;
    }
    #summarize-btn:hover {
      background-color: var(--blue-7);
    }
    .summary-box {
      margin-top: var(--size-4);
      padding: var(--size-4);
      background-color: var(--gray-0);
      border-radius: var(--radius-2);
    }
    .summary-box h3 {
      font-weight: var(--font-weight-7);
      margin-block-end: var(--size-2);
    }
  </style>
</head>
<body>
  <div class="container">
    <article id="content">
      <h2>The Power of On-Device Processing</h2>
      <p>On-device AI represents a significant paradigm shift. Unlike cloud-based AI, which processes data on remote servers, on-device AI performs computations directly on the user's hardware. This localization offers enhanced privacy, reduced latency, and offline functionality. Because sensitive data never leaves the device, user privacy is fundamentally protected. The elimination of the server round-trip results in near-instantaneous response times, which is critical for a seamless user experience in applications like real-time translation.</p>
    </article>
    <button id="summarize-btn">
      Generate Summary
    </button>
    <div class="summary-box">
      <h3>Summary:</h3>
      <p id="output">Click the button to generate a summary...</p>
    </div>
  </div>

  <script type="module">
    const summarizeBtn = document.getElementById('summarize-btn');
    const outputElement = document.getElementById('output');
    const contentElement = document.getElementById('content');

    summarizeBtn.addEventListener('click', async () => {
      const textToSummarize = contentElement.innerText;
      outputElement.textContent = 'Generating...';

      // --- Native API Path ---
      if ('Summarizer' in self && await Summarizer.availability() !== 'unavailable') {
        outputElement.textContent = 'Generating with built-in AI...';
        const summarizer = await Summarizer.create({ type: 'tldr' });
        const summary = await summarizer.summarize(textToSummarize);
        outputElement.textContent = summary;
        summarizer.destroy();
      }
      // --- Fallback Path ---
      else {
        try {
          outputElement.textContent = 'Loading fallback model (this may take a moment)...';
          const { pipeline } = await import('[https://cdn.jsdelivr.net/npm/@huggingface/transformers@2.6.0](https://cdn.jsdelivr.net/npm/@huggingface/transformers@2.6.0)');
          const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
          const output = await summarizer(textToSummarize, { max_length: 45 });
          outputElement.textContent = output[0].summary_text;
        } catch (e) {
          outputElement.textContent = 'Could not load or run the fallback AI model.';
          console.error(e);
        }
      }
    });
  </script>
</body>
</html>
```

#### Example 2: A Reusable Web Component

This approach is more robust and scalable. By encapsulating the logic within a custom element (&lt;ai-summary>), you can easily reuse it across your application without duplicating code.

##### How to Use the Component

Once defined, you can use the component in your HTML. The selector attribute tells the component which element on the page to summarize.

```html
<!-- The Web Component that will generate the summary -->
<ai-summary selector="#article-to-summarize"></ai-summary>

<!-- The article content that the component will summarize -->
<article id="article-to-summarize">
	<h1>The Future of On-Device AI</h1>
	<p>On-device AI represents a significant paradigm shift...</p>
</article>
```
