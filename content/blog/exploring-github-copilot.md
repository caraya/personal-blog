---
title: Exploring Github Copilot
date: 2026-02-16
tags:
  - AI
  - Github Copilot
  - Programming
  - Development
---

GitHub Copilot is an AI pair programmer that provides intelligent suggestions as you work. It can suggest single lines of code, entire functions, documentation, and even prose based on the context of your file and your comments. This tutorial will guide you through installing, authenticating, and using its core features in VSCode for both coding and writing.

This post will explore Github Copilot's capabilities, focusing on practical examples as well as its use as a writing assistant for documentation and blog posts.

!!! note Answers are non-deterministic
Copilot, and all other AI tools I'm aware of, generate non-deterministic outputs.

This means that if you follow the same steps multiple times, you may get different suggestions each time. The examples shown here are representative of typical outputs but may not match exactly what you see.
!!!

## Prerequisites

Before you start, you will need:

- **A GitHub Account**: Copilot is a GitHub service.
- **A GitHub Copilot Subscription**: Copilot is a paid service. GitHub offers a free trial for new users. You must sign up for a plan (either personal or business) on the GitHub website before the extension will work.
- **Visual Studio Code**: Download and install it from the official VSCode website.

## Step 1: Install the GitHub Copilot Extension

First, you need to add the Copilot extension to your VSCode editor.

1. Open VSCode.
2. Click the Extensions icon in the Activity Bar on the left side (it looks like four squares).
3. In the search bar, type GitHub Copilot.
4. You will see several extensions. Select the main one named GitHub Copilot (published by GitHub).
5. Click the Install button. This will often install GitHub Copilot Chat as well, which is highly recommended for the features we'll cover.

## Step 2: Authenticate Your Account

After installation, you must link VSCode to your GitHub account to verify your subscription.

1. After installation, a small pop-up will appear in the bottom-right corner prompting you to sign in.
2. Click Sign in to GitHub.
3. VSCode will ask for permission to sign in. Click Allow.
4. Your web browser will open, asking you to authorize VSCode to access your GitHub account.
5. Enter the device code displayed in VSCode into your browser and authorize the request.
6. Once authorized, you can close the browser tab. VSCode is now connected to your Copilot subscription.

You can also check your status by clicking the Copilot icon in the VSCode status bar (bottom-right).

## Step 3: Using Core Copilot Features

Copilot has two main ways of helping you: inline suggestions and the chat interface.

### 1. Inline Suggestions

This is the classic Copilot feature. As you type, Copilot will automatically suggest text, which appears as "ghost text" (faded text) right in your editor. This works for code and for natural language in text files (like Markdown).

- To Accept: Press the Tab key.
- To Reject: Press the Esc key.
- To See Next Suggestion: Press Alt + `]` (or Option + `]` on Mac).
- To See Previous Suggestion: Press Alt + `[` (or Option + `[` on Mac).

Example: If you type `function slugify(text) {`, Copilot will immediately suggest the entire function body.

### 2. Comment to Code Generation

This is one of Copilot's most powerful features. You write a clear, descriptive comment, and Copilot will write the code for you.

Simply write a comment, press Enter, and wait a moment. Copilot will suggest the code to implement your comment.

### 3. Requirements to Code Generation

Similar to comment to code but more detailed. You can write a list of requirements, and Copilot will generate the corresponding code.  Because you've only written requirements and have not started any code yet, results may vary more widely and you'll have to be more careful when verifying the output.

### 4. Using the Copilot Chat

The Copilot Chat view (accessible from the Activity Bar) is an even more powerful way to interact with the AI. You can ask questions, ask it to fix code, or generate new files.

- Ask for Code: You can ask it to generate code for a specific task.
  - **Prompt**: "Write a function that debounces a function call."
- Explain Code: Select a block of code in your editor, open the chat, and ask:
  - **Prompt**: /explain this selected code
- Fix Code: Select code that has a bug and ask:
  - **Prompt**: /fix this bug
- Generate Tests: Select a function and ask:
  - **Prompt**: /tests generate unit tests for this function

## Step 4: Practical Code Examples

Let's see how Copilot handles both JavaScript and TypeScript for the same task: fetching data from an API.

### TypeScript Example

Create a file named api.ts. Copilot is great at inferring or generating TypeScript interfaces.

