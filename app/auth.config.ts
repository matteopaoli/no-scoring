import { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      let isLoggedIn = !!auth?.user;
      let isReservedPage = /^\/[a-z]{2}\/app/.test(nextUrl.pathname);
      if (isReservedPage) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async jwt({ token, user }: { token, user }) {
      if (user) {
        // Add user id to the token
        token.userId = user.id;
        token.role = user.role
        token.firstName = user.firstName
        token.image = user.image
      }
      return token;
    },
    async session({session, token }) {
      session.user.role = token.role;
      session.user.firstName = token.firstName
      session.user.image = token.image
      return Promise.resolve(session);
    }
  },
} satisfies NextAuthConfig;
