'use client'

// import { useTranslation } from '@/i18n'
import { mdiCloseThick } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
interface FailedResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const FailedResetPassword: React.FC<FailedResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	const { t } = useTranslation()
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='absolute h-full w-full bg-error opacity-20' />
				<Icon path={mdiCloseThick} size={2} className='text-error' />
			</div>
			<Typography className='text-2xl font-bold'>{t('auth.headerResetPasswordUnsuccess')}</Typography>
			<Typography>{t('auth.subHeaderResetPasswordUnsuccess')}</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{t(buttonLabel)}
			</Button>
		</div>
	)
}

export default FailedResetPassword
