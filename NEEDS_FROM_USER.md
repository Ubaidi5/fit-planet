# What I need from you

Everything below is optional except the **Required** section. Each feature turns
itself on as soon as its keys are present, and the app runs without the rest
(payments fall back to a mock checkout, emails and pushes go to the server log).
Every key is described in [`.env.example`](./.env.example).

## 1. Required to run

| What | Where to get it | Goes in |
| --- | --- | --- |
| MongoDB URI | MongoDB Atlas > Database > Connect > Drivers (allow the Lightsail static IP under Network Access) | `DB_URI` |
| Session secret | `openssl rand -base64 32` | `AUTH_SECRET` |
| Domain | Point an A record at the Lightsail static IP | `APP_URL=https://yourdomain.com` |

Then load demo data once from your machine (optional): `bun run db:seed` with
`DB_URI` pointing at the database. It creates `owner@fitplanet.dev` and
`member@fitplanet.dev` (password `fitplanet123`, or `SEED_PASSWORD`).

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
- **Heads up:** Stripe does not onboard businesses registered in Pakistan. If that
  applies, tell me which provider you can use (e.g. Safepay, PayFast, Paddle,
  Lemon Squeezy) and I will add one file in `src/server/services/payments/`;
  nothing else changes. Until then the mock provider and pay-at-desk keep the
  booking flow working.

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

1. Create an Ubuntu 22.04/24.04 instance (2 GB RAM or more), attach a static IP,
   open ports 80 and 443 in the Lightsail firewall.
2. Copy the `deploy/` folder to the server and run
   `sudo bash deploy/setup-server.sh yourdomain.com you@email.com`.
   It installs Node 22, pm2, nginx and an HTTPS certificate.
3. Fill `/var/www/fitplanet/shared/.env` from `.env.example`, with
   `STORAGE_LOCAL_DIR=/var/www/fitplanet/shared/uploads` and a random
   `CRON_SECRET` (`openssl rand -hex 24`). The setup script already installed
   the hourly cron that sends pass reminders.

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
public URL, then copy the uploads folder into the bucket. No code changes.
