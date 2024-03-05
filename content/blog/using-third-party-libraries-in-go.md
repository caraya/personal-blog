---
title: Using Third-Party Libraries in Go
date: 2024-02-13
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

## First Iteration: Building the Conversion Tool (***main-v1.go***)

In the first step, I'm trying to understand how to get the Markdown parser to work.

Before we start we need to `get` the Goldmark package.

```bash
go get github.com/yuin/goldmark
```

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

	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		panic(err)
	}
}
```

## Second iteration (***main-v2.go***)

```go
package main

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

	// Create a new scanner to read input from standard input for the source file name
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

	// Check if the file content is valid UTF-8 encoded text
	if !utf8.ValidString(string(fileContent)) {
		fmt.Println("File is not a valid UTF-8 text file")
		os.Exit(1)
	}

	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		panic(err)
	}

	// Ask the user for the location to write the file to
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

## Iteration three

```go
package main

import (
	"bufio"
	"bytes"
	"fmt"
	"html/template"
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

	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Please enter the name of the file to open:")

	var sourceFileName string
	if scanner.Scan() {
		sourceFileName = scanner.Text()
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	}

	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Println("Cannot read the file:", err)
		os.Exit(1)
	}

	if !utf8.ValidString(string(fileContent)) {
		fmt.Println("File is not a valid UTF-8 text file")
		os.Exit(1)
	}

	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		panic(err)
	}

	// Load the external template file
	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		panic(err)
	}

	// Prevent HTML content from being escaped
	var wrappedContent bytes.Buffer
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{"Content": template.HTML(buf.String())}); err != nil {
		panic(err)
	}

	fmt.Println("Please enter the location and file name to write to:")
	if scanner.Scan() {
		targetLocation := scanner.Text()

		err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
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
	fmt.Println(wrappedContent.String())
}
```

## Iteration four

```go
package main

import (
	"bufio"
	"bytes"
	"fmt"
	"html/template"
	"os"
	"strings"
	"unicode/utf8"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"go.abhg.dev/goldmark/frontmatter"
	"go.abhg.dev/goldmark/mermaid"
	"go.abhg.dev/goldmark/toc"
)

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

	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Please enter the name of the file to open:")

	var sourceFileName string
	if scanner.Scan() {
		sourceFileName = scanner.Text()
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	}

	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Println("Cannot read the file:", err)
		os.Exit(1)
	}

	if !utf8.ValidString(string(fileContent)) {
		fmt.Println("File is not a valid UTF-8 text file")
		os.Exit(1)
	}

	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		panic(err)
	}

	// Load the external template file
	tmpl, err := template.ParseFiles("templates/template.html")
	if err != nil {
		panic(err)
	}

	// Prevent HTML content from being escaped
	var wrappedContent bytes.Buffer
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{"Content": template.HTML(buf.String())}); err != nil {
		panic(err)
	}

	// Automatically generate the target file name based on the source file name, replacing its extension with `.html`.
	extensionIndex := strings.LastIndex(sourceFileName, ".")
	var targetLocation string
	if extensionIndex == -1 { // No extension found
		targetLocation = sourceFileName + ".html"
	} else {
		targetLocation = sourceFileName[:extensionIndex] + ".html"
	}

	// Write the output to the targetLocation
	err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
	if err != nil {
		fmt.Println("Failed to write to the file:", err)
		os.Exit(1)
	} else {
		fmt.Printf("File successfully written to %s\n", targetLocation)
	}

	// Optionally print the HTML content to standard output
	fmt.Println(wrappedContent.String())
}
```

## Iteration five

```go
package main

import (
	"bytes"
	"fmt"
	"html/template"
	"os"
	"strings"
	"unicode/utf8"

	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/extension"
	"github.com/yuin/goldmark/parser"
	"github.com/yuin/goldmark/renderer/html"
	"go.abhg.dev/goldmark/mermaid"
	"go.abhg.dev/goldmark/toc"
)

func main() {
	md := goldmark.New(
		goldmark.WithExtensions(
			extension.GFM, // GitHub Flavored Markdown
			extension.DefinitionList,
			extension.Footnote,
			&toc.Extender{},
			&mermaid.Extender{},
			// Note: Not using &frontmatter.Extender{} here as we want to ignore YAML front matter
		),
		goldmark.WithParserOptions(
			parser.WithAutoHeadingID(),
		),
		goldmark.WithRendererOptions(
			html.WithXHTML(),
		),
	)

	if len(os.Args) < 2 {
		fmt.Println("Please provide one or more markdown files as arguments.")
		os.Exit(1)
	}

	// Loop through all provided file paths (skipping the first argument, which is the program name)
	for _, sourceFileName := range os.Args[1:] {
		fileContent, err := os.ReadFile(sourceFileName)
		if err != nil {
			fmt.Printf("Cannot read file %s: %v\n", sourceFileName, err)
			continue // Skip to the next file
		}

		if !utf8.ValidString(string(fileContent)) {
			fmt.Printf("File %s is not a valid UTF-8 text file\n", sourceFileName)
			continue // Skip to the next file
		}

		var buf bytes.Buffer
		if err := md.Convert(fileContent, &buf); err != nil {
			fmt.Printf("Failed to convert file %s: %v\n", sourceFileName, err)
			continue // Skip to the next file
		}

		// Load the external template file
		tmpl, err := template.ParseFiles("templates/template.html")
		if err != nil {
			panic(err)
		}

		// Prevent HTML content from being escaped
		var wrappedContent bytes.Buffer
		if err := tmpl.Execute(&wrappedContent, map[string]interface{}{"Content": template.HTML(buf.String())}); err != nil {
			panic(err)
		}

		// Generate the output file name
		extensionIndex := strings.LastIndex(sourceFileName, ".")
		var targetLocation string
		if extensionIndex == -1 {
			targetLocation = sourceFileName + ".html"
		} else {
			targetLocation = sourceFileName[:extensionIndex] + ".html"
		}

		// Write the output to the target location
		err = os.WriteFile(targetLocation, wrappedContent.Bytes(), 0644)
		if err != nil {
			fmt.Printf("Failed to write to file %s: %v\n", targetLocation, err)
			continue // Skip to the next file
		}

		fmt.Printf("File successfully written to %s\n", targetLocation)
	}
}
```

## Iteration six

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
)

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
			&toc.Extender{},
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

func processFile(sourceFileName, destDir string, md goldmark.Markdown) {
	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Printf("Cannot read file %s: %v\n", sourceFileName, err)
		return
	}

	if !utf8.ValidString(string(fileContent)) {
		fmt.Printf("File %s is not a valid UTF-8 text file\n", sourceFileName)
		return
	}

	var buf bytes.Buffer
	if err := md.Convert(fileContent, &buf); err != nil {
		fmt.Printf("Failed to convert file %s: %v\n", sourceFileName, err)
		return
	}

	writeHTMLToFile(buf, sourceFileName, destDir)
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

func writeHTMLToFile(buf bytes.Buffer, sourceFileName, destDir string) {
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
	if err := tmpl.Execute(&wrappedContent, map[string]interface{}{"Content": template.HTML(buf.String())}); err != nil {
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
