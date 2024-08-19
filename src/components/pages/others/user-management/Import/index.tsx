import um from '@/api/um'
import { Language } from '@/enum'
import { useSwitchLanguage } from '@/i18n/client'
import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Input,
	Typography,
} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ClearIcon from '@mui/icons-material/Clear'
import { PostImportXLSXUMDtoIn } from '@/api/um/dto-in.dto'
import Icon from '@mdi/react'
import { mdiTrayArrowDown } from '@mdi/js'
import { mdiTrayArrowUp } from '@mdi/js'
import { useMutation } from '@tanstack/react-query'
import LoadingButton from '@mui/lab/LoadingButton'

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
	const [uploadFileError, setUploadFileError] = React.useState({
		severity: 'error',
		message: '',
	})
	const [isLoading, setIsLoading] = React.useState<boolean>()

	React.useEffect(() => {
		console.log(isLoading)
	}, [isLoading])

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
			if (validFileTypes.includes(fileType) && fileSize <= maxFileSize) {
				setImportFile(importFile)
			} else {
				// handle wrong type + emax size exceed
				// notification lower left side error
				setUploadFileError({
					severity: 'error',
					message: 'wrong type',
				})
			}
		} else {
			// no file
			setImportFile(undefined)
			// notification lower left side error
			setUploadFileError({
				severity: 'error',
				message: t('error.somethingWrong'),
			})
		}
	}

	const handleConfirmImport = async (event: React.MouseEvent) => {
		event.preventDefault()
		try {
			setIsLoading(true)
			console.log(importFile?.type)
			if (importFile) {
				if (importFile?.type === 'text/csv') {
					// case csv
					try {
						const formData = new FormData()
						formData.append('users_data_csv', importFile)
						const payload: PostImportXLSXUMDtoIn = {
							data: formData,
						}
						const res = await um.postImportCSVUM(payload)
						console.log(res)
					} catch (error: any) {
						// post service error show in local modal component rows errors
						console.log(error)
					}
				} else {
					// case xlsx
					try {
						const formData = new FormData()
						formData.append('users_data_excel', importFile)
						const payload: PostImportXLSXUMDtoIn = {
							data: formData,
						}
						const res = await um.postImportXLSXUM(payload)
						console.log(res)
					} catch (error: any) {
						// post service error show in local modal component rows errors
						console.log(error)
					}
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
			console.log('job finish')
		}
	}

	const handleDownloadTemplate = async (type: string) => {
		try {
			let res
			if (type === 'csv') {
				res = await um.getTemplateCSVUM()
				const a = document.createElement('a')
				a.download = 'users_data_csv.' + type
				a.href = window.URL.createObjectURL(res.data) // blob return from res
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
				a.href = window.URL.createObjectURL(res.data) // blob return from res
				const clickEvt = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: true,
				})
				a.dispatchEvent(clickEvt)
				a.remove()
			}
		} catch (error: any) {
			console.log(error)
		}
	}

	const handleRemoveFile = () => {
		setImportFile(undefined)
	}

	const handleCloseImport = (event: any, reason: string) => {
		if (reason === 'backdropClick' && isLoading) {
			return
		}
		setImportFile(undefined)
		onClose()
	}

	return (
		<div className='flex flex-col'>
			<Dialog
				open={open}
				onClose={handleCloseImport}
				component='form'
				onSubmit={() => {}}
				fullWidth
				keepMounted={false}
			>
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
							<Box>
								{uploadFileError.message !== '' && <Typography></Typography>}
								<Typography>นำเข้าผู้ใช้งาน</Typography>
								<Button
									component='label'
									role={undefined}
									variant='contained'
									tabIndex={-1}
									className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black text-white [&_.MuiButton-startIcon]:m-0'
									startIcon={<Icon path={mdiTrayArrowUp} size={1} />}
								>
									อัปโหลดไฟล์
									<input
										type='file'
										accept='.csv, .xlsx, .xls'
										className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
										onChange={handleFileChange}
									/>
								</Button>
							</Box>
						)}
						<Typography>ตัวอย่างเอกสารผู้ใช้งาน</Typography>
						<Box>
							<Button
								component='label'
								role={undefined}
								variant='outlined'
								tabIndex={-1}
								className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
								onClick={() => {
									handleDownloadTemplate('csv')
								}}
								startIcon={<Icon path={mdiTrayArrowDown} size={1} />}
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
								startIcon={<Icon path={mdiTrayArrowDown} size={1} />}
							>
								ดาวน์โหลด Template excel
							</Button>
						</Box>
					</Box>
				</DialogContent>
				{importFile && (
					<DialogActions className={'flex justify-end p-6'}>
						<div className={'flex justify-end space-x-2'}>
							<Button
								className='h-[40px] w-[71px] bg-white text-sm text-black'
								variant='contained'
								onClick={(event) => {
									handleCloseImport(event, 'cancelClick')
								}}
								disabled={isLoading}
							>
								{t('cancel')}
							</Button>
							<LoadingButton
								fullWidth
								loading={isLoading}
								loadingPosition='start'
								startIcon={<CircularProgress size={1} />}
								variant='contained'
								color='primary'
								className='h-[40px] w-[71px] text-sm [&_.MuiButton-startIcon]:m-0 [&_.MuiButtonBase-root]:w-[100px]'
								onClick={handleConfirmImport}
								disabled={isLoading}
							>
								<span> {t('confirm')}</span>
							</LoadingButton>
						</div>
					</DialogActions>
				)}
			</Dialog>
		</div>
	)
}
