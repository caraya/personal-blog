---
name: css-testing
description: "Visual and automated testing strategies for CSS (visual regression, cross-browser, accessibility)."
---

# CSS Testing

Purpose: ensure CSS changes are safe, visually correct, and accessible across supported viewports and browsers.

Testing types:
- Unit/DOM assertions: use `@testing-library` + `jest-dom` for style assertions on computed values when deterministic.
- End-to-end (E2E): Playwright or Puppeteer for screenshot captures and interaction flows.
- Visual regression: Percy, Chromatic, Loki, or Playwright Snapshot tests to catch visual regressions.
- Accessibility: axe-core (automated) plus manual audit for keyboard + screen-reader flows.

Color & contrast checks:
- Integrate `color-expert` into visual tests to assert APCA/WCAG thresholds for important text and UI components.
- When programmatically generating palettes for tests, use OKLCH unless `color-expert` suggests another space.

Best practices:
- Use token-driven tests — assert token values produce expected computed CSS rather than hard-coded colors.
- Keep visual baselines stable: lock fonts, viewport sizes, and emulate consistent device pixel ratio in CI.
- For flaky visual diffs, add heuristics: ignore anti-aliased text minor diffs, mask dynamic regions, and use thresholds.

CI recommendations:
- Run unit and accessibility checks on PRs; run visual regression on a nightly job or when visual-impacting files change.
