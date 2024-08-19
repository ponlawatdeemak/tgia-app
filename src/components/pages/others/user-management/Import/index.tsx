import um from '@/api/um'
import { Language } from '@/enum'
import { useSwitchLanguage } from '@/i18n/client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ClearIcon from '@mui/icons-material/Clear'
import { PostImportXLSXUMDtoIn } from '@/api/um/dto-in.dto'

const maxFileSize = 1.5e7
export interface FormImportProps {
	open: boolean
	onClose: () => void
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}

export const FormImport: React.FC<FormImportProps> = ({ ...props }) => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const [importFile, setImportFile] = React.useState<File>()
	const { open, onClose, setOpen, setIsSearch } = props

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const importFile = event.target.files?.[0]
		console.log(importFile)
		if (importFile) {
			const fileType = importFile.type
			const fileSize = importFile.size
			const validFileTypes = [
				'text/csv',
				'text/xlsx',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			]
			console.log(fileSize)
			console.log(fileType)
			if (validFileTypes.includes(fileType) && fileSize <= maxFileSize) {
				console.log(URL.createObjectURL(importFile))
				setImportFile(importFile)
			} else {
				// handle wrong type + emax size exceed
				console.log('ELSECASE')
			}
		} else {
			setImportFile(undefined)
		}
	}

	const handleConfirmImport = async (event: React.MouseEvent) => {
		event.preventDefault()
		try {
			console.log(importFile?.type)
			if (importFile) {
				if (importFile?.type === 'text/csv') {
					// case csv
					const formData = new FormData()
					formData.append('users_data_csv', importFile)
					const payload: PostImportXLSXUMDtoIn = {
						data: formData,
					}
					const res = await um.postImportCSVUM(payload)
					console.log(res)
				} else {
					// case xlsx
					const formData = new FormData()
					formData.append('users_data_excel', importFile)
					const payload: PostImportXLSXUMDtoIn = {
						data: formData,
					}
					const res = await um.postImportXLSXUM(payload)
					console.log(res)
				}
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleDownloadTemplate = async (type: string) => {
		try {
			let res
			if (type === 'csv') {
				res = await um.getTemplateCSVUM()
				const a = document.createElement('a')
				a.download = 'users_data_csv.' + type
				a.href = window.URL.createObjectURL(res.data)
				const clickEvt = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: true,
				})
				a.dispatchEvent(clickEvt)
				a.remove()
			} else {
				res = await um.getTemplateXLSXUM()
				const a = document.createElement('a')
				a.download = 'users_data_excel.' + type
				a.href = window.URL.createObjectURL(res.data)
				const clickEvt = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: true,
				})
				a.dispatchEvent(clickEvt)
				a.remove()
			}
			if (res) {
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const handleRemoveFile = () => {
		setImportFile(undefined)
	}

	return (
		<div className='flex flex-col'>
			<Dialog open={open} onClose={onClose} component='form' onSubmit={() => {}} fullWidth>
				<DialogTitle>นำเข้าผู้ใช้งาน</DialogTitle>
				<DialogContent dividers={true} className='flex flex-col items-center justify-between max-lg:gap-3'>
					<Box className='flex h-[300px] w-[400px] flex-col bg-gray-light2 p-[24px]'>
						{importFile ? (
							<>
								<Button
									endIcon={
										<IconButton disableRipple onClick={handleRemoveFile}>
											<ClearIcon />
										</IconButton>
									}
									variant='outlined'
									disableElevation
								>
									{importFile.name}
								</Button>
							</>
						) : (
							<Button
								component='label'
								role={undefined}
								variant='outlined'
								tabIndex={-1}
								className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
							>
								อัปโหลดไฟล์
								<input
									type='file'
									accept='.csv, .xlsx, .xls'
									className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
									onChange={handleFileChange}
									// {...uploadProps}
								/>
							</Button>
						)}
						<Button
							component='label'
							role={undefined}
							variant='outlined'
							tabIndex={-1}
							className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
							onClick={() => {
								handleDownloadTemplate('csv')
							}}
						>
							ดาวน์โหลด Template csv
						</Button>
						<Button
							component='label'
							role={undefined}
							variant='outlined'
							tabIndex={-1}
							className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
							onClick={() => {
								handleDownloadTemplate('xlsx')
							}}
						>
							ดาวน์โหลด Template excel
						</Button>
					</Box>
				</DialogContent>
				{importFile && (
					<DialogActions className={'flex justify-end p-6'}>
						<div className={'flex justify-end space-x-2'}>
							<Button className='h-[40px] w-[71px] bg-white text-sm text-black' variant='contained'>
								{t('cancel')}
							</Button>
							<Button
								type='submit'
								variant='contained'
								color='primary'
								className='h-[40px] w-[71px] text-sm [&_.MuiButtonBase-root]:w-[71px]'
								onClick={handleConfirmImport}
							>
								{t('confirm')}
							</Button>
						</div>
					</DialogActions>
				)}
			</Dialog>
		</div>
	)
}
