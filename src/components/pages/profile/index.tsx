'use client'

import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import { Alert, Box, Button, CircularProgress, Snackbar, Typography } from '@mui/material'
import Icon from '@mdi/react'
import { mdiLockReset } from '@mdi/js'
import { useFormik } from 'formik'
import { useCallback, useState } from 'react'
import * as yup from 'yup'
import service from '@/api'
import { signOut, useSession } from 'next-auth/react'
import { PostUploadFilesDtoIn, PutProfileDtoIn } from '@/api/um/dto-in.dto'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AppPath } from '@/config/app'
import { useRouter } from 'next/navigation'
import { AlertInfoType, FormValues } from '@/components/shared/ProfileForm/interface'
import ProfileForm from '@/components/shared/ProfileForm'

import { useTranslation } from 'react-i18next'
import { useSwitchLanguage } from '@/i18n/client'

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

interface ProfileMainProps {}

const ProfileMain: React.FC<ProfileMainProps> = () => {
	const router = useRouter()
	const queryClient = useQueryClient()
	const { t, i18n } = useTranslation(['appbar', 'default', 'um'])
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
		queryFn: async () => await service.um.getProfile(),
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
				const selectedImage: PostUploadFilesDtoIn = {
					file: values.image,
				}
				let imageUrl
				try {
					imageUrl = await service.um.postUploadFiles(selectedImage)
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

			setAlertInfo({ open: true, severity: 'success', message: t('profileUpdate', { ns: 'um' }) })
		} catch (error: any) {
			console.log('Error:', error.message)
			setAlertInfo({ open: true, severity: 'error', message: t('profileUpdateError', { ns: 'um' }) })
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
			<Typography className='text-xl font-semibold text-black lg:text-md'>
				{t('profile', { ns: 'um' })}
			</Typography>
			<form
				onSubmit={formik.handleSubmit}
				className='flex h-full flex-col justify-between max-lg:justify-start max-lg:gap-[32px]'
			>
				<Box className='flex w-full gap-[16px] max-lg:flex-col lg:gap-[12px]'>
					<ProfileForm
						formik={formik}
						loading={busy || isUserDataLoading}
						isDisabledProfile
						isHiddenProfile
					/>
				</Box>
				<Box className='flex items-center max-lg:flex-col max-lg:items-center max-lg:gap-[8px] lg:justify-between lg:px-[40px]'>
					<div className='flex gap-[8px] max-lg:w-[250px] max-lg:flex-col lg:gap-[20px]'>
						<Button
							className='h-[40px] px-[16px] py-[8px] text-base font-semibold'
							variant='contained'
							onClick={handleConfirmOpen}
							color='primary'
							disabled={busy || isUserDataLoading}
							startIcon={
								busy || isUserDataLoading ? (
									<CircularProgress
										className='[&_.MuiCircularProgress-circle]:text-[#00000042]'
										size={16}
									/>
								) : null
							}
						>
							{t('confirm')}
						</Button>
						<AlertConfirm
							open={confirmOpenDialog}
							title={t('alert.confirmUserUpdateTitle')}
							content={t('alert.confirmUserUpdateContent')}
							onClose={() => setConfirmOpenDialog(false)}
							onConfirm={handleConfirmSubmit}
						/>

						<div className='[&_.Mui-disabled]:border-[#0000001f] [&_.Mui-disabled]:bg-transparent [&_.Mui-disabled]:text-[#00000042] [&_.Mui-disabled_.MuiButton-startIcon>svg]:text-[#00000042]'>
							<Button
								className='flex h-[40px] gap-[4px] border-[#6E6E6E] bg-success-light px-[16px] py-[8px] text-base text-[#7A7A7A] max-lg:w-full [&_.MuiButton-startIcon]:m-0'
								variant='outlined'
								onClick={() => router.push(AppPath.PasswordReset)}
								color='primary'
								disabled={busy || isUserDataLoading}
								startIcon={<Icon path={mdiLockReset} size={'20px'} className='text-[#A6A6A6]' />}
							>
								{t('resetPassword')}
							</Button>
						</div>
					</div>
					<Button
						className='h-[40px] px-[16px] py-[8px] text-base max-lg:w-[250px]'
						onClick={() => setLogoutOpenDialog(true)}
						variant='outlined'
						color='error'
						disabled={busy || isUserDataLoading}
					>
						{t('auth.loginOut')}
					</Button>
					<AlertConfirm
						open={logoutOpenDialog}
						title={t('alert.confirmLogoutTitle')}
						content={t('alert.confirmLogoutContent')}
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

export default ProfileMain
