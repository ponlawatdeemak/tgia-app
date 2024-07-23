'use client'

import service, { ResponseDto } from '@/api'
import FormInput from '@/components/common/input/FormInput'
import PasswordInput from '@/components/common/input/PasswordInput'
import ResetPasswordForm from '@/components/shared/ResetPasswordForm'
import { AppPath } from '@/config/app'
import { Alert, Button, CircularProgress, FormHelperText, Paper, Snackbar, Typography } from '@mui/material'
import { QueryClient, useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import * as yup from 'yup'
import { ResetPasswordDtoOut } from '@/api/dto/auth/dto-out.dto'
import { ChangePasswordDtoIn, ResetPasswordDtoIn } from '@/api/dto/auth/dto-in.dto'
import useLanguage from '@/store/language'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/i18n/client'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'

const validationSchema = yup.object({
	currentPassword: yup
		.string()
		.required('กรุณากรอกรหัสผ่านใหม่')
		.min(8, 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร')
		.matches(/^(?=.*[0-9])/, 'ต้องมีอย่างน้อย 1 หมายเลข')
		.matches(/^(?=.*[a-z])/, 'ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
		.matches(/^(?=.*[A-Z])/, 'ต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
		.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว'),
	password: yup
		.string()
		.required('กรุณากรอกรหัสผ่านใหม่')
		.min(8, 'รหัสผ่านต้องมีขนาดอย่างน้อย 8 ตัวอักษร')
		.matches(/^(?=.*[0-9])/, 'ต้องมีอย่างน้อย 1 หมายเลข')
		.matches(/^(?=.*[a-z])/, 'ต้องมีตัวอักษรพิมพ์เล็กอย่างน้อย 1 ตัว')
		.matches(/^(?=.*[A-Z])/, 'ต้องมีอักษรตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว')
		.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, 'ต้องมีอักขระพิเศษอย่างน้อย 1 ตัว'),
	confirmPassword: yup
		.string()
		.required('กรุณากรอกรหัสผ่านอีกครั้ง')
		.oneOf([yup.ref('password')], 'รหัสผ่านไม่ตรงกัน'),
})

type ChangePasswordFormType = yup.InferType<typeof validationSchema>

const PasswordResetMain = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

	const [busy, setBusy] = useState<boolean>(false)
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

	const {
		isPending,
		error,
		mutateAsync: mutateChangePassword,
	} = useMutation({
		mutationFn: async (payload: ChangePasswordDtoIn) => {
			await service.auth.changePassword(payload)
		},
	})

	const onSubmit = useCallback(
		async (values: ChangePasswordFormType) => {
			try {
				setBusy(true)
				const passwordInfo: ChangePasswordDtoIn = {
					userId: session?.user.id || '',
					password: values.currentPassword,
					newPassword: values.password,
				}
				await mutateChangePassword(passwordInfo)

				router.push(`/${language}${AppPath.PasswordReset}/?resetStatus=success`)
			} catch (error) {
				console.log('Password update failed')
				router.push(`/${language}${AppPath.PasswordReset}/?resetStatus=failed`)
			} finally {
				setBusy(false)
			}
		},
		[mutateChangePassword, router],
	)

	const formik = useFormik<ChangePasswordFormType>({
		initialValues: {
			currentPassword: '',
			password: '',
			confirmPassword: '',
		},
		validationSchema: validationSchema,
		onSubmit,
	})

	const handleConfirmOpen = () => {
		formik.validateForm().then((errors) => {
			if (Object.keys(errors).length === 0) {
				setConfirmOpen(true)
			} else {
				formik.handleSubmit()
			}
		})
	}

	const handleConfirmSubmit = () => {
		setConfirmOpen(false)
		formik.handleSubmit()
	}

	return (
		<Paper className='flex h-full flex-col gap-[16px] bg-white p-[24px] pt-[16px] max-lg:px-[16px] lg:gap-[24px]'>
			<Typography className='text-xl font-semibold text-black lg:text-md'>{t('profile.profile')}</Typography>
			<div>
				<Button
					className='h-[40px] px-[16px] py-[8px] text-base'
					onClick={() => router.push(AppPath.Profile)}
					variant='outlined'
					disabled={busy}
					startIcon={<Icon path={mdiArrowLeft} size={1} />}
				>
					ย้อนกลับ
				</Button>
				<form onSubmit={formik.handleSubmit} className='flex h-full w-[306px] flex-col max-lg:justify-start'>
					<ResetPasswordForm className='mb-6' formik={formik} changePassword={true} loading={busy} />
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
						open={confirmOpen}
						title='ยืนยันการแก้รหัสผ่าน'
						content='ต้องการยืนยันการแก้รหัสผ่านของผู้ใช้งานนี้ใช่หรือไม่'
						onClose={() => setConfirmOpen(false)}
						onConfirm={handleConfirmSubmit}
					/>
				</form>
			</div>
		</Paper>
	)
}

export default PasswordResetMain
