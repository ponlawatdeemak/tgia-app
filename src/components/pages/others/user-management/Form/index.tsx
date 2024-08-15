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
import { DeleteProfileDtoIn, PostProfileUMDtoIn, PostUploadFilesDtoIn, PutProfileUMDtoIn } from '@/api/um/dto-in.dto'
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
	flagStatus: '',
}

export const FormMain: React.FC<UserManagementProps> = ({ ...props }) => {
	const { t, i18n } = useTranslation(['default', 'um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')
	// const [isUserActive, setIsUserActive] = useState<boolean>(false)
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
		queryFn: async () => {
			const res = await service.um.getUM({
				userId: props.userId,
			})
			console.log(res.data)
			return res
		},
		enabled: !!props.userId,
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
				props.setIsSearch(true)
				setAlertInfo({ open: true, severity: 'success', message: t('profileDelete', { ns: 'um' }) })
			} catch (error: any) {
				setAlertInfo({
					open: true,
					severity: 'error',
					message: error?.title ? error.title : t('error.somethingWrong'),
				})
			}
		},
		[props, session?.user.id, t],
	)

	const onSubmit = useCallback(async (values: UMFormValues) => {
		try {
			try {
				// images is newly added
				let imageUrl
				if (values.image instanceof File) {
					// New image uploaded
					const imagePayload: PostUploadFilesDtoIn = {
						file: values.image,
					}
					const res = await um.postUploadFiles(imagePayload)
					imageUrl = res.data?.download_file_url
				}
				if (imageUrl) {
					console.log('new image uploaded')
					values.image = imageUrl
				} else {
					console.log('no image uploaded or already existing image')
					values.image = ""
				}
				if (props.isEdit) {
					// put method edit existing user
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
					console.log("Editing user :: ",payload)
					const res = await um.putProfileUM(payload)
					console.log("res :: ",res)
					props.setIsSearch(true)
				} else {
					// post method add new user
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
					console.log("Adding new user :: ", payload)
					const res = await um.postProfileUM(payload)
					console.log("res :: ",res)
					props.setIsSearch(true)
				}
			} catch (error) {
				console.log(error)
				setAlertInfo({
					open: true,
					severity: 'error',
					message: t('error.somethingWrong'),
				})
			}
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

	const formik = useFormik<UMFormValues>({
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
									checked={formik.values.flagStatus === 'A' ? true : false}
									onChange={(event) => {
										formik.setFieldValue('flagStatus', event.target.checked ? 'A' : 'C')
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
				title={t('addUser', { ns: 'um' })}
				content={t('alert.confirmAddUserProfile', { ns: 'um' })}
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
				title={t('editUserAccount', { ns: 'um' })}
				content={t('alert.confirmEditUserProfile', { ns: 'um' })}
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
				title={t('deleteUser', { ns: 'um' })}
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
