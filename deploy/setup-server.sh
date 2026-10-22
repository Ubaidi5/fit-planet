#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 22.04/24.04 Lightsail instance.
# Usage (on the server):  sudo bash setup-server.sh your-domain.com you@email.com
set -euo pipefail

DOMAIN="${1:?domain required}"
EMAIL="${2:?email for Let's Encrypt required}"
DEPLOY_USER="${SUDO_USER:-ubuntu}"
APP_DIR=/var/www/fitplanet

apt-get update
apt-get install -y curl nginx certbot python3-certbot-nginx

# Node 22 LTS + pm2
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

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

# Start pm2 on boot for the deploy user
env PATH="$PATH:/usr/bin" pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"

echo
echo "Done. Next:"
echo "  1. Fill $APP_DIR/shared/.env (copy from .env.example). Set STORAGE_LOCAL_DIR=$APP_DIR/shared/uploads"
echo "  2. Add the GitHub secrets listed in NEEDS_FROM_USER.md and push to main."
