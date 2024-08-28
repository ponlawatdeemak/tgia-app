import { ResponseLanguage } from '@/api/interface'
import { GetPlotActivityPlantDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const PlantDetail = ({ plantDetailData }: { plantDetailData?: GetPlotActivityPlantDetailDtoOut }) => {
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='flex flex-col gap-2 pt-2'>
			<div className='mb-2 mt-2 flex text-md font-semibold'>
				{t('informationFromTBOG', { ns: 'plot-monitoring' })}
			</div>
			<div className='flex w-full flex-row justify-between text-md'>
				<div className='flex shrink-0'>{`${t('cultivationStartDate', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.plantDate[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-md'>
				<div className='flex shrink-0'>{`${t('expectedHarvestDate', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.produceDate[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-md'>
				<div className='flex shrink-0'>{`${t('riceVarietyType', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.riceType[language]}</div>
			</div>
			<div className='flex w-full flex-row justify-between text-md'>
				<div className='flex shrink-0'>{`${t('cropType', { ns: 'plot-monitoring' })} :`}</div>
				<div className='flex flex-wrap font-medium'>{plantDetailData?.detailType[language]}</div>
			</div>
			<div className='my-2 flex w-full flex-row text-base text-gray-light4'>
				<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} --??--`}</div>
			</div>

			<div className='mb-2 mt-2 flex text-md font-semibold'>
				{t('analyzeRiceCultivationAreaData', { ns: 'plot-monitoring' })}
			</div>
			<Box className='flex flex-col gap-2 rounded-lg border border-solid border-gray p-2'>
				<Box className='flex items-center justify-between'>
					<div className='flex items-center gap-1'>
						<div className='flex items-baseline gap-1'>
							<span className='text-base text-black'>{t('canGrowRice', { ns: 'plot-monitoring' })}</span>
							<span className='text-base font-semibold text-secondary'>
								{plantDetailData?.predictedRiceArea.percent + '%'}
							</span>
						</div>
					</div>
					<div className='flex items-baseline gap-1'>
						<span className='text-base font-semibold text-secondary'>
							{plantDetailData?.predictedRiceArea.areaRai}
						</span>
						<span className='text-base font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
				<Box className='flex items-center justify-between'>
					<div className='flex items-baseline gap-1'>
						<span className='text-left text-base font-normal text-black'>
							{t('notARiceCultivationArea', { ns: 'plot-monitoring' })}
						</span>
						<span className='text-base font-semibold text-secondary'>
							{plantDetailData?.predictedNonRiceArea.percent + '%'}
						</span>
					</div>
					<div className='flex items-baseline gap-1'>
						<span className='text-base font-semibold text-secondary'>
							{plantDetailData?.predictedNonRiceArea.areaRai}
						</span>
						<span className='text-base font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
				<Box className='flex items-center justify-between'>
					<span className='text-left text-base font-normal text-black'>
						{t('registeredAreasWithPlotBoundaries', { ns: 'plot-monitoring' })}
					</span>
					<div className='flex items-baseline gap-1'>
						<span className='text-base font-semibold text-black-light'>
							{(plantDetailData?.predictedNonRiceArea.areaRai as number) +
								(plantDetailData?.predictedRiceArea.areaRai as number)}
						</span>
						<span className='text-base font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
			</Box>
			<div className='my-2 flex w-full flex-row text-base text-gray-light4'>
				<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} --??--`}</div>
			</div>
		</div>
	)
}

export default PlantDetail
