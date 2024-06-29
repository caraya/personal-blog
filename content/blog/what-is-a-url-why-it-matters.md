---
title: What is a URL? Why it matters
date: 2024-07-05
tags:
  - Web
  - Security
youtube: true
---

Whether we know it or not we work with URLs all the time. Whenever we enter a web address into the browser's omni-bar, click on a link on a web page or click on an email link, all those are URLs.

Despite their use everywhere, defining a URL is hard. URLs are defined in [RFC 3986](https://datatracker.ietf.org/doc/html/rfc3986), in the [WHATWG URL Living Standard](https://url.spec.whatwg.org/) but even with these specifications, many inconsistent implementations can turn things into a security nightmare.

In this post, we'll look at what URLs are and how they can potentially be abused.

## What is a URL

A URL is a combination of several different elements.

Most of the time we'll see something like this:

```bash
https://www.google.com/
```

or

```bash
https://example.com/#Part2
```

The generic definition of a URL looks like this.

```bash
scheme://username:password@host:port/path?query#fragment
```

* **scheme**: The protocol used (`http` or `https`, `mailto` or `ftp` for example)
* **username:password**: When a website uses the Basic authentication scheme, it allows you to authenticate by adding your username and password to the URL itself. This is considered very insecure, so not a lot of websites implement it
* **host**: This is the domain or IP address you want to connect to (`google.com` or `127.0.0.1` for example)
* **port**: The specific port we want to access, think of it as the house or apartment number. If the port is missing (the most common case), the default for the scheme/protocol is used (`80` for http and `443` for https)
* **path**: This is the specific webpage on the host. This post has a path of `what-is-a-url-why-it-matters/index.html`. You can skip the `index.html` portion of the path, this also points to the same resource `what-is-a-url-why-it-matters/`
* **query**: Zero or more parameters, usually in the form of `key=value` pairs joined together by `&`. These are used to send the server additional information
* **fragment**: This usually links to a specific section of the document. Fragments are handled (or ignored) client-side.

This is a URL, so now why is it important to know what it is and how it works?

There are two areas of concern: How bad actors exploit uneven support in URL software libraries and how bad actors exploit misleading URLs.

We'll address these separately

## Uneven URL support

Even though there are multiple specifications of what a URL should do and how it should be parsed. This may allow the creation of misleading URLs that compromise your data.

According to [OWASP](https://owasp.org/):

> SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL. It allows an attacker to coerce the application to send a crafted request to an unexpected destination, even when protected by a firewall, VPN, or another type of network access control list (ACL).
>
> As modern web applications provide end-users with convenient features, fetching a URL becomes a common scenario. As a result, the incidence of SSRF is increasing. Also, the severity of SSRF is becoming higher due to cloud services and the complexity of architectures.
>
> Source: [A10:2021 – Server-Side Request Forgery (SSRF)](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/)

[What Is a URL](https://azeemba.com/posts/what-is-a-url.html) presents several different types of [SSRF](https://owasp.org/Top10/A10_2021-Server-Side_Request_Forgery_%28SSRF%29/) using Python as the demo language.

Why would this matter for web developers and people who work on the web?

What worries me the most is how writing [webhooks](https://www.redhat.com/en/topics/automation/what-is-a-webhook) can lead to CSRF compromises. Since webhooks are becoming more and more prevalent in web development, we need to at least be aware of the basic dangers.

In Go, we've written the code using the [gorilla/mux](https://github.com/gorilla/mux) package to handle routing and create a custom CORS middleware handler.

As it is, the code provides minimal CORS protection but it doesn't consider the payload for the webhook and that makes it vulnerable

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
    "github.com/gorilla/mux"
)

// WebhookData is the JSON payload expected by the webhook
type WebhookData struct {
    Message string `json:"message"`
}

// webhookHandler handles webhook requests
func webhookHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
        return
    }

    // Decode the JSON payload
    var data WebhookData
    err := json.NewDecoder(r.Body).Decode(&data)
    if err != nil {
        http.Error(w, "Bad request", http.StatusBadRequest)
        fmt.Printf("Error decoding JSON: %v\n", err)
        return
    }

    fmt.Printf("Received data: %s\n", data.Message)

    fmt.Fprintln(w, "Webhook received!")
}

// withCORS sets CORS headers
func withCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        if r.Method == http.MethodOptions {
            return
        }
        next.ServeHTTP(w, r)
    })
}

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/webhook", webhookHandler).Methods("POST", "OPTIONS")

    // Apply the CORS middleware
    http.Handle("/", withCORS(r))

    fmt.Println("Starting server on :9090")
    if err := http.ListenAndServe(":9090", nil); err != nil {
        fmt.Printf("Server failed: %s\n", err)
    }
}
\
```

There is also [front-end code](https://github.com/caraya/csrf-demo/blob/main/index.html) that will call the webhook and present the results.

The mitigation requires an additional package, [gorilla/csrf](https://github.com/gorilla/csrf), an additional middleware to handle CSRF, and an additional route to handle the token transfer to the client.

```go
package main

