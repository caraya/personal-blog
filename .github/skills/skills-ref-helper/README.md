# skills-ref-helper

This skill helps contributors create and validate Agent Skills using the official `skills-ref` validator.

Quick start:

- To bootstrap a new skill (dry-run):

  ```bash
  skills/skills-ref-helper/scripts/new_skill.sh my-new-skill
  ```

- To install `skills-ref` in a temporary venv (opt-in):

  ```bash
  skills/skills-ref-helper/scripts/validate.sh --install
  ```

- To run the validator after installing:

  ```bash
  /tmp/skills-ref-venv/bin/skills-ref validate ./skills
  ```

Notes:

- Scripts are dry-run by default. The install step uses a temporary venv under `/tmp` to avoid changing your workspace.
- Edit `templates/SKILL.template.md` to adjust your preferred skill template.
