'use client'

import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'
import TokenProvider from './TokenProvider'

interface ProvidersProps extends PropsWithChildren {}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	const queryClient = new QueryClient()

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<TokenProvider>{children}</TokenProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}

export default Providers
