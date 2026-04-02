#!/usr/bin/env bash
set -euo pipefail

# new_skill.sh
# Create a new skill directory from the template. Dry-run by default.
# Usage:
#   ./new_skill.sh my-skill-name    # shows what would be created
#   ./new_skill.sh --apply my-skill-name  # actually create the directory

TEMPLATE="$(dirname "$0")/../templates/SKILL.template.md"
OUT_DIR="./skills"

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 [--apply] skill-name"
  exit 1
fi

APPLY=false
NAME="$1"
if [ "$1" = "--apply" ]; then
  APPLY=true
  NAME="$2"
fi

TARGET="$OUT_DIR/$NAME"

echo "Template: $TEMPLATE"
echo "Target: $TARGET"

if [ "$APPLY" = false ]; then
  echo "Dry-run: will create $TARGET with SKILL.md based on template."
  echo "Run: $0 --apply $NAME to actually create it."
  exit 0
fi

if [ -e "$TARGET" ]; then
  echo "Error: $TARGET already exists" >&2
  exit 1
fi

mkdir -p "$TARGET"
cp "$TEMPLATE" "$TARGET/SKILL.md"
echo "Created $TARGET/SKILL.md from template. Edit the frontmatter and content to suit your skill."
