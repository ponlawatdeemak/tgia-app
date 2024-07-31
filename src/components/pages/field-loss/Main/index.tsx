'use client'

import MapView from '@/components/common/map/MapView'
import { Paper } from '@mui/material'
import SearchForm from './SearchForm'
import FieldLossSummary from './FieldLossSummary'

export const FieldLossMain = () => {
	return (
		<div className='flex flex-grow flex-col gap-y-[16px]'>
			<SearchForm />
			<Paper className='flex h-full overflow-hidden'>
				<FieldLossSummary />
				<Paper className='relative block flex-grow'>
					<MapView />
				</Paper>
			</Paper>
		</div>
	)
}
