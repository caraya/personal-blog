---
title: "Creating the Backend for a Web App in Go"
date: 2024-03-11
tags:
  - Go
  - Backend
---

I've always struggled with how to bring languages like Go and Rust into my web development work.

Tooling is the easiest way to go. There is a reason why most new web development tooling is written in Rust. But I've been determined to work with Go instead.

For these exercises, I will create an API server using Go's built-in HTTP router module, something similar to what you can do with [Express](https://expressjs.com/) in Node.js. I chose to work with the [net/http](https://pkg.go.dev/net/http) module, part of Go's standard library, rather than a third-party module like [Gorilla Mux](https://pkg.go.dev/github.com/gorilla/mux). We may also look at the [text/template](https://pkg.go.dev/text/template) and [encoding/json](https://pkg.go.dev/encoding/json)

## The basics

At the most basic, the package will include three routes: an index route, a route to match all tasks and a route to grab specific tasks by ID.

We use the package `main` as the root of our application. In more complex setups we'd likely break the app into separate modules

We import all the modules we want to use and only the ones used in the code. Unlike Javascript, the Go compiler will throw an error if we import modules but don't use them.

Inside the main function we do the following:

We initialize the muxer using the declaration + assignment statement (`:=`)

We declare each route using the Muxer's `handleFunc` function. It takes two parameters, the HTTP verb and the path as the first parameter, and an anonymous function as the second. This function has the code that will do the work for the router.

```go
package main //1

import ( //2
	"fmt"
	"net/http"
)

func main() {
	mux := http.NewServeMux() //3

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "got index page\n")
	}) //4

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

To run the code, just type `go run main.go` on your terminal and then in a web browser enter `http://localhost:2509` on the address bar. This will print `got index page` on the browser window.

## The second iteration... extract JSON from a remote file

The next iteration will try to do two things:

1. Open a JSON file from a remote source
2. Parse the JSON file and display it to the user

For this example, we're keeping the function inside the route handler for convenience. In longer projects, I would likely move the function outside the handler for readability and reusability.

The first block retrieves the JSON from a GitHub repository.

It uses several Go idioms:

It does variable definition and assignment using the string `:=`.

It uses the error detection mechanism. If the value of the error variable is not `nil` or empty, we throw an error. You will see this several times throughout the code.

We use [defer](https://www.tutorialspoint.com/defer-keyword-in-golang) keyword to keep the JSON file available for further processing.

```go
mux.HandleFunc("GET /projects/", func(w http.ResponseWriter, r *http.Request) {

  url := "https://raw.githubusercontent.com/caraya/mavodata/master/data/portfolio.json"
  response, err := http.Get(url)

  if err != nil {
    fmt.Println(err)
    return
  }

  defer response.Body.Close()
```

With this code in place, we have the JSON we want to work with. Now we need to do something with it.

Next, we read the JSON from the file using the [ReadAll](https://pkg.go.dev/io#ReadAll) method from the IO package.

If there is an error, then we return an [http/error](https://pkg.go.dev/net/http#Error) along with the HTTP status code as a string. The error strings and their equivalent numerical values live on [this page](https://go.dev/src/net/http/status.go)

```go
  // Read response body
  body, err := io.ReadAll(response.Body)
  if err != nil {
    http.Error(w, "Failed to read response body", http.StatusInternalServerError)
    return
  }
```

Now comes the JSON processing portion. This is what took me the longest to figure out and understand the code.

We first define `jsonData` as an [empty interface](https://go.dev/tour/methods/14) since we don't know the shape of the JSON we're consuming.

The next step is to use [json/Unmarshal](https://pkg.go.dev/encoding/json#Unmarshal) to parse the JSON and store it in the `jsonData` variable. If there is an error we push an HTTP error, along with the HTTP status message as a string.

We write the `Content-Type` header to the stream.

Finally, we encode the unmarshaled JSON and write it to the stream the browser will consume.

```go
  var jsonData interface{}
  if err := json.Unmarshal(body, &jsonData); err != nil {
    http.Error(w, "Failed to parse JSON", http.StatusInternalServerError)
    return
  }

  // Respond to the client with JSON
  w.Header().Set("Content-Type", "application/json")

  if err := json.NewEncoder(w).Encode(jsonData); err != nil {
    http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
    return
  }
})
```

This is enough for an API server to return the full collection of items. A future exercise will figure out how to extract individual items using different criteria.

## The third iteration: Templates

This is the most tedious and time-consuming part of the project, It takes a lot to get Go templates working right but we get HTML templates for free...

The first step is to create the HTML template that will wrap the dynamic data. The full syntax for both text/template and html/template is discussed in the [text/template](https://pkg.go.dev/text/template) documentation.

For this demo, we're keeping it simple. Just list the project name and the description. For a production application, we can tidy up the HTML and produce a fuller HTML file.

{% raw %}
```html
<!DOCTYPE html>
<html>
<head>
    <title>Projects Portfolio</title>
</head>
<body>
    <h1>Projects</h1>
    <ul>
        {{range .}}
        <li>{{.Name}} - {{.Description}}</li>
        {{end}}
    </ul>
</body>
</html>
```
{% endraw %}

The next step is to create the Go [structs](https://www.digitalocean.com/community/tutorials/defining-structs-in-go) matching the structure of the JSON we want to load.

The struct we create must fully match the JSON we get, even if we don't plan to use all the fields. That's why we have two structs.

The first one will match the outermost element of the JSON file, `collection` and consist of an array of `Project` objects.

The `Project` struct contains the components of the JSON object. Whether you use them or not **you must include all the elements of the JSON objects in the struct**, otherwise the compiler will throw an error.

For this example, we only used the name and description fields.

```go
// Wrapper struct to match the root JSON structure
type ProjectsWrapper struct {
	Collection []Project `json:"collection"`
}

type Project struct {
	Name        string `json:"name"`
	Type        string `json:"type"`
	Status      string `json:"status"`
	Notes       string `json:"notes"`
	Description string `json:"description"`
	DateEnded   string `json:"Date Ended,omitempty"`
	DateStarted string `json:"Date Started,omitempty"`
	CodeURL     string `json:"Code URL,omitempty"`
	OtherURL    string `json:"Other URL,omitempty"`
	WriteupURL  string `json:"Writeup URL,omitempty"`
}
```

The `displayProjects` function gets additional functionality to handle template generation.

In this section, we've trimmed the JSON fetching, reading, unmarshalling and encoding sections that were covered earlier in the post to concentrate on the template-related functionality.

First, we read the template file using [template.ParseFiles](https://pkg.go.dev/html/template#ParseFiles) with the path to the template file on the file system as a parameter.

We then execute the template with [template.Execute](https://pkg.go.dev/html/template#Template.Execute). Execute takes a write and the processed JSON data as parameters.

If either function throws an error we return an HTTP error and set the status code to `StatusInternalServerError` (500) so that the browser knows the type of error it was.

```go
func displayProjects(w http.ResponseWriter, r *http.Request) {

	// code to fetch and read and unmarshal
	// the JSON remains unchanged

	// Parse the HTML template
	tmpl, err := template.ParseFiles("templates/projects.tmpl")
	if err != nil {
		http.Error(w, "Failed to parse template", http.StatusInternalServerError)
		return
	}

	// Execute the template, passing in the projects data
	err = tmpl.Execute(w, wrapper.Collection)
	if err != nil {
		http.Error(w, "Failed to execute template", http.StatusInternalServerError)
		return
	}
}
```

## Compiling the code and related considerations

Since this is a compiled language we have to compile the binary for the target OS that we want to run the code on.

For example, if we want to run the binary on a Linux system

```bash
env GOOS=linux GOARCH=386 go build main.go
```

You will also have to find a provider that supports running Go binaries.

## Final Notes

Coming from Javascript Go is not an easy language to reason through but I like the tradeoffs that it forces on you as you write your code.

Each discrete section performs one task only and does it well before handing the data to further processing.

I had to do a lot of checking the Go tutorials and package descriptions to figure out how to do specific things and a lot of the code outside the

## Links and resources

* [HTTP Package](https://pkg.go.dev/net/http)
* [Routing Enhancements](https://go.dev/blog/routing-enhancements)
* [URL path parameters in routes](https://www.willem.dev/articles/url-path-parameters-in-routes/)
