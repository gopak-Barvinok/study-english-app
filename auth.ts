import Google from 'next-auth/providers/google';
import NextAuth, { NextAuthConfig } from 'next-auth';
import { createNewUser, getUserByEmail, updateUserInDatabase } from './lib/database';
import type { User as DatabaseUser } from './generated/prisma';
import "dotenv/config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      if (account && profile) {
        const email = profile.email as string | undefined;

        if (!email) {
          throw new Error("Email is not provided by provider");
        }

        let dbUser = await getUserByEmail(email);
        if (!dbUser) {
          console.log("Creating a new user:", email);

          dbUser = await createNewUser(
            {
              id: profile.id!,
              email,
              name: profile.name?.split(" ")[0] || null,
              surname: profile.name?.split(" ")[1] || null,
              username: `${email.split('@')[0]}_${Math.random().toString(36).slice(2, 6)}`,
              image: profile.avatar_url || profile.picture || null,
              isAdmin: false,
              registrationDate: new Date(),
              emailVerified: profile.email_verified ? new Date() : null,
              age: null,
              location: null,
              timezone: null,
            } as DatabaseUser,
          );

          console.log("The user has been created");
        } else {
          console.log("The user was found");

          await updateUserInDatabase(dbUser.id, {
            name: dbUser.name || profile.name,
            image: dbUser.image || profile.avatar_url || profile.picture,
            emailVerified: profile.email_verified ? new Date() : dbUser.emailVerified,
          });
        }

        token.id = dbUser.id;
        token.email = dbUser.email;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string ?? null,
        emailVerified: null,
      }

      return session
    },
    async signIn({ profile }) {
      if (!profile?.email) {
        return false
      }
      return true
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  }
} as NextAuthConfig);