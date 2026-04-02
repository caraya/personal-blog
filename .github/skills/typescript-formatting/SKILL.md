---
name: typescript-formatting
description: "TypeScript formatting skill for Prettier, ESLint, and IDE configuration. Trigger phrases: format TypeScript, Prettier config, code style, linting, format on save, ESLint rules."
---

# TypeScript Formatting

## Use When

- Setting up or validating code formatting for TypeScript projects.
- Configuring Prettier and ESLint for consistent style.
- Integrating formatting into the IDE or pre-commit hooks.

## Standard Formatters

1. **Prettier** (recommended for TypeScript)
- Opinionated, fast, minimal configuration.
- Handles TypeScript syntax including generics, union types, interfaces.
- Install: `npm install --save-dev prettier`.

2. **ESLint** (for linting and some auto-fixes)
- Use `eslint-config-prettier` to disable Prettier-conflicting rules.
- Run with `--fix` to auto-correct many issues.
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
  "useTabs": false
}
```

### ESLint `.eslintrc.json`:
```json
{
  "extends": ["eslint:recommended", "prettier"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": { "ecmaVersion": 2020, "sourceType": "module" },
  "rules": {}
}
```

### VS Code `.vscode/settings.json`:
```json
{
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": { "source.fixAll.eslint": true }
  }
}
```

## Checklist

1. Consistency
- Prettier is installed and configured.
- ESLint rules do not conflict with Prettier (use `eslint-config-prettier`).
- All team members use the same `.prettierrc` and `.eslintrc`.

2. IDE integration
- Format-on-save is enabled in `.vscode/settings.json`.
- ESLint extension is installed and active.

3. Pre-commit hooks
- Use `husky` or similar to run `prettier --write` and `eslint --fix` before commit.
- Install: `npm install --save-dev husky lint-staged`.

4. TypeScript-specific
- Type annotations are properly spaced (no extra spaces).
- Imports are formatted consistently (one per line vs. grouped).
- Generic types and function signatures are readable.

## Formatting Rules

- Line width: 100 characters (adjust per team preference).
- Indentation: 2 spaces (or 4 for some teams).
- Semicolons: Use (default Prettier).
- Trailing commas: ES5 style (includes tuples, function params).
- Quotes: Double quotes (Prettier default).

## Common Commands

- Format: `npx prettier --write "src/**/*.ts"`.
- Check: `npx prettier --check "src/**/*.ts"`.
- Lint and fix: `npx eslint --fix "src/**/*.ts"`.

## Output Requirements

When setting up or validating formatting, provide:
- Formatter versions and configuration.
- IDE setup summary.
- Pre-commit integration status.
- Any formatting conflicts or inconsistencies found.
