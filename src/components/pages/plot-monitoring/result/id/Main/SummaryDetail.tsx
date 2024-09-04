import { Box, Tab, Tabs, Divider, Button } from '@mui/material'
import React, { useState } from 'react'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import { useTranslation } from 'react-i18next'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { ResponseLanguage } from '@/api/interface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import { GetPlotActivityLossDetailDtoOut, GetPlotActivityPlantDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'

interface SummaryDetailProps {
	activityId: number
	plotDetail: string
	plantDetailData: GetPlotActivityPlantDetailDtoOut | undefined
	lossDetailData: GetPlotActivityLossDetailDtoOut | undefined
	setPlotDetail: React.Dispatch<React.SetStateAction<string>>
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({
	activityId,
	plotDetail,
	plantDetailData,
	lossDetailData,
	setPlotDetail,
}) => {
	const router = useRouter()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='lg:bg-bg-white box-border flex flex-col gap-0 bg-white p-4 lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto lg:px-6 lg:py-4'>
			<Box className='flex h-full flex-col gap-4 overflow-y-auto'>
				<div className='flex flex-col gap-1'>
					<div className='mb-2 flex flex-row items-center'>
						<Button onClick={() => router.push(AppPath.PlotMonitoringResult)}>
							<ArrowBackIcon fontSize='small' className='text-black' />
						</Button>
						<div className='flex text-md font-semibold'>
							{`${t('referenceCode', { ns: 'plot-monitoring' })} : ${activityId}`}
						</div>
					</div>

					<Divider />
					<div className='mb-2 mt-3 flex text-base font-semibold'>
						{`${t('occurrence', { ns: 'plot-monitoring' })} ${plantDetailData?.count} ${t(`${lossDetailData?.lossPredicted.lossType}`)}`}
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{t('dataSetYear', { ns: 'plot-monitoring' })}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.year[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('location', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.address[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('area')}`}</div>:
						<div className='flex flex-wrap font-semibold'>
							{`${plantDetailData?.actArea.areaRai} ${t('areaRai', { ns: 'plot-monitoring' })} ${plantDetailData?.actArea.areaNgan} ${t('areaNgan', { ns: 'plot-monitoring' })} ${plantDetailData?.actArea.areaWa} ${t('squareWa', { ns: 'plot-monitoring' })}`}
						</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('complianceStatus', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.publicStatus[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('insuranceStatus', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.insuredStatus[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('insurance', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.insuredType[language]}</div>
					</div>
					<div className='flex w-full flex-row gap-1 text-sm'>
						<div className='flex shrink-0'>{`${t('riskAreas', { ns: 'plot-monitoring' })}`}</div>:
						<div className='flex flex-wrap font-semibold'>{plantDetailData?.riskType[language]}</div>
					</div>
				</div>
				<div className='flex flex-col'>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={plotDetail}
							onChange={(event, newValue) => {
								setPlotDetail(newValue)
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

					{plotDetail === 'plantDetail' ? (
						<PlantDetail plantDetailData={plantDetailData} />
					) : (
						<LossDetail lossDetailData={lossDetailData} />
					)}
				</div>
			</Box>
		</div>
	)
}

export default SummaryDetail
