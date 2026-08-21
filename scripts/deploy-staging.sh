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

if ! git diff --quiet -- . ':!node_modules' ':!.next'; then
  echo "abort: tracked files are dirty in ${APP_DIR}"
  git status --short -- . ':!node_modules' ':!.next'
  exit 1
fi

git checkout "${BRANCH}"
git pull --ff-only origin "${BRANCH}"

NEW="$(git rev-parse --short HEAD)"
echo "staging frontend current: ${NEW}"

npm ci
npm run build
systemctl restart "${SERVICE}"
systemctl is-active --quiet "${SERVICE}"

sleep 4
curl -fsSL -o /dev/null -w "frontend health %{http_code}\n" "${HEALTH_URL}"

echo "staging frontend deploy ok ${PREV} -> ${NEW}"
echo "rollback: cd ${APP_DIR} && git checkout ${PREV} && npm ci && npm run build && systemctl restart ${SERVICE}"
