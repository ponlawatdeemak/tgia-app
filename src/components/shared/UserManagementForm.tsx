import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FormEvent } from 'react'

export interface ProfileFormProps {
	open: boolean
	onClose: () => void
	onSubmitUser: (event: FormEvent) => void
}

const UserManagementForm: React.FC<ProfileFormProps> = ({ open, onClose, onSubmitUser, ...props }) => {
	return (
		<Dialog open={open} onClose={onClose} component='form' onSubmit={onSubmitUser} fullWidth scroll='paper'>
			<DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
			<DialogContent className='h-[492px]' dividers={true}>
				UserManagementForm
			</DialogContent>
			<DialogActions className='p-6'>
				<Button className='bg-white text-inherit' variant='contained' onClick={onClose}>
					ยกเลิก
				</Button>
				<Button type='submit' variant='contained' color='primary'>
					บันทึก
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default UserManagementForm
