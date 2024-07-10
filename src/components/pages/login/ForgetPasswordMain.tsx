'use client'

import FormInput from '@/components/common/input/FormInput'
import { Button, Link, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'

const validationSchema = yup.object({
	email: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมล'),
})

const ForgetPasswordMain = () => {
	const onSubmit = useCallback((values: any) => {
		console.log(values)
		// call api
	}, [])

	const formik = useFormik<any>({
		initialValues: {
			email: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	const loginHref = useMemo(() => '/login', [])

	return (
		<>
			<AuthBreadcrumbs name='ลืมรหัสผ่าน' href={loginHref} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-48 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-2 text-2xl font-bold'>คุณลืมรหัสผ่าน?</Typography>
						<Typography className='text-center'>
							กรุณากรอกอีเมล <br className='lg:hidden' />
							เราจะส่งลิ้งค์เพื่อตั้งรหัสผ่านใหม่ไปยังอีเมลของคุณ
						</Typography>

						<form
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<FormInput fullWidth name='email' label='อีเมล' formik={formik} className='my-8' />
							<Button fullWidth variant='contained' type='submit'>
								ตกลง
							</Button>
						</form>
						<Link href={loginHref} className='mt-8'>
							กลับสู่เข้าสู่ระบบ
						</Link>
					</div>
				</div>
			</div>
		</>
	)
}

export default ForgetPasswordMain
