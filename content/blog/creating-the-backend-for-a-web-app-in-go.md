---
title: "Creating the Backend for a Web App in Go"
date: 2024-06-30
tags:
  - Go
  - Backend
draft: true
---

I've always struggled with how to bring languages like Go and Rust into my web development work.

Tooling is the easiest way to go. There is a reason why most new web development tooling is written in Rust. But I've been determined to work with Go instead.

For these exercises, I will create an API server using Go's built-in HTTP router module, something similar to what you can do with [Express](https://expressjs.com/) in Node.js. I also chose to work with the [net/http](https://pkg.go.dev/net/http) module, part of Go's standard library, rather than a third-party module like [Gorilla Mux](https://pkg.go.dev/github.com/gorilla/mux)

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "got index page\n")
	})

	mux.HandleFunc("GET /tasks/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "Will list all tasks\n")
	})

	mux.HandleFunc("GET /tasks/{id}/", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		fmt.Fprintf(w, "Will list task with id=%v\n", id)
	})

	http.ListenAndServe("localhost:2509", mux)
}
```

<https://pkg.go.dev/net/http>

<https://go.dev/blog/routing-enhancements>
