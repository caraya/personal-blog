---
name: vue-ui
description: "Use when building or modifying user-facing interfaces in Vue (Options API or Composition API). Covers SFC patterns, templates, directives, state management, and accessibility. Trigger phrases: Vue, SFC, .vue, Composition API, setup(), ref, reactive, v-bind, v-on, v-model, directives, accessibility, WCAG."
---

# Vue UI Engineering

## Overview

Build production-quality Vue user interfaces that are accessible, performant, and visually polished. This skill focuses on Vue-specific patterns (Single File Components, templates, directives, Composition API), while deferring framework-agnostic accessibility gating to `ui-accessibility`.

## When to Use

- Building new Vue Single File Components (`.vue`)
- Modifying existing Vue UI or templates
- Implementing state with Composition API or Vuex/Pinia
- Working with server-side rendering or hydration (Nuxt, Vite SSR)

## Component Architecture

### File Structure

```
src/components/
  TaskList/
    TaskList.vue          # SFC implementation (template/script/style)
    TaskList.spec.ts      # Tests
    TaskList.stories.ts   # Storybook stories (if using)
    useTaskList.ts        # Composable (Composition API)
    types.ts              # Component-specific types (if needed)
```

### Component Patterns

- Prefer small, focused components that expose props and events.
- Use composables (reusable Composition API functions) instead of large mixins.
- Keep templates declarative and move complex logic into the script block or composables.

**Example (Composition API):**

```vue
<template>
  <ul role="list">
    <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const tasks = ref([])
onMounted(async () => {
  tasks.value = await fetchTasks()
})
</script>
```

## State Management

- Use `ref` / `reactive` for component-local state
- Use composables to share logic across components
- Use Pinia (or Vuex) when a centralized store is needed

## Design System and Accessibility

Follow the project design system for spacing, typography, and color tokens. For final WCAG 2.1 AA gating and verification, invoke the `ui-accessibility` skill and apply checks from `references/accessibility-checklist.md`.

## Vue-specific Notes

- Prefer native form controls and semantic HTML in templates; use ARIA only when necessary.
- For custom widgets, ensure `role`, `tabindex`, and keyboard handlers are implemented.
- Use `v-bind` and `v-on` for binding props and events; prefer explicit prop definitions for type-safety.

## Invocation Example

When finalizing a Vue component change, run this short flow:

- Start the dev server (`npm run dev`, `pnpm dev`, or equivalent).
- Run automated accessibility checks: `npx axe-core ./path/to/page-or-static.html` and/or `npx pa11y http://localhost:3000/route`.
- Run unit/component tests and Storybook checks (`npm test`, `npm run test:visual`).
- Final gating: invoke the `ui-accessibility` skill and attach the generated checklist report from `references/accessibility-checklist.md`.

- Agent invocation (one-liner): Invoke `ui-accessibility` attaching `axe-report.json`, `pa11y-report.html`, and `manual-checks.md` as artifacts.

## Output Requirements

For each finding or completed build session provide:

- **Location** — Component name and file path.
- **Category** — Accessibility, state management, design system, component architecture, responsive design, or performance.
- **Severity** — Critical, Important, Suggestion.
- **Evidence** — What was observed or what the code does currently.
- **Fix** — Minimal corrected code example or specific action to take.
