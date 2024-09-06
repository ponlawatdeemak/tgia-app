'use client'

import React, { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Paper } from '@mui/material'
import SummaryDetail from './SummaryDetail'
import MapDetail from './MapDetail'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import useAreaType from '@/store/area-type'

export const PlotMonitoringDetailMain = () => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { areaType } = useAreaType()
	const activityId = Number(pathname.split('/').pop())
	const count = searchParams.get('count')

	const [plotDetail, setPlotDetail] = useState<string>('plantDetail')

	const { data: plantDetailData, isLoading: isPlantDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityPlantDetail', activityId, count],
		queryFn: () =>
			service.plotMonitoring.getPlotActivityPlantDetail({ activityId, count: count ? parseInt(count) : 1 }),
	})

	const { data: lossDetailData, isLoading: isLossDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityLossDetail', activityId, areaType, count],
		queryFn: () =>
			service.plotMonitoring.getPlotActivityLossDetail({
				activityId,
				registrationAreaType: areaType,
				count: count ? parseInt(count) : 1,
			}),
	})

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-86px)] lg:rounded-lg'>
				<div className='box-border flex w-full overflow-auto max-lg:flex-col max-lg:gap-3 max-lg:bg-white'>
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
					<div className='mx-4 lg:hidden'>
						{plotDetail === 'plantDetail' ? (
							<PlantDetail plantDetailData={plantDetailData?.data} />
						) : (
							<LossDetail lossDetailData={lossDetailData?.data} />
						)}
					</div>
				</div>
			</Paper>
		</div>
	)
}
