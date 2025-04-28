---
title: Pub/sub apps
date: 2025-05-19
tags:
  - Pub/Sub
  - Web
  - Design ideas
---

Pub/Sub is a messaging pattern that allows for asynchronous communication between different parts of a system.

This post will explore PubSub, what it is, how it works, potential use cases, and how to implement it in a simple web application using WebSockets.

## What is Pub/Sub?

Pub/Sub is an asynchronous and scalable messaging service that decouples services producing messages from services processing those messages.

Pub/Sub lets you create systems of event producers and consumers, called publishers and subscribers. Publishers communicate with subscribers asynchronously by broadcasting events, rather than by synchronous remote procedure calls (RPCs).

Publishers send events to the Pub/Sub service, without regard to how or when these events are to be processed. Pub/Sub then delivers events to all the services that react to them. In systems communicating through RPCs, publishers must wait for subscribers to receive the data. However, the asynchronous integration in Pub/Sub increases the flexibility and robustness of the overall system.

## How does it work?

In the Pub/Sub patter we have three components:

1. Sender: Publishes messages to one or more topics
2. Broker: Stores published messages and send them to subscribers
3. Subscribers: They subscribe to one or more topics, receive messages, and process them

<figure>
  <img src='https://res.cloudinary.com/dfh6ihzvj/image/upload/c_scale,w_500/f_auto,q_auto/pub-sub-01_pjibgh.png' alt="Pub/Sub pattern">
  <figcaption>Pub/Sub pattern</figcaption>
</figure>

### Use cases

Pub/Sub is a powerful pattern that can be used in many different scenarios, including:

1. Real-time data streaming
2. Event-driven architectures
3. Collaborative applications (code editors, whiteboards, etc.)
4. Asynchronous processing

## Example code

For this example, we will use [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) to implement a simple Pub/Sub system.

The code is divided into three parts:

1. **Server**: The WebSocket server that handles incoming connections and messages
2. **Client**: The HTML/JavaScript client that connects to the server and sends/receives messages
3. **Message Store**: A simple file-based message store that persists messages. Without this, messages are lost when the server restarts

The idea is that whoever is interested in a topic can subscribe to it and receive messages published to that topic. The server will broadcast messages to all subscribers of a topic, regardless of where they are located or what browser they are using.

### Server

