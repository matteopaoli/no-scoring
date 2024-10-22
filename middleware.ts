import NextAuth from "next-auth";
import { authConfig } from "app/auth.config";
import { NextResponse } from "next/server";
import { getUser } from "./app/db";

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
  const isAppReservedPage = /^\/app/.test(req.nextUrl.pathname);
  const isAdminReservedPage = /^\/admin(?!\/login).*/.test(
    req.nextUrl.pathname
  );
  const isPartnerReservedPage = /^\/partner(?!\/login).*/.test(
    req.nextUrl.pathname
  );

  // Determine if it's a reserved page
  const isReservedPage = isAppReservedPage || isAdminReservedPage || isPartnerReservedPage;

  if (!isReservedPage) {
    return NextResponse.next()
  }

  // If the page is reserved and the user is not authenticated, redirect to login
  if (isReservedPage && !req.auth) {
    req.nextUrl.pathname = isAppReservedPage ? "/login" : isAdminReservedPage ? "/admin/login" : '/partner/login';
    return NextResponse.redirect(req.nextUrl);
  }

  // If the page is reserved and the user is authenticated, check user role
  if (isReservedPage && req.auth) {
    // Redirect based on user role
    if (isAppReservedPage && req.auth?.user?.role !== "user") {
      req.nextUrl.pathname = "/login"; // User with wrong role trying to access app page
      return NextResponse.redirect(req.nextUrl);
    }

    if (isAdminReservedPage && req.auth?.user?.role !== "admin") {
      req.nextUrl.pathname = "/admin/login"; // Admin with wrong role trying to access admin page
      return NextResponse.redirect(req.nextUrl);
    }

    if (isPartnerReservedPage && !(['partner', 'subpartner'].includes(req.auth?.user?.role))) {
      req.nextUrl.pathname = "/partner/login"; // Admin with wrong role trying to access admin page
      return NextResponse.redirect(req.nextUrl);
    }
  }
  // Allow the request to continue if it's not a reserved page or valid access
  return NextResponse.next();

  // if (["/api", "/admin"].some((x) => pathname.startsWith(x))) {
  //   return NextResponse.next();
  // }

  // return NextResponse.redirect(req.nextUrl);
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
