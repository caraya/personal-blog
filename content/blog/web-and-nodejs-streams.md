---
title: "Web and Node.js Streams"
date: 2026-05-18
tags:
  - Node
  - Streams
  - Performance
  - Typescript
  - Javascript
---

Handling massive datasets or high-frequency real-time data efficiently requires a fundamental shift in how applications process information. Loading an entire multi-gigabyte video or parsing thousands of database rows into memory at once creates significant performance bottlenecks and risks crashing your application. Streams solve this by processing data incrementally in small, manageable chunks.

This guide explores the architecture of streams, the differences between the Web Streams API and Node.js streams, how to manage errors and cancellations, and how to recover broken stream pipelines.

## Node.js Streams vs. Web Streams API

Before writing code, understand the historical context and the architectural differences between the two primary streaming models in JavaScript.

Node.js introduced its own `node:stream` module long before browsers needed a unified streaming standard. As browser applications grew more complex, the W3C standardized the Web Streams API. Modern JavaScript environments, including browsers, Deno, Bun, Cloudflare Workers, and newer versions of Node.js (v18+), fully support the Web Streams API.

### Key Differences and Historical Baggage

While both APIs solve the same problems, they utilize entirely different paradigms:

* **Event-Driven vs. Promise-Driven**: Node.js streams rely heavily on the EventEmitter pattern (for example, stream.on('data', callback)). The Web Streams API relies on Promises and async iterators.
* **Data Types**: Node.js streams operate primarily on Node Buffer objects. Web Streams operate universally on standard Uint8Array objects.
* **The Locking Model**: The Web Streams specification was finalized before ES2018 introduced native async iteration (for await...of). Because of this timing, the API introduced a manual "reader and lock" acquisition model (stream.getReader()). As noted in an architectural critique by Cloudflare, this legacy design requires significant boilerplate and introduces usability hurdles compared to modern iteration primitives. Forgetting to call reader.releaseLock() permanently breaks the stream.

### When to Use Each API

**Use the Web Streams API when**: Writing isomorphic code meant to run on both the client and the server, developing for edge runtimes (like Cloudflare Workers or Deno), or interacting with modern browser APIs like fetch. Web Streams act as the modern standard and serve as the default choice for new projects.

**Use Node.js Streams when**: Maintaining legacy Node.js server applications, or working with older third-party npm packages that expect Node.js stream instances.

## The Web Streams API

The Web Streams API provides three primary building blocks: `readable streams`, `writable streams`, and `transform streams`.

### Readable Streams

A `ReadableStream` represents a source of data. Read data sequentially using an async iterator or by piping it directly to a destination.

```ts
const myReadableStream = new ReadableStream<string>({
  start(controller) {
    controller.enqueue('Chunk 1 ');
    controller.enqueue('Chunk 2');
    controller.close();
  }
});

async function readStream(): Promise<void> {
  for await (const chunk of myReadableStream) {
    console.log(chunk);
  }
}
readStream();
```

#### Memory Allocation and BYOB (Bring Your Own Buffer)

When a stream enqueues a new chunk of data, the JavaScript engine allocates new memory by default. For high-throughput applications, this constant allocation triggers aggressive garbage collection, which drags down performance.

To combat this, the Web Streams API introduced BYOB (Bring Your Own Buffer) reads. Instead of the stream creating new memory for each chunk, the consumer provides an existing ArrayBuffer. The stream fills that buffer, resulting in highly efficient zero-copy operations.

