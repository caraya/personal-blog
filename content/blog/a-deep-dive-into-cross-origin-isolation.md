---
title: "A Deep Dive into Cross-Origin Isolation"
date: 2026-04-27
tags:
  - Web Development
  - Security
  - Performance
---

Cross-origin isolation is a security feature that allows web applications to securely use powerful features like SharedArrayBuffer and high-resolution timers (performance.now()). To protect user data from side-channel attacks like Spectre, browsers disable these features by default. By enabling cross-origin isolation, you prove to the browser that your application safely manages cross-origin resources, granting you access to these advanced APIs.

This guide explores what cross-origin isolation headers are, how they function, the impact of misconfiguration, and how to safely implement and test them.

## Why is Cross-Origin Isolation Necessary?

Modern browsers load resources from multiple origins into the same process. While convenient, this architecture exposes applications to side-channel attacks, such as Spectre. Malicious code running in the same process as sensitive cross-origin data can read that data by measuring the precise time it takes to execute certain operations.

To mitigate this, browser vendors restricted APIs that facilitate accurate time measurement. If you want to use features that require precise timing or shared memory (such as WebAssembly threads), you must explicitly tell the browser to place your application in a secure, isolated context.

## Features That Require Cross-Origin Isolation

As web browsers prioritize security, the list of APIs requiring a cross-origin isolated context continues to grow. As of today, you must enable cross-origin isolation to use the following features:

* **SharedArrayBuffer**: Required for sharing memory between the main thread and Web Workers. This is essential for WebAssembly threads and high-performance parallel computing.
* **Unclamped High-Resolution Timers**: While performance.now() works in non-isolated contexts, browsers intentionally degrade its precision (clamping) to mitigate timing attacks. Cross-origin isolation restores microsecond accuracy.
* **performance.measureUserAgentSpecificMemory()**: Allows you to estimate the memory usage of your web application for performance monitoring and memory leak detection.
* **JS Self-Profiling API**: Enables sampling-based JavaScript profiling directly within the browser to analyze performance bottlenecks in production environments.

### Tracking Future Requirements

Browser vendors continuously evaluate the security implications of new and existing web APIs. To stay informed about features that will require cross-origin isolation in the future, monitor the following resources:

* **MDN Web Docs**: The MDN documentation for `crossOriginIsolated` frequently updates to reflect the latest APIs gated behind this security feature.
* **Chrome Status**: Track upcoming feature changes, security interventions, and deprecations on chromestatus.com. Changes implemented in Chrome often signal broader industry shifts.
* **The WHATWG HTML Specification**: For definitive, technical tracking, review the HTML Standard, specifically the sections detailing isolated browsing context groups.

## The Core Headers: COOP and COEP

To achieve a cross-origin isolated state, you must serve your top-level document with two specific HTTP response headers: Cross-Origin-Opener-Policy (COOP) and Cross-Origin-Embedder-Policy (COEP).

When you successfully apply both headers, the browser sets the `window.crossOriginIsolated` boolean to `true`.

### Scope of Application

You do not need to pass COOP and COEP headers to every document on your domain. In fact, doing so is an anti-pattern that can break functionality. You only need to apply them to the specific documents that actually require access to isolated features.

Treat cross-origin isolation as a per-page opt-in rather than a mandatory domain-wide configuration:

* **The Top-Level Document**: The main page that needs isolation must serve both COOP and COEP headers.
* **Iframes**: If your isolated top-level document embeds an &lt;iframe&gt;, and you want that iframe to also have access to isolated features, the HTML document loaded inside the iframe must also be served with the COEP header.
* **Other Pages on the Domain**: Pages on your domain that do not need these advanced APIs should not receive these headers. Applying COOP and COEP globally across your entire domain without careful testing can break third-party integrations (like payment gateways, social logins, or analytics) on pages that otherwise function perfectly well without isolation.
* **Subresources**: The individual assets loaded by your isolated document (images, scripts, stylesheets) do not need COOP or COEP. Instead, they must be served with either proper CORS headers or the Cross-Origin-Resource-Policy (CORP) header.

### Automating Selective Application

If not all pages need the headers, can this process still be automated? Yes.

Instead of applying the headers globally, you can configure your server middleware to evaluate the incoming request path or route configuration. By maintaining an allowlist of specific routes or URL patterns that require isolation (such as /game-engine or /video-editor), your middleware can automatically inject the COOP and COEP headers only when a request matches those criteria. This ensures a secure, automated deployment process without risking collateral damage to the rest of your domain.

