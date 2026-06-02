#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_DIR="${DEPLOY_DIR:-$(cd "$SOURCE_DIR/.." && pwd)/smart-finance-planner}"
COMMIT_MESSAGE="${1:-Deploy SmartFin static app}"
DRY_RUN="${DRY_RUN:-0}"

usage() {
  cat <<USAGE
Usage:
  ./scripts/deploy-public.sh [commit message]

Environment:
  DEPLOY_DIR=/path/to/deployment/repo  Override the public deployment repo path.
  DRY_RUN=1                            Show what would sync without copying, committing, or pushing.

Example:
  ./scripts/deploy-public.sh "Update deployment"
USAGE
}

log() {
  printf '\n==> %s\n' "$1"
}

fail() {
  printf '\nERROR: %s\n' "$1" >&2
  exit 1
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

command -v git >/dev/null 2>&1 || fail "git is required."
command -v rsync >/dev/null 2>&1 || fail "rsync is required."

[[ -d "$SOURCE_DIR/.git" ]] || fail "Source repo not found at $SOURCE_DIR."
[[ -d "$DEPLOY_DIR/.git" ]] || fail "Deployment repo not found at $DEPLOY_DIR."
[[ -f "$SOURCE_DIR/index.html" ]] || fail "Missing source index.html."
[[ -d "$SOURCE_DIR/assets" ]] || fail "Missing source assets directory."

log "Checking deployment repo status"

if [[ -n "$(git -C "$DEPLOY_DIR" status --porcelain)" ]]; then
  git -C "$DEPLOY_DIR" status --short
  fail "Deployment repo has uncommitted changes. Commit, stash, or remove them before deploying."
fi

log "Syncing deployable static files"

RSYNC_FLAGS=(-av --delete)

if [[ "$DRY_RUN" == "1" ]]; then
  RSYNC_FLAGS+=(--dry-run)
fi

rsync "${RSYNC_FLAGS[@]}" \
  --exclude ".git/" \
  --exclude "README.md" \
  --exclude "PLAN.md" \
  "$SOURCE_DIR/index.html" \
  "$SOURCE_DIR/assets" \
  "$DEPLOY_DIR/"

if [[ "$DRY_RUN" == "1" ]]; then
  log "Dry run complete"
  exit 0
fi

log "Reviewing deployment changes"

git -C "$DEPLOY_DIR" status --short

if [[ -z "$(git -C "$DEPLOY_DIR" status --porcelain)" ]]; then
  log "No deployment changes to commit"
  exit 0
fi

log "Committing deployment"

git -C "$DEPLOY_DIR" add -A
git -C "$DEPLOY_DIR" commit -m "$COMMIT_MESSAGE"

log "Pushing deployment"

git -C "$DEPLOY_DIR" push origin main

log "Deployment pushed successfully"