'use client'

import { apiAccessToken, updateAccessToken } from '@/api/core'
import TokenExpiredDialog from '@/components/TokenExpiredDialog'
import LoadingScreen from '@/components/common/loading/LoadingScreen'
import { authPathPrefix } from '@/config/app'
import { signIn, useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, useEffect, useMemo } from 'react'

interface TokenProviderProps extends PropsWithChildren {}

const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { data: session } = useSession()

	const sessionExpired = useMemo(() => Number(searchParams?.get('sessionExpired') ?? 0), [searchParams])

	useEffect(() => {
		if (session?.error === 'RefreshAccessTokenError') {
			signIn()
		}
		const userId = session?.user?.id
		const accessToken = session?.user?.tokens?.accessToken
		const refreshToken = session?.user?.tokens?.refreshToken
		// console.log('------- token provider -------')
		// console.log('TLOG ~ accessToken:', accessToken)
		// console.log('TLOG ~ refreshToken:', refreshToken)
		if (accessToken) {
			updateAccessToken({ accessToken, refreshToken, userId })
		} else {
			updateAccessToken({})
		}
	}, [session])

	if (pathname && pathname.includes(authPathPrefix)) {
		return children
	}

	if (sessionExpired) {
		return (
			<>
				<LoadingScreen />
				<TokenExpiredDialog />
			</>
		)
	}

	// if (apiAccessToken) {
		return children
	// }

	// return <LoadingScreen />
}

export default TokenProvider
