'use client'

import PlotMonitoringSearchForm from './SearchForm'
import PlotMonitoringFilter from './Filter'
import PlotMonitoringList from './List'
import { Paper } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import useResponsive from '@/hook/responsive'
import useSearchForm from '../../Main/context'
import { PlotMonitoringSearchMain } from '../../Main'
// import { MapViewRef } from '@/components/common/map/MapView'
import { useSearchParams } from 'next/navigation'
import useSearchPlotMonitoring from './context'

export const PlotMonitoringResultMain = () => {
	const { isDesktop } = useResponsive()
	const searchParams = useSearchParams()
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { open } = useSearchForm()
	const [isFullList, setIsFullList] = useState<boolean>(false)
	const provinceCode = searchParams.get('provinceCode')
	const [areaDetail, setAreaDetail] = useState('cards')

	useEffect(() => {
		setQueryParams({ ...queryParams, provinceCode: provinceCode ? parseInt(provinceCode) : undefined })
	}, [])

	// TO DO
	// const mapViewRef = useRef<MapViewRef>(null)

	return (
		<>
			{open && !isDesktop ? (
				<PlotMonitoringSearchMain isEditAdminPoly />
			) : (
				<div className='flex flex-grow flex-col gap-4 overflow-auto'>
					<PlotMonitoringSearchForm
						// TO DO
						// mapViewRef={mapViewRef}
						areaDetail={areaDetail}
					/>
					<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-154px)] lg:rounded-lg'>
						<div className='box-border flex w-full overflow-auto max-lg:flex-col'>
							<PlotMonitoringFilter isFullList={isFullList} />
							<PlotMonitoringList
								areaDetail={areaDetail}
								isFullList={isFullList}
								setAreaDetail={setAreaDetail}
								setIsFullList={setIsFullList}
								// TO DO
								// mapViewRef={mapViewRef}
							/>
						</div>
					</Paper>
				</div>
			)}
		</>
	)
}
