import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from '@mui/material'
import React, { FormEvent, useState, useCallback, useEffect } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import IOSSwitch from '@/components/common/switch/IOSSwitch'
import ProfileForm from '@/components/shared/ProfileForm'
import { AlertInfoType, FormValues } from '@/components/shared/ProfileForm/interface'
import { useFormik } from 'formik'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'
import { useSession } from 'next-auth/react'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import { DeleteProfileDtoIn } from '@/api/um/dto-in.dto'
import um from '@/api/um'


export interface UserManagementProps {
	open: boolean
	onClose: () => void
	onSubmitUser: (event: FormEvent) => void
	userId: string
	isEdit: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	setIsSearch: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultFormValues: FormValues = {
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
}

export const FormMain: React.FC<UserManagementProps> = ({ ...props }) => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	const [isUserActive, setIsUserActive] = useState<boolean>(false)
	const [isConfirmAddOpen, setIsConfirmAddOpen] = useState<boolean>(false)
	const [isConfirmEditOpen, setIsConfirmEditOpen] = useState<boolean>(false)
	const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)
	const [alertInfo, setAlertInfo] = React.useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const { data: session } = useSession()
	const handleSubmitUser = async (event: FormEvent) => {
		event.preventDefault()
		props.isEdit ? setIsConfirmEditOpen(true) : setIsConfirmAddOpen(true)
	}

	const validationSchema = yup.object({
		firstName: yup.string().required(t('warning.inputFirstName')),
		lastName: yup.string().required(t('warning.inputLastName')),
		email: yup.string().email(t('warning.invalidEmailFormat')).required(t('warning.inputEmail')),
		responsibleProvinceCode: yup.string().required(t('warning.inputProvince')),
	})

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile', props.userId],
		queryFn: () =>
			service.um.getUM({
				userId: props.userId,
			}),
	})

	useEffect(() => {
		setIsUserActive(userData?.data?.flagStatus === 'A' ? true : false)
	}, [userData])

	useEffect(() => {
		formik.setFieldValue('flagStatus', isUserActive ? 'A' : 'C')
	}, [isUserActive])

	const onDelete = useCallback(async (userId: string) => {
		try {
			// filter out current session userid
			if (userId === session?.user.id) {
				return
			}
			const payload: DeleteProfileDtoIn = { id: userId }
			const res = await um.deleteProfile(payload)
			props.setIsSearch(true)
			setAlertInfo({ open: true, severity: 'success', message: t('profileDelete', { ns: 'um' }) })
		} catch (error: any) {
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : t('error.somethingWrong'),
			})
		}
	}, [props, session?.user.id,t])

	const onSubmit = useCallback(async (values: FormValues) => {
		try {
			console.log(values)
			// setBusy(true)
			// if (values.image instanceof File) {
			// 	const selectedImage: CreateProfileImageDtoIn = {
			// 		file: values.image,
			// 	}
			// 	let imageUrl
			// 	try {
			// 		imageUrl = await service.um.uploadImg(selectedImage)
			// 	} catch (error) {
			// 		throw new Error('Image upload failed')
			// 	}
			// 	values.image = imageUrl.data?.download_file_url || ''
			// }
			// const profileData: PutProfileDtoIn = {
			// 	id: values.id,
			// 	firstName: values.firstName,
			// 	lastName: values.lastName,
			// 	email: values.email,
			// 	image: values.image,
			// 	responsibleProvinceCode: values.responsibleProvinceCode,
			// 	responsibleDistrictCode: values.responsibleDistrictCode,
			// }
			// try {
			// 	await mutateUpdateProfile(profileData)
			// } catch (error) {
			// 	throw new Error('Profile update failed')
			// }
			// let userImage
			// try {
			// 	userImage = (await service.um.getProfile()).data?.image
			// } catch (error) {
			// 	throw new Error('Access Profile failed')
			// }
			// // ใช้ update ค่า data จาก useSession
			// try {
			// 	await update({
			// 		firstName: profileData.firstName,
			// 		lastName: profileData.lastName,
			// 		email: profileData.email,
			// 		image: userImage,
			// 		responsibleProvinceCode: profileData.responsibleProvinceCode,
			// 		responsibleDistrictCode: profileData.responsibleDistrictCode,
			// 	})
			// } catch (error) {
			// 	throw new Error('Failed to update session')
			// }
			// setAlertInfo({ open: true, severity: 'success', message: 'แก้ไขข้อมูลส่วนตัวสำเร็จ' })
		} catch (error: any) {
			// console.log('Error:', error.message)
			// setAlertInfo({ open: true, severity: 'error', message: 'แก้ไขข้อมูลส่วนตัวไม่สำเร็จ' })
		} finally {
			// setBusy(false)
		}
	}, [])

	// const logout = useCallback(() => signOut({ callbackUrl: AppPath.Login }), [])

	const formik = useFormik<FormValues>({
		enableReinitialize: true,
		initialValues: userData?.data || defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	return (
		<div className='flex flex-col'>
			<Dialog
				open={props.open}
				onClose={props.onClose}
				component='form'
				onSubmit={handleSubmitUser}
				fullWidth
				scroll='paper'
			>
				<DialogTitle>
					{props.isEdit ? t('editUserAccount', { ns: 'um' }) : t('addUser', { ns: 'um' })}
				</DialogTitle>
				<DialogContent className='h-[492px]' dividers={true}>
					{/* override class from parent */}
					<ProfileForm formik={formik}></ProfileForm>
					{session?.user.id !== props.userId && (
						<FormControlLabel
							control={
								<IOSSwitch
									sx={{ m: 1 }}
									checked={isUserActive}
									onChange={() => {
										setIsUserActive(!isUserActive)
									}}
								/>
							}
							label={t('enableUser', { ns: 'um' })}
						/>
					)}
				</DialogContent>
				<DialogActions className='p-6'>
					{session?.user.id !== props.userId && (
						<Button
							className='text-red bg-white text-sm text-[#D13438]'
							variant='contained'
							onClick={() => {
								setIsConfirmDeleteOpen(true)
							}}
						>
							ลบผู้ใช้งาน
						</Button>
					)}
					<Button className='bg-white text-sm text-black' variant='contained' onClick={props.onClose}>
						ยกเลิก
					</Button>
					<Button type='submit' variant='contained' color='primary'>
						บันทึก
					</Button>
				</DialogActions>
			</Dialog>
			{/* Alert Confirm Add New */}
			<AlertConfirm
				open={isConfirmAddOpen}
				title={t('alert.enableUserProfile', { ns: 'um' })}
				content={t('alert.confirmEnableUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmAddOpen(false)
				}}
				onConfirm={() => {
					console.log('Confirm Add')
					onSubmit(formik.values)
					setIsConfirmAddOpen(false)
				}}
			/>
			{/* Alert Confirm Edit Existing */}
			<AlertConfirm
				open={isConfirmEditOpen}
				title={t('alert.disableUserProfile', { ns: 'um' })}
				content={t('alert.confirmDisableUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmEditOpen(false)
				}}
				onConfirm={() => {
					console.log('Confirm Edit')
					onSubmit(formik.values)
					setIsConfirmEditOpen(false)
				}}
			/>
			{/* Alert Confirm DeleteOne */}
			<AlertConfirm
				open={isConfirmDeleteOpen}
				title={t('alert.deleteUserProfile', { ns: 'um' })}
				content={t('alert.confirmDeleteUserProfile', { ns: 'um' })}
				onClose={() => {
					setIsConfirmDeleteOpen(false)
				}}
				onConfirm={() => {
					onDelete(props.userId)
					setIsConfirmDeleteOpen(false)
					props.setOpen(false)
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
