#!/usr/bin/env bash
# Copy maatjes assets from temp_assets/maatjes to apps/web/public/graphics/characters/maatjes/
# Normalises folder names: "een-oog eerlijk" -> "een-oog-eerlijk", "slimme rekenaar" -> "slimme-rekenaar"
# If temp_assets/maatjes is missing, creates placeholder PNGs.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="${REPO_ROOT}/temp_assets/maatjes"
DEST="${REPO_ROOT}/apps/web/public/graphics/characters/maatjes"

# Minimal 1x1 transparent PNG (68 bytes)
PLACEHOLDER_PNG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

mkdir -p "$DEST"

# Map normalized folder name to source folder name
src_char_dir() {
  case "$1" in
    wolkje) echo "wolkje" ;;
    een-oog-eerlijk) echo "een-oog eerlijk" ;;
    slimme-rekenaar) echo "slimme rekenaar" ;;
    *) echo "$1" ;;
  esac
}

copy_or_placeholder() {
  local char_dir="$1"
  local expr="$2"
  local src_char
  src_char=$(src_char_dir "$char_dir")
  local src_file="${SRC}/${src_char}/${expr}.png"
  # Also try capitalized (Blij.png etc)
  [[ -f "$src_file" ]] || src_file="${SRC}/${src_char}/${expr^}.png"
  local dest_dir="${DEST}/${char_dir}"
  local dest_file="${dest_dir}/${expr}.png"
  mkdir -p "$dest_dir"
  if [[ -f "$src_file" ]]; then
    cp "$src_file" "$dest_file"
  else
    echo "$PLACEHOLDER_PNG" | base64 -d > "$dest_file"
  fi
}

if [[ -d "$SRC" ]]; then
  # Copy from source with normalisation
  for raw in "wolkje" "een-oog eerlijk" "slimme rekenaar"; do
    case "$raw" in
      "wolkje") norm="wolkje" ;;
      "een-oog eerlijk") norm="een-oog-eerlijk" ;;
      "slimme rekenaar") norm="slimme-rekenaar" ;;
      *) norm="$raw" ;;
    esac
    src_dir="${SRC}/${raw}"
    [[ -d "$src_dir" ]] || continue
    for f in "$src_dir"/*.png; do
      [[ -f "$f" ]] || continue
      base=$(basename "$f" .png | tr '[:upper:]' '[:lower:]')
      copy_or_placeholder "$norm" "$base"
    done
  done
fi

# Ensure all required assets exist (create placeholders if missing)
# wolkje: blij, neutraal, verdrietig, nadenken
for e in blij neutraal verdrietig nadenken; do copy_or_placeholder "wolkje" "$e"; done
# een-oog-eerlijk: blij, feest, neutraal, verrast, verdrietig, nadenken
for e in blij feest neutraal verrast verdrietig nadenken; do copy_or_placeholder "een-oog-eerlijk" "$e"; done
# slimme-rekenaar: blij, feest, verdrietig, nadenken
for e in blij feest verdrietig nadenken; do copy_or_placeholder "slimme-rekenaar" "$e"; done

echo "Maatjes assets ready in ${DEST}"
