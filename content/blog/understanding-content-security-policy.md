---
title: "Understanding Content Security Policy (CSP)"
date: 2026-03-27
tags:
  - Security
  - Web Development
  - Netlify
---

Content Security Policy (CSP) is an added layer of security that helps detect and mitigate certain types of attacks, including Cross-Site Scripting (XSS) and data injection attacks. These attacks are used for everything from data theft to site defacement to the distribution of malware.

This guide explains how to design a CSP, the core directives you can use, and how to implement your policy effectively on Netlify.

## **How CSP works**

To enable CSP, you need to configure your web server to return the Content-Security-Policy HTTP header. Alternatively, you can use the &lt;meta&gt; element to configure a policy, for example: &lt;meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src httpsta*;">

A robust CSP explicitly defines which dynamic resources are allowed to load and execute. The browser strictly adheres to these rules, blocking any resource not explicitly permitted by the policy.

## **Core concepts: Directives and sources**

A CSP consists of one or more directives, each governing a specific resource type.

### **Available directives**

CSP directives are grouped by their specific function within the browser.

#### **Fetch directives**

Fetch directives control the locations from which certain resource types may be loaded. If a specific fetch directive is not defined, the browser falls back to the default-src directive.

| Directive | Description |
| :---- | :---- |
| child-src | Defines the valid sources for web workers and nested browsing contexts loaded using elements such as &lt;frame&gt; and &lt;iframe&gt;. |
| connect-src | Restricts the URLs which can be loaded using script interfaces (like fetch, XHR, WebSockets, and EventSource). |
| default-src | Serves as a fallback for the other fetch directives. |
| font-src | Specifies valid sources for fonts loaded using @font-face. |
| frame-src | Specifies valid sources for nested browsing contexts loading using elements such as &lt;frame&gt; and &lt;iframe&gt;. |
| img-src | Specifies valid sources of images and favicons. |
| manifest-src | Specifies valid sources of application manifest files. |
| media-src | Specifies valid sources for loading media using the &lt;audio&gt; and &lt;video&gt; elements. |
| object-src | Specifies valid sources for the &lt;object&gt;, &lt;embed&gt;, and &lt;applet&gt; elements. |
| prefetch-src | Specifies valid sources to be prefetched or prerendered. |
| script-src | Specifies valid sources for JavaScript. |
| script-src-elem | Specifies valid sources for JavaScript &lt;script&gt; elements. |
| script-src-attr | Specifies valid sources for JavaScript inline event handlers. |
| style-src | Specifies valid sources for stylesheets. |
| style-src-elem | Specifies valid sources for &lt;style&gt; elements and &lt;link&gt; elements with rel="stylesheet". |
| style-src-attr | Specifies valid sources for inline styles applied to individual DOM elements. |
| worker-src | Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. |

#### **Document directives**

Document directives govern the properties of the document or worker environment to which the policy applies.

| Directive | Description |
| :---- | :---- |
| base-uri | Restricts the URLs which can be used in a document's &lt;base&gt; element. |
| sandbox | Enables a sandbox for the requested resource similar to the &lt;iframe&gt; sandbox attribute. |

#### **Navigation directives**

Navigation directives govern to what locations a user can navigate or submit a form.

| Directive | Description |
| :---- | :---- |
| form-action | Restricts the URLs which can be used as the target of a form submissions from a given context. |
| frame-ancestors | Specifies valid parents that may embed a page using &lt;frame&gt;, &lt;iframe&gt;, &lt;object&gt;, &lt;embed&gt;, or &lt;applet&gt;. |

#### **Reporting directives**

Reporting directives control the reporting process of CSP violations.

| Directive | Description |
| :---- | :---- |
| report-to | Fires a SecurityPolicyViolationEvent. (Replaces the deprecated report-uri directive). |
| report-uri | Instructs the user agent to report attempts to violate the Content Security Policy. (Deprecated in favor of report-to). |

#### **Other directives**

