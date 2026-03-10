---
title: "Typescript Playgrounds Implementation (Local & No Build)"
date: 2026-04-24
tags:
  - Eleventy
  - Javascript
  - Typescript
---

As the capstone of this series, this post demonstrates how to build a complex TypeScript playground component. This component allows one or more instances to render interactive TypeScript code examples directly on the page. This is a common use case for documentation sites, and it perfectly demonstrates how to handle complex client-side logic while maintaining a fast, static HTML preview.

!!!note  Note:
This is the capstone post for the Islands Architecture series.

1. [Theory](/what-is-the-islands-architecture/)
2. [Implementation Guide](/implementation-guide/)
3. [Advanced Patterns](/advanced-patterns/)
4. Capstone (**this post**)
!!!

## Prerequisites

Install the dependencies locally.

```bash
npm install shiki @11ty/is-land
# Install the client-side libraries
npm install @codesandbox/sandpack-client @codesandbox/sandpack-themes
```

## Configuration (Copying Files to Output)

Because browsers cannot read files directly from your node_modules directory, configure Eleventy to copy these required library files to your production output folder.

Isolate the third-party dependencies in a `/vendor/` directory at the root of your site (as a sibling to `/js/`). This establishes a clear boundary between your custom code and external code, simplifies security auditing and licensing attribution, and allows you to apply aggressive, long-term caching rules to external libraries at the directory level.

Update your eleventy.config.js to map your custom logic to `/js` and the third-party NPM packages to `/vendor/`:

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

## The Server-Side Component (`_components/ts-playground.webc`)

Create the server-side WebC component first. This file parses the multi-file input, renders a stacked static HTML preview for each file, sets up the Import Map, and tells the browser where to find the client-side script.

```html
<script webc:type="js" webc:is="template">
  const { getHighlighter } = await import("shiki");

  const content = this.content || "";
  const theme = this.theme || "solarized-light";
  const dependencies = this.dependencies || "";
  const defaultLang = this.lang || "typescript";

  async function generateMultiFilePreview(rawContent) {
    // Regex to extract <script type="text/plain" data-file="..." data-lang="...">
    const fileRegex = /<script\s+type="text\/plain"[^>]*data-file="([^"]+)"(?:[^>]*data-lang="([^"]+)")?[^>]*>([\s\S]*?)<\/script>/gi;

    const files = [];
    let match;

    while ((match = fileRegex.exec(rawContent)) !== null) {
      files.push({
        filename: match[1],
        lang: match[2] || defaultLang,
        code: match[3].trim()
      });
    }

    // Fallback if no specific data-file blocks are found
    if (files.length === 0 && rawContent.trim()) {
      files.push({
        filename: "/index.ts",
        lang: defaultLang,
        code: rawContent.replace(/<script[^>]*>|<\/script>/gi, '').trim()
      });
    }

    if (files.length === 0) return "<p>No code provided</p>";

    // Get unique languages to load into Shiki
    const langsToLoad = [...new Set(files.map(f => f.lang))];

    const highlighter = await getHighlighter({
      themes: ['solarized-light'],
      langs: langsToLoad
    });

    let htmlOutput = "";
    for (const file of files) {
      const highlighted = highlighter.codeToHtml(file.code, {
        lang: file.lang,
        theme: 'solarized-light'
      });

      htmlOutput += `
        <div class="file-block">
          <div class="file-tab">${file.filename}</div>
          ${highlighted}
        </div>
      `;
    }

    return htmlOutput;
  }

  const staticHTML = await generateMultiFilePreview(content);

  `
  <div class="playground-wrapper">
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
          <!-- The raw content containing multiple scripts is passed down -->
          ${content}
        </sandpack-loader>
        <script type="module" src="/js/sandpack-loader.js"></script>
      </template>

      <div class="static-preview">
        <div class="preview-header">
          <span class="preview-title">Interactive Environment</span>
          <button class="btn-run" aria-label="Run Code">
            <span class="play-icon">▶</span> Run
          </button>
        </div>
        <div class="files-container">
          ${staticHTML}
        </div>
      </div>

    </is-land>
  </div>
  `
</script>

<style webc:scoped>
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

  /* Multi-file styling */
  .files-container {
    display: flex;
    flex-direction: column;
  }

  .file-block {
    border-bottom: 1px solid #e0d8c0;
  }

  .file-block:last-child {
    border-bottom: none;
  }

  .file-tab {
    font-size: 0.75rem;
    font-family: monospace;
    padding: 0.3rem 1rem;
    background: rgba(0, 0, 0, 0.04);
    color: #586e75;
    border-bottom: 1px solid #e0d8c0;
  }

  .static-preview pre.shiki {
    margin: 0;
    padding: 1rem;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
    background-color: transparent !important;
  }

  .static-preview code {
    background-color: transparent !important;
  }
</style>
```

## The Client-Side Engine

The client engine parses the identical `<script>` tags to build the Sandpack virtual file system.

Choose the implementation that aligns with your project setup. The JavaScript version requires no build step. The TypeScript version requires transpilation but provides strict typing.

