'use client'

import PlotMonitoringSearchForm from './SearchForm'
import PlotMonitoringFilter from './Filter'
import PlotMonitoringList from './List'
import { Paper } from '@mui/material'
import { useRef, useState } from 'react'
import useResponsive from '@/hook/responsive'
import useSearchForm from '../../Main/context'
import { PlotMonitoringSearchMain } from '../../Main'
import { MapViewRef } from '@/components/common/map/MapView'

export const PlotMonitoringResultMain = () => {
	const { isDesktop } = useResponsive()
	const { open } = useSearchForm()
	const [isFullList, setIsFullList] = useState<boolean>(false)

	const mapViewRef = useRef<MapViewRef>(null)

	return (
		<>
			{open && !isDesktop ? (
				<PlotMonitoringSearchMain />
			) : (
				<div className='flex flex-grow flex-col gap-4 overflow-auto'>
					<PlotMonitoringSearchForm mapViewRef={mapViewRef} />
					<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-154px)] lg:rounded-lg'>
						<div className='box-border flex w-full overflow-auto max-lg:flex-col'>
							<PlotMonitoringFilter isFullList={isFullList} />
							<PlotMonitoringList
								isFullList={isFullList}
								setIsFullList={setIsFullList}
								mapViewRef={mapViewRef}
							/>
						</div>
					</Paper>
				</div>
			)}
		</>
	)
}