### Cross-Origin-Opener-Policy (COOP)

The COOP header isolates your browsing context group. It prevents cross-origin documents from opening your document in a popup and accessing its window object (or vice versa).

**Syntax:** `Cross-Origin-Opener-Policy: same-origin | same-origin-allow-popups | unsafe-none`

* **same-origin**: (Required for isolation) The browser isolates the document from all cross-origin openers.
* **same-origin-allow-popups**: Retains references to popups opened with window.open(), provided they either do not set COOP or set it to unsafe-none. This does not grant cross-origin isolation.
* **unsafe-none**: The default behavior. Allows cross-origin documents to retain references to the window object.

### Cross-Origin-Embedder-Policy (COEP)

The COEP header prevents a document from loading any cross-origin resources that do not explicitly grant the document permission to load them.

**Syntax:** `Cross-Origin-Embedder-Policy: require-corp | credentialless | unsafe-none`

* **require-corp**: (Standard for isolation) The browser blocks all cross-origin resources unless the resource server explicitly opts in by providing a Cross-Origin Resource Policy (CORP) or Cross-Origin Resource Sharing (CORS) header.
* **credentialless**: (Alternative for isolation) The browser loads cross-origin resources without credentials (such as cookies or client certificates). The server does not need to provide a CORP header. This greatly simplifies deploying cross-origin isolation when you rely on third-party resources.
* **unsafe-none**: The default behavior. Allows the document to load cross-origin resources without restriction.

## The Companion Header: CORP

If you use **COEP: require-corp**, you must ensure all third-party resources (images, scripts, iframes) respond with the **Cross-Origin-Resource-Policy** (CORP) header.

**Syntax:** `Cross-Origin-Resource-Policy: same-origin | same-site | cross-origin`

* **same-origin**: Only documents from the exact same origin (scheme, host, and port) can load the resource. Use this for private assets that should never be embedded cross-origin.
* **same-site**: Allows documents from the same site (for example, subdomains under the same registrable domain) to load the resource. Use this when sharing assets across trusted subdomains.
* **cross-origin**: Permits any origin to load the resource. Use this for public assets (fonts, images, scripts) that must be consumed by cross-origin isolated pages on other origins.

**Quick rule of thumb**: start with the most restrictive value that still supports your use case (`same-origin` -> `same-site` -> `cross-origin`).

### What Happens with `CORP: cross-origin` in an Isolated Environment?

In a cross-origin isolated page (for example, with `COEP: require-corp`), `Cross-Origin-Resource-Policy: cross-origin` tells the browser that the resource may be embedded by documents from any origin.

In practice, this means:

* The resource is typically allowed instead of being blocked by COEP/CORP checks.
* The top-level page can remain isolated (`window.crossOriginIsolated` can stay `true`) as long as other isolation requirements are also satisfied.

What it does not mean:

* It does not automatically grant JavaScript read access to response data.
* It does not replace CORS for programmatic access patterns that require CORS.

Use `cross-origin` only for assets that are intentionally public and expected to be embedded across origins.

## The Impact of Misconfiguration

Implementing cross-origin isolation headers without careful auditing can severely break your web application.

* **Broken Media and Scripts**: If you set **COEP: require-corp** and attempt to load an image from a CDN that does not send a CORP header, the browser blocks the image. The same applies to scripts, stylesheets, and videos.
* **Failed Integrations**: Third-party widgets (like YouTube embeds, analytics scripts, or payment gateways) often break if the third-party provider does not support CORP headers.
* **Authentication Issues**: OAuth flows and SSO solutions that rely on popup windows communicating back to the main window will fail if **COOP: same-origin** drops the `window.opener` reference.

## How to Test and Deploy Safely

To avoid breaking your application in production, you should test your configuration using report-only headers. The Reporting API allows you to monitor policy violations without actually blocking any resources.

### Use Report-Only Headers

Send the -Report-Only variants of the headers alongside a Report-To header to instruct the browser to send JSON violation reports to your specified endpoint.

```http
Cross-Origin-Opener-Policy-Report-Only: same-origin; report-to="coop-endpoint"
Cross-Origin-Embedder-Policy-Report-Only: require-corp; report-to="coep-endpoint"
Report-To: {"group":"coep-endpoint","max_age":86400,"endpoints":[{"url":"https://your-server.com/logs/coep"}]}
```

