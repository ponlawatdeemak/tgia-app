'use client'

import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import { FormikProps } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import * as yup from 'yup'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'

export interface ResetPasswordFormProps {
	formik: FormikProps<any>
	loading?: boolean
	className?: string
	changePassword?: boolean
	resetPassword?: boolean
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
	formik,
	loading = false,
	className,
	changePassword = false,
	resetPassword = false,
	...props
}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

	const email = useMemo(() => {
		const email = searchParams?.get('email')
		const isEmail = yup.string().email().required().isValidSync(email)
		if (!isEmail) return null
		return email
	}, [searchParams])

	return (
		<div className={className}>
			{resetPassword && (
				<FormInput name='email' label='อีเมล' disabled={!!email} formik={formik} className='mt-4' />
			)}
			{changePassword && (
				<PasswordInput
					name='currentPassword'
					label={t('default.password')}
					formik={formik}
					className='mt-4'
					disabled={loading}
				/>
			)}
			<PasswordInput
				name='password'
				label={t('default.passwordNew')}
				formik={formik}
				className='mt-4'
				disabled={loading}
			/>
			<PasswordInput
				name='confirmPassword'
				label={t('default.passwordConfirm')}
				formik={formik}
				className='mt-4'
				disabled={loading}
			/>
			{resetPassword && (
				<FormInput
					name='confirmationCode'
					label='รหัสยืนยันตัวตน (จากอีเมล)'
					formik={formik}
					className='mt-4'
				/>
			)}
		</div>
	)
}

export default ResetPasswordForm
