'use client'

import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import { FormikProps } from 'formik'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'

export interface ResetPasswordFormProps {
	formik: FormikProps<any>
	loading?: boolean
	isEmail?: boolean
	className?: string
	changePassword?: boolean
	resetPassword?: boolean
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
	formik,
	loading = false,
	isEmail = false,
	className,
	changePassword = false,
	resetPassword = false,
}) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

	return (
		<div className={className}>
			{resetPassword && <FormInput name='email' label={t('default.email')} disabled={isEmail} formik={formik} />}
			{changePassword && (
				<PasswordInput
					name='currentPassword'
					label={t('default.password')}
					formik={formik}
					disabled={loading}
				/>
			)}
			<PasswordInput name='password' label={t('default.passwordNew')} formik={formik} disabled={loading} />
			<PasswordInput
				name='confirmPassword'
				label={t('default.passwordConfirm')}
				formik={formik}
				disabled={loading}
			/>
			{resetPassword && <FormInput name='confirmationCode' label={t('auth.verificationCode')} formik={formik} />}
		</div>
	)
}

export default ResetPasswordForm
