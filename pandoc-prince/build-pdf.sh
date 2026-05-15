#!/usr/bin/env bash

# Exit immediately on unhandled errors or undefined variables
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

# 1. Configuration & Argument Checking
if [ "$#" -eq 0 ]; then
  echo "Usage: $0 <file1.md> [file2.md ...]"
  exit 1
fi

# Define CSS path relative to this script.
# Output goes to 'generated' directory at the root where the script is called from.
CSS_FILE="${SCRIPT_DIR}/print-styles.css"
OUTPUT_ROOT="./generated"

# 2. Loop through all files passed as arguments
for INPUT_MD in "$@"; do

  if [ ! -f "$INPUT_MD" ]; then
    echo "⚠️ Warning: Source file '$INPUT_MD' not found! Skipping..."
    continue
  fi

  # Define the output PDF filename based on the input Markdown file
  BASE_NAME="${INPUT_MD%.md}"
  PDF_FILE="${BASE_NAME}.pdf"
  OUTPUT_FILE="${OUTPUT_ROOT}/${PDF_FILE}"

  mkdir -p "$(dirname "${OUTPUT_FILE}")"

  echo "---------------------------------------------------"
  echo "🚀 Generating PDF for: $INPUT_MD"

  # 3. Pandoc handles the conversion and calls PrinceXML
  pandoc "$INPUT_MD" \
    --pdf-engine=prince \
    --css="$CSS_FILE" \
    -o "$OUTPUT_FILE"

  echo "✅ PDF saved to: $OUTPUT_FILE"

done

echo "---------------------------------------------------"
echo "🎉 All files processed successfully."
