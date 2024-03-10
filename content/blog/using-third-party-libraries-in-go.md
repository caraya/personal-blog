---
title: Using Third-Party Libraries in Go
date: 2024-03-18
tags:
  - Go
---

So far we've covered command-line applications that only use modules in the standard library

This post will explore using third-party modules by building a conversion tool from Markdown to HTML

## Before We Start: Initializing Go Modules

```bash
go mod init github.com/caraya/markdown-converter
```

Then, whenever we want to install a third-party package, we run the following command

```bash
go get <package URL>
```

For example:

```bash
go get github.com/BurntSushi/toml
```

or

```bash
go get go.abhg.dev/goldmark/frontmatter
```

We'll point out what packages to `get` when it's appropriate.

## First Iteration: Building the Conversion Tool

In the first step, I'm trying to understand how to get the Markdown parser to work.

Before we start we need to `get` the Goldmark package.

```bash
go get github.com/yuin/goldmark
```

This will make the package and all its sub-packages available to our code. The import block in the program now looks like this:

```go
import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"unicode/utf8"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
)
```

Configuring Goldmark is fairly easy.

We initialize the Goldmark package with `goldmark.New` and pass as parameters the different configuration blocks we want to use.

* `WithExtensions` lists the extensions that we want to use in the project
  * In this example, it includes the GitHub Flavored Markdown extension
* `WithParserOptions` adds parser options to add functionality
  * In the example, we add the heading ID generation plugin
* `WithRendererOptions` adds rendering options to the process
  * In the example, we tell Goldmark to render the output as XHTML

```go
func main() {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithXHTML(),
		),
	)
```

