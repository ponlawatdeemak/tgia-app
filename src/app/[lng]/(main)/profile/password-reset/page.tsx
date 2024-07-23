import FailedResetPassword from '@/components/common/reset-status/FailedResetPassword'
import SuccessResetPassword from '@/components/common/reset-status/SuccessResetPassword'
import PasswordResetMain from '@/components/pages/profile/password-reset'
import { AppPath } from '@/config/app'
import React from 'react'

interface PasswordResetPageProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ searchParams }) => {
	if (searchParams?.resetStatus === 'success') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<SuccessResetPassword buttonLabel='auth.returnLogin' buttonHref={AppPath.Profile} />
			</div>
		)
	}

	if (searchParams?.resetStatus === 'failed') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<FailedResetPassword buttonLabel='auth.returnLogin' buttonHref={AppPath.Profile} />
			</div>
		)
	}

	return <PasswordResetMain />
}

export default PasswordResetPage
