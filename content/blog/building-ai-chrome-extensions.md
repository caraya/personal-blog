---
title: Building AI Chrome Extensions
date: 2025-12-31
tags:
  - Chrome
  - Extensions
  - AI
---

There are some use cases where building an AI application as a Chrome extension is the **best** way to deliver value to users. Using a Chrome extension and its associated APIs provides capabilities that a standalone web app or a native application cannot match.

In this post we'll explore what types of AI applications are best suited for the extension format, why that is, and provide a complete example of a simple AI-powered Chrome extension, an "AI Right-Click Summarizer," that you can build and run yourself.

## Why Build AI Applications as Chrome Extensions?

Building an AI application as a Chrome extension makes sense primarily because of one powerful feature: context. A standalone web app, like a typical AI chatbot, is isolated in its own tab. It has no idea what you're doing on other websites. A Chrome extension, however, lives inside the user's browser and can (with permission) read and interact with the webpage the user is currently visiting.

This allows your AI to perform tasks in-situ—right where the user is working. This eliminates the "context switching" friction of the traditional AI workflow: copying text from a webpage, switching tabs, pasting it into an AI chat, getting a response, and then copying that result back to the original tab. This contextual awareness, powered by components like content scripts that inject themselves into pages and background service workers that listen for events, unlocks several key benefits.

This "contextual awareness" unlocks several key benefits:

* **Seamless Workflow Integration**: You can embed AI features directly into the websites people already use, making the AI feel like a native part of that site. Imagine a "Summarize this email thread" button appearing inside Gmail, or a "Politely decline this meeting" option that drafts a reply using the context of your calendar. On LinkedIn, it could be a "Rephrase this post" option to make it more professional. For developers, it could be an "Explain this code block" helper that appears when you highlight a function on GitHub or Stack Overflow.
* **Proactive Assistance**: Because the extension can analyze a page, it can offer help without even being asked. It moves the AI from a passive tool to an active assistant. This could be as simple as an icon appearing to summarize a long article as soon as you open it. Or it could be more advanced, like noticing you're on a product comparison page and proactively opening a small window with key differences, review summaries, and price history, all gathered without you needing to prompt it.
* **Automation of Browser Tasks**: An AI can understand not just the HTML structure of a webpage, but its semantic meaning. A traditional automation script might be told to "click the button with id=submit-btn-123." If the website updates and that ID changes, the script breaks. An AI-powered extension can be told to "click the 'Add to Cart' button," and it will visually or structurally identify the correct button regardless of its underlying code. This allows it to reliably automate repetitive tasks like filling complex forms, scraping data (e.g., "get all the product names and prices from this page"), or even transcribing a video call directly from the browser tab.
* **Privacy and Speed (with On-Device AI)**: With new on-device models (like Gemini Nano), extensions can perform some AI tasks directly in the browser without sending any data to a server. This has two huge advantages. First, privacy: the user's data (like the personal email they are summarizing) never leaves their machine, which is a critical feature for sensitive information. Second, speed: there is no network latency, so tasks like grammar checks or rephrasing text happen almost instantly. This also enables robust offline access, allowing critical features to work even on a plane or with spotty internet.

## Types of AI Applications That Work Best as Extensions

Based on these strengths, here are the types of applications that are a good fit for the extension format:

## Content Augmentation (Reading & Writing)

This category includes any tool that helps the user read or write text more effectively.

