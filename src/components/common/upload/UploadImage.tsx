'use client'

import React, { useState, ChangeEvent, useEffect } from 'react'
import { FormikProps } from 'formik'
import { Button, Avatar, FormHelperText } from '@mui/material'
import Icon from '@mdi/react'
import { mdiTrayArrowUp, mdiAccountOutline, mdiDeleteOutline } from '@mdi/js'
import { useTranslation } from '@/i18n/client'
import useLanguage from '@/store/language'

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
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')
	const maxImageSize = 3 * 1024 * 1024
	const [image, setImage] = useState<string | null>(null)
	const errorMessage = formik.touched[name] && formik.errors[name]

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
			} else {
				formik.setFieldValue(name, null)
				setImage(null)
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

	console.log('image ', image)
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

			<div className='[&_.Mui-disabled]:border-[#0000001f] [&_.Mui-disabled]:bg-transparent [&_.Mui-disabled]:text-[#00000042] [&_.Mui-disabled_.MuiButton-startIcon>svg]:text-[#00000042]'>
				<Button
					component='label'
					role={undefined}
					variant='outlined'
					tabIndex={-1}
					className='flex h-[32px] gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
					startIcon={<Icon path={mdiTrayArrowUp} size={'20px'} />}
					disabled={disabled}
				>
					{t('common.uploadImg')}
					<input
						type='file'
						accept='image/png, image/jpeg'
						className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
						onChange={handleImageChange}
						{...props}
					/>
				</Button>
			</div>
			<p className='m-0 w-[123px] text-center text-sm text-[#7A7A7A]'>{t('common.conditionImg')}</p>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</div>
	)
}

export default UploadImage
