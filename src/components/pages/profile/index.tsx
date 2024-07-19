'use client'

import AutocompleteInput from '@/components/common/input/AutocompleteInput'
import FormInput from '@/components/common/input/FormInput'
import UploadImage from '@/components/common/upload/UploadImage'
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Paper,
	Typography,
} from '@mui/material'
import { useFormik } from 'formik'
import { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import service from '@/api'
import { signOut, useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from '@/i18n/client'
import useLanguage from '@/store/language'
import { CreateProfileImageDtoIn, PutProfileDtoIn } from '@/api/dto/um/dto-in.dto'
import { mdiCheckBold, mdiCloseThick } from '@mdi/js'
import Icon from '@mdi/react'
import camelCase from 'camelcase'
import { QueryClient, useMutation } from '@tanstack/react-query'

export interface FormValues {
	id: string
	username: string
	firstName: string
	lastName: string
	email: string
	image: File | string
	orgCode: string
	role: string
	responsibleProvinceCode: any
	responsibleDistrictCode: any
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

const validationSchema = yup.object({
	//image: yup.mixed().required('กรุณาใส่รูปภาพ'),
	firstName: yup.string().required('กรุณากรอกชื่อ'),
	lastName: yup.string().required('กรุณากรอกนามสกุล'),
	email: yup.string().email('กรุณากรอกอีเมลให้ถูกต้อง').required('กรุณากรอกอีเมล'),
	responsibleProvinceCode: yup.string().required('กรุณาเลือกจังหวัด'),
})

const ProfileMain = () => {
	const queryClient = new QueryClient()
	const { data: session, update } = useSession()
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [status, setStatus] = useState<{ open: boolean; message: string }>({ open: false, message: '' })

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
			//await api.put('/profile', payload)
			await service.um.putProfile(payload)
			queryClient.invalidateQueries({ queryKey: ['getProfile'] })
		},
	})

	const onSubmit = useCallback(async (values: FormValues) => {
		try {
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

			// ใช้ update ค่า data จาก useSession
			try {
				await update({
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					email: profileData.email,
					image: profileData.image,
					responsibleProvinceCode: profileData.responsibleProvinceCode,
					responsibleDistrictCode: profileData.responsibleDistrictCode,
				})
			} catch (error) {
				throw new Error('Failed to update session')
			}

			setStatus({ open: true, message: 'แก้ไขข้อมูลส่วนตัวสำเร็จ' })
		} catch (error: any) {
			console.log('Error:', error.message)
			setStatus({ open: true, message: 'แก้ไขข้อมูลส่วนตัวไม่สำเร็จ' })
		}
	}, [])

	const logout = useCallback(() => signOut(), [])

	const formik = useFormik<FormValues>({
		enableReinitialize: true,
		initialValues: userData?.data || defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	const { data: provinceData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const {
		data: districtData,
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

	const { data: organizationData, isLoading: isOrganizationDataLoading } = useQuery({
		queryKey: ['getOrganization'],
		queryFn: () => service.lookup.get('organizations'),
	})

	const { data: roleData, isLoading: isRoleDataLoading } = useQuery({
		queryKey: ['getRole'],
		queryFn: () => service.lookup.get('roles'),
	})

	const handleConfirmSubmit = () => {
		formik.handleSubmit()
		setIsConfirmOpen(false)
	}

	return (
		<Paper className='m-0 flex h-full flex-col justify-between bg-white px-6 py-4'>
			<div className='h-full'>
				<Typography className='mb-6 text-md font-semibold'>{t('profile.profile')}</Typography>
				<form className='flex h-[90%] flex-col justify-between'>
					<Box className='flex w-full gap-3'>
						<div className='w-[214px]'>
							<UploadImage
								name='image'
								formik={formik}
								className='flex flex-col items-center gap-[12px] py-[16px]'
							/>
						</div>
						<div className=''>
							<Box className='mb-4 flex flex-col gap-3'>
								<div className='flex gap-3'>
									<FormInput
										className='w-[240px] text-sm font-medium'
										name='firstName'
										label={t('default.firstName')}
										formik={formik}
										required
									/>
									<FormInput
										className='w-[240px] text-sm font-medium'
										name='lastName'
										label={t('default.lastName')}
										formik={formik}
										required
									/>
								</div>
								<div className='flex gap-3'>
									<FormInput
										className='w-[240px] text-sm font-medium'
										name='email'
										label={t('default.email')}
										formik={formik}
										required
										disabled
									/>
								</div>
							</Box>
							<Box className='mb-[46px] flex flex-col gap-3'>
								<div className='flex gap-3'>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={
											provinceData?.data?.map((item) => ({
												...item,
												value: String(item.code),
											})) || []
										}
										getOptionLabel={(option) => option[camelCase(`name-${language}`)]}
										name='responsibleProvinceCode'
										label={t('default.province')}
										formik={formik}
										disabled={isProvinceDataLoading}
										required
									/>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={
											districtData?.data?.map((item) => ({
												...item,
												value: String(item.code),
											})) || []
										}
										getOptionLabel={(option) => option[camelCase(`name-${language}`)]}
										name='responsibleDistrictCode'
										label={t('default.amphor')}
										formik={formik}
										disabled={isDistricDataLoading}
									/>
								</div>
								<div className='flex gap-3'>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={
											organizationData?.data?.map((item) => ({
												...item,
												value: item.code,
											})) || []
										}
										getOptionLabel={(option) => option[camelCase(`name-${language}`)]}
										name='orgCode'
										label={t('default.org')}
										formik={formik}
										disabled
									/>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={
											roleData?.data?.map((item) => ({
												...item,
												value: item.code,
											})) || []
										}
										getOptionLabel={(option) => option[camelCase(`name-${language}`)]}
										name='role'
										label={t('default.role')}
										formik={formik}
										disabled
									/>
								</div>
							</Box>
						</div>
					</Box>
					<Box className='ml-10 flex justify-between'>
						<div className='flex gap-6'>
							<Button variant='contained' onClick={() => setIsConfirmOpen(true)} color='primary'>
								{t('default.confirm')}
							</Button>
							<Dialog
								open={isConfirmOpen}
								onClose={() => setIsConfirmOpen(false)}
								aria-labelledby='alert-dialog-title'
								aria-describedby='alert-dialog-description'
								className='.MuiDialog-paper:w-[100px]'
							>
								<DialogTitle id='alert-dialog-title'>{'บันทึกบัญชีผู้ใช้งาน'}</DialogTitle>
								<DialogContent>
									<DialogContentText id='alert-dialog-description'>
										ต้องการยืนยันการบันทึกบัญชีผู้ใช้งานนี้ใช่หรือไม่
									</DialogContentText>
								</DialogContent>
								<DialogActions sx={{ m: 2 }}>
									<Button
										variant='outlined'
										sx={{ width: '150px' }}
										color='error'
										onClick={() => setIsConfirmOpen(false)}
									>
										ยกเลิก
									</Button>
									<Button
										variant='contained'
										sx={{ width: '150px' }}
										color='success'
										type='submit'
										onClick={handleConfirmSubmit}
										autoFocus
									>
										ยืนยัน
									</Button>
								</DialogActions>
							</Dialog>

							<Dialog
								open={status.open}
								onClose={() => setStatus({ open: false, message: '' })}
								className='[&_.MuiDialog-paper]:h-[300px] [&_.MuiDialog-paper]:w-[400px]'
							>
								<DialogContent className='flex items-center justify-center'>
									<div className='flex flex-col items-center gap-4'>
										{status.message === 'แก้ไขข้อมูลส่วนตัวสำเร็จ' && (
											<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
												<div className='absolute h-full w-full bg-success-light' />
												<Icon path={mdiCheckBold} size={2} className='z-10 text-success' />
											</div>
										)}
										{status.message === 'แก้ไขข้อมูลส่วนตัวไม่สำเร็จ' && (
											<div className='relative flex size-24 items-center justify-center overflow-hidden rounded-full'>
												<div className='absolute h-full w-full bg-error opacity-20' />
												<Icon path={mdiCloseThick} size={2} className='text-error' />
											</div>
										)}
										<Typography className='text-2xl font-bold'>{status.message}</Typography>
									</div>
								</DialogContent>
								<DialogActions>
									<Button
										variant='contained'
										className='mt-8'
										onClick={() => setStatus({ open: false, message: '' })}
									>
										ตกลง
									</Button>
								</DialogActions>
							</Dialog>
							<Button variant='outlined' color='primary'>
								{t('default.resetPassword')}
							</Button>
						</div>
						<Button onClick={logout} variant='outlined' color='error'>
							{t('auth.loginOut')}
						</Button>
					</Box>
				</form>
			</div>
		</Paper>
	)
}

export default ProfileMain
