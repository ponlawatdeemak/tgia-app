import { ResponseLanguage } from '@/api/interface'
import { GetPlotActivityPlantDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PlantDetail = ({ plantDetailData }: { plantDetailData?: GetPlotActivityPlantDetailDtoOut }) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='flex flex-col gap-2 pt-2'>
			<div className='mb-2 mt-2 flex text-base font-semibold'>
				{t('informationFromTBOG', { ns: 'plot-monitoring' })}
			</div>
			<div className='flex w-full flex-row justify-between text-base'>
				<div className='flex shrink-0'>{`${t('cultivationStartDate', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.plantDate[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-base'>
				<div className='flex shrink-0'>{`${t('expectedHarvestDate', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.produceDate[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-base'>
				<div className='flex shrink-0'>{`${t('riceVarietyType', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.riceType[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-base'>
				<div className='flex shrink-0'>{`${t('cropType', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.detailType[language]}</div>
			</div>
			<div className='my-2 flex w-full flex-row text-sm text-gray-light4'>
				<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${plantDetailData?.updateDoaeDate[language]}`}</div>
			</div>

			<div className='mb-2 mt-2 flex text-base font-semibold'>
				{t('analyzeRiceCultivationAreaData', { ns: 'plot-monitoring' })}
			</div>
			<Box className='flex flex-col gap-2 rounded-lg border border-solid border-gray p-2'>
				<Box className='flex items-center justify-between'>
					<div className='flex items-center gap-1'>
						<div className='flex items-baseline gap-1 text-base'>
							<span className='text-black'>{t('canGrowRice', { ns: 'plot-monitoring' })}</span>
							<span className='font-semibold text-secondary'>
								{plantDetailData?.predictedRiceArea.percent + '%'}
							</span>
						</div>
					</div>
					<div className='flex items-baseline gap-1 text-base'>
						<span className='font-semibold text-secondary'>
							{plantDetailData?.predictedRiceArea.areaRai}
						</span>
						<span className='font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
				<Box className='flex items-center justify-between'>
					<div className='flex items-baseline gap-1 text-base'>
						<span className='text-left font-normal text-black'>
							{t('notARiceCultivationArea', { ns: 'plot-monitoring' })}
						</span>
						<span className='text font-semibold text-secondary'>
							{plantDetailData?.predictedNonRiceArea.percent + '%'}
						</span>
					</div>
					<div className='flex items-baseline gap-1 text-base'>
						<span className='font-semibold text-secondary'>
							{plantDetailData?.predictedNonRiceArea.areaRai}
						</span>
						<span className='font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
				<Box className='flex items-center justify-between'>
					<span className='text-left text-base font-normal text-black'>
						{t('registeredAreasWithPlotBoundaries', { ns: 'plot-monitoring' })}
					</span>
					<div className='flex items-baseline gap-1 text-base'>
						<span className='font-semibold text-black-light'>
							{(plantDetailData?.predictedNonRiceArea.areaRai as number) +
								(plantDetailData?.predictedRiceArea.areaRai as number)}
						</span>
						<span className='font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
			</Box>
			<div className='my-2 flex w-full flex-row text-sm text-gray-light4'>
				<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${plantDetailData?.predictedRiceAreaDate[language]}`}</div>
			</div>
		</div>
	)
}

export default PlantDetail
