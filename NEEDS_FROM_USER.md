# What I need from you

Everything below is optional except the **Required** section. Each feature turns
itself on as soon as its keys are present, and the app runs without the rest
(payments fall back to a mock checkout, emails and pushes go to the server log).
Every key is described in [`.env.example`](./.env.example).

## 1. Required to run

| What | Where to get it | Goes in |
| --- | --- | --- |
| MongoDB URI | The MongoDB already on the Lightsail server, e.g. `mongodb://fitplanet:PASSWORD@127.0.0.1:27017/fitplanet?authSource=fitplanet` (see section 6) | `DB_URI`, plus `DB_NAME=fitplanet` |
| Session secret | `openssl rand -base64 32` | `AUTH_SECRET` |
| Domain | Point an A record at the Lightsail static IP | `APP_URL=https://yourdomain.com` |

To show sample studios on the live site before real gyms join, load them once
(optional). The database only listens on the server, so tunnel to it from your
machine: `ssh -N -L 27018:127.0.0.1:27017 ubuntu@SERVER_IP`, then in another
terminal run `bun run db:demo-studios` with `DB_URI` set to the same URI but
port `27018`. It adds only gyms and their reviews, tagged as samples: no accounts
and no bookings, and members can't buy passes at them. Remove them later in
`/admin/gyms` under "Sample studios" (all at once, or hide them one by one).

`bun run db:seed` is for local development only: it also creates
`owner@fitplanet.dev` and `member@fitplanet.dev` with a known password
(`fitplanet123`, or `SEED_PASSWORD`), so don't run it against production.

## 2. Firebase push notifications

Owners get a push when someone books a pass. Fill this object from Firebase
console > Project settings > General > Your apps > Web app. These values are
public; they are read in `src/lib/firebase/config.ts`.

```ts
export const firebasePublicConfig = {
  apiKey: "",            // NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "",        // NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "",         // NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "",     // NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "", // NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "",             // NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "",     // NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
// Cloud Messaging > Web Push certificates > Generate key pair
// NEXT_PUBLIC_FIREBASE_VAPID_KEY = ""
```

Also needed (secret, server only): **service account JSON** from Project settings >
Service accounts > Generate new private key, as `FIREBASE_SERVICE_ACCOUNT`
(one-line JSON or `base64 -w0 file.json`).

## 3. Stripe payments

- `STRIPE_SECRET_KEY` from Developers > API keys.
- Webhook endpoint `https://yourdomain.com/api/webhooks/payments/stripe` with events
  `checkout.session.completed`, `checkout.session.async_payment_succeeded`,
  `checkout.session.expired`, `checkout.session.async_payment_failed`, `charge.refunded`.
  Its signing secret goes in `STRIPE_WEBHOOK_SECRET`.
- **Heads up:** Stripe does not onboard businesses in Pakistan. The practical route
  for an unregistered founder is a US LLC (Stripe Atlas) or a UK Ltd; see
  [docs/PAYMENTS.md](docs/PAYMENTS.md) for the comparison. Until then, pay-at-desk
  keeps the booking flow working. The mock checkout (no real charge) only runs
  in development, or in production with `ALLOW_MOCK_PAYMENTS=true` on a staging server.

## 4. Sign-in providers

- **Google:** Cloud console > Credentials > OAuth client (Web). Redirect URI
  `https://yourdomain.com/api/auth/callback/google` (plus `http://localhost:3000/...` for dev).
  Keys: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`.
- **Facebook (optional):** redirect URI `https://yourdomain.com/api/auth/callback/facebook`.
  Keys: `AUTH_FACEBOOK_ID`, `AUTH_FACEBOOK_SECRET`.

## 5. Email (SMTP)

Needed for magic-link sign-in, password resets and booking receipts. Any SMTP
works (Amazon SES, Resend, Postmark, Brevo, Gmail app password):
`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`.

## 6. Lightsail server (one time)

Your box (16 GB RAM, 320 GB disk, MongoDB on the same server, nginx with
certbot) is plenty for launch. Steps:

1. **MongoDB.** Keep it bound to localhost and give the app its own user. In
   `/etc/mongod.conf`:

   ```yaml
   net:
     bindIp: 127.0.0.1
   security:
     authorization: enabled
   storage:
     wiredTiger:
       engineConfig:
         cacheSizeGB: 4   # leaves room for the app, nginx and the page cache
   ```

   Then create the user once in `mongosh` (as your admin user) and restart
   with `sudo systemctl restart mongod`:

   ```js
   use fitplanet
   db.createUser({ user: "fitplanet", pwd: "<long random password>", roles: [{ role: "readWrite", db: "fitplanet" }] })
   ```

   If your MongoDB doesn't have auth on yet, create an admin user first, or
   skip `authorization` and use `mongodb://127.0.0.1:27017` as `DB_URI`
   (still safe while it only listens on localhost). The app creates its own
   indexes on start.

