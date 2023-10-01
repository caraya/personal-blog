---
title: "Node's Permission Model"
date: "2023-05-08"
---

With the release of Node 20, the team introduces an experimental permissions API.

There are two types of permission available with this version of the API:

- **Module-based permissions** control which files or URLs are available to other modules during application execution
- **Process-based permissions** control the Node.js process's access to resources. The resource can be entirely allowed or denied, or actions related to it can be controlled

The API provides an additional layer of security. I hope that once the API is marked as stable the API would be restrictive by default, like Deno's permission system.

In this post, we'll look at Process-based permission as implemented in Node 20.0, how they work and why would they be useful.

I will create update posts when Node updates the API.

## What is this about?

The permissions API works in the command line by providing flags to control access to specific features.

The API lives behind the `--experimental-permission` flag that, when enabled, will restrict access to all available permissions.

The available permissions are documented by the [\--experimental-permission](https://nodejs.org/api/cli.html#--experimental-permission) flag.

## How does it work?

The API is opt-in so the most basic command will restrict all the supported APIs.

```bash
node --experimental-permission index.js
```

When we want to enable functionality we add flags that will enable permissions that are restricted by default.

### Child Processes

This permission control whether the script can spawn new child processes.

```bash
node --experimental-permission \
--allow-child-process index.js
```

### Workers

This permission controls whether the script can run worker threads.

```bash
node --experimental-permission \
--allow-worker index.js
```

### File System Read and Write

These flags control whether the script can read a file or write a file. Giving you finer control as to how scripts are run and how much they can do in the file system

The most basic command enables reading from everywhere in the file system for the script we want to run.

```bash
node \
--experimental-permission \
--allow-fs-read=* index.mjs
```

We can also restrict reading specific files or from specific directories. In tis example we can only read the `.gitignore` file and files from the `/tmp` directory.

```bash
node --experimental-permission \
--allow-fs-read=/tmp/,/home/.gitignore index.mjs
```

We have the same capabilities for writing files. Using a `*` we tell Node that there is no restriction on the location we can write files to. There may still be operating system-based restrictions as to where to read and write from but that's beyond this API's control.

```bash
node --experimental-permission \
--allow-fs-write=* index.mjs
```

Or we can restrict the locations that we write files to.

```bash
node --experimental-permission \
--allow-fs-write=/tmp/ index.mjs
```

We can also use the previous read and write descriptions together in the same declaration.

This example provides unrestricted read and write access and works similarly to how traditional scripts would work if the permission API was not used

```bash
node --experimental-permission \
--allow-fs-read=* \
--allow-fs-write=*  index.mjs
```

To reiterate, the valid arguments for both flags are:

- `*` - To allow full access to the given scope (read/write)
- Paths delimited by comma (,) to restrict reading/writing operations to the given paths

### Checking if permission has been granted

When the Permission API is enabled, the new `permission` property of the process object can be used to check if a certain permission has been granted at runtime.

You can check if general permission has been granted.

```js
process.permission.has('fs.write'); // true
```

Or you can query if you can write to a specific directory.

```js
process.permission.has('fs.write', '/home/nodejs/protected-folder'); // true
```

## How would this be useful?

Although this API is marked as experimental, it provides a good beginning.

Once the API stabilizes I'm hoping that it will provide functionality similar to [Deno's secure by default model](https://deno.land/manual@v1.32.5/basics/permissions) where the system is more tightly locked down and you must opt into the functionality you want/need.

That said, even the limited permission model and API in Node, provide an additional security layer that will keep you honest as to what you want to do and where you want the script to place content or read content from.

In the future, as the model matures, I hope it becomes on by default.
