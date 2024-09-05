'use client'

import { GetSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { Box, Paper, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import useSearchPlotMonitoring from '../Main/context'
import useResponsive from '@/hook/responsive'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import classNames from 'classnames'
import PolygonToImage from '@/components/common/polyimg/PolygonToImage'
import { LossTypeColor } from '@/config/color'

interface CardDetailProps {
	detail: GetSearchPlotDtoOut
}

const CardDetail: React.FC<CardDetailProps> = ({ detail }) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { isDesktop } = useResponsive()
	const { areaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
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
		<div className='flex flex-col gap-4 rounded bg-white py-4 max-lg:px-4 lg:rounded-lg'>
			<div className='flex justify-center gap-4'>
				<Paper className='flex w-[204px] items-center justify-center bg-gray-light3 max-lg:h-[80px] max-lg:w-[80px]'>
					{!!detail.geometry.coordinates && (
						<PolygonToImage
							className='!h-[80px] !w-[80px] !border-none !bg-transparent [&_svg]:h-[60px] [&_svg]:w-[60px]'
							polygon={detail.geometry}
							fill={getColor(detail.lossPredicted?.lossType)}
							stroke={getColor(detail.lossPredicted?.lossType)}
						/>
					)}
				</Paper>
				<Box className='flex flex-col gap-1 lg:gap-2'>
					<div className='flex items-center justify-between'>
						<Typography className='text-base font-semibold text-black-dark lg:text-md'>
							{detail.activityId}
						</Typography>
						<span className='text-sm font-semibold text-black max-lg:hidden'>
							{detail?.lossPredicted
								? `ครั้งที่ ${detail.count} ${t(`${detail.lossPredicted.lossType}`)}`
								: 'ไม่มีภัยพิบัติ'}
						</span>
						<span className='text-xs font-medium text-black lg:hidden'>{detail.year[language]}</span>
					</div>
					<div className='flex flex-col gap-1'>
						<Box className='flex items-center gap-1 max-lg:hidden'>
							<span className='text-sm font-normal text-black'>ปีชุดข้อมูล :</span>
							<span className='text-sm font-semibold text-black'>{detail.year[language]}</span>
						</Box>
						<Box className='flex flex-wrap items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>ที่ตั้ง:</span>
							<span className='text-left text-xs font-semibold text-black lg:text-sm'>
								{detail.address[language]}
							</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>สถานะประชาคม:</span>
							<span className='text-xs font-semibold text-black lg:text-sm'>
								{detail.publicStatus[language]}
							</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>ประเภทของพันธุ์ข้าว</span>
							<span className='text-xs font-semibold text-black lg:text-sm'>
								{detail.riceType[language]}
							</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>ชนิดของพันธุ์ข้าว</span>
							<span className='text-xs font-semibold text-black lg:text-sm'>
								{detail.detailType[language]}
							</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>ประกันภัย</span>
							<span className='text-xs font-semibold text-black lg:text-sm'>
								{detail.insuredType[language]}
							</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-xs font-normal text-black lg:text-sm'>พื้นที่ความเสี่ยงภัย</span>
							<span className='text-xs font-semibold text-black lg:text-sm'>
								{detail.riskType[language]}
							</span>
						</Box>
					</div>
					<div className='flex gap-2 max-lg:hidden'>
						<Box
							className={classNames(
								'flex w-40 items-center justify-between rounded-lg bg-gray-light3 px-2 py-1',
								{
									'!w-[332px]': !detail.lossPredicted,
								},
							)}
						>
							<div className='flex items-center gap-1'>
								<span className='text-base font-medium text-black'>ปลูกข้าวได้</span>
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
							<Box className='flex w-[148px] items-center justify-between rounded-lg bg-gray-light3 px-2 py-1'>
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
				<Box className='flex w-full items-center justify-between rounded border border-solid border-gray p-2'>
					<div className='flex items-center gap-1'>
						<span className='text-sm font-medium text-black'>ปลูกข้าวได้</span>
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
					<Box className='flex w-full items-center justify-between rounded border border-solid border-gray p-2'>
						<div className='flex items-center gap-1'>
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
