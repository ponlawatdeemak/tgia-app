'use client'

import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import TokenProvider from './TokenProvider'
import { Session } from 'next-auth'

interface ProvidersProps extends PropsWithChildren {
	session: Session | null
}

const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
	const queryClient = new QueryClient()

	return (
		<SessionProvider session={session}>
			<TokenProvider>
				<QueryClientProvider client={queryClient}>
					<ThemeProvider theme={theme}>{children}</ThemeProvider>
				</QueryClientProvider>
			</TokenProvider>
		</SessionProvider>
	)
}

export default Providers
