---
title: New In Node 22 - Task Runner
date: 2024-05-06
tags:
  - Javascript
  - Task Runner
---

[Node 22 was recently introduced](https://nodejs.org/en/blog/announcements/v22-release-announce) as the current active version. The thing that caught my attention in the release notes is the built-in task runner.

In this post we'll look at the Node task runner available in Node 22, how it works and what are its limitations.

You run the Node Task Runner using the `--run` flag with the name of a script listed in the `package.json` located in the current directory.

For example, to run a `build` script, use the following command:

```bash
node --run build
```

The task runner, as implemented in the current release of Node 22, has two limitations:

It will not look for any other `package.json` file to run the script. If you're working in a monorepo then you'll have to move to each directory and run the script from there.
: It will append the current node_modules/.bin to the PATH when running the script, but it won’t search for the node_modules, it will just use the one in the current directory.

The task runner will also ignore any `pre` or `post` scripts.
: If you rely on these scripts you will have to modify the process to run these scripts manually before or after your task.

As mentioned in the [Node Task Runner Documentation](https://nodejs.org/docs/latest/api/cli.html#--run) the feature is under active development and may change in unexpected ways before it's deemed stable. While the task runner is usable in its current and limited form, you should be careful, and not use it for production tasks.
