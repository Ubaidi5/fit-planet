# Security notes

What the app does to protect members, owners and the business, and what to
keep in mind when changing it.

## Accounts and sessions

- Passwords are bcrypt-hashed (cost 12). Sign-in, sign-up, reset links and
  magic links are rate limited per IP and per email (`src/server/rate-limit.ts`),
  including the credentials endpoint itself, not just the form.
- Sessions are JWTs that carry the time of sign-in. Changing or resetting a
  password, or "Sign out other devices" on the security page, sets
  `sessionsValidFrom` on the account; older sessions stop working everywhere.
- Account linking by email is only allowed for Google, and only when Google
  says the email is verified. Facebook never links by email.
- A password set at sign-up is marked unverified. Whoever later proves the
  inbox (email link, Google, or a reset link) takes the account over and the
  unverified password is removed, so registering someone else's email first
  doesn't let a squatter keep access.
- Reset and magic-link requests answer the same way whether or not an
  account exists.

## Authorization

- Every server action re-checks the session. Owner actions are scoped to the
  gyms the person owns or staffs; member actions to their own records.
- A pass code from another gym reads as "no pass with that code", so codes
  can't be used to look up other gyms' bookings. Check-ins are rate limited
  per owner.

## Payments

- Stripe webhooks are signature-checked.
- The mock gateway confirms bookings without taking money. In production it
  is switched off unless `ALLOW_MOCK_PAYMENTS=true`; with no gateway,
  checkout offers pay-at-desk only.

## Uploads and user content

- Uploads must match their declared type by file signature (JPEG, PNG, WebP,
  AVIF, GIF, MP4, WebM, MOV), are size-limited, and are stored under random
  names. nginx serves `/media` with `nosniff` and a sandboxing CSP.
- Gyms, posts and avatars can only reference photos the same person
  uploaded (or ones the gym already had).
- Gym website links must be http(s); social links take handles only.
- The bookings CSV export neutralises spreadsheet formulas.
- Posting, comments, likes, follows, reports, reviews, bookings and uploads
  are rate limited per account.

## Privacy (GDPR)

- Members download everything stored about them as JSON from Settings,
  Security (`/app/security/export`, five downloads an hour). Password hashes,
  push tokens and OAuth tokens are left out.
- Members delete their account from the same page by typing their email.
  Profile, posts, comments, likes, follows, routines, workouts, notifications,
  devices and uploaded files are erased. Reviews stay without the name;
  bookings keep their amounts for the gym's books but lose contact details.
- Accounts that manage a gym, or hold an active or upcoming pass, can't be
  deleted until that is sorted out, so no paid pass or gym is left orphaned.
- Only essential cookies are used (session, sign-in security, region), so no
  consent banner is needed.

## Transport and headers

- nginx: HTTPS via certbot, per-IP flood limit, `server_tokens off`.
- App: `X-Frame-Options: DENY`, `frame-ancestors 'none'`, `nosniff`,
  strict referrer policy, Permissions-Policy (camera and location only for
  this site), COOP, HSTS in production, no `X-Powered-By`.

## Secrets

- All secrets come from the server's `.env` (see `.env.example`); nothing
  secret is committed or sent to the browser. Firebase web config values are
  public by design.
- `CRON_SECRET` protects the cron endpoint and is compared in constant time.

## Dependencies

Run `bun audit` before releases. As of this writing the only open advisory is
in `braces`, used by the linter at development time only.