However, [Cloudflare's analysis](https://blog.cloudflare.com/a-better-web-streams-api/) points out that the complexity of BYOB limits its practical adoption. BYOB does not work with async iteration or TransformStream pipelines. It also requires manual management of buffer detachment semantics; passing a buffer into a stream frequently detaches the original reference, rendering it unusable and forcing developers to constantly reassign memory views.

```ts
async function readWithBYOB(stream: ReadableStream<Uint8Array>): Promise<void> {
  const reader = stream.getReader({ mode: 'byob' });
  const buffer = new ArrayBuffer(1024);
  let view = new Uint8Array(buffer);

  while (true) {
    const { done, value } = await reader.read(view);
    if (done) break;

    view = value;
    console.log(`Read ${view.byteLength} bytes`);
  }

  reader.releaseLock();
}
```

### Writable Streams

A `WritableStream` represents a destination to send data. It acts as a sink, abstracting the underlying mechanism of writing to the file system, a network socket, or a UI component.

```ts
const myWritableStream = new WritableStream<string>({
  write(chunk) {
    console.log(`Writing chunk: ${chunk}`);
  },
  close() {
    console.log('Stream finished.');
  }
});

async function writeData(): Promise<void> {
  const writer = myWritableStream.getWriter();
  await writer.write('Hello, ');
  await writer.write('World!');
  await writer.close();
}
writeData();
```

### Transform Streams, pipeTo(), and Cooperative Backpressure

A `TransformStream` sits between a readable and writable stream, modifying the data as it passes through. Connect these streams using `pipeThrough()` (to apply the transform) and `pipeTo()` (to send the result to a destination).

The `pipeTo()` method serves as the backbone of Web Streams data flow. It automatically handles teardowns if errors occur and attempts to manage backpressure—pausing the readable stream when the writable stream processes data too slowly.

**The Backpressure Flaw**: While backpressure acts as a first-class concept in Web Streams, it relies entirely on developer cooperation. The `desiredSize` property on a stream controller signals when a consumer becomes overwhelmed. However, methods like `controller.enqueue()` always succeed, even if `desiredSize` is deeply negative. Because the API does not strictly enforce limits, applications frequently ignore backpressure protocols, which leads to unbounded memory accumulation.

#### Browser Compression Equivalent (Gzip)

To demonstrate a native Web Streams pipeline, use the [CompressionStream API](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream). This allows applications to compress data natively in the browser without relying on Node.js zlib or massive third-party JavaScript libraries.

```ts
async function compressInBrowser(
  readableStream: ReadableStream<Uint8Array>,
  writableStream: WritableStream<Uint8Array>
): Promise<void> {
  // CompressionStream is globally available in modern browsers
  const gzipStream = new CompressionStream('gzip');

  try {
    await readableStream
      .pipeThrough(gzipStream)
      .pipeTo(writableStream);

    console.log('Browser compression complete.');
  } catch (error: unknown) {
    console.error('Compression pipeline failed:', error);
  }
}
```

## Using Streams with the Fetch API

One of the most powerful and common applications of the Web Streams API is its integration with the browser's native `fetch()` method.

When making a network request, the `response.body` exposes a `ReadableStream`. Instead of using methods like `await response.json()` or `await response.text()`, which force the browser to buffer the entire downloaded payload in memory before returning—read the response chunk by chunk as it arrives over the network.

This approach proves invaluable when:

* **Parsing massive files on the fly**: Processing multi-gigabyte CSV or NDJSON (Newline Delimited JSON) files line-by-line without exhausting client memory.
* **Creating progress indicators**: Tracking the exact number of bytes downloaded to render a real-time progress bar for the user.
* **Playing media**: Feeding audio or video chunks directly into a MediaSource buffer.

The following example demonstrates how to consume a fetch stream manually using a reader to calculate the download progress in real time.

```ts
async function fetchWithProgress(url: string): Promise<void> {
  const response = await fetch(url);

  if (!response.body) {
    throw new Error('Response body is null.');
  }

  const totalBytes = Number(response.headers.get('content-length')) || 0;
  let receivedBytes = 0;

  const reader = response.body.getReader();

  while (true) {
    // Read the next chunk of data from the network
    const { done, value } = await reader.read();

    if (done) {
      console.log('Download complete.');
      break;
    }

    // value is a Uint8Array containing the chunk's bytes
    receivedBytes += value.length;

    if (totalBytes) {
      const percentage = Math.round((receivedBytes / totalBytes) * 100);
      console.log(`Progress: ${percentage}%`);
    } else {
      console.log(`Received: ${receivedBytes} bytes`);
    }
  }
}
```

### Branching Streams with tee()

To process the same stream of data in two different ways simultaneously, use the `tee()` method. This allows you to split a single `ReadableStream` into two identical copies, returning an array containing the two new branches.

#### Why and What is it Used For?

Use the `tee()` method when sending a single data source to multiple destinations without fetching or generating the data twice. Common use cases include:

* **Simultaneous Processing and Storage**: Fetching a video stream to display in the browser while simultaneously saving it to the user's local disk using the File System Access API.
* **On-the-fly Analysis**: Processing a file upload while concurrently piping a copy of the stream through a cryptographic function to generate a checksum (like SHA-256).
* **Caching**: Intercepting a network request in a Service Worker, piping one branch to the browser for immediate display, and piping the second branch into the Cache Storage API.

```ts
async function fetchAndSplit(url: string): Promise<void> {
  const response = await fetch(url);

  if (!response.body) {
    throw new Error('Response body is null.');
  }

  // Split the readable stream into two identical branches
  const [stream1, stream2] = response.body.tee();

  // Task 1: Count the total bytes
  const countBytes = async (): Promise<void> => {
    let total = 0;
    for await (const chunk of stream1) {
      total += chunk.length;
    }
    console.log(`Total bytes processed: ${total}`);
  };

  // Task 2: Decode and log the text chunks
  const logText = async (): Promise<void> => {
    const decoder = new TextDecoderStream();
    const textStream = stream2.pipeThrough(decoder);
    for await (const chunk of textStream) {
      console.log(`Received text chunk: ${chunk.length} characters`);
    }
  };

  // Execute both stream consumers concurrently
  await Promise.all([countBytes(), logText()]);
}
```

#### Limitations of `tee()`

While powerful, the `tee()` method introduces a significant memory risk known as buffer bloat, serving as a prime example of broken backpressure.

When teeing a stream, the internal mechanism must ensure both branches receive the exact same chunks. If one branch reads faster than the other, the stream buffers all unread chunks in memory until the slower branch catches up. If the speed discrepancy becomes large or the stream is massive, this unbounded buffering can quickly consume all available memory and crash the browser tab.

Canceling a teed stream behaves differently than canceling a standard stream. To abort the underlying source of a teed stream, cancel both branches. If you cancel only one branch, the data flow from the source does not stop. The remaining branch continues receiving data until explicitly canceled.

## Managing Errors and Cancellation

When working with streams, robust error handling and cancellation mechanisms are critical. Because streams process data over time, network connections drop, file permissions change, and users cancel operations.

### Cancellation with `AbortController`

To intentionally stop a stream based on a user action or a timeout, use the `AbortController` interface. By passing an `AbortSignal` to the `pipeTo()` options (and to the underlying data source, like `fetch`), sever the pipeline on demand.

```ts
async function downloadWithTimeout(
  url: string,
  writable: WritableStream<Uint8Array>
): Promise<void> {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal });
    if (!response.body) {
      throw new Error('Response body is null.');
    }

    await response.body.pipeTo(writable, { signal });
    console.log('Download complete.');
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Download cancelled due to timeout.');
    } else {
      console.error('Network or stream error:', error);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}
```

## Resuming Broken Streams (HTTP Range Requests)

True "recovery" (resuming a broken stream from the exact byte where it failed) requires support from the underlying protocol. Because streams function as single-use objects, simply reconnecting a failed fetch stream is impossible.

Instead, make a new request utilizing HTTP Range headers to ask the server for the missing bytes, and append that new stream to the existing data sink.

### Calculating the `startByte` Parameter

Before resuming a stream, determine exactly how many bytes the application successfully processed before the failure. Use this value as the startByte parameter. Calculate this value based on the storage mechanism:

* **In-Memory Tracking**: When tracking download progress (like the receivedBytes variable in the previous fetchWithProgress example), catch the network error and use the current value of receivedBytes as the startByte.
* **File System Access API**: When piping the stream directly to the user's local disk, check the size of the partial file on the disk before resuming. Achieve this by obtaining the File object from the file handle and reading its size property (for example, `const startByte = myFile.size;`).
* **IndexedDB**: When buffering chunks into IndexedDB, calculate the startByte by summing the byte lengths of all successfully stored chunks.

Once you determine the startByte and make the new request, the server returns an HTTP 206 (Partial Content) response. Take the new response.body stream and append it directly to the end of the existing partial data.

```ts
/**
 * Resumes a download from a specific byte offset.
 * @param url - The URL of the file.
 * @param startByte - The byte index to resume from.
 * @param appendableStream - A writable stream configured to append data.
 */
async function resumeDownload(
  url: string,
  startByte: number,
  appendableStream: WritableStream<Uint8Array>
): Promise<void> {
  try {
    const response = await fetch(url, {
      headers: {
        'Range': `bytes=${startByte}-`
      }
    });

    // HTTP 206 indicates Partial Content was successfully returned
    if (response.status !== 206) {
      throw new Error('Server does not support partial content (HTTP 206).');
    }

    if (!response.body) {
      throw new Error('Response body is null.');
    }

    await response.body.pipeTo(appendableStream);
    console.log('Resumed download complete.');
  } catch (error: unknown) {
    console.error('Failed to resume download:', error);
  }
}
```

## Node.js Streams: The `.pipe()` Flaw and the `pipeline` Utility

When working with Node.js streams, connect them together to move data. Historically, developers achieved this using the `.pipe()` method (for example, `readable.pipe(writable)`).

However, the legacy `.pipe()` method contains a significant architectural flaw: it does not automatically forward errors or close the destination stream if the source stream fails.

If the readable stream encounters an error midway through processing, `.pipe()` emits the error, but the writable stream remains open indefinitely, waiting for data that never arrives. This creates severe memory leaks and hung processes on the server.

### The Solution: `pipeline()`

To solve this, Node.js introduced the `pipeline` utility function, available in the `node:stream/promises` module.

The `pipeline` utility automatically tracks the state of every stream in the chain. If any single stream emits an error, `pipeline` guarantees that all other streams in the chain safely destroy and close, preventing memory leaks. Because it is Promise-based, it mirrors the safety and semantics of the Web Streams API's `pipeTo()`.

Always use `pipeline` instead of `.pipe()` in modern Node.js applications.

```ts
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';

async function compressFileWithCancel(
  source: string,
  destination: string
): Promise<void> {
  const controller = new AbortController();
  const { signal } = controller;

  setTimeout(() => controller.abort(), 100);

  try {
    await pipeline(
      createReadStream(source),
      createGzip(),
      createWriteStream(destination),
      { signal }
    );
    console.log('Compression complete.');
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Compression cancelled.');
    } else {
      console.error('Pipeline failed:', error);
    }
  }
}
```

## When Not to Use Streams (and When You Must)

Streams are not always the best solution. While streams manage memory exceptionally well when handling massive datasets, loading a file or payload all at once (often called buffering) frequently serves as the better choice for everyday tasks.

Use buffering instead of streaming in the following scenarios:

* **Small Data Payloads**: Fetching a small 50 KB JSON response using await response.json() executes much faster than the CPU overhead required to set up a stream pipeline, create Promises, and schedule microtasks for chunk processing.
* **Atomic Operations**: If an application requires the entire dataset before it can perform its work (for example, sorting a list of 1,000 records before rendering them), it must hold all records in memory first, which nullifies the benefits of streaming.
* **Synchronous APIs**: Native browser APIs like JSON.parse() or standard DOM manipulation require complete, unbroken strings. While specialized third-party libraries parse JSON incrementally, they add massive complexity.
* **Algorithmic Requirements**: Cryptographic signing, complex image resizing, and AST parsing often require access to the entire file structure at once rather than sequential byte chunks.

## Defending Applications with Streams: The Text Editor Example

While buffering provides simplicity, streams act as the ultimate defense mechanism for specific applications—like a web-based text editor. If a user attempts to open a 10 GB server log file and the application uses `await file.text()`, the browser tab crashes instantly due to out-of-memory errors.

Defend applications by combining size-checking, chunking, and UI virtualization:

The First Line of Defense: Size Checking
: Before reading any data, always inspect the File object's size property. If the file exceeds a safe memory threshold, automatically switch the editor into a specialized "large file mode."

```ts
async function handleFileUpload(file: File): Promise<void> {
  // Define a safe threshold, such as 50 MB
  const MAX_BUFFER_SIZE = 50 * 1024 * 1024;

  if (file.size > MAX_BUFFER_SIZE) {
    console.log('File exceeds memory limits. Switching to stream processing.');
    await processFileAsStream(file);
  } else {
    console.log('File is small enough to buffer safely.');
    const text = await file.text();
    // Render the complete text directly
    renderCompleteText(text);
  }
}

function renderCompleteText(text: string): void {
  // Implementation for small files
}
```

Chunking and UI Virtualization
: In large file mode, use a ReadableStream to process the file incrementally. Instead of holding the entire text payload in memory, stream the data to build a lightweight index of line breaks and their corresponding byte offsets.
: Pair this stream with UI virtualization—rendering only the 50 to 100 lines currently visible on the screen. When the user scrolls, use the byte-offset index to request only that specific chunk of text on demand.

```ts
async function processFileAsStream(file: File): Promise<void> {
  const stream = file.stream();
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  let byteOffset = 0;
  // Initialize the first line starting at offset 0
  const lineBreakOffsets: number[] = [0];

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    // Decode the chunk, handling split characters across boundaries
    const chunkText = decoder.decode(value, { stream: true });

    // Find line breaks in the current chunk to build the virtual index
    for (let i = 0; i < chunkText.length; i++) {
      if (chunkText[i] === '\n') {
         // Log the approximate offset for the start of the next line
         lineBreakOffsets.push(byteOffset + i + 1);
      }
    }

    byteOffset += value.length;
  }

  // Flush any remaining characters in the decoder
  decoder.decode();

  console.log(`Discovered ${lineBreakOffsets.length} lines. Ready for virtualized rendering.`);
  // Pass the lineBreakOffsets index to your virtualized rendering engine
}
```

## Performance Limitations and the Future of Streams

While the Web Streams API acts as the current cross-platform standard, its architecture introduces measurable performance overhead. The strict locking model, constant promise creation for every data chunk, and event-loop microtask scheduling consume significant CPU cycles—even when the underlying data sources and transforms are completely synchronous.

In a [structural critique](https://blog.cloudflare.com/a-better-web-streams-api/), Cloudflare demonstrated that experimental stream implementations built purely around JavaScript async iterables (`AsyncIterable<Uint8Array>`) can run anywhere from 2x to 120x faster than the standard Web Streams API.

By removing the hidden internal state of controllers, eliminating manual lock management, and strictly enforcing backpressure at the language level rather than relying on a cooperative protocol, these alternative pull-through designs suggest that future JavaScript streaming primitives could be significantly faster and simpler to use.

## Summary

Streams act as a powerful paradigm for managing memory and increasing throughput in modern web applications. By mastering the Web Streams API, understanding its tradeoffs with memory allocation (BYOB) and backpressure, effectively managing errors with pipeTo() and Node's pipeline, and knowing how to cancel and resume data flows, developers can build highly resilient data pipelines across both the client and the server.
