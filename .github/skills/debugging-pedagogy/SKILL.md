---
name: debugging-pedagogy
description: "Explicit debugging instruction for developers: five-stage framework, hypothesis testing, tools, and common error patterns."
---

# Debugging Pedagogy

Core model (five stages): Test/Evaluate → Identify Bug → Represent Program → Locate Bug → Correct Bug.

Instructional elements:
- Teach systematic hypothesis testing and experiment design.
- Practice with error-pattern recognition and debugger tool fluency.
- Include rubrics for debugging tasks (identification, isolation, fix quality).

Classroom exercises:
- Faulty-code labs with stepwise scaffolding and error logs.
- Pair-debugging rotations with reflection prompts.

## Templates

Debugging task rubric (Markdown table):

| Criterion | 3 — Exemplary | 2 — Competent | 1 — Developing | 0 — Missing |
|---|---:|---:|---:|---:|
| Bug Identification | Accurately identifies root cause | Locates likely area | Partial identification | No clear identification |
| Hypothesis Testing | Systematic, documented tests | Tests used but limited | Ad-hoc testing | No tests performed |
| Fix Quality | Robust, regression-free | Fixes bug, minor issues | Fix incomplete | No fix |

Typical debugging lab CSV header:
TaskID,Description,SeedBug,ScaffoldSteps
DBG-01,Fix failing auth flow,Missing header,Run tests;Inspect logs;Add assertion
