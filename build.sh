#!/usr/bin/env sh
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
