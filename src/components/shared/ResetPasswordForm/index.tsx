'use client'

import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import { FormikProps } from 'formik'
import { useTranslation } from 'react-i18next'

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
	const { t } = useTranslation(['default', 'appbar'])
	return (
		<div className={className}>
			{resetPassword && <FormInput name='email' label={t('email')} disabled={isEmail} formik={formik} />}
			{changePassword && (
				<PasswordInput
					name='currentPassword'
					label={t('password')}
					formik={formik}
					disabled={loading}
					required
				/>
			)}
			<PasswordInput name='password' label={t('passwordNew')} formik={formik} disabled={loading} required />
			<PasswordInput
				name='confirmPassword'
				label={t('passwordConfirm')}
				formik={formik}
				disabled={loading}
				required
			/>
			{resetPassword && (
				<FormInput
					name='confirmationCode'
					label={t('auth.verificationCode', { ns: 'appbar' })}
					formik={formik}
				/>
			)}
		</div>
	)
}

export default ResetPasswordForm
