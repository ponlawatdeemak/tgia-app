'use client'

import { Paper } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface ProfileLayoutProps extends PropsWithChildren {}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
	return (
		<Paper className='flex h-full flex-col gap-[16px] bg-white p-[24px] pt-[16px] max-lg:px-[16px] lg:gap-[24px]'>
			{children}
		</Paper>
	)
}

export default ProfileLayout
