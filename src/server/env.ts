import "server-only";

/**
 * Server-side configuration read from environment variables.
 * Every key is documented in `.env.example`. Nothing here throws at import time,
 * so a build without secrets still succeeds; features switch off when their
 * keys are missing and the UI hides them.
 */

function read(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function oneOf<T extends string>(name: string, allowed: readonly T[], fallback: T): T {
  const value = read(name);
  return value && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProd: process.env.NODE_ENV === "production",

  appUrl: (read("APP_URL") ?? read("AUTH_URL") ?? "http://localhost:3000").replace(/\/$/, ""),

  db: {
    uri: read("DB_URI"),
    name: read("DB_NAME") ?? "fitplanet",
  },

  auth: {
    secret: read("AUTH_SECRET") ?? read("NEXTAUTH_SECRET"),
    google: { id: read("AUTH_GOOGLE_ID"), secret: read("AUTH_GOOGLE_SECRET") },
    facebook: { id: read("AUTH_FACEBOOK_ID"), secret: read("AUTH_FACEBOOK_SECRET") },
  },

  payments: {
    provider: oneOf("PAYMENT_PROVIDER", ["stripe", "mock"] as const, read("STRIPE_SECRET_KEY") ? "stripe" : "mock"),
    stripeSecretKey: read("STRIPE_SECRET_KEY"),
    stripeWebhookSecret: read("STRIPE_WEBHOOK_SECRET"),
    /**
     * The mock gateway confirms bookings without taking money, so production
     * only uses it when ALLOW_MOCK_PAYMENTS=true (e.g. a staging server)
     */
    allowMockPayments: read("ALLOW_MOCK_PAYMENTS") === "true",
    /** Lets members choose "pay at the front desk" at checkout */
    allowPayAtDesk: read("ALLOW_PAY_AT_DESK") !== "false",
  },

  storage: {
    provider: oneOf("STORAGE_PROVIDER", ["local", "s3"] as const, "local"),
    localDir: read("STORAGE_LOCAL_DIR") ?? "./storage/uploads",
    publicBaseUrl: (read("STORAGE_PUBLIC_URL") ?? "/media").replace(/\/$/, ""),
    maxUploadMb: Number(read("STORAGE_MAX_UPLOAD_MB") ?? "8"),
    s3: {
      endpoint: read("S3_ENDPOINT"),
      region: read("S3_REGION") ?? "auto",
      bucket: read("S3_BUCKET"),
      accessKeyId: read("S3_ACCESS_KEY_ID"),
      secretAccessKey: read("S3_SECRET_ACCESS_KEY"),
      forcePathStyle: read("S3_FORCE_PATH_STYLE") === "true",
    },
  },

  push: {
    provider: oneOf("PUSH_PROVIDER", ["fcm", "console"] as const, read("FIREBASE_SERVICE_ACCOUNT") ? "fcm" : "console"),
    /** Base64 or raw JSON of a Firebase service account key */
    serviceAccount: read("FIREBASE_SERVICE_ACCOUNT"),
  },

  email: {
    provider: oneOf("EMAIL_PROVIDER", ["smtp", "console"] as const, read("SMTP_HOST") ? "smtp" : "console"),
    from: read("EMAIL_FROM") ?? "Fit Planet <no-reply@fitplanet.app>",
    smtp: {
      host: read("SMTP_HOST"),
      port: Number(read("SMTP_PORT") ?? "587"),
      user: read("SMTP_USER"),
      password: read("SMTP_PASSWORD"),
    },
  },

  /** The business behind the service, shown on the imprint, privacy policy and terms */
  legal: {
    name: read("LEGAL_NAME") ?? "Fit Planet",
    address: read("LEGAL_ADDRESS"),
    email: read("LEGAL_EMAIL") ?? read("SUPPORT_EMAIL"),
    phone: read("LEGAL_PHONE"),
    representative: read("LEGAL_REPRESENTATIVE"),
    register: read("LEGAL_REGISTER"),
    vatId: read("LEGAL_VAT_ID"),
    /** Country whose law governs the terms, e.g. "Delaware, United States" */
    jurisdiction: read("LEGAL_JURISDICTION"),
  },

  /** Bearer token the server's cron sends to /api/cron/* */
  cronSecret: read("CRON_SECRET"),

  /** Platform commission kept from each booking, as a fraction (0.1 = 10%) */
  platformFee: Number(read("PLATFORM_FEE") ?? "0.1"),
} as const;

export const features = {
  google: Boolean(env.auth.google.id && env.auth.google.secret),
  facebook: Boolean(env.auth.facebook.id && env.auth.facebook.secret),
  /** Magic link sign-in needs a real email provider in production */
  magicLink: env.email.provider === "smtp" || !env.isProd,
  stripe: env.payments.provider === "stripe" && Boolean(env.payments.stripeSecretKey),
  /** Online checkout is offered only with a real gateway, or the mock one outside production */
  onlinePayments:
    env.payments.provider === "stripe"
      ? Boolean(env.payments.stripeSecretKey)
      : !env.isProd || env.payments.allowMockPayments,
  push: env.push.provider === "fcm",
};
