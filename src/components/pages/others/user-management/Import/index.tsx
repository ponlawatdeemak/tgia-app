import { Language } from '@/enum'
import { useSwitchLanguage } from '@/i18n/client'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

export interface FormImportProps {
	open: boolean
	onClose: () => void
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}
export const FormImport: React.FC<FormImportProps> = ({ ...props }) => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const { open, onClose, setOpen, setIsSearch } = props
	return (
		<div className='flex flex-col'>
			<Dialog open={open} onClose={onClose} component='form' onSubmit={() => {}} fullWidth>
				<DialogTitle>นำเข้าผู้ใช้งาน</DialogTitle>
				<DialogContent dividers={true} className='flex flex-col justify-between max-lg:gap-3'>
					ImportContent
				</DialogContent>
			</Dialog>
		</div>
	)
}
