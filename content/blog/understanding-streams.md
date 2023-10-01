---
title: "Understanding Streams"
date: "2023-05-01"
---

The Streams API adds a set of tools to the web platform, allowing JavaScript to programmatically access streams of data received over the network and process them as desired by the developer.

## Basic Concepts

As part of understanding streams, there are several concepts associated with streams that we need to be familiar with

### Chunks

A chunk is a **single piece of data** that is written to or read from a stream. It can be of any type; streams can even contain chunks of different types. Most of the time, a chunk will not be the smallest unit of data for a given stream.

### Readable streams

A readable stream represents a source of data that you can read from. In other words, data **comes out** of a readable stream. A readable stream is an instance of the `ReadableStream` class.

### Writable streams

A writable stream represents a destination for data into which you can write. In other words, data **goes in** to a writable stream. A writable stream is an instance of the `WritableStream` class.

### Transform streams

A transform stream consists of a **pair of streams**: a writable stream (the writable side), and a readable stream (the readable side).

A real-world metaphor for this would be a [simultaneous interpreter](https://en.wikipedia.org/wiki/Simultaneous_interpretation) who translates from one language to another on-the-fly. In a manner specific to the transform stream, writing to the writable side results in new data being made available for reading from the readable side.

Any object with a `writable` property and a `readable` property can serve as a transform stream. However, the standard `TransformStream` class makes it easier to create such a pair that is properly entangled.

### Pipe chains

Streams are primarily used by **piping** them to each other.

You can pipe a readable stream to a writable stream, using the readable stream's [pipeTo()](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeTo) method

You can also pipe Readable streams through one or more transform streams first, using the readable stream's [pipeThrough()](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough) method before using the results.

A **set of streams piped together** is called a pipe chain.

### Backpressure

Once a pipe chain is constructed, it will send signals regarding how fast chunks should flow through it. If any step in the chain cannot yet accept chunks, it sends a signal back through the pipe chain, until eventually the original source is told to stop producing chunks so fast. This process is called backpressure.

### Teeing

A readable stream can be teed (named after the shape of an uppercase 'T') using its [tee()](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/tee) method. This will lock the stream, making it directly unusable by other consumers; however, it will create **two new streams**, called branches, which can be consumed independently. Teeing also is important because streams cannot be rewound or restarted.

## Creating custom streams

For me, the most interesting part of using streams is that you can create custom readable streams.

A basic readable stream looks like this:

```js
var stream = new ReadableStream(
  {
    start(controller) {},
    pull(controller) {},
    cancel(reason) {},
  },
  queuingStrategy,
);
```

- `start` is called straight away. Use this to set up any underlying data sources. If you return a promise from this and it rejects it, it will signal an error through the stream
- **pull** is called when your stream's buffer isn't full and is called repeatedly until it is. If you return a promise from this and it rejects it, it will signal an error through the stream. Since pull is promise-based, it won't be called again until the returned promise fulfills
- **cancel** is called if the stream is canceled. Use this to cancel any underlying data sources
- **queuingStrategy** defines how much this stream should ideally buffer, defaulting to one item. See the [streams spec](https://streams.spec.whatwg.org/#blqs-class) for more details

The readable stream controller has the following methods:

- **controller.enqueue(something)**: queue data in the stream's buffer
- **controller.close()**: signal the end of the stream
- **controller.error(e)**: signal a terminal error
- **controller.desiredSize**: the amount of buffer remaining, which may be negative if the buffer is over-full

Having the ability to create custom readable streams gives us a lot of flexibility in terms of what we can do. I'm still exploring the possibilities but one that sounds very promising is to mix both local content and content we fetch from the network.

## Examples

The following examples use streams for different tasks. I am still learning about streams and how they work.

### Read the content of a stream and log it to console

The simplest exercise for streams is to fetch a file and pipe it through a [Text Decoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream) to convert it to text chunks and then log each chunk of text to the Node console as they arrive.

This is particularly useful with larger files or when using unreliable networks. We don't have to wait for the file to fully download, the chunks are processed as they arrive.

```js
async function fetchAndLogStream() {
  const response = await fetch('https://assets.codepen.io/32795/contact-ch24.txt');
  const stream = response.body
    .pipeThrough(new TextDecoderStream());

  for await (const chunk of stream) {
    console.log(chunk);
  }
}

fetchAndLogStream();
```

### Decompressing a file on the fly

Using the [Compression Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API) we can do in the browser what we would have been forced to do on the server or we wouldn't have been able to do at all.

The browser will fetch a gzipped file, run it through a decompression stream, then run it through a text decoder and, finally, present the text to the user in the console. It should also be possible to insert the streamed cotnent into a section of a web page.

This works when run from the Node CLI (Node 18.15). Support in browsers will depend on whether they support the Compression Streams API or not.

```js
const response = await fetch('https://assets.codepen.io/32795/contact-ch24.txt.gz');

const contentStream = response.body
  .pipeThrough(new DecompressionStream('gzip'))
  .pipeThrough(new TextDecoderStream('utf-8'));

for await (const chunk of contentStream) {
  console.log(chunk);
}
```

### Piping streams through multiple transformers

You can pipe a stream through more than one transform using the readableStream's [pipeThrough](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream/pipeThrough) method.

In this case, we run the result through a text decoder and through a custom transform stream that converts the text to upper case.

```js
import { fetch } from 'undici';
import { TextDecoderStream } from 'node:stream/web';

function UpperCaseTransformStream() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });
}

async function fetchStream() {
  const response = await fetch('https://assets.codepen.io/32795/contact-ch24.txt')
  const stream = response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(UpperCaseTransformStream());

  for await (const chunk of stream) {
    console.log(chunk);
  }
}

fetchStream();
```

### Pipe stream to a writable stream with pipeTo

the `pipeTo()` method of readable streams pipes the output of the readable stream into a writable stream.

The `appendToDomStream` takes an element as a parameter and returns a writable stream that appends the current chunk to the element.

We fetch the content that we want to display, pipe it through a text decode, and then pipe it **to** the `appendToDomStream()` function indicating what element we want to insert it into.

```typescript
function appendToDOMStream(el) {
  return new WritableStream({
    write(chunk) {
      el.append(chunk);
    }
  });
}

const preElement = document.createElement('pre')
document.body.append(preElement);

fetch('https://assets.codepen.io/32795/contact-ch24.txt').then((response) =>
  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeTo(appendToDOMStream(preElement))
);
```

## Further work

In [2016 - the year of web streams](https://jakearchibald.com/2016/streams-ftw/), Jake Archibald talks about using streams in a service worker to create a faster experience for users.

When Jake wrote the article, transform streams were not available in browsers so the code was messy and hard for me to understand. It would be interesting to see how would it work not that we can pipe streams around.

Another interesting exercise would be to build HTML pages from Markdown using streams, similar to how I do it with Gulp.

There are probably more ideas, but these two are the ones that came to mind first.

## References

- Concepts
    
    - [Streams API concepts](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts) — MDN
    - [Streams — The Definitive Guide](https://web.dev/streams/) — web.dev
- [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API)
    
    - [Using readable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
    - [Using readable byte streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_byte_streams)
    - [Using writable streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_writable_streams)
- General usage
    
    - [Experimenting with the Streams API](https://deanhume.com/experimenting-with-the-streams-api/)
    - [Web Streams Everywhere (and Fetch for Node.js)](https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/)
    - [The Streams API](https://flaviocopes.com/stream-api/)
- Streams in Node
    
    - [Using web streams on Node.js](https://exploringjs.com/nodejs-shell-scripting/ch_web-streams.html)
    - [Web Streams API](https://nodejs.org/api/webstreams.html)
