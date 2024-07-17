import withAuth from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { AppPath, authPathPrefix } from './config/app'

export default withAuth(
	// The middleware function will only be invoked if the authorized callback returns true
	// Note: Currently allow every routes to enter this middleware
	function middleware(req) {
		const { nextUrl } = req
		const token = req.nextauth.token
		const isLoggedIn = !!token
		const isAuthRoute = nextUrl.pathname.startsWith(authPathPrefix)

		if (isAuthRoute) {
			if (isLoggedIn) {
				return NextResponse.redirect(new URL(AppPath.FieldLoss, nextUrl))
			}
			return
		}

		if (!isLoggedIn) {
			const callback = nextUrl.href.includes('sessionExpired=1')
				? nextUrl.href.replace('sessionExpired=1', '')
				: nextUrl.href
			return NextResponse.redirect(new URL(`${AppPath.Login}/?callbackUrl=${encodeURI(callback)}`, nextUrl))
		}

		if (nextUrl.pathname === '/') {
			return NextResponse.redirect(new URL(AppPath.FieldLoss, nextUrl))
		}

		return
	},
	{
		callbacks: {
			authorized: ({ token }) => true,
		},
	},
)

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
