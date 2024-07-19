'use client'

import React, { useState, ChangeEvent, useEffect } from 'react'
import { FormikProps } from 'formik'
import { Button, Avatar, FormHelperText } from '@mui/material'
import Icon from '@mdi/react'
import { mdiTrayArrowUp, mdiAccountOutline } from '@mdi/js'
import { useTranslation } from '@/i18n/client'
import useLanguage from '@/store/language'

export interface UploadImageProps {
	name: string
	formik: FormikProps<any>
	className?: string
	defaultImage?: string
	[key: string]: unknown
}

const UploadImage: React.FC<UploadImageProps> = ({
	formik,
	name,
	className,
	defaultImage = mdiAccountOutline,
	...props
}) => {
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'appbar')

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
			formik.setFieldValue(name, selectedImage)
			setImage(URL.createObjectURL(selectedImage))
		} else {
			formik.setFieldValue(name, null)
			setImage(null)
		}
	}

	return (
		<div className={className}>
			{image ? (
				<Avatar src={image} alt='Profile Image' className='h-[120px] w-[120px] bg-success-light' />
			) : (
				<Avatar className='h-[120px] w-[120px] bg-success-light'>
					<Icon path={defaultImage} size={'90px'} className='text-primary' />
				</Avatar>
			)}
			<Button
				component='label'
				role={undefined}
				variant='outlined'
				tabIndex={-1}
				className='flex gap-[4px] border-gray py-[6px] pl-[8px] pr-[10px] text-base text-black [&_.MuiButton-startIcon]:m-0'
				startIcon={<Icon path={mdiTrayArrowUp} size={'20px'} />}
			>
				{t('common.uploadImg')}
				<input
					type='file'
					accept="'image/png', 'image/jpeg'"
					className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
					onChange={handleImageChange}
					{...props}
				/>
			</Button>
			<p className='m-0 w-[123px] text-center text-sm text-[#7A7A7A]'>{t('common.conditionImg')}</p>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</div>
	)
}

export default UploadImage
