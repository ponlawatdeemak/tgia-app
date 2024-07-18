import { FormControl, FormHelperText, FormLabel, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'

export interface FormInputProps extends OutlinedInputProps {
	name: string
	formik: FormikProps<any>
	required?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
	formik,
	name,
	label,
	className,
	required = false,
	fullWidth = true,
	...props
}) => {
	const errorMessage = formik.touched[name] && formik.errors[name]
	return (
		<FormControl fullWidth={fullWidth} required={required} className={className}>
			<FormLabel id={`${name}-label`} className='mb-2'>
				{label}
			</FormLabel>
			<OutlinedInput
				{...props}
				id={`${name}-input`}
				name={name}
				size='small'
				value={formik.values[name]}
				onChange={formik.handleChange}
				error={formik.touched[name] && Boolean(formik.errors[name])}
			/>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default FormInput
