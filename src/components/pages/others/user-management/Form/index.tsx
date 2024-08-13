import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { FormEvent, useState, useCallback } from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import IOSSwitch from '@/components/common/switch/IOSSwitch'
import ProfileForm from '@/components/shared/ProfileForm'
import { FormValues } from '@/components/shared/ProfileForm/interface'
import { useFormik } from 'formik'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'
import { Language } from '@/enum'

export interface UserManagementProps {
	open: boolean
	onClose: () => void
	onSubmitUser: (event: FormEvent) => void
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
	const { t, i18n } = useTranslation(['default','um'])
	const { i18n: i18nWithCookie } = useSwitchLanguage(i18n.language as Language, 'appbar')

	const handleSubmitUser = async (event: FormEvent) => {
		console.log('Form submitted')
		// Add your form submission logic here
	}

	const validationSchema = yup.object({
		firstName: yup.string().required(t('warning.inputFirstName')),
		lastName: yup.string().required(t('warning.inputLastName')),
		email: yup.string().email(t('warning.invalidEmailFormat')).required(t('warning.inputEmail')),
		responsibleProvinceCode: yup.string().required(t('warning.inputProvince')),
	})

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile'],
		queryFn: () => service.um.getProfile(),
	})

	const onSubmit = useCallback(async (values: FormValues) => {
		try {
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
				<DialogTitle>{t('addUser', {ns : 'um'})}</DialogTitle>
				<DialogContent className='h-[492px]' dividers={true}>
					<ProfileForm formik={formik}></ProfileForm>

					<FormControlLabel control={<IOSSwitch sx={{ m: 1 }} defaultChecked />} label='iOS style' />
				</DialogContent>
				<DialogActions className='p-6'>
					<Button
						className='text-red bg-white text-sm text-[#D13438]'
						variant='contained'
						onClick={() => {
							console.log('ลบผู้ใช้งาน')
						}}
					>
						ลบผู้ใช้งาน
					</Button>
					<Button className='bg-white text-sm text-black' variant='contained' onClick={props.onClose}>
						ยกเลิก
					</Button>
					<Button type='submit' variant='contained' color='primary'>
						บันทึก
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
