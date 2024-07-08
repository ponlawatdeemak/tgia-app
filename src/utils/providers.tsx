'use client'

import { PropsWithChildren } from 'react'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'

interface ProvidersProps extends PropsWithChildren {}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default Providers
