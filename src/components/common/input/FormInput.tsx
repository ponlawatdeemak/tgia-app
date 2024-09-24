import { FormControl, FormHelperText, FormLabel, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'

export interface FormInputProps extends OutlinedInputProps {
	name: string
	formik?: FormikProps<any>
	required?: boolean
}

const FormInput: React.FC<FormInputProps> = ({
	formik,
	name,
	label,
	className,
	required = false,
	fullWidth = true,
	value,
	...props
}) => {
	const errorMessage = formik?.touched[name] && formik?.errors[name]
	return (
		<FormControl fullWidth={fullWidth} required={required} className={className}>
			<FormLabel id={`${name}-label`} className='mb-2'>
				{label}
			</FormLabel>
			<OutlinedInput
				onChange={formik?.handleChange}
				{...props}
				id={`${name}-input`}
				name={name}
				size='small'
				value={formik?.values[name] || value}
				error={formik?.touched[name] && Boolean(formik?.errors[name])}
			/>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default FormInput
