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
import { useCallback, useState } from 'react'
import * as yup from 'yup'
import service from '@/api'
import { signOut } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { GetProfileDtoOut } from '@/api/dto/um/dto-out.dto'

interface ProfileDtoIn {
	id: string
	firstName: string
	lastName: string
	email: string
	image: string | File
}

interface Formvalues {
	id?: string
	username?: string
	firstName?: string
	lastName?: string
	email?: string
	image?: string | File
	orgCode?: string
	role?: string
	responsibleProvinceCode?: string
	responsibleDistrictCode?: string
}

const defaultFormValues = {
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

interface OptionType {
	label: string
	value: number
}

const departmentOption: OptionType[] = [{ label: 'DOAE', value: 1 }]

const roleOption: OptionType[] = [{ label: 'User', value: 1 }]

const validationSchema = yup.object({
	image: yup.mixed().required('กรุณาใส่รูปภาพ'),
	firstName: yup.string().required('กรุณากรอกชื่อ'),
	lastName: yup.string().required('กรุณากรอกนามสกุล'),
	email: yup.string().required('กรุณากรอกอีเมล์'),
})

const ProfileMain = () => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const { data: userData, isLoading: isUserDataLoading } = useQuery({
		queryKey: ['getProfile'],
		queryFn: () => service.um.getProfile(),
	})

	const onSubmit = useCallback(async (values: GetProfileDtoOut) => {
		console.log(values)
		try {
			if (values.image) {
				const response = await service.um.uploadImg(values.image as any)
				console.log('File uploaded', response.data)
			}
		} catch (error) {
			console.log('Error uploading file:', error)
		}
		// call api
	}, [])

	const logout = useCallback(() => signOut(), [])

	const formik = useFormik<GetProfileDtoOut>({
		enableReinitialize: true,
		initialValues: userData?.data || {
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
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	const { data: provinceData, isLoading: isProvinceDataLoading } = useQuery({
		queryKey: ['getProvince'],
		queryFn: () => service.lookup.get('provinces'),
	})

	const { data: districtData, isLoading: isDistricDataLoading } = useQuery({
		queryKey: ['getDistrict'],
		queryFn: () => service.lookup.get(`districts/${formik.values.responsibleProvinceCode}`),
		enabled: !!formik.values.responsibleProvinceCode,
	})

	const handleConfirmOpen = () => {
		setIsConfirmOpen(true)
	}

	const handleConfirmClose = () => {
		setIsConfirmOpen(false)
	}

	const handleConfirmSubmit = () => {
		formik.handleSubmit()
		setIsConfirmOpen(false)
	}

	return (
		<Paper className='m-0 flex h-full flex-col justify-between bg-white px-6 py-4'>
			<div className='h-full'>
				<Typography className='mb-6 text-md font-semibold'>ข้อมูลส่วนตัว</Typography>
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
										label='ชื่อจริง'
										formik={formik}
										required
									/>
									<FormInput
										className='w-[240px] text-sm font-medium'
										name='lastName'
										label='นามสกุล'
										formik={formik}
										required
									/>
								</div>
								<div className='flex gap-3'>
									<FormInput
										className='w-[240px] text-sm font-medium'
										name='email'
										label='อีเมล์'
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
											provinceData?.map((item) => ({
												...item,
												value: String(item.provinceCode),
											})) || []
										}
										getOptionLabel={(option) => option.nameTh}
										name='responsibleProvinceCode'
										label='สังกัดจังหวัด'
										formik={formik}
										disabled={isProvinceDataLoading}
										required
									/>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={
											districtData?.map((item) => ({
												...item,
												value: String(item.ampherCode),
											})) || []
										}
										getOptionLabel={(option) => option.nameTh}
										name='responsibleDistrictCode'
										label='สังกัดอำเภอ'
										formik={formik}
										disabled={isDistricDataLoading}
									/>
								</div>
								<div className='flex gap-3'>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={departmentOption}
										name='department'
										label='หน่วยงาน'
										formik={formik}
										disabled
									/>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={roleOption}
										name='role'
										label='บทบาท'
										formik={formik}
										disabled
									/>
								</div>
							</Box>
						</div>
					</Box>
					<Box className='ml-10 flex justify-between'>
						<div className='flex gap-6'>
							<Button variant='contained' onClick={handleConfirmOpen} color='primary'>
								ยืนยัน
							</Button>
							<Dialog
								open={isConfirmOpen}
								onClose={handleConfirmClose}
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
										onClick={handleConfirmClose}
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
							<Button variant='outlined' color='primary'>
								รีเซ็ตรหัสผ่าน
							</Button>
						</div>
						<Button onClick={logout} variant='outlined' color='error'>
							ออกจากระบบ
						</Button>
					</Box>
				</form>
			</div>
		</Paper>
	)
}

export default ProfileMain
