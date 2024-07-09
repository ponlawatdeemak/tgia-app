'use client'

import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

interface ProvidersProps extends PropsWithChildren {}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	const queryClient = new QueryClient()
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>{children}</ThemeProvider>
		</QueryClientProvider>
	)
}

export default Providers
