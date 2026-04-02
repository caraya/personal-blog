---
name: python-core
description: "Python skill for correctness, packaging hygiene, typing clarity, and reliable runtime behavior. Trigger phrases: Python, pip, venv, typing, dataclass, async Python, pytest, import errors."
---

# Python Core Skill

## Use When

- Reviewing or writing Python code.
- Checking import health, typing, and packaging assumptions.
- Validating error handling and testability.

## Checklist

1. Correctness and readability
- Favor explicit behavior over implicit magic.
- Check mutable default argument hazards.
- Validate exception handling scope and specificity.

2. Typing and interfaces
- Use type hints where they improve clarity.
- Ensure public functions have stable contracts.

3. Packaging and imports
- Validate import paths and package layout assumptions.
- Confirm dependency expectations are explicit.

4. Runtime reliability
- Check resource handling with context managers.
- Validate async usage and blocking boundaries.

## Output Requirements

For each finding provide:
- Location
- Defect or risk
- Why it matters
- Minimal fix
