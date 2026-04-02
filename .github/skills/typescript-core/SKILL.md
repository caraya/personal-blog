---
name: typescript-core
description: "TypeScript skill for type safety, tsconfig posture, module boundaries, and runtime-safe typing. Trigger phrases: TypeScript, tsconfig, type errors, strict mode, generics, union types, type narrowing, declaration files."
---

# TypeScript Core Skill

## Use When

- Reviewing or writing TypeScript code.
- Assessing strictness and type safety.
- Diagnosing issues caused by weak typing or unsafe casts.

## Checklist

1. Type safety
- Avoid any where a safer type is possible.
- Validate narrowing for unions and unknown.
- Ensure public APIs expose stable, explicit types.

2. Configuration posture
- Confirm strict settings are appropriate.
- Check moduleResolution and target compatibility.
- Ensure path aliases do not hide bad boundaries.

3. Runtime alignment
- Guard assumptions that types cannot enforce at runtime.
- Validate parsing, IO, and external data boundaries.

4. Maintainability
- Keep types readable and local when possible.
- Avoid over-generic abstractions without clear value.

## Output Requirements

For each finding provide:
- Location
- Type risk
- Runtime impact
- Minimal fix
