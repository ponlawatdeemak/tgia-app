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
				color = LossTypeColor.rnr
				break
		}
		return color
	}, [])

	return (
		<div className='flex justify-center gap-4 bg-white py-4'>
			<Paper className='flex w-[204px] items-center justify-center bg-gray-light3'>
				<PolygonToImage
					className='!border-none !bg-transparent'
					polygon={detail.geometry}
					fill={getColor(detail.lossPredicted?.lossType)}
					stroke={getColor(detail.lossPredicted?.lossType)}
				/>
			</Paper>
			<Box className='flex flex-col gap-2'>
				<div className='flex items-center justify-between'>
					<Typography className='text-md font-semibold text-black-dark'>{detail.activityId}</Typography>
					<span className='text-sm font-semibold text-black'>
						{detail?.lossPredicted
							? `${t(`${detail.lossPredicted.lossType}`)} ครั้งที่ ${detail.count}`
							: 'ไม่มีภัยพิบัติ'}
					</span>
				</div>
				<div className='flex flex-col gap-1'>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ปีชุดข้อมูล :</span>
						<span className='text-sm font-semibold text-black'>{detail.year[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ที่ตั้ง:</span>
						<span className='text-sm font-semibold text-black'>{detail.address[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>สถานะประชาคม:</span>
						<span className='text-sm font-semibold text-black'>{detail.publicStatus[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ประเภทของพันธุ์ข้าว</span>
						<span className='text-sm font-semibold text-black'>{detail.riceType[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ชนิดของพันธุ์ข้าว</span>
						<span className='text-sm font-semibold text-black'>{detail.detailType[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>ประกันภัย</span>
						<span className='text-sm font-semibold text-black'>{detail.insuredType[language]}</span>
					</Box>
					<Box className='flex items-center gap-1'>
						<span className='text-sm font-normal text-black'>พื้นที่ความเสี่ยงภัย</span>
						<span className='text-sm font-semibold text-black'>{detail.riskType[language]}</span>
					</Box>
				</div>
				<div className='flex gap-2'>
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
	)
}

export default CardDetail
