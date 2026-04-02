---
name: preact-ui
description: "Use when building or modifying user-facing interfaces in Preact. Covers component patterns, hooks, state management, and accessibility for Preact apps. Trigger phrases: Preact, preact/hooks, h(), JSX, TSX, useState, useEffect, useRef, preact-router, accessibility, WCAG."
---

# Preact UI Engineering

## Overview

Build production-quality Preact user interfaces that are accessible, performant, and visually polished. This skill focuses on Preact-specific patterns (functional components, `preact/hooks`, JSX), while deferring framework-agnostic accessibility gating to `ui-accessibility`.

## When to Use

- Building new Preact components or pages
- Modifying existing Preact UI
- Implementing routing with `preact-router` or similar
- Adding interactivity or state with `preact/hooks`

## Component Architecture

### File Structure

```
src/components/
  TaskList/
    TaskList.tsx          # Component implementation (JSX/TSX)
    TaskList.test.tsx     # Tests
    TaskList.stories.tsx  # Storybook stories (if using)
    use-task-list.ts      # Custom hook (if complex state)
    types.ts              # Component-specific types (if needed)
```

### Component Patterns

- Prefer small, focused functional components composed together.
- Use `preact/hooks` (`useState`, `useEffect`, `useRef`, `useCallback`) for local state and effects.
- Lift state or use a shared store for cross-cutting state (avoid deep prop drilling).

**Separate data fetching from presentation** (container vs presentation components) to keep UI components testable and reusable.

## State Management

- `useState` / `useReducer` for local state
- Context or a lightweight store for app-wide state
- Fetch and cache remote data in containers; pass sanitized props to presentation components

## Design System and Accessibility

Follow the project design system for spacing, typography, and color tokens. For final WCAG 2.1 AA gating and verification, invoke the `ui-accessibility` skill and apply checks from `references/accessibility-checklist.md`.

## Preact-specific Notes

- Prefer `preact/compat` only when necessary for third-party React libraries.
- Use small bundles and avoid heavy runtime adapters when targeting minimal bundle size.

## Invocation Example

When finalizing a Preact component change, run this short flow:

- Start the dev server (`npm start`, `pnpm dev`, or equivalent).
- Run automated accessibility checks: `npx axe-core ./path/to/page-or-story.html` and/or `npx pa11y http://localhost:3000/route`.
- Run component/unit tests and Storybook visual checks where available (`npm test`, `npm run test:visual`).
- Final gating: invoke the `ui-accessibility` skill and attach the generated checklist report from `references/accessibility-checklist.md`.

- Agent invocation (one-liner): Invoke `ui-accessibility` attaching `axe-report.json`, `pa11y-report.html`, and `manual-checks.md` as artifacts.

## Output Requirements

For each finding or completed build session provide:

- **Location** — Component name and file path.
- **Category** — Accessibility, state management, design system, component architecture, responsive design, or performance.
- **Severity** — Critical, Important, Suggestion.
- **Evidence** — What was observed or what the code does currently.
- **Fix** — Minimal corrected code example or specific action to take.
