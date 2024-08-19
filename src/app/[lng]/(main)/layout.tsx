import AppBar from '@/components/AppBar'
import React, { PropsWithChildren } from 'react'

interface MainLayoutProps extends PropsWithChildren {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className='flex h-full flex-col overflow-auto'>
			<AppBar className='px-4 pt-4' />
			<main className='flex flex-grow flex-col overflow-auto'>{children}</main>
		</div>
	)
}

export default MainLayout
