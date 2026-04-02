---
name: javascript-testing
description: "JavaScript testing skill for test infrastructure, async test patterns, and runtime reliability using Jest, Vitest, or Mocha. Trigger phrases: JavaScript tests, Jest setup, async tests, test timeouts, flaky tests, test fixtures, mock functions."
---

# JavaScript Testing

Use this SKILL when setting up or validating test infrastructure for JavaScript/TypeScript projects, diagnosing flaky async tests, or designing reliable CI test suites.

Recommended runners:
- Jest (general-purpose, snapshot testing, good mocks)
- Vitest (Vite/Esm-native projects)
- Mocha + Chai + Sinon (explicit control)

Checklist
- AAA pattern (Arrange, Act, Assert) and descriptive test names
- Avoid shared mutable state across concurrent tests
- Proper async handling (return/await/promises)
- Reset mocks between tests

Templates & Examples

Example test file (Jest):

```js
// __tests__/sum.test.js
const sum = require('../sum')

test('adds numbers', () => {
  expect(sum(1,2)).toBe(3)
})
```

Flaky-test triage CSV header:

File,TestName,ObservedBehavior,SuggestedFix
tests/api.test.js,"handles slow response","timeout in CI","increase timeout; mock network; make deterministic"

Output requirements
- For each finding provide: file and line, risk, why it matters, minimal fix with code example.
