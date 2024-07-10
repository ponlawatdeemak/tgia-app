'use client'

import { Button, Typography } from '@mui/material'
import { useMemo } from 'react'
import AuthBreadcrumbs from './AuthBreadcrumbs'
import EmailIcon from '@/components/svg/icons/EmailIcon'
import useResponsive from '@/hook/responsive'

const VerifyEmailMain = () => {
	const { isDesktop } = useResponsive()
	const loginHref = useMemo(() => '/login', [])

	const email = 'Somchai@gmail.com'

	return (
		<>
			<AuthBreadcrumbs name='ตรวจสอบอีเมล' href={loginHref} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center'>
					<div className='mx-2 flex w-full max-w-[340px] flex-col items-center sm:max-w-[500px]'>
						<EmailIcon width={isDesktop ? 100 : 134} height={isDesktop ? 100 : 134} />
						<Typography className='mb-2 mt-4 text-2xl font-bold'>ตรวจสอบอีเมลของคุณ?</Typography>
						<Typography className='mt-2 text-center'>
							เราได้ส่งคำแนะนำเกี่ยวกับวิธีการรีเซ็ตรหัสผ่านของคุณไปที่
						</Typography>
						<Typography className='text-center font-semibold text-primary'>{email}</Typography>
						<Button fullWidth variant='contained' href={loginHref} className='mt-10'>
							กลับสู่หน้าลงชื่อเข้าใช้
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

export default VerifyEmailMain
