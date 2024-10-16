import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcrypt-ts';
import { getUser } from 'app/db';
import { authConfig } from 'app/auth.config';
import { db } from '../schema'
import { DrizzleAdapter } from '@auth/drizzle-adapter';

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
        let user = await getUser(credentials.email as string);
        if (!user) return null;
        let passwordsMatch = await compare(credentials.password as string, user.password!);
        if (passwordsMatch && user.role === credentials.role) {
          const { image,  ...rest } = user
          return rest
        }
      },
    }),
  ],
});
