---
title: Revisiting Streams (again)
date: 2024-10-02
tags:
  - Javascript
  - Streams
  - Reference
---

I've looked at streams in the context of Node and the browser, but I haven't really done anything with them because I couldn't figure out what the best use for them was.

As I started working with more complex processes, I realized that streams are a great way to handle files without knowing  the size of the file in advance.

## Readable Streams

The most basic readable stream example in Node does the following

1. Import `createReadStream` from the `fs` module
2. Capture the name of the file as the second CLI argument
3. If we didn't pass a parameter log an error to console and exit
4. Create a readable stream from the file
5. Event listener for when data (a chunk) is received
6. Event listener for when the stream has finished reading the file
7. Event listener to handle errors

```js
// 1
import { createReadStream } from 'fs';

// 2
const inputFile = process.argv[2];

// 3
if (!inputFile) {
  console.error('Error: Provide a file name as the first argument.');
  process.exit(1);
}

// 4
const readableStream = createReadStream(
  inputFile, {
    encoding: 'utf8'
  });

// 5
readableStream.on('data', (chunk) => {
  console.log(chunk);
});

// 6
readableStream.on('end', () => {
  console.log('All chunks loaded.');
});

// 7
readableStream.on('error', (error) => {
  console.error('Error reading file:', error);
});
```

An equivalent for the browser would look like this:

1. Capture the `fileInput` HTML element
2. Add a `change` event listener that will trigger whenever the value of the input field changes
3. Capture the value of the `fileInput` input field
4. We check if there is a file to work on
5. If the file exists then we initialize a stream, a reader, and a text decoder
6. Use the `reader` method of the `fileReader` object to read the content of a file
7. If we finish reading the file (the value for `done` is true), we're done reading the file so we log it to console and exit
8. Use the `decode` method of the `textEncoder` to read the next available chunk, log the value to console and call the `read` function again to continue processing the file
9. If there is an error log it to console
10. Call the `read()` function for the first time

```js
// 1
const fileInput = document.getElementById('fileInput');

// 2
fileInput.addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
  // 3
  const file = event.target.files[0];

  // 4
  if (file) {
    // 5
    const stream = file.stream();
    const reader = stream.getReader();
    const decoder = new TextDecoder('utf-8');

    // 6
    function read() {
      reader.read().then(({
        done,
        value
      }) => {
        // 7
        if (done) {
          console.log('File reading completed.');
          return;
        }
        // 8
        const textChunk = decoder.decode(value);
        console.log(textChunk);
        read();
        // 9
      }).catch(error => {
        console.error('Error reading file:', error);
      });
    }
    // 10
    read();
  }
}
```

## Writable Streams

## Encoders and Decoders

