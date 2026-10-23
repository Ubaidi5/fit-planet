#!/usr/bin/env bash
# Unpacks an uploaded release, points `current` at it, makes sure the pinned
# Bun version is installed, restarts the app and keeps the last five releases.
# Run on the server by the deploy workflow.
set -euo pipefail

APP_DIR="$1"
RELEASE="$2"
BUN_VERSION="$3"
ARCHIVE="/tmp/fitplanet-$RELEASE.tgz"
TARGET="$APP_DIR/releases/$RELEASE"
BUN="$HOME/.bun/bin/bun"
export XDG_RUNTIME_DIR="${XDG_RUNTIME_DIR:-/run/user/$(id -u)}"

# Keep the server on the same Bun version as package.json's packageManager
if [ ! -x "$BUN" ] || [ "$("$BUN" --version)" != "$BUN_VERSION" ]; then
  echo "Installing Bun $BUN_VERSION"
  curl -fsSL https://bun.sh/install | bash -s "bun-v$BUN_VERSION" >/dev/null
fi

mkdir -p "$TARGET"
tar -xzf "$ARCHIVE" -C "$TARGET"
rm -f "$ARCHIVE"

# Shared state lives outside releases so it survives deploys
ln -sfn "$APP_DIR/shared/.env" "$TARGET/.env"

ln -sfn "$TARGET" "$APP_DIR/current.tmp"
mv -Tf "$APP_DIR/current.tmp" "$APP_DIR/current"

# Pick up unit changes shipped with the release, then restart
install -Dm644 "$TARGET/fitplanet.service" "$HOME/.config/systemd/user/fitplanet.service"
systemctl --user daemon-reload
systemctl --user enable fitplanet >/dev/null 2>&1
systemctl --user restart fitplanet

# Health check: fail the deploy if the app doesn't answer
for i in $(seq 1 20); do
  if curl -fsS -o /dev/null "http://127.0.0.1:3000/"; then
    echo "Release $RELEASE is live on Bun $("$BUN" --version)"
    break
  fi
  if [ "$i" = 20 ]; then
    echo "App did not respond after deploy" >&2
    journalctl --user -u fitplanet -n 50 --no-pager || true
    exit 1
  fi
  sleep 2
done

cd "$APP_DIR/releases"
ls -1t | tail -n +6 | xargs -r rm -rf