### Option A: JavaScript Implementation (No Build)

Create this file at: `src/client/sandpack-loader.js`

```js
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

  getFiles() {
    const scripts = this.querySelectorAll('script[type="text/plain"][data-file]');
    const files = {};

    // Fallback if no specific files are defined
    if (scripts.length === 0) {
      const fallbackScript = this.querySelector('script[type="text/plain"]:not([data-file])');
      if (fallbackScript) {
        files["/index.ts"] = { code: fallbackScript.textContent.trim(), active: true };
      }
      return files;
    }

    let isFirst = true;
    scripts.forEach(script => {
      const filename = script.getAttribute('data-file');
      files[filename] = {
        code: script.textContent.trim(),
        active: script.hasAttribute('data-active') || isFirst,
        hidden: script.hasAttribute('data-hidden')
      };
      isFirst = false;
    });

    return files;
  }

  getDependencies() {
    const depsString = this.getAttribute("dependencies");
    if (!depsString) return {};

    return depsString.split(',').reduce((acc, dep) => {
      const [name, version] = dep.trim().split('@');
      acc[name] = version || "latest";
      return acc;
    }, {});
  }

  async initSandpack() {
    const files = this.getFiles();
    const externalDeps = this.getDependencies();
    const themeName = this.getAttribute("theme") || "solarized-light";

    const themeMap = { "solarized-light": solarizedLight };
    const selectedTheme = themeMap[themeName] || solarizedLight;

    // Ensure a package.json exists if dependencies are provided
    if (Object.keys(externalDeps).length > 0) {
      files["/package.json"] = {
        code: JSON.stringify({ dependencies: externalDeps }),
        hidden: true
      };
    }

    this.client = await loadSandpackClient(
      this.container,
      {
        files: files,
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

### Option B: TypeScript Implementation (Requires Build Step)

If you prefer to maintain TypeScript in your source repository and compile it using esbuild or Vite, use this version.

Create this file at: `src/client/sandpack-loader.ts`

```ts
import { loadSandpackClient, SandpackClient, SandpackFiles } from "@codesandbox/sandpack-client";
import { solarizedLight } from "@codesandbox/sandpack-themes";

export class SandpackLoader extends HTMLElement {
  private client: SandpackClient | null = null;
  private container: HTMLDivElement;

  constructor() {
    super();
    this.container = document.createElement("div");

    this.container.style.width = "100%";
    this.container.style.height = "100%";
    this.container.style.minHeight = "400px";
    this.container.style.border = "1px solid #e2e8f0";
    this.container.style.borderRadius = "8px";
    this.container.style.display = "block";
  }

  connectedCallback(): void {
    this.appendChild(this.container);
    this.initSandpack();
  }

  disconnectedCallback(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }

  private getFiles(): SandpackFiles {
    const scripts = this.querySelectorAll<HTMLScriptElement>('script[type="text/plain"][data-file]');
    const files: SandpackFiles = {};

    if (scripts.length === 0) {
      const fallbackScript = this.querySelector<HTMLScriptElement>('script[type="text/plain"]:not([data-file])');
      if (fallbackScript && fallbackScript.textContent) {
        files["/index.ts"] = { code: fallbackScript.textContent.trim(), active: true };
      }
      return files;
    }

    let isFirst = true;
    scripts.forEach((script) => {
      const filename = script.getAttribute('data-file');
      if (filename && script.textContent) {
        files[filename] = {
          code: script.textContent.trim(),
          active: script.hasAttribute('data-active') || isFirst,
          hidden: script.hasAttribute('data-hidden')
        };
        isFirst = false;
      }
    });

    return files;
  }

  private getDependencies(): Record<string, string> {
    const depsString = this.getAttribute("dependencies");
    if (!depsString) return {};

    return depsString.split(',').reduce((acc: Record<string, string>, dep: string) => {
      const [name, version] = dep.trim().split('@');
      acc[name] = version || "latest";
      return acc;
    }, {});
  }

