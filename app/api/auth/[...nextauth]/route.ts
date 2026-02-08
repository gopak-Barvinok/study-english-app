//@ts-nocheck
"server-only";

import NextAuth from "next-auth"
import Google from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { insertIntoUsers, returnExistingUser, updateLanguages } from "@/lib/database";
import { dateNow } from "@/utils/server";
import { resolveUserIfNotExist } from "@/scripts/tests.server";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
    async jwt({ token, user, trigger, session, account }) {
      if (trigger === "update") {
        // 1. Обновляем БД
        if (session?.user?.userId && session?.user?.languages) {
          updateLanguages(session.user.languages, session.user.userId);
        }
        // 2. Обновляем токен (не token.user!)
        token.languages = session?.user?.languages || token.languages;
        token.roomIds = session?.user?.roomIds || token.roomIds;
      }

      if (account && user) {
        // Создаем или обновляем пользователя в БД
        const existingUser = returnExistingUser(user.id);
        console.log("Existing user:", existingUser);
        // Если пользователя не существует в бд
        if (!existingUser) {
          insertIntoUsers(
            user.id,
            user.name?.split(" ")[0] || '',
            user.name?.split(" ")[1] || '',
            user.email || '',
            user.email?.split("@")[0] || '',
            '[]',
            dateNow(),
            user.image || '',
            '[]',
          );
        }

        // Наполняем токен
        return {
          ...token,
          userId: user.id,
          name: user.name?.split(" ")[0] || '',
          surname: user.name?.split(" ")[1] || '',
          username: user.email?.split("@")[0] || '',
          languages: existingUser ? JSON.parse(existingUser.languages) : [],
          roomIds: existingUser ? JSON.parse(existingUser.roomIds) : [],
          registrationDate: Date.now().toString(),
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + (account.expires_at || 0) * 1000,
        };
      }

      return token;
    },

    async session({ session, token }) {
      // session.user может быть undefined, проверяем
      if (!session.user) {
        session.user = {
          id: '',
          name: '',
          email: '',
          image: '',
        };
      }

      // Добавляем наши поля из токена
      session.user.userId = token.userId as string;
      session.user.name = token.name as string;
      session.user.surname = token.surname as string;
      session.user.username = token.username as string;
      session.user.languages = token.languages as string[];
      session.user.registrationDate = token.registrationDate as string;
      session.user.roomIds = token.roomIds as string[];

      session.accessToken = token.accessToken as string;
      session.error = token.error as string;

      return session;
    },

    // signIn можно упростить, т.к. теперь создаем пользователя в jwt
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        return profile?.email_verified === true;
      }
      
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  }
} as NextAuthOptions);

export { handler as GET, handler as POST }