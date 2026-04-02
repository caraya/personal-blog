#!/usr/bin/env bash
set -euo pipefail

# run_local_commands.sh
# Converted command list from settings.local.json
# Dry-run by default. Pass --run to actually execute.

DRY_RUN=true
if [[ ${1-} == "--run" ]]; then
  DRY_RUN=false
fi

function maybe_run() {
  local cmd="$1"
  echo
  echo "==> $cmd"
  if [ "$DRY_RUN" = false ]; then
    eval "$cmd"
  else
    echo "(dry-run)"
  fi
}

echo "Converted commands for skills/color-expert/.claude/settings.local.json"
echo "Dry-run mode: ${DRY_RUN}"

# Section: local filesystem reads / lists
maybe_run "ls -la /Users/meodai/Sites/color-expert/.claude* || true"
maybe_run "ls -la /Users/meodai/.claude || true"

# Section: YouTube / yt-dlp / youtube-dl related commands
maybe_run "youtube-dl --write-auto-sub --sub-lang en --skip-download --print-json https://www.youtube.com/shorts/e33WEqkaPPQ || true"
maybe_run "yt-dlp --version || true"

# Example: pretty-print metadata (reads JSON from stdin)
maybe_run "python3 -c \"import sys, json; d=json.load(sys.stdin); print('Title:', d.get('title','')); print('Channel:', d.get('uploader','')); print('Description:', d.get('description','')); print('Duration:', d.get('duration',''))\" || true"

# Section: markitdown virtualenv + install
maybe_run "python3.13 -m pip install 'markitdown[all]' || true"
maybe_run "python3.13 -m pip install --user 'markitdown[all]' || true"
maybe_run "python3.13 -m venv /tmp/markitdown-venv || true"
maybe_run "/tmp/markitdown-venv/bin/pip install --upgrade pip || true"

# Example: run markitdown against a YouTube short (in venv)
maybe_run "/tmp/markitdown-venv/bin/markitdown 'https://www.youtube.com/shorts/_3-s2gM9MIM' 2>&1 || true"

# Section: fetch web resources (curl)
maybe_run "curl -L -o /Users/meodai/Sites/color-expert/references/historical/pdfs/ostwald-farbenlehre-1918.pdf 'https://ia801900.us.archive.org/20/items/farbenlehrevonwi12ostw/farbenlehrevonwi12ostw.pdf' || true"
maybe_run "curl -L -o /Users/meodai/Sites/color-expert/references/historical/pdfs/ostwald-einfuehrung-farbenlehre-1919.pdf 'https://archive.org/download/einfhrungindief00ostwgoog/einfhrungindief00ostwgoog.pdf' || true"
maybe_run "curl -L -o /Users/meodai/Sites/color-expert/references/historical/pdfs/ostwald-letters-to-a-painter-1907.pdf 'https://archive.org/download/letterstoapaint00ostwgoog/letterstoapaint00ostwgoog.pdf' || true"
maybe_run "curl -sL -o /tmp/iscc-nbs-check.html 'https://archive.org/details/circularofbureau553unse' || true"
maybe_run "curl -sL 'https://archive.org/download/circularofbureau553unse/circularofbureau553unse.pdf' -o /Users/meodai/Sites/color-expert/references/historical/pdfs/iscc-nbs-circular-553.pdf || true"
maybe_run "curl -sL 'https://archive.org/download/coloruniversalla00kell/coloruniversalla00kell.pdf' -o /Users/meodai/Sites/color-expert/references/historical/pdfs/kelly-judd-color-universal-language.pdf || true"
maybe_run "curl -sL 'https://archive.org/download/distillationofre00schwrich/distillationofre00schwrich.pdf' -o /tmp/resinate-check.pdf || true"

# Section: cat / move / inspect downloaded subtitle files
maybe_run "cat /tmp/yt_B1tfImuPTcA*.srt || true"
maybe_run "cat /tmp/yt_CS5T_Z4ac5E*.srt || true"
maybe_run "cat /tmp/yt_RezeYJFTacs*.srt || true"
maybe_run "mv /tmp/painters-methods-check.pdf /Users/meodai/Sites/color-expert/references/historical/pdfs/laurie-painters-methods-materials.pdf || true"
maybe_run "mv /tmp/painting-material-check.pdf /Users/meodai/Sites/color-expert/references/historical/pdfs/painting-material.pdf || true"

# Section: sample yt-dlp commands used in the settings file
maybe_run "/tmp/markitdown-venv/bin/yt-dlp --flat-playlist --print '%(title)s | %(url)s | %(upload_date)s' https://www.youtube.com/@coloursocietyofaustraliainc/videos 2>/dev/null || true"
maybe_run "/tmp/markitdown-venv/bin/yt-dlp --flat-playlist --print '%(id)s|%(title)s' 'https://www.youtube.com/playlist?list=PL_R944l7dVpbxQjy0LUt75HUN0RioNYyD' 2>/dev/null || true"

# Section: simple web checks
maybe_run "curl -skL http://www.huevaluechroma.com/ || true"

# Section: iterate huevaluechroma pages (reconstructed loop)
maybe_run "BASE=http://www.huevaluechroma.com; for page in 011 021 031 041 051 061 071 081 091 101 111 121; do curl -skL \"$BASE/$page\" -o \"/tmp/hvc_$page.html\" || true; done"

# Section: run embedded Python snippet that inspects a JS file
maybe_run "/tmp/markitdown-venv/bin/python3 <<'PYEOF'
with open('/tmp/coolors.js') as f:
    js = f.read()

idx = js.find('on=[["ff9fb2"')
if idx == -1:
    idx = js.find('[["ff9fb2"')
if idx != -1:
    start = max(0, idx - 50)
    print('Context:', js[start:idx+100])
    chunk = js[idx:]
    end = chunk.find(']];') + 2
    arr_str = chunk[:end+1]
    palettes = arr_str.count('],[') + 1
    print(f"Array length: {len(arr_str)} chars")
    print(f"~{palettes} palettes (each 5 colors)")
    print("That's it — {palettes} pre-made palettes, randomly shown. No algorithm.")
PYEOF || true"

echo
echo "Done. Re-run with --run to actually execute the commands."