* **Writing Assistants**: This goes far beyond basic spelling and grammar. An AI assistant can check for stylistic consistency with a brand's voice, suggest domain-specific terminology (like legal or medical terms), or help you strike the perfect tone, whether it's friendly, formal, or persuasive. It can even auto-generate entire replies to common inquiries. Grammarly is a great example of this type of tool, but with AI, we can go deeper.
* **Summarizers**: A button or sidebar that provides a "TL;DR" (Too Long; Didn't Read) of any content. This is invaluable for professionals trying to catch up on long email threads, researchers wading through dense academic papers, or anyone who just wants the key takeaways from a long news article or YouTube video (by reading its transcript).
* **Rephrasers**: Tools that allow you to highlight any text and instantly get options to make it shorter, more formal, simpler, or more academic. A non-native English speaker could use this to make their writing sound more natural, while a marketer could use it to quickly generate five different versions of a product description for A/B testing.
* **Real-Time Translation**: Automatically translate foreign text you encounter while browsing. This can be a full-page overlay that converts an entire site, or a more subtle "hover-to-translate" feature for individual words or sentences, making it seamless to browse foreign-language forums or news sources.

## Contextual Assistants (Understanding & Searching)

These tools act as a co-pilot or "second brain," helping you understand, organize, and find information.

* **Conversational Sidebars**: This is the classic AI chat interface (like Perplexity or ChatGPT) but integrated into a sidebar. The key difference is that it can "see" your current page. You can ask, "What are the main arguments in this article?" "What is the general consensus in this forum thread?" or "Explain this concept to me like I'm a beginner." It turns the entire web into a dynamic, queryable knowledge base.
* **Meeting Transcribers**: Extensions that join your Google Meet or Zoom call (from the browser tab) and provide a real-time transcript. The true AI power comes after the meeting: the extension can automatically identify action items, list key decisions, and even draft a follow-up summary email to all attendees, complete with a link to the transcript.
* **Knowledge Management**: This is like an AI-powered "Read It Later" service. You can highlight any text or image on the web and "save" it. The AI automatically tags the content based on its meaning, links it to related articles you've saved in the past, and provides a powerful search that lets you find "lost" information months later by searching for the concept, not just the exact keywords.

## Intelligent Automation (Doing)

These are the most advanced extensions, which take action on your behalf.

* **Web Scrapers/Data Entry**: This is automation supercharged with understanding. Unlike brittle scripts that break when a website changes its layout, an AI-powered scraper understands concepts. You can give it a goal like, "Go to these 10 pages and get the name, price, and star rating for each product," and the AI will find that information even if it's structured differently on each page.
* **Process Automation**: These tools watch you perform a multi-step task and automatically generate a step-by-step guide with screenshots and written instructions. This is perfect for creating internal training documents or Standard Operating Procedures (SOPs). An employee can just do their job (e.g., "how to submit an expense report"), and the extension creates a perfect, shareable guide in the background, saving hundreds of hours of manual documentation.
* **"Agentic" Tasks**: This is the future of AI extensions, where the tool acts as a true digital agent. You provide a high-level goal, and the AI figures out the steps to accomplish it. For example: "Book me a flight to New York for next Tuesday, staying under $400, on my preferred airline, and add it to my calendar." This involves the AI autonomously navigating multiple pages, comparing options, making decisions based on your constraints, and filling out forms.

## Example Extension: AI Right-Click Summarizer

Here is the complete, runnable code for a "Manifest V3" extension that demonstrates these concepts. It allows you to select any text on a webpage, right-click, and get an AI-generated summary in a clean modal window.

### How It Works

There are three main components to this extension:

* **manifest.json**: This tells Chrome what permissions it needs (contextMenus, scripting, activeTab), what API it needs to access (host_permissions), and where its background service worker file is.
* **background.js (Service Worker)**: This script runs in the background. It listens for two events:
  **onInstalled**: It creates the right-click menu item titled "Summarize Selected Text."
  **onClicked**: When you click that menu item, it gets the selected text, injects the content.js script, shows a "loading" message, calls the Gemini API to get a summary, and sends the final summary to the content.js script.
* **content.js (Content Script)**: This script is injected into the webpage only when needed. It creates the `<dialog>` element (the popup box), injects styles for it, and listens for a message from the background.js script. When it receives the summary text, it displays it in the modal.

## The Code

Here are the files you need. Create a new folder (e.g., ai-summarizer) and save these files inside it.

`manifest.json`is required for all extensions.

```json
{
  "manifest_version": 3,
  "name": "AI Right-Click Summarizer",
  "version": "1.0",
  "description": "Select text, right-click, and get an AI summary.",
  "permissions": [
    "contextMenus",
    "scripting",
    "activeTab"
  ],
  "host_permissions": [
    "[https://generativelanguage.googleapis.com/](https://generativelanguage.googleapis.com/)"
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

`background.js` handles the API call and browser events.

```js
// --- Constants for API ---
// NOTE: Leave apiKey as "" - it will be populated by the environment.
const apiKey = "";
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

// --- Exponential Backoff for API Retries ---
async function fetchWithBackoff(url, options, maxRetries = 5) {
  let delay = 1000; // 1 second
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return await response.json();
      } else if (response.status === 429 || response.status >= 500) {
        // Throttling or server error, wait and retry
        console.warn(`API request failed with status ${response.status}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for the next retry
      } else {
        // Other client-side error, don't retry
        console.error(`API request failed with status: ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error("Fetch error:", error);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  console.error("Max retries reached. API call failed.");
  return null;
}

// --- Core API Call Function ---
async function getSummary(text) {
  const systemPrompt = "You are a helpful assistant. Your task is to provide a concise, one-paragraph summary of the following text.";

  const payload = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `Text to summarize: ${text}` }
        ]
      }
    ]
  };

  const result = await fetchWithBackoff(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (result && result.candidates?.[0]?.content?.parts?.[0]?.text) {
    return result.candidates[0].content.parts[0].text;
  } else {
    return "Error: Could not generate summary.";
  }
}

