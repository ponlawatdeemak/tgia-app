import { ResponseLanguage } from '@/api/interface'
import { GetPlotActivityPlantDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface PlantDetailProps {
	plantDetailData?: GetPlotActivityPlantDetailDtoOut
}

const PlantDetail: React.FC<PlantDetailProps> = ({ plantDetailData }) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='flex flex-col-reverse gap-3 pb-4 pt-3 lg:flex-col'>
			<Box className='flex flex-col gap-3 max-lg:rounded max-lg:border max-lg:border-solid max-lg:border-gray max-lg:p-4'>
				<div className='flex text-base font-semibold text-black-dark'>
					{t('informationFromTBOG', { ns: 'plot-monitoring' })}
				</div>
				<Box className='flex flex-row gap-2 lg:flex-col lg:gap-3'>
					<div className='flex w-full flex-col justify-between text-sm text-black max-lg:gap-1 max-lg:rounded max-lg:bg-[#F2F2F2] max-lg:p-2 lg:flex-row lg:text-base'>
						<div className='flex shrink-0'>{`${t('cultivationStartDate', { ns: 'plot-monitoring' })} :`}</div>
						<div className='flex flex-wrap font-semibold max-lg:!text-[#575757] lg:font-medium'>
							{plantDetailData?.plantDate[language]}
						</div>
					</div>
					<div className='flex w-full flex-col justify-between text-sm text-black max-lg:gap-1 max-lg:rounded max-lg:bg-[#F2F2F2] max-lg:p-2 lg:flex-row lg:text-base'>
						<div className='flex shrink-0'>{`${t('expectedHarvestDate', { ns: 'plot-monitoring' })} :`}</div>
						<div className='flex flex-wrap font-semibold max-lg:!text-[#575757] lg:font-medium'>
							{plantDetailData?.produceDate[language]}
						</div>
					</div>
				</Box>
				<div className='flex w-full flex-row justify-between text-base text-black'>
					<div className='flex shrink-0'>{`${t('riceVarietyType', { ns: 'plot-monitoring' })} :`}</div>
					<div className='flex flex-wrap font-medium'>{plantDetailData?.riceType[language]}</div>
				</div>
				<div className='flex w-full flex-row justify-between text-base text-black'>
					<div className='flex shrink-0'>{`${t('cropType', { ns: 'plot-monitoring' })} :`}</div>
					<div className='flex flex-wrap font-medium'>{plantDetailData?.detailType[language]}</div>
				</div>
				<div className='flex w-full flex-row text-sm font-medium text-gray-dark2'>
					<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${plantDetailData?.updateDoaeDate[language]}`}</div>
				</div>
			</Box>

			<Box className='flex flex-col gap-3 max-lg:rounded max-lg:border max-lg:border-solid max-lg:border-gray max-lg:p-4'>
				<div className='flex text-base font-semibold text-black-dark'>
					{t('analyzeRiceCultivationAreaData', { ns: 'plot-monitoring' })}
				</div>
				<Box className='flex flex-col gap-2 rounded-lg border border-solid border-gray p-2'>
					<Box className='flex items-center justify-between'>
						<div className='flex items-center gap-1'>
							<div className='flex items-baseline gap-1 text-base'>
								<span className='text-black'>{t('canGrowRice', { ns: 'plot-monitoring' })}</span>
								<span className='font-semibold text-secondary'>
									{plantDetailData?.predictedRiceArea.percent
										? `${plantDetailData.predictedRiceArea.percent}%`
										: ''}
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
								{plantDetailData?.predictedNonRiceArea.percent
									? `${plantDetailData.predictedNonRiceArea.percent}%`
									: ''}
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
							<span className='font-semibold text-black-light'>{plantDetailData?.actArea.areaRai}</span>
							<span className='font-normal text-black'>{t('areaRai')}</span>
						</div>
					</Box>
				</Box>
				<div className='flex w-full flex-row text-sm font-medium text-gray-dark2'>
					<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${plantDetailData?.predictedRiceAreaDate[language] || ''}`}</div>
				</div>
			</Box>
		</div>
	)
}

export default PlantDetail
