import { Button, Paper } from '@mui/material'

const FieldLossMain = () => {
	return (
		<div className='flex flex-grow flex-col gap-y-6'>
			<div className='rounded-lg bg-white p-4'>Search Bar</div>
			<Paper className='block flex-grow'>
				<Button variant='contained'>Button</Button>
			</Paper>
		</div>
	)
}

export default FieldLossMain
