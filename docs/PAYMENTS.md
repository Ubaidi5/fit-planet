# Taking payments as an unregistered business

Fit Planet (under KarachiSol) is not a registered company, and the founders are in
Pakistan. This note compares the realistic ways to take card payments in the target
markets (US, Australia, Europe, UAE, Türkiye). Stripe stays the default provider in
code; switching or adding one means a new file in `src/server/services/payments/`.

Provider rules change often. Re-check each provider's current onboarding page before
committing to one.

## What Fit Planet needs from a provider

- Cards, Apple Pay and Google Pay in USD, AUD, EUR, GBP, AED and TRY.
- Refunds, because members can cancel up to a day before.
- **Marketplace payouts.** Members pay Fit Planet, and each gym gets its share minus
  the platform fee. This is the requirement that rules most options out.

## Options

| Option | Onboards an unregistered Pakistani founder? | Marketplace payouts to gyms | Verdict |
| --- | --- | --- | --- |
| **Stripe, via a US LLC (Stripe Atlas) or a UK Ltd** | Yes. You form the company abroad as a non-resident; no Pakistani registration is needed | Yes, with Stripe Connect (gyms onboard themselves and get paid out in their own country) | **Recommended.** The code is already built for it |
| Stripe with a Pakistani entity | No. Stripe does not support Pakistan | n/a | Not possible |
| Paddle / Lemon Squeezy (merchant of record) | Often accept individuals | No. Their terms cover digital products and SaaS, not third-party services such as gym passes | Not suitable |
| Payoneer checkout | Needs an approved business account | Limited | Weak fit |
| Local gateways (Safepay, PayFast, JazzCash, Easypaisa) | Usually need SECP or NTN registration | No | Only for Pakistani cards; doesn't help the target markets |
| 2Checkout (Verifone) | Needs a registered company | Limited | Already ruled out |
| Pay at the desk (already built) | Nothing to onboard | Gyms collect the money directly | **Use until online payments are live** |

## Recommended path

1. **Now:** launch with pay-at-desk. It already works end to end: booking, QR pass,
   and the desk "Mark as paid" flow. No money passes through Fit Planet.
2. **When ready to charge online:** form a US LLC with Stripe Atlas (about $500 once,
   plus state and registered-agent fees each year) or a UK Ltd (cheaper to form, but it
   needs a UK address service). Open Stripe under that company and set the env keys
   listed in NEEDS_FROM_USER.md.
3. **Then:** turn on Stripe Connect so each gym is paid automatically. Right now
   payouts are manual bank transfers, as the Revenue page explains. Connect is the
   next payments feature to build once the Stripe account exists.

Tax note: a foreign LLC has its own filing duties (in the US, for example, Form 5472
for foreign-owned single-member LLCs). Talk to an accountant before forming one.

Background reading: [Stripe Atlas](https://stripe.com/au/newsroom/news/stripe-launches-atlas),
[Stripe alternatives for non-US residents](https://nomadadvisers.com/guides/stripe-alternatives-non-us-residents),
[Stripe alternatives in Pakistan](https://news.cxoforum.global/stripe-alternative-in-pakistan-why-local-businesses-cant-use-stripe-and-what-to-use-instead/).
