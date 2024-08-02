import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { signOut } from 'next-auth/react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

interface TokenExpiredDialogProps {}

const TokenExpiredDialog: React.FC<TokenExpiredDialogProps> = () => {
	const onClose = useCallback(() => signOut(), [])
	const { t, i18n } = useTranslation(['default', 'appbar'])

	return (
		<Dialog open={true}>
			<DialogTitle>{t('auth.tokenExpire')}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t('auth.loginAgain')}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant='contained' onClick={onClose}>
					{t('ok')}
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default TokenExpiredDialog
