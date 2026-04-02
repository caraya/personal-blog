---
name: polyglot-starter-index
description: Starter index for a creator-first polyglot setup with one general agent and language-specific skills. Use when bootstrapping or extending TypeScript, JavaScript, Python, and Go workflows with scaffold-if-missing and implement-first behavior.
---

# Polyglot Starter Index

## Recommended Structure

- agents/polyglot-engineering.md
- skills/typescript-core/SKILL.md
- skills/javascript-core/SKILL.md
- skills/python-core/SKILL.md
- skills/go-core/SKILL.md

## Operating Model

1. General agent defaults to implement-first behavior when users ask to build features.
2. If no project exists, the general agent scaffolds a minimal starter before feature implementation.
3. Language skills provide deep, language-specific implementation and validation guidance.
4. Shared cross-language skills can be added for concerns like security, docs, and performance.

## Creator-First Flow

1. Detect whether a real project exists.
2. Scaffold when missing.
3. Implement requested functionality immediately.
4. Run available checks and iterate.
5. Summarize what was created, changed, and validated.

## How To Extend

1. Keep the general agent orchestration-focused and creator-first.
2. Add language skills for core language behavior.
3. Add framework skills only when framework APIs materially change best practices.
4. Keep language and framework descriptions specific with trigger phrases.
5. Keep each skill focused on one domain and one output contract.

## Suggested Next Skills

- react-core
- vue-core
- preact-core
- sql-core
- devops-ci-core

## Frontend Skills (examples)

- `skills/ui-engineering/SKILL.md` — Framework-agnostic UI engineering guidance (accessibility, design system, responsive).
- `skills/react-ui/SKILL.md` — React-specific UI patterns and invocation examples.
- `skills/preact-ui/SKILL.md` — Preact-specific UI patterns and invocation examples.
- `skills/vue-ui/SKILL.md` — Vue-specific UI patterns and invocation examples.
- `skills/ui-accessibility/SKILL.md` — Repository WCAG 2.1 AA enforcement skill; invoke as final gating for any user-facing change.

Agent invocation (one-liner) for accessibility gating: invoke `ui-accessibility` attaching `axe-report.json`, `pa11y-report.html`, and `manual-checks.md` as artifacts.
