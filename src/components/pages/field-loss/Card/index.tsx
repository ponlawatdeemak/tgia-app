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
		<Box className='flex flex-col gap-1 rounded-lg border border-solid border-gray p-2'>
			<Box className='flex items-center justify-between'>
				<div className='flex items-center gap-1'>
					{item.lossType === 'drought' ? (
						<WbSunnyOutlined className='text-droughtTileColor-level3 h-5 w-5 font-light' />
					) : (
						<WaterOutlined className='text-floodTileColor-level3 h-5 w-5 font-light' />
					)}
					<div className='flex items-baseline gap-1'>
						<span className='text-base text-black'>{t(item.lossType)}</span>
						<span className='text-base font-semibold text-secondary'>{item.percent + '%'}</span>
					</div>
				</div>
				<div className='flex items-baseline gap-1'>
					<span className='text-base font-semibold text-secondary'>{item[areaUnit].toLocaleString()}</span>
					<span className='text-base font-normal text-black'>{t(areaUnit)}</span>
				</div>
			</Box>
			<Box className='flex items-center justify-between'>
				<span className='text-left text-base font-normal text-black'>
					{t('boundaryRegisteredAreas', { ns: 'field-loss' })}
				</span>
				<div className='flex items-baseline gap-1'>
					<span className='text-black-light text-base font-semibold'>
						{actArea?.[areaUnit].toLocaleString()}
					</span>
					<span className='text-base font-normal text-black'>{t(areaUnit)}</span>
				</div>
			</Box>
		</Box>
	)
}

export default FieldLossCard
