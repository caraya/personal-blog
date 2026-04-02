---
name: css-core
description: "Core CSS guidance for architecture, tokens, responsive patterns, and accessibility."
---

# CSS Core

Purpose: provide pragmatic, production-ready CSS guidance covering architecture, design tokens, responsive layout patterns, and accessibility-first color usage.

Color guidance:
- Default color space: OKLCH for perceptual uniformity when creating palettes, scales, and gradients.
- For any non-trivial color decisions (accessibility thresholds, palette harmonies, conversions), consult the `color-expert` skill first; follow its recommendation if it contradicts OKLCH.

Architecture:
- Prefer design tokens (CSS custom properties or JSON token files) for color, spacing, type, and radii.
- Use logical properties and container queries where appropriate; keep layout and visual tokens separate from components.
- Pattern examples: component-driven tokens → atomic components → composed pages. Prefer predictable specificity (avoid deep selector chains).

Best practices:
- Use semantic tokens (`--color-text`, `--bg-surface`, `--accent`) rather than raw hex in components.
- Prefer system fonts where performance matters; bundle web fonts asynchronously.
- Respect `prefers-reduced-motion` and `prefers-contrast`.

Accessibility:
- Design around contrast using APCA or WCAG as required by project policy; run automated checks during CI.
- Do not rely on color alone to convey meaning; pair with icons, labels, or patterns.

When to call other skills:
- For color generation/analysis: `color-expert`.
- For accessibility audits: `ui-accessibility` skill.

This SKILL focuses on high-level decision-making rather than low-level syntax examples.
