---
title: Opening and Writing Files With Go
date: 2024-02-13
tags:
  - Go
  - CLI Apps
---

In the last post, we looked at how to build an API server using Go.

In this post, we'll look at one part of building command line applications: how to open and write files.

We'll also cover related areas like reading input from the command line and how to get user input and act on that input.

In the next post, we'll look at how to use third-party libraries in Go programs by building a Markdown conversion tool.

## The first iteration: the basics

The first attempt is very simple. It does the following:

1. Opens a specific file that has been hardcoded into the program
   1. In the next iteration, we'll change the code so it'll take
2. Writes the file to a specific location, also hardcodes on the program
   1. When we write the file we also specify a Unix permission number that will dictate what different users can do with the file
3. Prints the content of the file to the terminal
   1. When printing the content of the file to the terminal, we cast data to a string, otherwise, it will print numeric values for each byte (representing each character) in the file

There is no error checking beyond the basic success checks. For example: We don't check if the file we want to open is a text file or not.

```go
package main

import (
	"fmt"
	"os"
)

func main() {
	data, err := os.ReadFile("creating-the-backend-for-a-web-app-in-go.md") // 1
	if err != nil {
		fmt.Println(err)
	}

	mydata := []byte(data)

	err = os.WriteFile("myfile.md", mydata, 0777) // 2

	if err != nil {
		fmt.Println(err)
	}

	fmt.Println(string(data)) // 3
}
```

## The second, less naive, iteration

The second version only modifies the read method and introduces a few changes.

1. It validates that we pass 2 arguments to the `go` command, the name of the program and the name of the file we want to open
   1. The program now expects the file name to be given in the command line
2. It opens the specified file and throws an error if it can't be found
3. It validates that the file we opened is a valid UTF-8-encoded text file

First, the program checks if we passed the correct number of arguments and throws an error if the user doesn't provide a file name.

It reads the file at the location provided and returns an error if the file can't be read.

Using the [unicode/utf8](https://pkg.go.dev/unicode/utf8) package to validate that the file is encoded in UTF-8, meaning it's a text file.

Finally, we print the content of the file to the terminal.

```go
if len(os.Args) < 1 {
	fmt.Println("Usage : " + os.Args[0] + " file name")
	os.Exit(1)
} // 1

file, err := os.ReadFile(os.Args[1])
if err != nil {
	fmt.Println("Cannot read the file")
	os.Exit(1)
} // 2

if !utf8.ValidString(string(file)) {
	fmt.Println("File is not a text file")
	os.Exit(1)
}// 3

fmt.Print(string(file))
```

We're still not quite there. The code depends on the user entering the file that they want to work with and the destination where we write the file is also hardcoded.

## Third Time's The Charm: Third Iteration

The third iteration makes one fundamental change: It uses a scanner to request user input for the source and destination file names.

We use the [bufio/Scanner](https://pkg.go.dev/bufio#Scanner) package to capture user input for the file name to open.

We validate that the file the user wants to open is a valid UTF-8 text file.

We use the same Scanner to ask the user for the name of the file to save to and save the file, throwing an error if we're unable to.

```go
func main() {
	scanner := bufio.NewScanner(os.Stdin)
	fmt.Println("Please enter the name of the file to open:")

	var sourceFileName string
	if scanner.Scan() {
		sourceFileName = scanner.Text()
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	} // 1

	fileContent, err := os.ReadFile(sourceFileName)
	if err != nil {
		fmt.Println("Cannot read the file:", err)
		os.Exit(1)
	} // 2

	if !utf8.ValidString(string(fileContent)) {
		fmt.Println("File is not a valid UTF-8 text file")
		os.Exit(1)
	} // 3

	fmt.Println("Please enter the location and file name to write to:")
	if scanner.Scan() {
		targetLocation := scanner.Text()

		err = os.WriteFile(targetLocation, fileContent, 0644)
		if err != nil {
			fmt.Println("Failed to write to the file:", err)
			os.Exit(1)
		} else {
			fmt.Printf("File successfully written to %s\n", targetLocation)
		}
	} else if err := scanner.Err(); err != nil {
		fmt.Fprintf(os.Stderr, "error reading input: %s", err)
		os.Exit(1)
	} //4
}
```

It's a good iteration and I'm happy with it but it can still be improved.

We can make the scanner more forgiving and not throw an error if the file name is empty or can't be found, and let the user try again.

This is an empty project. There is nothing between the open and write portions of the code. That's by design since this is likely to be the starter for other projects I want to work on.
