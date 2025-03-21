import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { authConfig } from 'app/auth.config';
import { db } from "@paytomorrow/db"
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { UserService } from './services/userService';
import { sendVerificationRequestCreate, sendVerificationRequestLogin  } from './utils/sendVerificationRequest';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
    async authorize(credentials, req) {
        let user = await UserService.getUserByEmail(credentials.email as string);
        if (!user) return null;
        if (user.status === 'pending') return null;
        let passwordsMatch = await compare(credentials.password as string, user.password!);
        if (passwordsMatch && (credentials.roles as string[]).includes(user.role)) {
          const { image,  ...rest } = user
          return rest
        }
      },
    }),
    {
      id: "posMagicLinkCreation",
      name: "email",
      type: "email",
      maxAge: 60 * 60 * 24,
      sendVerificationRequest: sendVerificationRequestCreate,
    },
    {
      id: "posMagicLinkLogin",
      name: "email",
      type: "email",
      maxAge: 60 * 60 * 24,
      sendVerificationRequest: sendVerificationRequestLogin,
    },
  ],
});
