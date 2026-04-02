---
name: javascript-core
description: "JavaScript skill for runtime correctness, async behavior, module compatibility, and maintainable patterns. Trigger phrases: JavaScript, Node, ESM, CommonJS, promises, async await, event loop, runtime bug."
---

# JavaScript Core Skill

## Use When

- Reviewing or writing JavaScript code.
- Validating async flow, module format, and runtime behavior.
- Checking for common production reliability issues.

## Checklist

1. Runtime correctness
- Validate coercion, equality usage, and nullish handling.
- Confirm error paths and fallback behavior.

2. Async control flow
- Catch missing await and unhandled promises.
- Validate concurrency limits for batch operations.
- Confirm cleanup for timers, streams, and listeners.

3. Module and platform fit
- Check ESM and CommonJS interop assumptions.
- Ensure imports are compatible with runtime target.

4. Code quality
- Prefer clear functions over hidden side effects.
- Keep state changes explicit and testable.

## Output Requirements

For each finding provide:
- Location
- Failure mode
- User impact
- Minimal fix
