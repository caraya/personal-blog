---
name: debugging-methodology
description: "General debugging skill for investigative workflow, error interpretation, and common debugging patterns across languages. Trigger phrases: debug, troubleshoot, error message, stack trace, unexpected behavior, crash, hang, performance issue."
---

# Debugging Methodology

## Use When

- Investigating unexpected behavior or crashes.
- Reading and interpreting error messages and stack traces.
- Profiling performance issues or resource usage.
- Establishing a debugging plan for complex issues.

## Debugging Workflow

1. Reproduce
- Can you trigger the issue consistently or is it intermittent?
- What are the minimal steps to see the failure?
- Document the environment (OS, version, configuration).

2. Observe
- What is the error message or symptom?
- When did the behavior change (after what code or config change)?
- What does the stack trace tell you about the call path?

3. Hypothesize
- What assumptions could be wrong?
- What could cause this behavior?
- How would you test each hypothesis?

4. Isolate
- Reduce the code or scenario to the smallest reproduction.
- Disable unrelated features to narrow the problem.
- Use logging, breakpoints, or inspection to confirm behavior.

5. Fix and validate
- Apply a minimal fix based on the root cause.
- Test the fix in your reproduction case.
- Test in the original context to avoid regressions.

## Error Message Interpretation

1. Read the full message, not just the line mentioned.
2. Identify the exception type (e.g., TypeError, ValueError, segfault).
3. Look for context: What was the code trying to do?
4. Check nearby stack frames: Where did the call originate?

## Common Patterns

- **Null/undefined dereference**: Check initialization order and optional chaining.
- **Async issues**: Look for missing await, unhandled promises, or callback timing.
- **Concurrency**: Watch for race conditions, shared state mutations, or deadlocks.
- **Resource exhaustion**: Check for leaks (memory, file handles, goroutines, connections).
- **Type mismatches**: Verify assumptions about data shape and conversions.

## Output Requirements

For each debugging analysis provide:
- Issue summary
- Root cause hypothesis
- Evidence (error, stack trace, reproduction steps)
- Minimal reproduction code if applicable
- Recommended fix and validation approach
