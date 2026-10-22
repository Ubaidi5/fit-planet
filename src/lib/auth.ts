import "server-only";
import NextAuth, { type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Nodemailer from "next-auth/providers/nodemailer";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { env, features } from "@/server/env";
import { getMongoClient } from "@/server/db/client";
import { collections } from "@/server/db/collections";
import { email } from "@/server/services/email";
import { magicLinkEmail } from "@/server/services/email/templates";

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
      const users = await collections.users();
      const user = await users.findOne({ email: parsed.data.email });
      if (!user?.passwordHash) return null;
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
      allowDangerousEmailAccountLinking: true,
    }),
  );
}

if (features.magicLink) {
  providers.push(
    Nodemailer({
      id: "email",
      name: "Email link",
      server: { host: env.email.smtp.host ?? "localhost", port: env.email.smtp.port },
      from: env.email.from,
      maxAge: 24 * 60 * 60,
      async sendVerificationRequest({ identifier, url }) {
        await email().send(magicLinkEmail(identifier, url));
      },
    }),
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
    async jwt({ token, user, trigger, session }) {
      if (user?.id) token.sub = user.id;
      if (trigger === "update" && session?.name) token.name = session.name;
      if (trigger === "update" && session?.image !== undefined) token.picture = session.image;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  events: {
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