| Directive | Description |
| :---- | :---- |
| require-trusted-types-for | Enforces Trusted Types at the DOM XSS injection sinks. |
| trusted-types | Specifies an allowlist of Trusted Types policies created by the application. |
| upgrade-insecure-requests | Instructs user agents to treat all of a site's insecure URLs (those served over HTTP) as though they have been replaced with secure URLs (those served over HTTPS). |

### **Source values**

You assign allowlists of source values to fetch directives to tell the browser what is safe.

| Value | Description |
| :---- | :---- |
| 'none' | Prevents loading resources from any source. You must include the single quotes. |
| 'self' | Refers to the origin from which the protected document is being served, including the same URL scheme and port number. You must include the single quotes. |
| &lt;host-source&gt; | Allows resources from a specific host name (e.g., example.com), a subdomain wildcard (e.g., `*.example.com`), or an exact URL (e.g., `https://example.com:443/path/`). |
| &lt;scheme-source&gt; | Allows loading resources over a specific scheme. Common examples include https:, data:, mediastream:, blob:, and filesystem:. You must include the trailing colon. |
| 'unsafe-inline' | Allows the use of inline resources, such as inline &lt;script&gt; elements, inline &lt;style&gt; elements, or javascript: URIs. |
| 'unsafe-eval' | Allows the use of eval() and similar methods for creating code from strings. |
| 'wasm-unsafe-eval' | Allows the execution of WebAssembly modules without allowing eval() for JavaScript. |
| 'unsafe-hashes' | Allows you to enable inline event handlers (like onclick) using their specific hashes. |
| 'strict-dynamic' | Instructs the browser that trust explicitly given to a script (via a nonce or a hash) shall be propagated to all the scripts loaded by that root script. |
| 'report-sample' | Requires a sample of the violating code to be included in the violation report. |
| 'nonce-&lt;base64-value&gt;' | A secure, random cryptographic string generated by the server. Example: 'nonce-r@nd0m12345'. |
| '&lt;hash-algo&gt;-&lt;base64-value&gt;' | A cryptographic hash of the exact content of an inline script or style. Example: 'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='. Supported algorithms are sha256, sha384, and sha512. |

### **Combining source values**

To allow multiple sources for a specific resource type, list all the allowed values within the same directive, separated by a single space. You do not need to duplicate the directive.

For example, to allow images from both your own origin and any Netlify subdomain, configure the img-src directive like this:

Content-Security-Policy: img-src 'self' \*.netlify.com;

Notice the following syntax rules:

* **Space separation:** Separate the values ('self' and \*.netlify.com) with a space.
* **Keywords require quotes:** Enclose special keywords like 'self' or 'none' in single quotes.
* **Domains do not use quotes:** Do not use quotes for domain names, URLs, or wildcards like \*.netlify.com.

If you accidentally define the same directive twice in a single policy (for example, img-src 'self'; img-src \*.netlify.com;), the browser strictly enforces the first instance and ignores the second one entirely. Always combine your values into a single space-separated list.

### Directive fallback and inheritance

If you do not explicitly define a specific fetch directive (such as script-src, style-src, or img-src), the browser automatically falls back to the value specified in default-src. This cascading behavior allows you to establish a secure baseline (like 'self') and only override specific resource types when necessary.

For example, if your policy is:

```http
Content-Security-Policy: default-src 'self'; img-src https://images.example.com;
```

Scripts and styles will be restricted to 'self' (inheriting from default-src), but images will be allowed to load from the external images.example.com domain.

Keep in mind that non-fetch directives, such as form-action, base-uri, and frame-ancestors, do not inherit from default-src. If you omit them, the browser allows those actions for any source unless you explicitly restrict them.

### **Mitigating the risks of 'unsafe-inline'**

The 'unsafe-inline' source value is dangerous because it neutralizes CSP's primary defense against Cross-Site Scripting (XSS) attacks. When you configure your policy with 'unsafe-inline', you tell the browser that it is safe to execute any inline JavaScript or apply any inline CSS. If an attacker successfully exploits an injection vulnerability and inserts a malicious \<script\> tag or an inline event handler, the browser executes it.

