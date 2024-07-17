import AgriculturalDepartmentLogo from '@/components/svg/AgriculturalDepartmentLogo'
import TriangleLogo from '@/components/svg/TriangleLogo'
import { Typography } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface AuthGroupLayoutProps extends PropsWithChildren {}

const AuthGroupLayout: React.FC<AuthGroupLayoutProps> = ({ children }) => {
	return (
		<div className='flex h-full flex-col bg-white'>
			<div className='bg-gray-light flex items-center justify-center space-x-6 px-2 py-1 lg:py-2'>
				<div className='space-x-1'>
					<TriangleLogo width={36} height={36} />
					<AgriculturalDepartmentLogo width={36} height={36} />
				</div>
				<Typography className='hidden lg:block'>โครงการพัฒนาระบบเทคโนโลยีเพื่องานประกันภัยข้าวนาปี</Typography>
			</div>
			<main className='flex flex-grow flex-col'>{children}</main>
		</div>
	)
}

export default AuthGroupLayout