We store the text we want to convert into a buffer of [bytes](https://pkg.go.dev/bytes) and then use the `Convert` method on the Goldmark instance we created to convert the file.

```go
	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		panic(err)
	}
}
```

## Second iteration: Scanners Everywhere

For the second iteration, we bring in the scanner to ask the user for the name of the file to open and the name of the file to close.

We've also incorporated Goldmark extension modules to handle table of contents, front matter and mermaid as Markdown fenced codeblocks.

```go
import (
	"bufio"
	"bytes"
	"fmt"
	"os"
	"unicode/utf8"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"go.abhg.dev/goldmark/frontmatter"
	"go.abhg.dev/goldmark/mermaid"
	"go.abhg.dev/goldmark/toc"
)
```

The Goldmark configuration takes the new extensions under the `WithExtensions()` block.

Because these are not built-in extensions we pass a pointer to each extension `Extender` Method. Right now we're using their default configurations.

```go
func main() {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.DefinitionList,
			extension.Footnote,
			&toc.Extender{},
			&frontmatter.Extender{},
			&mermaid.Extender{},
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithXHTML(),
		),
	)
```

The biggest change is the introduction of scanners to request input from the user for the file to open and the file to write to.

```go
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Please enter the name of the file to open:")

	var sourceFileName string
	if scanner.Scan() {
		sourceFileName = scanner.Text()
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	}

	// Read the source file specified by the user
	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Println("Cannot read the file:", err)
		os.Exit(1)
	}

	fmt.Println("Please enter the location and file name to write to:")
	if scanner.Scan() {
		targetLocation := scanner.Text()

		// Write the read content to the specified file location
		err = os.WriteFile(targetLocation, []byte(buf.Bytes()), 0644)
		if err != nil {
			fmt.Println("Failed to write to the file:", err)
			os.Exit(1)
		} else {
			fmt.Printf("File successfully written to %s\n", targetLocation)
		}
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	}
	fmt.Println(buf.String())
}
```

Now we have a working converter. But there's a problem.

## Iteration Three: Wrap Around The Template

The conversion process works, but there's a problem: it only converts the content but it doesn't produce a valid HTML document. There are no html, head or body elements.

To work around this problem we'll use a template and insert the content inside the template before saving it.

The template looks like this:

{% raw %}
```html
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
    {{.Content}}
</body>
</html>
```
{% endraw %}

We import the `html/template` module to work with templates.

```go
import (
	"bufio"
	"bytes"
	"fmt"
	"html/template"
	"os"
	"unicode/utf8"

	// Third-part imports"
)
```

Inside the main function, we load the template using [template.ParseFiles](https://pkg.go.dev/text/template#ParseFiles).

We use [template.Execute](https://pkg.go.dev/text/template#Template.Execute) to populate the template with the wrapped content.

The `Execute` method takes two parameters: A pointer to the template content and the expression `map[string]interface{}{"Content": template.HTML(buf.String())}`.

The expression creates a map with string keys and values of any type (using the empty interface: `interface{}`). This map contains a single entry where:

* The key is `"Content"`
* The value is `template.HTML(buf.String())`
  * This part of the expression converts the result of `buf.String()` into template.HTML type
  * `buf` is a buffer containing the converted Markdown text and `buf.String()` converts its content to a string
  * The `template.HTML` type is used in the Go template package to prevent Go from escaping HTML tags in the template

```go
func main() {
	// Load the external template file
	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		panic(err)
	}

	var wrappedContent bytes.Buffer
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{"Content": template.HTML(buf.String())}); err != nil {
		panic(err)
	}

	fmt.Println("Please enter the location and file name to write to:")
	if scanner.Scan() {
		targetLocation := scanner.Text()

		err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
		if err != nil {
			fmt.Println("Failed to write file:", err)
			os.Exit(1)
		} else {
			fmt.Printf("File successfully written to %s\n", targetLocation)
		}
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error writing output: %s", err)
		os.Exit(1)
	}
	fmt.Println(wrappedContent.String())
}
```

Each page is now a well-formed HTML document. We can also add scripts and stylesheets

## Iteration Four: Naming is hard

So far we've provided a name for the file to open and one for the file to save. In this iteration, we will save the file with the same name and a different extension.

For this iteration, we add the following code to `main()`. The code will do the following:

It will point to the starting point for the file extension using the
[LastIndex](https://pkg.go.dev/strings#LastIndex) function of the `Strings` package.

If there's no extension (the LastIndex function returns `-1`) then we return the file name as the file name + `html`.

If there is an extension, we replace it with `.html` and output the new file name.

```go
	extensionIndex := strings.LastIndex(sourceFileName, ".") // 1
	var targetLocation string
	if extensionIndex == -1 { // 2
		targetLocation = sourceFileName + ".html"
	} else {
		targetLocation = sourceFileName[:extensionIndex] + ".html" // 3
	}
```

## Iteration Five: Modularize The Code

Before we continue, we need to make the code cleaner. The `main` function is getting too large and it's becoming hard to walk through the code.

So we break the functionality into discrete functions that we can call from anywhere in the code.

In this iteration, we only cover the new functions along with a brief description

`createMarkdownConverter` initializes and sets up Goldmark.

```go
func createMarkdownConverter() goldmark.Markdown {
	return goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.DefinitionList,
			extension.Footnote,
			&toc.Extender{
				TitleDepth: 2,
			},
			&mermaid.Extender{},
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithXHTML(),
		),
	)
}
```

In `processFile` we will process the front matter content by calling `extractFrontmatterAndContent`

```go
func processFile(sourceFileName, destDir string, md goldmark.Markdown) {

	// Extract frontmatter and content
	frontmatter, content, err := extractFrontmatterAndContent(fileContent)
	if err != nil {
		fmt.Printf("Failed to extract frontmatter: %v", err)
	}

	var data FrontMatterData
	if err := yaml.Unmarshal([]byte(frontmatter), &data); err != nil {
		fmt.Printf("Failed to unmarshal frontmatter: %v", err)
	}

	var buf bytes.Buffer
	if err := md.Convert([]byte(content), &buf); err != nil {
		fmt.Printf("Failed to convert Markdown content: %v\n", err)
		return
	}

	writeHTMLToFile(buf, sourceFileName, destDir, data)
}
```

The `extractFrontmatterAndContent` function will extract the YAML front matter from the top of each document and pass the data to the calling function.

```go
func extractFrontmatterAndContent(fileContent []byte) (frontmatter, content string, err error) {
	const delimiter = "---"
	contentStr := string(fileContent)

	if !strings.HasPrefix(contentStr, delimiter) {
		return "", contentStr, nil
	}

	parts := strings.SplitN(contentStr, delimiter, 3)

	if len(parts) < 3 {
		return "", "", fmt.Errorf("malformed frontmatter: missing end delimiter")
	}

	return strings.TrimSpace(parts[1]), strings.TrimSpace(parts[2]), nil
}
```

`writeHTMLToFile` handles opening, parsing and executing the template and populating it with the metadata and converted Markdown content.

```go
func writeHTMLToFile(buf bytes.Buffer, sourceFileName, destDir string, data interface{}) {
	if err := os.MkdirAll(destDir, 0755); err != nil {
		fmt.Printf("Failed to create the destination directory %s: %v\n", destDir, err)
		return
	}

	filename := filepath.Base(sourceFileName)
	targetLocation := filepath.Join(destDir, strings.TrimSuffix(filename, filepath.Ext(filename))+".html")

	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		fmt.Printf("Failed to parse template: %v\n", err)
		return
	}

	var wrappedContent bytes.Buffer
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{
		"Content":  template.HTML(buf.String()),
		"Metadata": data,
	}); err != nil {
		fmt.Printf("Failed to execute template: %v\n", err)
		return
	}

	err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
	if err != nil {
		fmt.Printf("Failed to write to file %s: %v\n", targetLocation, err)
		return
	}

	fmt.Printf("File successfully written to %s\n", targetLocation)
}
```

## Iteration Six: Give Me More Than One File

Right now, we can only work with one file at a time which can be tedious and you may forget to convert one or more of the files.

This iteration will enable us to enter more than one file in the command line. Now, you can do something like:

```bash
go run main.go demo01.md demo02.md demo03.md
```

This will process all the demo files at one time and produce individual HTML files.

We first check if we provided one or more Markdown files as arguments to the program. If there aren't then we flag the user and exit.

Then we run a for loop, read the individual file and convert it to Markdown.

```go
if len(os.Args) < 2 {
  fmt.Println("Please provide one or more markdown files as arguments.")
  os.Exit(1)
}

for _, sourceFileName := range os.Args[1:] {
  fileContent, err := os.ReadFile(sourceFileName)
  if err != nil {
    fmt.Printf("Cannot read file %s: %v\n", sourceFileName, err)
    continue
  }

  // UTF-8 validation removed

  var buf bytes.Buffer
  if err := md.Convert(fileContent, &buf); err != nil {
    fmt.Printf("Failed to convert file %s: %v\n", sourceFileName, err)
    continue
  }

  // Rest of the code remains the same
}
```

## Iteration Seven: Working With Directories or Files

Rather than opening files individually, this iteration will change the code to give us the option of specifying a directory of files we want to process while keeping the ability to work with individual files.

We check if the third argument (after the program name and the destination directory) is a file or a directory using a for loop and [slice](https://gobyexample.com/slices) manipulation functions.

We run different functions if the parameter is a directory or a file.

```go
import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"

  // import third-party packages
)
```

```go
func main() {

	destDir := os.Args[1]
	md := createMarkdownConverter()

	for _, arg := range os.Args[2:] {
		fi, err := os.Stat(arg)
		if err != nil {
			fmt.Printf("Error accessing %s: %v\n", arg, err)
			continue
		}

		if fi.IsDir() {
			processDirectory(arg, destDir, md)
		} else {
			processFile(arg, destDir, md)
		}
	}
}
```

The `processDirectory` function will continue to walk down the path until there is a file to process (one that ends with either the `.md` or `.markdown` extensions) at which point it will call `processFile` to convert the file to HTML.

```go
func processDirectory(dirPath, destDir string, md goldmark.Markdown) {
	filepath.WalkDir(dirPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			fmt.Printf("Error accessing path %s: %v\n", path, err)
			return err
		}
		if !d.IsDir() && (strings.HasSuffix(d.Name(), ".md") || strings.HasSuffix(d.Name(), ".markdown")) {
			processFile(path, destDir, md)
		}
		return nil
	})
}

func processFile(sourceFileName, destDir string, md goldmark.Markdown) {

	// Rest of the code omitted for brevity

	writeHTMLToFile(buf, sourceFileName, destDir, data)
}
```

## Iteration Eight: Use YAML to populate metadata

All the files have YAML front matter at the beginning of the file. Right now that data is removed and we don't have a title for the document, and we can't use it.

This iteration will read the YAML data and then use it to populate the template.

We first import the YAML package.

```go
package main

import (

	// Built-in package imports removed

	// Other package imports removed
	"gopkg.in/yaml.v2"
)
```

In the next step, we create a function to process the YAML front matter. The process will do the following:

1. Check if there is a prefix `---` that delimits the front matter block
   1. If there isn't one we return the content without the front matter data
2. If there is a prefix then split the front matter block into three sections
   1. the opening delimiter
   2. the content of the front matter block
   3. the closing delimiter
3. Throw an error if there is no closing delimiter
4. Return the components of the front matter to be used elsewhere

```go
func extractFrontmatterAndContent(fileContent []byte) (frontmatter, content string, err error) {
	const delimiter = "---"
	contentStr := string(fileContent)

	if !strings.HasPrefix(contentStr, delimiter) {
		return "", contentStr, nil
	} // 1

	parts := strings.SplitN(contentStr, delimiter, 3) // 2

	if len(parts) < 3 {
		return "", "", fmt.Errorf("malformed frontmatter: missing end delimiter")
	} // 3

	return strings.TrimSpace(parts[1]), strings.TrimSpace(parts[2]), nil // 4
}
```

With this code, we now have a way to add the title and other metadata we choose to place in the YAML front matter.

## The Final Result

After all the iterations, this is what the final code looks like.

We've made changes to the template file to add basic layout and typography styles along with [Prism.js](https://prismjs.com/) scripts and styles.

It also adds commas after the value of all tags but the last one.

I've uploaded the code to a

{% raw %}
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/prism.css">
    <title>{{.Metadata.Title}}</title>
</head>
<body>

  <div class="grid-container">
    <main>
      <header>
        <h1>{{.Metadata.Title}}</h1>
        <p>Created on: {{.Metadata.Date}}</p>
        <p>Filed Under: {{range $index, $tag := .Metadata.Tags}}{{if $index}}, {{end}}<span>{{$tag}}</span>{{end}}</p>
      </header>
      {{.Content}}
    </main>
  </div>

  <script src="js/prism.js"></script>
</body>
</html>
```
{% endraw %}

The generator code consolidates all the prior iterations and will produce well-formed, valid HTML documents.

I've packaged the program and its associated files in a Github repository [https://github.com/caraya/markdown-converter](https://github.com/caraya/markdown-converter) so you can see it in action.

```go
package main

import (
	"bytes"
	"fmt"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"go.abhg.dev/goldmark/mermaid"
	"go.abhg.dev/goldmark/toc"
	"gopkg.in/yaml.v2"
)

type FrontMatterData struct {
	Title string   `yaml:"title"`
	Date  string   `yaml:"date"`
	Tags  []string `yaml:"tags"`
}

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Usage: <program> <destination-directory> <markdown-file-or-directory>...")
		os.Exit(1)
	}

	destDir := os.Args[1]
	md := createMarkdownConverter()

	for _, arg := range os.Args[2:] {
		fi, err := os.Stat(arg)
		if err != nil {
			fmt.Printf("Error accessing %s: %v\n", arg, err)
			continue
		}

		if fi.IsDir() {
			processDirectory(arg, destDir, md)
		} else {
			processFile(arg, destDir, md)
		}
	}
}


func createMarkdownConverter() goldmark.Markdown {
	return goldmark.New(
		goldmark.WithExtensions(
			extension.GFM,
			extension.DefinitionList,
			extension.Footnote,
			&toc.Extender{
				TitleDepth: 2,
			},
			&mermaid.Extender{},
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithXHTML(),
			html.WithUnsafe(),
		),
	)
}

func processFile(sourceFileName, destDir string, md goldmark.Markdown) {
	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Printf("Cannot read file %s: %v\n", sourceFileName, err)
		return
	}

	if !utf8.Valid(fileContent) {
		fmt.Printf("File %s is not a valid UTF-8 text file\n", sourceFileName)
		return
	}

	frontmatter, content, err := extractFrontmatterAndContent(fileContent)
	if err != nil {
		fmt.Printf("Failed to extract frontmatter: %v", err)
	}

	var data FrontMatterData
	if err := yaml.Unmarshal([]byte(frontmatter), &data); err != nil {
		fmt.Printf("Failed to unmarshal frontmatter: %v", err)
	}

	var buf bytes.Buffer
	if err := md.Convert([]byte(content), &buf); err != nil {
		fmt.Printf("Failed to convert Markdown content: %v\n", err)
		return
	}

	writeHTMLToFile(buf, sourceFileName, destDir, data)
}

func processDirectory(dirPath, destDir string, md goldmark.Markdown) {
	filepath.WalkDir(dirPath, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			fmt.Printf("Error accessing path %s: %v\n", path, err)
			return err
		}
		if !d.IsDir() && (strings.HasSuffix(d.Name(), ".md") || strings.HasSuffix(d.Name(), ".markdown")) {
			processFile(path, destDir, md)
		}
		return nil
	})
}

