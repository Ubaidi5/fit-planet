/**
 * Privacy policy, terms and imprint. Written in English as the binding
 * version; have a lawyer review them for each market before launch
 * (see docs/NEEDS_FROM_USER.md).
 */

export interface LegalSection {
  id: string;
  title: string;
  /** A string is a paragraph, an array is a bulleted list */
  body: (string | string[])[];
}

export interface LegalDetails {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  representative?: string;
  register?: string;
  vatId?: string;
  jurisdiction?: string;
}

export const LEGAL_UPDATED = "2026-10-28";

const contact = (d: LegalDetails) => (d.email ? `by email at ${d.email}` : "through the contact details on our imprint page");

/** Which analytics and ad tools are switched on, so the policy names exactly those */
export interface TrackingDisclosure {
  google: boolean;
  meta: boolean;
  openai: boolean;
}

function trackingTools(t: TrackingDisclosure) {
  const analytics = t.google ? ["Google Analytics and Google Tag Manager (Google LLC / Google Ireland)"] : [];
  const ads = [
    ...(t.google ? ["Google Ads"] : []),
    ...(t.meta ? ["the Meta Pixel and Meta Conversions API (Meta Platforms Ireland / Meta Platforms Inc.)"] : []),
    ...(t.openai ? ["the OpenAI Ads Measurement Pixel and Conversions API (OpenAI OpCo, LLC)"] : []),
  ];
  return { analytics, ads, any: analytics.length + ads.length > 0, adsOn: t.meta || t.openai || t.google };
}

