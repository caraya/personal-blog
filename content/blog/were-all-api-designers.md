---
title: We're all API designers
date: 2026-03-04
tags:
  - API Design
  - Design
  - Best Practices
youtube: true
mermaid: true
---

Designing APIs is hard. Designing good APIs is even harder. As web developers, we often focus on the implementation details of our applications, but the design of the APIs we create can have a profound impact on their usability, maintainability, and overall success.

We all design APIs, regardless of the type of application we're building. Whether it's a RESTful API for a web service, a GraphQL API for a mobile app, a web component, or even a simple function that other developers will use in their code, the principles of good API design apply.

This post will explore some principles of good API design and how they can be implemented in our projects, mostly taken from Lea Verou's post [Bluesky Likes](https://lea.verou.me/blog/2025/bluesky-likes/), the W3C's [Web Platform Design Principles](https://www.w3.org/TR/design-principles/), IETF's [RFC 8890](https://www.rfc-editor.org/rfc/rfc8890), Yehuda Katz's [Extend the Web Forward](https://yehudakatz.com/2013/05/21/extend-the-web-forward/) which expands on the Extensible Web Manifesto and Alex Russell's [Bedrock](https://infrequently.org/2012/04/bedrock/).

## The Basic Premise

> Simple things should be simple, complex things should be possible
>
> &mdash; Alan Kay

So, what does this mean in practice?

For Users
: Common actions (like sending an email or browsing) should be intuitive, while advanced features (like complex formulas or coding) remain accessible for those who need them

For Developers
: Tools should provide sensible defaults that make common tasks effortless, ensuring a low barrier to entry for the majority of use cases. Simultaneously, the architecture must expose deeper layers of control, allowing advanced users to customize behavior or optimize performance without hitting artificial barriers.

Related to this is the priority of constituencies, I first saw articulated in the [HTML Design Principles](https://www.w3.org/TR/html-design-principles/#priority-of-constituencies/):

> In case of conflict, consider users over authors over implementors over specifiers over theoretical purity. In other words costs or difficulties to the user should be given more weight than costs to authors; which in turn should be given more weight than costs to implementors; which should be given more weight than costs to authors of the spec itself, which should be given more weight than those proposing changes for theoretical reasons alone. Of course, it is preferred to make things better for multiple constituencies at once.

### Things that we take for granted

<lite-youtube videoId="g92XUzc1OHY"></lite-youtube>

## Do We Need To Reinvent The Wheel?

When designing an API, the first consideration should always be to ask if we need one at all. Many times, the functionality we need is already provided by the web platform or existing libraries.

Can the web do this already?
: I'm continually amazed at how often the platform already provides the functionality we need without waiting for new platform features.

If not, is there a third party library that does this well?
: If you find yourself facing a problem, you can check if someone else has faced it and already solved it.
: There is a huge ecosystem of open source libraries available for the web plaform, so it's worth checking places like [NPM](https://www.npmjs.com/), [GitHub](https://github.com/), or [CDNJS](https://cdnjs.com/) to see if a library already exists that meets your needs.

if not, can we build this as a library on top of existing web platform primitives?
: If no one has done it before, we can create a library that leverages existing web platform capabilities to achieve the goals.
: We can build higher-level abstractions on top of web primitives to create the desired functionality.

if not, can we leverage other languages to build a WASM module that can be used on the web platform?
: If the web platform lacks the necessary features, would WASM allow us to implement the functionality we need in a performant way?

If none of the above are feasible, is this something that should be proposed to the WICG for future consideration?
: The [Web Incubator Community Group (WICG)](https://wicg.github.io/) is the starting point for new web platform features developed outside formal standards bodies. If a feature is not currently feasible, it may be worth suggesting it to the WICG for future consideration.

The following flowchart summarizes the decision-making process:

```mermaid
graph TD
    %% Nodes
    Start((Start))
    Q1{Can the web do<br/>this already?}
    Q2{Is there a 3rd party<br/>library that does<br/>this well?}
    Q3{Can we build a<br/>library on existing<br/>web features?}
    Q4{Can we build a<br/>WASM module?}

    %% Outcomes
    R1[Use Native Web Platform]
    R2[Use Third Party Library]
    R3[Build Custom Library]
    R4[Build WASM Module]
    R5[Not currently feasible /<br/>Suggest in WICG]

    %% Styles
    classDef decision fill:#f9f,stroke:#333,stroke-width:2px;
    classDef result fill:#bbf,stroke:#333,stroke-width:2px;
    class Q1,Q2,Q3,Q4 decision;
    class R1,R2,R3,R4,R5 result;

    %% Logic Flow
    Start --> Q1

    Q1 -* Yes --> R1
    Q1 -* No --> Q2

    Q2 -* Yes --> R2
    Q2 -* No --> Q3

    Q3 -* Yes --> R3
    Q3 -* No --> Q4

    Q4 -* Yes --> R4
    Q4 -* No --> R5
```

## Design Principles To Consider

Prefer simple solutions (the KISS principle)
: Avoid unnecessary complexity in your API design. Whether you're looking to add a new feature or refactor an existing one, always consider if there's a simplere way to achieve the same goal.

Optimize for the 80% case
: Apply the Pareto principle (AKA: 80/20 rule). In API design, this means focusing on the most common use cases and ensuring they are easy to implement.
: You can build more advanced features on top of a solid foundation that serves the majority of users well.

Layer your complexity
: Provide a "high-level" API for beginners and a "low-level" API for power users.
: The idea is that the low-level API exposes more control and flexibility at the cost of increased complexity. Remember that it meant for users who need or want that level of control.

Consider tradeoffs between high level and low level APIs
: Choose carefully what you expose in the high level API versus what you add to the low level API.
: There are times when API designers make a mistake and leaves out a crtical feature from the high level API that forces users to drop down to the low level API more often than necessary.

Don't hide the metal
: Don't prevent users from accessing internal methods or properties if they really know what they are doing.
: But don't make it too easy to do so either. You want to encourage users to use the high level API when possible.

Apply the single responsibility principle
: Each module, class, or function should have one and only one reason to change or, phrased otherwise, it should do one thing and do it well.

Build complex types by composing simpler types
: Don't create types that do everything. Instead, create focused types that you can combine to achieve more complex behavior.

Name things thoughtfully
: Use consistent naming conventions throughout your API to reduce confusion and make it easier for users to learn and remember. Good naming can significantly improve the usability of your API.

## Examples of API Design

Each of the following examples demonstrates the principles we've discussed in this post; both the design principles and the decision-making process we went through to create these APIs.

### React Button Component

This React button component demonstrates the principles we've discussed in this post:

It provides a high ceiling by extending the native button attributes, allowing advanced users to access all the features of a standard HTML button without having to re-implement them.

It provides a low floor by offering sensible defaults for common use cases, making it easy for beginners to use the component without needing to understand all the underlying details.

It captures all other props in `...rest` and passes them down to the underlying button element. This allows advanced users to access additional features (like `aria-attributes`) without us having to manually code them.

```tsx
import React from 'react';

// Provides access to all native button attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Add our custom props here
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button = ({
  children,
  // If the user passes nothing, it behaves as a standard primary button.
  variant = 'primary',
  isLoading = false,
  className = '',
  type = 'button', // Defaulting to 'button' prevents accidental form submissions
  // We capture all other props in `...rest` and pass them down.
  ...rest
}: ButtonProps) => {

  // Logic to determine styles based on the simple 'variant' prop
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || rest.disabled}
      // Spread the rest of the props here allows the developer
      // to use advanced features (like aria-attributes)
      // without us having to manually code them.
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
```

This code makes simple things simple. If you don't need any special behavior, you can add the button like this:

```tsx
<Button>Save</Button>
```

Complex things are possible: If you need additional deatures, you can use advanced props like `aria-label`, `data-*` attributes, or event handlers. You can use as many of these as you need.

```tsx
<Button
  variant="danger"
  onClick={(e) => console.log(e)}
  aria-label="Delete Account"
  data-testid="delete-btn"
  onMouseEnter={() => prefetchData()}
>
  Delete
</Button>
```

### Fetch Wrapper

Here's a simple fetch wrapper that demonstrates the same principles:

Simple things are simple: If we just want to make a basic GET request, we can do so with no attributes or extra configuration that will return a promise of unknown data:

```ts
const data = await http('/api/users');
```

We can add more information to the request as needed, making complex things possible. Using the same code we can type the return data (in this case an array of `User` objects), specify the HTTP method, add a request body, and include custom headers like authorization tokens.

```typescript
const newUsers = await http<User[]>('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'Alice' }),
  headers: {
    'Authorization': 'Bearer token_123'
  }
});
```

The code provides sensible default for common use cases (like setting the `Content-Type` header to `application/json`), while still allowing advanced users to override these defaults by passing in their own configuration options.

You can choose what to override from the `config` object, which acts as an escape hatch for advanced users who need more control over the request.

The code assumes JSON responses by default, but a more complex version could allow users to specify how they want the response to be parsed (e.g., as text or blob) based on their needs.

```ts
// 1. The "High Ceiling"
export async function http<T = unknown>(
  url: string,
  config: RequestInit = {}
): Promise<T> {
  // 2. The "Low Floor" (Sensible Defaults)
  const headers = {
    'Content-Type': 'application/json',
    ...config.headers, // User can override or add headers
  };

  const response = await fetch(url, {
    // 3. The Escape Hatch: User options (like method: 'POST') override defaults
    ...config,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  // Assumes JSON response by default
  // In a more complex version, we could configure the response parsing here
  return response.json() as Promise<T>;
}
```

## Conclusion

When you're building an API, it's always tempting to just think about what you need right now and build that API and nothing else. It may not look like a big deal at first but, as your needs grow and change and other people start using your API, you may find yourself wishing you had designed it differently from the start.

## Reading List

* [Bluesky Likes](https://lea.verou.me/blog/2025/bluesky-likes/) &mdash; Lea Verou
* [Web Platform Design Principles](https://www.w3.org/TR/design-principles/) &mdash; W3C
* [RFC 8890](https://www.rfc-editor.org/rfc/rfc8890) &mdash; IETF
* [Alan Kay’s Approach to Accessible Complexity](https://medium.com/@mdelhaous/alan-kays-approach-to-accessible-complexity-4e3b6610cf60)
* [Extend the Web Forward](https://yehudakatz.com/2013/05/21/extend-the-web-forward/) &mdash; Yehuda Katz
* [Bedrock](https://infrequently.org/2012/04/bedrock/) &mdash; Alex Russell
