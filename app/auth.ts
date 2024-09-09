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
      async authorize({ email, password }: any) {
        let user = await getUser(email);
        if (!user) return null;
        if (!user.password) {
          // TODO:  ACCOUNT EXISTS BUT HAS TO SIGN IN THROUGH PROVI
        }
        let passwordsMatch = await compare(password, user.password!);
        console.log("password!!",passwordsMatch)
        console.log(user)
        if (passwordsMatch) return user as any;
      },
    }),
  ],
});
