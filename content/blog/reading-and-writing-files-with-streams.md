---
title: Reading and Writing Files With Streams
date: 2025-01-01
tags:
  - Javascript
  - Streams
  - Reference
---

For the most part opening and reading files synchronously in the browser is not a big deal since the files are seldom large enough to cause any performance issues and reading from the local file system is faster than downloading from the web or external resources.

When working in certain types of applications it may be better to work with streams since we can't know how large the files users will upload to the application are and that may block the main thread can cause perceived performance issues.

This post will revisit the file system access API code from a previous post use streams to read and write from and to the file system.

## Getting Ready

Before we write the code we need to initialize the file handle variable to the empty value.

```js
let fileHandle;
```

We also need to set up the HTML elements that will be used to interact with the file system.

```html
<button id="openButton">Open</button>
<button id="saveButton">Save</button>
<button id="saveAsButton">Save As</button>

<textarea id="content"></textarea>
```

The IDs for these elements will be referenced in the Javascript code.

## Read/Open File

We will use the openFile function to open a file, read its contents and display the content in the `textarea` element. The function will:

1. Open the file picker and get the file handle
2. Get a readable stream for the file
3. Use a reader to read the stream
4. Use a [do...while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while) loop to read the stream in chunks as long as the stream is not done
   1. We could also use a [while](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while) loop to read the stream, but that would require us to set the `done` variable to `false` before the loop starts, the `do...while` loop will run at least once, regardless of the value of `done`
5. Display the file contents in the textarea
6. Catch any errors that occur during the process

The main difference in this function is that we explicitly use streams to read the file contents.

```js
async function openFile() {
  try {
    // 1
		// Open file picker and get file handle
    [fileHandle] = await window.showOpenFilePicker(pickerOpts);

    // 2
		// Get a readable stream for the file
    const file = await fileHandle.getFile();
    const readableStream = file.stream();

    // 3
		// Use a reader to read the stream
    const reader = readableStream.getReader();
    let contents = '';
    let done, value;

		// 4
		// Loop through the chunks of the
		// stream and add them to the
		// `contents` variable
    do {
      ({ done, value } = await reader.read());
      if (value) {
        contents += new TextDecoder().decode(value);
      }
    } while (!done);

    // 5
		// Display the file contents in the textarea
    document.getElementById("content").value = contents;
  } catch (err) { // 6
    console.error("Error opening file: ", err.message);
  }
}
```

## Write/Save File: Save

The `saveFile` function will save the contents of the textarea to the the same file that was opened witht the `openFile` function.

The function will:

1. Check if a file has been opened and bail out and throw and alert if no file has been opened
2. Inside a `try` block
3. Get the contents from the textarea and assign it to the `contents` variable
4. Create a writable stream
5. Write the contents to file
6. Close the writer
7. Catch any errors that occur during the process in the `catch` block

```js
async function saveFile() {
	// 1
  if (!fileHandle) {
    alert("No file opened yet. Please open a file first.");
    return;
  }
  try { // 2 try block
    // 3
		// Get the contents from the textarea
    const contents = document.getElementById("content").value;

    // 4
		// Create a writable stream
    const writable = await fileHandle.createWritable();
    const writer = writable.getWriter();

    // 5
		// Write the contents in chunks
    const encoder = new TextEncoder();
    const encodedContents = encoder.encode(contents);
    await writer.write(encodedContents);

    // 6
		// Close the writer
    await writer.close();
    alert("File saved successfully!");
  } catch (err) { // 7
    console.error("Error saving file: ", err.message);
  }
}
```

## Write/Save File: Save As

The `saveAs` function will save the contents of the textarea to a file. The difference from the `saveFile` function is that `saveAs` will give you the option to change the name of the file you save to.

The function will:

1. Show the save file picker
2. Get the contents from the textarea and assign it to the `contents` variable
3. Create a writable stream and a writer for the writable stream
4. Write the contents to the file
5. Close the writer
6. Update the global file handle
7. Catch any errors that occur during the process

```js
async function saveAs() {
  try {
    // 1
		// Show save file picker
    const newFileHandle = await window.showSaveFilePicker(pickerOpts);

    // 2
		// Get the contents from the textarea
    const contents = document.getElementById("content").value;

    // 3
		// Create a writable stream
    const writable = await newFileHandle.createWritable();
    const writer = writable.getWriter();

    // 4
		// Write the contents in chunks
    const encoder = new TextEncoder();
    const encodedContents = encoder.encode(contents);
    await writer.write(encodedContents);

    // 5
		// Close the writer
    await writer.close();
    alert("File saved successfully!");

    // 6
		// Update the global file handle
    fileHandle = newFileHandle;
  } catch (err) { // 7
    console.error("Error saving file as: ", err.message);
  }
}
```

## Tyding up: Adding event listeners

The last remaining task is to attach click event listeners to the appropriate buttons.

```js
document
  .getElementById("openButton")
  .addEventListener("click", openFile);

document
  .getElementById("saveButton")
  .addEventListener("click", saveFile);

document
  .getElementById("saveAsButton")
  .addEventListener("click", saveAs);
```
