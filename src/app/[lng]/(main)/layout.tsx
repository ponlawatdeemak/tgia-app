import AppBar from '@/components/AppBar'
import React, { PropsWithChildren } from 'react'

interface MainLayoutProps extends PropsWithChildren {}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
	return (
		<div className='flex h-full flex-col overflow-auto p-[16px]'>
			<AppBar />
			<main className='flex flex-grow flex-col'>{children}</main>
		</div>
	)
}

export default MainLayout
