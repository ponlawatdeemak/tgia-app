'use client'

import EmailIcon from '@/components/svg/icons/EmailIcon'
import { AppPath } from '@/config/app'
import { Button, Typography } from '@mui/material'
import AuthBreadcrumbs from './AuthBreadcrumbs'
import useLanguage from '@/store/language'

interface VerifyEmailMainProps {
	email: string
}

const VerifyEmailMain: React.FC<VerifyEmailMainProps> = ({ email }) => {
	const { language } = useLanguage()
	return (
		<>
			<AuthBreadcrumbs name='ตรวจสอบอีเมล' href={AppPath.Login} />

			<div className='flex flex-grow flex-row'>
				<div className='flex w-full items-center justify-center'>
					<div className='mx-2 flex w-full max-w-[340px] flex-col items-center sm:max-w-[500px]'>
						<EmailIcon width={100} height={100} className='hidden lg:block' />
						<EmailIcon width={134} height={134} className='block lg:hidden' />
						<Typography className='mb-2 mt-4 text-2xl font-bold'>ตรวจสอบอีเมลของคุณ?</Typography>
						<Typography className='mt-2 text-center'>
							เราได้ส่งคำแนะนำเกี่ยวกับวิธีการรีเซ็ตรหัสผ่านของคุณไปที่
						</Typography>
						<Typography className='text-center font-semibold text-primary'>{email}</Typography>
						<Button
							fullWidth
							variant='contained'
							href={`/${language}${AppPath.ResetPassword}?email=${email}`}
							className='mt-10'
						>
							ไปยัง หน้ารีเซ็ตรหัสผ่าน
						</Button>
					</div>
				</div>
			</div>
		</>
	)
}

export default VerifyEmailMain
