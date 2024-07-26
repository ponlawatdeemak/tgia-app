import withAuth, { NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import { AppPath, authPathPrefix } from './config/app'
import acceptLanguage from 'accept-language'
import { appLanguages, cookieName, fallbackLng } from './i18n/settings'

acceptLanguage.languages(appLanguages)

export default withAuth(
	// The middleware function will only be invoked if the authorized callback returns true
	// Note: Currently allow every routes to enter this middleware
	function middleware(req) {
		const { nextUrl } = req
		const lang = appLanguages.find((l) => nextUrl.pathname.startsWith(`/${l}`))
		if (!lang) {
			return redirectWithLanguagePath(req)
		}

		const token = req.nextauth.token
		const isLoggedIn = !!token
		const isAuthRoute = nextUrl.pathname.includes(authPathPrefix)

		if (isAuthRoute) {
			if (isLoggedIn) {
				return NextResponse.redirect(new URL(AppPath.FieldLoss, nextUrl))
			}
			return NextResponse.next()
		}

		if (!isLoggedIn) {
			const callback = nextUrl.href.includes('sessionExpired=1')
				? nextUrl.href.replace('sessionExpired=1', '')
				: nextUrl.href
			return NextResponse.redirect(new URL(`${AppPath.Login}/?callbackUrl=${encodeURI(callback)}`, nextUrl))
		}

		if (nextUrl.pathname === `/${lang}`) {
			return NextResponse.redirect(new URL(AppPath.FieldLoss, nextUrl))
		}

		return NextResponse.next()
	},
	{
		callbacks: {
			authorized: ({ token }) => true,
		},
	},
)

const redirectWithLanguagePath = (req: NextRequestWithAuth) => {
	let lng
	if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
	if (!lng) lng = fallbackLng

	// Redirect if lng in path is not supported
	if (
		!appLanguages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
		!req.nextUrl.pathname.startsWith('/_next')
	) {
		const urlSearchParams = new URLSearchParams(req.nextUrl.search)
		const paramList = Object.entries(Object.fromEntries(urlSearchParams.entries()))
		const query = []
		for (const [key, value] of paramList) {
			query.push(`${key}=${value}`)
		}
		return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}?${query.join('&')}`, req.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
