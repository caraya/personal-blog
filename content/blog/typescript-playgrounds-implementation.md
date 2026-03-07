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

Install the required dependencies locally:

```bash
npm install shiki @11ty/is-land
# Install the client-side libraries
npm install @codesandbox/sandpack-client @codesandbox/sandpack-themes
```

## Configuration (copying files to output)

Because browsers cannot read files directly from the `node_modules` directory, configure Eleventy to copy these required library files to the production output folder.

Isolate the third-party dependencies in a `/vendor/` directory at the root of the site (as a sibling to `/js/`). This establishes a clear boundary between custom code and external code, simplifies security auditing and licensing attribution, and allows developers to apply aggressive, long-term caching rules to external libraries at the directory level.

Update `eleventy.config.js` to map custom logic to `/js` and the third-party npm packages to `/vendor/`:

```js
module.exports = function(eleventyConfig) {
  // 1. Copy custom client logic to the /js output directory
  eleventyConfig.addPassthroughCopy({ "src/client": "js" });

  // 2. Copy vendor libraries to a dedicated /vendor directory at the root
  // Explicitly copy the Main ESM entry points so the browser can load them
  eleventyConfig.addPassthroughCopy({
    "node_modules/@codesandbox/sandpack-client/dist/index.mjs": "vendor/sandpack-client.js",
    "node_modules/@codesandbox/sandpack-themes/dist/index.mjs": "vendor/sandpack-themes.js"
  });

  // Note: If the browser console complains about other missing dependencies
  // (e.g., 'mitt' or 'dequal'), copy those package files here too.

  // ... rest of the config
};
```

## The server-side component (`_components/ts-playground.webc`)

Create the server-side WebC component first. This file renders the static HTML preview, sets up the import map, and tells the browser where to find the client-side script.

The import map acts as a directory, telling the browser how to resolve bare npm package names to the /vendor/ files configured in the previous step.

Create this file at: `_components/ts-playground.webc`

```js
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

## Client-side engine (`src/client/sandpack-loader`)

Use standard package imports in the client engine. The import map (configured previously) resolves these bare package names to the files copied into the `/vendor/` directory.

Create this file at: `src/client/sandpack-loader.ts` (or `.js` if you prefer plain JavaScript)

```ts
// The browser resolves these imports via the Import Map
import { loadSandpackClient, SandpackClient } from "@codesandbox/sandpack-client";
import { solarizedLight } from "@codesandbox/sandpack-themes";

export class SandpackLoader extends HTMLElement {
  private client: SandpackClient | null;
  private container: HTMLDivElement;

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

  private getSourceCode(): string {
    const script = this.querySelector('script[type="text/plain"]');
    if (script && script.textContent) {
      return script.textContent.trim();
    }
    return '// No code provided';
  }

  // Parse comma-separated dependencies from attribute
  private getDependencies(): Record<string, string> {
    const depsString = this.getAttribute("dependencies");
    if (!depsString) return {};

    // Convert "pkg1,pkg2@version" string into object { "pkg1": "latest", "pkg2": "version" }
    return depsString.split(',').reduce((acc: Record<string, string>, dep: string) => {
      const [name, version] = dep.trim().split('@');
      acc[name] = version || "latest";
      return acc;
    }, {});
  }

  private async initSandpack(): Promise<void> {
    const code = this.getSourceCode();
    const themeName = this.getAttribute("theme") || "solarized-light";
    const externalDeps = this.getDependencies();

    const themeMap: Record<string, any> = {
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

**JavaScript**

```js
// The browser resolves these imports via the Import Map
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

## Usage example with dependencies

To explicitly request dependencies for the code example, use the dependencies attribute. Sandpack fetches them automatically inside the iframe.

To request multiple dependencies, separate them with a comma. Specify exact versions using the @ symbol (for example, lodash@4.17.21). If no version is specified, Sandpack fetches the latest version.

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

## Server configuration

To enable SharedArrayBuffer (which Sandpack uses for in-browser transpilation), the site must be served with cross-origin isolation headers.

### Required headers

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```http

### Configuration examples

#### For Netlify (`netlify.toml`)

Create or update the `netlify.toml` file in the root of the project:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "require-corp"
    Cross-Origin-Opener-Policy = "same-origin"
```

#### For Vercel (`vercel.json`)

Create or update the `vercel.json` file in the root of the project:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" }
      ]
    }
  ]
}
```

#### For local development (Eleventy Dev Server)

Update `eleventy.config.js` to set the required headers for the local development server:

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

### Applying cross-origin isolation selectively

Applying COEP and COOP headers globally across an entire site can inadvertently break third-party embeds (like standard YouTube iframes or external images) on pages that do not need them.

Instead of applying these headers to every route, developers can leverage Eleventy's template generation to conditionally apply them only to specific pages at build time.

To learn how to generate dynamic `_headers` files based on front matter flags and implement robust local testing environments, read the comprehensive guide: [Selectively Applying Security Headers in Eleventy](/security-headers-in-netlify/).

## Test and troubleshoot cross-origin isolation

Enabling cross-origin isolation restricts how the site interacts with external resources. This can break third-party integrations. Test these headers systematically before deploying them to production.

### Audit common breakage points

Review the site for features that COOP and COEP block by default:

* **Third-party media**: Images, videos, or audio hosted on external domains that do not return a Cross-Origin-Resource-Policy: cross-origin header.
* **External scripts and stylesheets**: Analytics trackers, ad scripts, or external font stylesheets.
* **Iframes**: Embedded videos or widgets.
* **OAuth popups**: Authentication flows that open in a popup window.

### Test locally using DevTools

Run the Eleventy site locally with the headers enabled.

Open the browser's Developer Tools and navigate to the Console and Network tabs.

If COEP blocks a resource, the browser console logs an error, such as `net::ERR_BLOCKED_BY_RESPONSE`, or a warning about a missing `Cross-Origin-Resource-Policy` header.

### Use report-only headers

When migrating an existing production site, use Report-Only headers first. These headers instruct the browser to simulate isolation and report violations without blocking resources.

```http
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="default"
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="default"
```

### Fix blocked resources

* **Add the crossorigin attribute**: For tags loading external assets (`<script>`, `<img>`, etc.), add the `crossorigin` attribute.
* **Update external servers**: If the external resource is controlled internally, configure the server to return the `Cross-Origin-Resource-Policy: cross-origin` header.
* **Use a credentialless iframe**: For broken external iframes, add the `credentialless` attribute (`<iframe src="..." credentialless></iframe>`).
