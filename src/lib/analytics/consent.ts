/**
 * Cookie consent. Nothing that tracks people loads until they choose:
 * "analytics" covers Google Analytics and Tag Manager, "ads" covers the
 * advertising pixels (Meta, OpenAI) and Google's ad signals. Read on the
 * server too, so conversion APIs only send for people who said yes.
 */

export interface Consent {
  analytics: boolean;
  ads: boolean;
}

export const CONSENT_COOKIE = "fp_consent";
/** Bumped when the categories change, so everyone is asked again */
const VERSION = "1";
/** Six months, then we ask again */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 182;

export function serializeConsent(consent: Consent) {
  return `${VERSION}.a${consent.analytics ? 1 : 0}.m${consent.ads ? 1 : 0}`;
}

export function parseConsent(value: string | undefined | null): Consent | null {
  const match = value?.match(/^(\d+)\.a([01])\.m([01])$/);
  if (!match || match[1] !== VERSION) return null;
  return { analytics: match[2] === "1", ads: match[3] === "1" };
}

/** Which tracking services are configured; the banner only shows when at least one is */
export interface TrackingConfig {
  gtmId?: string;
  ga4Id?: string;
  metaPixelId?: string;
  openaiPixelId?: string;
}

export function hasTracking(config: TrackingConfig) {
  return Boolean(config.gtmId || config.ga4Id || config.metaPixelId || config.openaiPixelId);
}

/** Window event the footer's "Cookie settings" link sends to reopen the banner */
export const OPEN_CONSENT_EVENT = "fp:open-consent";
