import { Box, Tab, Tabs, Typography, Divider } from '@mui/material'
import React, { useState } from 'react'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import { useTranslation } from 'react-i18next'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { ResponseLanguage } from '@/api/interface'

interface SummaryDetailProps {
	activityId: number
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({ activityId }) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
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
		<div className='box-border flex flex-col gap-0 bg-gray-light bg-white p-0 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:bg-gray-light2 lg:px-6 lg:py-4'>
			<Box className='flex h-full flex-col gap-4 overflow-y-auto'>
				<div className='flex flex-col gap-1'>
					<div className='mb-2 flex text-lg font-semibold'>{`${t('referenceCode', { ns: 'plot-monitoring' })} : ${activityId}`}</div>
					<Divider />
					<div className='mb-2 mt-3 flex text-md font-semibold'>
						{t(`${lossDetailData?.data?.lossPredicted.lossType}`)} ครั้งที่ --??--
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>ปีชุดข้อมูล</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.data?.year[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>{`${t('location', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.data?.address[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>{`${t('area')}`}</div>:
						<div className='flex flex-wrap font-semibold'>
							{plantDetailData?.data?.actArea.areaRai} ไร่ {plantDetailData?.data?.actArea.areaNgan} งาน{' '}
							{plantDetailData?.data?.actArea.areaWa} ตารางวา
						</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>
							{`${t('complianceStatus', { ns: 'plot-monitoring' })}`}
						</div>
						:
						<div className='flex flex-wrap font-semibold'>
							{plantDetailData?.data?.publicStatus[language]}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>
							{`${t('insuranceStatus', { ns: 'plot-monitoring' })}`}
						</div>
						:
						<div className='flex flex-wrap font-semibold'>
							{plantDetailData?.data?.insuredType[language]}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>{`${t('insurance', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>--??--</div>
					</div>
					<div className='flex w-full flex-row gap-1'>
						<div className='flex shrink-0 text-base'>{`${t('riskAreas', { ns: 'plot-monitoring' })}`}</div>:
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
							<Tab className='font-semibold' label='ข้อมูลเพราะปลูก' value={'plantDetail'} />
							<Tab className='font-semibold' label='ข้อมูลภัยพิบัติ' value={'lossDetail'} />
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
