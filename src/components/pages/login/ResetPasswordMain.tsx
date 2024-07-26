'use client'

import service, { ResponseDto } from '@/api'
import { ResetPasswordDtoIn } from '@/api/dto/auth/dto-in.dto'
import { ResetPasswordDtoOut } from '@/api/dto/auth/dto-out.dto'
import ResetPasswordForm from '@/components/shared/ResetPasswordForm'
import { AppPath } from '@/config/app'
import LoadingButton from '@mui/lab/LoadingButton'
import { CircularProgress, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'

interface ResetPasswordProps extends WithTranslation {}

const ResetPasswordMain: React.FC<ResetPasswordProps> = ({ t }) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const validationSchema = yup.object({
		email: yup.string().required(),
		password: yup
			.string()
			.required(t('warning.inputNewPassword'))
			.min(8, t('warning.minPasswordCharacters'))
			.matches(/^(?=.*[0-9])/, t('warning.minPasswordNumber'))
			.matches(/^(?=.*[a-z])/, t('warning.minPasswordLowercaseLetter'))
			.matches(/^(?=.*[A-Z])/, t('warning.minPasswordUppercaseLetter'))
			.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, t('warning.minPasswordSymbol')),
		confirmPassword: yup
			.string()
			.required(t('warning.inputConfirmPassword'))
			.oneOf([yup.ref('password')], t('warning.invalidPasswordMatch')),
		confirmationCode: yup.string().required(t('warning.inputVerificationCode')),
	})

	type ResetPasswordFormType = yup.InferType<typeof validationSchema>

	const email = useMemo(() => {
		const email = searchParams?.get('email')
		const isEmail = yup.string().email().required().isValidSync(email)
		if (!isEmail) return null
		return email
	}, [searchParams])

	const {
		isPending,
		error,
		mutateAsync: mutateResetPassword,
	} = useMutation<ResponseDto<ResetPasswordDtoOut>, AxiosError, ResetPasswordDtoIn, unknown>({
		mutationFn: service.auth.resetPassword,
	})

	const onSubmit = useCallback(
		async (values: ResetPasswordFormType) => {
			try {
				await mutateResetPassword(values)
				router.push(`${AppPath.ResetPassword}/?resetStatus=success`)
			} catch (error) {
				router.push(`${AppPath.ResetPassword}/?resetStatus=failed`)
			}
		},
		[mutateResetPassword, router],
	)

	const formik = useFormik<ResetPasswordFormType>({
		initialValues: {
			email: email || '',
			password: '',
			confirmPassword: '',
			confirmationCode: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<>
			<AuthBreadcrumbs name={t('default.resetPassword')} href={AppPath.Login} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-32 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-8 text-2xl font-bold'>{t('default.resetPassword')}</Typography>
						<form
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<ResetPasswordForm
								className='mt-4 flex flex-col gap-4'
								formik={formik}
								resetPassword={true}
								loading={isPending}
								isEmail={true}
							/>
							{/* {!email && <FormHelperText error>URL รีเซ็ตรหัสผ่านไม่ถูกต้อง</FormHelperText>} */}
							<LoadingButton
								fullWidth
								loading={isPending}
								loadingPosition='start'
								startIcon={<CircularProgress size={0} />}
								variant='contained'
								type='submit'
								className='mt-10 [&_.MuiButton-startIcon]:m-0'
							>
								<span>{t('default.confirm')}</span>
							</LoadingButton>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

export default withTranslation('appbar')(ResetPasswordMain)
