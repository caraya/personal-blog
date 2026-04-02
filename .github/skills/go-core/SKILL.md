---
name: go-core
description: "Go skill for API design, interface boundaries, concurrency safety, and idiomatic error handling. Trigger phrases: Go, goroutine, channel, context, interface, error wrapping, go test, race condition."
---

# Go Core Skill

## Use When

- Reviewing or writing Go code.
- Validating concurrency, context usage, and interface design.
- Checking for idiomatic and safe error handling.

## Checklist

1. API and package design
- Keep interfaces minimal and behavior-focused.
- Ensure package boundaries are cohesive.

2. Error handling
- Return wrapped errors with useful context.
- Avoid swallowing errors or panic in library code.

3. Concurrency and context
- Check goroutine lifecycle and cancellation flow.
- Validate channel ownership and close patterns.
- Ensure context is propagated for request-scoped work.

4. Quality and maintainability
- Keep functions small and dependency injection explicit.
- Verify zero-value behavior is safe and documented.

## Output Requirements

For each finding provide:
- Location
- Concurrency or API risk
- Operational impact
- Minimal fix
