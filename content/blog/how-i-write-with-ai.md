---
title: How I Write With AI
date: 2026-02-20
tags:
  - AI
  - Writing
---

AI can be a very effective writing partner given the right context and approach. Here are two ways I use AI to enhance my writing process, along with the tools and techniques I employ.

## Tools and Setup

I use Gemini Pro via the [online UI](https://gemini.google.com/) as my LLM.

I use [Markdownlint](https://github.com/DavidAnson/markdownlint) via the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) to ensure my Markdown formatting is consistent and clean.

I use YAML front matter for metadata like title, date and tags for the Eleventy static site generator. I can add specific tools later as needed.

The following example front matter adds the default metadata (title, date, tags) as well as enabling Mermaid diagrams and YouTube embeds (it will add the appropriate scripts when rendering the page):

```yaml
---
title: How I Write With AI
date: 2026-04-13
tags:
	- AI
	- Writing
mermaid: true
youtube: true
---
```

## AI As An Editing Tool

The earliest and simplest way I use AI is as an editor.

Once you have a post near completion you can ask the AI to review it for clarity, grammar, and style. You can also ask specific questions.

A typical prompt I use for editing looks like this:

> Review the following blog post for clarity, grammar, and style. Suggest improvements where necessary. Also, check for factual accuracy and consistency in terminology.
>
> Also review for APA styles, especially for first-person vs. passive voice and inclusive language.

Then I paste the entire post, without the front matter.

Most of my posts don't use references and citations, but if they do I can add that to the prompt as well:

> Review the following blog post for clarity, grammar, and style. Suggest improvements where necessary. Also, check for factual accuracy and consistency in terminology.
>
> Also review for APA styles, first-person vs. passive voice, references, citations, and inclusive language.

I then have three options:

* Do further edits by hand on the post as it lives in Gemini
* Accept Gemini's suggested edits and export the revised post to Google Docs and then back to my blog
* Expand Gemini's suggestions into extended explanations or new sections

We can repeat this process as many times as needed until we are satisfied with the result.

!!! info  **Aside: Why export to Google Docs?**
Google Docs now has a Markdown export option that preserves the formatting, allowing me to just paste the content to my blog's Markdown file
!!!

## AI As An Exploratory Writing Tool

A more interesting way to use AI is for exploratory writing.

This works best when I have an idea or a question but don't know enough about the subject or I'm not sure how to structure the post. It usually start with a question prompt:

> Create an article explaining the differences between the Date and Temporal objects in Javascript/Typescript. Provide examples in Typescript only, don't add Javascript
>
> Also cover the parts of Temporal that the Date object doesn't cover

I tell it to use Typescript only because, my default configuration for Gemini provides both Javascript and Typescript versions of code examples so I can choose which one to remove later.

Once Gemini generates the article, I review it and can expand it further by asking to add sections or elaborate on specific points:

> add comparisons between Date and Temporal before Section 2

You can also ask clarifying questions or for more examples. In this case, Gemini got the supported versions of browsers wrong, so I asked:

> The Temporal API is supported in Firefox (139+) and Chrome (144+). While the specification is still at stage 3 in the TC39 process, it's unlikely to be changed significantly before it reaches stage 4

We can further refine the article by asking Gemini to rephrase sections, add more specific examples, or improve the flow. Once satisfied, we can export the article to Google Docs and then back to the blog. For example:

> Add a section listing all the Temporal APIs that don't have a Date equivalent.

Gemini will generate the section wherever it feels appropriate, but you can always move it around as needed.

## Automating The Workflow

You can define as many trigger phrases as you like within your "Your instructions for Gemini" (Saved Info) area. This essentially creates a "Command Menu" that I will always keep in the back of my mind.

Here is how you can structure your permanent instructions to handle multiple scenarios using triggers:

Paste a block like this into your Saved Info:

> General Style & Formatting (Always Apply):
> Follow Google Developer Documentation Style and APA 7th Edition (active voice, inclusive language).
>
> Use 2-space indentation in all code.
>
> Always provide TypeScript and JavaScript solutions for web code unless specifically told otherwise.
>
> Command Triggers:
>
> "Scaffold this:" Act as a Senior Technical Content Strategist. Create an Eleventy-ready blog post (with YAML front matter) including an H2/H3 outline and a full initial draft.
>
> "Edit this:" Act as an expert Technical Editor. Review the provided text for grammar, flow, and terminology consistency. Provide a list of suggested improvements and a revised version.
>
> "Component for:" Create a modular React or Web Component. Specify exactly where to place files and use consistent naming conventions (e.g., PascalCase for components).

You can also combine multiple triggers in a single prompt. For example:

> Scaffold this: A guide to CSS Grid. Also, create a Component for: a 3-column responsive layout to include in the post.

## Conclusion

These are the most common ways I use AI to assist in my writing process. By leveraging AI as both an editor and an exploratory tool, I can enhance the quality and depth of my content while streamlining the workflow. With the right prompts and setup, AI becomes a powerful partner in crafting well-structured and engaging articles.
