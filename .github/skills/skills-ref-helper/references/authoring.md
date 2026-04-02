# Authoring checklist for Agent Skills

Use this checklist when creating or reviewing a new skill.

1. Frontmatter
   - `name` present and matches directory (lowercase letters, digits, hyphens).
   - `description` present and concise (1–1024 chars).
   - Optional `compatibility`, `metadata`, `allowed-tools` added when appropriate.

2. Progressive disclosure
   - Keep `SKILL.md` focused (<500 lines recommended).
   - Move long reference material into `references/` and executable code into `scripts/`.

3. Files and layout
   - `scripts/` contains self-contained scripts with clear dependencies.
   - `references/` contains supplemental docs and large data files.

4. Safety and CI
   - Avoid embedding credentials or machine-specific paths in checked-in files.
   - Document any local-only overrides (e.g., `.claude/settings.local.json`) and gitignore them.
   - Provide a dry-run validator workflow for contributors.

5. Examples and tests
   - Include example inputs/outputs in `SKILL.md` where helpful.
   - If applicable, include small test scripts under `scripts/` that can be run locally.

6. Validation
   - Run `skills-ref validate ./skills/<skill>` before publishing.
