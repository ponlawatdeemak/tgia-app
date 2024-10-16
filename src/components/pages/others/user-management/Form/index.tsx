import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
	FormControlLabel,
	CircularProgress,
} from '@mui/material'
import React, { FormEvent, useState, useCallback, useEffect } from 'react'
import IOSSwitch from '@/components/common/switch/IOSSwitch'
import ProfileForm from '@/components/shared/ProfileForm'
import { AlertInfoType, FormValues } from '@/components/shared/ProfileForm/interface'
import { useFormik } from 'formik'
import service from '@/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'
import { useSession } from 'next-auth/react'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import { DeleteProfileDtoIn, PostProfileUMDtoIn, PostUploadFilesDtoIn, PutProfileUMDtoIn } from '@/api/um/dto-in.dto'
import um from '@/api/um'
import Icon from '@mdi/react'
import { mdiTrashCanOutline } from '@mdi/js'
import useResponsive from '@/hook/responsive'
import classNames from 'classnames'
import LoadingButton from '@mui/lab/LoadingButton'

export interface UserManagementProps {
	open: boolean
	onClose: () => void
	userId: string
	isEdit: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}

interface UMFormValues extends FormValues {
	flagStatus: string
}

const defaultFormValues: UMFormValues = {
	id: '',
	username: '',
	firstName: '',
	lastName: '',
	email: '',
	image: '',
	orgCode: '',
	role: '',
	responsibleProvinceCode: '',
	responsibleDistrictCode: '',
	flagStatus: 'A',
}

