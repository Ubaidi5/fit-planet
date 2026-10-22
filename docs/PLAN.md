# Fit Planet production plan

This is the working plan for turning the Passport + Orbit UI into a working product.
It is updated as work lands. Status: `[x]` done, `[~]` partly done, `[ ]` not started.

## Architecture decision

Fit Planet is a **modular monolith with swappable service adapters**, not microservices (yet).

- One Next.js app, deployed as a long-running Node process on AWS Lightsail (no cold starts).
- Every external dependency sits behind an interface in `src/server/services/<name>/`:
  `payments`, `storage`, `push`, `email`. Each folder has `types.ts` (the contract),
  one file per provider, and `index.ts` that picks the provider from an env var.
  Swapping Stripe for another gateway means adding `payments/<new>.ts` and setting
  `PAYMENT_PROVIDER=<new>`. Nothing in the UI or the domain code changes.
- Business rules live in `src/server/modules/<domain>/` (gyms, bookings, checkins, reviews,
  notifications, users, analytics). Modules only talk to the database and to services,
  never to React. This is the seam we would cut along if a module becomes its own service later.
- Server actions in `src/actions/` are the API layer for the UI. They validate input with zod,
  check the session, then call a module. Route handlers are only used where an external system
  calls us (Stripe webhooks, NextAuth, the Firebase service worker, local media files).

```
UI (app/, components/)  ->  actions/ (server actions, zod, auth guard)
                              -> server/modules/ (business rules)
                                   -> server/db (MongoDB)
                                   -> server/services/{payments,storage,push,email}
```

Why not microservices now: there are no users yet, one person maintains it, and a single
Lightsail box is the target. Clean module boundaries give us the "change one service" property
the brief asks for without the operational cost of many deployables.

## Stack choices

| Concern | Choice | Swap path |
| --- | --- | --- |
| Database | MongoDB (already used) via official driver | Atlas or self-hosted, `DB_URI` |
| Auth | NextAuth v5 + MongoDB adapter, JWT sessions | Providers switch on when their env keys exist |
| Sign-in methods | Email + password, email magic link, Google, Facebook | Add any Auth.js provider in `src/lib/auth.ts` |
| Payments | Stripe Checkout (hosted, cards + Apple/Google Pay, 135+ currencies) and a `mock` provider for local testing | `PAYMENT_PROVIDER` |
| Push | Firebase Cloud Messaging (web push) + in-app notification feed | `PUSH_PROVIDER` |
| Email | SMTP via nodemailer (works with SES, Resend, Gmail) and a console provider | `EMAIL_PROVIDER` |
| Storage | Local disk on the Lightsail server, served by nginx at `/media` | `STORAGE_PROVIDER=s3` for R2, S3, MinIO |
| Deploy | GitHub Actions: typecheck + build, then rsync a standalone build to Lightsail, pm2 reload | |

## Feature list (from the brainstorm, the product spec and research)

### Members (mobile first)
- [ ] Sign up / sign in: email + password, magic link, Google, Facebook
- [ ] Explore gyms from the database (orbit + list), search by city, filters
- [ ] Gym page from the database with live occupancy from real check-ins
- [ ] Checkout: pick pass (day, week, month), start date, pay with Stripe or at the desk
- [ ] Pass wallet: active passes with a real QR code, history, receipts
- [ ] Passport stamps earned from real check-ins
- [ ] Save gyms, leave reviews after a visit
- [ ] Notification feed + web push (booking confirmed, pass expiring)
- [ ] Profile: name, phone, home city, avatar upload, notification settings

### Gym owners (desktop rich, mobile shows the essentials)
- [ ] Become an owner: onboarding wizard that creates the gym listing
- [ ] Dashboard: today's bookings, revenue, check-ins, live occupancy, recent activity
- [ ] Push notification to the owner the moment a day pass is booked
- [ ] Bookings table with filters and CSV export (cards on mobile)
- [ ] Check-in desk: scan a member's QR with the camera or type the code
- [ ] Gym profile editor: details, hours, amenities, photos (upload to storage)
- [ ] Pricing editor: day, week, month passes; publish / unpublish listing
- [ ] Reviews: read and reply
- [ ] Revenue: totals by period and pass type

### Platform
- [ ] Service layer: payments, storage, push, email behind interfaces
- [ ] Stripe webhook that confirms payment and issues the pass
- [ ] Seed script that loads the demo gyms into MongoDB
- [ ] `.env.example` with a description of every key
- [ ] `NEEDS_FROM_USER.md` with every credential and setup step
- [ ] GitHub Actions CI/CD to Lightsail, nginx + pm2 config, server bootstrap script

### Later (not in this pass)
- Routines, social feed and challenges stay on demo data for now.
- Staff accounts and roles inside a gym, payouts / Stripe Connect, SMS OTP, admin console.
