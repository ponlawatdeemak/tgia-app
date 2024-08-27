import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'
import React from 'react'

const MapDetail = () => {
	return (
		<Paper className='relative max-lg:flex max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:block lg:flex-grow'>
			<div className='relative h-[390px] w-full max-lg:overflow-hidden max-lg:rounded lg:h-full'>
				<MapView />
			</div>
		</Paper>
	)
}

export default MapDetail
