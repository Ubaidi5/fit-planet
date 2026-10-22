/**
 * Push delivery contract. FCM is the default; OneSignal, Expo or APNs can be
 * added by implementing `send`. In-app notifications are stored separately by
 * the notifications module, so push is best-effort.
 */

export interface PushMessage {
  title: string;
  body: string;
  /** Path to open when the notification is tapped */
  link?: string;
  /** Collapses repeated notifications of the same kind on the device */
  tag?: string;
  data?: Record<string, string>;
}

export interface PushResult {
  /** Tokens the provider says are no longer valid and should be deleted */
  invalidTokens: string[];
  successCount: number;
}

export interface PushProvider {
  readonly name: string;
  send(tokens: string[], message: PushMessage): Promise<PushResult>;
}
