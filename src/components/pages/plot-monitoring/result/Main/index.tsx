'use client'

import PlotMonitoringSearchForm from './SearchForm'
import PlotMonitoringFilter from './Filter'
import PlotMonitoringList from './List'
import { Paper } from '@mui/material'
import { useState } from 'react'

export const PlotMonitoringResultMain = () => {
	const [isFullList, setIsFullList] = useState<boolean>(false)

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			<PlotMonitoringSearchForm />
			<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-154px)] lg:rounded-lg'>
				<div className='box-border flex w-full overflow-auto px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light max-lg:pb-4 lg:px-0'>
					<PlotMonitoringFilter isFullList={isFullList} />
					<PlotMonitoringList isFullList={isFullList} />
				</div>
			</Paper>
		</div>
	)
}
