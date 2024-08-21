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
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
	const queryClient = useQueryClient()

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
						setAlertInfo({
							open: true,
							severity: 'success',
							message: t('successImport', { ns: 'um' }),
						})
						setIsSearch(true)
						queryClient.invalidateQueries({ queryKey: ['getSearchUM'] })
						handleCloseImport(null, 'importFinish')
					} catch (error: any) {
						// post service error show in local modal component rows errors
						console.log(error)
						const data: PostImportCSVErrorDtoOut[] = error.data
						setImportFile(undefined)
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
						setAlertInfo({
							open: true,
							severity: 'success',
							message: t('successImport', { ns: 'um' }),
						})
						setIsSearch(true)
						queryClient.invalidateQueries({ queryKey: ['getSearchUM'] })
						handleCloseImport(null, 'importFinish')
					} catch (error: any) {
						// post service error show in local modal component rows errors
						console.log(error)
						const data: PostImportXLSXErrorDtoOut[] = error.data
						setImportFile(undefined)
						setImportError(data)
					}
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsSearch(true)
			queryClient.invalidateQueries({ queryKey: ['getSearchUM'] })
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
				scroll='paper'
				className='[&_.MuiPaper-root]:h-[460px] [&_.MuiPaper-root]:max-w-[600px]'
			>
				<Box className='flex flex-row items-center justify-between'>
					<DialogTitle className='text-lg'>{t('importUser', { ns: 'um' })}</DialogTitle>
					<IconButton
						onClick={(event) => {
							handleCloseImport(event, 'cancelClick')
						}}
						className='mr-2 p-2'
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<DialogContent
					dividers={true}
					className='flex h-full flex-col items-center justify-between overflow-x-hidden max-lg:gap-3'
				>
					<Box
						className={`ml-[24px] mr-[24px] flex w-full flex-col items-center bg-gray-light2 ${!(importError.length > 0) && 'h-full'} ${importFile && 'h-full'}`}
					>
						<Box className='flex min-h-[200px] flex-col items-center justify-center gap-2 p-4'>
							<Typography className='text-base font-medium'>{t('importUser', { ns: 'um' })}</Typography>
							{importFile ? (
								<Box className='flex flex-col items-center'>
									{/* <Button
										endIcon={
											<IconButton disableRipple onClick={handleRemoveFile}>
												<ClearIcon />
											</IconButton>
										}
										variant='outlined'
										disableElevation
										className='h-[40px]'
									>
										{importFile.name}
									</Button> */}
									<Box className='flex flex-row items-center rounded-lg border-solid border-gray bg-background p-1'>
										<Typography className='p-[4px] text-base font-semibold'>
											{importFile.name}
										</Typography>
										<IconButton
											disableRipple
											onClick={handleRemoveFile}
											className='p-[4px]'
											size='small'
										>
											<ClearIcon />
										</IconButton>
									</Box>
								</Box>
							) : (
								<Box className='flex flex-col items-center gap-2'>
									<Button
										component='label'
										role={undefined}
										variant='contained'
										tabIndex={-1}
										className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black text-white [&_.MuiButton-startIcon]:m-0'
										startIcon={<Icon path={mdiTrayArrowUp} size={1} />}
									>
										{t('uploadFile', { ns: 'um' })}
										<input
											type='file'
											accept='.csv, .xlsx, .xls'
											className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
											onChange={handleFileChange}
											value={importFile}
										/>
									</Button>
									{importError.length > 0 && (
										<Box className='flex flex-col rounded-lg border-solid border-error bg-white p-4'>
											<div className='flex flex-row items-center gap-1 text-error'>
												<Icon path={mdiCloseCircleOutline} size={1} />
												<Typography>{t('fileDataError', { ns: 'um' })}</Typography>
											</div>
											<div className='divide-x-0 divide-y divide-solid divide-gray'>
												{importError.map((error) => {
													if (error.success === false) {
														return (
															// <div key={error.firstName}>
															// 	<p key={error.firstName}>
															// 		{error.rowNo} :{error.result}
															// 	</p>
															// </div>
															<div
																className='flex items-center justify-between p-2'
																key={error.firstName}
															>
																<div className='mr-[16px] w-12 text-left'>
																	{error.rowNo}
																</div>
																<div className='flex-shrink flex-grow basis-0'>
																	:{error.result}
																</div>
															</div>
														)
													}
												})}
											</div>
										</Box>
									)}
								</Box>
							)}
						</Box>
						{!importFile && (
							<Box className='flex w-[90%] flex-col items-center justify-center gap-2 border-x-0 border-y-0 border-t border-solid border-gray p-4'>
								<Typography className='text-base font-medium'>
									{t('userDocExample', { ns: 'um' })}
								</Typography>
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
									{t('downloadTemplate', { ns: 'um' })} csv
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
									{t('downloadTemplate', { ns: 'um' })} excel
								</Button>
							</Box>
						)}
					</Box>
				</DialogContent>
				{importFile && (
					<DialogActions className={'flex justify-end p-4'}>
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
				title={t('alert.importUserFile', { ns: 'um' })} // t('confirmImport', { ns : 'um'})
				content={t('alert.confirmImportUserFile', { ns: 'um' })} //t('confirmImport', {ns : 'um'})
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
