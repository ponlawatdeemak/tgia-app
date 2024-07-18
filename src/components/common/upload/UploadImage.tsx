import React, { useState, ChangeEvent } from 'react'
import { styled } from '@mui/material/styles'
import { FormikProps } from 'formik'
import { Button, Avatar, FormHelperText } from '@mui/material'
import Icon from '@mdi/react'
import { mdiTrayArrowUp, mdiAccountOutline } from '@mdi/js'

export interface UploadImageProps {
	name: string
	formik: FormikProps<any>
	className: string
	defaultImage?: string
	[key: string]: unknown
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
})

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
				<Avatar
					src={image}
					alt='Profile Image'
					sx={{
						width: 120,
						height: 120,
						backgroundColor: '#EDF8F4',
					}}
				/>
			) : (
				<Avatar
					sx={{
						width: 120,
						height: 120,
						backgroundColor: '#EDF8F4',
					}}
				>
					<Icon path={defaultImage} className='text-primary' size='90px' />
				</Avatar>
			)}
			<Button
				component='label'
				role={undefined}
				variant='outlined'
				tabIndex={-1}
				startIcon={<Icon path={mdiTrayArrowUp} className='m-0 h-5 w-5 p-0' />}
			>
				อัปโหลดรูปภาพ
				<VisuallyHiddenInput
					type='file'
					accept="'image/png', 'image/jpeg'"
					onChange={handleImageChange}
					{...props}
				/>
			</Button>
			<p className='w-[123px] text-center text-sm text-[#7A7A7A]'>ขนาดไฟล์ไม่เกิน 3mb (jpg หรือ png)</p>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</div>
	)
}

export default UploadImage
