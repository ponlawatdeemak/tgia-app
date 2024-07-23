'use client'

import { mdiCloseThick } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'
interface FailedResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const FailedResetPassword: React.FC<FailedResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='absolute h-full w-full bg-error opacity-20' />
				<Icon path={mdiCloseThick} size={2} className='text-error' />
			</div>
			<Typography className='text-2xl font-bold'>{t('auth.headerResetPasswordUnsuccess')}</Typography>
			<Typography>{t('auth.subHeaderResetPasswordUnsuccess')}</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{buttonLabel}
			</Button>
		</div>
	)
}

export default FailedResetPassword
