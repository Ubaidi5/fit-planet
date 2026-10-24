#!/usr/bin/env bash
# Nightly MongoDB backup (cron, see setup-server.sh). Reads DB_URI and DB_NAME
# from the app's .env, writes one compressed archive per night and keeps 14.
set -euo pipefail
APP_DIR="${APP_DIR:-/var/www/fitplanet}"
OUT="$APP_DIR/shared/backups"
KEEP_DAYS="${KEEP_DAYS:-14}"

value() { grep -E "^$1=" "$APP_DIR/shared/.env" | tail -n1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }
DB_URI="$(value DB_URI)"
DB_NAME="$(value DB_NAME)"
: "${DB_URI:?DB_URI missing in .env}"

mkdir -p "$OUT"
file="$OUT/fitplanet-$(date +%F).archive.gz"
# --uri on the command line would show the password in `ps`; a config file doesn't
conf="$(mktemp)"
trap 'rm -f "$conf"' EXIT
chmod 600 "$conf"
printf 'uri: "%s"\n' "$DB_URI" > "$conf"
mongodump --config="$conf" ${DB_NAME:+--db="$DB_NAME"} --archive="$file" --gzip --quiet
chmod 600 "$file"
find "$OUT" -name 'fitplanet-*.archive.gz' -mtime +"$KEEP_DAYS" -delete
echo "$(date -Is) backup ok $(du -h "$file" | cut -f1)"
