---
name: css-formatting
description: "Formatting and style guidance for CSS/stylesheet code: organization, naming, and linting."
---

# CSS Formatting

Purpose: standardize stylesheet formatting and lint rules so teams have consistent, machine-enforced style.

Recommended tools:
- Prettier (with a CSS/PostCSS plugin) for deterministic formatting.
- stylelint for lint rules, enforce property order, vendor-prefix policies, and allowed patterns.
- Editor integrations: format-on-save and shared editorconfig to reduce friction.

Opinionated rules (suggested):
- Use custom properties for tokens and keep tokens in a separate file.
- Enforce lowercase hex or prefer token names; avoid inline literal hex values in components.
- Prefer logical properties (margin-block, padding-inline) where supported.

Property ordering:
- Group by box model → positioning → typography → visual (color, background) → transforms/animation.

Color rules:
- Prefer semantic token usage: `var(--color-text)`.
- For generated palettes, produce OKLCH values or tokenized variants; delegate complex color decisions to `color-expert`.

CI integration:
- Add `stylelint` and `prettier --check` steps to CI to fail on style violations.
