#!/usr/bin/env bash
# Unpacks an uploaded release, points `current` at it, reloads pm2 and keeps
# the last five releases. Run on the server by the deploy workflow.
set -euo pipefail

APP_DIR="$1"
RELEASE="$2"
ARCHIVE="/tmp/fitplanet-$RELEASE.tgz"
TARGET="$APP_DIR/releases/$RELEASE"

mkdir -p "$TARGET"
tar -xzf "$ARCHIVE" -C "$TARGET"
rm -f "$ARCHIVE"

# Shared state lives outside releases so it survives deploys
ln -sfn "$APP_DIR/shared/.env" "$TARGET/.env"

ln -sfn "$TARGET" "$APP_DIR/current.tmp"
mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"

cd "$APP_DIR/current"
pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save >/dev/null

# Health check: fail the deploy if the app doesn't answer
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT:-3000}/"; then
    echo "Release $RELEASE is live"
    break
  fi
  if [ "$i" = 20 ]; then
    echo "App did not respond after deploy" >&2
    pm2 logs fitplanet --lines 50 --nostream || true
    exit 1
  fi
  sleep 2
done

cd "$APP_DIR/releases"
ls -1t | tail -n +6 | xargs -r rm -rf