// --- Context Menu Setup ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize Selected Text",
    contexts: ["selection"]
  });
});

// --- Context Menu Click Listener ---
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarizeText" && info.selectionText) {
    // 1. Inject the content script to be ready to receive the message
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      });

      // 2. Show a "loading" state
      chrome.tabs.sendMessage(tab.id, {
        type: "SHOW_SUMMARY",
        data: "Generating summary..."
      });

      // 3. Get the summary
      const summary = await getSummary(info.selectionText);

      // 4. Send the final summary
      chrome.tabs.sendMessage(tab.id, {
        type: "SHOW_SUMMARY",
        data: summary
      });

    } catch (e) {
      console.error("Error injecting script or sending message:", e);
    }
  }
});
```

`content.js` creates the modal dialog on the webpage.

```js
// This script is injected into the page to show the modal using <dialog>

const MODAL_ID = 'ai-summary-dialog';
const MODAL_STYLE_ID = 'ai-summary-dialog-style';

function injectModalStyles() {
  // Check if styles are already injected
  if (document.getElementById(MODAL_STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = MODAL_STYLE_ID;
  style.textContent = `
    #${MODAL_ID} {
      padding: 24px;
      border-radius: 12px;
      border: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      font-family: sans-serif;
      font-size: 16px;
      line-height: 1.6;
      color: #333;
    }

    #${MODAL_ID}::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
    }

    #${MODAL_ID} h3 {
      margin-top: 0;
      margin-bottom: 16px;
      color: #111;
    }

    #${MODAL_ID} p {
      white-space: pre-wrap;
      margin-bottom: 24px;
    }

    #${MODAL_ID} button.close-btn {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      color: #aaa;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      line-height: 1;
    }
  `;
  document.head.appendChild(style);
}

function showSummaryModal(summaryText) {
  // Ensure styles are in the page
  injectModalStyles();

  // Find existing dialog or create a new one
  let dialog = document.getElementById(MODAL_ID);

  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = MODAL_ID;

    // Remove the dialog from DOM when it's closed
    dialog.addEventListener('close', () => {
      dialog.remove();
    });

    // Close dialog when clicking on the backdrop
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        dialog.close();
      }
    });

    document.body.appendChild(dialog);
  }

  // Create Close Button
  const closeButton = document.createElement('button');
  closeButton.innerText = '×';
  closeButton.className = 'close-btn';
  closeButton.onclick = () => dialog.close();

  // Create Title
  const title = document.createElement('h3');
  title.innerText = 'AI Summary';

  // Create Summary Text
  const text = document.createElement('p');
  text.innerText = summaryText;

  // Clear old content and add new content
  dialog.innerHTML = '';
  dialog.appendChild(closeButton);
  dialog.appendChild(title);
  dialog.appendChild(text);

  // Show the modal
  if (!dialog.open) {
    dialog.showModal();
  }
}

