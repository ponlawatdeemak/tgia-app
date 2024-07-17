import { mdiCloseThick } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Typography } from '@mui/material'

interface FailedResetPasswordProps {
	buttonLabel: string
	buttonHref: string
}

const FailedResetPassword: React.FC<FailedResetPasswordProps> = ({ buttonLabel, buttonHref }) => {
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
				<div className='absolute h-full w-full bg-error opacity-20' />
				<Icon path={mdiCloseThick} size={2} className='text-error' />
			</div>
			<Typography className='text-2xl font-bold'>รีเซ็ตรหัสผ่านใหม่ไม่สำเร็จ</Typography>
			<Typography>กรุณาตรวจเช็คความถูกต้องใหม่อีกครั้ง</Typography>
			<Button variant='contained' className='mt-8' href={buttonHref}>
				{buttonLabel}
			</Button>
		</div>
	)
}

export default FailedResetPassword
