---
title: "Improving Font Performance: Use Resource Hints"
date: "2019-01-30"
---

If you're using a third party font service like Google Fonts or Typekit you should work on mitigating potential latency. Say you have a typical Google Font embed code in your `&lt;head>`. You could minimize the amount of time it takes to connect with that server using the [preconnect](https://w3c.github.io/resource-hints/#preconnect) resource hint.

These hints will not load the resource but will do a DNS lookup for the host, TCP handshake, and optional TLS negotiation, all before the resource is actually requested.

```html
<link rel="preconnect" href="https://fonts.googleapis.com/" crossorigin="anonymous">
<link rel="preconnect" href="https://fonts.gstatic.com/" crossorigin="anonymous">
```

A more widely compatible alternative to preconnect is dns-prefetch. It won’t establish a connection to the server, but it will resolve the DNS for the specified host, which can still speed things up a bit:

```html
<link rel="dns-prefetch" href="https://fonts.googleapis.com/">
<link rel="dns-prefetch" href="https://fonts.gstatic.com/">
```
