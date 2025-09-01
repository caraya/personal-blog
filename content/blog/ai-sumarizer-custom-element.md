---
title: AI Sumarizer Custom Element
date: 2025-10-27
tags:
  - AI
  - Web Components
---


## What it is

The `ai-summary` element is a zero-dependency, progressive enhancement web component that automatically summarizes a given block of text on a webpage.

This component is designed to be as efficient as possible by first attempting to use experimental, built-in browser AI capabilities. If those are not available, it gracefully falls back to a high-quality, in-browser model using the transformers.js library.

## How It Works

The component follows a "native-first" approach to ensure the best performance for your users:

* **Native Browser AI (Primary Method)**: The component first checks if the browser supports the experimental Summarizer API. This new API allows the browser to use a highly optimized, on-device model for tasks like summarization. This method is extremely fast and efficient, as it requires no external downloads.
* **In-Browser Fallback (Secondary Method)**: If the native API is not supported (which is the case for non-Chrome browsers), the component automatically engages its fallback mechanism. It dynamically loads the transformers.js library and a pre-trained summarization model directly into the user's browser to generate the summary.

## The Summarization Models

The component leverages two different AI models depending on the user's browser capabilities:

| Model / API | Type | Pros | Cons |
|---|:---:|------|------|
| Built-in Summarizer | Native | • Extremely fast and lightweight.<br>• No external downloads needed.<br>• Best user experience. | • Highly experimental.<br>• Only available in select browsers behind a developer flag. |
| Xenova/pegasus-xsum | Fallback | • High-quality summaries.<br>• Good balance of speed and size.<br>• Works in any modern browser. | • Requires an initial download of the model, which can be slow on the first page load. |

The fallback, [DistilBART](https://huggingface.co/Xenova/distilbart-cnn-12-6), is a "distilled" model. It was trained to be a much smaller and faster version of the larger, state-of-the-art BART model, while retaining most of its summarization accuracy. This makes it an ideal compromise for running on a wide range of devices, including older laptops.

### Alternative Fallback Models for Low-Power Devices

If the summary quality from distilbart-cnn-12-6 isn't meeting your needs, you might get better results from a different model. The key is to find the right balance between the quality of the summary and the performance on older hardware.

Here is a comparison of several excellent models available for transformers.js, all optimized to run in the browser.

| Model Name | Architecture | Key Strengths & Use Case | Considerations (Performance/Quality) |
| --- | :---: | --- | --- |
| Xenova/distilbart-cnn-12-6 <br>(Current) | Distilled BART | A strong all-around choice. Good at producing concise, news-style summaries. The best starting point. | Balanced. Delivers good quality for its relatively small size and decent speed. Can sometimes be too direct. |
| Xenova/flan-t5-small | Flan-T5 | Very fast and small. Better at following implicit instructions, which can lead to more "to-the-point" summaries. | Speed over Quality. Noticeably faster but often less coherent. Can feel "stitched together" from source text. |
| Xenova/pegasus-xsum | PEGASUS | Highly abstractive. Excellent at generating new sentences to form a summary, rather than just extracting them. Great for creative or complex text. | Slower, Higher Quality. More computationally intensive than DistilBART, but the summary quality is often a significant step up. |
| Xenova/t5-small | T5 | A versatile text-to-text model. Can produce good summaries and is generally very reliable and consistent. | Reliable but Basic. A good workhorse, but may not be as nuanced as PEGASUS or as optimized for news as DistilBART. |
| Xenova/distilbart-xsum-12-1 | Distilled BART | Fine-tuned on the XSum dataset, which emphasizes single-sentence, highly abstractive summaries. | Very Concise. Produces extremely short, one-sentence summaries. Ideal for headlines but not for detailed paragraphs. |
| Xenova/bart-large-cnn | BART (Full) | The Gold Standard. The full, non-distilled version. Produces the highest quality, most coherent, and most human-like summaries. | Quality over Speed. The largest and slowest model. May be too demanding for very old mobile devices or laptops. |

### Recommendation

The recommended model for the best balance of performance and quality on a wide range of devices is `Xenova/distilbart-cnn-12-6`. It provides good summaries without being too demanding on older hardware.


If you need a higher-quality summary, your preferred choice should be Xenova/pegasus-xsum. However, due to browser security policies (CORS), this model's configuration files cannot be loaded directly from the Hugging Face hub in a browser environment.

To solve this and properly test the model's performance on your target devices, you must host the model files locally.

How to Test pegasus-xsum Locally:

1. Download the Model: Go to the [google/pegasus-xsum](https://huggingface.co/google/pegasus-xsum/tree/main) model page on Hugging Face, click on the "Files and versions" tab, and download all the necessary files (e.g., `tokenizer.json`, `config.json`, and the `.onnx` model files).
2. Host the Files: Create a `public/models/pegasus-xsum` directory in your project and place the downloaded files inside it. The Vite development server will automatically make these files available.
3. Update the Component: Change the model path in AiSummary.ts to point to your local copy.

```ts
// Before
const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');

// After,  the path points to your local server
const summarizer = await pipeline('summarization', '/models/pegasus-xsum');
```

This will allow you to bypass the loading error and accurately gauge how much the model's performance impacts older hardware.

## Enabling the Built-in AI in Chrome (for Testing)

To test the primary native method, you need to enable an experimental flag in Google Chrome.

**Why is this necessary?** The Summarizer API is part of a new set of "Built-in AI" features that are not yet enabled by default. Activating the flag allows developers to test these capabilities.

How to Enable the Flag:

* Open a new tab in Chrome and navigate to **chrome://flags**.
* In the search bar, type **Prompt API**.
* Find the "Prompt API for Built-in AI" feature.
* Change its setting from "Default" to "Enabled".
* A "Relaunch" button will appear. Click it to restart Chrome.

After relaunching, your browser will now support the Summarizer API, and the web component will use the faster native method.

## Usage

To use the component, simply add the script to your page and use the &lt;ai-summary&gt; tag. You must provide a CSS selector for the content you want to summarize via the selector attribute.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Summary Demo</title>
  <!-- 1. Load the Open Props stylesheet for styling -->
  <link rel="stylesheet" href="https://unpkg.com/open-props">
  <!-- 2. Load the component script -->
  <script type="module" src="/src/ai-summary.ts"></script>
</head>
<body>

  <article id="content-to-summarize">
    <h2>The Content You Want to Summarize</h2>
    <p>
      Place your long-form article, blog post, or any other text content here. The component will read the inner text of this element and generate a concise summary.
    </p>
  </article>

  <!-- 3. Use the component and point it to your content -->
  <ai-summary selector="#content-to-summarize"></ai-summary>

</body>
</html>
```

## Conclusion

Working with AI is tricky, since it's a series of balancing games. This custom element strikes a balance between emerging AI capabilities and the existing capabilities.

There is still work to do in exploring backup models to use with Transformers.js and their performance characteristics across different devices.
