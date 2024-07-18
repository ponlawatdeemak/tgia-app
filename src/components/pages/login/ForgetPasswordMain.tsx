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

const validationSchema = yup.object({
	email: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมล'),
})

const ForgotPasswordMain = () => {
	const router = useRouter()
	const {
		isPending,
		error,
		mutateAsync: mutateForgotPassword,
	} = useMutation<ResponseDto<ForgotPasswordDtoOut>, AxiosError, ForgotPasswordDtoIn, unknown>({
		mutationFn: service.auth.forgotPassword,
	})

	const errorMessage = useMemo(() => {
		if (error) {
			if (error.response?.status === 500) return 'ไม่พบอีเมลนี้ในระบบ'
			return 'มีบางอย่างผิดพลาด'
		}
		return null
	}, [error])

	const onSubmit = useCallback(
		async (values: ForgotPasswordDtoIn) => {
			console.log(values)
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
			<AuthBreadcrumbs name='ลืมรหัสผ่าน' href={AppPath.Login} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-48 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-2 text-2xl font-bold'>คุณลืมรหัสผ่าน?</Typography>
						<Typography className='text-center'>
							กรุณากรอกอีเมล <br className='lg:hidden' />
							เราจะส่งลิ้งค์เพื่อตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณ
						</Typography>

						<form
							noValidate
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<FormInput name='email' label='อีเมล' formik={formik} className='mt-8' />
							<FormHelperText error>{errorMessage}</FormHelperText>
							<Button fullWidth disabled={isPending} variant='contained' type='submit' className='mt-8'>
								ตกลง
							</Button>
						</form>
						<Link href={AppPath.Login} className='mt-8'>
							กลับสู่เข้าสู่ระบบ
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default ForgotPasswordMain
