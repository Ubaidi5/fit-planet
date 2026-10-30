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

## Admin console

- `/admin` opens only for accounts listed in `ADMIN_EMAILS` (or with the admin
  role); everyone else gets a 404. Every page and action re-checks this.
- Admins verify, feature, suspend and restore gyms, remove reported posts and
  suspend accounts. A suspended account is signed out everywhere and can't sign
  in with a password, an email link, Google or Facebook.
- Every admin action is written to the `admin_log` collection and shown on the
  console's front page.

## Gym staff

- Owners invite front-desk staff by email from Studio, Team. The link is good
  for seven days, stored only as a hash, and only works for an account with
  the invited email, so a forwarded link is useless to anyone else.
- Staff can check passes in, see bookings and mark desk payments. Revenue,
  the listing, prices, reviews, cancellations and exports stay owner-only,
  enforced in each page and server action, not just hidden in the menu.

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

- nginx: HTTPS via certbot, `server_tokens off`, per-IP limits on requests
  (15/s), form posts (5/s) and open connections (40), and short header/body
  timeouts against slow-connection floods (`deploy/nginx-*.conf`).
- App: every page gets a Content Security Policy with a fresh script nonce
  and `'strict-dynamic'` (`src/proxy.ts`). Only scripts Next renders with the
  nonce, and what they load, can run, so injected markup can't execute code.
  CI fails if a page ships a script without the nonce.
- Also `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `nosniff`, strict
  referrer policy, Permissions-Policy (camera and location only for this
  site), COOP, HSTS in production, no `X-Powered-By`.

## Abuse and flood limits

- Second layer in the app (`src/proxy.ts`): per IP, at most 120 form posts or
  server actions and 300 API calls a minute, counted in memory so it costs
  nothing per request. Signed payment webhooks are exempt.
- Finer limits per account and per email for sign-in, sign-up, resets,
  posting, bookings, check-ins and uploads (`src/server/rate-limit.ts`).

## Injection and request forgery

- Server actions validate their input with zod before it reaches a query, and
  URL parameters only ever arrive as strings, so `{"$gt": ""}`-style
  operators can't be injected into database filters.
- Search boxes are matched as literal text, escaped and cut to 80 characters
  (`src/server/db/search.ts`).
- React escapes everything it renders; the only raw HTML is QR code SVG we
  generate and JSON-LD with `<` escaped.
- Server actions only accept posts from this site's own origin (Next checks
  `Origin` against `Host`), Auth.js forms carry a CSRF token, and session
  cookies are `SameSite=Lax`, `HttpOnly` and `Secure` in production.

## Reliability

- Every database call times out after 15 seconds, so a slow query fails its
  own part of the page instead of hanging the request.
- Pages degrade by section (`src/server/degrade.ts`): badge counts, live
  occupancy, reviews and dashboard blocks fall back on their own and show a
  "this part didn't load" card with a retry button. The member app, studio
  and admin have their own error screens inside their navigation, so one
  failing page never takes the whole shell down.
- Studio dashboard totals are computed by MongoDB aggregation pipelines, so
  the server reads a few dozen summary rows instead of every booking.

## Error monitoring

- Sentry reports server and browser errors once `SENTRY_DSN` is set
  (`src/instrumentation.ts`, `src/lib/monitoring.ts`). Use `reportError()`
  instead of `console.error` for anything unexpected.
- Reports carry no user identity, cookies, headers, request bodies, query
  strings or database values, and email addresses, tokens and card-like
  numbers are masked in messages before they leave the server or browser.

## Secrets

- All secrets come from the server's `.env` (see `.env.example`); nothing
  secret is committed or sent to the browser. Firebase web config values are
  public by design.
- `CRON_SECRET` protects the cron endpoint and is compared in constant time.

## Dependencies

Run `bun audit` before releases. As of this writing the only open advisory is
in `braces`, used by the linter at development time only.
