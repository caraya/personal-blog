---
title: Programming notes and principles
date: 2026-02-02
tags:
  - Best Practices
  - Mental Models
---

Over the years I've collected a set of principles and mental models that I constantly try to apply when writing code (successfully and unsuccessfully). These are not specific to any one programming language or framework, but rather general guidelines that help improve code quality, maintainability, and developer productivity.

The post will cover some background, information about each principle or model and code examples where applicable.

## Background

In software development, we are often torn between conflicting advice. The ones I hear most often are:

[Don't Repeat Yourself (DRY)](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
: This principle urges reducing repetition of information which is likely to change, replacing it with abstractions that are less likely to change, or using [data normalization](https://en.wikipedia.org/wiki/Data_normalization) which avoids redundancy in the first place.

[You Aren't Gonna Need It (YAGNI)](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it)
: This warns against building features or abstractions for hypothetical future use cases.
: As a beginner developer, it's always tempting to build a complex system that "might be useful later." This often leads to wasted effort and unnecessary complexity.

[Premature Optimization is the root of all evil](https://dtunkelang.medium.com/premature-optimization-is-still-the-root-of-all-evil-a3502c2ea262)
: This suggests that optimizing code before it is necessary is a waste of resources.
: Write the code first, without any optimization. Once the code is working and you have real data to test with, then evaluate if optimizations are needed.

## The Rule of Three (Pragmatic Abstraction)

Balancing these rules is difficult. The Rule of Three offers a concrete trigger point for when to stop copying and start abstracting.

### The Principle

> Do not refactor, abstract, or generalize functionality until you have written the exact same code three times.

* **First time**: Just write the code to solve the immediate problem. Do not think about reuse. If you are building a specific button, build that button.
* **Second time**: Copy and paste the code. Yes, literally duplicate it. Make the minor changes needed for the second use case. It feels wrong, but duplication is cheaper than the wrong abstraction.
* **Third time**: You now have three distinct examples of how this logic is used. You have enough context to spot the actual patterns versus the coincidental ones. Now—and only now—refactor the three instances into a single, shared abstraction.

### Why it works

The danger of abstracting too early (on the second instance) is that you often guess wrong about what the shared logic actually is. You end up creating a rigid structure based on a coincidence rather than a pattern.

### The Cost of "Un-Abstracting"

It is significantly harder to dismantle a bad abstraction than it is to create a new one. When you have a bad abstraction, every new feature requires adding more configuration flags (boolean props) to the shared code, eventually creating a monster that no one understands.

### Example of Premature Abstraction

Imagine you have a `UserCard` and a `ProductCard`. They look similar (title, image, subtitle), so you merge them into a `GenericCard` immediately.

* **Phase 1**: It works fine. `GenericCard` takes a title and image.
* **Phase 2**: ProductCard needs a "Buy" button. You add if (type === 'product') to `GenericCard`.
* **Phase 3**: UserCard needs an avatar with a green "online" dot. You add `if (type === 'user')`.
* **Phase 4**: A NewsCard is introduced, which needs a date but no image. Now your `GenericCard` props look like: `showImage`, `isNews`, `hasButton`, `date`, `onlineStatus`.

Suddenly, you have a component full of conditional logic that is brittle and hard to maintain. If you had waited for the Rule of Three, you might have realized that they shouldn't be the same component at all, but perhaps they just share a common styling wrapper or CSS class.

```typescript
// ❌ PREMATURE ABSTRACTION (BAD)
// This component knows too much. Notice how many optional props (?)
// are needed to support all the different use cases.

import React from 'react';

interface GenericCardProps {
  title: string;
  image?: string;
  subtitle?: string;
  type: 'product' | 'user' | 'news';
  // Specific to Product
  onBuy?: () => void;
  // Specific to User
  onlineStatus?: 'online' | 'offline' | 'away';
  // Specific to News
  date?: string;
}

export const GenericCard: React.FC<GenericCardProps> = ({
  title,
  image,
  subtitle,
  type,
  onBuy,
  onlineStatus,
  date
}) => {
  return (
    <div className="card">
      {image && <img src={image} alt="" />}

      <div className="content">
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}

        {/* Conditional Logic Hell */}
        {type === 'product' && onBuy && (
          <button onClick={onBuy}>Buy Now</button>
        )}

        {type === 'user' && onlineStatus && (
          <div className={`status-dot ${onlineStatus}`} />
        )}

        {type === 'news' && date && (
           <span className="date">{date}</span>
        )}
      </div>
    </div>
  );
};
```

## The Priority Triad: Work, Right, Fast

When writing a new feature, developers often feel an internal pressure to write code that is perfectly optimized, clean, and elegant on the very first pass. This perfectionism paralyzes progress and leads to "analysis paralysis."

Instead, follow this strict, linear order of operations, widely attributed to Kent Beck:

### Make it Work

Focus solely on solving the problem. The code can be ugly. You can put all your logic in one file. You can use global variables if you must. The goal is to prove that the solution is possible and to get the feature functioning. This is effectively "prototyping in production."

* **Mental Check**: "Does clicking the button actually save the data?"
* **Action**: Ignore linting rules (temporarily), write long functions, use console.log everywhere.

### Make it Right

Now that it works, clean it up. This is where 80% of your development time should actually be spent.

* **Refactor**: Break the code into smaller functions and components.
* **Guard Rails**: Handle edge cases (what if the data is null? What if the network fails?).
* **Clarity**: Fix variable names to be descriptive. Replace x and data with userProfile and fetchedProductList.
* **Robustness**: Add types (TypeScript) and write unit/integration tests.
* **Accessibility**: Ensure keyboard navigation and screen readers are supported.

Now the mental check is: "Is this code reliable, readable, and maintainable?"

### Make it Fast

Only after the code is working and reliable should you look at performance. Most of the time, "Making it Right" solves performance issues naturally by organizing logic better.

* **Measure First**: Don't guess. Use the Chrome Profiler or React DevTools to find actual bottlenecks.
* **Optimize**: Implement memoization, virtualization, or algorithm improvements.

A new mental check: "Is the user experience sluggish?"

### Key Takeaway

Never try to "Make it Fast" before you "Make it Work." You cannot optimize code that doesn't exist. Furthermore, optimizing buggy code just means you have highly efficient bugs.

## Gall's Law & The "Crappy" First Version

Gall's Law states:

> "A complex system that works is invariably found to have evolved from a simple system that worked. A complex system designed from scratch never works and cannot be patched up to make it work."

This helps explain why "rewrites" in software often fail. If you try to design a complex system (like a massive dashboard application) from scratch to handle every possible future scenario, you will fail. The result will be buggy, hard to maintain, and delivered late because you are trying to solve problems you don't even have yet.

### The Strategy

**Embrace the MVP (Minimum Viable Product)**: Build the smallest, simplest version of the system that provides value. It might be ugly, but it functions.

**Iterate**: Add complexity layer by layer.

* **Step 1**: A button that logs "Clicked" to the console.
* **Step 2**: The button calls the API.
* **Step 3**: The button handles success/error states.
* **Step 4**: The button shows a loading spinner.
* **Step 5**: The button includes optimistic UI updates.

**Avoid the "Second System Effect"**: This occurs when a team decides to rewrite a legacy system and tries to include every feature they ever wanted in the new version immediately. This almost always leads to disaster.

Start simple. Get it working. Then evolve it.

## Idempotency

The Principle:

> A function is idempotent if it produces the exact same result when called multiple times with the same arguments. It essentially means the operation can be repeated without changing the result beyond the initial application.

Examples:

* **Idempotent (Good)**: `"hello".toUpperCase()` always returns "HELLO".
* **Idempotent (Good)**: Setting a user's status with `user.isActive = true`. If you run this line 100 times, the user is still just active. The state is stable.
* **NOT Idempotent (Risky)**: Toggling a boolean: `user.isActive = !user.isActive`. If you run this twice, the user is active, then inactive. The outcome depends on how many times you ran it.
* **NOT Idempotent (Risky)**: Sending a generic POST request that creates a duplicate record every time the user clicks "Submit" because of a shaky internet connection.

Code Example: Shopping Cart

This example illustrates the danger of non-idempotent logic when a user clicks a button multiple times (e.g., via a slow network or "rage clicking").

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
}

// ❌ NOT IDEMPOTENT (BAD)
// If the user clicks "Add" twice quickly, the item is added twice.
function addItemToCartBad(cart: CartItem[], newItem: CartItem): CartItem[] {
  return [...cart, newItem];
}

// ✅ IDEMPOTENT (GOOD)
// No matter how many times the user clicks, the item only appears once.
// We check if the result already exists before applying the change.
function addItemToCartGood(cart: CartItem[], newItem: CartItem): CartItem[] {
  const exists = cart.find(item => item.id === newItem.id);

  if (exists) {
    return cart;
  }

  return [...cart, newItem];
}
```

### Why it matters for Front-End

Idempotency is crucial for stability in UI development, particularly with libraries like React. Specific areas of concern include:

* **Debugging**: If a function is idempotent, you can treat it as a "black box." You don't need to know the history of the application (e.g., "did the user click this twice?") to know what the function will do.
* **Resilience**: If a network request fails and retries, an idempotent API endpoint ensures you don't create double charges or duplicate database entries. Ideally, your API PUT requests should replace the resource, not append to it.
* **React useEffect**: React 18's Strict Mode intentionally runs effects twice in development to stress-test your components. If your setup/cleanup logic isn't idempotent, your UI will break (e.g., two chat connections opening, or data being fetched twice and duplicated in a list).

## Single Responsibility Principle (SRP)

### The SRP Principle

> A function, module, or component should have only one reason to change. I've also heard heard it phrased as "Do one thing and do it well."

### The Litmus Test

* Try to describe what your function or component does in one sentence.
* If you use the word "and", it likely breaks SRP.

**Bad**: "This function fetches the user and filters for active users and updates the DOM and handles error toasts."

**Good**: "This function fetches the user."

### Practical Application

Imagine an API utility file in a front-end project.

**Violation**: A function getFormattedUserData() that calls the API, reformats the date string from ISO to human-readable, and sorts the list by name.

**Why it's bad**: You have to edit this file if the API URL changes. You also have to edit this file if the designer decides dates should look different. You also have to edit it if the product manager decides the sorting should be by "Last Active."

#### Solution: Split it into composed functions

* **fetchUsers()**: Only cares about the network request.
* **formatUserDate()**: Only cares about date formatting logic.
* **sortUsers()**: Only cares about sorting algorithms.

By decoupling these, you isolate change. If the API changes, you only risk breaking the fetcher, not the date formatter. This makes testing significantly easier because you can test the formatUserDate function without mocking an entire network call.

#### Code Example

This code translates the "API Utility" scenario above into practice.

```typescript
interface ApiUser {
  id: string;
  name: string;
  joinedAt: string; // ISO Date String "2023-01-01T00:00:00Z"
}

interface FormattedUser extends ApiUser {
  joined: string; // Formatted date "1/1/2023"
}

// ❌ VIOLATION: Mixed Responsibilities
// This function is fragile. It breaks if the API changes OR if the date format requirements change.
async function getFormattedUserDataBad(): Promise<FormattedUser[]> {
  // Responsibility 1: Fetching
  const response = await fetch('[https://api.example.com/users](https://api.example.com/users)');
  const users: ApiUser[] = await response.json();

  // Responsibility 2: Formatting AND Responsibility 3: Sorting
  return users
    .map(user => ({
      ...user,
      joined: new Date(user.joinedAt).toLocaleDateString()
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ✅ FIXED: Composed Single-Purpose Functions

// Responsibility 1: Fetching
// Only changes if the API endpoint or auth logic changes
async function fetchUsers(): Promise<ApiUser[]> {
  const response = await fetch('[https://api.example.com/users](https://api.example.com/users)');
  return response.json();
}

// Responsibility 2: Formatting
// Only changes if the UI design (date format) changes
function formatUserDates(users: ApiUser[]): FormattedUser[] {
  return users.map(user => ({
    ...user,
    joined: new Date(user.joinedAt).toLocaleDateString()
  }));
}

// Responsibility 3: Sorting
// Only changes if the sorting requirement changes (e.g., sort by ID instead of Name)
function sortUsersByName(users: FormattedUser[]): FormattedUser[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

// Orchestrator: Connects the pieces without implementing them
// This is the "glue" code.
async function getFormattedUserDataGood(): Promise<FormattedUser[]> {
  const users = await fetchUsers();
  const formatted = formatUserDates(users);
  return sortUsersByName(formatted);
}
```

## Single Level of Abstraction

This is a subtle but powerful sibling to SRP. A function should not only do one thing, but it should also operate at one consistent level of detail.

### The Anti-Pattern

Mixing low-level implementation details (like parsing JSON, iterating arrays manually, or hitting a database) with high-level business logic (like "Process User Subscription") in the same function.

This forces the reader's brain to context-switch rapidly between "what is the business goal?" (High Level) and "how does the syntax work?" (Low Level).

```typescript
interface ApiUser {
  id: string;
  name: string;
  joinedAt: string; // ISO Date String "2023-01-01T00:00:00Z"
}

interface FormattedUser extends ApiUser {
  joined: string; // Formatted date "1/1/2023"
}

// ❌ VIOLATION: Mixed Responsibilities
// This function is fragile. It breaks if the API changes OR if the date format requirements change.
async function getFormattedUserDataBad(): Promise<FormattedUser[]> {
  // Responsibility 1: Fetching
  const response = await fetch('https://api.example.com/users');
  const users: ApiUser[] = await response.json();

  // Responsibility 2: Formatting AND Responsibility 3: Sorting
  return users
    .map(user => ({
      ...user,
      joined: new Date(user.joinedAt).toLocaleDateString()
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ✅ FIXED: Composed Single-Purpose Functions

// Responsibility 1: Fetching
// Only changes if the API endpoint or auth logic changes
async function fetchUsers(): Promise<ApiUser[]> {
  const response = await fetch('[https://api.example.com/users](https://api.example.com/users)');
  return response.json();
}

// Responsibility 2: Formatting
// Only changes if the UI design (date format) changes
function formatUserDates(users: ApiUser[]): FormattedUser[] {
  return users.map(user => ({
    ...user,
    joined: new Date(user.joinedAt).toLocaleDateString()
  }));
}

// Responsibility 3: Sorting
// Only changes if the sorting requirement changes (e.g., sort by ID instead of Name)
function sortUsersByName(users: FormattedUser[]): FormattedUser[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

// Orchestrator: Connects the pieces without implementing them
// This is the "glue" code.
async function getFormattedUserDataGood(): Promise<FormattedUser[]> {
  const users = await fetchUsers();
  const formatted = formatUserDates(users);
  return sortUsersByName(formatted);
}
```

### The Fix

Break the code into functions that sit at the same level of abstraction. The main function should read like a story, a recipe, or a table of contents.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  hasActiveSubscription: boolean;
}

// Mock services for the example
const db = {
  query: async (sql: string): Promise<User> => ({ id: 1, name: 'John', email: 'john@example.com', hasActiveSubscription: true })
};
const emailClient = {
  send: async (to: string, body: string) => console.log(`Sending to ${to}: ${body}`)
};

// ❌ BAD: Mixed levels of abstraction
async function processUserSubscriptionBad(userId: number) {
  // Level 1: Low-level DB access details
  // The reader has to parse SQL to understand what's happening.
  const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);

  // Level 2: High-level business logic
  if (user.hasActiveSubscription) {

    // Level 1: Low-level string manipulation and external service calls
    // The reader gets lost in fetch headers and JSON stringification.
    const emailBody = `Hi ${user.name}, thanks for staying with us!`;
    await fetch('https://api.emailservice.com/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: user.email, body: emailBody })
    });
  }
}

// ✅ GOOD: Consistent levels of abstraction

// Low Level: Database interaction
// This function hides the SQL complexity.
async function getUser(id: number): Promise<User> {
  return await db.query(`SELECT * FROM users WHERE id = ${id}`);
}

// Low Level: Email service interaction
// This function hides the HTTP fetch complexity.
async function sendThankYouEmail(user: User): Promise<void> {
  const body = `Hi ${user.name}, thanks for staying with us!`;
  await emailClient.send(user.email, body);
}

// High Level: Orchestration
// This function only knows "Users" and "Emails".
async function processUserSubscriptionGood(userId: number): Promise<void> {
  const user = await getUser(userId);

  if (user.hasActiveSubscription) {
    await sendThankYouEmail(user);
  }
}
```

In the "Good" example, `processUserSubscriptionGood` is the Orchestrator. It reads clearly: "Get the user. If they are active, send an email." If you need to know how the email is sent, you can dig into that specific function. This greatly reduces cognitive load when reading code and helps you find bugs faster.

## Version Specificity

When writing code, especially in shared codebases or libraries, you must be aware of the context in which your code runs. This means knowing the versions of dependencies, frameworks, or languages you are using and ensuring your implementation is compatible.

### Why it matters

Copying code from a tutorial without checking the version is a classic "intermediate developer" trap. Frameworks evolve. They introduce breaking changes, deprecate features, or introduce new paradigms (like React Server Components) that fundamentally change how code is executed.

If you blindly copy "modern" code into a "legacy" codebase (or vice versa), you will encounter baffling errors.

### Example: React 19 vs. React 18

The following architecture demonstrates a "modern" approach using React Server Actions. This code works perfectly in a Next.js App Router project using React 19 features, but it will crash immediately in a standard React 18 SPA (Single Page Application).

#### The "Modern" Implementation (React 19 / Next.js)

##### The Server Action (The "Backend")

Runs strictly on the server ('use server').

```typescript
'use server';

import { revalidatePath } from 'next/cache';

// Mock database (reset when server restarts)
let globalLikeCount = 42;

export async function incrementLikes() {
  // 1. Simulate a network/database delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // 2. Mutate the data
  globalLikeCount += 1;

  // 3. Revalidate the path
  revalidatePath('/');
  return globalLikeCount;
}

export async function getLikeCount() {
  return globalLikeCount;
}
```

##### The Client Component (The "Interactivity")

Runs in the browser ('use client'). Note the use of useTransition for async actions.

```typescript
'use client';

import { useTransition } from 'react';
import { incrementLikes } from '../app/actions';

interface LikeButtonProps {
  count: number;
}

export default function LikeButton({ count }: LikeButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      // Direct server function invocation (magic!)
      await incrementLikes();
    });
  };

  // Defining the style outside prevents "double curly brace" conflicts
  // with some template engines like Liquid/Nunjucks in static site generators.
  const buttonStyle = {
    opacity: isPending ? 0.5 : 1
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={buttonStyle}
    >
      {isPending ? 'Saving...' : `♥ ${count} Likes`}
    </button>
  );
}
```

### The Backward Compatibility Trap

If you paste the code above into a React 18 codebase (e.g., standard Vite or Create React App), it will fail for multiple reasons:

1. Direct Async Components: React 18 does not support `async function Page()`. It expects components to return JSX immediately, not a Promise.
    * Error: Objects are not valid as a React child (`found: [object Promise]`).
2. Directives: `'use server'` and `'use client'` are instructions for specific bundlers (like Webpack/Turbopack in Next.js). Standard client-side React 18 builds do not know how to separate these or create API endpoints automatically.
3. Removed APIs: React 19 removes legacy features that older codebases might rely on.

| Feature | Status in React 19 | Replacement |
| :---: | :---: | --- |
| ReactDOM.render | **Removed** | Use `ReactDOM.createRoot` (introduced in v18) |
| defaultProps | **Removed**<br>(functional) | Use ES6 default parameters: `function MyComponent({ val = 10 })` |
| ref as **prop** | Changed | No more `forwardRef`. Just pass `ref` as a normal prop. |