The [encoding standard](https://encoding.spec.whatwg.org/) defines a set of commonly used encodings at the time it the specification was written and a Javascript API to work with these encodings.

* TextDecoder
* TextDecoderStream
* TextEncoder
* TextEncoderStream

### textEncoder

The TextEncoder interface encodes strings into Uint8Array byte sequences using a specified character encoding (default is UTF-8). This is useful when you need to convert text data into binary data for storage or transmission.

```js
const encoder = new TextEncoder();
const text = "Hello, world!";
const encoded = encoder.encode(text);

console.log(encoded);
```

### textEncoderStream

The TextEncoderStream interface converts a stream of strings into bytes in the UTF-8 encoding. It is the streaming equivalent of TextEncoder.

### textDecoder

The TextDecoder interface decodes Uint8Array byte sequences into strings using a specified character encoding.

```js
const decoder = new TextDecoder(); // Default is 'utf-8'
const uint8Array = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]);

const decoded = decoder.decode(uint8Array);

console.log(decoded); // "Hello World!"
```

### textDecoderStream

TextDecoderStream interface of the Encoding API converts a stream of text in a binary encoding, such as UTF-8 etc., to a stream of strings. It is the streaming equivalent of TextDecoder.

## Piping And Copying Streams

You can also pipe or redirect streams to create processing chains.

In this section we'll cover pipeThrought, pipeTo and Tee

### PipeThrough and PipeTo

The `pipeThrough()` method provides a chainable way of piping the current stream through a transform stream or any other writable/readable pair.

Piping a stream will generally lock it for the duration of the pipe, preventing other readers from locking it.

The `pipeTo()` method pipes the current ReadableStream to a given WritableStream and returns a Promise that fulfills when the piping process completes successfully, or rejects if any errors were encountered.

Piping a stream will generally lock it for the duration of the pipe, preventing other readers from locking it.

This example does the following:

1. Create a readable stream and populates with numbers from 1 to 10
2. Create a transform stream to process the content and square it
3. Create a writeable stream to output the content
4. Pipes the output of the readableStream trough the transformStream and into the writeableStream to log the output to console

```js
//1
const readableStream = new ReadableStream({
  start(controller) {
    for (let i = 1; i <= 10; i++) {
      controller.enqueue(i);
    }
    controller.close();
  }
});

// 2
const transformStream = new TransformStream({
  transform(chunk, controller) {
    controller.enqueue(chunk * chunk);
  }
});

// 3
const writableStream = new WritableStream({
  write(chunk) {
    console.log('Received chunk:', chunk);
  }
});

// 4
readableStream
  .pipeThrough(transformStream)
  .pipeTo(writableStream)
  .then(() => console.log('Stream processing complete'))
  .catch(err => console.error('Stream processing error:', err));
```


### Tee

The tee() method [tees](https://streams.spec.whatwg.org/#tee-a-readable-stream) the current readable stream returns a two-element array containing the two resulting branches as new ReadableStream instances.

Since a response body cannot be consumed more than once, you'd need two copies to do this. You can fetch a response from the server and stream it to the browser, and stream it to the ServiceWorker cache.

This example is the fetch event listener for a service worker and it performs the following tasks:

1. uses the [respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith) method from the Fetch object to prevent the browser's default fetch handling, and provide a custom promise for a Response
2. Opens the `my-cache` cache
3. Fetch the requested URL
4. If the response is not valid or has no body, return it directly
5. Tee the body stream directly from the response
6. Create new responses from the two streams
7. Put one of the responses in the cache
8. Return the other response to the client

You can use similar solutions wherever you would use regular file commands but the file may be too large to keep in memory all at once.

```js
self.addEventListener('fetch', event => {
  // 1
  event.respondWith(
    (async function() {
      // 2
      const cache = await caches.open('my-cache');

      // 3
      const response = await fetch(event.request);

      // 4
      if (!response || !response.ok || !response.body) {
        return response;
      }

      // 5
      const [
        body1,
        body2,
      ] = response.body.tee();

      // 6
      const responseForCache = new Response(body1, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      });

      const responseForClient = new Response(body2, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText
      });

      // 7
      event.waitUntil(cache.put(event.request, responseForCache));

      // 8
      return responseForClient;
    })()
  );
});
```

## Specialized Streams

We can use the stream methods we've discussed in this post to build custom applications.

This example uses streams and the [jsZip](https://stuk.github.io/jszip/) library to generate a zip file.

The steps are as follows:

1. Capture a reference to the button with ID `zipButton`
2. Add a click event listener to the  button with id `zipButton`
3. Capture a reference to the file input where we entered the file to zip and a reference to the file itself
4. If the file doesn't exist then display an alert and return, there's nothing to do
5. Start a `try/catch` block
6. Create a new JSZip instance
7. Read the file as a stream
8. While there are chunks of content available, push it to the chunks array
9. If done is true then we're done
10. Concatenate chunks into a Blob
11. Add the file to the ZIP archive
12. Generate the ZIP file as a Blob
13. Create a link and download the ZIP file
14. Handle any errors

```js
// 1
const zipButton = document.getElementById('zipButton');

// 2
zipButton.addEventListener('click', generateZip);

async function generateZip() {
  // 3
  const input = document.getElementById('fileInput');
  const file = input.files[0];

  // 4
  if (!file) {
    alert('Please select a file.');
    return;
  }

  // 5
  try {
    // 6
    const zip = new JSZip();

    // 7
    const stream = file.stream();
    const reader = stream.getReader();
    let chunks = [];
    let done = false;

    // 8
    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        chunks.push(value);
      }
      // 9
      done = streamDone;
    }

    // 10
    const blob = new Blob(chunks, { type: file.type });

    // 11
    zip.file(file.name, blob);

    // 12
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    // 13
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'files.zip';
    document.body.appendChild(link);
  } catch (error) {
    // 14
    console.error('Error generating zip file:', error);
  }
}
```

## Final Notes

Streams can be used in the same instances where you can read and write a file in Node.

Since this is a new(ish) feature, browser support may be an issue. Plan accordingly.

## Links and Resources

* [How To Work with Files Using Streams in Node.js](https://www.digitalocean.com/community/tutorials/how-to-work-with-files-using-streams-in-node-js) &mdash; Digital Ocean
* Jake Archibald
  * [2016 - the year of web streams](https://jakearchibald.com/2016/streams-ftw/)
  * [Streaming template literals](https://jakearchibald.com/2016/streaming-template-literals/)
* MDN
  * [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
  * [Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
  * [Using writable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_writable_streams)
  * [TransformStream](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)
  * [ReadableStream: tee() method](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/tee)
  * [ReadableStream: pipeThrough() method](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough)
  * [ReadableStream: pipeTo() method](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeTo)
  * [TransformStream: TransformStream() constructor](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream/TransformStream)
* Encoders and Decoders
  * [Encoding Standard](https://encoding.spec.whatwg.org/)
  * [textEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
  * [textEncoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream)
  * [textDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)
  * [textDecoderStream](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream)
* Node
  * [Node.js Streams](https://nodejs.dev/learn/nodejs-streams)
  * [Stream](https://nodejs.org/api/stream.html) &mdash; Node 22.9.0
