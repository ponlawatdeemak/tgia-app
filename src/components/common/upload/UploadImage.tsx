'use client'

import { mdiAccountOutline, mdiDeleteOutline, mdiTrayArrowUp } from '@mdi/js'
import Icon from '@mdi/react'
import { Avatar, Button, FormHelperText } from '@mui/material'
import { FormikProps } from 'formik'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface UploadImageProps {
	name: string
	formik: FormikProps<any>
	className?: string
	defaultImage?: string
	disabled?: boolean
	[key: string]: unknown
}

const UploadImage: React.FC<UploadImageProps> = ({
	formik,
	name,
	className,
	defaultImage = mdiAccountOutline,
	disabled = false,
	...props
}) => {
	const { t } = useTranslation()
	const maxImageSize = 3 * 1024 * 1024
	const [image, setImage] = useState<string | null>(null)
	//const errorMessage = formik.touched[name] && formik.errors[name]
	const { i18n, tReady, ...uploadProps } = props
	const [showInvalidFile, setShowInvalidFile] = useState(false)

	useEffect(() => {
		const formikValue = formik.values[name]
		if (formikValue instanceof File) {
			setImage(URL.createObjectURL(formikValue))
		} else if (typeof formikValue === 'string') {
			setImage(formikValue)
		} else {
			setImage(null)
		}
	}, [formik.values, name])

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const selectedImage = event.target.files?.[0]
		if (selectedImage) {
			const imageType = selectedImage.type
			const imageSize = selectedImage.size
			const validImageTypes = ['image/png', 'image/jpeg']

			if (validImageTypes.includes(imageType) && imageSize <= maxImageSize) {
				formik.setFieldValue(name, selectedImage)
				setImage(URL.createObjectURL(selectedImage))
				setShowInvalidFile(false)
			} else {
				formik.setFieldValue(name, null)
				setImage(null)
				setShowInvalidFile(true)
			}
		} else {
			formik.setFieldValue(name, null)
			setImage(null)
		}
	}

	const handleImageError = () => {
		setImage(null)
	}

	const handleDeleteClick = () => {
		formik.setFieldValue(name, '')
		setImage(null)
	}

	return (
		<div className={className}>
			<>
				{image ? (
					<Avatar
						src={image}
						alt='Profile Image'
						className='h-[120px] w-[120px] bg-success-light'
						onError={handleImageError}
					/>
				) : (
					<Avatar className='h-[120px] w-[120px] bg-success-light'>
						<Icon path={defaultImage} size={'90px'} className='text-primary' />
					</Avatar>
				)}

				{image && (
					<div className='absolute box-border flex h-[120px] w-[120px] items-center justify-center rounded-[60px] bg-black opacity-0 transition hover:opacity-70'>
						<div onClick={handleDeleteClick}>
							<Icon path={mdiDeleteOutline} size={1} className='cursor-pointer text-white' />
						</div>
					</div>
				)}
			</>

			<div className='flex flex-col items-center [&_.Mui-disabled]:border-[#0000001f] [&_.Mui-disabled]:bg-transparent [&_.Mui-disabled]:text-[#00000042] [&_.Mui-disabled_.MuiButton-startIcon>svg]:text-[#00000042]'>
				<Button
					component='label'
					role={undefined}
					variant='outlined'
					tabIndex={-1}
					className='flex h-[32px] min-w-[148px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
					startIcon={<Icon path={mdiTrayArrowUp} size={'20px'} />}
					disabled={disabled}
				>
					{t('common.uploadImg')}
					<input
						type='file'
						accept='image/png, image/jpeg'
						className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
						onChange={handleImageChange}
						{...uploadProps}
					/>
				</Button>
				{showInvalidFile && <FormHelperText error>{t('um:invalidFileSelected')}</FormHelperText>}
			</div>
			<p className='m-0 w-[123px] text-center text-sm text-[#7A7A7A]'>{t('common.conditionImg')}</p>
			{/* {typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>} */}
		</div>
	)
}

export default UploadImage
