'use client'

import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, Suspense } from 'react'
import TokenProvider from './TokenProvider'
import { I18nextProvider } from 'react-i18next'
import i18next from '@/i18n/client'

interface ProvidersProps extends PropsWithChildren {}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	const queryClient = new QueryClient()

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					<I18nextProvider i18n={i18next}>
						<Suspense>
							<TokenProvider>{children}</TokenProvider>
						</Suspense>
					</I18nextProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}

export default Providers
