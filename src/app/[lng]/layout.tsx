import { appLanguages } from '@/i18n/settings'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import type { Metadata } from 'next'
import { Anuphan } from 'next/font/google'
import './../../styles/globals.css'
import Providers from '@/components/providers'

const anuphan = Anuphan({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Loss Analytics System',
	description: 'Technology System Development Project For Annual Rice Insurance',
}

export async function generateStaticParams() {
	return appLanguages.map((lng: string) => ({ lng }))
}

export default function RootLayout({
	children,
	params: { lng },
}: Readonly<{
	children: React.ReactNode
	params: {
		lng: string
	}
}>) {
	return (
		<html lang={lng}>
			<body className={anuphan.className}>
				<AppRouterCacheProvider options={{ enableCssLayer: true }}>
					<Providers lng={lng}>
						<div className='flex h-full flex-1 flex-col bg-background'>{children}</div>
					</Providers>
				</AppRouterCacheProvider>
			</body>
		</html>
	)
}
