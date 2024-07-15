'use client'

import service from '@/api'
import PasswordInput from '@/components/common/input/PasswordInput'
import { AppPath } from '@/config/app'
import { Button, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useCallback } from 'react'
import * as yup from 'yup'
import AuthBreadcrumbs from './AuthBreadcrumbs'

const validationSchema = yup.object({
	password: yup
		.string()
		.required('กรุณากรอกรหัสผ่านใหม่')
		.min(8, 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร')
		.matches(/^(?=.*[0-9])/, 'ต้องมีอย่างน้อย 1 หมายเลข')
		.matches(/^(?=.*[a-z])/, 'ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
		.matches(/^(?=.*[A-Z])/, 'ต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
		.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว'),
	confirmPassword: yup
		.string()
		.required('กรุณากรอกรหัสผ่านอีกครั้ง')
		.oneOf([yup.ref('password')], 'รหัสผ่านต้องตรงกัน'),
})

type ResetPasswordFormType = yup.InferType<typeof validationSchema>

const ResetPasswordMain = () => {
	const {
		isPending,
		error,
		mutateAsync: mutateResetPassword,
	} = useMutation({
		mutationFn: service.auth.resetPassword,
	})
	console.log('TLOG ~ error:', error)

	const onSubmit = useCallback(
		(values: ResetPasswordFormType) => {
			console.log(values)
			// mutateResetPassword(values)
		},
		[mutateResetPassword],
	)

	const formik = useFormik<ResetPasswordFormType>({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<>
			<AuthBreadcrumbs name='รีเซ็ตรหัสผ่าน' href={AppPath.Login} />

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
							<Button fullWidth disabled={isPending} variant='contained' className='mt-10' type='submit'>
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
