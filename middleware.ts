import NextAuth from "next-auth";
import { authConfig } from "app/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);


export default auth((req) => {
  // const locales = ["en", "it"];

  // const { pathname } = req.nextUrl;
  // let locale = "en";
  // const pathnameHasLocale = locales.some((l) => {
  //   const isMatch = pathname.startsWith(`/${l}/`) || pathname === `/${l}`;
  //   if (isMatch) {
  //     locale = l;
  //   }
  //   return isMatch;
  // });

  // if (pathnameHasLocale) {
  let isAppReservedPage = /^\/app/.test(req.nextUrl.pathname);
  let isAdminReservedPage = /^\/admin/.test(req.nextUrl.pathname);
  let isReservedPage = isAppReservedPage || isAdminReservedPage;

  if (isReservedPage && !req.auth) {
    if (isAppReservedPage) {
      req.nextUrl.pathname = `/login`;
    } else if (isAdminReservedPage) {
      req.nextUrl.pathname = `/admin/login`;
    }
    // return NextResponse.redirect(req.nextUrl);
  } else return NextResponse.next();

  // if (["/api", "/admin"].some((x) => pathname.startsWith(x))) {
  //   return NextResponse.next();
  // }

  // return NextResponse.redirect(req.nextUrl);
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