If you have legacy code that requires inline scripts, you can mitigate the danger of 'unsafe-inline' for modern browsers using nonces or hashes. When a modern browser (supporting CSP Level 2 and above) sees a nonce or a hash in your CSP header, it automatically ignores the 'unsafe-inline' directive. Older browsers fall back to using 'unsafe-inline'.

#### **1\. Use cryptographic nonces**

A nonce (number used once) is a secure, random string generated by your server for every single page load. You include this nonce in your CSP header and apply it as an attribute to the inline scripts you explicitly trust.

**The CSP Header:**

Content-Security-Policy: script-src 'self' 'unsafe-inline' 'nonce-r@nd0m12345';

**The HTML:**

| \<\!-- This script executes because the nonce matches \--\>\<script nonce\="r@nd0m12345"\>  console.log("Trusted inline script running\!");\</script\>\<\!-- Modern browsers block this script, despite 'unsafe-inline' \--\>\<script\>  console.log("Malicious injected script\!");\</script\> |
| :---- |

#### **2\. Use cryptographic hashes**

If your inline scripts are static, you can generate a cryptographic hash (like SHA-256) of the script's exact contents and add it to your CSP header.

**The CSP Header:**

| Content-Security-Policy: script-src 'self' 'unsafe-inline' 'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='; |
| :---- |

**The HTML:**

| \<\!-- This script executes because its contents match the hash exactly \--\>\<script\>var inline \= 1;\</script\>\<\!-- The browser blocks this script because its hash does not match the header \--\>\<script\>var malicious \= 1;\</script\> |
| :---- |

### **CSP hashes vs. cache-busting hashes**

You generally cannot reuse cache-busting hashes (like main.a1b2c3d.js) for your Content Security Policy. While both mechanisms involve hashing file contents, they serve different purposes and have strict technical differences:

* **Algorithms and encoding:** Build tools typically generate cache-busting hashes using fast algorithms (such as MD5 or xxHash) and output them as hexadecimal strings. CSP strictly requires secure cryptographic algorithms (SHA-256, SHA-384, or SHA-512) and requires Base64-encoded output.
* **External vs. inline resources:** Developers append cache hashes to external file names to force browsers to download new versions. CSP hashes primarily allowlist inline scripts and styles where there is no URL to allowlist.
* **Strict formatting:** A CSP hash requires a specific prefix indicating the algorithm used (for example, 'sha256-B2yPHKaXnv...'). Cache hashes lack this formatting.

#### **The exception: Subresource Integrity (SRI)**

