---
title: Compiling Go Programs
date: 2024-03-20
tags:
  - Go
---

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

These commands will build `main.go` into the specified binary or main if there is no name specified.

**Note that these commands will generate binaries that will **only run **on** the OS** they were compiled on. If you compile this in macOS, the binary will not work on Windows or Linux systems.**

You can create binaries that will run on other operating systems but you have to be deliberate about it using a combination of the `GOOS` and `GOARCH` environmental variables.

For example, to use macOS to compile a Linux binary, run the following command:

```bash
env GOOS=linux GOARCH=386 go build -o <linux_binary_name>
```

You can also generate WASM binaries:

```bash
env GOOS=js GOARCH=wasm go build -o <wasm_binary_name>
```

## Running the program

You can then run the binary we just compiled run:

```bash
./<binary_name> <output_directory> <input_directory_or_file>
```
