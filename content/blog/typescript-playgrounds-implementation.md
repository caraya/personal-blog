---
title: "Typescript Playgrounds Implementation (Local & No Build)"
date: 2026-04-24
tags:
  - Eleventy
  - Javascript
  - Typescript
---

> **Series Note:** This is the capstone post for our Islands Architecture series.
> 1. [Theory](/what-is-the-islands-architecture/)
> 2. [Implementation Guide](/eleventy-island-guide/)
> 3. [Advanced Patterns](/eleventy-is-land-and-island-architecture/)
> 4. **Capstone (This Post)**

This guide explains how to integrate the static ts-playground.webc component with the dynamic sandpack-loader.js client logic using local NPM dependencies instead of a CDN.

**Key Concept:** Use Import Maps to map NPM package names to local files served by Eleventy.

## 1 Prerequisites

Install the dependencies locally.

```bash
npm install shiki @11ty/is-land
# Install the client-side libraries
npm install @codesandbox/sandpack-client @codesandbox/sandpack-themes
```

## Configuration (Copying Files to Output)

Because browsers cannot read files directly from your `node_modules` directory, configure Eleventy to copy these required library files to your production output folder.

Isolate the third-party dependencies in a `/vendor/` directory at the root of your site (as a sibling to `/js/`). This establishes a clear boundary between your custom code and external code, simplifies security auditing and licensing attribution, and allows you to apply aggressive, long-term caching rules to external libraries at the directory level.

Update your eleventy.config.js to map your custom logic to /js and the third-party NPM packages to /vendor/:

```js
module.exports = function(eleventyConfig) {
  // 1. Copy your custom client logic to the /js output directory
  eleventyConfig.addPassthroughCopy({ "src/client": "js" });

  // 2. Copy vendor libraries to a dedicated /vendor directory at the root
  // Explicitly copy the Main ESM entry points so the browser can load them
  eleventyConfig.addPassthroughCopy({
    "node_modules/@codesandbox/sandpack-client/dist/index.mjs": "vendor/sandpack-client.js",
    "node_modules/@codesandbox/sandpack-themes/dist/index.mjs": "vendor/sandpack-themes.js"
  });

  // Note: If the browser console complains about other missing dependencies
  // (e.g., 'mitt' or 'dequal'), you must copy those package files here too.

  // ... rest of your config
};
```

## The Server-Side Component (_components/ts-playground.webc)

Create the server-side WebC component first. This file renders the static HTML preview, sets up the Import Map, and tells the browser where to find the client-side script.

The Import Map acts as a directory, telling the browser how to resolve bare NPM package names to the /vendor/ files you configured in the previous step.

Create this file at: _components/ts-playground.webc

```html
<script webc:type="js" webc:is="template">
  const { getHighlighter } = await import("shiki");

  const content = this.content || "// No code provided";
  const theme = this.theme || "solarized-light";

  // Accepts a comma-separated string: "uuid,lodash"
  const dependencies = this.dependencies || "";

  async function highlight(code) {
    const highlighter = await getHighlighter({
      themes: ['solarized-light'],
      langs: ['typescript']
    });
    return highlighter.codeToHtml(code, { lang: 'typescript', theme: 'solarized-light' });
  }

  const staticHTML = await highlight(content);

  `
  <div class="playground-wrapper">
    <!--
      IMPORT MAP (HOST):
      Controls where the browser finds third-party scripts for the LOADER.
      It points directly to the /vendor directory configured in Eleventy.
    -->
    <script type="importmap">
    {
      "imports": {
        "@codesandbox/sandpack-client": "/vendor/sandpack-client.js",
        "@codesandbox/sandpack-themes": "/vendor/sandpack-themes.js"
      }
    }
    </script>

    <is-land on:interaction="click,touchstart">

      <template data-island="replace">
        <sandpack-loader theme="${theme}" dependencies="${dependencies}">
          <script type="text/plain">${content}</script>
        </sandpack-loader>
        <!-- Load the custom element from the /js directory -->
        <script type="module" src="/js/sandpack-loader.js"></script>
      </template>

      <div class="static-preview">
        <div class="preview-header">
          <span class="preview-title">TypeScript Preview</span>
          <button class="btn-run" aria-label="Run Code">
            <span class="play-icon">▶</span> Run
          </button>
        </div>
        ${staticHTML}
      </div>

    </is-land>
  </div>
  `
</script>

<style webc:scoped>
  /* Same styling as before */
  :host {
    display: block;
    margin: 2rem 0;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .playground-wrapper {
    border-radius: 8px;
    overflow: hidden;
    background: #fdf6e3;
    border: 1px solid #dcd4b6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .static-preview {
    cursor: pointer;
    position: relative;
    min-height: 200px;
    transition: opacity 0.2s ease;
  }

  .static-preview:hover .preview-header {
    background: rgba(0, 0, 0, 0.05);
  }

  .static-preview:hover .btn-run {
    background: #268bd2;
    color: white;
    border-color: #268bd2;
  }

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid #e0d8c0;
    color: #657b83;
  }

  .preview-title {
    font-size: 0.85rem;
    font-weight: 500;
    opacity: 0.9;
  }

  .btn-run {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: #eee8d5;
    border: 1px solid #93a1a1;
    color: #586e75;
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .play-icon {
    font-size: 0.7rem;
  }

  .static-preview pre.shiki {
    margin: 0;
    padding: 1.25rem;
    overflow-x: auto;
    font-size: 0.9rem;
    line-height: 1.5;
    background-color: transparent !important;
  }

  .static-preview code {
    background-color: transparent !important;
  }
</style>
```

