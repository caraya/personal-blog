#!/usr/bin/env bash
set -euo pipefail

# validate.sh
# Safe wrapper to install and run the Agent Skills `skills-ref` validator in a temporary venv.
# Usage:
#   ./validate.sh            # dry-run: shows commands that would run
#   ./validate.sh --install  # create /tmp/skills-ref-venv and install skills-ref
#   ./validate.sh --run PATH # run validator on PATH (default: ./skills)

VENV_PATH="/tmp/skills-ref-venv"
SKILLS_PATH="${1:-./skills}"
DO_INSTALL=false
DO_RUN=false

if [ "${1-}" = "--install" ]; then
  DO_INSTALL=true
  SKILLS_PATH="./skills"
fi

if [ "${1-}" = "--run" ]; then
  DO_RUN=true
  # next arg is path
  SKILLS_PATH="${2:-./skills}"
fi

if [ "$DO_INSTALL" = true ] || [ "$DO_RUN" = true ]; then
  echo "Installing skills-ref into venv: $VENV_PATH"
  python3 -m venv "$VENV_PATH"
  "$VENV_PATH/bin/python" -m pip install --upgrade pip setuptools wheel
  "$VENV_PATH/bin/python" -m pip install "git+https://github.com/agentskills/agentskills.git#subdirectory=skills-ref"
  echo "Installed. To validate, run: $VENV_PATH/bin/skills-ref validate ./skills"
  exit 0
fi

echo "Dry-run: to install skills-ref, run './validate.sh --install'"
echo "Dry-run: to run validator directly after install, run './validate.sh --run ./skills'"

echo "Summary of actions (dry-run):"
echo " - Create venv at $VENV_PATH"
echo " - pip install skills-ref from GitHub"
echo " - run: $VENV_PATH/bin/skills-ref validate $SKILLS_PATH"

exit 0
