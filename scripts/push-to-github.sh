#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${1:-}" ]]; then
  echo "Usage: $0 <github-repo-url>" >&2
  exit 1
fi

REMOTE_NAME="origin"
REPO_URL="$1"

if git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  git remote set-url "$REMOTE_NAME" "$REPO_URL"
else
  git remote add "$REMOTE_NAME" "$REPO_URL"
fi

echo "Remote '$REMOTE_NAME' now points to $REPO_URL"

git push -u "$REMOTE_NAME" HEAD
