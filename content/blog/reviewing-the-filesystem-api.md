---
title: Reviewing The Filesystem Access API
date: 2024-12-25
baseline: true
tags:
  - Javascript
  - File Handling
---

<baseline-status featureId="file-system-access"></baseline-status>

The [Filesystem Access API](https://developer.chrome.com/docs/capabilities/web-apis/) is a Chromium-only feature that's part of [Project Fugu](https://www.chromium.org/teams/web-capabilities-fugu/). It allows you to work opening and saving files to the local filesystem.

This post will discuss the feature and provide examples of how to open and save individual files.

This example will perform the following tasks

1. Configure the file picker
2. Write a function to open a file from the local file system
3. Write a function to save the open file to disk

Before we start, I'll put the assumptions I make in the code here so you know what you're dealing with.

* This code will only work on Chromium browsers
  * Since I don't work with any other Chromium browser (Brave, Vivaldi, etc) I have no way to know if other Chromium browsers enabled this feature
* Since this is a demo, I did not wrap the code in feature queries. That is left as an exercise for the reader
* We also know for certain that this feature is not available in Firefox and Safari and that it's unlikely they will implement it, so you'll have to work with a [ponyfill or polyfill](https://github.com/use-strict/file-system-access/blob/master/README.md) to make sure the feature works across browsers

## Configuring the File Picker

The `pickerOpts` object provides the configuration for the file picker object.

This configuration provides retrictions on the file types it will open and whether we can open multiple files.

This section also creates a `filehandle` placeholder variable that we'll use in later functions.

```js
const pickerOpts = {
  types: [
    {
      description: "Text Files",
      accept: {
        "text/*": [
          ".md",
          ".txt",
          ".js",
          ".css",
        ],
        "text/html": [
          ".html",
          ".htm",
        ],
        "text/xml": [
          ".xml",
        ],
      }
    },
    {
      description: "Images",
      accept: {
        "image/*": [
          ".png",
          ".gif",
          ".jpeg",
          ".jpg",
          ".webp",
          ".avif",
          ".heif",
        ]
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false
};
```

## Opening a file

The `openFile` function handles opening a local file from the user's computer.

1. Create an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) with no parameters. We'll use `try/catch` for this code
2. Inside the `try` block, run `showOpenFilePicker` with the options we defined earlier and assign the result to the `fileHandle` variable
3. Get the file referenced in the previous step
4. Assign the content of the file to a variable that we can use later
5. In the `catch` block handle any errors
6. Outside the function, create a `click` event listener for the `openButton` button and assign the function as the second parameter.

```js
// 1
async function openFile() {
  try {
    // 2
    const [ fileHandle ] = await window.showOpenFilePicker(pickerOpts);
    // 3
    const file = await fileHandle.getFile();
    // 4
    const contents = await file.text();
  } catch (err) { // 5
    console.error("there was an error: ", err.message);
  }
}

// 6
document
  .getElementById("theButton")
  .addEventListener("click", openFile);
```

## Saving a file

This implementation will save a file already open with the same name. It doesn't provide a way to rename the file.

1. Create an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
2. If there is no value for the `fileHandle` variable then bail, theres's nothing to do
3. Use a `try/catch` block
4. Grab the value of the `fileHandle`
5. Create a writeable stream we'll use to write the content to disk
6. Write the content of the file to disk
7. Close the stream
8. In the `catch` block handle errors
9. Set up a `click` event handler for the `saveButton` button element

```js
// 1
async function saveFile() {
  // 2
  if (!fileHandle) {
    alert("No file opened yet. Please open a file first.");
    return;
  }
  // 3
  try {
    // Get the contents from the textarea
    // 4
    const contents = document.getElementById("content").value;

    // Create a writable stream
    // 5
    const writable = await fileHandle.createWritable();
    // 6
    await writable.write(contents);

    // Close the file
    await writable.close();// 7
    alert("File saved successfully!");
  } catch (err) { // 8
    console.error("Error saving file: ", err.message);
  }
}

// 9
document
  .getElementById("saveButton")
  .addEventListener("click", saveFile);
```

## Saving a file as

The `save as` functionality provides a different way save a file. This function provides a way to save the file under a different name.

It also provides a way to create new files. Since we capture the text from the text area, this function dones't rely on a file being open.

1. Create an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
2. Create a `try/catch` block
3. Create a `saveFilePicker`
4. Set a variable with the content of the `textarea` element as its value
5. Create a writeable stream
6. Write the content we set up in step 4 to the writeable stream
7. Close the writeable stream
8. Update the global handle
9. In the `catch` block handle errors
10. Set up a `click` event listener and attach the `saveAs` function

```js
// 1
async function saveAs() {
  // 2
  try {
    // Show save file picker
    // 3
    const newFileHandle = await window.showSaveFilePicker(pickerOpts);

    // Get the contents from the textarea
    // 4
    const contents = document.getElementById("content").value;

    // Create a writable stream
    // 5
    const writable = await newFileHandle.createWritable();
    // 6
    await writable.write(contents);

    // Close the file
    // 7
    await writable.close();
    alert("File saved successfully!");

    // Update the global file handle
    // 8
    fileHandle = newFileHandle;
  } catch (err) { // 9
    console.error("Error saving file as: ", err.message);
  }
}

// 10
document
  .getElementById("saveAsButton")
  .addEventListener("click", saveAs);
```

These three functions provide the basic functionality of an editor. There are many possibilities to move from here.