The server is implemented as an [Express](https://expressjs.com/) application that uses the [ws](https://www.npmjs.com/package/ws) library to handle WebSocket connections.

The first block is import declarations, port definition (the value of the `PORT` environment variable or 3000), and the `Client` interface that extends the WebSocket interface to include a `subscribedTopics` property.

```typescript
import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { FileMessageStore, StoredMessage } from './store';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

interface Client extends WebSocket {
  subscribedTopics: Set<string>;
}
```

The second block is the main async [Immediately Invoked Function Expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) that creates the server, initializes the message store, and sets up the WebSocket server.

We first create a new instance of the `FileMessageStore` class and call its `init` method to load any existing messages from disk.

Then we create an Express application and a WebSocket server that listens for incoming connections.

The `broadcast` function is used to send messages to all connected clients that are subscribed to a specific topic. It takes a topic and a payload as arguments, creates a message object, and sends it to all clients that have subscribed to that topic.

```typescript
(async () => {
  const store = new FileMessageStore();
  await store.init();

  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.static('public'));

  const broadcast = (topic: string, payload: any) => {
    const msg = JSON.stringify({ topic, payload, timestamp: Date.now() });

    for (const client of wss.clients as Set<Client>) {
      if (
      client.readyState === WebSocket.OPEN &&
      client.subscribedTopics.has(topic)) {
      client.send(msg);
      }
    }
  };
```

The third block is the WebSocket connection handler that listens for incoming messages from clients.

When a client connects, we create a new `Client` object and initialize its `subscribedTopics` property to an empty set (not an array so we don't get duplicate topics).

The `on('message')` event handler listens for incoming messages from the client. The message is expected to be a JSON object with three properties: `action`, `topic`, and `payload`.

The `action` property can be one of three values: `subscribe`, `unsubscribe`, or `publish`.

* If the action is `subscribe`, we add the topic to the client's `subscribedTopics` set
* If the action is `unsubscribe`, we remove the topic from the set
* If the action is `publish`, we create a new `StoredMessage` object and optionally call the `save` method of the message store to persist it

Finally, we call the `broadcast` function to send the message to all subscribers of that topic.

```typescript
  wss.on('connection', (ws: WebSocket) => {
    const client = ws as Client;
    client.subscribedTopics = new Set();

    ws.on('message', async raw => {
      try {
        const { action, topic, payload } = JSON.parse(raw.toString());
        switch (action) {
          case 'subscribe':
            client.subscribedTopics.add(topic);
            break;
          case 'unsubscribe':
            client.subscribedTopics.delete(topic);
            break;
          case 'publish':
            // optionally persist
            const record: StoredMessage = { topic, payload, timestamp: Date.now() };
            await store.save(record);
            // broadcast
            broadcast(topic, payload);
            break;
          default:
            ws.send(JSON.stringify({ error: 'unknown action' }));
        }
      } catch (err) {
        ws.send(JSON.stringify({ error: 'invalid message format' }));
      }
    });
  });
```

The `messages` endpoint is a simple HTTP GET endpoint that returns all stored messages (optionally filtered by topic). It uses the `getAll` method of the message store to retrieve the messages and sends them as a JSON response.

The default route (`/`) serves the `index.html` file from the `public` directory.

```typescript
  app.get('/messages', (req, res) => {
    const topic = req.query.topic as string;
    const messages = store.getAll(topic);
    res.json(messages);
  });

  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'public' });
  });
```

The last block is the server listener that starts the server on the specified port (or `3000` if no port is specified) and logs a message to the console.

```typescript
  server.listen(PORT, () => {
    console.log(`Pub/Sub WS server running at http://localhost:${PORT}`);
  });
})();
```

### Client

The client is a simple HTML page that connects to the WebSocket server and allows the user to publish and subscribe to messages.

The first block is the HTML structure of the page, which includes three input fields for the topic, message, and buttons for publishing, subscribing, and unsubscribing.

```html
  <div>
    <input id="topic" placeholder="topic" />
    <input id="message" placeholder="message" />
    <button id="publish">Publish</button>
    <button id="subscribe">Subscribe</button>
    <button id="unsubscribe">Unsubscribe</button>
  </div>
  <ul id="log"></ul>
```

The Javascript code is included in a `<script>` tag at the end of the HTML file. It creates a WebSocket connection to the server and listens for specific events.

* The `log` function is used to append messages to the log list on the page
* The `message` event handler listens for incoming messages from the server and logs them to the page
* The `publish`, event handler listens for clicks on the publish button and sends a message to the server with the topic, message, and payload
* The `subscribe` event handler listens for clicks on the subscribe button and subscribes to the specified topic
* The `unsubscribe` handler listens for clicks on the unsubscribe button and unsubscribes from the specified topic

```html
  <script type="module">
    const socket = new WebSocket(`ws://${location.host}`);
    const log = (msg) => {
      const li = document.createElement('li');
      li.textContent = msg;
      document.getElementById('log').append(li);
    };

    socket.addEventListener('message', ev => {
      const { topic, payload, timestamp } = JSON.parse(ev.data);
      log(`[${new Date(timestamp).toLocaleTimeString()}] ${topic} → ${payload}`);
    });

    document.getElementById('publish').onclick = () => {
      const topic = document.getElementById('topic').value;
      const payload = document.getElementById('message').value;
      socket.send(JSON.stringify({ action: 'publish', topic, payload }));
    };

    document.getElementById('subscribe').onclick = () => {
      const topic = document.getElementById('topic').value;
      socket.send(JSON.stringify({ action: 'subscribe', topic }));
      log(`Subscribed to ${topic}`);
    };
    document.getElementById('unsubscribe').onclick = () => {
      const topic = document.getElementById('topic').value;
      socket.send(JSON.stringify({ action: 'unsubscribe', topic }));
      log(`Unsubscribed from ${topic}`);
    };
  </script>
