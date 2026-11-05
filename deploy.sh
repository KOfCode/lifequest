#!/usr/bin/env bash
# Commit and push updates to GitHub Pages (KOfCode/lifequest). Bumps the SW cache so phones pick up changes.
set -e; cd "$(dirname "$0")"
sed -i -E "s/const C='boji-v[0-9]+'/const C='boji-v$(date +%s)'/" sw.js
git add -A && git commit -qm "${1:-update $(date '+%F %T')}" || true
git push -q origin main && echo "pushed → https://kofcode.github.io/lifequest/"
