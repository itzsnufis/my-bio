#!/usr/bin/env sh
# SCSS -> CSS. No node, no bundler, no config file. Just sass.
#   ./build.sh          expanded (default, readable)
#   ./build.sh --min    compressed, for actually shipping
set -eu

SRC="assets/scss/main.scss"
OUT="assets/css/main.css"

if [ "${1:-}" = "--min" ]; then
  sass --no-source-map --style=compressed "$SRC" "$OUT"
  echo "built $OUT (compressed)"
else
  sass --no-source-map --style=expanded "$SRC" "$OUT"
  echo "built $OUT (expanded)"
fi
