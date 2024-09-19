import * as React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

export default function FormPropsTextFields() {
	return (
		<Box
			component='form'
			sx={{
				'& .MuiTextField-root': { m: 1, width: '25ch' },
			}}
			noValidate
			autoComplete='off'
		>
			<div>
				<TextField required id='outlined-required' label='Required' defaultValue='Hello World' />
				<TextField disabled id='outlined-disabled' label='Disabled' defaultValue='Hello World' />
				<TextField
					id='outlined-password-input'
					label='Password'
					type='password'
					autoComplete='current-password'
				/>
				<TextField id='outlined-search' label='Search field' type='search' />
				<TextField
					id='outlined-helperText'
					label='Helper text'
					defaultValue='Default Value'
					helperText='Some important text'
				/>
			</div>
			<div>
				<TextField required id='filled-required' label='Required' defaultValue='Hello World' variant='filled' />
				<TextField disabled id='filled-disabled' label='Disabled' defaultValue='Hello World' variant='filled' />
				<TextField
					id='filled-password-input'
					label='Password'
					type='password'
					autoComplete='current-password'
					variant='filled'
				/>
				<TextField
					id='filled-read-only-input'
					label='Read Only'
					defaultValue='Hello World'
					InputProps={{
						readOnly: true,
					}}
					variant='filled'
				/>
			</div>
			<div>
				<TextField
					required
					id='standard-required'
					label='Required'
					defaultValue='Hello World'
					variant='standard'
				/>
				<TextField
					disabled
					id='standard-disabled'
					label='Disabled'
					defaultValue='Hello World'
					variant='standard'
				/>
				<TextField
					id='standard-number'
					label='Number'
					type='number'
					InputLabelProps={{
						shrink: true,
					}}
					variant='standard'
				/>
				<TextField id='standard-search' label='Search field' type='search' variant='standard' />
				<TextField
					id='standard-helperText'
					label='Helper text'
					defaultValue='Default Value'
					helperText='Some important text'
					variant='standard'
				/>
			</div>
			<Box p={2}>This paragraph contains a lot of lines in the source code, but the browser ignores it.</Box>
		</Box>
	)
}
