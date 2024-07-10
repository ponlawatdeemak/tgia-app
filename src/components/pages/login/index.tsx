'use client'
import { LoginDtoIn } from '@/api/auth/dto-in.dto'
import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import AgriculturalDepartmentLogo from '@/components/svg/AgriculturalDepartmentLogo'
import ThaicomLogo from '@/components/svg/ThaicomLogo'
import TriangleLogo from '@/components/svg/TriangleLogo'
import { Button, Link, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useCallback, useMemo } from 'react'
import * as yup from 'yup'

const validationSchema = yup.object({
	username: yup.string().required('กรุณากรอกอีเมล'),
	password: yup.string().min(8, 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร').required('กรุณากรอกรหัสผ่าน'),
})

const LoginMain = () => {
	const onSubmit = useCallback((values: LoginDtoIn) => {
		console.log(values)
		// call api
	}, [])

	const formik = useFormik<LoginDtoIn>({
		initialValues: {
			username: '',
			password: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	const forgetPasswordHref = useMemo(() => '/login/forget-password', [])

	return (
		<main className='grid h-full lg:grid-cols-2'>
			<div className='hidden lg:block'>
				<div className='h-full bg-[url("/leafless-tree.jpeg")] bg-cover bg-center'>
					<div className='bg-black/50 flex h-full items-center justify-center'>
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
				<div className='mx-2 flex flex-col lg:w-[500px]'>
					<div className='flex justify-center gap-1'>
						<TriangleLogo width={70} height={70} />
						<AgriculturalDepartmentLogo width={70} height={70} />
					</div>
					<Typography className='mb-6 mt-3 text-center text-2xl font-semibold sm:mx-10'>
						โครงการพัฒนาระบบเทคโนโลยี
						<br />
						เพื่องานประกันภัยข้าวนาปี
					</Typography>
					<form onSubmit={formik.handleSubmit} className='flex flex-col lg:mx-6'>
						<FormInput name='username' label='ชื่อผู้ใช้งาน' formik={formik} />
						<PasswordInput name='password' label='รหัสผ่าน' formik={formik} className='mt-4' />
						<Link href={forgetPasswordHref} className='mt-3 self-end font-medium no-underline'>
							ลืมรหัสผ่าน
						</Link>
						<Button fullWidth variant='contained' className='mt-8' type='submit'>
							เข้าสู่ระบบ
						</Button>
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
