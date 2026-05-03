---
title: "AI-Generated UI and the Accessibility Prompt Problem"
date: 2026-06-26
tags:
  - AI
  - Accessibility
  - Design
---

[AI-Generated UI Is Inaccessible by Default](https://frontendmasters.com/blog/ai-generated-ui-is-inaccessible-by-default/) presents a bleak picture of the current state of accessibility in AI-generated user interfaces.

The article highlights that AI-generated UIs often lack proper semantic structure, ARIA attributes, and keyboard navigation support, making them inaccessible to users with disabilities. It also provides examples of how to incorporate accessibility into AI-generated designs.

I agree with the critique, but I think it doesn't go far enough in addressing the root cause of the issue: the lack of specificity in AI prompts when it comes to accessibility.

This post will explore the challenges of AI-generated UIs and offer some suggestions for how to produce better designs that are more inclusive and accessible. It uses a three-layer model: prompt specificity, AI tool constraints, and reusable skills.

## The Problem

When you craft prompts for AI to generate user interfaces, you often just tell it what you want, for example:

> Build a React application that does color conversions using the colorjs.io library.

This prompt is focused on the functionality of the application, but it doesn't provide any guidance on how to structure the React components, what ARIA attributes to use, how to ensure keyboard accessibility, and how to evaluate the accessibility of the final product.

### Lack Of Specificity

The core issue is that many prompts describe features but skip non-functional requirements. If you don't ask for landmarks, accessible names, focus behavior, and validation messaging, the model will usually optimize for speed and visual output instead of inclusive interaction.

Another common gap is the lack of explicit verification criteria. Without clear checks (for example, WCAG success criteria, keyboard-only flows, and screen reader smoke tests), inaccessible patterns can slip through even when the interface looks correct.

## AI Defaults Are Not Accessible

AI models are trained on vast amounts of data, and they learn to generate content based on patterns in that data. If the training data contains a lot of examples of inaccessible UIs, the AI may learn to generate similar designs, perpetuating the issue.

Another issue is that AI models may not have a deep understanding of accessibility principles, and they may not be able to generate designs that are truly inclusive without explicit guidance.

The final aspect is that the training data may not be recent enough to include the latest accessibility best practices, which can lead to outdated and inaccessible designs.

## Be Specific With Your Prompts

The first layer to fix is the prompt itself. If the model is producing inaccessible output, the fastest place to improve the result is in the instructions you give it.

When crafting prompts, you should be specific about the accessibility requirements for your application. For example, instead of just asking for a React application that does color conversions, you could say:

> Build a React application that does color conversions using the colorjs.io library, and ensure that it has proper semantic structure, includes ARIA attributes for interactive elements, and supports keyboard navigation.

You could go even further and specify the accessibility evaluation criteria that you want to verify against, for example:

> Build a React application that does color conversions using the colorjs.io library, and ensure that it has proper semantic structure, includes ARIA attributes for interactive elements, supports keyboard navigation, and passes the WCAG 2.2 AA accessibility guidelines as described in <https://www.w3.org/TR/WCAG22/> and with a checklist available at <https://www.a11yproject.com/checklist/>.

### Framework-Specific Constraints

Once the general accessibility requirements are clear, the next layer is framework-specific implementation guidance.

In addition to being specific about accessibility requirements, you can also be specific about accessibility best practices for the framework you are using. For example, if you are using React, you could specify that the AI should use the `react-aria` library to ensure that the components are accessible.

Here's what that looks like when you move from general prompt guidance to a concrete prompt instruction: tell the model to use libraries like `react-helmet-async`, `react-aria`, or `headlessui`, and to prefer semantic HTML elements with ARIA attributes only where they are needed.

That kind of instruction should lead to implementation details like the following React example using `Helmet` and `react-aria`:

```jsx
// main.jsx — HelmetProvider belongs at the app root,
// not inside individual page components.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import ColorConverter from "./ColorConverter";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HelmetProvider>
			<ColorConverter />
		</HelmetProvider>
	</StrictMode>
);
```

```jsx
// ColorConverter.jsx
import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useButton } from "react-aria";

function ConvertButton({ onConvert }) {
	const ref = useRef(null);
	const { buttonProps } = useButton(
		{
			onPress: onConvert
		},
		ref
	);

	return (
		<button {...buttonProps} ref={ref} type="button">
			Convert color
		</button>
	);
}

export default function ColorConverter() {
	const [hex, setHex] = useState("#ff0000");
	const [result, setResult] = useState("");

	const handleConvert = () => {
		// Replace this with your colorjs.io conversion logic.
		setResult(`Converted value for ${hex}`);
	};

	return (
		<main>
			<Helmet>
				<title>Accessible Color Converter</title>
				<meta
					name="description"
					content="A color converter built with accessible React patterns"
				/>
			</Helmet>

			<h1>Color converter</h1>

			<label htmlFor="hex-input">Hex color</label>
			<input
				id="hex-input"
				name="hex"
				type="text"
				value={hex}
				onChange={(event) => setHex(event.target.value)}
			/>

			<ConvertButton onConvert={handleConvert} />

			<p aria-live="polite">{result}</p>
		</main>
	);
}
```

When these implementation details start repeating across prompts, move them into shared AI tool instructions so the baseline stays consistent.

## AI Tool Constraints

If you find yourself repeating those same instructions across many requests, the next layer is to move them out of individual prompts and into project-level constraints.

One way to constrain your large language model (LLM) is to set up AI tool constraints for the AI to follow.

Good prompt wording helps on a single request, but AI tool constraints let you enforce the same accessibility expectations across an entire project.

AI tool constraints are instructions and guardrails that define how the AI should behave in your project. They can set requirements for style, accessibility, and architecture, while also defining what the model should avoid. Clear constraints reduce ambiguous output and make generated code more consistent and easier to review.

Different AI tools store these constraints in different places:

* Cursor reads rule files from `.cursor/rules/` in your project root (the legacy `.cursorrules` file is deprecated as of v0.45).
* GitHub Copilot supports `.github/copilot-instructions.md`.
* Gemini CLI stores constraints in `~/.gemini/GEMINI.md`

An example of a framework constraint for accessibility could look like this:

```markdown
# Component Generation Rules

You are generating a React component. Follow these rules strictly.

## HTML Semantics
- Use `<button>` for actions. Never `<div onClick>` or
`<span onClick>`.
- Use `<a href="...">` for navigation.
Never `<span onClick={navigate}>`.
- Use `<nav>`, `<main>`, `<aside>`, `<header>`,
`<footer>` for landmarks.
- Use `<h1>`-`<h6>` in correct hierarchical order. Do
not skip levels.
- Use `<ul>`/`<ol>` with `<li>` for lists.
- Use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` for tabular data.
- Use `<form>`, `<fieldset>`, `<legend>`,
`<label>` for forms.
- Use `<dialog>` for modal dialogs with its showModal() API.
- Use `<details>`/`<summary>` for simple disclosures when appropriate.

## Accessibility
- Every interactive element must have an accessible name
  (visible text, aria-label, or aria-labelledby).
- Every form input must have an associated `<label>` or
  `aria-label`.
- Icon-only buttons: `aria-label` on button,
	`aria-hidden` on icon.
- Decorative images: `alt=""` or `aria-hidden="true"`.
- Dynamic state: use `aria-expanded`, `aria-selected`,
	`aria-checked`, `aria-current`, `aria-disabled` as
	appropriate.
- Use `aria-live="polite"` for status messages.
- Use `aria-describedby` for help text and error
	messages.

## Keyboard Interaction
- All interactive elements must be keyboard accessible.
- Use focus-visible styles. Never remove outlines
	without replacement.
- Composite widgets: arrow keys per WAI-ARIA Authoring
	Practices.
- Modals must trap focus and restore it on close.
- Escape must close overlays.

## Motion
- Respect prefers-reduced-motion. Use motion-safe: or
  motion-reduce: Tailwind variants on transitions
	involving spatial movement (transforms, position
	changes, scaling).
- Simple color transitions on hover/focus are acceptable
  without motion guards.

## Library Preferences
- For complex patterns (tabs, combobox, dialog, listbox, menu),
  use Headless UI, Radix UI, or React Aria instead of
	building from scratch.
- Use Tailwind CSS for styling.
- Include focus-visible ring styles on all interactive
	elements.
```

These constraints are imperative. They tell the LLM exactly what to do, how to do it, and what to avoid. By setting these constraints, you can ensure that the AI-generated UI adheres to the accessibility standards you want to enforce.

The example constraints are focused on basics with React, but you can create similar constraints for other frameworks or libraries you're using.

## Converting The Prompt Into A Skill

Once you have prompt rules for individual requests and constraints for project-wide behavior, the next layer is packaging that guidance into something you can reuse across workflows.

Sooner or later you'll be working with accessibility as part of a larger AI coding workflow. At that point, a skill becomes the reusable packaging for the prompt rules and AI tool constraints you've already defined. Instead of rewriting the same accessibility requirements in every request, you can package them once and apply them consistently across multiple prompts.

[Open Agents](https://openagentskills.dev/) is a community hub for discovering and sharing reusable AI skills, and it can help you create a reusable skill for generating accessible UIs.

Rather than just writing a one-off prompt, you can create a skill that encapsulates those accessibility guidelines, framework preferences, and review expectations. You can then invoke that skill in any prompt where you want to generate an accessible UI, and you can also call it from other skills or agents.

* [Base accessibility skill](https://github.com/caraya/agent-skills/blob/main/skills/accessibility-core/SKILL.md)
* [React accessibility skill](https://github.com/caraya/agent-skills/blob/main/skills/accessibility-react/SKILL.md)

The two skills above are examples of reusable skills that you can invoke from any prompt, giving you a consistent set of accessibility guidelines to follow when generating UIs with AI.

## Conclusion: Use AI As A Tool, Not A Replacement

AI is a tool that can assist in generating user interfaces, but it is not a replacement for human designers and developers. While AI can help to generate designs quickly, it is unlikely to produce designs that are truly inclusive and accessible without explicit guidance. You should be explicit about what you ask AI to do, and you should always review the generated designs to ensure that they meet the accessibility standards you want to enforce.

## References

* [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
* [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
* [Here’s how to instruct a LLM to reference the ARIA Authoring Practices Guide](https://ericwbailey.website/published/heres-how-to-instruct-a-llm-to-reference-the-aria-authoring-practices-guide/). Supplemental guidance only; use it to inform how to consult APG. Treat WCAG and APG as the authoritative sources.
