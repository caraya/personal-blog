---
name: css-debugging
description: "Debugging patterns and workflows for CSS layout, stacking, paint, and rendering issues."
---

# CSS Debugging

Purpose: give a concise, repeatable workflow to diagnose and fix common CSS bugs (layout shifts, stacking/context, specificity, subpixel issues).

Workflow:
1. Reproduce in minimal page: strip to minimal HTML/CSS that reproduces the issue.
2. Inspect with DevTools: computed styles, layout outlines, box model, and event listeners.
3. Isolate the cause: toggle rules, disable properties, and check cascade/specificity.
4. Verify fix across breakpoints and devices.

Common problems & checks:
- Specificity and cascade: use DevTools "Force element state" and "Show matched styles".
- Stacking context / z-index: inspect transform/opacity/flex/grid creates contexts.
- Collapsing margins: check adjacent block margins and wrapper padding/border.
- Flexbox/grid sizing: look for min-height/min-width, flex-basis, and intrinsic sizing issues.
- Reflow/paint hotspots: use Performance → Rendering paint flashing to find expensive repaints.

Color-related debugging:
- For perceptual color mismatches, conversions between color spaces, or contrast failures, call the `color-expert` skill and re-evaluate palettes in OKLCH (unless `color-expert` recommends otherwise).

Tools and shortcuts:
- Chrome/Edge/Safari DevTools (Elements, Computed, Layout, Rendering tabs).
- `outline: 2px solid hotpink` for quick debugging of invisible elements.
- Use Lighthouse and accessibility linters for automated checks.
