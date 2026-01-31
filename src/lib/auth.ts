import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDatabase } from "@/lib/utils/mongodb";
import { ObjectId } from "mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "phone-otp",
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        const phone = credentials.phone as string;
        const otp = credentials.otp as string;

        // Hardcoded OTP check
        if (otp !== "123456") {
          return null;
        }

        try {
          const db = await getDatabase();
          const user = await db.collection("users").findOne({ phone });

          if (!user) {
            return null;
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            name: user.fullName,
            email: user.email,
            phone: user.phone,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/app/login",
    error: "/app/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