2. **Server setup.** Copy the `deploy/` folder to the server and run
   `sudo bash deploy/setup-server.sh yourdomain.com you@email.com`.
   It installs Bun (the version pinned in package.json), runs the app as the
   `fitplanet` systemd service (starts on boot, restarts on crash, capped at
   3 GB of memory), adds the hourly reminder job and a **nightly database
   backup** (03:30, kept 14 days in `/var/www/fitplanet/shared/backups`; needs
   `mongodump` from `mongodb-database-tools`). No Node.js or pm2 is needed.
   Each deploy checks `/api/health` and rolls back to the previous release if
   the new one doesn't come up. Logs: `journalctl --user -u fitplanet -f` as
   the deploy user.

3. **nginx.** If certbot already issued a certificate for the domain, the
   script leaves nginx and certbot alone (force this with `SKIP_NGINX=1`). Add
   Fit Planet to your existing site in two lines:

   ```bash
   sudo cp /var/www/fitplanet/nginx/nginx-zone.conf /etc/nginx/conf.d/fitplanet-zone.conf
   ```

   and inside the `listen 443 ssl` server block that certbot manages for the
   domain, replace any existing `location /` with:

   ```nginx
   include /var/www/fitplanet/nginx/nginx-locations.conf;
   ```

   Then `sudo nginx -t && sudo systemctl reload nginx`. That gives you the
   proxy to the app, uploads served from disk, cached build assets and a
   per-IP rate limit. On a fresh server without a certificate, the script
   sets all of this up and runs certbot itself.

4. Fill `/var/www/fitplanet/shared/.env` from `.env.example`, with the
   `DB_URI` above, `STORAGE_LOCAL_DIR=/var/www/fitplanet/shared/uploads` and a
   random `CRON_SECRET` (`openssl rand -hex 24`).

## 7. GitHub Actions (Settings > Secrets and variables > Actions)

Pushing to `main` builds the app on GitHub and ships it to the server
(`.github/workflows/deploy.yml`). Create an environment named `production`, then add:

**Secrets**

| Name | Value |
| --- | --- |
| `LIGHTSAIL_HOST` | Static IP or hostname |
| `LIGHTSAIL_USER` | `ubuntu` |
| `LIGHTSAIL_SSH_KEY` | Private key whose public half is in `~/.ssh/authorized_keys` on the server |
| `LIGHTSAIL_PORT` | Optional, defaults to 22 |

**Variables** (baked into the browser bundle at build time)

`APP_URL` and all `NEXT_PUBLIC_FIREBASE_*` keys from section 2.

## 8. Media storage

Uploads are stored on the server disk at `/var/www/fitplanet/shared/uploads`
and served by nginx at `/media`. To move to Cloudflare R2 later, set
`STORAGE_PROVIDER=s3`, the `S3_*` keys and `STORAGE_PUBLIC_URL` to the bucket's
public URL, then copy the uploads folder into the bucket. Also add
`STORAGE_PUBLIC_URL` as a GitHub Actions variable so the image optimizer allows
that domain. No code changes.

## 9. Legal details and review

The site now has `/privacy`, `/terms` and `/imprint`, linked from the footer
and the sign-up form. They read the business details from these keys:

| Key | Example |
| --- | --- |
| `LEGAL_NAME` | Fit Planet LLC |
| `LEGAL_ADDRESS` | 123 Main St \| Suite 4 \| Wilmington, DE 19801 \| United States |
| `LEGAL_EMAIL` | privacy@yourdomain.com |
| `LEGAL_PHONE` | Optional |
| `LEGAL_REPRESENTATIVE` | Managing director's name (needed for Germany) |
| `LEGAL_REGISTER` | Company register and number, once registered |
| `LEGAL_VAT_ID` | EU VAT ID, if you have one |
| `LEGAL_JURISDICTION` | Delaware, United States |

Germany requires a real name, postal address and email on the imprint before
launch. The texts are written in plain English as a solid starting point;
have a lawyer check them for the EU, UAE and Türkiye before going live.

## 10. Admin console

Set `ADMIN_EMAILS` in the server's `.env` to your own email (comma-separated for
more people), sign in with that account and open `/admin`.
