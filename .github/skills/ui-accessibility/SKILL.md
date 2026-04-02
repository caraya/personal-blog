---
name: ui-accessibility
description: "Use for any UI work across TypeScript, JavaScript, Python, Go, Rust, or other stacks that render user interfaces. Enforces WCAG 2.1 AA using the repository checklist in references/accessibility-checklist.md. Trigger phrases: accessibility, WCAG, aria, keyboard navigation, screen reader, contrast, focus, alt text, semantic HTML, inclusive design."
---

# UI Accessibility

## Overview

Ensure all UI implementations meet WCAG 2.1 AA requirements using the canonical checklist in `references/accessibility-checklist.md`.

This skill is framework-agnostic and language-agnostic. Use it for any project that renders UI, regardless of whether the stack is TypeScript, JavaScript, Python, Go, Rust, or another language.

## Source of Truth

- Primary checklist: `references/accessibility-checklist.md`
- Treat that file as authoritative for required checks and anti-patterns.

## Use When

- Building or modifying UI components, pages, forms, dialogs, navigation, or tables.
- Performing review or QA on existing UI.
- Shipping any feature with user-facing interface changes.

## Required WCAG Coverage

Run through all categories from `references/accessibility-checklist.md`:

1. Keyboard navigation
- Tab focusability, logical focus order, visible focus states
- Keyboard support for custom widgets
- No keyboard traps, skip link, modal focus trapping and focus return

2. Screen reader support
- `alt` text, labels, descriptive button/link text
- Heading hierarchy, dynamic announcements (`aria-live`), table headers

3. Visual accessibility
- Contrast thresholds (text and UI component contrast)
- No color-only communication
- 200% text resize support
- No flashing content above allowed thresholds

4. Forms
- Visible labels and required indicators
- Field-associated error messaging
- Error states not conveyed by color alone
- Focusable error summary on submission failures

5. Content and interaction
- Document language and descriptive title
- Link distinguishability
- Touch target size (44x44px minimum on mobile)
- Meaningful empty states

## Implementation Rules

1. Prefer semantic HTML (`button`, `a`, `input`, `label`, `select`) before ARIA workarounds.
2. If a non-semantic element is made interactive, it must include role, focusability, and keyboard handlers.
3. Never remove focus outlines without replacing them with an accessible visible focus style.
4. Do not rely on color alone to convey errors, status, or state.
5. Ensure dynamic updates are announced with appropriate live regions.
6. Keep keyboard and screen-reader behavior equivalent to pointer behavior.

## Testing Guidance

Use both automated and manual testing:

- Automated: axe-core, pa11y, Lighthouse accessibility checks
- Manual: keyboard-only navigation, screen reader smoke test (VoiceOver/NVDA/Orca), zoom to 200%

## Project setup and devDependencies

When scaffolding a frontend project, include accessibility tooling as devDependencies so checks are reproducible and runnable in CI. Example template is available at `templates/frontend/package.json`.

Install locally:

```bash
npm install --save-dev @axe-core/cli pa11y pa11y-ci
```

Add these scripts to `package.json` (the template includes them):

```json
{
    "scripts": {
        "a11y:axe": "npx @axe-core/cli http://localhost:3000/route --save axe-report.json",
        "a11y:pa11y": "npx pa11y http://localhost:3000/route --reporter html > pa11y-report.html",
        "a11y:run": "npm run a11y:axe && npm run a11y:pa11y"
    }
}
```

### CI example (GitHub Actions)

Run accessibility checks in CI and upload artifacts so the agent can attach them to its report.

```yaml
- name: Install dependencies
    run: npm ci

- name: Start dev server
    run: npm start &

- name: Run accessibility checks
    run: npm run a11y:run

- name: Upload accessibility reports
    uses: actions/upload-artifact@v4
    with:
        name: a11y-reports
        path: |
            axe-report.json
            pa11y-report.html
```

Agents will expect artifacts named `axe-report.json` and `pa11y-report.html` (and `manual-checks.md` for human notes) when performing the final accessibility gating.

## Output Requirements

For each accessibility review or implementation pass, provide:

- **Scope** — Components/pages evaluated.
- **Checklist status** — Pass/fail per checklist section (Keyboard, Screen readers, Visual, Forms, Content).
- **Findings** — Critical, Important, Suggestions with evidence.
- **Fixes** — Minimal code changes or concrete remediation steps.
- **Validation** — Which tools/tests were run and what remains unverified.

If any WCAG-critical issue remains unresolved, explicitly mark release risk.
