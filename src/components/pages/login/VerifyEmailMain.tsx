'use client'

import EmailIcon from '@/components/svg/icons/EmailIcon'
import { AppPath } from '@/config/app'
import { Button, Typography } from '@mui/material'
import { WithTranslation, withTranslation } from 'react-i18next'
import AuthBreadcrumbs from './AuthBreadcrumbs'

interface VerifyEmailMainProps extends WithTranslation {
	email: string
}

const VerifyEmailMain: React.FC<VerifyEmailMainProps> = ({ email, t }) => {
	return (
		<>
			<AuthBreadcrumbs name={t('auth.checkEmail')} href={AppPath.Login} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center'>
					<div className='mx-2 flex w-full max-w-[340px] flex-col items-center sm:max-w-[500px]'>
						<EmailIcon width={100} height={100} className='hidden lg:block' />
						<EmailIcon width={134} height={134} className='block lg:hidden' />
						<Typography className='mb-2 mt-4 text-2xl font-bold'> {t('auth.headerCheckEmail')} </Typography>
						<Typography className='mt-2 text-center'>{t('auth.subHeaderCheckEmail')}</Typography>
						<Typography className='text-center font-semibold text-primary'>{email}</Typography>
						<Button
							fullWidth
							variant='contained'
							href={`${AppPath.ResetPassword}?email=${email}`}
							className='mt-10'
						>
							{t('auth.goToResetPassword')}
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

export default withTranslation('appbar')(VerifyEmailMain)
