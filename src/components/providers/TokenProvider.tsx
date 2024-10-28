'use client'

import { updateAccessToken } from '@/api/core'
import TokenExpiredDialog from '@/components/TokenExpiredDialog'
import LoadingScreen from '@/components/common/loading/LoadingScreen'
import { authPathPrefix } from '@/config/app'
import { useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { PropsWithChildren, useEffect, useMemo, useState } from 'react'

interface TokenProviderProps extends PropsWithChildren {}

const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { data: session } = useSession()
	const [accessToken, setAccessToken] = useState<string | null>(null)

	const sessionExpired = useMemo(() => Number(searchParams?.get('sessionExpired') ?? 0), [searchParams])

	useEffect(() => {
		const userId = session?.user?.id
		const accessToken = session?.user?.tokens?.accessToken
		const refreshToken = session?.user?.tokens?.refreshToken
		if (accessToken) {
			updateAccessToken({ accessToken, refreshToken, userId })
			setAccessToken(accessToken)
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

	if (accessToken) {
		return children
	}

	return <LoadingScreen />
}

export default TokenProvider
