import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { signOut } from 'next-auth/react'
import React, { useCallback } from 'react'

interface TokenExpiredDialogProps {}

const TokenExpiredDialog: React.FC<TokenExpiredDialogProps> = () => {
	const onClose = useCallback(() => signOut(), [])

	return (
		<Dialog open={true}>
			<DialogTitle>ระยะเวลาการใช้งานหมดอายุ</DialogTitle>
			<DialogContent>
				<DialogContentText>โปรดเข้าสู่ระบบอีกครั้ง</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={onClose}>
					ตกลง
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default TokenExpiredDialog
