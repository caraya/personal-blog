---
name: go-formatting
description: "Go formatting skill for gofmt, goimports, and IDE configuration. Trigger phrases: format Go, gofmt, goimports, code style, linting, format on save, golangci-lint."
---

# Go Formatting

## Use When

- Setting up or validating code formatting for Go projects.
- Configuring gofmt, goimports, and linters.
- Integrating formatting into IDE or pre-commit hooks.

## Standard Formatters

1. **gofmt** (built-in)
- Go's standard formatter; enforced by convention.
- No configuration needed; opinionated about style.
- Run: `gofmt -w .` to format in place.

2. **goimports** (import management)
- Extends gofmt to organize imports and add missing dependencies.
- Removes unused imports automatically.
- Install: `go install golang.org/x/tools/cmd/goimports@latest`.
- Run: `goimports -w .` to format and organize imports.

3. **golangci-lint** (comprehensive linting)
- Aggregates multiple linters; catches style and logical issues.
- Can auto-fix many issues with `--fix` flag.
- Install: `go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest`.

## Configuration

### `.golangci.yml` (golangci-lint):
```yaml
linters:
  enable:
    - gofmt
    - goimports
    - vet
    - errcheck
    - staticcheck
    - unused

linters-settings:
  gofmt:
    simplify: true
```

### VS Code `.vscode/settings.json`:
```json
{
  "[go]": {
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll": true
    },
    "editor.defaultFormatter": "golang.go"
  },
  "go.formatOnSave": true,
  "go.formatTool": "goimports",
  "go.lintOnSave": "package",
  "go.lintTool": "golangci-lint"
}
```

## Checklist

1. Consistency
- gofmt baseline is applied (Go convention).
- goimports is used to manage imports.
- golangci-lint is configured and shared with team.

2. IDE integration
- Format-on-save is enabled in VS Code.
- Go extension is installed and active.

3. Pre-commit hooks
- Use `pre-commit` framework or git hooks to run gofmt and goimports.
- Prevents unformatted code from entering the repository.

4. Import organization
- goimports automatically removes unused imports.
- Imports are grouped: stdlib, third-party, local.

## Formatting Rules

- Indentation: Tabs (Go standard, not spaces).
- Line width: No hard limit; keep readable (convention is ~80 chars for exported docs).
- Naming: camelCase for functions and variables, PascalCase for exported symbols.
- Brackets: Opening bracket stays on same line as declaration (Go convention).

## Common Commands

- Format: `gofmt -w .`.
- Format and organize imports: `goimports -w .`.
- Check formatting: `gofmt -d .` (shows diffs without changing files).
- Lint: `golangci-lint run ./...`.
- Lint and fix: `golangci-lint run --fix ./...`.

## Output Requirements

When setting up or validating formatting, provide:
- Formatter versions and configuration.
- IDE integration status.
- Pre-commit hook setup summary.
- Any conflicts or inconsistencies found.