import (
	"log"
	"net/http"

	"github.com/gorilla/csrf"
	"github.com/gorilla/mux"
)

// Middleware to enable CORS
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:8000")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		if r.Method == http.MethodOptions {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	// Your webhook logic here
	w.Write([]byte("Webhook received"))
}

func main() {
	r := mux.NewRouter()

	// CSRF protection middleware
	csrfMiddleware := csrf.Protect(
		[]byte("32-byte-long-auth-key"),
		csrf.Secure(false),
		csrf.Path("/"),
	)

	r.HandleFunc("/webhook", webhookHandler).Methods("POST")

	r.HandleFunc("/token", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte(csrf.Token(r)))
	}).Methods("GET")

	// Apply CORS and CSRF middleware
	handler := enableCORS(csrfMiddleware(r))

	http.Handle("/", handler)
	log.Println("Server started at :9090")
	log.Fatal(http.ListenAndServe(":9090", nil))
}
```

The [front-end code](https://github.com/caraya/csrf-protected/blob/main/index.html) also changes with additions to retrieve the CSRF token from the `token` endpoint and another one to use the token in making the fetch request to the webhook.

Mitigating this type of CSRF attack is not hard but it's not trivial either. Depending on the language you use the mitigations may be built-in, require defensive code to work around the potential pitfalls, or require a third-party library.

## Misleading URLs

Another type of URL attack to consider is a [homographic attack](https://web.archive.org/web/20200102175251/http://www.cs.technion.ac.il/~gabr/papers/homograph_full.pdf), where the attackers craft a URL to trick users into entering their information into a malicious application.

[Emily Stark](https://emilymstark.com/) has studied these issues through the lens of a browser vendor and a security researcher.

In this 2019 presentation, she shows examples of how URLs can be used to trick users, even security professionals, into interacting with bad websites.

<lite-youtube videoid="RPoAc0ScdTM"></lite-youtube>

For example, can you tell the difference between these two URLs?

* [&#1072;pple.com](https://apple.com)
* [apple.com](https://apple.com)

The first one uses a Cyrillic lowercase A (<code>&#1072;</code>) glyph instead of the Latin lowercase `a` we'd normally expect.

This example is harmless since both URLs point to the same, legal, URL. But bad actors may change both the text and the URL to point to their servers instead of where you think you're going.

But it can be simpler and just require a different order for words that you'd expect to see on a website. Can you tell which one of these is the URL for the Google blog?

* [https://google.blog](https://google.blog)
* [https://blog.google](https://blog.google)

This is trickier since both are legal URLs, and you'd likely have to visit both sites to realize that it's the second URL that takes you to the Google blog.

This is a much harder problem to address since this is up to individual users. These malicious URLs are used together with pages that look like real properties like Google, Microsoft or others making it harder to identify if we're accessing a legitimate site or if we're falling for a scam. In the end, it's up to individual users to be aware and discerning... If it sounds too good to be true then it probably is.
