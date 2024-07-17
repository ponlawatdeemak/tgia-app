import { mdiCheckBold } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'
import React from 'react'

interface SuccessResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const SuccessResetPassword: React.FC<SuccessResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='bg-success-light absolute h-full w-full' />
				<Icon path={mdiCheckBold} size={2} className='z-10 text-success' />
			</div>
			<Typography className='text-2xl font-bold'>รีเซ็ตรหัสผ่านใหม่สำเร็จ</Typography>
			<Typography>โปรดใช้รหัสผ่านที่ตั้งขึ้นใหม่นี้ในการเข้าใช้งานระบบในครั้งต่อไป</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{buttonLabel}
			</Button>
		</div>
	)
}

export default SuccessResetPassword
