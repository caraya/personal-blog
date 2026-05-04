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

## The problem

When you craft prompts for AI to generate user interfaces, you often just tell it what you want, for example:

> Build a React application that does color conversions using the colorjs.io library.

This prompt is focused on the functionality of the application, but it doesn't provide any guidance on how to structure the React components, what ARIA attributes to use, how to ensure keyboard accessibility, and how to evaluate the accessibility of the final product.

### Lack of specificity in prompts

The core issue is that many prompts describe features but skip non-functional requirements. If you don't ask for landmarks, accessible names, focus behavior, and validation messaging, the model will usually optimize for speed and visual output instead of inclusive interaction.

Another common gap is the lack of explicit verification criteria. Without clear checks (for example, WCAG success criteria, keyboard-only flows, and screen reader smoke tests), inaccessible patterns can slip through even when the interface looks correct.

## AI defaults are not accessible

AI models are trained on vast amounts of data, and they learn to generate content based on patterns in that data. If the training data contains a lot of examples of inaccessible UIs, the AI may learn to generate similar designs, perpetuating the issue.

Another issue is that AI models may not have a deep understanding of accessibility principles, and they may not be able to generate designs that are truly inclusive without explicit guidance.

The final aspect is that the training data may not be recent enough to include the latest accessibility best practices, which can lead to outdated and inaccessible designs.

## Be specific with your prompts

The first layer to fix is the prompt itself. If the model is producing inaccessible output, the fastest place to improve the result is in the instructions you give it.

When crafting prompts, you should be specific about the accessibility requirements for your application. For example, instead of just asking for a React application that does color conversions, you could say:

> Build a React application that does color conversions using the colorjs.io library, and ensure that it has proper semantic structure, includes ARIA attributes for interactive elements, and supports keyboard navigation.

You could go even further and specify the accessibility evaluation criteria that you want to verify against, for example:

> Build a React application that does color conversions using the colorjs.io library, and ensure that it has proper semantic structure, includes ARIA attributes for interactive elements, supports keyboard navigation, and passes the WCAG 2.2 AA accessibility guidelines as described in <https://www.w3.org/TR/WCAG22/> and with a checklist available at <https://www.a11yproject.com/checklist/>.

### Framework-specific constraints

Once the general accessibility requirements are clear, the next layer is framework-specific implementation guidance.

In addition to being specific about accessibility requirements, you can also be specific about accessibility best practices for the framework you are using. For example, if you are using React, you could specify that the AI should use the `react-aria` library to ensure that the components are accessible.

Here's what that looks like when you move from general prompt guidance to a concrete prompt instruction: tell the model to use libraries like `react-helmet-async`, `react-aria`, or `headlessui`, and to prefer semantic HTML elements with ARIA attributes only where they are needed.

That kind of instruction should lead to implementation details like the following React example using `Helmet` and `react-aria`:

Wrap the root element in `HelmetProvider` to enable document head management across the app.

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

Use `Helmet` in the component to set a descriptive title and meta description for accessibility and SEO. Use `useButton` from `react-aria` to create an accessible button that supports keyboard navigation and screen readers. Use semantic HTML first, then add ARIA only where needed.

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

## AI tool constraints

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
# Component generation rules

You are generating a React component. Follow these rules strictly.

## HTML semantics
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

## Keyboard interaction
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

## Library preferences
- For complex patterns (tabs, combobox, dialog, listbox, menu),
  use Headless UI, Radix UI, or React Aria instead of
	building from scratch.
- Use Tailwind CSS for styling.
- Include focus-visible ring styles on all interactive
	elements.
