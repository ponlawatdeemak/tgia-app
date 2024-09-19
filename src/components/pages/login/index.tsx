'use client'
import type { LoginDtoIn } from '@/api/auth/dto-in.dto'
import type { ErrorResponse } from '@/api/interface'
import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import AgriculturalDepartmentLogo from '@/components/svg/AgriculturalDepartmentLogo'
import ThaicomLogo from '@/components/svg/ThaicomLogo'
import TriangleLogo from '@/components/svg/TriangleLogo'
import { AppPath } from '@/config/app'
import LoadingButton from '@mui/lab/LoadingButton'
import { CircularProgress, FormHelperText, Link, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import LanguageSwitcher from './LanguageSwitcher'
import { Language } from '@/enum'

interface LoginMainProps {}

const LoginMain: React.FC<LoginMainProps> = () => {
	const searchParams = useSearchParams()
	const { t, i18n } = useTranslation(['appbar', 'default'])
	const router = useRouter()
	const callbackUrl = useMemo(() => searchParams?.get('callbackUrl'), [searchParams])
	const [busy, setBusy] = useState<boolean>(false)
	const [error, setError] = useState<ErrorResponse>()

	const validationSchema = useMemo(
		() =>
			yup.object({
				username: yup.string().required(t('warning.inputEmail')),
				password: yup.string().required(t('warning.inputPassword')),
			}),
		[t],
	)

	const onSubmit = useCallback(
		async (values: LoginDtoIn) => {
			try {
				setBusy(true)
				const res = await signIn('credentials', {
					username: values.username,
					password: values.password,
					redirect: false,
				})
				if (!res?.ok) {
					setError(res?.error ? JSON.parse(res.error) : t('error.somethingWrong'))
					return
				}
				router.push(callbackUrl || AppPath.FieldLoss)
			} catch (error) {
				console.log('Login failed', error)
			} finally {
				setBusy(false)
			}
		},
		[callbackUrl, router, t],
	)

	const formik = useFormik<LoginDtoIn>({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<main className='grid h-full lg:grid-cols-2'>
			<div className='hidden lg:block'>
				<div className='h-full bg-[url("/leafless-tree.jpeg")] bg-cover bg-center'>
					<div className='flex h-full items-center justify-center bg-black-dark/50'>
						<div className='mx-6 text-center text-white xl:mx-12'>
							<Typography className='mb-6 text-2xl font-bold'>Loss Analytics System</Typography>
							<Typography>
								Satellite-based Analytics together with Artificial Intelligence (AI) and Machine
								learning (ML) for agricultural Insurance
							</Typography>
							<Typography>Validation of rice planting areas</Typography>
							<Typography>Validation of disaster damage areas (Dry Spell, Drought, Flood)</Typography>
							<Typography>
								This system can help to detect damage of insurance claims quickly and more accurate
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<div className='flex h-full flex-col items-center justify-center bg-white'>
				<div className='fixed right-4 top-4'>
					<LanguageSwitcher />
				</div>
				<div className='mx-2 flex flex-col lg:w-[500px]'>
					<div className='flex justify-center gap-1'>
						<TriangleLogo width={70} height={70} />
						<AgriculturalDepartmentLogo width={70} height={70} />
					</div>
					<Typography className='mb-6 mt-3 text-center text-2xl font-semibold sm:mx-10'>
						{t('appName', { ns: 'default' })}
						{i18n.language === Language.TH ? (
							<>
								<br />
							</>
						) : (
							<> </>
						)}
						{t('subAppName', { ns: 'default' })}
					</Typography>
					<form onSubmit={formik.handleSubmit} className='flex flex-col lg:mx-6'>
						<FormInput disabled={busy} name='username' label={t('userName')} formik={formik} />
						<PasswordInput
							disabled={busy}
							name='password'
							label={t('password')}
							formik={formik}
							className='mt-4'
						/>
						<Link href={AppPath.ForgetPassword} className='mt-3 self-end font-medium no-underline'>
							{t('auth.forgotPassword')}
						</Link>
						<FormHelperText error>{error?.title}</FormHelperText>
						<LoadingButton
							fullWidth
							loading={busy}
							loadingPosition='start'
							startIcon={<CircularProgress size={0} />}
							variant='contained'
							type='submit'
							className='mt-8 [&_.MuiButton-startIcon]:m-0'
						>
							<span>{t('auth.login')}</span>
						</LoadingButton>
					</form>
				</div>

				<div className='absolute bottom-0 mb-4'>
					<span className='text-xs'>Powered by</span>
					<ThaicomLogo />
				</div>
			</div>
		</main>
	)
}

export default LoginMain
