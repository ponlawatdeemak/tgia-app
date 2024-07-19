import React, { useState, ChangeEvent } from 'react'
import { FormikProps } from 'formik'
import { Button, Avatar, FormHelperText } from '@mui/material'
import Icon from '@mdi/react'
import { mdiTrayArrowUp, mdiAccountOutline } from '@mdi/js'

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
	const [image, setImage] = useState<string | null>(null)
	const errorMessage = formik.touched[name] && formik.errors[name]

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
				อัปโหลดรูปภาพ
				<input
					type='file'
					accept="'image/png', 'image/jpeg'"
					className='absolute bottom-0 left-0 h-full w-full cursor-pointer opacity-0'
					// style={{
					// 	position: 'absolute',
					// 	bottom: 0,
					// 	left: 0,
					// 	width: '100%',
					// 	height: '100%',
					// 	opacity: 0,
					// 	cursor: 'pointer',
					// 	overflow: 'hidden',
					// 	whiteSpace: 'nowrap',
					// }}
					onChange={handleImageChange}
					{...props}
				/>
			</Button>
			<p className='m-0 w-[123px] text-center text-sm text-[#7A7A7A]'>ขนาดไฟล์ไม่เกิน 3mb (jpg หรือ png)</p>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</div>
	)
}

export default UploadImage
