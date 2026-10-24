// Public Firebase web config. These values are safe to expose in the browser
// (they identify the project; access is controlled by Firebase rules and the
// server key). Fill them in from Firebase console > Project settings > Your apps.

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export const firebasePublicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || undefined,
} satisfies FirebaseWebConfig;

/** Web push certificate key pair (Cloud Messaging > Web configuration) */
export const firebaseVapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

/** The config when every required value is present, otherwise null */
export function firebaseWebConfig(): FirebaseWebConfig | null {
  const c = firebasePublicConfig;
  return c.apiKey && c.projectId && c.messagingSenderId && c.appId ? c : null;
}

export const isPushConfigured = () => Boolean(firebaseWebConfig() && firebaseVapidKey);
