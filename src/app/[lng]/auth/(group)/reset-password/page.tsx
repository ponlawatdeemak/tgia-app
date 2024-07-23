'use client'

import FailedResetPassword from '@/components/common/reset-status/FailedResetPassword'
import SuccessResetPassword from '@/components/common/reset-status/SuccessResetPassword'
import ResetPasswordMain from '@/components/pages/login/ResetPasswordMain'
import { AppPath } from '@/config/app'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'
interface ResetPasswordPageProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ searchParams }) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
	if (searchParams?.resetStatus === 'success') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<SuccessResetPassword buttonLabel={t('auth.returnLogin')} buttonHref={`/${language}${AppPath.Login}`} />
			</div>
		)
	}

	if (searchParams?.resetStatus === 'failed') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<FailedResetPassword buttonLabel={t('auth.returnLogin')} buttonHref={`/${language}${AppPath.Login}`} />
			</div>
		)
	}

	return <ResetPasswordMain />
}

export default ResetPasswordPage
