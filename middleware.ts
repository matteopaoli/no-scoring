import NextAuth from 'next-auth';
import { authConfig } from 'app/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const locales = ['en', 'it']

  const { pathname } = req.nextUrl
  let locale = 'en'
  const pathnameHasLocale = locales.some(
    (l) => {
      const isMatch = pathname.startsWith(`/${l}/`) || pathname === `/${l}` 
      if (isMatch) {
        locale = l
      }
      return isMatch
    }
  )
  
  if (pathnameHasLocale) {
    console.log(pathname)
      let isReservedPage = /^\/[a-z]{2}\/app/.test(req.nextUrl.pathname)
      console.log('isReservedPage??', isReservedPage)
      console.log('auth', req.auth)
      if (isReservedPage && !req.auth) {
      req.nextUrl.pathname = `/${locale}/login`
        return NextResponse.redirect(req.nextUrl)
      }
      else return NextResponse.next()
  }
 
  // Redirect if there is no locale
  req.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(req.nextUrl)
})

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
