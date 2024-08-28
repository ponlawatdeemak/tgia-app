import { Box, Tab, Tabs, Divider } from '@mui/material'
import React, { useState } from 'react'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import { useTranslation } from 'react-i18next'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { ResponseLanguage } from '@/api/interface'

interface SummaryDetailProps {
	activityId: number
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ activityId }) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	const [value, setValue] = useState<string>('plantDetail')

	const { data: plantDetailData, isLoading: isPlantDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityPlantDetail', activityId],
		queryFn: () => service.plotMonitoring.getPlotActivityPlantDetail({ activityId }),
	})

	const { data: lossDetailData, isLoading: isLossDetailDataLoading } = useQuery({
		queryKey: ['getPlotActivityLossDetail', activityId],
		queryFn: () => service.plotMonitoring.getPlotActivityLossDetail({ activityId }),
	})

	return (
		<div className='lg:bg-bg-white box-border flex flex-col gap-0 bg-white p-4 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:px-6 lg:py-4'>
			<Box className='flex h-full flex-col gap-4 overflow-y-auto'>
				<div className='flex flex-col gap-1'>
					<div className='mb-2 flex text-md font-semibold'>{`${t('referenceCode', { ns: 'plot-monitoring' })} : ${activityId}`}</div>
					<Divider />
					<div className='mb-2 mt-3 flex text-base font-semibold'>
						{`${t(`${lossDetailData?.data?.lossPredicted.lossType}`)} ${t('occurrence', { ns: 'plot-monitoring' })} --??--`}
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{t('dataSetYear', { ns: 'plot-monitoring' })}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.data?.year[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('location', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.data?.address[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('area')}`}</div>:
						<div className='flex flex-wrap font-semibold'>
							{`${plantDetailData?.data?.actArea.areaRai} ${t('areaRai', { ns: 'plot-monitoring' })} ${plantDetailData?.data?.actArea.areaNgan} ${t('areaNgan', { ns: 'plot-monitoring' })} ${plantDetailData?.data?.actArea.areaWa} ${t('squareWa', { ns: 'plot-monitoring' })}`}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('complianceStatus', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>
							{plantDetailData?.data?.publicStatus[language]}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('insuranceStatus', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>
							{plantDetailData?.data?.insuredType[language]}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('insurance', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>--??--</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('riskAreas', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.data?.riskType[language]}</div>
					</div>
				</div>
				<div className='flex flex-col'>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={value}
							onChange={(event, newValue) => {
								setValue(newValue)
							}}
						>
							<Tab
								className='text-base font-semibold'
								label={t('cultivationData', { ns: 'plot-monitoring' })}
								value={'plantDetail'}
							/>
							<Tab
								className='text-base font-semibold'
								label={t('disasterInformation', { ns: 'plot-monitoring' })}
								value={'lossDetail'}
							/>
						</Tabs>
					</Box>

					{value === 'plantDetail' ? (
						<PlantDetail plantDetailData={plantDetailData?.data} />
					) : (
						<LossDetail lossDetailData={lossDetailData?.data} />
					)}
				</div>
			</Box>
		</div>
	)
}

export default SummaryDetail
