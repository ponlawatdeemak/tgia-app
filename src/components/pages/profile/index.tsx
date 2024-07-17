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
import { ChangeEvent, useCallback, useState } from 'react'
import * as yup from 'yup'
import service from '@/api'

interface ProfileDtoIn {
	profileImg: File | null
	firstName: string
	lastName: string
	email: string
	province: number
	district: number
	department: number
	role: number
}

interface OptionType {
	label: string
	value: number
}

const provinceOption: OptionType[] = [
	{ label: 'นครราชสีมา', value: 1 },
	{ label: 'กรุงเทพมหานคร', value: 2 },
	{ label: 'นนทบุรี', value: 3 },
]

const districtOption: OptionType[] = [
	{ label: 'เมืองนครราชสีมา', value: 1 },
	{ label: 'เมืองกรุงเทพมหานคร', value: 2 },
	{ label: 'เมืองนนทบุรี', value: 3 },
]

const departmentOption: OptionType[] = [{ label: 'DOAE', value: 1 }]

const roleOption: OptionType[] = [{ label: 'User', value: 1 }]

const validationSchema = yup.object({
	profileImg: yup.mixed().required('กรุณาใส่รูปภาพ'),
	firstName: yup.string().required('กรุณากรอกชื่อ'),
	lastName: yup.string().required('กรุณากรอกนามสกุล'),
	email: yup.string().required('กรุณากรอกอีเมล์'),
})

const ProfileMain = () => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const onSubmit = useCallback(async (values: ProfileDtoIn) => {
		console.log(values)
		try {
			const response = await service.um.uploadImg(values.profileImg!)
			console.log('File uploaded', response.data)
		} catch (error) {
			console.log('Error uploading file:', error)
		}
		// call api
	}, [])

	const formik = useFormik<ProfileDtoIn>({
		initialValues: {
			profileImg: null,
			firstName: 'สมชาย',
			lastName: 'ลมเพลมพัด',
			email: 'somchai@gmail.com',
			province: 1,
			district: 1,
			department: 1,
			role: 1,
		},
		validationSchema: validationSchema,
		onSubmit,
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
				<Typography className='text-md mb-6 font-semibold'>ข้อมูลส่วนตัว</Typography>
				<form className='flex h-[90%] flex-col justify-between'>
					<Box className='flex w-full gap-3'>
						<div className='h-[244px] w-[214px]'>
							<UploadImage
								name='profileImg'
								formik={formik}
								className='flex flex-col items-center gap-3 py-4'
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
									/>
								</div>
							</Box>
							<Box className='mb-[46px] flex flex-col gap-3'>
								<div className='flex gap-3'>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={provinceOption}
										name='province'
										label='สังกัดจังหวัด'
										formik={formik}
									/>
									<AutocompleteInput
										className='w-[240px] text-sm font-medium'
										options={districtOption}
										name='district'
										label='สังกัดอำเภอ'
										formik={formik}
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
						<Button variant='outlined' color='error'>
							ออกจากระบบ
						</Button>
					</Box>
				</form>
			</div>
		</Paper>
	)
}

export default ProfileMain
