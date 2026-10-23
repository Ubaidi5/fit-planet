import "server-only";
import NextAuth, { CredentialsSignin, type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env, features } from "@/server/env";
import { getMongoClient } from "@/server/db/client";
import { collections } from "@/server/db/collections";
import { email } from "@/server/services/email";
import { magicLinkEmail } from "@/server/services/email/templates";
import { getRegion } from "@/lib/i18n/server";
import { translatorFor } from "@/server/i18n";
import { allowAll, clientIp } from "@/server/rate-limit";

class RateLimited extends CredentialsSignin {
  code = "rate_limited";
}

const credentialsSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

/**
 * Sign-in methods. OAuth providers only switch on when their keys are set,
 * so a missing key never shows a broken button.
 */
const providers: Provider[] = [
  Credentials({
    id: "password",
    name: "Email and password",
    credentials: { email: { type: "email" }, password: { type: "password" } },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;
      // Checked here, not only in the form action, because the endpoint can be called directly
      const allowed = await allowAll(["login-ip", await clientIp(), 30, 600], ["login-email", parsed.data.email.trim().toLowerCase(), 10, 600]);
      if (!allowed) throw new RateLimited();
      const users = await collections.users();
      const user = await users.findOne({ email: parsed.data.email });
      if (!user?.passwordHash || user.suspendedAt) return null;
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) return null;
      return { id: user._id.toHexString(), name: user.name, email: user.email, image: user.image };
    },
  }),
];

if (features.google) {
  providers.push(
    Google({
      clientId: env.auth.google.id,
      clientSecret: env.auth.google.secret,
      // Same email from Google and from a password account is the same person
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

if (features.facebook) {
  providers.push(
    Facebook({
      clientId: env.auth.facebook.id,
      clientSecret: env.auth.facebook.secret,
      // Facebook doesn't promise the email is verified, so never merge into an existing account by email
      allowDangerousEmailAccountLinking: false,
    }),
  );
}

if (features.magicLink) {
  providers.push(
    // A plain email provider: our own email service sends the link, so Auth.js needs no SMTP client
    {
      id: "email",
      type: "email",
      name: "Email link",
      from: env.email.from,
      maxAge: 24 * 60 * 60,
      options: {},
      async sendVerificationRequest({ identifier, url }) {
        // Quietly drop floods of links to one inbox; the sign-in page looks the same
        if (!(await allowAll(["magic-email", identifier.toLowerCase(), 3, 900], ["magic-send-ip", await clientIp(), 20, 3600]))) return;
        const { t } = await translatorFor((await getRegion()).code, "email");
        await email().send(magicLinkEmail(identifier, url, t));
      },
    },
  );
}

const config: NextAuthConfig = {
  adapter: MongoDBAdapter(getMongoClient, { databaseName: env.db.name }),
  providers,
  secret: env.auth.secret,
  trustHost: true,
  // Credentials sign-in requires JWT sessions
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Linking by email is only safe when Google has verified that email
      if (account?.provider === "google" && profile?.email_verified !== true) return false;
      // Suspended accounts can't come back in through a link or Google/Facebook either
      if (user.email) {
        const existing = await (await collections.users()).findOne({ email: user.email.toLowerCase() }, { projection: { suspendedAt: 1 } });
        if (existing?.suspendedAt) return false;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.sub = user.id;
        // When this sign-in happened; compared with the account's sessionsValidFrom
        token.authAt = Date.now();
      }
      // Re-stamp the current device after "sign out other devices", but only if it is still valid itself
      if (trigger === "update" && typeof session?.authAt === "number" && token.sub) {
        const { ObjectId } = await import("mongodb");
        const account = await (await collections.users()).findOne({ _id: new ObjectId(token.sub) }, { projection: { sessionsValidFrom: 1 } });
        const stillValid = !account?.sessionsValidFrom || Number(token.authAt ?? 0) >= account.sessionsValidFrom.getTime();
        if (stillValid) token.authAt = Math.min(session.authAt, Date.now());
      }
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image !== undefined) token.picture = session.user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      (session as { authAt?: number }).authAt = Number(token.authAt ?? 0);
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Someone who proves the inbox (link or Google) takes over an account whose password was set
      // by an unverified sign-up, so a squatter who registered their email first loses access
      if (!user.id || !account || account.provider === "password") return;
      const { ObjectId } = await import("mongodb");
      await (await collections.users()).updateOne(
        { _id: new ObjectId(user.id), passwordUnverified: true },
        { $unset: { passwordHash: "", passwordUnverified: "" }, $set: { sessionsValidFrom: new Date(Date.now() - 1000), emailVerified: new Date() } },
      );
    },
    async createUser({ user }) {
      if (!user.id) return;
      const users = await collections.users();
      const { ObjectId } = await import("mongodb");
      await users.updateOne(
        { _id: new ObjectId(user.id), roles: { $exists: false } },
        { $set: { roles: ["member"], createdAt: new Date(), updatedAt: new Date() } },
      );
    },
  },
};

export const { handlers, signIn, signOut, auth, unstable_update: updateSession } = NextAuth(config);

/** Public list of sign-in methods for the login UI */
export function enabledSignInMethods() {
  return {
    google: features.google,
    facebook: features.facebook,
    magicLink: features.magicLink,
  };
}
