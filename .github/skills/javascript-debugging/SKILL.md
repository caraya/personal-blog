---
name: javascript-debugging
description: "JavaScript debugging skill for runtime error diagnosis, event loop behavior, and memory profiling using Node.js Inspector and Chrome DevTools. Trigger phrases: JavaScript debug, event loop stall, heap snapshot, memory leak, undefined behavior, callback hell, promise chain."
---

# JavaScript Debugging

## Use When

- Debugging Node.js or browser runtime errors.
- Investigating event loop stalls or performance hangs.
- Analyzing memory leaks or heap growth.
- Tracking async control flow issues and callback chains.

## Setup and Tools

1. Node.js inspection
- Start with `node --inspect app.js` or `node --inspect-brk` for immediate pause.
- Connect via `chrome://inspect` or VS Code Debugger.
- Use `--max-old-space-size` if debugging memory-heavy workloads.

2. Chrome DevTools (browser or Node)
- **Sources tab**: Set breakpoints, step, watch variables.
- **Console**: Execute code in the current context, inspect objects.
- **Performance tab**: Record and analyze CPU usage, event loop latency.
- **Memory tab**: Take heap snapshots, track allocations, detect leaks.

3. Profiling
- Use `--prof` flag: `node --prof app.js` then `node --prof-process` to analyze.
- Or use built-in profiling in Chrome DevTools.

## Checklist

1. Async and callback issues
- Missing `await` or `.then()` chaining silently succeeds but leaves work unfinished.
- Unhandled promise rejections crash the process in some Node versions; catch them all.
- Callback arguments (error-first pattern) may be ignored, causing bugs downstream.

2. Event loop and stalls
- Long-running synchronous code blocks the event loop; break into setImmediate or chunked work.
- Inspect the event loop using `--trace-events` or async hooks.
- Look for tight loops, deep recursion, or large object allocations in tight paths.

3. Memory profiling
- Take heap snapshots before and after a suspected leak scenario.
- Use Chrome DevTools "Allocation timeline" to track where memory is allocated.
- Look for detached DOM nodes, retained closures, or circular references.

4. Module and timing issues
- Check module loading order; require() side effects may execute unexpectedly.
- Watch for race conditions in concurrent operations (Promise.all, setTimeout timing).
- Verify require cache is not causing stale module state.

## Output Requirements

For each finding provide:
- Issue description
- Evidence (stack trace, memory profile, timing trace)
- Steps to reproduce with debugger
- Root cause hypothesis
- Fix strategy
