'use client'

import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren, Suspense } from 'react'
import { I18nextProvider } from 'react-i18next'
import TokenProvider from './TokenProvider'
import { createInstance } from 'i18next'
import { initI18next } from '@/i18n'
import { Language } from '@/enum'
import { fallbackLng } from '@/i18n/settings'
import { enUS, th } from 'date-fns/locale'
import { setDefaultOptions } from 'date-fns'

interface ProvidersProps extends PropsWithChildren {
	lng: string
}

const Providers: React.FC<ProvidersProps> = ({ children, lng }) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				retry: false, // not retry when error
				refetchInterval: 60000 * 30, // refetch every 30 minutes
			},
		},
	})

	const i18n = createInstance()
	const language: Language = lng === Language.EN ? Language.EN : fallbackLng
	setDefaultOptions({ locale: language === Language.TH ? th : enUS })
	initI18next(language, 'appbar', i18n)

	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider theme={theme}>
					{/* <I18nextProvider i18n={i18n}> */}
					<Suspense>
						<TokenProvider>{children}</TokenProvider>
					</Suspense>
					{/* </I18nextProvider> */}
				</ThemeProvider>
			</QueryClientProvider>
		</SessionProvider>
	)
}

export default Providers
