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

		console.log('req ', req.nextauth)

		const token = req.nextauth.token
		const isLoggedIn = !!token
		const isAuthRoute = nextUrl.pathname.includes(authPathPrefix)

		console.log('env ', process.env)

		console.log('token ', token)

		// console.log('isAuthRoute ', isAuthRoute)

		// console.log('isLoggedIn ', isLoggedIn)
		// console.log('nextUrl ', nextUrl)

		if (isAuthRoute) {
			if (isLoggedIn) {
				return responseWithLanguageCookie(req, new URL(AppPath.FieldLoss, nextUrl))
			}
			return responseWithLanguageCookie(req)
		}

		// console.log('isLoggedIn ', isLoggedIn)

		if (!isLoggedIn) {
			const callback = nextUrl.href.includes('sessionExpired=1')
				? nextUrl.href.replace('sessionExpired=1', '')
				: nextUrl.href
			return responseWithLanguageCookie(
				req,
				new URL(`${AppPath.Login}/?callbackUrl=${encodeURI(callback)}`, nextUrl),
			)
		}

		if (nextUrl.pathname === `/${lang}`) {
			return responseWithLanguageCookie(req, new URL(AppPath.FieldLoss, nextUrl))
		}

		return responseWithLanguageCookie(req)
	},
	{
		callbacks: {
			authorized: ({ token }) => true,
		},
	},
)

const redirectWithLanguagePath = (req: NextRequestWithAuth) => {
	let lng

	// console.log('appLanguages', req.cookies, cookieName)
	// console.log('acceptLanguage', acceptLanguage)

	if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)

	if (!lng) lng = fallbackLng

	// console.log('lng', lng)

	// Redirect if lng in path is not supported
	if (
		!appLanguages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
		!req.nextUrl.pathname.startsWith('/_next')
	) {
		const urlSearchParams = new URLSearchParams(req.nextUrl.search)
		const paramList = Object.entries(Object.fromEntries(urlSearchParams.entries()))
		const query = []

		// console.log('urlSearchParams', urlSearchParams)
		// console.log('paramList', paramList)

		for (const [key, value] of paramList) {
			query.push(`${key}=${value}`)
		}

		// console.log('query', query)

		return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}?${query.join('&')}`, req.url))
	}

	return NextResponse.next()
}

const responseWithLanguageCookie = (req: NextRequestWithAuth, redirectUrl?: URL) => {
	// console.log('responseWithLanguageCookie')
	if (req.headers.has('referer')) {
		// console.log('responseWithLanguageCookie', req.headers)
		const refererUrl = new URL(req.headers.get('referer') as string)
		const lngInReferer = appLanguages.find((l) => refererUrl.pathname.startsWith(`/${l}`))

		// console.log('appLanguages', appLanguages)
		// console.log('lngInReferer', lngInReferer)
		if (lngInReferer) {
			let response
			if (redirectUrl) {
				response = NextResponse.redirect(redirectUrl)
			} else {
				response = NextResponse.next()
			}
			response.cookies.set(cookieName, lngInReferer)
			return response
		}
	}
	if (redirectUrl) {
		return NextResponse.redirect(redirectUrl)
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
