import { ResponseLanguage } from '@/api/interface'
import { GetPlotActivityLossDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { WaterOutlined, WbSunnyOutlined } from '@mui/icons-material'
import { Box, Divider } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface LossDetailProps {
	lossDetailData?: GetPlotActivityLossDetailDtoOut
}

const LossDetail: React.FC<LossDetailProps> = ({ lossDetailData }) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return lossDetailData?.lossType === 'noData' ? (
		<Box className='flex h-full items-center justify-center max-lg:rounded max-lg:border max-lg:border-solid max-lg:border-gray max-lg:p-4'>
			<span className='text-base font-normal text-gray-dark2'>{t('noDisaster')}</span>
		</Box>
	) : (
		<>
			<div className='flex flex-col-reverse gap-3 pb-4 pt-3 lg:flex-col'>
				<Box className='flex flex-col gap-3 max-lg:rounded max-lg:border max-lg:border-solid max-lg:border-gray max-lg:p-4'>
					<div className='flex text-base font-semibold text-black-dark'>
						{t('damagedAreaReportedAccordingToGSO.02', { ns: 'plot-monitoring' })}
					</div>
					<Box className='flex flex-col overflow-hidden rounded-lg border border-solid border-gray'>
						<div className='flex flex-col gap-2 p-2'>
							<Box className='flex items-center justify-between'>
								<div className='flex items-center gap-1'>
									<span className='text-base text-black'>
										{t('reportedDamagedArea', { ns: 'plot-monitoring' })}
									</span>
								</div>
								<div className='flex items-baseline gap-1'>
									<span className='text-base font-semibold text-black-light'>
										{lossDetailData?.disasterArea?.areaRai}
									</span>
									<span className='text-base font-normal text-black'>{t('areaRai')}</span>
								</div>
							</Box>
							<Box className='flex items-center justify-between'>
								<span className='text-left text-base font-normal text-black'>
									{t('insuredAreasWithPlotBoundaries', { ns: 'plot-monitoring' })}
								</span>
								<div className='flex items-baseline gap-1'>
									<span className='text-base font-semibold text-black-light'>
										{lossDetailData?.actArea?.areaRai}
									</span>
									<span className='text-base font-normal text-black'>{t('areaRai')}</span>
								</div>
							</Box>
						</div>
						<Divider />
						<div className='flex flex-col gap-2 bg-gray-light2 p-2'>
							<span className='text-left text-sm font-normal text-black'>
								{t('damageReportDateAccordingToGSO.02', { ns: 'plot-monitoring' })}
							</span>
							<span className='text-left text-sm font-semibold text-black-light'>
								{lossDetailData?.updateDisasterDate?.[language]}
							</span>
						</div>
					</Box>
					<div className='flex w-full flex-row text-sm font-medium text-gray-dark2'>
						<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${lossDetailData?.updateDisasterDate?.[language] || ''}`}</div>
					</div>
				</Box>

				<Divider className='max-lg:hidden' />

				<Box className='flex flex-col gap-3 max-lg:rounded max-lg:border max-lg:border-solid max-lg:border-gray max-lg:p-4'>
					<div className='flex text-base font-semibold text-black-dark'>
						{t('totalDamagedAreaFromAnalysis', { ns: 'plot-monitoring' })}
					</div>
					<Box className='flex flex-col overflow-hidden rounded-lg border border-solid border-gray'>
						<div className='flex flex-col gap-2 p-2'>
							<Box className='flex items-center justify-between'>
								<div className='flex items-center gap-1'>
									{!['noData', 'noDamage'].includes(lossDetailData?.lossPredicted?.lossType || '') ? (
										lossDetailData?.lossPredicted?.lossType === 'drought' ? (
											<WbSunnyOutlined className='h-5 w-5 font-light text-lossTypeIcon-drought' />
										) : (
											<WaterOutlined className='h-5 w-5 font-light text-lossTypeIcon-flood' />
										)
									) : (
										''
									)}
									<div className='flex items-baseline gap-1'>
										<span className='text-base text-black'>
											{lossDetailData?.lossPredicted?.lossType
												? ['noData', 'noDamage'].includes(
														lossDetailData.lossPredicted?.lossType,
													)
													? t('noDisaster')
													: t(`${lossDetailData.lossPredicted?.lossType}`)
												: ''}
										</span>
										<span className='text-base font-semibold text-secondary'>
											{lossDetailData?.lossPredicted?.percent
												? `${lossDetailData?.lossPredicted?.percent}%`
												: ''}
										</span>
									</div>
								</div>
								<div className='flex items-baseline gap-1'>
									<span className='text-base font-semibold text-secondary'>
										{lossDetailData?.lossPredicted?.areaRai}
									</span>
									<span className='text-base font-normal text-black'>{t('areaRai')}</span>
								</div>
							</Box>
							<Box className='flex items-center justify-between'>
								<span className='text-left text-base font-normal text-black'>
									{t('insuredAreasWithPlotBoundaries', { ns: 'plot-monitoring' })}
								</span>
								<div className='flex items-baseline gap-1'>
									<span className='text-base font-semibold text-black-light'>
										{lossDetailData?.predictedRiceArea?.areaRai}
									</span>
									<span className='text-base font-normal text-black'>{t('areaRai')}</span>
								</div>
							</Box>
						</div>
						<Divider />
						<div className='flex flex-col gap-2 bg-gray-light2 p-2'>
							<span className='text-left text-sm font-normal text-black'>
								{t('damagedAreaDateFromAnalysis', { ns: 'plot-monitoring' })}
							</span>
							<span className='text-left text-sm font-semibold text-black-light'>
								{`${lossDetailData?.startObsDate?.[language] || ''} - ${lossDetailData?.endObsDate?.[language] || ''}`}
							</span>
						</div>
					</Box>
					<div className='flex w-full flex-row text-sm font-medium text-gray-dark2'>
						<div className='flex shrink-0'>{`${t('lastUpdated', { ns: 'plot-monitoring' })} ${lossDetailData?.predictedLossDate?.[language] || ''}`}</div>
					</div>
				</Box>
			</div>
		</>
	)
}

export default LossDetail