func extractFrontmatterAndContent(fileContent []byte) (frontmatter, content string, err error) {
	const delimiter = "---"
	contentStr := string(fileContent)

	if !strings.HasPrefix(contentStr, delimiter) {
		return "", contentStr, nil
	}

	parts := strings.SplitN(contentStr, delimiter, 3)

	if len(parts) < 3 {
		return "", "", fmt.Errorf("malformed frontmatter: missing end delimiter")
	}

	return strings.TrimSpace(parts[1]), strings.TrimSpace(parts[2]), nil
}

func writeHTMLToFile(buf bytes.Buffer, sourceFileName, destDir string, data interface{}) {
	if err := os.MkdirAll(destDir, 0755); err != nil {
		fmt.Printf("Failed to create the destination directory %s: %v\n", destDir, err)
		return
	}

	filename := filepath.Base(sourceFileName)
	targetLocation := filepath.Join(destDir, strings.TrimSuffix(filename, filepath.Ext(filename))+".html")

	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		fmt.Printf("Failed to parse template: %v\n", err)
		return
	}

	var wrappedContent bytes.Buffer
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{
		"Content":  template.HTML(buf.String()),
		"Metadata": data, // Pass the frontmatter data here
	}); err != nil {
		fmt.Printf("Failed to execute template: %v\n", err)
		return
	}

	err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
	if err != nil {
		fmt.Printf("Failed to write to file %s: %v\n", targetLocation, err)
		return
	}

	fmt.Printf("File successfully written to %s\n", targetLocation)
}
```
