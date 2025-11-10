---
title: Prompts as requirements
date: 2026-01-05
tags:
  - Prompts
  - Requirements
  - AI
---

AI introduces a new development paradigm. While using prompts seems simple, it's a classic 'garbage in, garbage out' system. The nuance of crafting a good prompt is the single biggest factor in getting a usable result, and most of us start by getting it wrong.

## What is Prompt Engineering?

> Prompt engineering is the art and science of designing and optimizing prompts to guide AI models, particularly LLMs, towards generating the desired responses. By carefully crafting prompts, you provide the model with context, instructions, and examples that help it understand your intent and respond in a meaningful way. Think of it as providing a roadmap for the AI, steering it towards the specific output you have in mind.
>
> Source: [Prompt engineering: overview and guide](https://cloud.google.com/discover/what-is-prompt-engineering?hl=en)

It is easy to write a prompt like this:

> Create a Javascript application that displays the value of a color in all color formats.

We don't tell the AI if we want a web app or a command line app, if we want a specific framework, if we want it to be interactive or static, what are valid inputs, what colors do we want to support, what third party libraries we want to use. In essence, we are telling the AI (in this case Gemini), to guess what we want and use whatever it thinks its appropriate.

This will often lead to outputs that are not what we want or require many iterations to get something usable.

Instead, a better prompt would be:

> Create a web-based Javascript application using React for the frontend that allows users to input a color in any color format supported by color.js library (hex, rgb, hsl, etc.). The application should display the equivalent color values in all color.js supported formats and include a color preview box for each format.

This prompt is more specific and provides clear requirements for the AI to follow, increasing the likelihood of generating a useful output on the first try. But it's still not good enough, there are still many details missing... we can do better.

The idea is that by adding requirements to the prompt we can get better results from the AI. This is similar to how we write requirements for software development, but in this case, we are writing requirements for the AI to follow.

to go back to the color converter example, we can add more details to the prompt:

> Create a web-based Javascript application using React for the frontend that allows users to input a color and displays the equivalent color values in the target formats. The application should:
>
> * Use the color.js library to handle color inputs and conversions.
> * Support input in all color formats supported by color.js
> * Provide output in all color formats supported by color.js that are usable in web development. For example, don't include CMYK as an output format since it's not meant for web use.
> * Include a color preview box for each output format.
> * Use React functional components to build the UI.
> * Ensure the application is responsive and works well on both desktop and mobile devices.

This prompt is much more detailed and provides clear requirements for the AI to follow. It is highy unlikely that the AI will get everything right on the first try, but with a well-defined prompt, the number of iterations required to get a usable output is significantly reduced.

### Using Requirements in Prompt Design

> Software requirements are the detailed descriptions of a software system's features, functionalities, and constraints, outlining what the system must do and how it should perform. They serve as a blueprint for developers and a communication tool for all stakeholders, ensuring the final product meets user expectations and project goals.
>
> Well-written requirements provide a shared understanding of project goals, reduce misunderstandings, and help control scope creep. They also form the basis for testing and validation, ensuring that the final product meets the intended objectives. Effective requirements gathering and management are crucial for project success, as they directly impact development time, costs, and overall user satisfaction.
>
> Source: [How to Write Good Software Requirements (with Examples)](https://www.modernrequirements.com/blogs/good-software-requirements/)

When designing prompts for AI models, incorporating software requirements principles can enhance the clarity and effectiveness of the prompts. Here are some ways to use requirements in prompt design:

Clarity, Context, and Specificity
: Clearly define what you want the AI to do, including specific functionalities and constraints. Avoid vague language to minimize ambiguity.
: Provide relevant context that helps the AI understand the task better. This could include background information, user scenarios, or examples.

Structured Format
: Organize the prompt in a structured manner, breaking down complex tasks into smaller, manageable parts.
: Use bullet points or numbered lists to outline requirements clearly.

Functional Requirements
: Specify the core functionalities you expect from the AI output. For example
: - "The application should allow users to input a color in hex, rgb, and hsl formats."
: - "The AI should generate a summary of the provided text within 100 words."

Non-Functional Requirements
: Include performance criteria, usability standards, and other quality attributes. For example:
: - "The application should load within 2 seconds on a standard broadband connection."
: - "The AI-generated content should be free of grammatical errors and maintain a professional tone."

Constraints and Limitations
: Define any constraints the AI must adhere to, such as using specific libraries or frameworks, or avoiding certain topics.

Coding with AI is an iterative process. Use feedback from the AI's outputs to refine and adjust the prompt, similar to how requirements are refined during software development.

## Putting it into Practice: The Iteration Loop

Let's continue with your "even better" prompt for the color converter. As you correctly noted, it's unlikely the AI will get it perfect on the first try. The key is that this prompt creates a fantastic first draft that we can iterate on.

Here is a simulation of that iterative workflow.

### Step 1: The Initial Requirements (Prompt v1.0)

We start by giving the AI a well-crafted prompt:

> Create a web-based Javascript application using React for the frontend that allows users to input a color and displays the equivalent color values in the target formats. The application should:
>
> * Use the color.js library to handle color inputs and conversions.
> * Support input in all color formats supported by color.js
> * Provide output in all color formats supported by color.js that are usable in web development...
> * Include a color preview box for each output format.
> * Use React functional components...
> * Ensure the application is responsive...

### Step 2: AI's First Output (v1.0) - Analysis

Let's imagine the AI generates the code. We review it and find:

* ✅ Success: It uses React functional components and state.
* ✅ Success: It imports color.js and correctly performs conversions for outputs like Hex, RGB, and HSL.
* ✅ Success: It includes color preview boxes.
* ❌ Failure (Non-Functional): The "responsiveness" requirement was met poorly. The AI used simple `<div>` tags, and on a mobile screen, the output boxes squish together instead of stacking.
* ❌ Omission (Functional): The prompt didn't specify error handling. If a user types "my-new-color" (an invalid string), the app crashes or shows a cryptic error from the color.js library.

### Step 3: Human Review & Refinement (Prompt v1.1)

Now, we use a refinement prompt. We don't resend the entire original prompt. We provide targeted feedback, treating the AI as a teammate who just submitted a pull request.

> "This is a great start, but it needs two fixes:
>
> * Fix Responsiveness: The output boxes are not responsive. Please refactor the UI. The output boxes should be in a flex container that allows them to wrap, so they stack vertically on screens smaller than 600px.
> * Add Error Handling: You didn't add error handling. Please add a try...catch block around the color.js conversion logic. If the conversion fails, set an error message in the React state and display a single, user-friendly message like 'Invalid color format' instead of the output boxes."

### Step 4: AI's Second Output (v1.1) - Analysis

The AI provides the updated code. We review it again.

* ✅ Success: The AI has wrapped the output boxes in a new div with display: flex and flex-wrap: wrap. The UI now stacks correctly on mobile.
* ✅ Success: The component now includes a `try...catch` block. It uses a new state variable `const [error, setError] = useState(null);` and conditionally renders the error message.

This v1.1 output is now 95% complete and "usable," all because our initial requirements (v1.0) were strong enough to give us a solid foundation to iterate from.

### The Takeaway

This iterative loop &mdash; Requirements -> AI Output -> Review -> Refinement Prompt &mdash; is the core workflow. A strong initial prompt (like the one you designed) minimizes the number of iterations needed to get to a high-quality, usable result.

The refinement prompts are shorter and more focused, allowing the AI to address specific issues without redoing everything from scratch.

## Conclusions: Why this matters?

Using prompts as requirements helps in achieving more accurate and relevant outputs from AI models. By applying principles of software requirements to prompt design, we can enhance the clarity, specificity, and effectiveness of our prompts. This leads to reduced iterations, improved efficiency, and ultimately better results when working with AI.

## Further reading

* [What is prompt engineering?](https://www.sap.com/resources/what-is-prompt-engineering) &mdash; SAP
* [What is prompt engineering?](https://www.ibm.com/think/topics/prompt-engineering) &mdash; IBM
* [What is Prompt Engineering?](https://aws.amazon.com/what-is/prompt-engineering/) &mdash; AWS
* [Prompt engineering: overview and guide](https://cloud.google.com/discover/what-is-prompt-engineering?hl=en) &mdash; Google Cloud
* [What is prompt engineering?](https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-prompt-engineering) &mdash; McKinsey & Company
* [Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering) &mdash; OpenAI
