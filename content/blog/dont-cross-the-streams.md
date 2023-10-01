---
title: "Don't cross the streams"
date: "2019-01-16"
---

Streams are a very interesting concept and a new set of tools for the web. The idea is that we can read and write, depending on the type of stream we're using, chunks of content... either write them to a location or read them from a location. This will improve performance because we can start showing things to the user before it has completed loading.

The example below how we can asynchronously download and display content to the user. The problem with this, if you can call it that, is that fetch will wait to download the entire file before settling the promise and only then will populate the content into the page.

```js
const url = 'https://jsonplaceholder.typicode.com/photos';
const response = await fetch(url);
document.body.innerHTML = await response.text();
```

Streams seek to provide a better way to fetch content and display it to the user. The content gets to the browser first and we can then render it to the user as it arrives rather than have to wait for all the content to arrive before display.

The example below does the following:

1. Fetches the specified resource
2. Creates a reader from the body of the response object
3. Creates a readable stream
4. In the reader's start menu we create a push function to do the work and read the first chunk of the stream
5. We create a TextDecoder that will convert the value of the chunk from Uint8 to text
6. If we hit done it's because there are no more chunks to read so we close the controller and return
7. Enqueue means we add the chunk we read to the stream and then we append the decoded string to the page
8. We call the function again to continue processing the stream until there are no more chunks to read and done returns true
9. We return a new response with the stream as the value and a new `Content-Type` header to make sure it's served as HTML

```js
fetch("https://jsonplaceholder.typicode.com/photos").then((response) => { // 1
const reader = response.body.getReader(); // 2
const stream = new ReadableStream({ //3
  start(controller) {
    function push() {
      reader.read().then(({ done, value }) => { // 4

        let string = new TextDecoder("utf-8").decode(value); // 5

        if (done) { // 6
          controller.close();
          return;
        }
        controller.enqueue(value); // 7
        document.body.innerHTML += string;
        push()
      });
    };
    push(); // 8
  }
});

  return new Response(stream, { // 9
    headers: {
      "Content-Type": "text/html"
    }
  });
});
```

This reader becomes more powerful the larger the document we feed it is.

## Creating my own streams

The example above also illustrates some of the functions and methods of `ReadableStream` and `controller`. The syntax looks like this and we're not required to use any of the methods.

```javascript
let stream = new ReadableStream({
  start(controller) {},
  pull(controller) {},
  cancel(reason) {}
}, queuingStrategy);
```

- `start` is called immediately. Use this to set up any underlying data sources (meaning, wherever you get your data from, which could be events, another stream, or just a variable like a string). If you return a promise from this and it rejects, it will signal an error through the stream
- `pull` is called when your stream's buffer isn't full and is called repeatedly until it's full. Again, If you return a promise from this and it rejects, it will signal an error through the stream. Pull will not be called again until the returned promise fulfills
- `cancel` is called if the stream is canceled. Use this to cancel any underlying data sources
- `queuingStrategy` defines how much this stream should ideally buffer, defaulting to one item. Check [the spec](https://streams.spec.whatwg.org/#blqs-class) for more information

And the controller has the following methods:

- `controller.enqueue(whatever)` - queue data in the stream's buffer.
- `controller.close()` - signal the end of the stream.
- `controller.error(e)` - signal a terminal error.
- `controller.desiredSize` - the amount of buffer remaining, which may be negative if the buffer is over-full. This number is calculated using the queuingStrategy.
