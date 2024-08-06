'use client'

import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './FieldLossSummary'

export const FieldLossMain = () => {
	return (
		<div className='flex flex-grow flex-col gap-y-[16px]'>
			<SearchForm />
			<Paper className='flex h-full overflow-hidden rounded-none px-4 lg:mx-4 lg:rounded-lg'>
				{/* <FieldLossSummary /> */}
				<div className='relative'>
					<MapView />
				</div>
			</Paper>
		</div>
	)
}
