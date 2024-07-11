'use client'

import PasswordInput from '@/components/common/input/PasswordInput'
import { Button, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'

const validationSchema = yup.object({
	password: yup.string().required('กรุณากรอกรหัสผ่านใหม่'),
	confirmPassword: yup
		.string()
		.required('กรุณากรอกรหัสผ่านอีกครั้ง')
		.oneOf([yup.ref('password')], 'รหัสผ่านต้องตรงกัน'),
})

// ข้อกำหนดรหัสผ่าน:
// - มีอย่างน้อย 1 หมายเลข
// - มีอักษรตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว
// - มีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว
// - มีอักขระพิเศษอย่างน้อย
// - อักขระต่อไปนี้นับเป็นอักขระพิเศษ: ! @ # % & ^ $ * . [ ] { } ( ) ? - / \ , > < : ; | _ ~ + =

const ResetPasswordMain = () => {
	const onSubmit = useCallback((values: any) => {
		console.log(values)
		// call api
	}, [])

	const formik = useFormik<any>({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	const loginHref = useMemo(() => '/login', [])

	return (
		<>
			<AuthBreadcrumbs name='รีเซ็ตรหัสผ่าน' href={loginHref} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center lg:mt-48 lg:items-start'>
					<div className='mx-2 flex w-full max-w-[500px] flex-col items-center'>
						<Typography className='mb-8 text-2xl font-bold'>รีเซ็ตรหัสผ่าน</Typography>
						<form
							onSubmit={formik.handleSubmit}
							className='flex w-full max-w-[340px] flex-col sm:max-w-full'
						>
							<PasswordInput name='password' label='รหัสผ่านใหม่' formik={formik} />
							<PasswordInput
								name='confirmPassword'
								label='ยืนยันรหัสผ่าน'
								formik={formik}
								className='mt-4'
							/>
							<Button fullWidth variant='contained' className='mt-10' type='submit'>
								ยืนยัน
							</Button>
						</form>
					</div>
				</div>
			</div>
		</>
	)
}

export default ResetPasswordMain
