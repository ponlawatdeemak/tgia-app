import '@/styles/globals.css'
import { cookies } from 'next/headers'
import { fallbackLng } from '@/i18n/settings'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter'
import type { Metadata } from 'next'
import { Anuphan } from 'next/font/google'
import Providers from '@/components/providers'

const anuphan = Anuphan({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Loss Analytics System',
	description: 'Technology System Development Project For Annual Rice Insurance',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookieStore = cookies()
	const lng = cookieStore.get('i18next')?.value || fallbackLng

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