## Client-Side Engine (src/client/sandpack-loader.js)

Use standard package imports in your client engine. The Import Map (configured later) resolves these bare package names to the files you copied into the /vendor/ directory.

**Create this file at:** src/client/sandpack-loader.js

```js
// The browser resolves these imports via the Import Map created in Step 3
import { loadSandpackClient } from "@codesandbox/sandpack-client";
import { solarizedLight } from "@codesandbox/sandpack-themes";

export class SandpackLoader extends HTMLElement {
  constructor() {
    super();
    this.client = null;
    this.container = document.createElement("div");

    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.minHeight = "400px";
    this.container.style.border = "1px solid #e2e8f0";
    this.container.style.borderRadius = "8px";
    this.container.style.display = "block";
  }

  connectedCallback() {
    this.appendChild(this.container);
    this.initSandpack();
  }

  disconnectedCallback() {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }

  getSourceCode() {
    const script = this.querySelector('script[type="text/plain"]');
    if (script && script.textContent) {
      return script.textContent.trim();
    }
    return '// No code provided';
  }

  // Parse comma-separated dependencies from attribute
  getDependencies() {
    const depsString = this.getAttribute("dependencies");
    if (!depsString) return {};

    // Convert "pkg1,pkg2@version" string into object { "pkg1": "latest", "pkg2": "version" }
    return depsString.split(',').reduce((acc, dep) => {
      const [name, version] = dep.trim().split('@');
      acc[name] = version || "latest";
      return acc;
    }, {});
  }

  async initSandpack() {
    const code = this.getSourceCode();
    const themeName = this.getAttribute("theme") || "solarized-light";
    const externalDeps = this.getDependencies();

    const themeMap = {
      "solarized-light": solarizedLight,
    };

    const selectedTheme = themeMap[themeName] || solarizedLight;

    this.client = await loadSandpackClient(
      this.container,
      {
        files: {
          "/index.ts": {
            code: code,
            active: true
          },
          "/index.html": {
            code: `<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script src="index.ts"></script>
  </body>
</html>`,
            hidden: true
          },
          // Create a package.json to declare dependencies for the playground
          "/package.json": {
            code: JSON.stringify({
              dependencies: externalDeps
            }),
            hidden: true
          }
        },
        entry: "/index.ts",
        template: "vite",
      },
      {
        theme: selectedTheme,
        showOpenInCodeSandbox: false,
      }
    );
  }
}

if (!customElements.get("sandpack-loader")) {
  customElements.define("sandpack-loader", SandpackLoader);
}
```

## Usage Example with Dependencies

To explicitly request dependencies for your code example, use the dependencies attribute. Sandpack fetches them automatically inside the iframe.

To request multiple dependencies, separate them with a comma. You can also specify exact versions using the @ symbol (for example, lodash@4.17.21). If you don't specify a version, Sandpack fetches the latest version.

```html
<ts-playground dependencies="uuid, lodash@4.17.21">
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const id = uuidv4();
const array = [1, 2, 3];
const reversed = _.reverse(array.slice());

console.log(`Generated UUID: ${id}`);
console.log(`Reversed array: ${reversed}`);
</ts-playground>
```

## Server Configuration

To enable **SharedArrayBuffer** (which Sandpack uses for in-browser transpilation), you must serve your site with Cross-Origin Isolation headers.

### **Required Headers**

Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin

### **Configuration Examples**

#### **For Netlify (netlify.toml):**

Create or update your netlify.toml file in the root of your project:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

#### **For Vercel (vercel.json):**

Create or update your vercel.json file in the root of your project:

```json
{
  "headers": [
    {
      "source": "/(.\*)",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

#### **For Local Development (Eleventy Dev Server):**

Update your eleventy.config.js:

```js
module.exports = function(eleventyConfig) {
  eleventyConfig.setServerOptions({
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin"
    }
  });
};
```

## Test and troubleshoot Cross-Origin Isolation

Enabling Cross-Origin Isolation restricts how your site interacts with external resources. This can break third-party integrations. Test these headers systematically before deploying them to production.

### Audit common breakage points

Review your site for features that COOP and COEP block by default:

* **Third-party media:** Images, videos, or audio hosted on external domains that don't return a Cross-Origin-Resource-Policy: cross-origin header.
* **External scripts and stylesheets:** Analytics trackers, ad scripts, or external font stylesheets.
* **Iframes:** Embedded videos or widgets.
* **OAuth popups:** Authentication flows that open in a popup window.

### Test locally using DevTools

1. Run your Eleventy site locally with the headers enabled.
2. Open your browser's Developer Tools and navigate to the **Console** and **Network** tabs.
3. If COEP blocks a resource, the browser console logs an error, such as net::ERR_BLOCKED_BY_RESPONSE or a warning about a missing Cross-Origin-Resource-Policy header.

### Use report-only headers

When migrating an existing production site, use Report-Only headers first. These headers instruct the browser to simulate isolation and report violations without blocking resources.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="default"
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="default"
```

### Fix blocked resources

* **Add the crossorigin attribute:** For tags loading external assets (&lt;script&gt;, &lt;img&gt;, etc.), add the crossorigin attribute.
* **Update external servers:** If you control the external resource, configure the server to return the Cross-Origin-Resource-Policy: cross-origin header.
* **Use a credentialless iframe:** For broken external iframes, add the credentialless attribute (&lt;iframe src="..." credentialless&gt;&lt;/iframe&gt;).
