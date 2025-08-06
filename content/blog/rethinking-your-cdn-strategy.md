---
title: Rethinking Your CDN Strategy for 2025
date: 2025-09-15
tags:
  - Performance
  - Caching
  - CDN
  - HTTP/2
  - Code Splitting
mermaid: true
---

The way we've done content caching using CDNs is changing, and it's not always intuitive. As a developer, you might have relied on the idea that using a popular CDN for libraries like jQuery would speed up your site because users already had the file cached. As we'll see, this is no longer the case.

This post explain the old and new strategies for working with CDNs, how browser caching has changed, and what you should do to optimize your site in 2025 and beyond.

## Original CDN Caching

In the old days browser caching was simple. The browser used a file's  URL as the key to the cache. The diagram below shows how a shared cache would speed up the second site visit.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CDN
    participant WebsiteA as my-awesome-blog.com
    participant WebsiteB as another-cool-site.net

    Note over User, WebsiteB: The Shared Cache Scenario
    User->>Browser: 1. Visit my-awesome-blog.com
    Browser->>WebsiteA: GET /index.html
    WebsiteA-->>Browser: HTML (needs jquery.js)
    Browser->>Browser: 2. Check cache for jquery.js (miss)
    Browser->>CDN: 3. GET /jquery.js
    CDN-->>Browser: jquery.js file
    Browser->>Browser: 4. Store in cache<br/>Key: "https://cdn.com/jquery.js"

    User->>Browser: 5. Later, visit another-cool-site.net
    Browser->>WebsiteB: GET /index.html
    WebsiteB-->>Browser: HTML (also needs jquery.js)
    Browser->>Browser: 6. Check cache for jquery.js (HIT!)
    Note right of Browser: Found in cache! No new download needed.
    Browser-->>User: 7. Render page using cached jquery.js
```

This was the dream of the CDN-first approach: a shared, global cache for the entire web.

## Double-Key Caching

All major browsers have switched to Double-Key Caching for privacy and security reasons. Browsers now use a two-part key to store a file: the Top-Level Site and the Resource URL. This isolates the caches so there's no sharing between different sites, as illustrated below.

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant CDN
    participant WebsiteA as my-store.com
    participant WebsiteB as daily-news.org

    Note over User, WebsiteB: The Modern Reality (No Shared Cache)
    User->>Browser: 1. Visit daily-news.org
    Browser->>WebsiteB: GET /index.html
    WebsiteB-->>Browser: HTML (needs fontawesome.css)
    Browser->>Browser: 2. Check cache for key (daily-news.org, .../fa.css)
    Note right of Browser: Cache miss
    Browser->>CDN: 3. GET /fontawesome.css
    CDN-->>Browser: fontawesome.css file
    Browser->>Browser: 4. Store in cache<br/>Key: (daily-news.org, "https://cdn.com/fa.css")

    User->>Browser: 5. Later, visit my-store.com
    Browser->>WebsiteA: GET /index.html
    WebsiteA-->>Browser: HTML (also needs fontawesome.css)
    Browser->>Browser: 6. Check cache for key (my-store.com, .../fa.css)
    Note right of Browser: Cache miss! Key is different.
    Browser->>CDN: 7. RE-DOWNLOAD /fontawesome.css
    CDN-->>Browser: fontawesome.css file
    Browser->>Browser: 8. Store in cache<br/>Key: (my-store.com, "https://cdn.com/fa.css")
```

The shared cache benefit is gone. Each site gets its own separate copy.

## Why Did This Change Happen?

The primary reason for this change was to protect user privacy and security. The old caching method could be exploited. Malicious websites could check if you had a specific file from a specific CDN in your cache. This could be used to:

* **Track users across the web**: By embedding resources from many different sites, a malicious actor could build a profile of the sites you've visited
* **De-anonymize users**: In some cases, knowing which combination of files a user has cached could help identify them.

By isolating caches for each website, double-keyed caching effectively closes this privacy loophole.

## What Should You Do Now?

So, if the old tricks are obsolete, what's the modern approach?

* **Host Your Own Static Assets on a CDN**: You should still use a CDN, but for your own assets. This distributes your files across the globe, so they are physically closer to your users, which reduces latency. You get the speed benefits without relying on a broken shared cache strategy
* **Rethink Your Bundling Strategy**: The old advice was to bundle all your CSS and JS into single files to reduce HTTP requests. This leads to a common question: what about bundling? The old advice to bundle everything into a single file is also outdated.

### Isn't Bundling Bad? What About HTTP/2?

This is where modern web development gets more nuanced; we have to deal with bundling, HTTP/2 and code splitting.

* **HTTP/2 and Multiplexing**: Modern servers use HTTP/2 (and now HTTP/3), which can handle many requests and responses in parallel over a single connection. This makes having many small files much less of a performance problem than it was with HTTP/1.1
* **The Problem with Giant Bundles**: If you bundle all your site's JavaScript into one app.js file, a user on your homepage might be forced to download all the code for your complex, interactive "Dashboard" page, even if they never visit it. This is wasteful and can slow down the initial page load.

### The Modern Solution: Code Splitting

The best practice today is not "all or nothing." It's code splitting.

Modern build tools (like Vite, Webpack, Parcel) allow you to break your code into smaller, logical "chunks" that can be loaded on demand. A common strategy is to create:

* **A "Vendor" Chunk**: Contains third-party libraries (like React or D3.js) that change infrequently
* **A "Common" Chunk**: Contains your own shared code used across many pages (like your site header, footer, and utility functions)
* **Route-Based Chunks**: The specific code for each page or major feature is put into its own file. The code for the profile page is only loaded when the user actually goes to that page

This approach strikes a balance: it avoids a single, monolithic bundle, so users don't download code they don't need. And thanks to HTTP/2, the browser can efficiently handle the smaller 'chunk' requests in parallel.