If your build tool generates Subresource Integrity (SRI) hashes for your external files (which look like integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6..."), these use the exact cryptographic algorithms and Base64 encoding required by CSP.

**Important:** You must obtain the SRI hash directly from a trusted source (such as the official documentation of the library) or generate it yourself from a verified file. If you blindly accept a hash from an untrusted third party, an attacker could provide both a malicious file and its matching hash, completely defeating the security benefits of SRI.

Under the CSP Level 3 specification, you can use an SRI hash directly inside your script-src or style-src directive to allowlist a specific external file without allowlisting the entire domain.

To use an SRI hash in your CSP, wrap the exact hash value in single quotes and place it in the appropriate directive:

**The CSP Header:**

```http
Content-Security-Policy: script-src 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC'; |
```

**The HTML:**

```html
<!-- The browser executes this script because the integrity hash matches the CSP allowlist -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" crossorigin="anonymous"></script>
```

Notice that the <script> tag requires the crossorigin attribute (typically set to anonymous). This instructs the browser to make a CORS request, which is required to read the contents of the cross-origin file and verify its hash.

## **CSP levels and support**

The W3C Web Application Security Working Group defines and maintains the CSP specifications. The standard has evolved through three major levels, each introducing more granular control and robust mitigation strategies.

### **The three levels of CSP**

| Level | Key Features Introduced |
| :---- | :---- |
| **CSP Level 1** | Introduced the core concepts of CSP, including the Content-Security-Policy header and foundational directives like default-src, script-src, style-src, and img-src. Relies heavily on allowlisting domains. |
| **CSP Level 2** | Added support for cryptographic nonces and hashes, allowing developers to secure inline scripts and styles without relying solely on domain allowlists. Also introduced frame-ancestors (to prevent clickjacking), base-uri, and form-action. |
| **CSP Level 3** | Focused on easing deployment and increasing strictness. Introduced 'strict-dynamic' to simplify loading trusted modular scripts, added the report-to directive (replacing report-uri), and integrated Subresource Integrity (SRI) hashes directly into source lists. |

### **Browser support**

Modern browsers offer excellent support for CSP, but support for specific features depends on the browser engine and version. CSP degrades gracefully; if a browser encounters a directive or value it does not understand (like 'strict-dynamic' in an older browser), it simply ignores the unknown value and continues enforcing the rest of the policy.

* **CSP Level 1 & 2:** Universally supported across all modern browsers (Chrome, Edge, Firefox, Safari).
* **CSP Level 3:** Broadly supported in modern Chromium-based browsers (Chrome, Edge) and Firefox. Safari supports most Level 3 features, though support for specific advanced directives (like report-to or full 'strict-dynamic' behavior) may vary slightly across older macOS/iOS versions.

### **Server support**

Because CSP is an HTTP response header, servers universally support all versions, including CSP Level 3. As long as your hosting provider, CDN, or web server allows you to configure custom HTTP headers, you can implement any level of CSP.

You do not need specialized server software to process or "run" CSP. The server merely delivers the policy as a text string, and the client's web browser parses and enforces the specific rules (like 'strict-dynamic' or report-to). This means CSP Levels 1, 2, and 3 work natively on platforms like Netlify, Vercel, Apache, Nginx, Node.js, and any other HTTP-compliant server.

## **Designing your policy**

The most secure approach to writing a CSP is to start with a restrictive policy and incrementally add allowed sources.

```http
Content-Security-Policy: default-src 'none'; img-src 'self'; script-src 'self' https://trusted.cdn.com; style-src 'self';
```

In this example, the policy:

1. Denies everything by default (default-src 'none').
2. Allows images from the same origin (img-src 'self').
3. Allows scripts from the same origin and a trusted CDN (`script-src 'self' https://trusted.cdn.com`).
4. Allows styles from the same origin (style-src 'self').

## Implementing CSP on Netlify

Netlify provides multiple ways to set custom HTTP headers, including CSP. You can configure them statically using configuration files or dynamically using Edge Functions.

### Using netlify.toml

The netlify.toml file is the recommended way to set headers globally across your Netlify site.

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com;"
```

### Using _headers

Alternatively, you can place a `_headers` file in your publish directory (usually public or dist).

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com;
```

### **Dynamic CSP with Netlify Edge Functions**

Because nonces must be completely unique for every single page request to remain secure, you cannot set them in a static file like netlify.toml. Netlify Edge Functions allow you to dynamically generate a cryptographic nonce, apply it to the Content-Security-Policy header, and inject it into the HTML before it reaches the user.

#### **Edge Functions versus standard functions**

Unlike standard serverless functions that deploy to a single geographic region and run on Node.js, Netlify Edge Functions execute globally on CDN nodes at the network edge using standard Web APIs. This proximity to the user provides the extremely low latency required to intercept requests and securely inject a unique cryptographic nonce into both the HTTP header and the HTML document stream on every single page load.

#### **Performance and execution limits**

Netlify Edge Functions enforce a strict CPU execution limit per request (typically 50ms). Generating a secure nonce will **not** cause your function to time out:

1. You only need to generate **one** unique nonce per page load. You can apply this single value to all trusted &lt;script&gt; tags across the entire HTML document.
2. The Web Crypto API (crypto.getRandomValues()) is highly optimized and generates random values in fractions of a millisecond.

However, parsing and modifying the HTML payload *can* become computationally expensive. Using simple string replacements (like string.replace()) requires loading the entire HTML document into memory, which can approach limits on very large pages.

To mitigate this and remain performant, use a streaming parser like **HTMLRewriter**. HTMLRewriter modifies the HTML response stream on the fly as chunks pass through the Edge Function, ensuring minimal memory overhead and fast execution times.

#### **Native TypeScript support**

Netlify Edge Functions natively support TypeScript. Because they run on the Deno runtime, they execute TypeScript (.ts) files automatically out of the box. You do not need to compile or convert your code to JavaScript before deploying.

Below is an example using HTMLRewriter to find all &lt;script&gt; tags that have a specific placeholder attribute and inject the newly generated nonce into them safely.

**TypeScript Example:**

```ts
import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  // Ensure we only process HTML responses to avoid breaking assets
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  // 1. Generate a secure, random cryptographic nonce (runs extremely fast)
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  // Convert the bytes to a Base64 string for the CSP header
  const nonce = btoa(String.fromCharCode(...nonceBytes));

  // 2. Define the policy, applying the nonce to the script-src
  const csp = [
    "default-src 'self'",
    // The 'strict-dynamic' keyword allows scripts approved by a nonce
    // to load additional scripts securely.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self'",
    "img-src 'self' [https://res.cloudinary.com](https://res.cloudinary.com)",
    "frame-ancestors 'none'"
  ].join("; ");

  // 3. Set the dynamic header
  response.headers.set("Content-Security-Policy", csp);

  // 4. Use HTMLRewriter to stream modifications safely
  // This targets any `<script>` tag that has a `data-nonce-placeholder` attribute
  // and gives it the actual generated nonce attribute instead.
  return new HTMLRewriter()
    .on("script[data-nonce-placeholder]", {
      element(element) {
        element.setAttribute("nonce", nonce);
        element.removeAttribute("data-nonce-placeholder");
      }
    })
    .transform(response);
};
```

**JavaScript Example:**

```js
export default async (request, context) => {
  const response = await context.next();

  // Ensure we only process HTML responses to avoid breaking assets
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  // 1. Generate a secure, random cryptographic nonce (runs extremely fast)
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  // Convert the bytes to a Base64 string for the CSP header
  const nonce = btoa(String.fromCharCode(...nonceBytes));

  // 2. Define the policy, applying the nonce to the script-src
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self'",
    "img-src 'self' [https://res.cloudinary.com](https://res.cloudinary.com)",
    "frame-ancestors 'none'"
  ].join("; ");

  // 3. Set the dynamic header
  response.headers.set("Content-Security-Policy", csp);

  // 4. Use HTMLRewriter to stream modifications safely
  // This targets any `<script>` tag that has a `data-nonce-placeholder` attribute
  // and gives it the actual generated nonce attribute instead.
  return new HTMLRewriter()
    .on("script[data-nonce-placeholder]", {
      element(element) {
        element.setAttribute("nonce", nonce);
        element.removeAttribute("data-nonce-placeholder");
      }
    })
    .transform(response);
};
```

#### **Triggering the Edge Function**

To execute your Edge Function and apply the dynamic CSP header to your site, you must declare a trigger in your netlify.toml file. This configuration tells Netlify which routes the function should intercept.

Place your Edge Function code in a file inside the netlify/edge-functions directory (for example, netlify/edge-functions/csp-injector.ts), and then add the following block to your netlify.toml:

```toml
[[edge_functions]]
  # The name of the file in the edge-functions directory (without extension)
  function = "csp-injector"
  # The route or routes to intercept
  path = "/*"
```

In this example, the path `= "/*"` directive ensures that the csp-injector function runs on every incoming request to your site, allowing it to evaluate whether the request is an HTML document and inject the necessary headers and nonces.

## **Testing your policy safely**

Deploying a strict CSP can inadvertently break your site by blocking legitimate scripts or styles. To prevent this, use the Content-Security-Policy-Report-Only header during the testing phase.

The browser evaluates the Report-Only policy and reports violations to a specified URL, but it does not actually block the resources.

Here is how you configure a report-only policy in your netlify.toml:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy-Report-Only = "default-src 'self'; report-uri https://your-analytics-endpoint.com/csp-reports"
```

Once you review the reports and confirm that no required resources trigger violations, you can safely change the header to Content-Security-Policy to enforce the rules.