// Listen for the message from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SHOW_SUMMARY") {
    showSummaryModal(request.data);
    sendResponse({ status: "success" });
  }
  return true; // Keep the message channel open for async response
});
```

## How to Run the Extension

1. Create a new folder (e.g., ai-summarizer).
2. Save the `manifest.json` and the `background.js` and `content.js` files inside it. (If using TypeScript, you would compile `background.ts` and `content.ts` to Javascript first).
3. Open Chrome and navigate to chrome://extensions.
4. Enable "Developer mode" (using the toggle in the top-right corner).
5. Click the "Load unpacked" button and select your ai-summarizer folder.

The extension is now installed! Go to any webpage, select some text, and right-click to see the "Summarize Selected Text" option.

## Future Directions: From One Tool to an AI Toolkit

The right-click summarizer example is a simple, effective starting point. You can easily expand this single extension to handle multiple, related AI tasks and create a much more powerful assistant. Here are the most common ways to do that:

### Expand the Context Menu (The "AI Toolkit")

This is the easiest next step. Instead of just one "Summarize" option, you can create a parent menu item (e.g., "AI Toolkit") that opens a sub-menu with multiple actions.

**How**: In your `background.js` `onInstalled` listener, you would create a "parent" context menu. Then, you'd create multiple "child" menus (like "Summarize," "Translate to Spanish," "Explain This") and assign them to that parent.

```js
// In background.js
chrome.runtime.onInstalled.addListener(() => {
  // Create a parent menu
  chrome.contextMenus.create({
    id: "aiParent",
    title: "AI Toolkit",
    contexts: ["selection"]
  });

  // Create child menus
  chrome.contextMenus.create({
    id: "summarizeText",
    title: "Summarize Selection",
    parentId: "aiParent",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "translateText",
    title: "Translate to Spanish",
    parentId: "aiParent",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "explainText",
    title: "Explain This",
    parentId: "aiParent",
    contexts: ["selection"]
  });
});
```

**Logic**: In your onClicked listener, you would use a switch statement on the info.menuItemId to determine which action the user selected. You'd then call the appropriate function (e.g., getSummary(), translateText(), explainText()) and send the result to your content script.

```js
// In background.js
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.selectionText || !tab.id) return;

  try {
    // Inject the content script first
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content.js"]
    });

    // Show loading message
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_SUMMARY",
      data: "AI is thinking..."
    });

    let resultText = "";
    let title = "AI Result";

    // Check which menu item was clicked
    switch (info.menuItemId) {
      case "summarizeText":
        title = "AI Summary";
        resultText = await getSummary(info.selectionText);
        break;
      case "translateText":
        title = "Spanish Translation";
        // You would create this function similar to getSummary()
        // resultText = await translateText(info.selectionText, "Spanish");
        resultText = "Translated text would go here."; // Placeholder
        break;
      case "explainText":
        title = "AI Explanation";
        // You would create this function similar to getSummary()
        // resultText = await explainText(info.selectionText);
        resultText = "Explanation of the text would go here."; // Placeholder
        break;
    }

    // Send the final result with a title
    chrome.tabs.sendMessage(tab.id, {
      type: "SHOW_SUMMARY",
      title: title, // Send a dynamic title
      data: resultText
    });

  } catch (e) {
    console.error("Error:", e);
  }
});
```

### Create a Popup Window (The "Action Hub")

This method is ideal for tasks that require more user input. By adding an action key to your manifest.json, you can specify a popup.html file. When the user clicks your extension's icon in the toolbar, this small HTML page will open.

**How**: This popup is its own mini-webpage. You can add buttons, text boxes, and other UI elements. For example, you could have a "Rewrite" button with a text area. The user would paste text in, type a custom prompt (like "Make this sound more professional"), and your popup's JavaScript would send this to the AI.

Add to manifest.json:

```json
{
  "manifest_version": 3,
  "name": "AI Right-Click Summarizer",
  // ... rest of manifest
  "action": {
    "default_popup": "popup.html"
  }
}
```

Create popup.html:

```html
<!DOCTYPE html>
<html style="width: 300px;">
<head>
  <title>AI Toolkit</title>
  <meta charset="utf-8">
  <style>
    body { font-family: sans-serif; margin: 8px; }
    textarea { width: 100%; height: 100px; box-sizing: border-box; }
    button { width: 100%; padding: 8px; }
  </style>
