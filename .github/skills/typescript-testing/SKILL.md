---
name: typescript-testing
description: "TypeScript testing skill for test infrastructure, type-safe test design, and coverage validation using Jest, Vitest, or Mocha. Trigger phrases: TypeScript tests, Jest setup, type-safe mocks, test coverage, testing framework, test types, assertion errors."
---

# TypeScript Testing

## Use When

- Setting up or validating test infrastructure for TypeScript projects.
- Writing type-safe tests that leverage TypeScript's type system.
- Checking test coverage and assertion quality.

## Testing Infrastructure

Recommend:
- **Vitest** for Vite-based projects (fast, modern ESM support).
- **Jest** for most Node and frontend projects (batteries-included, type support via ts-jest).
- **Mocha + Chai** for minimal, explicit setups.

## Checklist

1. Test structure
- Tests are organized by feature or module, not just by type (unit/integration).
- Test names clearly describe the behavior being tested, not just the function name.
- Arrange-Act-Assert (AAA) pattern is consistent throughout.

2. Type safety
- Mocks and stubs are typed consistently with the code under test.
- Generic type parameters are preserved in mock signatures.
- Test utilities and helpers export proper types.

3. Coverage and quality
- Critical paths and error conditions have test coverage.
- Edge cases (null, undefined, empty arrays) are tested.
- Assertions are specific; avoid loose equality checks (`toBe` vs `toEqual`).

4. Infrastructure
- Test runner is configured for the project's module format (ESM, CommonJS).
- Type checking is enabled during test runs (`skipLibCheck` is false).
- Test files are excluded from production builds via tsconfig.

## Output Requirements

For each finding provide:
- Location (test file and line)
- Type safety or coverage risk
- Why it matters
- Minimal fix with code example
