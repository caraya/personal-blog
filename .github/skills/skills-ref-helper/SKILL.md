---
name: skills-ref-helper
description: "Helper skill for authoring Agent Skills: templates, safe scripts, and guidance to run the official `skills-ref` validator locally. Use when creating or validating new skills."
compatibility: "Requires Python 3.10+, git, curl"
allowed-tools: "Read Bash"
---

# skills-ref-helper

Use this skill when creating new Agent Skills or validating existing ones. It provides:

- A minimal `SKILL.md` template (`templates/SKILL.template.md`) to bootstrap new skills that conform to the spec.
- Safe, opt-in scripts to install and run the official `skills-ref` validator in a temporary virtualenv (`scripts/validate.sh`).
- A helper script to create a new skill folder from the template (`scripts/new_skill.sh`).
- A short authoring checklist in `references/authoring.md` describing common pitfalls and progressive-disclosure guidance.

This skill is intentionally conservative: scripts are dry-run by default and will not install or execute anything without explicit consent. Keep any environment-specific or privileged commands out of shared templates; use per-skill local overrides for developer-only commands.