```

### Message Store

Right now the server uses an in-memory message store, which means that messages are lost when the server restarts. In this example, we will use a file-based message store to persist messages to disk.

The idea is that I should be able to subscribe to a topic and receive messages that were published before I subscribed.

The message store is implemented as a simple JSON file that stores messages in an array.

First we import the necessary Node built-in modules: `fs` for file system operations and `path` for resolving file paths.

Then we define the `StoredMessage` interface that represents a single stored message. It includes the topic, payload, and timestamp of the message.

```typescript
import { promises as fs } from 'fs';
import path from 'path';

export interface StoredMessage {
  topic: string;
  payload: any;
  timestamp: number;
}
```

We create a class called `FileMessageStore` that handles loading and saving messages to a JSON file.

The constructor takes a filename as an argument (defaulting to `messages.json`) and resolves the file path using the current working directory.

* The `init` method loads existing messages from the file (if any) and parses them into an array of `StoredMessage` objects
  * If the file does not exist, it initializes an empty array
* The `save` method appends a new message to the cache and writes the updated array back to the file
* The `getAll` method retrieves all stored messages, optionally filtering them by topic
  * If no topic is provided, it returns all messages

```typescript
export class FileMessageStore {
  private filePath: string;
  private cache: StoredMessage[] = [];

  constructor(filename: string = 'messages.json') {
    this.filePath = path.resolve(process.cwd(), filename);
  }

  async init(): Promise<void> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.cache = JSON.parse(data) as StoredMessage[];
    } catch (e: any) {
      if (e.code === 'ENOENT') {
        this.cache = [];
      } else {
        throw e;
      }
    }
  }

  async save(msg: StoredMessage): Promise<void> {
    this.cache.push(msg);
    await fs.writeFile(this.filePath, JSON.stringify(this.cache, null, 2), 'utf-8');
  }

  getAll(topic?: string): StoredMessage[] {
    return topic
      ? this.cache.filter(m => m.topic === topic)
      : [...this.cache];
  }
}
```

With this code, you can now persist messages to disk and retrieve them later. The `FileMessageStore` class handles loading and saving messages to a JSON file, allowing you to keep track of messages even if the server restarts.

This is a simple implementation of the pub/sub pattern using WebSockets and a file-based message store. I wouldn't recommend using this approach in high-load systems since the performance may degrade with many save operations, but it is a good starting point for understanding how the pattern works.

## Third-party brokers

Instead of implementing your own pub/sub broker you can adapt an existing one.

If you want to use a third-party broker, there are many options available. Each of these projects are actively maintained so you can pick the one whose feature set and performance profile best match your needs.

The options include:

* Apache Kafka
* RabbitMQ
* NATS
* Eclipse Mosquitto
* Apache ActiveMQ
* Apache Pulsar
* Redis Pub/Sub
* EMQX
* VerneMQ
* ØMQ (ZeroMQ)

When choosing a broker consider the following:

Performance
: Throughput, latency, and resource usage.

Scalability
: How well it handles increased load and how easy it is to scale.

Reliability
: Message durability, delivery guarantees, and fault tolerance.

Ease of use
: API design, documentation, and community support.

Integration
: Compatibility with your existing stack and libraries.

Features
: Support for advanced features like message filtering, routing, and monitoring.

Licensing
: Open-source vs. commercial, and any restrictions on usage for commercial projects.

Potential cost
: Some brokers are free to use, while others may have licensing fees or usage-based pricing.

Vendor lock-in
: Consider whether you want to be tied to a specific vendor or if you prefer an open solution that you can run anywhere.
: Even a docker solution may become expensive in a production environment.

## Things to consider

There is no standardized maximum message size in the Pub/Sub pattern. Each implementation has its own limits, which can be a consideration when choosing a broker and writing code to work with them.

Always verify the message payload size against the broker's limits to avoid runtime errors or dropped messages.

Using third-pary libraries may lock you into specific implementations and make it harder to switch to another broker in the future. It can also lock you into specific hosting providers, which may not be ideal for your use case.

## Links and References

* [Publish-Subscribe: Introduction to Scalable Messaging](https://thenewstack.io/publish-subscribe-introduction-to-scalable-messaging/)
* [The Many Faces of Publish/Subscribe](http://www.cs.ru.nl/~pieter/oss/manyfaces.pdf)
* [Apache Kafka](https://kafka.apache.org/)
* [KafkaJS](https://github.com/tulios/kafkajs)


