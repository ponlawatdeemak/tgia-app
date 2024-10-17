'use client'

import React, { useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { CircularProgress, Paper } from '@mui/material'
import SummaryDetail from './SummaryDetail'
import MapDetail from './MapDetail'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import useResponsive from '@/hook/responsive'

export const PlotMonitoringDetailMain = () => {
	const { isDesktop } = useResponsive()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const activityId = Number(pathname.split('/').pop())
	const count = searchParams.get('count')

	const [plotDetail, setPlotDetail] = useState<string>('plantDetail')

	const { data: plantDetailData, isLoading: isPlantDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityPlantDetail', activityId, count],
		queryFn: () =>
			service.plotMonitoring.getPlotActivityPlantDetail({ activityId, count: count ? parseInt(count) : 1 }),
	})

	const { data: lossDetailData, isLoading: isLossDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityLossDetail', activityId, count],
		queryFn: () =>
			service.plotMonitoring.getPlotActivityLossDetail({
				activityId,
				count: count ? parseInt(count) : 1,
			}),
	})

	return (
		<div className='flex flex-grow flex-col gap-4 overflow-auto'>
			{!isDesktop && (isPlantDetailDataLoading || isLossDetailDataLoading) ? (
				<div className='flex h-full flex-col items-center justify-center bg-white'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<Paper className='flex h-full overflow-hidden rounded-none lg:mx-4 lg:mb-4 lg:h-[calc(100vh-86px)] lg:rounded-lg'>
					<div className='box-border flex w-full overflow-auto max-lg:flex-col max-lg:gap-3 max-lg:bg-white'>
						<SummaryDetail
							activityId={activityId}
							plotDetail={plotDetail}
							plantDetailData={plantDetailData?.data}
							isPlantDetailDataLoading={isPlantDetailDataLoading}
							lossDetailData={lossDetailData?.data}
							isLossDetailDataLoading={isLossDetailDataLoading}
							setPlotDetail={setPlotDetail}
						/>
						<MapDetail
							activityId={activityId}
							plotDetail={plotDetail}
							lossType={lossDetailData?.data?.lossType}
							plantYear={plantDetailData?.data?.year?.en}
							lossYear={lossDetailData?.data?.year?.en}
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
			)}
		</div>
	)
}
