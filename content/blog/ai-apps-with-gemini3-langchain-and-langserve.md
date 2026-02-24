---
title: AI Apps With Gemini 3, LangChain, and LangServe
date: 2026-03-11
tags:
  - AI
  - Langchain
  - Gemini 3
  - Anthropic
  - OpenAI
---

As generative AI evolves, the tools used to orchestrate these models must also advance. Gemini 3 provides developers with a powerful new model, but raw API calls rarely suffice for production environments. To build robust applications, you need a framework that manages state, streaming, structured data, and external APIs.

This post explores how to integrate Gemini 3 with LangChain, bridge the frontend-backend gap using LangServe, and build model-agnostic applications that work across OpenAI and Anthropic.

## Gemini 3 and LangChain

LangChain supports Gemini 3 through the **@langchain/google-genai** package. Because Gemini 3 maintains compatibility with existing API infrastructure, you can often upgrade your application by simply updating the model string.

### Prerequisites

Install the necessary packages:

```bash
npm install @langchain/google-genai @langchain/core zod
```

### Basic Setup and Streaming

Latency significantly impacts user experience. In modern AI applications, you should stream responses so users do not have to wait for a full block of text. LangChain’s .stream() method handles this logic and helps future-proof your application against longer model response times.

```ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

async function runGeminiStream() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.0-pro",
    apiKey: process.env.GOOGLE_API_KEY,
  });

  console.log("--- Starting Stream ---");

  const stream = await model.stream("Explain quantum computing in one sentence.");

  for await (const chunk of stream) {
    process.stdout.write(chunk.content as string);
  }
}

runGeminiStream().catch(console.error);
```

### Structured Output with Zod

Extracting usable JSON from a Large Language Model (LLM) is a common challenge. While you can prompt Gemini for "JSON only," the results are often fragile. Using withStructuredOutput combined with Zod ensures type safety and runtime validation.

```ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const recipeSchema = z.object({
  name: z.string().describe("The name of the dish"),
  ingredients: z.array(z.string()).describe("List of ingredients"),
  prepTime: z.number().describe("Preparation time in minutes"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
});

type Recipe = z.infer<typeof recipeSchema>;

async function generateRecipe() {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.0-pro",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY,
  });

  const structuredLlm = model.withStructuredOutput(recipeSchema);
  const result = await structuredLlm.invoke("How do I make scrambled eggs?");

  console.log(`Cooking ${result.name} will take ${result.prepTime} minutes.`);
}
```


## The LangServe Architecture

Many enterprise stacks pair a fast TypeScript frontend with a Python-based data science ecosystem on the backend. LangServe wraps your Python LangChain code and deploys it as a REST API, which removes the need for manual FastAPI boilerplate.

### Step 1: The Python Server

This script runs on your backend and exposes your application logic.

```python
import uvicorn
from fastapi import FastAPI
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langserve import add_routes

# 1. Define the Chain
model = ChatOpenAI(model="gpt-4o")
prompt = ChatPromptTemplate.from_template("Explain {topic} to a 5-year-old.")
chain = prompt | model

# 2. Initialize FastAPI
app = FastAPI(
  title="AI Logic Server",
  version="1.0",
  description="An API server using LangChain's Runnable interfaces",
)

# 3. Add Routes
# This creates /explain/invoke and /explain/stream endpoints automatically
add_routes(
  app,
  chain,
  path="/explain",
)

if __name__ == "__main__":
  uvicorn.run(app, host="localhost", port=8000)
```

### Step 2: The TypeScript Client

From your frontend, the remote server behaves exactly like a local function.

```ts
import { RemoteRunnable } from "@langchain/core/runnables/remote";

async function runRemoteChain() {
  const remoteChain = new RemoteRunnable({
    url: "http://localhost:8000/explain",
  });

  const result = (await remoteChain.invoke({
    topic: "Black Holes",
  })) as { content: string };

  console.log("Response from Python:", result.content);
}
```

## Working with External APIs

Real-world applications must fetch and process external data. LangChain provides two patterns for this: a **Query Builder** for inputs and **RunnableLambda** for outputs.

### Composing Fetch Queries (The Query Builder)

Avoid asking an LLM to generate a raw URL, as this often leads to syntax errors. Instead, request structured parameters from the LLM and use your code to construct the URL safely.

```ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const searchParamsSchema = z.object({
  query: z.string(),
  status: z.enum(["active", "archived"]).optional(),
  limit: z.number().min(1).max(50).default(10),
  sortBy: z.enum(["date", "relevance"]).default("date"),
});

async function composeQuery() {
  const model = new ChatGoogleGenerativeAI({ model: "gemini-3.0-pro" });
  const queryGenerator = model.withStructuredOutput(searchParamsSchema);

  const params = await queryGenerator.invoke(
    "Find me the last 5 active user logs sorted by date."
  );

  const queryString = new URLSearchParams({
    q: params.query,
    limit: params.limit.toString(),
    sort: params.sortBy,
    ...(params.status && { status: params.status }),
  }).toString();

  console.log(`URL: /api/logs?${queryString}`);
}
```

### Processing API Results (The Runnable Pattern)

Wrap your fetch logic in a RunnableLambda to inject external data directly into a LangChain pipeline.

```ts
import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";

const apiStep = new RunnableLambda({
  func: async (input: { id: string }) => {
    // Standard fetch logic
    return { id: input.id, uptime: 99.9, logs: ["Critical Error"] };
  },
});

const chain = RunnableSequence.from([
  { api_data: apiStep },
  prompt,
  model,
]);

await chain.invoke({ id: "server-01" });
```

### Multi-Model Support

A factory function allows you to switch the "brain" of your application without altering your core business logic.

```ts
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

function getModel(provider: "google" | "openai" | "anthropic"): BaseChatModel {
  const config = { apiKey: process.env.API_KEY };

  switch (provider) {
    case "google":
      return new ChatGoogleGenerativeAI({ model: "gemini-3.0-pro", ...config });
    case "openai":
      return new ChatOpenAI({ model: "gpt-4o", ...config });
    case "anthropic":
      return new ChatAnthropic({ model: "claude-3-5-sonnet-latest", ...config });
    default:
      throw new Error("Unknown provider");
  }
}

async function main() {
  const model = getModel("openai");
  const response = await model.invoke("What is the capital of France?");
  console.log(response.content);
}
main().catch(console.error);
```

## Summary

* Gemini 3 integrates seamlessly using the gemini-3.0-pro model string.
* Structured Output with Zod is the industry standard for reliable data parsing.
* LangServe connects Python-heavy AI logic to TypeScript frontends efficiently.
* External APIs remain secure when you use the Query Builder pattern for parameter management.
* Multi-Provider Support allows you to switch models by instantiating different classes.
