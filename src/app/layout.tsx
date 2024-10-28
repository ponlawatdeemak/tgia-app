import Providers from '@/providers'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import type { Metadata } from 'next'
import { Anuphan } from 'next/font/google'
import './../styles/globals.css'

const anuphan = Anuphan({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={anuphan.className}>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<Providers>
						<div className='flex h-full flex-1 flex-col bg-background'>{children}</div>
					</Providers>
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}