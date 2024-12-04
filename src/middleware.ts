import withAuth, { NextRequestWithAuth } from 'next-auth/middleware'
import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { AppPath, authPathPrefix, reportPathSuffix, userManagementPathSuffix } from './config/app'
import acceptLanguage from 'accept-language'
import { appLanguages, cookieName, fallbackLng } from './i18n/settings'
import { cookies } from 'next/headers'
import { UserRole } from './enum/um.enum'

acceptLanguage.languages(appLanguages)

export default withAuth(
	// The middleware function will only be invoked if the authorized callback returns true
	// Note: Currently allow every routes to enter this middleware
	function middleware(req) {
		const { nextUrl } = req

		const token = req.nextauth.token
		const userRole = token?.role
		const isLoggedIn = !!token
		const isAuthRoute = nextUrl.pathname.includes(authPathPrefix)
		const isUserManagementRoute = nextUrl.pathname.includes(userManagementPathSuffix)
		const isReportRoute = nextUrl.pathname.includes(reportPathSuffix)

		if (isAuthRoute) {
			if (isLoggedIn) {
				return responseWithLanguageCookie(req, new URL(AppPath.FieldLoss, nextUrl))
			}
			return responseWithLanguageCookie(req)
		}

		if (!isLoggedIn) {
			const href = nextUrl.href.replace(nextUrl.host, req.headers.get('host')!)
			const callback = href.includes('sessionExpired=1') ? href.replace('sessionExpired=1', '') : href
			return responseWithLanguageCookie(
				req,
				new URL(`${AppPath.Login}/?callbackUrl=${encodeURI(callback)}`, nextUrl),
			)
		}

		if (isUserManagementRoute) {
			if (userRole === UserRole.Officer || userRole === UserRole.Analyst) {
				return responseWithLanguageCookie(req, new URL(AppPath.FieldLoss, nextUrl))
			}
		}

		if (isReportRoute) {
			if (userRole === UserRole.Officer) {
				return responseWithLanguageCookie(req, new URL(AppPath.FieldLoss, nextUrl))
			}
		}

		return responseWithLanguageCookie(req)
	},
	{
		callbacks: {
			authorized: ({ token }) => true,
		},
	},
)

const responseWithLanguageCookie = (req: NextRequestWithAuth, redirectUrl?: URL) => {
	// if (req.headers.has('referer')) {
	// 	// const refererUrl = new URL(req.headers.get('referer') as string)
	// 	//const lngInReferer =  cookie.get('i18next');
	// 	// const cookie = cookies()
	// 	// const lngInReferer = appLanguages.find((l) => l == cookie.get('i18next')?.value)

	// 	// if (lngInReferer) {
	// 	// 	let response
	// 	// 	if (redirectUrl) {
	// 	// 		response = NextResponse.redirect(redirectUrl)
	// 	// 	} else {
	// 	// 		response = NextResponse.next()
	// 	// 	}
	// 	// 	response.cookies.set(cookieName, lngInReferer)
	// 	// 	return response
	// 	// }
	// }
	if (redirectUrl) {
		return NextResponse.redirect(redirectUrl, {
			status: 301,
		})
	}
	return NextResponse.next()
}
export const config = {
	matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

export function middleware(request: NextRequest) {
	const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
	const baseApiUrl = process.env.API_URL?.split('/api')
	const cspHeader = `
        default-src 'self' ${baseApiUrl};
        script-src 'self' 'nonce-${nonce}' 'unsafe-eval' 'strict-dynamic';
        style-src 'self' https://fonts.googleapis.com 'unsafe-inline';
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' ${baseApiUrl} https://api.mapbox.com blob: data:;
        connect-src 'self' ${baseApiUrl} https://*.googleapis.com https://*.mapbox.com https://*.bedr.dev data:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
        block-all-mixed-content;
        upgrade-insecure-requests;
    `

	const requestHeaders = new Headers(request.headers)
	requestHeaders.set('x-nonce', nonce)
	requestHeaders.set(
		'Content-Security-Policy',
		// Replace newline characters and spaces
		cspHeader.replace(/\s{2,}/g, ' ').trim(),
	)

	return NextResponse.next({
		request: {
			headers: requestHeaders,
		},
	})
}
