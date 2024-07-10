'use client'
import {
	Button,
	FormControl,
	FormHelperText,
	FormLabel,
	IconButton,
	InputAdornment,
	Link,
	OutlinedInput,
	Typography,
} from '@mui/material'
import * as React from 'react'
import AgriculturalDepartmentLogo from '@/components/svg/AgriculturalDepartmentLogo'
import TriangleLogo from '@/components/svg/TriangleLogo'
import Icon from '@mdi/react'
import { mdiEyeOffOutline, mdiEyeOutline } from '@mdi/js'
import ThaicomLogo from '@/components/svg/ThaicomLogo'
import { useFormik } from 'formik'
import { LoginDtoIn } from '@/api/auth/dto-in.dto'
import * as yup from 'yup'

const validationSchema = yup.object({
	username: yup.string().email('รูปแบบอีเมลไม่ถูกต้อง').required('กรุณากรอกอีเมล'),
	password: yup.string().min(8, 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร').required('กรุณากรอกรหัสผ่าน'),
})

export default function LoginPage() {
	const [showPassword, setShowPassword] = React.useState(false)

	const handleClickShowPassword = () => setShowPassword((show) => !show)

	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
	}

	const onSubmit = (values: LoginDtoIn) => {
		console.log(values)
		// call api
	}

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
					<div className='flex h-full items-center justify-center bg-black/50'>
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
					<form onSubmit={formik.handleSubmit} className='flex flex-col'>
						<FormControl fullWidth>
							<FormLabel id='username-label'>ชื่อผู้ใช้งาน</FormLabel>
							<OutlinedInput
								id='username-input'
								name='username'
								size='small'
								value={formik.values.username}
								onChange={formik.handleChange}
								error={formik.touched.username && Boolean(formik.errors.username)}
							/>
							<FormHelperText error>{formik.touched.username && formik.errors.username}</FormHelperText>
						</FormControl>
						<FormControl fullWidth className='mt-2'>
							<FormLabel id='password-label'>รหัสผ่าน</FormLabel>
							<OutlinedInput
								id='password-input'
								name='password'
								size='small'
								type={showPassword ? 'text' : 'password'}
								endAdornment={
									<InputAdornment position='end'>
										<IconButton
											aria-label='toggle password visibility'
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge='end'
										>
											{showPassword ? (
												<Icon path={mdiEyeOffOutline} size={1} />
											) : (
												<Icon path={mdiEyeOutline} size={1} />
											)}
										</IconButton>
									</InputAdornment>
								}
								value={formik.values.password}
								onChange={formik.handleChange}
								error={formik.touched.password && Boolean(formik.errors.password)}
							/>
							<FormHelperText error>{formik.touched.password && formik.errors.password}</FormHelperText>
						</FormControl>
						<Link href='/login/forget-password' className='mt-3 self-end font-medium no-underline'>
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