</head>
<body>
  <h3>Custom AI Prompt</h3>
  <textarea id="prompt-input" placeholder="Type a prompt..."></textarea>
  <button id="submit-btn">Get Answer</button>
  <div id="result"></div>
  <script src="popup.js"></script>
</body>
</html>
```

Create popup.js:

```js
document.getElementById('submit-btn').addEventListener('click', async () => {
  const prompt = document.getElementById('prompt-input').value;
  const resultDiv = document.getElementById('result');

  if (!prompt) {
    resultDiv.innerText = "Please enter a prompt.";
    return;
  }

  resultDiv.innerText = "Thinking...";

  // You can call your AI function from the background script
  // This requires setting up messaging between popup and background
  // Or, you can duplicate the API call logic here if it's simple
  resultDiv.innerText = "The AI answer for your prompt would go here.";
});
```

**Use Case**: This is perfect for tasks that aren't directly related to selected text, like asking a general question or triggering an automation.

### Build a Side Panel (The "Persistent Assistant")

This is the most advanced and powerful option, used by major AI extensions. The `chrome.sidePanel` API allows you to open a full, persistent sidebar next to the main webpage.

**How**: You would build a complete user interface in your side panel's HTML file, likely using a framework like React or Vue (though vanilla JS is fine). This panel can communicate with both your background script (for API calls) and the content script on the page.

Add to `manifest.json`:

```json
{
  "manifest_version": 3,
  "name": "AI Right-Click Summarizer",
  // ... rest of manifest
  "permissions": [
    "contextMenus",
    "scripting",
    "activeTab",
    "sidePanel"
  ],
  "side_panel": {
    "default_path": "sidepanel.html"
  }
}
```

You also need a way to open the side panel. You can do this from your `background.js`:

```js
// In background.js, inside contextMenus.onClicked
await chrome.sidePanel.open({ tabId: tab.id });

// Or, open it when the user clicks the extension icon
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
});
```

Create sidepanel.html:

```html
<!DOCTYPE html>
<html>
<head>
  <title>AI Assistant</title>
  <style>
    body { width: 100%; height: 100vh; display: flex; flex-direction: column; }
    /* This would be a more complex chat UI */
    #chat-window { flex-grow: 1; border: 1px solid #ccc; }
    #chat-input { width: 100%; box-sizing: border-box; }
  </style>
</head>
<body>
  <h3>AI Assistant</h3>
  <div id="chat-window">
    <!-- Chat messages would go here -->
  </div>
  <input id="chat-input" type="text" placeholder="Ask me anything..." />
  <script src="sidepanel.js"></script>
</body>
</html>
```

**Use Case**: This is the best way to build a true, "context-aware" conversational chatbot. The user can have an ongoing conversation with your AI. The AI can "see" the page the user is on, answer questions about it, and even perform actions on the page on the user's behalf.

These methods aren't mutually exclusive. You could have a side panel for chat, a context menu for quick actions, and a popup for settings. This allows you to create a comprehensive and deeply integrated AI tool.

## Conclusion

Building AI applications as Chrome extensions unlocks powerful capabilities that standalone web apps cannot match. By leveraging context, seamless workflow integration, proactive assistance, and intelligent automation, you can create AI tools that truly enhance the browsing experience.

The "AI Right-Click Summarizer" example demonstrates how to build a simple yet effective extension. From here, you can expand it into a full AI toolkit by adding more context menu options, creating a popup for custom prompts, or building a persistent side panel for ongoing assistance.
