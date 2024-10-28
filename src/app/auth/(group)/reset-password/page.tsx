import FailedResetPassword from '@/components/common/reset-status/FailedResetPassword'
import SuccessResetPassword from '@/components/common/reset-status/SuccessResetPassword'
import ResetPasswordMain from '@/components/pages/login/ResetPasswordMain'
import { AppPath } from '@/config/app'
interface ResetPasswordPageProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ searchParams }) => {
	if (searchParams?.resetStatus === 'success') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<SuccessResetPassword buttonLabel='auth.returnLogin' buttonHref={AppPath.Login} />
			</div>
		)
	}

	if (searchParams?.resetStatus === 'failed') {
		return (
			<div className='flex flex-grow items-center justify-center'>
				<FailedResetPassword buttonLabel='auth.returnLogin' buttonHref={AppPath.Login} />
			</div>
		)
	}

	return <ResetPasswordMain />
}

export default ResetPasswordPage