export function privacySections(d: LegalDetails, tracking: TrackingDisclosure = { google: false, meta: false, openai: false }): LegalSection[] {
  const tools = trackingTools(tracking);
  return [
    {
      id: "who-we-are",
      title: "Who we are",
      body: [
        `Fit Planet is run by ${d.name}${d.address ? `, ${d.address.split("|").map((l) => l.trim()).join(", ")}` : ""}. We are the controller of the personal data described here. You can reach us ${contact(d)}.`,
        "Fit Planet is a marketplace. When you book a pass, the gym you book also receives your details and is responsible for how it uses them at the front desk.",
      ],
    },
    {
      id: "what-we-collect",
      title: "What we collect",
      body: [
        [
          "Account details: your name, email address, optional phone number, profile photo, home city, region and language, and how you sign in (password, email link, Google or Facebook). Passwords are stored only as a one-way hash.",
          "Bookings: the gym, pass type, dates, price, payment status and the pass code shown on your QR pass.",
          "Payments: card payments are handled by Stripe. We never see or store your full card number; we keep the payment reference and status.",
          "Gym visits: when a gym scans your pass we record the time and the gym.",
          "Training: routines you build and workouts you log, including sets, reps and weights.",
          "Social: your handle, bio, posts, photos, likes, comments, who you follow and who follows you, and reports you send.",
          "Reviews: the rating and text you write about a gym.",
          "Devices: if you allow notifications, a push token and your browser or device type.",
          "Technical data: IP address and request logs, kept briefly for security and to limit abuse such as password guessing.",
        ],
        "For gym owners and staff we also store the gym listing, photos, opening hours, prices and booking records of the gyms they manage.",
      ],
    },
    {
      id: "why",
      title: "Why we use it",
      body: [
        [
          "To provide the service you asked for: your account, bookings, passes, check-ins, training log and social features (performance of a contract, GDPR art. 6(1)(b)).",
          "To keep accounts and payments safe, prevent fraud and abuse, and enforce our terms (legitimate interests, art. 6(1)(f)).",
          "To send push notifications and optional promotional email, only when you switch them on, and you can switch them off at any time in settings (consent, art. 6(1)(a)).",
          "To keep booking and payment records as tax and commercial law requires (legal obligation, art. 6(1)(c)).",
        ],
        ...(tools.any
          ? [
              "Only if you allow it in the cookie banner: to measure how the site is used and which of our ads bring people to Fit Planet (consent, art. 6(1)(a)). You can withdraw consent at any time from Cookie settings at the bottom of every page.",
            ]
          : []),
        tools.adsOn
          ? "We do not sell your personal information. If you allow advertising cookies, our advertising partners receive data about your visit and sign-ups or bookings (such as a hashed email address, your IP address and the pages you viewed) to measure our ads; some US state laws call this sharing for cross-context behavioural advertising. Reject advertising cookies to opt out."
          : "We do not sell your personal information, we do not share it for cross-context behavioural advertising, and we do not use it to build advertising profiles.",
      ],
    },
    {
      id: "who-sees-it",
      title: "Who sees it",
      body: [
        [
          "The gym you book sees your name, email address, phone number, pass and visit history at that gym.",
          "Other members see what you share on the social side, depending on your visibility setting, and your name next to reviews you write.",
          "Service providers who process data for us under contract: hosting (Amazon Web Services), payments (Stripe), push notifications (Google Firebase), email delivery, and file storage.",
          "Google or Facebook, if you choose to sign in with them.",
          ...(tools.any ? [`With your consent only: ${[...tools.analytics, ...tools.ads].join(", ")}.`] : []),
          "Authorities, when the law requires it.",
        ],
      ],
    },
    {
      id: "transfers",
      title: "International transfers",
      body: [
        "Our providers may process data outside your country, including in the United States. Where data leaves the European Economic Area, the UK, Switzerland, the UAE or Türkiye, we rely on adequacy decisions, the EU-US Data Privacy Framework where the provider is certified, or standard contractual clauses, together with the safeguards each law requires.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      body: [
        [
          "Your account and what you created stay until you delete your account.",
          "When you delete your account we erase your profile, posts, comments, likes, follows, routines, workouts, notifications, devices and uploaded photos straight away. Reviews stay on the gym's page without your name or photo.",
          "Booking and payment records are kept without your contact details for as long as tax and commercial law requires, up to ten years.",
          "Security records such as sign-in attempt counters expire within hours.",
        ],
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      body: tools.any
        ? [
            "Essential cookies keep you signed in, protect sign-in and payments, remember your region and language, and remember your cookie choice. They are always on.",
            "Everything else waits for your choice in the cookie banner, and nothing loads if you reject it:",
            [
              ...(tools.analytics.length ? [`Analytics: ${tools.analytics.join(", ")}, to see which pages and booking steps work.`] : []),
              ...(tools.ads.length ? [`Advertising: ${tools.ads.join(", ")}, to measure which ads bring people to Fit Planet.`] : []),
            ],
            "Your choice is kept for six months. Change it any time from Cookie settings at the bottom of every page; withdrawing consent removes those tools' cookies.",
          ]
        : [
            "We only use cookies the service needs to work: one that keeps you signed in, security cookies used during sign-in, and one that remembers your region and language. We do not use advertising or analytics cookies, so there is nothing to accept or decline.",
          ],
    },
    {
      id: "your-rights",
      title: "Your rights",
      body: [
        "Depending on where you live you can ask to access, correct, download or delete your data, to restrict or object to how we use it, and to withdraw consent at any time. You can do the most common things yourself:",
        [
          "Download everything we hold about you from Settings, Security, Your data.",
          "Delete your account from the same page.",
          "Change your profile, notification and social privacy settings at any time.",
        ],
        `For anything else, contact us ${contact(d)}. We answer within one month, or sooner where the law requires.`,
        "If you are in the EU or UK you can also complain to your local data protection authority. Residents of California and other US states have the rights described here, and we will not treat you differently for using them. Australian residents may contact the Office of the Australian Information Commissioner. Residents of the UAE and Türkiye have the rights given by the UAE Personal Data Protection Law and Law No. 6698 (KVKK).",
      ],
    },
    {
      id: "children",
      title: "Children",
      body: ["Fit Planet is for people aged 16 and over. We do not knowingly collect data from younger children; if you believe a child has an account, contact us and we will remove it."],
    },
    {
      id: "security",
      title: "Security",
      body: [
        "We encrypt traffic, hash passwords, limit repeated sign-in attempts, and let you sign out every other device from your security settings. No system is perfect, so please use a strong, unique password.",
      ],
    },
    {
      id: "changes",
      title: "Changes",
      body: ["If we change this policy in a way that matters, we will tell you in the app or by email before the change applies."],
    },
  ];
}

export function termsSections(d: LegalDetails, feePercent: number): LegalSection[] {
  return [
    {
      id: "about",
      title: "About these terms",
      body: [
        `These terms are an agreement between you and ${d.name} ("Fit Planet", "we") for using the Fit Planet website and app. By creating an account or booking a pass you accept them.`,
        "If you are a consumer, nothing in these terms takes away rights that the law of your country gives you and that cannot be waived.",
      ],
    },
    {
      id: "service",
      title: "What Fit Planet does",
      body: [
        "Fit Planet lets you find gyms and buy day, week and month passes. The gym provides the training facilities and services; we provide the platform, take payment on the gym's behalf where you pay online, and issue your digital pass.",
        "Gyms set their own prices, opening hours, equipment and house rules, and are responsible for their premises and staff. We check listings but cannot guarantee every detail.",
      ],
    },
    {
      id: "account",
      title: "Your account",
      body: [
        [
          "You must be 16 or older and give accurate details.",
          "Keep your password private. You are responsible for activity on your account until you tell us it has been misused.",
          "You can delete your account at any time from your security settings.",
        ],
      ],
    },
    {
      id: "bookings",
      title: "Bookings and payment",
      body: [
        "The price shown at checkout is the total you pay, including taxes where they apply. You can pay online by card, or at the front desk where the gym allows it.",
        "A booking is confirmed when you receive your pass. Bring your pass (QR code or pass code) and, if the gym asks, photo ID.",
      ],
    },
    {
      id: "cancellations",
      title: "Cancellations and refunds",
      body: [
        [
          "You can cancel a confirmed pass for free in the app until the day before it starts, as long as it has not been used. Online payments are refunded to the original payment method.",
          "From the start date, or after the first check-in, a pass can no longer be cancelled, because the gym has reserved your access.",
          "If a gym cancels your booking or cannot let you in, you get a full refund.",
        ],
        "Because a pass is a leisure service for a specific date, the EU 14-day right of withdrawal does not apply to it (Directive 2011/83/EU, art. 16(l)). Our free cancellation before the start date applies instead.",
      ],
    },
    {
      id: "at-the-gym",
      title: "At the gym",
      body: [
        "Follow the gym's rules and staff instructions. Exercise involves risk: train within your limits and talk to a doctor first if you have a health condition. The gym may refuse entry to anyone who breaks its rules, without a refund.",
      ],
    },
    {
      id: "community",
      title: "Community guidelines",
      body: [
        "Posts, comments, photos and reviews must be your own and honest. Do not post anything illegal, hateful, harassing, sexually explicit, misleading, or that shares someone else's private information. Reviews must come from a real visit.",
        "You keep ownership of what you post and give us a worldwide, non-exclusive, royalty-free licence to host and show it on Fit Planet for as long as it is there. We may remove content and suspend accounts that break these rules. Use the report button if you see something wrong.",
      ],
    },
    {
      id: "gym-owners",
      title: "For gym owners",
      body: [
        [
          "Listings must be accurate and kept up to date, including prices, opening hours and photos you have the right to use.",
          `Fit Planet keeps a commission of ${feePercent}% of each booking, shown in the studio before you publish. Payouts and invoicing follow the separate partner agreement.`,
          "You must honour every confirmed pass, check members in with the pass code or QR, and handle member data only to provide your service and as the law requires.",
        ],
      ],
    },
    {
      id: "liability",
      title: "Liability",
      body: [
        "We are liable without limit for intent, gross negligence, and injury to life, body or health, and as required by product liability or other mandatory law. Otherwise, for slight negligence we are liable only for breach of essential obligations, limited to the damage typical and foreseeable for this kind of contract.",
        "Outside the EU and UK, and to the extent the law allows, the service is provided as is and our total liability is limited to the amount you paid for the booking concerned.",
      ],
    },
    {
      id: "ending",
      title: "Ending the agreement",
      body: [
        "You can stop using Fit Planet and delete your account at any time. We may suspend or close accounts that seriously or repeatedly break these terms, and will tell you why unless the law prevents it. Confirmed passes are refunded if we close your account without cause.",
      ],
    },
    {
      id: "law",
      title: "Governing law and disputes",
      body: [
        `These terms are governed by the law of ${d.jurisdiction ?? "the country where our company is registered"}. If you are a consumer, you also keep the protection of the mandatory laws of the country you live in and can bring claims in its courts.`,
        "We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board, but we are always happy to sort out a problem directly.",
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      body: [
        `We may update these terms when the service or the law changes. We will tell you at least 30 days before a change that affects you takes effect. Questions? Contact us ${contact(d)}.`,
      ],
    },
  ];
}

export function imprintSections(d: LegalDetails): LegalSection[] {
  const lines = (d.address ?? "").split("|").map((l) => l.trim()).filter(Boolean);
  const company = [d.name, ...lines];
  const reach = [d.email && `Email: ${d.email}`, d.phone && `Phone: ${d.phone}`].filter(Boolean) as string[];
  const register = [d.representative && `Represented by: ${d.representative}`, d.register && `Register: ${d.register}`, d.vatId && `VAT ID: ${d.vatId}`].filter(
    Boolean,
  ) as string[];
  return [
    { id: "provider", title: "Service provider", body: [company] },
    ...(reach.length ? [{ id: "contact", title: "Contact", body: [reach] }] : []),
    ...(register.length ? [{ id: "company", title: "Company details", body: [register] }] : []),
    {
      id: "disputes",
      title: "Consumer disputes",
      body: ["We are neither obliged nor willing to take part in dispute resolution proceedings before a consumer arbitration board."],
    },
  ];
}
