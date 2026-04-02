---
name: typescript-debugging
description: "TypeScript debugging skill for sourcemap setup, type-safe debugging, and runtime error diagnosis using Node.js DevTools and VS Code Debugger. Trigger phrases: TypeScript debug, sourcemaps, type errors at runtime, async stack traces, undefined in production, runtime type mismatch."
---

# TypeScript Debugging

## Use When

- Debugging TypeScript code with proper sourcemap resolution.
- Diagnosing runtime errors that type checking should have caught.
- Inspecting async stack traces and promise rejections.
- Analyzing memory leaks in TypeScript applications.

## Setup and Tools

1. Sourcemaps
- Ensure `sourceMap: true` in tsconfig.json.
- Verify `.map` files are alongside compiled `.js` files.
- In Node: use `--source-map-support` or the `source-map-support` package.
- In VS Code: configure `.vscode/launch.json` with `sourceMapPathOverride` if needed.

2. Debugging tools
- **VS Code Debugger**: Set breakpoints, step through code, inspect variables (native sourcemap support).
- **Node.js Inspector**: `node --inspect` or `node --inspect-brk` to use Chrome DevTools or VS Code.
- **Async stack traces**: Enable `--stack-trace-async` (Node 12+) to see full promise chain.

## Checklist

1. Type and runtime alignment
- Could a type assertion (`as`) or type guard be hiding a real error?
- Are runtime values matching their declared types?
- Check for implicit `any` types or overly permissive unions.

2. Async debugging
- Inspect promise rejection handlers; missing `.catch()` silently fails.
- Use `--stack-trace-async` for full async context in crashes.
- Verify async function return types are Promise-like, not fire-and-forget.

3. Memory and resource leaks
- Check for circular references or retained closures.
- Use VS Code's memory profiler or Chrome DevTools heap snapshots.
- Look for event listeners, timers, or streams that are never cleaned up.

4. Module and import issues
- Check sourcemap paths in stack traces; they should point to `.ts` files.
- Verify `moduleResolution` in tsconfig matches your runtime (node, bundler).
- Look for circular dependencies or dynamic requires that break at runtime.

## Output Requirements

For each finding provide:
- Suspected root cause
- Evidence (stack trace, sourcemap status, type context)
- Steps to confirm with debugger
- Fix strategy with type-safety considerations
