'use client'

import { Box, Typography } from '@mui/material'
import { WaterOutlined, WbSunnyOutlined } from '@mui/icons-material'
import React from 'react'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { LossPredicted } from '@/api/field-loss/dto-out.dto'
import { ResponseArea } from '@/api/interface'

interface LossPredictedType {
	lossType: string
	areaRai: number
	areaPlot: number
	percent: number
}

interface FieldLossCardProps {
	item: LossPredicted
	actArea: ResponseArea | undefined
}

const FieldLossCard: React.FC<FieldLossCardProps> = ({ item, actArea }) => {
	const { areaType, setAreaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { t } = useTranslation(['default', 'field-loss'])

	return (
		<Box className='flex flex-col gap-[4px] rounded-lg border-[1px] border-solid border-gray p-[8px]'>
			<Box className='flex items-center justify-between'>
				<div className='flex items-center gap-[4px]'>
					{item.lossType === 'drought' ? (
						<WbSunnyOutlined className='h-[20px] w-[20px] font-light text-[#FC8E59]' />
					) : (
						<WaterOutlined className='h-[20px] w-[20px] font-light text-[#6BAED6]' />
					)}
					<div className='flex items-baseline gap-[4px]'>
						<span className='leading-[20px] text-black'>{t(item.lossType)}</span>
						<span className='font-semibold leading-[16px] text-[#9F1853]'>
							{/* {(item.precent * 100).toFixed(1) + '%'} */}
							{item.percent + '%'}
						</span>
					</div>
				</div>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#9F1853]'>
						{item[areaUnit].toLocaleString()}
					</span>
					<span className='font-normal leading-[20px] text-black'>{t(areaUnit)}</span>
				</div>
			</Box>
			<Box className='flex items-center justify-between'>
				<span className='text-left font-normal leading-[20px] text-black'>
					{t('boundaryRegisteredAreas', { ns: 'field-loss' })}
				</span>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#575757]'>
						{actArea?.[areaUnit].toLocaleString()}
					</span>
					<span className='font-normal leading-[20px] text-black'>{t(areaUnit)}</span>
				</div>
			</Box>
		</Box>
	)
}

export default FieldLossCard
