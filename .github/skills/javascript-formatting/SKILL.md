---
name: javascript-formatting
description: "JavaScript formatting skill for Prettier, ESLint, and Node.js project setup. Trigger phrases: format JavaScript, Prettier config, code style, linting, format on save, ESLint rules, Node formatting."
---

# JavaScript Formatting

## Use When

- Setting up or validating code formatting for JavaScript projects.
- Configuring Prettier and ESLint for consistent style.
- Integrating formatting into IDE or pre-commit hooks.

## Standard Formatters

1. **Prettier** (recommended for JavaScript)
- Opinionated, fast, minimal configuration.
- Supports JSX, JSON, YAML, Markdown.
- Install: `npm install --save-dev prettier`.

2. **ESLint** (for linting and auto-fixes)
- Use `eslint-config-prettier` to prevent conflicts with Prettier.
- Run with `--fix` for automatic corrections.
- Install: `npm install --save-dev eslint eslint-config-prettier`.

## Configuration

### Prettier `.prettierrc` or `package.json`:
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### ESLint `.eslintrc.json`:
```json
{
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": { "ecmaVersion": 2020, "sourceType": "module" },
  "env": { "node": true, "browser": true },
  "rules": {}
}
```

### VS Code `.vscode/settings.json`:
```json
{
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": { "source.fixAll.eslint": true }
  }
}
```

## Checklist

1. Consistency
- Prettier is installed and configured.
- ESLint does not conflict with Prettier (use `eslint-config-prettier`).
- Configuration is shared across team (version controlled).

2. IDE integration
- Format-on-save is enabled in VS Code.
- ESLint extension is active and showing violations.

3. Pre-commit hooks
- Use `husky` and `lint-staged` to run formatters before commit.
- Prevents unformatted code from entering the repository.

4. Module format
- Ensure consistent import/export style (ESM vs. CommonJS).
- Imports are sorted and grouped by origin (external, internal, relative).

## Formatting Rules

- Line width: 100 characters (configurable).
- Indentation: 2 spaces.
- Semicolons: Use (Prettier default).
- Trailing commas: ES5 style.
- Quotes: Double quotes (Prettier default).
- Arrow function parentheses: Always (for consistency).

## Common Commands

- Format: `npx prettier --write "src/**/*.js"`.
- Check: `npx prettier --check "src/**/*.js"`.
- Lint and fix: `npx eslint --fix "src/**/*.js"`.

## Output Requirements

When setting up or validating formatting, provide:
- Formatter versions and configuration.
- IDE integration status.
- Pre-commit hook setup summary.
- Any conflicts or inconsistencies found.
