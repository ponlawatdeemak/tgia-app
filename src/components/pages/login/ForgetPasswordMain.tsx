'use client'

import service from '@/api'
import { ForgotPasswordDtoIn } from '@/api/auth/dto-in.dto'
import { ForgotPasswordDtoOut } from '@/api/auth/dto-out.dto'
import { ResponseDto } from '@/api/interface'
import FormInput from '@/components/common/input/FormInput'
import { AppPath } from '@/config/app'
import LoadingButton from '@mui/lab/LoadingButton'
import { CircularProgress, FormHelperText, Link, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'

interface ForgotPasswordMainProps {}

const ForgotPasswordMain: React.FC<ForgotPasswordMainProps> = () => {
	const router = useRouter()
	const { t } = useTranslation(['default', 'appbar'])
	const {
		isPending,
		error,
		mutateAsync: mutateForgotPassword,
	} = useMutation<ResponseDto<ForgotPasswordDtoOut>, AxiosError, ForgotPasswordDtoIn, unknown>({
		mutationFn: service.auth.forgotPassword,
	})

	const validationSchema = yup.object({
		email: yup.string().email(t('warning.invalidEmailFormat')).required(t('warning.inputEmail')),
	})

	const errorMessage = useMemo(() => {
		if (error) {
			const msgError: any = error.response
			return `${t('error.somethingWrong')}`
		}
		return null
	}, [error])

	const onSubmit = useCallback(
		async (values: ForgotPasswordDtoIn) => {
			try {
				await mutateForgotPassword(values)
				router.push(`${AppPath.VerifyEmail}?email=${values?.email}`)
			} catch (error) {}
		},
		[mutateForgotPassword, router],
	)

	const formik = useFormik<ForgotPasswordDtoIn>({
		initialValues: {
			email: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<>
			<AuthBreadcrumbs name={t('auth.forgotPassword', { ns: 'appbar' })} href={AppPath.Login} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-48 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-2 text-2xl font-bold'>
							{' '}
							{t('auth.headerForgotPassword', { ns: 'appbar' })}
						</Typography>
						<Typography className='text-center'>
							{t('auth.subHeaderForgotPassword', { ns: 'appbar' })} <br className='lg:hidden' />
							{t('auth.subHeaderSendLink', { ns: 'appbar' })}
						</Typography>

						<form
							noValidate
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<FormInput
								disabled={isPending}
								name='email'
								label={t('email')}
								formik={formik}
								className='mt-8'
							/>
							<FormHelperText error>{errorMessage}</FormHelperText>
							<LoadingButton
								fullWidth
								loading={isPending}
								loadingPosition='start'
								startIcon={<CircularProgress size={0} />}
								variant='contained'
								type='submit'
								className='mt-8 [&_.MuiButton-startIcon]:m-0'
							>
								<span>{t('ok')}</span>
							</LoadingButton>
						</form>
						<Link href={AppPath.Login} className='mt-8'>
							{t('auth.returnLogin', { ns: 'appbar' })}
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default ForgotPasswordMain
