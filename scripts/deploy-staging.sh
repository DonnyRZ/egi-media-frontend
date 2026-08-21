#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/egi-media/cms/frontend"
BRANCH="develop"
SERVICE="egi-media-cms-frontend"
HEALTH_URL="http://127.0.0.1:3012/"

cd "$APP_DIR"
export PATH="/usr/local/bin:/usr/bin:$PATH"

PREV="$(git rev-parse --short HEAD)"
echo "staging frontend previous: ${PREV} ($(git branch --show-current))"

git fetch origin "${BRANCH}"

if [ "${FORCE_DEPLOY:-0}" != "1" ] \
  && [ "$(git branch --show-current)" = "${BRANCH}" ] \
  && [ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/${BRANCH}")" ]; then
  echo "staging frontend already at origin/${BRANCH} ${PREV}"
  exit 0
fi

# Preserve env files; discard other local tracked edits so CI can pull.
# Manual VPS edits to source (e.g. contact email) must go through git.
if ! git diff --quiet -- . ':!node_modules' ':!.next' ':!.env' ':!.env.*'; then
  if [ "${FORCE_DEPLOY:-0}" = "1" ]; then
    echo "FORCE_DEPLOY=1: discarding local tracked source changes (keeping .env*)"
    git diff --name-only -- . ':!node_modules' ':!.next' ':!.env' ':!.env.*' \
      | while IFS= read -r file; do
          [ -n "$file" ] || continue
          git checkout -- "$file"
        done
  else
    echo "abort: tracked files are dirty in ${APP_DIR}"
    git status --short -- . ':!node_modules' ':!.next'
    exit 1
  fi
fi

git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

NEW="$(git rev-parse --short HEAD)"
echo "staging frontend current: ${NEW}"

if ! npm ci; then
  echo "npm ci failed; falling back to npm install"
  npm install
  git checkout -- package-lock.json
fi
npm run build
systemctl restart "${SERVICE}"
systemctl is-active --quiet "${SERVICE}"

sleep 4
curl -fsSL -o /dev/null -w "frontend health %{http_code}\n" "${HEALTH_URL}"

echo "staging frontend deploy ok ${PREV} -> ${NEW}"
echo "rollback: cd ${APP_DIR} && git checkout ${PREV} && npm ci && npm run build && systemctl restart ${SERVICE}"