```

These constraints are imperative. They tell the LLM exactly what to do, how to do it, and what to avoid. By setting these constraints, you can ensure that the AI-generated UI adheres to the accessibility standards you want to enforce.

The example constraints are focused on basics with React, but you can create similar constraints for other frameworks or libraries you're using.

### What to do when the model ignores your constraints

You have three strategies for when the model ignores your constraints:

1. **Targeted follow-up**: Don’t regenerate from scratch. Prompt with a specific correction: “The Account toggle is a `div` with `onClick`. Replace it with a `button` and add `aria-expanded` and `aria-controls`.”
2. **Audit prompt**: After generation: “Audit this component for WCAG 2.1 AA violations and fix all issues. Check the code using the constraints we defined.” Models review code more reliably than they generate correct code from scratch.
3. **Manual checklist**: Before committing, are there interactive elements `<button>` or `<a>`? Do toggles have `aria-expanded`? Can you Tab to and activate every control? Do landmarks and headings exist? Do icons have `aria-hidden`? Two minutes.

## Static analysis tools

Use static analysis to catch accessibility issues before runtime.

A practical default is [ESLint](https://eslint.org/) with [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y), which works well in JavaScript and TypeScript UI projects.

Concrete example (static analysis layer):

```json
{
	"scripts": {
		"lint:a11y": "eslint \"src/**/*.{js,jsx,ts,tsx}\""
	}
}
```

Basic ESLint 9+ flat configuration:

```js
// eslint.config.js
import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
	js.configs.recommended,
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"jsx-a11y": jsxA11y
		},
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			},
			globals: {
				...globals.browser
			}
		},
		rules: {
			...jsxA11y.configs.recommended.rules,
			"jsx-a11y/alt-text": "error",
			"jsx-a11y/label-has-associated-control": "error",
			"jsx-a11y/no-static-element-interactions": "warn"
		}
	}
];
```

Install the required packages: `npm i -D eslint @eslint/js eslint-plugin-jsx-a11y globals`.

Run `npm run lint:a11y` in CI and fail the build on unresolved accessibility lint errors.

## Runtime testing

[Playwright](https://playwright.dev/) with [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright) is a good framework-agnostic option for end-to-end accessibility checks.

**How this pairing works**: Playwright drives a real browser and navigates through your UI states, then axe-core runs in the page context and audits the rendered DOM against accessibility rules (for example WCAG A/AA-related checks). In practice, this gives you automated checks on the UI your users actually interact with, not just static source code.

Concrete example (runtime testing layer):

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage has no serious accessibility violations", async ({ page }) => {
	await page.goto("/");

	const results = await new AxeBuilder({ page })
		.withTags(["wcag2a", "wcag2aa"])
		.analyze();

	const seriousOrWorse = results.violations.filter((v) =>
		["serious", "critical"].includes(v.impact ?? "")
	);

	expect(seriousOrWorse).toEqual([]);
});
```

This threshold focuses CI on high-impact barriers first, while moderate issues are still tracked and triaged in regular accessibility review.

For component-level tests, you can run [axe-core](https://github.com/dequelabs/axe-core) with [vitest-axe](https://www.npmjs.com/package/vitest-axe); if you're using React, pair it with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

You can extend this workflow further by adding scripted checks for keyboard-only navigation, focus movement after dialogs open and close, form error messaging, skip links, and critical user journeys (sign in, checkout, publish, etc.).

### What axe-core doesn't test

axe-core is necessary, but not sufficient. It does not fully validate:

* Whether interaction patterns are intuitive or match user expectations
* Screen reader announcement quality and task clarity in real assistive technology
* End-to-end keyboard usability across complex workflows
* Content quality (link text clarity, instructional wording, error recovery clarity)
* Some visual and cognitive concerns that require human judgment

***Manual testing is still required***: run keyboard-only flows, perform at least one screen reader smoke test, validate focus order and visible focus indicators, and verify that users can complete critical tasks without ambiguity.

## From one-off prompts to reusable skills

Once you have prompt rules for individual requests and constraints for project-wide behavior, the next layer is packaging that guidance into something you can reuse across workflows.

Sooner or later you'll be working with accessibility as part of a larger AI coding workflow. At that point, a skill becomes the reusable packaging for the prompt rules and AI tool constraints you've already defined. Instead of rewriting the same accessibility requirements in every request, you can package them once and apply them consistently across multiple prompts.

[Open Agents](https://openagentskills.dev/) is a community hub for discovering and sharing reusable AI skills, and it can help you create a reusable skill for generating accessible UIs.

Rather than just writing a one-off prompt, you can create a skill that encapsulates those accessibility guidelines, framework preferences, and review expectations. You can then invoke that skill in any prompt where you want to generate an accessible UI, and you can also call it from other skills or agents.

* [Base accessibility skill](https://github.com/caraya/agent-skills/blob/main/skills/accessibility-core/SKILL.md)
* [React accessibility skill](https://github.com/caraya/agent-skills/blob/main/skills/accessibility-react/SKILL.md)

The two skills above are examples of reusable skills that you can invoke from any prompt, giving you a consistent set of accessibility guidelines to follow when generating UIs with AI.

## Conclusion: use AI as a tool, not a replacement

AI is a tool that can assist in generating user interfaces, but it is not a replacement for human designers and developers. While AI can help to generate designs quickly, it is unlikely to produce designs that are truly inclusive and accessible without explicit guidance. You should be explicit about what you ask AI to do, and you should always review the generated designs to ensure that they meet the accessibility standards you want to enforce.

## References

* [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
* [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
* [Here’s how to instruct a LLM to reference the ARIA Authoring Practices Guide](https://ericwbailey.website/published/heres-how-to-instruct-a-llm-to-reference-the-aria-authoring-practices-guide/). Supplemental guidance only; use it to inform how to consult APG. Treat WCAG and APG as the authoritative sources.
