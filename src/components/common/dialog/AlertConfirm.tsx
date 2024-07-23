import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Typography,
} from '@mui/material'
import React from 'react'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'

export interface AlertConfirmProps {
	open: boolean
	title: string
	content: string
	subContent?: string
	hideClose?: boolean
	className?: string
	mode?: string
	confirmTitle?: string
	cancelTitle?: string
	onClose: () => void
	onConfirm: () => void
}

const AlertConfirm: React.FC<AlertConfirmProps> = ({
	open = false,
	title,
	content,
	subContent,
	hideClose = false,
	className,
	mode = 'DialogConfirm',
	confirmTitle,
	cancelTitle,
	onClose,
	onConfirm,
}) => {
	return (
		<Dialog open={open} onClose={onClose} className='[&_.MuiDialog-paper]:w-[560px]'>
			<DialogTitle className='flex items-center justify-between p-[8px] pl-[24px]'>
				<Typography className='text-xl font-semibold'>{title}</Typography>
				{!hideClose && (
					<IconButton aria-label='close' onClick={onClose}>
						<Icon path={mdiClose} size={'24px'} />
					</IconButton>
				)}
			</DialogTitle>
			<DialogContent className='flex flex-col gap-[24px] py-[16px]'>
				<DialogContentText className='text-md text-black'>{content}</DialogContentText>
				{subContent && <DialogContentText>{subContent}</DialogContentText>}
			</DialogContent>
			{mode === 'DialogConfirm' ? (
				<DialogActions className='border-[0px] border-t-[1px] border-solid border-transparent border-t-gray p-[24px] pt-[15px]'>
					<Button
						onClick={onClose}
						variant='outlined'
						size='large'
						className='h-[40px] border-gray px-[15px] text-base font-semibold text-black'
					>
						{cancelTitle || 'ยกเลิก'}
					</Button>
					<Button
						onClick={onConfirm}
						variant='contained'
						size='large'
						className='h-[40px] px-[16px] text-base font-semibold'
					>
						{confirmTitle || 'ยืนยัน'}
					</Button>
				</DialogActions>
			) : (
				<DialogActions className='border-[0px] border-t-[1px] border-solid border-transparent border-t-gray p-[24px] pt-[15px]'>
					<Button
						onClick={onConfirm}
						variant='contained'
						size='large'
						className='h-[40px] bg-error px-[16px] text-base font-semibold'
					>
						{confirmTitle || 'ปิด'}
					</Button>
				</DialogActions>
			)}
		</Dialog>
	)
}

export default AlertConfirm
