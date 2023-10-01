---
title: "Working with local servers"
date: "2023-03-29"
---

When doing web development, one of the biggest pains is to have a local server where we can run the code without having to manually reload the page.

This post will explore both third-party packages and built-in HTTP servers in multiple languages.

## Node

For a variety of reasons, I've chosen [Vite](https://vitejs.dev/) as my base development environment. You can choose whether to use Typescript or a framework.

In this example, we'll create a new workspace using Typescript and no framework.

To start a new project with Vite, the command will depend on the version of NPM you're using.

If you're using NPM 6.x, run the following command to install a basic Typescript project without a framework.

```bash
npm create vite@latest \
my-new-app \
--template vanilla-ts
```

If you're using NPM 7 or later, run the following command. The extra double-dash is required:

```bash
npm create vite@latest \
my-new-app -- \
--template vanilla-ts
```

Follow the prompts on the screen after Vite finishes installing the required packages.

```bash
cd my-new-app
npm install
npm run dev --open
```

This will open your default browser to the index.html document at the root of the project.

To further automate the process, add the following `scripts` block to your `package.json` file.

```js
{
  "scripts": {
    "dev": "npm run dev --open",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Note that `npm run dev --open` or `vite dev --open` will not create a production-ready build. You must run `npm run build`. This will make sure that browsers will be able to read and process your script.

## Python

Python has had a built-in web server for a while. The way you call it has changed since Python 3 was first released.

Using Python 3.11, change to the directory where you want to run the content from and execute the following command:

```bash
python -m http.server
```

This will start the server on port 8000 by default. You can override the default by passing the desired port number as an argument:

```bash
python -m http.server 9000
```

The server binds itself to all interfaces by default. The `-b/--bind` option specifies a specific address to which it should bind. Both IPv4 and IPv6 addresses are supported.

The following command causes the server to bind to localhost only:

```bash
python -m http.server --bind 127.0.0.1
```

For more information, see the [http.server](https://docs.python.org/3/library/http.server.html) module documentation.

## PHP

PHP also provides a development server as a convenience during development.

To use it, change to the directory you want to serve files from and run the following command:

```bash
php -S localhost:8000
```

You can change the port the server runs on by changing the port number after the colon, to run the server on port 4200, change the command to:

```bash
php -S localhost:4200
```

For more information see the [Built-in web server](https://www.php.net/manual/en/features.commandline.webserver.php) documentation.

## Closing thoughts

None of these servers are meant for production or for sharing outside your local development machine.

Take them for what they are and they will help you a lot during development.
