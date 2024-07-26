'use client'
import { LoginDtoIn } from '@/api/dto/auth/dto-in.dto'
import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import AgriculturalDepartmentLogo from '@/components/svg/AgriculturalDepartmentLogo'
import ThaicomLogo from '@/components/svg/ThaicomLogo'
import TriangleLogo from '@/components/svg/TriangleLogo'
import { AppPath } from '@/config/app'
import {
	Button,
	CircularProgress,
	FormHelperText,
	Link,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import useLanguage from '@/store/language'
import { useTranslation } from '@/i18n/client'
import * as yup from 'yup'
import { Language } from '@/enum'
import LoadingButton from '@mui/lab/LoadingButton'

const LoginMain = () => {
	const searchParams = useSearchParams()
	const { language, setLanguage } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
	const pathname = usePathname()
	const router = useRouter()
	const callbackUrl = useMemo(() => searchParams?.get('callbackUrl'), [searchParams])
	const error = useMemo(() => searchParams?.get('error'), [searchParams])
	const [busy, setBusy] = useState<boolean>(false)

	const validationSchema = yup.object({
		username: yup.string().required(t('warning.inputEmail')),
		password: yup.string().required(t('warning.inputPassword')),
	})

	const errorMessage = useMemo(() => {
		if (error) {
			if (error === 'CredentialsSignin') return `${t('error.incorrectEmailOrPassword')}`
			return `${t('error.somethingWrong')}`
		}
		return null
	}, [error])

	const onSubmit = useCallback(
		async (values: LoginDtoIn) => {
			try {
				setBusy(true)
				console.log('next-auth ', callbackUrl, AppPath.FieldLoss)
				await signIn('credentials', {
					username: values.username,
					password: values.password,
					redirect: true,
					callbackUrl: callbackUrl ?? AppPath.FieldLoss,
				})
			} catch (error) {
				console.log('Login failed', error)
			} finally {
				setBusy(false)
			}
		},
		[callbackUrl],
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
					<ToggleButtonGroup
						className='box-border flex p-1'
						value={language}
						exclusive
						color='primary'
						onChange={(event: React.MouseEvent<HTMLElement>, newLanguage: Language) => {
							if (newLanguage !== null) {
								setLanguage(newLanguage)
								const oldLanguage = pathname?.split('/')?.[1]
								router.push(window.location.href.replace(`/${oldLanguage}/`, `/${newLanguage}/`))
							}
						}}
					>
						<ToggleButton
							className='primary-color rounded px-3 py-0.5 text-sm'
							value={Language.TH}
							aria-label='left aligned'
						>
							TH
						</ToggleButton>
						<ToggleButton
							className='rounded px-3 py-0.5 text-sm'
							value={Language.EN}
							aria-label='right aligned'
						>
							EN
						</ToggleButton>
					</ToggleButtonGroup>
				</div>
				<div className='mx-2 flex flex-col lg:w-[500px]'>
					<div className='flex justify-center gap-1'>
						<TriangleLogo width={70} height={70} />
						<AgriculturalDepartmentLogo width={70} height={70} />
					</div>
					<Typography className='mb-6 mt-3 text-center text-2xl font-semibold sm:mx-10'>
						{t('auth.title')}
						<br />
						{t('auth.subTitle')}
					</Typography>
					<form onSubmit={formik.handleSubmit} className='flex flex-col lg:mx-6'>
						<FormInput disabled={busy} name='username' label={t('default.userName')} formik={formik} />
						<PasswordInput
							disabled={busy}
							name='password'
							label={t('default.password')}
							formik={formik}
							className='mt-4'
						/>
						<Link href={AppPath.ForgetPassword} className='mt-3 self-end font-medium no-underline'>
							{t('auth.forgotPassword')}
						</Link>
						<FormHelperText error>{errorMessage}</FormHelperText>
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
