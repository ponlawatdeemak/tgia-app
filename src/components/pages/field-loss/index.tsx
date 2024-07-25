'use client'
import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'

const FieldLossMain = () => {
	return (
		<div className='flex flex-grow flex-col gap-y-6'>
			<div className='rounded-lg bg-white p-4'>Search Bar</div>
			<Paper className='relative block flex-grow'>
				<MapView />
			</Paper>
		</div>
	)
}

export default FieldLossMain
