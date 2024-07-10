import { FormControl, FormHelperText, FormLabel, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'

interface FormInputProps extends OutlinedInputProps {
	name: string
	formik: FormikProps<any>
}

const FormInput: React.FC<FormInputProps> = ({ formik, name, label, className, ...props }) => {
	const errorMessage = formik.touched[name] && formik.errors[name]
	return (
		<FormControl fullWidth className={className}>
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
