'use client'

import service from '@/api'
import { CreateProfileImageDtoIn, PutProfileDtoIn } from '@/api/dto/um/dto-in.dto'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import FormInput from '@/components/common/input/FormInput'
import UploadImage from '@/components/common/upload/UploadImage'
import { AppPath } from '@/config/app'
import { mdiLockReset } from '@mdi/js'
import Icon from '@mdi/react'
import { Alert, Box, Button, CircularProgress, Snackbar } from '@mui/material'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import * as yup from 'yup'

interface AlertInfoType {
	open: boolean
	severity: 'success' | 'error'
	message: string
}

interface FormValues {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	image: File | string
	orgCode: string
	role: string
	responsibleProvinceCode: string
	responsibleDistrictCode: string
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

// const validationSchema = yup.object({
// 	firstName: yup.string().required('กรุณากรอกชื่อ'),
// 	lastName: yup.string().required('กรุณากรอกนามสกุล'),
// 	email: yup.string().email('กรุณากรอกอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมล'),
// 	responsibleProvinceCode: yup.string().required('กรุณาเลือกจังหวัด'),
// })

interface ProfileMainProps extends WithTranslation {}

const ProfileMain: React.FC<ProfileMainProps> = ({ t, i18n }) => {
	const router = useRouter()
	const queryClient = new QueryClient()
	const { data: session, update } = useSession()
	const [busy, setBusy] = useState<boolean>(false)
	const [confirmOpenDialog, setConfirmOpenDialog] = useState<boolean>(false)
	const [logoutOpenDialog, setLogoutOpenDialog] = useState<boolean>(false)
	const [alertInfo, setAlertInfo] = useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})

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

	const {
		data,
		error,
		mutateAsync: mutateUpdateProfile,
	} = useMutation({
		mutationFn: async (payload: PutProfileDtoIn) => {
			await service.um.putProfile(payload)
			queryClient.invalidateQueries({ queryKey: ['getProfile'] })
		},
	})

	const onSubmit = useCallback(async (values: FormValues) => {
		try {
			setBusy(true)
			if (values.image instanceof File) {
				const selectedImage: CreateProfileImageDtoIn = {
					file: values.image,
				}
				let imageUrl
				try {
					imageUrl = await service.um.uploadImg(selectedImage)
				} catch (error) {
					throw new Error('Image upload failed')
				}
				values.image = imageUrl.data?.download_file_url || ''
			}

			const profileData: PutProfileDtoIn = {
				id: values.id,
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				image: values.image,
				responsibleProvinceCode: values.responsibleProvinceCode,
				responsibleDistrictCode: values.responsibleDistrictCode,
			}
			try {
				await mutateUpdateProfile(profileData)
			} catch (error) {
				throw new Error('Profile update failed')
			}

			let userImage
			try {
				userImage = (await service.um.getProfile()).data?.image
			} catch (error) {
				throw new Error('Access Profile failed')
			}

			// ใช้ update ค่า data จาก useSession
			try {
				await update({
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					email: profileData.email,
					image: userImage,
					responsibleProvinceCode: profileData.responsibleProvinceCode,
					responsibleDistrictCode: profileData.responsibleDistrictCode,
				})
			} catch (error) {
				throw new Error('Failed to update session')
			}

			setAlertInfo({ open: true, severity: 'success', message: 'แก้ไขข้อมูลส่วนตัวสำเร็จ' })
		} catch (error: any) {
			console.log('Error:', error.message)
			setAlertInfo({ open: true, severity: 'error', message: 'แก้ไขข้อมูลส่วนตัวไม่สำเร็จ' })
		} finally {
			setBusy(false)
		}
	}, [])

	const logout = useCallback(() => signOut({ callbackUrl: AppPath.Login }), [])

	const formik = useFormik<FormValues>({
		enableReinitialize: true,
		initialValues: userData?.data || defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	const { data: provinceLookupData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const {
		data: districtLookupData,
		isLoading: isDistricDataLoading,
		refetch: refetchDistricts,
	} = useQuery({
		queryKey: ['getDistrict'],
		queryFn: () => service.lookup.get(`districts/${formik.values.responsibleProvinceCode}`),
		enabled: !!formik.values.responsibleProvinceCode,
	})

	useEffect(() => {
		if (formik.values.responsibleProvinceCode) {
			refetchDistricts()
		}
	}, [formik.values.responsibleProvinceCode, refetchDistricts])

	const { data: organizationLookupData, isLoading: isOrganizationDataLoading } = useQuery({
		queryKey: ['getOrganization'],
		queryFn: () => service.lookup.get('organizations'),
	})

	const { data: roleLookupData, isLoading: isRoleDataLoading } = useQuery({
		queryKey: ['getRole'],
		queryFn: () => service.lookup.get('roles'),
	})

	const handleConfirmOpen = () => {
		formik.validateForm().then((errors) => {
			if (Object.keys(errors).length === 0) {
				setConfirmOpenDialog(true)
			} else {
				formik.handleSubmit()
			}
		})
	}

	const handleConfirmSubmit = () => {
		setConfirmOpenDialog(false)
		formik.handleSubmit()
	}

	return (
		<>
			<form
				onSubmit={formik.handleSubmit}
				className='flex h-full flex-col justify-between max-lg:justify-start max-lg:gap-[32px]'
			>
				<Box className='flex w-full gap-[16px] max-lg:flex-col lg:gap-[12px]'>
					<div className='w-full lg:w-[214px]'>
						<UploadImage
							name='image'
							formik={formik}
							className='flex flex-col items-center gap-[12px] py-[16px]'
							disabled={busy}
						/>
					</div>
					<div className='flex flex-col gap-[16px]'>
						<Box className='flex flex-col gap-[12px]'>
							<div className='flex gap-[12px] max-lg:flex-col'>
								<FormInput
									className='w-full text-sm font-medium lg:w-[240px]'
									name='firstName'
									label={t('default.firstName')}
									formik={formik}
									required
									disabled={busy}
								/>
								<FormInput
									className='w-full text-sm font-medium lg:w-[240px]'
									name='lastName'
									label={t('default.lastName')}
									formik={formik}
									required
									disabled={busy}
								/>
							</div>
							<div className='flex gap-[12px] max-lg:flex-col'>
								<FormInput
									className='w-full text-sm font-medium lg:w-[240px]'
									name='email'
									label={t('default.email')}
									formik={formik}
									required
									disabled
								/>
							</div>
						</Box>
						<Box className='flex flex-col gap-[16px] lg:gap-[12px]'>
							<div className='flex gap-[16px] max-lg:flex-col lg:gap-[12px]'>
								<AutocompleteInput
									className='w-full text-sm font-medium lg:w-[240px]'
									options={
										provinceLookupData?.data?.map((item) => ({
											...item,
											value: String(item.code),
										})) || []
									}
									getOptionLabel={(option) => option.name[i18n.language]}
									name='responsibleProvinceCode'
									label={t('default.province')}
									formik={formik}
									disabled={isProvinceDataLoading || busy}
									required
								/>
								<AutocompleteInput
									className='w-full text-sm font-medium lg:w-[240px]'
									options={
										districtLookupData?.data?.map((item) => ({
											...item,
											value: String(item.code),
										})) || []
									}
									getOptionLabel={(option) => option.name?.[i18n.language]}
									name='responsibleDistrictCode'
									label={t('default.amphor')}
									formik={formik}
									disabled={isDistricDataLoading || busy}
								/>
							</div>
							<div className='flex gap-[16px] max-lg:hidden max-lg:flex-col lg:gap-[12px]'>
								<AutocompleteInput
									className='w-full text-sm font-medium lg:w-[240px]'
									options={
										organizationLookupData?.data?.map((item) => ({
											...item,
											value: item.code,
										})) || []
									}
									getOptionLabel={(option) => option.name[i18n.language]}
									name='orgCode'
									label={t('default.org')}
									formik={formik}
									disabled
								/>
								<AutocompleteInput
									className='w-full text-sm font-medium lg:w-[240px]'
									options={
										roleLookupData?.data?.map((item) => ({
											...item,
											value: item.code,
										})) || []
									}
									getOptionLabel={(option) => option.name[i18n.language]}
									name='role'
									label={t('default.role')}
									formik={formik}
									disabled
								/>
							</div>
						</Box>
					</div>
				</Box>
				<Box className='flex items-center max-lg:flex-col max-lg:items-center max-lg:gap-[8px] lg:justify-between lg:px-[40px]'>
					<div className='flex gap-[8px] max-lg:w-[250px] max-lg:flex-col lg:gap-[20px]'>
						<Button
							className='h-[40px] px-[16px] py-[8px] text-base font-semibold'
							variant='contained'
							onClick={handleConfirmOpen}
							color='primary'
							disabled={busy}
							startIcon={
								busy ? (
									<CircularProgress
										className='[&_.MuiCircularProgress-circle]:text-[#00000042]'
										size={16}
									/>
								) : null
							}
						>
							{t('default.confirm')}
						</Button>
						<AlertConfirm
							open={confirmOpenDialog}
							title='บันทึกบัญชีผู้ใช้งาน'
							content='ต้องการยืนยันการบันทึกบัญชีผู้ใช้งานนี้ใช่หรือไม่'
							onClose={() => setConfirmOpenDialog(false)}
							onConfirm={handleConfirmSubmit}
						/>

						<div className='[&_.Mui-disabled]:border-[#0000001f] [&_.Mui-disabled]:bg-transparent [&_.Mui-disabled]:text-[#00000042] [&_.Mui-disabled_.MuiButton-startIcon>svg]:text-[#00000042]'>
							<Button
								className='flex h-[40px] gap-[4px] border-[#6E6E6E] bg-success-light px-[16px] py-[8px] text-base text-[#7A7A7A] max-lg:w-full [&_.MuiButton-startIcon]:m-0'
								variant='outlined'
								onClick={() => router.push(AppPath.PasswordReset)}
								color='primary'
								disabled={busy}
								startIcon={<Icon path={mdiLockReset} size={'20px'} className='text-[#A6A6A6]' />}
							>
								{t('default.resetPassword')}
							</Button>
						</div>
					</div>
					<Button
						className='h-[40px] px-[16px] py-[8px] text-base max-lg:w-[250px]'
						onClick={() => setLogoutOpenDialog(true)}
						variant='outlined'
						color='error'
						disabled={busy}
					>
						{t('auth.loginOut')}
					</Button>
					<AlertConfirm
						open={logoutOpenDialog}
						title='ยืนยันการออกจากระบบ'
						content='ต้องการยืนยันการออกจากระบบของผู้ใช้งานนี้ใช่หรือไม่'
						onClose={() => setLogoutOpenDialog(false)}
						onConfirm={logout}
					/>
				</Box>
			</form>
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
		</>
	)
}

export default withTranslation('appbar')(ProfileMain)
