'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Paper } from '@mui/material'
import SummaryDetail from './SummaryDetail'
import MapDetail from './MapDetail'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'

export const PlotMonitoringDetailMain = () => {
	const pathname = usePathname()
	const activityId = Number(pathname.split('/').pop())

	const [plotDetail, setPlotDetail] = useState<string>('plantDetail')

	const { data: plantDetailData, isLoading: isPlantDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityPlantDetail', activityId],
		queryFn: () => service.plotMonitoring.getPlotActivityPlantDetail({ activityId }),
	})

	const { data: lossDetailData, isLoading: isLossDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityLossDetail', activityId],
		queryFn: () => service.plotMonitoring.getPlotActivityLossDetail({ activityId }),
	})

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-102px)] lg:rounded-lg'>
				<div className='box-border flex w-full overflow-auto px-4 max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light max-lg:pb-4 lg:px-0'>
					<SummaryDetail
						activityId={activityId}
						plotDetail={plotDetail}
						plantDetailData={plantDetailData?.data}
						lossDetailData={lossDetailData?.data}
						setPlotDetail={setPlotDetail}
					/>
					<MapDetail
						activityId={activityId}
						plotDetail={plotDetail}
						lossType={lossDetailData?.data?.lossType}
					/>
				</div>
			</Paper>
		</div>
	)
}
