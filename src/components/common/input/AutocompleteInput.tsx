import { Autocomplete, FormControl, FormHelperText, FormLabel, OutlinedInput, OutlinedInputProps } from '@mui/material'
import { FormikProps } from 'formik'
import React from 'react'

interface CountryType {
	label: string
	value: number
}

export interface AutocompleteInputProps extends OutlinedInputProps {
	name: string
	formik: FormikProps<any>
	options: CountryType[]
	disabled?: boolean
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
	options,
	formik,
	name,
	label,
	className,
	disabled = false,
	...props
}) => {
	const errorMessage = formik.touched[name] && formik.errors[name]
	return (
		<FormControl className={className}>
			<FormLabel id={`${name}-label`} className='mb-2'>
				{label}
			</FormLabel>
			<Autocomplete
				options={options}
				getOptionLabel={(option) => option.label}
				disabled={disabled}
				size='small'
				value={formik.values[name]}
				onChange={(event, newValue) => {
					return formik.setFieldValue(name, newValue)
				}}
				renderInput={(params) => {
					const { InputLabelProps, InputProps, ...otherParams } = params
					return (
						<OutlinedInput
							{...otherParams}
							{...params.InputProps}
							id={`${name}-input`}
							error={formik.touched[name] && Boolean(formik.errors[name])}
							{...props}
						/>
					)
				}}
			/>
			{typeof errorMessage === 'string' && <FormHelperText error>{errorMessage}</FormHelperText>}
		</FormControl>
	)
}

export default AutocompleteInput
