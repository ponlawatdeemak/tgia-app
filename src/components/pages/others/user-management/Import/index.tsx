import um from '@/api/um'
import { Language } from '@/enum'
import { useSwitchLanguage } from '@/i18n/client'
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Input,
	Snackbar,
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
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import {
	PostImportCSVErrorDtoOut,
	PostImportCSVUMDtoOut,
	PostImportErrorDtoOut,
	PostImportXLSXErrorDtoOut,
} from '@/api/um/dto-out.dto'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import CloseIcon from '@mui/icons-material/Close'
import { mdiCloseCircleOutline } from '@mdi/js'

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
	const [isLoading, setIsLoading] = React.useState<boolean>(false)
	const [isOpenConfirmModal, setIsOpenConfirmModal] = React.useState<boolean>(false)
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [importError, setImportError] = React.useState<(PostImportCSVErrorDtoOut | PostImportXLSXErrorDtoOut)[]>([])

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const importFile = event.target.files?.[0]
		if (importFile) {
			const fileType = importFile.type
			const fileSize = importFile.size
			const validFileTypes = [
				'text/csv',
				'text/xlsx',
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			]
			console.log(importFile)
			if (validFileTypes.includes(fileType) && fileSize <= maxFileSize) {
				setImportFile(importFile)
			} else {
				// handle wrong type + emax size exceed
				// notification lower left side error
				if (!validFileTypes.includes(fileType)) {
					// invalid file type
					setAlertInfo({ open: true, severity: 'error', message: t('error.invalidFileType', { ns: 'um' }) })
				} else if (fileSize > maxFileSize) {
					// limit exceed
					setAlertInfo({
						open: true,
						severity: 'error',
						message: t('error.fileSizeLimitExceed', { ns: 'um' }),
					})
				} else {
					// something wrong
					setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
				}
			}
		} else {
			// no file
			setImportFile(undefined)
			// notification lower left side error
			setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
		}
	}

	const handleConfirmImport = async () => {
		// event.preventDefault()
		try {
			setImportError([])
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
						const data: PostImportCSVErrorDtoOut[] = error.data
						console.log(data)
						setImportError(data)
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
						const data: PostImportXLSXErrorDtoOut[] = error.data
						setImportError(data)
					}
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleDownloadTemplate = async (type: string) => {
		try {
			let res
			if (type === 'csv') {
				res = await um.getTemplateCSVUM()
				console.log(res)
				const a = document.createElement('a')
				a.download = 'users_data_csv.' + type
				a.href = window.URL.createObjectURL(res) // blob return from res
				const clickEvt = new MouseEvent('click', {
					view: window,
					bubbles: true,
					cancelable: true,
				})
				a.dispatchEvent(clickEvt)
				a.remove()
			} else {
				res = await um.getTemplateXLSXUM()
				console.log(res)
				const a = document.createElement('a')
				a.download = 'users_data_excel.' + type
				a.href = window.URL.createObjectURL(res) // blob return from res
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
			setAlertInfo({ open: true, severity: 'error', message: t('error.somethingWrong') })
		}
	}

	const handleRemoveFile = () => {
		setImportError([])
		setImportFile(undefined)
	}

	const handleCloseImport = (event: any, reason: string) => {
		if (reason === 'backdropClick' && isLoading) {
			return
		}
		onClose()
		setImportError([])
		setImportFile(undefined)
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
				<Box className='flex flex-row items-center justify-between'>
					<DialogTitle>นำเข้าผู้ใช้งาน</DialogTitle>
					<IconButton
						onClick={(event) => {
							handleCloseImport(event, 'cancelClick')
						}}
						className='mr-2 p-2'
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<DialogContent dividers={true} className='flex flex-col items-center justify-between max-lg:gap-3'>
					<Box className='ml-[24px] mr-[24px] flex w-full flex-col items-center bg-gray-light2'>
						<Typography>นำเข้าผู้ใช้งาน</Typography>
						{importFile ? (
							<Box className='flex flex-col'>
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
								{importError.length > 0 && (
									<Box className='rounded bg-error-light'>
										<div className='flex flex-row items-center gap-1 text-error'>
											<Icon path={mdiCloseCircleOutline} size={1} />
											<Typography>ข้อมูลในเอกสารไม่ถูกต้อง</Typography>
										</div>
										{importError.map((error) => {
											if (error.success === false) {
												return (
													<p className='p-1'>
														{error.rowNo} :{error.result}
													</p>
												)
											}
										})}
									</Box>
								)}
							</Box>
						) : (
							<Box className='flex flex-col'>
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
										value={importFile}
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
								className='flex h-[32px] gap-[4px] border-gray bg-white py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
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
								className='flex h-[32px] gap-[4px] border-gray bg-white py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
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
								onClick={() => {
									setIsOpenConfirmModal(true)
								}}
								disabled={isLoading}
							>
								<span> {t('confirm')}</span>
							</LoadingButton>
						</div>
					</DialogActions>
				)}
			</Dialog>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				className='w-[300px]'
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					className='w-full'
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
			<AlertConfirm
				open={isOpenConfirmModal}
				title={'ยืนยันการบันทึกข้อมูล'} // t('confirmImport', { ns : 'um'})
				content={'ต้องการยืนยันการนำเข้าผู้ใช้งานใช่หรือไม่?'} //t('confirmImport', {ns : 'um'})
				onClose={() => {
					setIsOpenConfirmModal(false)
				}}
				onConfirm={() => {
					handleConfirmImport()
					setIsOpenConfirmModal(false)
				}}
			/>
		</div>
	)
}
