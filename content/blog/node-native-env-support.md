---
title: Node native .env support
date: 2023-10-16
---

Starting in [Node 20.6.0](https://nodejs.org/en/blog/release/v20.6.0) there is built-in support for loading environment variables from a `.env` file into [process.env](https://nodejs.org/docs/latest/api/process.html#process_process_env) as recommended in [The Twelve-Factor App](http://12factor.net/config) methodology.

In this post we'll talk about .env, what it is, why use it, and how it works in Node.

## What is .env file  and why use it?

An `.env` file contains all configuration files for your application like passwords, API keys and other potentially sensitive information.

The idea comes from the [Twelve-Factor App Methodology](https://12factor.net/) that suggest that we store config in environment variables.

These environment variables are easy to change and they won't be checked in to version control. They are also language-neutral. They should also be OS-neutral but Windows may not always work like Linux and Mac do.

You can also create different `.env` configurations for your development, testing and production environments.

There are situations where we can't set Environment Variables manually like in Github Actions or other CI/CD pipelines. That's where `.env` files come in handy. The file has all the values for the specific environment you're working with.

An example `.env` file looks like this:

```text
PASSWORD=supersecret
API_KEY=84de8263ccad4d3dabba0754e3c68b7a
```

As long as you don't check the `.env` files into your source code respository, the information will remain private and your app will be more secure.

## How does it work

Until now we've had to use external packages like [dotenv](https://www.npmjs.com/package/dotenv) to work with `.env` files in Node.

Native support means that we don't need these third-party tools. We can load the `.env` file directly into Node by passig the `--env-file` flag with the name of the `.env` file (named `.env` by default but can be any name you want).

```bash
node --env-file .env
```

Once the file is loaded you can use the properties as any other property in `node.process.env`.

Using this `.env` file, called `.env`:

```text
PASSWORD=supersecret
API_KEY=84de8263ccad4d3dabba0754e3c68b7a
```

We can load it using the `--env-file` flag, as discussed earlier

```bash
node --env-file .env
```

And then query the variables in the file just like you would query any other environment variables.

Note that loading the `.env` file will also work on the Node REPL, as shown below using Node 20.7.0.

```bash
node --env-file .env
Welcome to Node.js v20.7.0.
Type ".help" for more information.
> console.log(process.env.PASSWORD)
supersecret
undefined
> console.log(process.env.API_KEY)
84de8263ccad4d3dabba0754e3c68b7a
undefined
>
```

In Node 20.7.0 (the latest version as I write this), you can provide load multiple `.env` files. The second and subsequent `.env` files will override properties with the same name.

## Caveats

Node's native .env implementation lacks some features available in the [dotenv](https://github.com/motdotla/dotenv) package like:

* You cannot currently use [multiline values](https://github.com/motdotla/dotenv#multiline-values)
* You cannot use [variable expansion](https://github.com/motdotla/dotenv-expand)

Despite the lack of some features, Node's native implementation has an advantage over third-party packages: Since Node.js loads and parses the `.env` file as it is starting up, you can include environment variables that configure Node.js itself, like `NODE_OPTIONS`.

So, you can have an `.env` file that looks like this:

```bash
NODE_OPTIONS="--no-warnings --inspect=127.0.0.1:9229"
```

Then, when you run node `--env-file = .env` the process will run without emitting warnings and it will activate the inspector on the IP address 127.0.0.1:9229.

To avoid infinite loops, you cannot put `NODE_OPTIONS="--env-file .env` in your `.env` file.