### Analyze the Reports

Monitor your reporting endpoint. The browser will send a POST request with details about which resources violated the COEP policy or which window interactions violated the COOP policy.

### Fix Violations

Based on the reports, update your resource requests:

* Add `crossorigin` attributes to `<script>` and `<img>` tags for CORS-enabled resources.
* Contact third-party providers to add CORP headers, or switch to **COEP: credentialless** if you do not need to send cookies to those third parties.

## Ensuring Your Content Continues to Work

Here is how to properly implement these headers in your server code or hosting configuration and handle feature detection on the client.

### Server and Hosting Configuration

Below are examples of how to selectively apply COOP and COEP headers to specific routes. This automates the process while preventing headers from accidentally bleeding into routes that do not need them.

### Strategy 1: Hosting-Level Routing (Netlify)

Standard Netlify configuration files (`netlify.toml` and `_headers`) operate strictly on URL path matching at the CDN level. They do not natively understand your Eleventy content metadata (such as front matter flags).

If you want to apply cross-origin isolation selectively, there are two practical approaches: runtime inspection with Edge Functions, or frontmatter-driven build-time generation. For Eleventy projects, frontmatter-driven generation is usually the best default because it is deterministic, maintainable, and fast.

Use runtime inspection only when you cannot rely on front matter or route metadata and must infer isolation requirements from rendered HTML.

#### Approach 1: Runtime content inspection with Edge Functions

Netlify Edge Functions can intercept the HTTP response before it reaches the user, inspect HTML content for a marker (like a specific script tag), and dynamically inject the headers.

```ts
import { Config, Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();

  // Only inspect HTML responses to avoid overhead on standard assets
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    return response;
  }

  // Clone the response to safely read its text content
  const text = await response.clone().text();

  // Check if the HTML contains your target script tag
  const targetScript = 'src="/scripts/requires-shared-memory.js"';

  if (text.includes(targetScript)) {
    response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
    response.headers.set("Cross-Origin-Embedder-Policy", "credentialless");
  }

  return response;
};

// Apply this edge function to all HTML routes
export const config: Config = {
  path: "/*",
};
```

##### The Drawback: Runtime Latency

While Edge Functions are flexible, they introduce significant latency. To inspect the HTML content, the Edge Function must wait for the origin server to generate the page, clone the response body into memory, convert it to a text string, and run a string matching algorithm.

This sequence blocks the critical rendering path. It adds meaningful latency to your Time to First Byte (TTFB), directly impacting perceived page load speed and Core Web Vitals.

#### Approach 2: Frontmatter-Driven Build-Time Generation (Recommended)

For Eleventy sites, a more maintainable approach is to make front matter the source of truth. Add `isolate: true` to any page that needs cross-origin isolation, then generate `_headers` from collections at build time.

Because this template is rendered fresh on every build, `_headers` is regenerated (overwritten) each run and always reflects the current set of isolated pages.

Keep global security headers (like `X-Content-Type-Options`) in `netlify.toml`, and use generated `_headers` only for route-specific isolation rules.

Example global headers in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    Access-Control-Allow-Origin = "*"
```

Create an Eleventy template named `_headers.liquid` (or `_headers.njk`, depending on your template engine):


```liquid
{% raw %}
---
permalink: /_headers
eleventyExcludeFromCollections: true
---
{%- for item in collections.all -%}
  {%- if item.data.isolate %}
{{ item.url }}
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless

  {%- endif -%}
{%- endfor -%}
{% endraw %}
```

And in content front matter:

```yaml
---
title: "Interactive WebAssembly Demo"
isolate: true
---
```

#### Why Frontmatter-Driven Build-Time Generation is Superior

The build-time approach is vastly superior for performance and reliability. By generating the routing rules before deployment, Netlify's global CDN parses the `_headers` file once and serves the required headers statically.

This provides several critical benefits:

* **Zero Runtime Latency**: The CDN serves the headers instantly, completely eliminating the TTFB penalty caused by Edge Functions parsing strings.
* **Zero Compute Cost**: You do not consume expensive serverless function invocations on every HTML page load.
* **Fail-Safe Execution**: If the script searching logic contains a bug or a file system error occurs, the build process fails safely in your CI/CD pipeline, preventing broken configurations from reaching your live production users.

#### Handling Configuration Merges: `netlify.toml` and `_headers`

When you configure headers in both a `netlify.toml` file and a `_headers` file, Netlify merges the rules from both sources.

Because standard CORS headers (like `Access-Control-Allow-Origin`) and cross-origin isolation headers (`Cross-Origin-Opener-Policy` and `Cross-Origin-Embedder-Policy`) use entirely distinct header keys, they do not conflict. Netlify successfully applies both sets of headers to the applicable routes.

For example, if your `netlify.toml` applies a global CORS policy to all resources:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

And your build-time `_headers` generation targets a specific page for isolation:

```toml
/game-engine.html
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: credentialless
```

When a user requests /game-engine.html, the final HTTP response contains the combined headers from both sources:

```http
Access-Control-Allow-Origin: *
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: credentialless
```

**Precedence**: If a direct conflict occurs—meaning you define the exact same header key for the same route in both files—the rule in the `_headers` file takes precedence over the rule in the netlify.toml file.

### Strategy 2: Application Server Middleware (Node.js)

#### Example: Fastify

If you run a Node.js server, you can use middleware or request hooks to selectively inject headers based on an allowlist of paths.

```ts
import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

