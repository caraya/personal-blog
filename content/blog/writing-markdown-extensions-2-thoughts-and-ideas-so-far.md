---
title: "Writing Markdown extensions (2): Thoughts and ideas (so far)"
date: "2021-05-19"
---

Before jumping into writing our own Markdown elements and all the complexity that goes with them, let's stop and see where we are.

Markdown rule customization gives you a lot of flexibility regarding customizing built-in rules and elements. It's an all or nothing proposition, either all elements have the attributes you're customizing or you code around to make sure only some do (like the link example where we only add attributes to external links).

Most of the time, these customizations will be enough, but not always. There may be times when we want an element that is not available on standard Markdown or we don't want to modify the default element to suit our needs because we still need it in its default form.

In that case, we'd have to write our own custom Markdown element. This is much harder than the code we've written so far because it digs deeper into Markdown-it internals and because the documentation on how to do it is scarce and almost non-existent, leaving beginners to try and figure out things from the source code.

Looking at existing plugins or the Markdown-It engine doesn't help as much as I thought it would. Markdown-it itself is well documented but it assumes you know everything that's going on and that's not always the case.

As I get more comfortable with the code I'll write another post covering the details of the process.

## When to write your own and when to trust third parties

It is likely that if you need to do something other people will want to do it too, so it begs the question: When do you write your own code and when do you use someone else's?

A related problem with Markdown-it plugins is that many of the plugins available on NPM are copies of existing packages, some scoped to specific users (instead of `package` it becomes `@user/package`) and some just forked from the original for no reason that's apparent to me. This makes it harder to figure out which package to use on your projects, making it even more tempting to write your own.

We'll cover specifics of how to write a custom plugin in a later post but as mentioned earlier, it's not an easy task because there is little to no documentation on how to do it. You're expected to understand the code well enough to make it happen.
