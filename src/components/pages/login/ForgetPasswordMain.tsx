'use client'

import service, { ResponseDto } from '@/api'
import FormInput from '@/components/common/input/FormInput'
import { AppPath } from '@/config/app'
import { Button, FormHelperText, Link, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'
import { ForgotPasswordDtoOut } from '@/api/dto/auth/dto-out.dto'
import { ForgotPasswordDtoIn } from '@/api/dto/auth/dto-in.dto'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'
import LoadingButton from '@mui/lab/LoadingButton'
import clsx from 'clsx'

// const validationSchema = yup.object({
// 	email: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมล'),
// })

const ForgotPasswordMain = () => {
	const router = useRouter()
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
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
				router.push(`/${language}${AppPath.VerifyEmail}?email=${values?.email}`)
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
			<AuthBreadcrumbs name={t('auth.forgotPassword')} href={`/${language}${AppPath.Login}`} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-48 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-2 text-2xl font-bold'> {t('auth.headerForgotPassword')}</Typography>
						<Typography className='text-center'>
							{t('auth.subHeaderForgotPassword')} <br className='lg:hidden' />
							{t('auth.subHeaderSendLink')}
						</Typography>

						<form
							noValidate
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<FormInput
								disabled={isPending}
								name='email'
								label={t('default.email')}
								formik={formik}
								className='mt-8'
							/>
							<FormHelperText error>{errorMessage}</FormHelperText>
							{/* <Button fullWidth disabled={isPending} variant='contained' type='submit' className='mt-8'>
								{t('default.ok')}
							</Button> */}
							<LoadingButton
								fullWidth
								loading={isPending}
								loadingPosition='start'
								variant='contained'
								type='submit'
								className={clsx(
									'mt-8 h-[36.5px] [&_.MuiLoadingButton-loadingIndicator]:relative [&_.MuiLoadingButton-loadingIndicator]:left-auto',
									{
										'[&_.MuiLoadingButton-loadingIndicator]:right-[35px]': language === 'th',
										'[&_.MuiLoadingButton-loadingIndicator]:right-[40px]': language === 'en',
									},
								)}
							>
								<div className='absolute'>{t('default.ok')}</div>
							</LoadingButton>
						</form>
						<Link href={`/${language}${AppPath.Login}`} className='mt-8'>
							{t('auth.returnLogin')}
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default ForgotPasswordMain
