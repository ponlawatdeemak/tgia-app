'use client'

import service from '@/api'
import { ChangePasswordDtoIn } from '@/api/auth/dto-in.dto'
import AlertConfirm from '@/components/common/dialog/AlertConfirm'
import ResetPasswordForm from '@/components/shared/ResetPasswordForm'
import { AppPath } from '@/config/app'
import { mdiArrowLeft } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, CircularProgress } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

interface PasswordResetMainProps {}

const PasswordResetMain: React.FC<PasswordResetMainProps> = () => {
	const router = useRouter()
	const { data: session } = useSession()
	const { t } = useTranslation()

	const [busy, setBusy] = useState<boolean>(false)
	const [confirmOpen, setConfirmOpen] = useState<boolean>(false)

	const validationSchema = yup.object({
		currentPassword: yup
			.string()
			.required(t('warning.inputPassword'))
			.min(8, t('warning.minPasswordCharacters'))
			.matches(/^(?=.*[0-9])/, t('warning.minPasswordNumber'))
			.matches(/^(?=.*[a-z])/, t('warning.minPasswordLowercaseLetter'))
			.matches(/^(?=.*[A-Z])/, t('warning.minPasswordUppercaseLetter'))
			.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, t('warning.minPasswordSymbol')),
		password: yup
			.string()
			.required(t('warning.inputNewPassword'))
			.min(8, t('warning.minPasswordCharacters'))
			.matches(/^(?=.*[0-9])/, t('warning.minPasswordNumber'))
			.matches(/^(?=.*[a-z])/, t('warning.minPasswordLowercaseLetter'))
			.matches(/^(?=.*[A-Z])/, t('warning.minPasswordUppercaseLetter'))
			.matches(/^(?=.*[!@#$%^&*()_+\-=\[\]{};:\\|,.<>~\/?])/, t('warning.minPasswordSymbol')),
		confirmPassword: yup
			.string()
			.required(t('warning.inputConfirmPassword'))
			.oneOf([yup.ref('password')], t('warning.invalidPasswordMatch')),
	})

	type ChangePasswordFormType = yup.InferType<typeof validationSchema>

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

				router.push(`${AppPath.PasswordReset}/?resetStatus=success`)
			} catch (error) {
				router.push(`${AppPath.PasswordReset}/?resetStatus=failed`)
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
		<div className='flex h-full flex-col gap-[16px] lg:gap-[18px] lg:px-[16px] lg:py-[10px]'>
			<div>
				<Button
					className='flex gap-[4px] border-gray py-[4px] pl-[6px] pr-[8px] text-sm font-medium text-black [&_.MuiButton-startIcon]:m-0'
					onClick={() => router.push(AppPath.Profile)}
					variant='outlined'
					disabled={busy}
					startIcon={<Icon path={mdiArrowLeft} size={'18px'} className='text-black' />}
				>
					{t('default.back')}
				</Button>
			</div>
			<form
				onSubmit={formik.handleSubmit}
				className='flex h-full flex-col gap-[28px] max-lg:justify-between lg:w-[306px]'
			>
				<ResetPasswordForm
					className='flex flex-col gap-[16px] lg:gap-[18px]'
					formik={formik}
					changePassword={true}
					loading={busy}
				/>
				<div className='flex max-lg:justify-center'>
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
				</div>
				<AlertConfirm
					open={confirmOpen}
					title='ยืนยันการแก้รหัสผ่าน'
					content='ต้องการยืนยันการแก้รหัสผ่านของผู้ใช้งานนี้ใช่หรือไม่'
					onClose={() => setConfirmOpen(false)}
					onConfirm={handleConfirmSubmit}
				/>
			</form>
		</div>
	)
}

export default PasswordResetMain