export const FormMain: React.FC<UserManagementProps> = ({ ...props }) => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const { open, onClose, userId, isEdit, setOpen, setIsSearch } = props
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const [isConfirmAddOpen, setIsConfirmAddOpen] = useState<boolean>(false)
	const [isConfirmEditOpen, setIsConfirmEditOpen] = useState<boolean>(false)
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const { data: session, update } = useSession()
	const { isDesktop } = useResponsive()
	const queryClient = useQueryClient()

	const handleSubmitUser = async (event: FormEvent) => {
		event.preventDefault()
		formik.validateForm().then((errors) => {
			if (Object.keys(errors).length === 0) {
				isEdit ? setIsConfirmEditOpen(true) : setIsConfirmAddOpen(true)
			} else {
				formik.handleSubmit()
			}
		})
		// isEdit ? setIsConfirmEditOpen(true) : setIsConfirmAddOpen(true)
	}

	const validationSchema = yup.object({
		firstName: yup.string().required(t('warning.inputFirstName')),
		lastName: yup.string().required(t('warning.inputLastName')),
		email: yup.string().email(t('warning.invalidEmailFormat')).required(t('warning.inputEmail')),
		responsibleProvinceCode: yup.string().required(t('warning.inputProvince')),
		orgCode: yup.string().required(t('warning.inputOrgCode')),
		role: yup.string().required(t('warning.inputRole')),
	})
	const {
		data: userData,
		isLoading: isUserDataLoading,
		error: getUMError,
	} = useQuery({
		queryKey: ['getUM', userId],
		queryFn: async () => {
			const res = await service.um.getUM({
				userId: props.userId,
			})
			return res
		},
		enabled: !!userId,
	})

	const {
		data: putProfileUMData,
		error: putProfileUMError,
		mutateAsync: mutatePutProfileUM,
		isPending: isPutProfileUMPending,
	} = useMutation({
		mutationFn: async (payload: PutProfileUMDtoIn) => {
			const res = await um.putProfileUM(payload)
			queryClient.invalidateQueries({ queryKey: ['getUM', userId] })
			return res
		},
	})

	const {
		data: postProfileUMData,
		error: postProfileUMError,
		mutateAsync: mutatePostProfileUM,
		isPending: isPostProfileUMPending,
	} = useMutation({
		mutationFn: async (payload: PostProfileUMDtoIn) => {
			return await um.postProfileUM(payload)
		},
	})

	const onDelete = useCallback(
		async (userId: string) => {
			try {
				// filter out current session userid
				if (userId === session?.user.id) {
					return
				}
				const payload: DeleteProfileDtoIn = { id: userId }
				const res = await um.deleteProfile(payload)
				setIsSearch(true)
				setAlertInfo({ open: true, severity: 'success', message: t('profileDeleteSuccess', { ns: 'um' }) })
				setOpen(false)
			} catch (error: any) {
				setAlertInfo({
					open: true,
					severity: 'error',
					message: error?.title ? error.title : t('profileDeleteFail', { ns: 'um' }),
				})
			}
		},
		[session?.user.id, t, setIsSearch, setOpen],
	)

	const onSubmit = useCallback(
		async (values: UMFormValues) => {
			try {
				// images is newly added
				if (values.image instanceof File) {
					// New image uploaded
					const imagePayload: PostUploadFilesDtoIn = {
						file: values.image,
					}
					const res = await um.postUploadFiles(imagePayload)
					values.image = res.data?.download_file_url || ''
				}
				if (isEdit) {
					// put method edit existing user
					try {
						const payload: PutProfileUMDtoIn = {
							id: values.id,
							username: values.username,
							firstName: values.firstName,
							lastName: values.lastName,
							email: values.email,
							image: values.image,
							orgCode: values.orgCode,
							role: values.role,
							responsibleProvinceCode: values.responsibleProvinceCode,
							responsibleDistrictCode: values.responsibleDistrictCode,
							flagStatus: values.flagStatus,
						}
						const res = await mutatePutProfileUM(payload)
						// update session on userId
						if (session?.user.id === values.id) {
							let userImage
							try {
								userImage = (await service.um.getProfile()).data?.image
							} catch (error) {
								throw new Error('Access Profile failed')
							}
							// ใช้ update ค่า data จาก useSession
							try {
								await update({
									firstName: payload.firstName,
									lastName: payload.lastName,
									email: payload.email,
									image: userImage,
									responsibleProvinceCode: payload.responsibleProvinceCode,
									responsibleDistrictCode: payload.responsibleDistrictCode,
								})
							} catch (error) {
								throw new Error('Failed to update session')
							}
						}
						setAlertInfo({
							open: true,
							severity: 'success',
							message: t('profileUpdateSuccess', { ns: 'um' }),
						})
						setIsSearch(true)
						setOpen(false)
						formik.resetForm()
					} catch (error: any) {
						console.log(error)
						setAlertInfo({
							open: true,
							severity: 'error',
							message: error?.title ? error.title : t('profileUpdateFail', { ns: 'um' }),
						})
					}
				} else {
					// post method add new user
					try {
						const payload: PostProfileUMDtoIn = {
							username: values.username,
							firstName: values.firstName,
							lastName: values.lastName,
							email: values.email,
							image: values.image,
							orgCode: values.orgCode,
							role: values.role,
							responsibleProvinceCode: values.responsibleProvinceCode,
							responsibleDistrictCode: values.responsibleDistrictCode,
							flagStatus: values.flagStatus,
						}
						const res = await mutatePostProfileUM(payload)
						setAlertInfo({
							open: true,
							severity: 'success',
							message: t('profileAddSuccess', { ns: 'um' }),
						})
						setIsSearch(true)
						setOpen(false)
						formik.resetForm()
					} catch (error: any) {
						console.log(error)
						setAlertInfo({
							open: true,
							severity: 'error',
							message: error?.title ? error.title : t('profileAddFail', { ns: 'um' }),
						})
					}
				}
			} catch (error: any) {
				console.log(error)
				setAlertInfo({
					open: true,
					severity: 'error',
					message: error?.title ? error.title : t('error.somethingWrong'),
				})
			}
		},
		[mutatePostProfileUM, mutatePutProfileUM, t, isEdit, session?.user.id, setIsSearch, setOpen, update],
	)

	const handleOnClose = useCallback(
		(event: any, reason: string) => {
			if (reason === 'backdropClick') {
				return
			}
			// formik.resetForm()
			// onClose()
			setOpen(false)
		},
		[onClose],
	)

	useEffect(() => {
		if (open) {
			// queryClient.invalidateQueries({ queryKey: ['getUM', userId] })
			formik.resetForm()
		}
	}, [open])

	const formik = useFormik<UMFormValues>({
		enableReinitialize: true,
		initialValues: userData?.data || defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})
	return (
		<div className='flex flex-col'>
			<Dialog
				open={open}
				onClose={handleOnClose}
				component='form'
				// onSubmit={handleSubmitUser}
				fullWidth
				scroll='paper'
				className={classNames('[&_.MuiPaper-root]:h-[636px] [&_.MuiPaper-root]:max-w-[700px]', {
					'': !isDesktop,
				})}
			>
				<DialogTitle>{isEdit ? t('editUserAccount', { ns: 'um' }) : t('addUser', { ns: 'um' })}</DialogTitle>
				<DialogContent dividers={true} className='flex flex-col justify-between max-lg:gap-3'>
					<div className='flex flex-col items-center gap-3 max-lg:block lg:flex-row'>
						<ProfileForm
							formik={formik}
							loading={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
							isFormUM={true}
							isEditFormUM={isEdit}
							isDisabledProfile={userId === session?.user.id}
						/>
					</div>
					{session?.user.id !== userId && (
						<FormControlLabel
							sx={{
								pointerEvents: 'none',
								margin: 0,
							}}
							className='max-lg:pt-1'
							control={
								<div className='pointer-events-auto'>
									<IOSSwitch
										className='m-0 mr-2 [&_.Mui-checked+.MuiSwitch-track]:bg-[#0C626D]'
										checked={formik.values.flagStatus === 'A' ? true : false}
										onChange={(event) => {
											formik.setFieldValue('flagStatus', event.target.checked ? 'A' : 'C')
										}}
									/>
								</div>
							}
							label={t('enableUser', { ns: 'um' })}
						/>
					)}
				</DialogContent>
				<DialogActions
					className={classNames('flex justify-between p-6', {
						'': isEdit || session?.user.id === userId,
					})}
				>
					{session?.user.id !== userId && isEdit && (
						<Button
							className='text-red h-[40px] w-[136px] bg-white text-sm text-error'
							variant='contained'
							onClick={() => {
								setIsConfirmDeleteOpen(true)
							}}
							startIcon={<Icon path={mdiTrashCanOutline} size={1} color={'var(--error-color-1)'} />}
							disabled={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
						>
							{t('deleteUser', { ns: 'um' })}
						</Button>
					)}
					<div className='flex-1' />
					<div
						className={classNames('flex justify-end space-x-2', {
							'': isEdit || session?.user.id === userId,
						})}
					>
						<Button
							className='h-[40px] w-[71px] bg-white text-sm text-black'
							variant='contained'
							onClick={(e) => handleOnClose(e, '')}
							disabled={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
						>
							{t('cancel')}
						</Button>
						<Button
							className='h-[40px] w-[71px] px-[16px] py-[8px] text-base text-sm font-semibold'
							variant='contained'
							onClick={handleSubmitUser}
							color='primary'
							disabled={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
							startIcon={
								isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading ? (
									<CircularProgress
										className='[&_.MuiCircularProgress-circle]:text-[#00000042]'
										size={16}
									/>
								) : null
							}
						>
							{t('save', { ns: 'um' })}
						</Button>
						{/* <LoadingButton
							fullWidth
							loading={isPostProfileUMPending || isPutProfileUMPending || isUserDataLoading}
							loadingPosition='start'
							startIcon={<CircularProgress size={0} />}
							variant='contained'
							// type='submit'
							onClick={handleSubmitUser}
							className='h-[40px] w-[71px] text-sm [&_.MuiButton-startIcon]:m-0 [&_.MuiButtonBase-root]:w-[71px]'
						>
							<span>{t('save', { ns: 'um' })}</span>
						</LoadingButton> */}
					</div>
				</DialogActions>
			</Dialog>
			{/* Alert Confirm Add New */}
			<AlertConfirm
				open={isConfirmAddOpen}
				title={t('addUser', { ns: 'um' })}
				content={t('alert.confirmAddUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmAddOpen(false)
				}}
				onConfirm={() => {
					formik.handleSubmit()
					// onSubmit(formik.values)
					setIsConfirmAddOpen(false)
				}}
			/>
			{/* Alert Confirm Edit Existing */}
			<AlertConfirm
				open={isConfirmEditOpen}
				title={t('editUserAccount', { ns: 'um' })}
				content={t('alert.confirmEditUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmEditOpen(false)
				}}
				onConfirm={() => {
					formik.handleSubmit()
					// onSubmit(formik.values)
					setIsConfirmEditOpen(false)
				}}
			/>
			{/* Alert Confirm DeleteOne */}
			<AlertConfirm
				open={isConfirmDeleteOpen}
				title={t('deleteUser', { ns: 'um' })}
				content={t('alert.confirmDeleteUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmDeleteOpen(false)
				}}
				onConfirm={() => {
					onDelete(userId)
					setIsConfirmDeleteOpen(false)
				}}
			/>

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
		</div>
	)
}