```typescript
// File: api.ts

// 1. Start by typing this comment:
// Create a TypeScript interface for a User with id, name, and email

// 2. Press Enter. Copilot will suggest:
interface User {
  id: number;
  name: string;
  email: string;
}

// 3. Now, type this comment:
// Create an async function to fetch an array of Users from JSONPlaceholder

// 4. Press Enter. Copilot will suggest:
async function fetchUsers(): Promise<User[] | null> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return null;
  }
}

// 5. Finally, type this comment:
// Call the function and log the email of the first user

// 6. Press Enter. Copilot will suggest:
fetchUsers().then(users => {
  if (users && users.length > 0) {
    console.log(users[0].email);
  }
});
```

Now that we're done writing the code, let's see how Copilot can help you document and write about them.

## Step 5: Using Copilot as a Writing Assistant (Non-Code Tasks)

You can use Copilot as a powerful writing partner for documentation, blog posts, brainstorming, and more. The key is to work inside text-based files, especially Markdown (`.md`).

### 1. Generating Code Documentation

This is the perfect bridge between coding and writing.

**Inline Docstrings**: Go back to your api.ts file. On the line directly above the fetchUsers function, type /** and press Enter. Copilot will read the function and automatically generate a full TSDoc comment describing what it does, its parameters, and what it returns.

```typescript
/**
 * Fetches an array of users from the JSONPlaceholder API.
 *
 * @returns A Promise that resolves to an array of User objects, or null if an error occurs.
 */
async function fetchUsers(): Promise<User[] | null> {
  // ... function code ...
}
```

- **Writing READMEs**: Create a new file named README.md. You can now use Copilot to help you write your project documentation.
  - **Inline**: Type `## Installation` and press Enter. Copilot will likely suggest npm install or similar text.
  - **Chat**: Open the Copilot Chat and type: @workspace /newREADME. Copilot will scan your project and generate a complete README.md file with sections for installation, usage, and more.

You can also create a detailed requirements specification for the README and have Copilot generate it.

### 2. Writing Prose (Blog Posts, Notes, and More)

Create a file named my-article.md. You can now use Copilot's inline suggestions for writing.

- **Autocomplete Sentences**: Start writing a sentence, and Copilot will offer to complete it.
  - You type: The main advantage of using TypeScript over JavaScript is...
  - Copilot suggests: ...its static typing system, which helps catch errors at compile time. (Press Tab to accept).
- **Brainstorming Lists**: Start a list, and Copilot will add to it.
  - You type:

    ```markdown
    # Top 5 JavaScript Array Methods
    1. .map()
    2. .filter()
    Copilot will suggest: 3. .reduce()
    <!-- Press Tab, then Enter, and it will suggest 4. .forEach(), and so on -->
    ```

### 3. Using Chat as a Writing Partner

This is where Copilot truly shines as an assistant. Open the Copilot Chat view and use it to brainstorm, outline, summarize, and rewrite.

- **Outlining**:
  - Prompt: "I'm writing a blog post about 'The Rise of AI in Development.' Can you give me a 5-part outline?"
- **Summarizing**:
  - Prompt: "Summarize this article I'm pasting in: [paste long text here]"
- **Rewriting**:
  - Prompt: "Can you rephrase this paragraph to be more formal? 'Copilot is super cool and helps me code way faster. It's awesome for finding bugs.'"

## Tips for Better Suggestions

Be Specific: The more descriptive your comments are, the better the suggestion.

- **Bad**: // function for users
- **Good**: // async function to fetch a single user by id from /api/users

**Review All Code (and Text)**: Copilot is a tool, not a perfect developer or writer. Always review its suggestions for security vulnerabilities, bugs, or factual inaccuracies.

**Use the Side Panel**: If you don't like the inline suggestion, press Ctrl + Enter (or Cmd + Enter) to open a side panel with multiple (often 10+) different suggestions to choose from.

**Enable/Disable as Needed**: If Copilot is getting in your way, you can click the Copilot icon in the status bar (bottom-right) to disable it globally or just for the current language.

## Things to remember

- **Results are non-deterministic**: You may get different suggestions each time you try the same prompt.
- **Results are not guaranteed to be correct or optimal**. Always review the results and test the code thoroughly.
- **Privacy**: Be cautious about sharing sensitive or proprietary code with Copilot, as it may send snippets to GitHub's servers for processing.
