---
title: Compiling Go Programs
date: 2024-03-20
tags:
  - Go
---

In all previous Go-related posts, we've just run the code using Go's `run` command, like so:

```bash
go run main.go <parameters>
```

But there are times when we must compile the program either for internal use or to share with third parties.

This post will describe how to run programs without compiling them, how to compile programs in Go, how to give them a name, how to cross-compile to support multiple platforms, and how to run the resulting binaries.

## Running the code

To run the code execute the following command on the root directory of the project

```bash
go run main.go <target_directory> <source_directory or file>
```

## Compiling the code

To create a binary for the application run the following command.

```bash
go build
```

If you want to specify a name for the binary run this command instead.

```bash
go build -o <binary_name>
```

These commands will build `main.go` into the specified binary or `main` if there is no name specified.

## Cross-Compilation

The build commands we've used so far will generate binaries that will **only run on the OS they were compiled on**. If you compile this in macOS, the binary will not work on Windows or Linux systems.

You can create binaries that will run on other operating systems, this is called cross-compiling, but you have to be deliberate about it using a combination of the `GOOS` and `GOARCH` environmental variables.

For example, to use macOS to compile a Linux binary, run the following command:

```bash
env GOOS=linux GOARCH=amd64 go build -o <linux_binary_name>
```

You can also generate WASM binaries that will run on the browser:

```bash
env GOOS=js GOARCH=wasm go build -o <wasm_binary_name>
```

For more information on WASM and Go, see [Revisiting Webassembly With Go](https://publishing-project.rivendellweb.net/revisiting-webassembly-with-go).

To see all the OS/Architecture combinations available for cross-compilation run the following command.

```bash
go tool dist list
```

## Scripting The Compilation Process

We're running the compilation on an Intel macOS machine so running the build command on its own will generate a `darwin/amd64` binary by default.

That means that we need to look at the following additional compilation targets, listed with `GOOS` and `GOARCH` values:

| GOOS | GOARCH | Notes |
| :---: | :---: | --- |
| darwin | arm64 | ARM Mac |
| linux | amd64 | Linux 64 Bit |
| linux | arm | Linux ARM |
| linux | arm64 | Linux ARM64 |
| windows | amd64 | Windows 64 Bit |
| windows | arm | Windows ARM |
| windows | arm64 | Windows ARM64 |

I created the following Bash script to automate all compilations for the project.

It first will compile the macOS versions of the program; one for Intel and one for ARM.

Then, for Linux and Windows, we run a [for loop](https://linuxize.com/post/bash-for-loop/) to compile binaries for all GOOS/GOARCH combinations.

```bash
#! /usr/bin/env bash

# Architectures we want to target
archs=(amd64 arm arm64)

echo "Starting Compilation"

echo "Compiling macOS binaries"
go build -o mdconverter_mac-amd64
echo "Compiled binary from mac/amd64"
env GOOS=darwin GOARCH=arm64 go build -o mdconverter_mac-arm64
echo "Compiled binary from mac/arm64"

echo "Compiling Linux binaries"
for arch in ${archs[@]}
do
	env GOOS=linux GOARCH=${arch} go build -o mdconverter_lin_${arch}
	echo "Compiled linux/${arch}"
done

echo "Compiling Windows binaries"
for arch in ${archs[@]}
do
	env GOOS=windows GOARCH=${arch} go build -o mdconverter_win_${arch}
	echo "Compiled windows/${arch}"
done
```

## Running the program

In Linux and macOS you need to make the binary executable by running this command:

```bash
chmod +x <binary_name>
```

You can then run the binary we just compiled run:

```bash
./<binary_name> <output_directory> <input_directory_or_file>
```