  private async initSandpack(): Promise<void> {
    const files = this.getFiles();
    const externalDeps = this.getDependencies();
    const themeName = this.getAttribute("theme") || "solarized-light";

    const themeMap: Record<string, any> = { "solarized-light": solarizedLight };
    const selectedTheme = themeMap[themeName] || solarizedLight;

    if (Object.keys(externalDeps).length > 0) {
      files["/package.json"] = {
        code: JSON.stringify({ dependencies: externalDeps }),
        hidden: true
      };
    }

    this.client = await loadSandpackClient(
      this.container,
      {
        files: files,
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

## Usage Example with Multiple Files

To build a multi-file playground, provide multiple `<script type="text/plain">` blocks inside your `<ts-playground>` component. Use `data-file` to define the Sandpack file path and `data-lang` to declare the highlighting grammar.

```html
<ts-playground dependencies="uuid">
  <script type="text/plain" data-file="/index.ts" data-lang="typescript">
    import './styles.css';
    import { v4 as uuidv4 } from 'uuid';

    document.querySelector('#app')!.innerHTML = `
      <div class="card">
        <h1>Hello from Eleventy</h1>
        <p>Your ID is: <code>${uuidv4()}</code></p>
      </div>
    `;
  </script>

  <script type="text/plain" data-file="/styles.css" data-lang="css">
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      padding-top: 2rem;
    }
    .card {
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #eee;
    }
    h1 {
      color: #268bd2;
      margin-top: 0;
    }
  </script>

  <script type="text/plain" data-file="/index.html" data-lang="html" data-hidden>
    <!DOCTYPE html>
    <html lang="en">
      <body>
        <div id="app"></div>
        <script type="module" src="/index.ts"><\/script>
      </body>
    </html>
  </script>
</ts-playground>
```

!!!note  **Note:**
The `data-hidden` attribute prevents the file from displaying in the static preview or the Sandpack file explorer, while still providing it to the compiler (ideal for boilerplate HTML). Remember to escape the closing script tag (`<\/script>`) if you embed HTML inside the raw code block.
!!!

## Server Configuration (Targeted Headers)

Applying Cross-Origin Isolation headers globally (/*) can break third-party integrations (like YouTube embeds, analytics scripts, or external images) on pages that do not use the playground.

To prevent this, you should apply these headers only to the specific routes where the playground component is present. For a detailed explanation of why these headers behave this way, see [A Deep Dive into Cross-Origin Isolation](/a-deep-dive-into-cross-origin-isolation/).

### Option A: Manual Path Targeting

Instead of using a global wildcard, specify the exact subdirectories that contain your code playgrounds.

#### For Netlify (`netlify.toml`)

If all your playgrounds live inside a /tutorials/ directory, update your configuration:

```toml
[[headers]]
  for = "/tutorials/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "credentialless"
    Cross-Origin-Opener-Policy = "same-origin"
```

#### For Vercel (`vercel.json`)

Update the source array to target the specific paths:

```json
{
  "headers": [
    {
      "source": "/tutorials/(.*)",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "credentialless" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

### Option B: Automated Headers in Eleventy (**Netlify Only**)

If you use Netlify, you can automate this using Eleventy's data cascade. Netlify reads headers from a `_headers` file in your output directory. You can generate this file dynamically based on your page frontmatter.

Add a flag to the frontmatter of any page that uses the playground:

```yaml
---
title: "My TypeScript Tutorial"
playground: true
---
```

Create a file named `_headers.liquid`  (or `.njk` if you use Nunjucks) in your source directory to dynamically generate the required Netlify configuration:

{% raw %}
```liquid
---
permalink: /_headers
eleventyExcludeFromCollections: true
---
# Dynamically apply Cross-Origin headers only to pages
# with the playground
{% for page in collections.all %}
  {% if page.data.has_playground %}
{{ page.url }}
  Cross-Origin-Embedder-Policy: credentialless
  Cross-Origin-Opener-Policy: same-origin
  {% endif %}
{% endfor %}
```
{% endraw %}

During the build, Eleventy will find all pages marked with `playground: true` and output their exact URLs with the required headers into your `_site/_headers` file.

### Local Development Limitations

Eleventy's built-in development server (`eleventyConfig.setServerOptions`) currently only supports applying headers globally.

When testing locally, applying the headers globally is actually beneficial because it immediately highlights any third-party assets that fail under isolation rules. If it becomes too disruptive locally, you can use the Report-Only variants (see Section 7) or remove the local headers entirely and rely on your targeted Netlify/Vercel configuration for production.

#### Test and troubleshoot Cross-Origin Isolation

Enabling Cross-Origin Isolation restricts how your site interacts with external resources. Test these headers systematically before deploying them to production.

* Audit common breakage points
* Review your site for features that COOP and COEP block by default:
  * **Third-party media**: Images, videos, or audio hosted on external domains that don't return a `Cross-Origin-Resource-Policy: cross-origin` header
  * **External scripts and stylesheets**: Analytics trackers, ad scripts, or external font stylesheets.
  * **Iframes**: Embedded videos or widgets.
  * **OAuth popups**: Authentication flows that open in a popup window.

#### Test locally using DevTools

Run your Eleventy site locally with the headers enabled.

Open your browser's Developer Tools and navigate to the Console and Network tabs.

If COEP blocks a resource, the browser console logs an error, such as `net::ERR_BLOCKED_BY_RESPONSE` or a warning about a missing `Cross-Origin-Resource-Policy` header.

#### Use report-only headers

When migrating an existing production site, use Report-Only headers first. These headers instruct the browser to simulate isolation and report violations without blocking resources.

```http
Cross-Origin-Embedder-Policy-Report-Only: credentialless; report-to="default"
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="default"
```

#### Fix blocked resources

* **Add the `crossorigin` attribute**: For tags loading external assets (`<script>`, `<img>`, etc.), add the `crossorigin` attribute.
* **Update external servers**: If you control the external resource, configure the server to return the `Cross-Origin-Resource-Policy: cross-origin` header.
* **Use a credentialless iframe**: For broken external iframes, add the `credentialless` attribute (`<iframe src="..." credentialless></iframe>`).

