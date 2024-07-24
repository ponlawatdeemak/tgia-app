'use client'

import { Paper, Typography } from '@mui/material'
import React, { PropsWithChildren } from 'react'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'

interface ProfileLayoutProps extends PropsWithChildren {}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ children }) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

	return (
		<Paper className='flex h-full flex-col gap-[16px] bg-white p-[24px] pt-[16px] max-lg:px-[16px] lg:gap-[24px]'>
			<Typography className='text-xl font-semibold text-black lg:text-md'>{t('profile.profile')}</Typography>
			{children}
		</Paper>
	)
}

export default ProfileLayout
