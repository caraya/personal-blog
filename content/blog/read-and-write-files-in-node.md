---
title: "Read and Write Files in Node"
date: "2023-04-26"
---

Reading, writing, and appending to files in Node is not trivial and has at least three different ways to perform each task: callback, sync callback, and promises.

We will look at each of these methods for both reading and writing files to disk.

To make things easier we use async/await in our promise-based code. This means that we limit our support to Node 14 (end of life scheduled for April 2023), Node 16 (end of life is scheduled for September 2023), and Node 18 (the current release) this is less of a concern for me than it used to be.

See the [Node.js Release Schedule](https://github.com/nodejs/release#release-schedule).

Which method you use will depend on how are you choosing to import modules into the project.

These are Node methods to read and write files. We will discuss Opening and Saving files in a separate post.

## Reading Files

Reading files gives us the ability to work with user-created input that is not part of the application we're running.

### Reading files: Async function with callbacks

The oldest way, and the one you're most likely to see in examples, is the asynchronous, callback-based call.

The `readFile` method takes three arguments

1. The path to the file we want to read
2. The encoding that we want to use
3. A function that will execute and return an error or log the data to the console

```js
const fs = require('fs');
// import * as fs from 'node:fs';

fs.readFile('./test.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});
```

### Reading files: Sync file read with callback

Even in an event-based environment like Node, there are instances when we need synchronous reads.

We may want to ensure that the file is read before we do anything else

`readFileSync` takes the same three parameters as the async method:

1. The path to the file we want to read
2. The encoding that we want to use
3. A function that will execute and return an error or log the data to the console

```js
const fs = require('fs');

try {
  const data = fs.readFileSync('./test.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

### Reading Files: Promise-based Read

The `fs/promise` module was first introduced as an experimental module in Node 10 and was deemed stable in Node 14.

```js
const fs = require('fs/promises');
// Or const fs = require('fs').promises before v14.

async function example() {
  try {
    const data = await fs.readFile('/Users/joe/test.txt', { encoding: 'utf8' });
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
example();
```

## Writing Files

Just like with reading, there are multiple ways to write files to disk from Node.js programs.

If the file doesn't exist when you first write to it, Node will create it. If you write to an existing file, Node will overwrite it.

As with the reading methods, which one you use depends on what your program needs.

### Writing files: Async Write with Callback

The oldest, and most widely supported, way to write a file is to use `writeFile`. This method takes two parameters: content (what to do if it succeeds) and error (what to do if it there's an error).

```js
const fs = require('fs');

const content = 'Some content!';

fs.writeFile('./test.txt', content, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});
```

## Writing files: promise-based write

Node 14 made `fs/promises` part of the stable Node API.

The structure of the write command is similar to the read.

We use the `try` block inside our async function to run the code we'd normally put in a `.then` block. The `catch` block is equivalent to the `.catch` promise chain.

```js
const fs = require('fs/promises');

async function example() {
  try {
    const content = 'Some content!';
    await fs.writeFile('./test.txt', content);
  } catch (err) {
    console.log(err);
  }
}

example();
```

## Appending to files

There are times when we just need to append content to an existing file rather than write a new one every time.

If the target file doesn't exist when you first append to it, Node will create it. On subsequent runs, the file will be opened and the new content will be added at the end of the file.

### Async append

The callback-based append operation takes four parameters:

- The name of the file that we want to append to
- The data that we want to add to the file
- An options object
- The error callback

```js
const fs = require('node:fs')

fs.appendFile('message.txt', 'data to append', 'utf-8', (err) => {
  if (err) {
    throw err;
  } else {
    console.log('The "data to append" was appended to file!');
  }
});
```

### Synchronous append

There is also a synchronous version of `appendFile`.

We use a `try/catch` block to provide a cleaner way to run the code.

```js
import { appendFileSync } from 'node:fs';

try {
  appendFileSync('message.txt', 'data to append', 'utf8');
  console.log('The "data to append" was appended to file!');
} catch (err) {
  /* Handle the error */
}
```

### Promise-based append

```js
import * as fs  from 'node:fs/promises';

async function appendFile(path, data) {
  try {
    await fs.appendFile(path, data);
  } catch (error) {
    console.error(error);
  }
};
appendFile("./test.txt", "appending another hello world &\n");
```

## Final notes

We've looked at how to read, write and append files all at once.

We read the entire file which may be problematic if the file is large or if we need to wait for the entire file to be read into a promise-based workflow.

In future posts, we'll look at streams (AKA WHATWG Streams or Web Streams) as a way to process the content of a file in chunks as soon as they arrive and app-like open and save files in the browser.
