#!/usr/bin/env bash
set -euo pipefail

# Extract rough outline from scanned PDFs using OCR.
# Usage:
#   scripts/ocr-outline.sh _sources/kavcic/biologija-6.pdf 6

PDF=${1:?"PDF path required"}
GRADE=${2:?"Grade (6|7|8) required"}
OUTDIR="curriculum"
TMPDIR="/tmp/bio-ocr-$GRADE-$$"
mkdir -p "$OUTDIR" "$TMPDIR"

# Render first N pages (tune as needed). Many textbooks keep table of contents early.
N_PAGES=${N_PAGES:-35}
DPI=${DPI:-200}

pdftoppm -f 1 -l "$N_PAGES" -r "$DPI" -png "$PDF" "$TMPDIR/p" >/dev/null

OUT="$OUTDIR/grade-$GRADE-outline.txt"
: > "$OUT"

for img in "$TMPDIR"/p-*.png; do
  # Serbian OCR (Cyrillic/Latin mixed). Keep it raw; we will post-process later.
  tesseract "$img" stdout -l srp 2>/dev/null >> "$OUT"
  echo -e "\n\n--- PAGE $(basename "$img") ---\n\n" >> "$OUT"
done

echo "Wrote: $OUT"
rm -rf "$TMPDIR"
