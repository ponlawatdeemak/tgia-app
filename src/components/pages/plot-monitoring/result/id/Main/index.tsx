'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Paper } from '@mui/material'
import SummaryDetail from './SummaryDetail'
import MapDetail from './MapDetail'

export const PlotMonitoringDetailMain = () => {
	const pathname = usePathname()
	const activityId = pathname.split('/').pop()

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-102px)] lg:rounded-lg'>
				<div className='box-border flex w-full overflow-auto px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light max-lg:pb-4 lg:px-0'>
					<SummaryDetail activityId={activityId} />
					<MapDetail />
				</div>
			</Paper>
		</div>
	)
}
