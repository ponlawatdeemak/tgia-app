import {
	Autocomplete,
	AutocompleteProps,
	FormControl,
	FormHelperText,
	FormLabel,
	OutlinedInput,
	Paper,
} from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'

export interface AutocompleteInputProps extends Omit<AutocompleteProps<any, false, false, false>, 'renderInput'> {
	name: string
	formik?: FormikProps<any>
	label: string
	startAdornment?: React.JSX.Element
	placeholder?: string
	required?: boolean
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
	name,
	formik,
	label,
	options,
	startAdornment,
	placeholder = '',
	className,
	size = 'small',
	required = false,
	...props
}) => {
	const errorMessage = formik?.touched[name] && formik?.errors[name]
	return (
		<FormControl className={className} required={required}>
			<FormLabel id={`${name}-label`} className='mb-2 [&_.MuiFormLabel-asterisk]:text-error'>
				{label}
			</FormLabel>
			<Autocomplete
				{...props}
				options={options}
				size={size}
				PaperComponent={({ children }) => (
					<Paper className='border-[1px] border-solid border-gray'>{children}</Paper>
				)}
				value={options.find((option) => option.value === formik?.values[name]) || null}
				onChange={(event, newValue) => {
					return formik?.setFieldValue(name, newValue ? newValue.value : null)
				}}
				renderInput={(params) => {
					const { InputLabelProps, InputProps, ...otherParams } = params
					return (
						<OutlinedInput
							{...otherParams}
							{...params.InputProps}
							startAdornment={startAdornment}
							id={`${name}-input`}
							placeholder={placeholder}
							error={formik?.touched[name] && Boolean(formik?.errors[name])}
						/>
					)
				}}
			/>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default AutocompleteInput
