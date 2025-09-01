---
title: Langgraph and Langchain on the web
date: 2025-10-13
tags:
  - Langchain
  - Langgraph
  - Machine Learning
  - Web Development
---

One of the most inspiring visions for personal computing was Apple's 1987 "Knowledge Navigator" concept video. It depicted a user interacting seamlessly with a digital assistant that could manage schedules, retrieve data, and collaborate on complex tasks. For years, integrating this level of intelligent, stateful interaction into a web application felt like science fiction. I always struggled to bridge the gap between powerful machine learning models and the dynamic, interactive nature of the web.

With the introduction of modern machine learning and agents, this has become closer to reality. LangChain.js and LangGraph.js make it even easier to create and interact with LLMs and other agents we've created.

LangChain.js provides the essential framework to connect web applications with large language models (LLMs), while LangGraph.js gives us the tools to orchestrate complex, stateful workflows with multiple AI agents. Together, they form a powerful toolkit for creating web applications that don't just respond to commands but actively assist and collaborate with users.

This post explores how to use these two libraries to build the backend for a web-based "Knowledge Navigator," an application that understands conversational language to help users solve problems by interacting with various data sources.

## What is LangChain.js?

[LangChain.js](https://js.langchain.com/docs/introduction/) is a JavaScript/TypeScript framework designed to simplify the development of applications powered by large language models (LLMs). Think of it as a set of building blocks for AI applications. Instead of making raw API calls to an LLM, LangChain provides modular components that can be "chained" together to create more sophisticated logic.

Key components include:

* **LLMs/Chat Models**: Standardized interfaces for interacting with various language models from providers like OpenAI, Google, Anthropic, etc.
* **Prompt Templates**: Tools for creating dynamic, reusable prompts based on user input.
* **Chains**: Sequences of calls, whether to an LLM, a tool, or a data source. The core idea is to combine simple components into a larger, functional whole.
* **Agents and Tools**: Agents are chains that use an LLM to decide which actions (or "tools") to take and in what order. Tools are functions that agents can use to interact with the outside world, like performing a Google search, querying a database, or calling an API.

Essentially, LangChain.js handles the boilerplate, letting you focus on the application's logic rather than the low-level details of LLM interaction.

## What is LangGraph.js?

[LangGraph.js](https://langchain-ai.github.io/langgraphjs/) is an extension of LangChain specifically designed for building complex, stateful, and potentially cyclical agentic applications. While LangChain chains are typically directed acyclic graphs (DAGs), many advanced agent workflows require loops—for instance, an agent might need to try a tool, evaluate the result, and then decide to either try a different tool or conclude its work.

LangGraph allows you to define these workflows as a graph, where each step is a node and the logic dictating the next step is an edge.

* **Nodes**: These are functions or LangChain Runnables that represent a step in the workflow (e.g., calling an agent, using a tool).
* **Edges**: These connect the nodes. Conditional edges are particularly powerful, as they can route the flow of control based on the output of a node. For example, after a "search" node, a conditional edge could check if the result is satisfactory. If yes, it moves to the "summarize" node; if not, it loops back to the "search" node with a refined query.

This structure is perfect for building multi-agent systems where agents can collaborate, delegate tasks, and iterate on a problem until a solution is found.

## How Do They Work Together?

LangChain provides the "what" (the agents, tools, and LLM connections), while LangGraph provides the "how" (the orchestration and state management). You define your agents and tools using LangChain's components, and then you wire them together as nodes within a LangGraph state machine.

The central concept is a shared state object. Each node in the graph can read from and write to this state. This allows for a persistent, evolving "memory" of the task as it progresses through the graph, enabling far more complex reasoning than a simple linear chain.

## Using Multiple Agents

For our Knowledge Navigator, a single agent isn't enough. We need a team of specialized agents that can collaborate. LangGraph makes this "society of agents" possible.

We can define a graph with a "supervisor" agent that directs tasks to other specialist agents:

* **Planner Agent**: The entry point. It receives the user's initial prompt, breaks it down into smaller steps, and maintains the overall plan in the shared state.
* **GitHub Researcher Agent**: A specialist equipped with tools to search GitHub repositories, read files, and analyze code. It's activated when the user's query involves code or software projects.
* **File Analyst Agent**: This agent handles files uploaded by the user. It can extract text, analyze data, and summarize content.
* **Final Responder Agent**: Once the plan is complete and all data has been gathered, this agent compiles the results from the shared state into a coherent, user-friendly response.

The supervisor node in the LangGraph would route the user's query to the appropriate agent based on the current step in the plan.

## Interacting with External Sources

A good agent must be able to access and process information from the world beyond its own model weights. This is where LangChain's tools become critical.

### GitHub

We can create a custom LangChain tool for our GitHub Researcher Agent that uses the GitHub API. This tool would have functions like `search_repositories(query)`, `get_file_content(repo_name, file_path)`, and `get_issues(repo_name)`. When  the Planner Agent determines that information from GitHub is needed, it dispatches the task to the GitHub Researcher, which then executes these tool calls and adds the results to the state object.

### Files Uploaded from the Local Machine

In a web backend (e.g., using Node.js with Express), you can set up an endpoint to handle file uploads. Once a file is received, its content can be passed into the LangGraph. The Planner Agent would route this to the File Analyst Agent, which would use tools like PDF parsers or text extractors to process the file's contents and update the state.

### Working with Non-Text Data

Modern applications are multi-modal. A user might upload a screenshot of an error, a PDF with diagrams, or a data visualization. LangGraph can handle this by incorporating multi-modal models like Gemini or GPT-4o.

When a user uploads an image, the File Analyst Agent can pass the image data to a vision-capable model. The model's description or analysis of the image is then converted to text and added to the state.

For example, a user could upload a chart of sales data and ask, "What's the key takeaway from this Q3 trend?"

1. The file is uploaded to the backend.
2. The Planner Agent routes the task to the File Analyst node.
3. The File Analyst node sends the image and the user's prompt to a multi-modal LLM.
4. The LLM analyzes the image and generates a text description of the trend (e.g., "Sales peaked in mid-August before declining sharply.").
5. This text is added to the state and used by the Final Responder Agent to answer the user.

By combining LangChain's modular tools with LangGraph's stateful orchestration, we can finally start building the kind of intelligent, collaborative web applications that visionaries dreamed of decades ago. The Knowledge Navigator is no longer just a concept; it's a blueprint.

## Extending the Navigator: Public vs. Private Tools

A key aspect of this architecture is understanding how to add new tools.

### Public Search with Tavily

For searching the public web, this project uses Tavily. It's a search engine optimized for AI agents and provides clean, summarized results. It is already configured in the code. To enable it, you simply need to:

1. Sign up for a free account at Tavily.com to get an API key.
2. Add that key to your `server/.env` file: `TAVILY_API_KEY="your_tavily_api_key_here"`

### Searching Private Data (e.g., LexisNexis)

You cannot use Tavily or other public search tools to access content behind a login wall (like a subscription database, your company's Notion, or a private Jira instance). These services require authentication.

To search a private data source like LexisNexis, you must build a custom API tool. The process is:

1. Check for an API: Find the official developer API for the service (e.g., the LexisNexis API). This is the designated, secure way for software to interact with their data.
2. Get API Credentials: Register your application with the service to get an API key and secret. These are separate from your personal username and password.
3. Build a Custom Tool: Create a new DynamicTool in graph.js that makes authenticated calls to that service's API. The tool would securely use your API key to fetch data on the agent's behalf.

This method ensures you are accessing data securely and programmatically, which is the correct and robust way to integrate private data sources into your agent.

## What to do if there's no API?

That's the crucial dilemma every developer in this space faces. You can't just ignore a vast portion of the web simply because it doesn't offer a convenient API.

Instead, you should adopt a more nuanced approach. Think of it as a hierarchy of data access methods, where you always start with the best option and only move down the list when necessary.

The list looks like this:

* **Level 1**: Official API (The Gold Standard)
  * **When to Use**: Always, if a suitable one exists.
  * **Why**: It's a stable, reliable, and legally sanctioned "contract" with the data provider. It's the most efficient and least fragile method.
* **Level 2**: "Hidden" or Undocumented APIs
  * **When to Use**: When there's no public API, but you can see the website's frontend making its own API calls in your browser's developer tools (under the "Network" tab).
  * **Why**: This is still an API. It's more stable than scraping the HTML, but it's not officially supported, so it could change without warning. It's a great intermediate option.
* **Level 3**: Browser Automation / Web Scraping (The Last Resort)
  * **When to Use**: Only when Levels 1 and 2 are not available. This is extremely common for:
    * **Legacy Systems**: Older government, academic, or corporate websites that were never designed for programmatic access.
    * **News & Content Aggregation**: Gathering articles or posts from various sources.
    * **Market Research**: Analyzing competitor pricing, product listings, or public sentiment on forums.
    * **Lead Generation**: Collecting publicly available business contact information.
    * **Why**: For a huge number of use cases, this is the only way to get the data. The reality is that the majority of websites do not have a public API. Avoiding scraping means you simply can't automate tasks or gather data from those sources.

## The Responsible Automation Checklist

So, if you decide you must use browser automation (Level 3), you're not "doing it wrong." You're just choosing the necessary tool for the job. However, you should do so responsibly and ethically.

Before you build a scraper, ask yourself these questions:

1. Have I Checked for an API? Did I do my due diligence and confirm there is no official or hidden API I can use?
2. Am I Allowed To Do This? I need to check the website's robots.txt file (e.g., google.com/robots.txt) and its Terms of Service. These documents will often state their policy on automated access.
3. Am I Being a Good Citizen? My script should be respectful of the website's server. This means:
   1. Go Slow: Add delays between your requests (e.g., 3-5 seconds) so you don't overwhelm their server. Scrape during their off-peak hours if possible.
   2. Identify Yourself: Set a custom User-Agent string in your script that identifies your bot and provides a way to contact you (e.g., an email address).
   3. Be Precise: Only request the pages you absolutely need and only extract the specific data required. Don't download the entire website if you just need one table.
4. Am I Handling Private Data? Only scrape publicly available information. Never attempt to scrape content that is behind a personal login or contains personally identifiable information (PII) without explicit consent.

In closing: Don't think of it as "API vs. No API." Think of it as choosing the right tool for the situation. While an API is always preferable for its stability, responsible and ethical web scraping is a perfectly valid—and often essential—technique for automation and data collection when an API is not an option.
