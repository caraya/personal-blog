---
name: python-formatting
description: "Python formatting skill for Black, isort, and IDE configuration. Trigger phrases: format Python, Black config, code style, isort imports, linting, format on save, PEP 8."
---

# Python Formatting

## Use When

- Setting up or validating code formatting for Python projects.
- Configuring Black and isort for consistent style.
- Integrating formatting into IDE or pre-commit hooks.

## Standard Formatters

1. **Black** (recommended for Python)
- Opinionated, minimal configuration, fast.
- Enforces PEP 8 with specific style choices (88-char line width).
- Install: `pip install black`.

2. **isort** (import sorting)
- Organizes imports into sections (stdlib, third-party, local).
- Integrates with Black.
- Install: `pip install isort`.

3. **Ruff** (optional, fast linter and formatter)
- Modern, Rust-based; superset of some Black functionality.
- Can format and lint in one pass.
- Install: `pip install ruff`.

## Configuration

### `pyproject.toml` (Black and isort):
```toml
[tool.black]
line-length = 88
target-version = ['py39', 'py310', 'py311']

[tool.isort]
profile = "black"
line_length = 88
skip_glob = [".venv", "venv"]
```

### `.flake8` or `pyproject.toml` (linting):
```toml
[tool.flake8]
max-line-length = 88
exclude = [".venv", "venv", ".git"]
```

### VS Code `.vscode/settings.json`:
```json
{
  "[python]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "ms-python.python",
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  "python.formatting.provider": "black",
  "python.linting.enabled": true,
  "python.linting.flake8Enabled": true
}
```

## Checklist

1. Consistency
- Black is installed and configured via `pyproject.toml`.
- isort is configured with `profile = "black"` to avoid conflicts.
- Configuration is version-controlled and shared with team.

2. IDE integration
- Format-on-save is enabled in VS Code.
- Python extension is installed and active.

3. Pre-commit hooks
- Use `pre-commit` framework with Black and isort hooks.
- Prevents unformatted code from entering the repository.

4. Import organization
- isort sorts imports into stdlib, third-party, local sections.
- Multi-line imports are handled consistently.

## Formatting Rules

- Line width: 88 characters (Black standard).
- Indentation: 4 spaces (PEP 8).
- String quotes: Double quotes (customizable, Black default).
- Trailing commas: Used for multi-line structures.
- Import order: Stdlib, third-party, local (isort).

## Common Commands

- Format: `black src/`.
- Sort imports: `isort src/`.
- Check: `black --check src/` or `isort --check src/`.
- Combined: `black src/ && isort src/`.

## Output Requirements

When setting up or validating formatting, provide:
- Formatter versions and configuration.
- IDE integration status.
- Pre-commit hook setup summary.
- Any conflicts or inconsistencies found.