const fastify: FastifyInstance = Fastify({ logger: true });

// Define an allowlist of routes that require cross-origin isolation
const isolatedRoutes: string[] = ['/app/editor', '/app/game'];

// Use an onRequest hook to selectively apply headers
fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
  if (isolatedRoutes.includes(request.url)) {
    // Apply COOP and COEP headers only to matched routes
    reply.header('Cross-Origin-Opener-Policy', 'same-origin');
    reply.header('Cross-Origin-Embedder-Policy', 'credentialless');
  }
});

fastify.get('/app/editor', async (request: FastifyRequest, reply: FastifyReply) => {
  return 'Isolated application loads here.';
});

fastify.get('/marketing', async (request: FastifyRequest, reply: FastifyReply) => {
  // This route remains un-isolated, allowing third-party widgets to function normally.
  return 'Standard marketing page loads here.';
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
```

## Client-Side Feature Detection

Never assume that powerful features are available just because you configured your server. Always check `window.crossOriginIsolated` before utilizing APIs like SharedArrayBuffer.

```ts
if (typeof window !== 'undefined' && window.crossOriginIsolated) {
  // Safe to allocate a SharedArrayBuffer
  const sharedBuffer = new SharedArrayBuffer(1024);
  console.log('Successfully allocated shared memory.');

  // Safe to use high-resolution timers without clamping
  const start = performance.now();
  // ... execute task ...
  const end = performance.now();
  console.log(`Task took ${end - start} milliseconds.`);
} else {
  // Provide a fallback mechanism for environments lacking isolation
  console.warn('Cross-origin isolation is not enabled. Falling back to ArrayBuffer.');
  const standardBuffer = new ArrayBuffer(1024);
}
```

## Reporting Status to Analytics

You can track the success rate of your isolation rollout by reporting the `crossOriginIsolated` state to your analytics provider. This helps quantify how many users receive the high-performance experience versus the fallback experience.

The following examples demonstrate how to send this data as a custom event to Google Analytics 4 (GA4) using the standard gtag.js library.

```ts
// Declare the global gtag function to satisfy the TypeScript compiler
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

if (typeof window !== 'undefined') {
  const isIsolated: boolean = window.crossOriginIsolated;

  // Ensure the Google Analytics gtag function is available
  if (typeof window.gtag === 'function') {
    // Option 1: Send a custom event
    window.gtag('event', 'cross_origin_isolation_status', {
      is_isolated: isIsolated,
    });

    // Option 2: Set a user property (useful for building audiences or segments)
    window.gtag('set', 'user_properties', {
      cross_origin_isolated: isIsolated.toString(),
    });
  }
}
```

## Managing HTML Elements

When loading cross-origin resources into your isolated application, use the `crossorigin` attribute in your HTML to explicitly request the resource using CORS.

### `crossorigin` Values vs `credentialless`

The `crossorigin` attribute only supports these values:

* `anonymous`: Sends the request in CORS mode without credentials (no cookies or HTTP auth).
* `use-credentials`: Sends the request in CORS mode with credentials included.
* Empty value (`crossorigin`): Behaves like `anonymous`.

No `crossorigin` attribute means browser-default behavior for that element, which is often different from explicit CORS.

`credentialless` is different and exists in other mechanisms:

* `Cross-Origin-Embedder-Policy: credentialless` is a document-level response header.
* `<iframe credentialless>` is an iframe attribute.

`credentialless` is not a valid value for `crossorigin`, and it is not a value for CORS response headers like `Access-Control-Allow-Origin`.

```html
<!-- Load an image via CORS -->
<img src="https://cdn.example.com/image.jpg" crossorigin="anonymous" alt="Sample image">

<!-- Load a script via CORS -->
<script src="https://cdn.example.com/library.js" crossorigin="anonymous"></script>

<!-- Credentialless iframe (separate attribute) -->
<iframe src="https://third-party.example.com/widget" credentialless></iframe>
```

## Debugging Cross-Origin Isolation

When isolation does not work, debug in this order so you can quickly identify whether the issue is missing headers, blocked resources, or browser behavior.

### Confirm the top-level document headers

Start by verifying the final response headers for the page itself (not just your config files):

```bash
curl -I https://your-site.example/isolated-page/
```

For isolation, you should see both:

* `Cross-Origin-Opener-Policy: same-origin`
* `Cross-Origin-Embedder-Policy: require-corp` (or `credentialless`)

If either header is missing on the top-level document, `window.crossOriginIsolated` will be `false`.

### Verify runtime state in DevTools

In the browser console on the target page, check:

```js
window.crossOriginIsolated
```

If this returns `false`, inspect Network tab headers for the HTML document and confirm the browser is not serving a stale cached response.

### Inspect blocked resources

If headers are present but the page still fails, check Console and Network for blocked cross-origin assets.

Common signals include `net::ERR_BLOCKED_BY_RESPONSE` and COEP/CORP violation messages. These usually indicate that a cross-origin script, image, worker, or iframe is missing required CORS/CORP support.

### Check credential mode mismatches

Validate that your element attributes and server headers agree:

* `crossorigin="anonymous"` requests omit credentials.
* `crossorigin="use-credentials"` requests include credentials and require compatible CORS response headers.
* `COEP: credentialless` is a document policy and is separate from `crossorigin` values.

Mismatches here can cause resources to fail silently or appear as CORS policy errors.

### Re-test auth and popup flows

After enabling `COOP: same-origin`, explicitly test OAuth, SSO, and any popup integrations. These flows can break if they rely on `window.opener` communication across origins.

### Use report-only mode before enforcement

If you are still tuning behavior, keep using `*-Report-Only` headers first and treat them as a preflight phase before enforcement.

Use this rollout sequence:

* **Stage 1 (Observe)**: Enable `Cross-Origin-Opener-Policy-Report-Only` and `Cross-Origin-Embedder-Policy-Report-Only`, then collect reports for several days of real traffic.
* **Stage 2 (Triage)**: Group violations by resource and route. Fix first-party assets immediately, then work with third-party providers on missing CORS/CORP support.
* **Stage 3 (Canary)**: Enforce headers on a small subset of routes (or a staging environment) and compare errors, auth flows, and key user journeys against report-only behavior.
* **Stage 4 (Enforce)**: Switch to enforcing `COOP`/`COEP` only when violation volume is near zero for intended isolated routes and critical workflows (OAuth, embeds, analytics, payments) pass.

Example rollout for a single route:

```toml
# Phase A: Report-only on /app/
[[headers]]
  for = "/app/*"
  [headers.values]
    Cross-Origin-Opener-Policy-Report-Only = "same-origin; report-to=\"coop-endpoint\""
    Cross-Origin-Embedder-Policy-Report-Only = "require-corp; report-to=\"coep-endpoint\""
    Report-To = "{\"group\":\"coep-endpoint\",\"max_age\":86400,\"endpoints\":[{\"url\":\"https://example.com/reports/coep\"}]}"
```

```toml
# Phase B: Enforce on /app/ after reports stabilize
[[headers]]
  for = "/app/*"
  [headers.values]
    Cross-Origin-Opener-Policy = "same-origin"
    Cross-Origin-Embedder-Policy = "require-corp"
```

Even after enforcement, keep reporting enabled for a while to catch regressions introduced by new third-party scripts or content changes.

## Conclusion

Cross-origin isolation is a powerful security mechanism that unlocks the full potential of web performance APIs. By carefully deploying the COOP and COEP headers, utilizing the Reporting API to monitor violations, configuring CORS and CORP properly, and tracking the state in your analytics platform, you can ensure your application remains secure without breaking functionality.
