'use client'

import { Paper } from '@mui/material'
import React, { PropsWithChildren } from 'react'

interface ProfileLayoutProps extends PropsWithChildren {}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
	return (
		<Paper className='flex h-[calc(100vh-56px)] flex-col gap-[16px] overflow-auto rounded-none bg-white p-[24px] pt-[16px] max-lg:px-[16px] lg:h-full lg:gap-[24px]'>
			{children}
		</Paper>
	)
}

export default ProfileLayout
