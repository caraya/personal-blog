---
title: "Brotli compression streams"
date: "2023-08-07"
---

In a previous posts, I discussed the basic of streams and how to use them,how to use them in service workers, and how to build custom streams. This post will cover an additional area of interest: Using Brotli compression in streams.

## Using Brotli compression

The streams API supports GZIP and Deflate. There are other compression algorithms that are worth looking at, in particular [Brotli](https://en.wikipedia.org/wiki/Brotli).

> Brotli is a lossless data compression algorithm developed by Google. It uses a combination of the general-purpose LZ77 lossless compression algorithm, Huffman coding and 2nd-order context modelling. Brotli is primarily used by web servers and content delivery networks to compress HTTP content, making internet websites load faster. A successor to gzip, it is supported by all major web browsers and has become increasingly popular, as it provides better compression than gzip.

In Node, rather than use the compression streams API in Node, we need to use the [zlib](https://nodejs.org/api/zlib.html) module.

We import all the necessary Node native modules. Rather than import the full packages, I decided to import the individual methods I will use.

```js
import {
  createReadStream,
  createWriteStream,
} from 'node:fs';
import {
  createBrotliCompress,
  createBrotliDecompress,
} from 'node:zlib';
import {
  exit
} from 'node:process';
```

1. Set up the names for input and output files
2. Create read and write streams
3. Create a Brotli compression stream with default parameters
4. Pipe the read stream through the Brotli compression stream and end in the writable stream for the output
5. listen for the finished event on the stream
{.custom-ordered}
   1. When finished, log a message to console and exit.
{.custom-ordered}

```js
export function brotliStreamCompress(inputFile) {

  // 1
  const inputFileName = `${inputFile}`;
  const outputFileName = `${inputFile}.br`;

  // 2
  const readStream = fs.createReadStream(inputFileName);
  const writeStream = fs.createWriteStream(outputFileName);

  // 3
  const brotli = zlib.createBrotliCompress();

  // 4
  const stream = readStream
    .pipe(brotli)
    .pipe(writeStream);

  // 5
  stream.on('finish', () => {
    console.log('Done');
    exit(1);
  });
};
```

For the decompression stream we make a few changes.

1. The name of the input and output files. The input file is compressed and the output file is uncompressed
2. Use `createBrotliDecompress()` to create the decompression stream

```js
export function brotliStreamDecompress(inputFile) {
  // 1
  const inputFileName = `${inputFile}`;
  const outputFileName = './src/data/modified-uncompressed-file.txt'

  const readStream = fs.createReadStream(inputFileName);
  const writeStream = fs.createWriteStream(outputFileName);

  // 2
  const brotli = zlib.createBrotliDecompress();

  const stream = readStream
    .pipe(brotli)
    .pipe(writeStream);

  stream.on('finish', () => {
    console.log('Done!');
    exit(1);
  });
};
```

The results are shown in the following table

| Compression format | size | Notes |
| --- | :-: | --- |
| Uncompressed | 208KB |  |
| Brotli | 62KB | Compressed with the code in this post |
| GZIP | 75KB | Compressed from command line |

## Links and References

* [zlib](https://nodejs.org/api/zlib.html) Node module
* [fs](https://nodejs.org/api/fs.html) Node module
* [Streams and Brotli compression in Node.js](https://medium.com/@linoyzaga/streams-and-brotli-compression-in-node-js-fc2507d4d177)
