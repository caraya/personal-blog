---
title: There is a limit to laziness
date: 2025-09-17
tags:
  - Opinion
  - Software Development
  - Web Development
---

One of my favorite quotes about software development comes from Larry Wall, the creator of Perl:

> We will encourage you to develop the three great virtues of a programmer: laziness, impatience, and hubris.
>
> &mdash;Larry Wall, Programming Perl (1st Edition)

As the book explains, Laziness is "the quality that makes you go to great effort to reduce overall energy expenditure. It makes you write labor-saving programs that other people will find useful and document what you wrote so you don't have to answer so many questions about it."

I agree entirely. Productive laziness &mdash; the drive to build a tool rather than repeat a task &mdash; is a cornerstone of good engineering. However, there's a fine line between this virtue and a counterproductive over-reliance on automation. This post explores the limits of laziness, why typing code is rarely the bottleneck, and what we lose when we let our tools do all the thinking.

## A Familiar Pattern of Hype

My brand of laziness means I would much rather build a reusable tool or a definitive guide than repeat myself. But this approach has its limits, especially when a new technology arrives. We often become so beholden to our new tools that we shape our work around the technology, rather than using the technology to improve our work.

This isn't a new phenomenon. I’ve seen this pattern play out before. In the mid-2000s, people flocked to Second Life, a virtual world buzzing with excitement. The technology was novel, but many projects ignored the fundamental principles of user experience and sustainable design.  A decade later, the release of the Oculus Rift in 2016 sparked a second wave of VR enthusiasm. Again, the groundbreaking hardware overshadowed the need for solid planning and design, and most of the initial hype fizzled.

AI is the latest and most powerful iteration of this pattern. From code generation to content creation, everyone is jumping on the AI bandwagon, often without a full grasp of the requirements, risks, and consequences.

## Your New Partner Has a Few Problems…

The seductive promise of AI is generating functional code from a single prompt. But this convenience masks a deeper truth: the act of writing code is often the easy part. While an AI agent can generate code, it offers no guarantee of correctness, efficiency, or security. The time saved on typing is often just shifted to time spent on verification.

The real bottlenecks in software development are found in the planning, design, and testing phases—areas that demand human creativity and expertise. We, the developers, remain accountable. This accountability is crucial, because the risks of blindly trusting AI-generated code go far beyond simple errors. They represent significant hidden costs.

### Problem #1: The Amnesiac Coder

Imagine working with a brilliant programmer who has severe short-term memory loss. This is the experience of using an AI that lacks session memory. Each new chat is a hard reset, forcing you to re-explain the project's architecture, coding standards, and context every single time. This turns iterative development into a frustrating loop. You can't ask it to "refine the last function," because it has no idea what you're talking about. For an AI to be a true partner, persistent memory isn't a luxury—it's a core requirement.

### Problem #2: The Security and Licensing Minefield

An AI trained on public code can easily reproduce insecure patterns (like SQL injection) or use deprecated libraries because it saw them in its training data. Worse, it might regurgitate code from a project with a restrictive license (like the GPL). If you unknowingly include that in your proprietary software, you're creating a legal and security time bomb. The AI won't warn you; the compliance burden is entirely yours.

### Problem #3: The Long-Term Cost of Technical Debt

An AI might solve an immediate problem with code that is overly complex, difficult to read, or ignores established design patterns. While it "works" today, it creates a maintenance nightmare for the future. This is the opposite of productive laziness; it's a shortcut that creates significantly more work down the road as developers untangle the AI-generated "spaghetti code."

## The Path Forward: From Coder to Conductor

While these pitfalls are significant, they don't mean we should abandon our new tools. Instead, they signal a fundamental shift in what makes a developer valuable.

The most valuable engineers will no longer be the fastest typists, but the best critical thinkers and system architects. The job becomes less about writing every line and more about:

* **Precise Prompting**: Articulating requirements with clarity and foresight.
* **Critical Evaluation**: Rapidly assessing AI-generated code for correctness, efficiency, and security.
* **Skillful Integration**: Weaving AI-generated pieces into a larger, coherent system.
* **Expert Debugging**: Diagnosing problems in code that you didn't write yourself.

The developer becomes a conductor, guiding an orchestra of AI tools to produce a symphony, rather than playing every instrument themselves.

## Where Productive AI Laziness Shines

This brings us back to Wall's original virtue. The goal isn't to avoid AI, but to apply it productively. When used as a deliberate tool instead of a magic wand, AI excels. Good use cases include:

* **Generating Boilerplate**: Creating skeletons for files, classes, components, or unit tests.
* **Translating and Refactoring**: Converting a function from one language to another or restructuring existing code, which a human then reviews and refines.
* **Explaining Complex Code**: Asking an AI to decipher a cryptic regular expression or a block of legacy code.
* **Automating Small Tasks**: Writing simple, isolated scripts for data transformation or file manipulation.

AI is a powerful tool for augmenting our skills, not replacing them. True laziness isn't about letting a machine think for you; it's about making the machine do the tedious work so you have more time to do the thinking that truly matters.
