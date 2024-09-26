import { Box, Tab, Tabs, Divider, Button, CircularProgress } from '@mui/material'
import React from 'react'
import PlantDetail from '../Detail/PlantDetail'
import LossDetail from '../Detail/LossDetail'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import { GetPlotActivityLossDetailDtoOut, GetPlotActivityPlantDetailDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import classNames from 'classnames'
import useResponsive from '@/hook/responsive'

interface SummaryDetailProps {
	activityId: number
	plotDetail: string
	plantDetailData: GetPlotActivityPlantDetailDtoOut | undefined
	isPlantDetailDataLoading: boolean
	lossDetailData: GetPlotActivityLossDetailDtoOut | undefined
	isLossDetailDataLoading: boolean
	setPlotDetail: React.Dispatch<React.SetStateAction<string>>
}

const SummaryDetail: React.FC<SummaryDetailProps> = ({
	activityId,
	plotDetail,
	plantDetailData,
	isPlantDetailDataLoading,
	lossDetailData,
	isLossDetailDataLoading,
	setPlotDetail,
}) => {
	const { isDesktop } = useResponsive()
	const router = useRouter()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	return (
		<div className='lg:bg-bg-white box-border flex flex-col gap-0 bg-white lg:w-[30%] lg:min-w-[360px] lg:max-w-[580px] lg:gap-4 lg:overflow-auto'>
			{isDesktop && (isPlantDetailDataLoading || isLossDetailDataLoading) ? (
				<div className='flex h-60 flex-col items-center justify-center bg-white lg:h-full'>
					<CircularProgress size={80} color='primary' />
				</div>
			) : (
				<Box className='flex h-full flex-col gap-3'>
					<div className='flex flex-col gap-1'>
						<div className='mx-4 mb-2 mt-4 flex flex-row items-center gap-3 lg:mx-6'>
							<Button
								className='flex min-w-8 border border-solid border-gray p-1.5'
								onClick={() => router.back()}
							>
								<ArrowBackIcon fontSize='small' className='h-5 w-5 text-black' />
							</Button>
							<div className='flex text-md font-semibold text-black'>
								{`${t('referenceCode', { ns: 'plot-monitoring' })} : ${activityId}`}
							</div>
						</div>

						<Divider />
						<div className='mx-6 mt-3 flex text-base font-semibold text-black lg:mb-2'>
							{['noData', 'noDamage'].includes(plantDetailData?.lossType || '')
								? t('noDisaster')
								: `${t('occurrence', { ns: 'plot-monitoring' })} ${plantDetailData?.count || ''} ${t(`${plantDetailData?.lossType || ''}`)}`}
						</div>
						<Box className='mx-4 flex flex-col gap-1 max-lg:mt-2 max-lg:rounded max-lg:bg-[#F2F2F2] max-lg:p-2 lg:mx-6'>
							<div className='flex w-full flex-row gap-1 text-sm text-black max-lg:hidden'>
								<div className='flex shrink-0'>{t('dataSetYear', { ns: 'plot-monitoring' })}</div>:
								<div className='flex flex-wrap font-semibold'>{plantDetailData?.year[language]}</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black'>
								<div className='flex shrink-0'>{`${t('location', { ns: 'plot-monitoring' })}`}</div>:
								<div className='flex flex-wrap font-semibold'>{plantDetailData?.address[language]}</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black max-lg:hidden'>
								<div className='flex shrink-0'>{`${t('area')}`}</div>:
								<div className='flex flex-wrap font-semibold'>
									{`${plantDetailData?.actArea.areaRai || ''} ${t('areaRai', { ns: 'plot-monitoring' })} ${plantDetailData?.actArea.areaNgan || ''} ${t('areaNgan', { ns: 'plot-monitoring' })} ${plantDetailData?.actArea.areaWa || ''} ${t('squareWa', { ns: 'plot-monitoring' })}`}
								</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black'>
								<div className='flex shrink-0'>{`${t('complianceStatus', { ns: 'plot-monitoring' })}`}</div>
								:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.publicStatus[language]}
								</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black lg:hidden'>
								<div className='flex shrink-0'>{`${t('riceVarietyType', { ns: 'plot-monitoring' })}`}</div>
								:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.riceType[language]}
								</div>
							</div>

							<div className='flex w-full flex-row gap-1 text-sm text-black lg:hidden'>
								<div className='flex shrink-0'>{`${t('cropType', { ns: 'plot-monitoring' })}`}</div>:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.detailType[language]}
								</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black max-lg:hidden'>
								<div className='flex shrink-0'>{`${t('insuranceStatus', { ns: 'plot-monitoring' })}`}</div>
								:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.insuredStatus[language]}
								</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black'>
								<div className='flex shrink-0'>{`${t('insurance', { ns: 'plot-monitoring' })}`}</div>:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.insuredType[language]}
								</div>
							</div>
							<div className='flex w-full flex-row gap-1 text-sm text-black'>
								<div className='flex shrink-0'>{`${t('riskAreas', { ns: 'plot-monitoring' })}`}</div>:
								<div className='flex flex-wrap font-semibold'>
									{plantDetailData?.riskType[language]}
								</div>
							</div>
						</Box>
					</div>
					<div className='flex h-full flex-col px-6'>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
							<Tabs
								className='[&_.MuiTabs-flexContainer]:gap-2'
								value={plotDetail}
								onChange={(event, newValue) => {
									setPlotDetail(newValue)
								}}
							>
								<Tab
									className={classNames('px-3 text-base font-normal text-black', {
										'!font-semibold': plotDetail === 'plantDetail',
									})}
									label={t('cultivationData', { ns: 'plot-monitoring' })}
									value={'plantDetail'}
								/>
								<Tab
									className={classNames('px-3 text-base font-normal text-black', {
										'!font-semibold': plotDetail === 'lossDetail',
									})}
									label={t('disasterInformation', { ns: 'plot-monitoring' })}
									value={'lossDetail'}
								/>
							</Tabs>
						</Box>

						<div className='h-full max-lg:hidden'>
							{plotDetail === 'plantDetail' ? (
								<PlantDetail plantDetailData={plantDetailData} />
							) : (
								<LossDetail lossDetailData={lossDetailData} />
							)}
						</div>
					</div>
				</Box>
			)}
		</div>
	)
}

export default SummaryDetail
