import NextAuth from "next-auth";
import { authConfig } from "app/auth.config";
import { NextResponse } from "next/server";
import { NextAuthRequest } from "next-auth/lib";

const { auth } = NextAuth(authConfig);

export const authorizationMiddleware = (req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;

  // Reserved page patterns
  const reservedPagePatterns = {
    app: /^\/app/,
    admin: /^\/admin(?!\/login).*/,
    partner: /^\/partner(?!\/login).*/,
  };

  const loginPaths = {
    app: "/login",
    admin: "/admin/login",
    partner: "/partner/login",
  };

  const reservedPageType = Object.entries(reservedPagePatterns).find(([type, pattern]) =>
    pattern.test(pathname)
  )?.[0] as keyof typeof loginPaths;

  if (!reservedPageType) {
    return NextResponse.next();
  }

  const redirectToLogin = (loginPath: string) => {
    req.nextUrl.pathname = loginPath;
    return NextResponse.redirect(req.nextUrl);
  };

  if (!req.auth) {
    return redirectToLogin(loginPaths[reservedPageType]);
  }

  const userRole = req.auth.user?.role;
  const roleRequirements = {
    app: ["user"],
    admin: ["admin"],
    partner: ["partner", "subpartner"],
  };

  if (!roleRequirements[reservedPageType].includes(userRole)) {
    return redirectToLogin(loginPaths[reservedPageType]);
  }

  return NextResponse.next();
}

export default auth(authorizationMiddleware);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
