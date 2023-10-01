---
title: "Generating UUIDs with Node"
date: "2021-11-01"
---

UUIDs (Universally Unique IDentifier) are also known as GUIDs (Globally Unique IDentifier). A UUID is 128 bits long and can guarantee uniqueness across space and time.

UUIDs are defined in [RFC 4122](https://www.ietf.org/rfc/rfc4122.txt).

This post will work in two ways of generating UUID V4 strings: Using the UUID package and the `randomUUID` method of the native Node Crypto package.

## The native way

Since Node 15.6.0, Node's [crypto](https://nodejs.org/api/crypto.html) module provides a method for generating v4 UUIDs.

We first import the method from the crypto module.

```js
import {
  randomUUID
} from 'crypto';
```

We then call the method to generate a UUID using the `randomUUID()` method. We assign the result to a variable.

We can then use it wherever we need. For this example, we log the UUID value to the console.

```js
const id = randomUUID();
console.log(id);
// -> 2f3476fc-0795-40e8-884a-588701b29540
```

## With the UUID package

Before Node introduced the native version, the best way to generate UUID strings is using a third-party package like [uuid](https://www.npmjs.com/package/uuid).

We first install the package; this assumes you have started the project with `npm init` or `npm init --yes`.

```bash
npm install uuid
```

We then import the `v4` method from `uuid`. We use an alias to point to `uuidv4` for clarity.

```js
import { v4 as uuidv4 } from 'uuid';
```

We use the alias (`uuidv4`) to generate a UUID and store it in a variable. We can then use it wherever we need to.

```js
const myID = uuidv4();
console.log(myID);
```

## Final Notes

`crypto.randomUUID()` was backported to Node 14.17.0 and later. If you need an earlier version of Node, your best bet is to use the `uuid` package.

To use imports in Node, I changed file extension from `.js` to `.mjs`.
