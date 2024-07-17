'use client'

import { apiAccessToken, updateAccessToken } from '@/api/core'
import LoadingScreen from '@/components/common/loading/LoadingScreen'
import { authPathPrefix } from '@/config/app'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useEffect } from 'react'

interface TokenProviderProps extends PropsWithChildren {}

const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
	const pathname = usePathname()
	const { data: session } = useSession()

	useEffect(() => {
		const accessToken = session?.user?.tokens?.accessToken
		if (accessToken) {
			updateAccessToken(accessToken)
		}
	}, [session])

	if (pathname && pathname.includes(authPathPrefix)) {
		return children
	}

	if (apiAccessToken) {
		return children
	}

	return <LoadingScreen />
}

export default TokenProvider
