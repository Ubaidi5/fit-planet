#!/usr/bin/env bash
# One-time setup for the Lightsail server (Ubuntu 22.04/24.04).
#
#   sudo bash setup-server.sh your-domain.com you@email.com
#
# Safe on a server that already runs nginx and certbot for this domain: when a
# certificate for the domain exists (or SKIP_NGINX=1), nginx is left alone and
# the Fit Planet nginx snippets are only copied next to the app for you to
# include (see NEEDS_FROM_USER.md, section 6). MongoDB is never installed or
# changed here; point DB_URI at the database already on the server.
set -euo pipefail

DOMAIN="${1:?domain required}"
EMAIL="${2:-}"
DEPLOY_USER="${SUDO_USER:-ubuntu}"
APP_DIR=/var/www/fitplanet
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ "${SKIP_NGINX:-}" != "1" ] && [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo "Found an existing certificate for $DOMAIN, so nginx and certbot are left as they are."
  SKIP_NGINX=1
fi

apt-get update
apt-get install -y curl unzip
if [ "${SKIP_NGINX:-}" != "1" ]; then
  apt-get install -y nginx certbot python3-certbot-nginx
fi

# Bun for the deploy user (no Node.js needed). The deploy keeps it on the
# version pinned in package.json's packageManager field.
BUN_VERSION="${BUN_VERSION:-1.4.4}"
sudo -u "$DEPLOY_USER" bash -c "curl -fsSL https://bun.sh/install | bash -s bun-v$BUN_VERSION"

# Swap only matters on small instances; a 16 GB box doesn't need it
MEM_MB=$(awk '/MemTotal/ { print int($2 / 1024) }' /proc/meminfo)
if [ "$MEM_MB" -lt 4096 ] && [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

mkdir -p "$APP_DIR"/{releases,shared/uploads,shared/backups,nginx}
touch "$APP_DIR/shared/.env"
chmod 600 "$APP_DIR/shared/.env"
sed "s/fitplanet.example.com/$DOMAIN/g" "$SCRIPT_DIR/nginx.conf" > "$APP_DIR/nginx/fitplanet-site.conf"
cp "$SCRIPT_DIR/nginx-zone.conf" "$SCRIPT_DIR/nginx-locations.conf" "$APP_DIR/nginx/"
install -m755 "$SCRIPT_DIR/backup-db.sh" "$APP_DIR/backup-db.sh"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"

if [ "${SKIP_NGINX:-}" != "1" ]; then
  : "${EMAIL:?email for the HTTPS certificate required}"
  cp "$SCRIPT_DIR/nginx-zone.conf" /etc/nginx/conf.d/fitplanet-zone.conf
  cp "$APP_DIR/nginx/fitplanet-site.conf" /etc/nginx/sites-available/fitplanet
  ln -sfn /etc/nginx/sites-available/fitplanet /etc/nginx/sites-enabled/fitplanet
  nginx -t && systemctl reload nginx
  certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect
fi

# Run the app as a systemd user service that starts on boot
loginctl enable-linger "$DEPLOY_USER"
install -Dm644 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SCRIPT_DIR/fitplanet.service" "/home/$DEPLOY_USER/.config/systemd/user/fitplanet.service"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "/home/$DEPLOY_USER/.config"

# Hourly jobs: pass reminders and releasing abandoned checkouts (needs CRON_SECRET in .env).
# Nightly at 03:30: database backup to shared/backups, kept for 14 days.
CRON_LINE='15 * * * * secret=$(grep -E "^CRON_SECRET=" /var/www/fitplanet/shared/.env | cut -d= -f2-) && curl -fsS -m 60 -X POST -H "Authorization: Bearer $secret" http://127.0.0.1:3000/api/cron/hourly >/dev/null'
BACKUP_LINE="30 3 * * * $APP_DIR/backup-db.sh >> $APP_DIR/shared/backups/backup.log 2>&1"
( crontab -u "$DEPLOY_USER" -l 2>/dev/null | grep -v -e "/api/cron/hourly" -e "backup-db.sh" ; echo "$CRON_LINE" ; echo "$BACKUP_LINE" ) | crontab -u "$DEPLOY_USER" -

echo
echo "Done. Next:"
echo "  1. Fill $APP_DIR/shared/.env (copy from .env.example). Set DB_URI to the local MongoDB,"
echo "     STORAGE_LOCAL_DIR=$APP_DIR/shared/uploads and CRON_SECRET=\$(openssl rand -hex 24)"
if [ "${SKIP_NGINX:-}" = "1" ]; then
  echo "  2. nginx was not touched. Add the snippets in $APP_DIR/nginx/ to your site"
  echo "     (NEEDS_FROM_USER.md, section 6), then: sudo nginx -t && sudo systemctl reload nginx"
  echo "  3. Add the GitHub secrets listed in NEEDS_FROM_USER.md and push to main."
else
  echo "  2. Add the GitHub secrets listed in NEEDS_FROM_USER.md and push to main."
fi
command -v mongodump >/dev/null || echo "  Note: mongodump isn't installed, so nightly backups will fail. Install mongodb-database-tools."
