# Fit Planet

Day, week and month passes for gyms. Members find a gym, pay, and walk in with a
QR pass; owners get a push the moment someone books and run their desk from a phone.

- **Members** (`/app`, mobile first): passes with QR codes, passport stamps, saved gyms, notifications.
- **Gym owners** (`/studio`): dashboard, check-in desk with camera scanning, bookings, pricing, reviews, revenue.
- **Public site**: explore gyms, gym pages, checkout.

## Stack

Next.js 16 (App Router, server actions), React 19, Tailwind CSS v4, MongoDB,
NextAuth v5, Stripe, Firebase Cloud Messaging. Architecture and the feature
checklist are in [`docs/PLAN.md`](docs/PLAN.md); security measures in
[`docs/SECURITY.md`](docs/SECURITY.md).

Third-party providers sit behind small service interfaces in
`src/server/services/` (payments, storage, push, email). Swapping a provider
means adding one file there and changing an env var.

## Local development

```bash
bun install
cp .env.example .env.local   # fill DB_URI and AUTH_SECRET at minimum
bun run db:seed              # demo gyms + owner@fitplanet.dev / member@fitplanet.dev (fitplanet123)
bun dev
```

Checks: `bun run typecheck`, `bun run lint`, `bun run test:smoke` (end-to-end
booking flow against the database in `.env.local`).

## Deployment

GitHub Actions builds a standalone bundle and deploys it to an AWS Lightsail
server running nginx + Bun (systemd service) on every push to `main`. Server setup, secrets and
everything else needed are listed in [`NEEDS_FROM_USER.md`](NEEDS_FROM_USER.md).
