#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 22.04/24.04 Lightsail instance.
# Usage (on the server):  sudo bash setup-server.sh your-domain.com you@email.com
set -euo pipefail

DOMAIN="${1:?domain required}"
EMAIL="${2:?email for the HTTPS certificate required}"
DEPLOY_USER="${SUDO_USER:-ubuntu}"
APP_DIR=/var/www/fitplanet

apt-get update
apt-get install -y curl nginx certbot python3-certbot-nginx

# Bun for the deploy user (no Node.js needed). The deploy keeps it on the
# version pinned in package.json's packageManager field.
BUN_VERSION="${BUN_VERSION:-1.4.4}"
apt-get install -y unzip
sudo -u "$DEPLOY_USER" bash -c "curl -fsSL https://bun.sh/install | bash -s bun-v$BUN_VERSION"

# Small instances need swap headroom
if [ ! -f /swapfile ]; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
fi

mkdir -p "$APP_DIR"/{releases,shared/uploads}
touch "$APP_DIR/shared/.env"
chmod 600 "$APP_DIR/shared/.env"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
sed "s/fitplanet.example.com/$DOMAIN/g" "$SCRIPT_DIR/nginx.conf" > /etc/nginx/sites-available/fitplanet
ln -sfn /etc/nginx/sites-available/fitplanet /etc/nginx/sites-enabled/fitplanet
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL" --redirect

# Run the app as a systemd user service that starts on boot
loginctl enable-linger "$DEPLOY_USER"
install -Dm644 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SCRIPT_DIR/fitplanet.service" "/home/$DEPLOY_USER/.config/systemd/user/fitplanet.service"
chown -R "$DEPLOY_USER":"$DEPLOY_USER" "/home/$DEPLOY_USER/.config"

# Hourly jobs: pass reminders and releasing abandoned checkouts (needs CRON_SECRET in .env)
CRON_LINE='15 * * * * secret=$(grep -E "^CRON_SECRET=" /var/www/fitplanet/shared/.env | cut -d= -f2-) && curl -fsS -m 60 -X POST -H "Authorization: Bearer $secret" http://127.0.0.1:3000/api/cron/hourly >/dev/null'
( crontab -u "$DEPLOY_USER" -l 2>/dev/null | grep -v "/api/cron/hourly" ; echo "$CRON_LINE" ) | crontab -u "$DEPLOY_USER" -

echo
echo "Done. Next:"
echo "  1. Fill $APP_DIR/shared/.env (copy from .env.example). Set STORAGE_LOCAL_DIR=$APP_DIR/shared/uploads"
echo "     and CRON_SECRET=\$(openssl rand -hex 24)"
echo "  2. Add the GitHub secrets listed in NEEDS_FROM_USER.md and push to main."
