'use client'

import { mdiCheckBold } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
interface SuccessResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const SuccessResetPassword: React.FC<SuccessResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	const { t } = useTranslation()
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='absolute h-full w-full bg-success-light' />
				<Icon path={mdiCheckBold} size={2} className='z-10 text-success' />
			</div>
			<Typography className='text-2xl font-bold'>{t('auth.headerResetPasswordSuccess')}</Typography>
			<Typography className='text-center'>{t('auth.subHeaderResetPasswordSuccess')}</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{t(buttonLabel)}
			</Button>
		</div>
	)
}

export default SuccessResetPassword
