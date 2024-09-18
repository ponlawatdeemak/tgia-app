'use client'

import { GetSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { Box, Paper, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import PolygonToImage from '@/components/common/polyimg/PolygonToImage'
import { LossTypeColor } from '@/config/color'

interface CardDetailProps {
	detail: GetSearchPlotDtoOut
}

const CardDetail: React.FC<CardDetailProps> = ({ detail }) => {
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	const getColor = useCallback((lossType: string | undefined) => {
		let color = ''
		switch (lossType) {
			case 'drought':
				color = LossTypeColor.drought
				break
			case 'flood':
				color = LossTypeColor.flood
				break
			default:
				color = LossTypeColor.noData
				break
		}
		return color
	}, [])

	return (
		<div className='flex w-full flex-col gap-4 rounded bg-white p-4 lg:rounded-lg'>
			<div className='flex gap-4'>
				<Paper className='flex aspect-square h-[80px] w-[80px] items-center justify-center bg-gray-light3 sm:h-auto sm:w-[130px] lg:w-[204px]'>
					{!!detail.geometry.coordinates && (
						<PolygonToImage
							className='!h-[80px] !w-[80px] !border-none !bg-transparent [&_svg]:h-[60px] [&_svg]:w-[60px]'
							polygon={detail.geometry}
							fill={getColor(detail.lossPredicted?.lossType)}
							stroke={getColor(detail.lossPredicted?.lossType)}
						/>
					)}
				</Paper>
				<Box className='flex grow flex-col gap-1 lg:gap-2'>
					<div className='flex items-center justify-between'>
						<Typography className='text-base font-semibold text-black-dark lg:text-md'>
							{detail.activityId}
						</Typography>
						<span className='text-sm font-semibold text-black max-lg:hidden'>
							{detail?.lossPredicted
								? `${t('occurrence', { ns: 'plot-monitoring' })} ${detail.count} ${t(`${detail.lossPredicted.lossType}`)}`
								: t('noDisaster')}
						</span>
						<span className='text-xs font-medium text-black lg:hidden'>{detail.year[language]}</span>
					</div>
					<div className='flex flex-col gap-1'>
						<Box className='flex gap-1 max-lg:hidden'>
							<span className='flex shrink-0 text-sm font-normal text-black'>{`${t('dataSetYear')} :`}</span>
							<span className='flex flex-wrap text-left text-sm font-semibold text-black'>
								{detail.year[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>{`${t('location', { ns: 'plot-monitoring' })}:`}</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.address[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>{`${t('complianceStatus', { ns: 'plot-monitoring' })}:`}</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.publicStatus[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>
								{t('riceVarietyType', { ns: 'plot-monitoring' })}
							</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.riceType[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>
								{t('riceVarieties', { ns: 'plot-monitoring' })}
							</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.detailType[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>
								{t('insurance', { ns: 'plot-monitoring' })}
							</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.insuredType[language]}
							</span>
						</Box>
						<Box className='flex gap-1'>
							<span className='flex shrink-0 text-xs font-normal text-black lg:text-sm'>
								{t('riskAreas', { ns: 'plot-monitoring' })}
							</span>
							<span className='flex flex-wrap text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.riskType[language]}
							</span>
						</Box>
					</div>
					<div className='flex gap-2 max-lg:hidden'>
						<Box
							className={classNames(
								'flex w-[50%] items-center justify-between rounded-lg bg-gray-light3 px-2 py-1',
								{
									'box-border !w-[calc(50%-4px)]': !detail.lossPredicted,
								},
							)}
						>
							<div className='mr-2 flex items-center gap-1'>
								<span className='text-left text-base font-medium text-black'>
									{t('canGrowRice', { ns: 'plot-monitoring' })}
								</span>
								<span className='text-base font-semibold text-secondary'>
									{`${detail.predictedRiceArea.percent}%`}
								</span>
							</div>
							<div className='flex items-center gap-1'>
								<span className='text-base font-semibold text-secondary'>
									{detail.predictedRiceArea.areaRai}
								</span>
								<span className='text-base font-normal text-black'>{t('areaRai')}</span>
							</div>
						</Box>
						{detail.lossPredicted && (
							<Box className='flex w-[50%] items-center justify-between rounded-lg bg-gray-light3 px-2 py-1'>
								<div className='flex items-center gap-1'>
									<span className='text-base font-medium text-black'>
										{t(`${detail.lossPredicted.lossType}`)}
									</span>
									<span className='text-base font-semibold text-secondary'>{`${detail.lossPredicted.percent}%`}</span>
								</div>
								<div className='flex items-center gap-1'>
									<span className='text-base font-semibold text-secondary'>
										{detail.lossPredicted.areaRai}
									</span>
									<span className='text-base font-normal text-black'>{t('areaRai')}</span>
								</div>
							</Box>
						)}
					</div>
				</Box>
			</div>
			<div className='flex gap-2 lg:hidden'>
				<Box
					className={classNames(
						'flex w-[50%] items-center justify-between rounded border border-solid border-gray p-2',
						{
							'box-border !w-[calc(50%-4px)]': !detail.lossPredicted,
						},
					)}
				>
					<div className='mr-2 flex items-center gap-1'>
						<span className='text-left text-sm font-medium text-black'>
							{t('canGrowRice', { ns: 'plot-monitoring' })}
						</span>
						<span className='text-sm font-semibold text-secondary'>
							{`${detail.predictedRiceArea.percent}%`}
						</span>
					</div>
					<div className='flex items-center gap-1'>
						<span className='text-sm font-semibold text-secondary'>{detail.predictedRiceArea.areaRai}</span>
						<span className='text-sm font-normal text-black'>{t('areaRai')}</span>
					</div>
				</Box>
				{detail.lossPredicted && (
					<Box className='flex w-[50%] items-center justify-between rounded border border-solid border-gray p-2'>
						<div className='mr-2 flex items-center gap-1'>
							<span className='text-sm font-medium text-black'>
								{t(`${detail.lossPredicted.lossType}`)}
							</span>
							<span className='text-sm font-semibold text-secondary'>{`${detail.lossPredicted.percent}%`}</span>
						</div>
						<div className='flex items-center gap-1'>
							<span className='text-sm font-semibold text-secondary'>{detail.lossPredicted.areaRai}</span>
							<span className='text-sm font-normal text-black'>{t('areaRai')}</span>
						</div>
					</Box>
				)}
			</div>
		</div>
	)
}

export default CardDetail
