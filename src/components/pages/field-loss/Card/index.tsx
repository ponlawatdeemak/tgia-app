'use client'

import { Box } from '@mui/material'
import { WaterOutlined, WbSunnyOutlined } from '@mui/icons-material'
import React from 'react'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { LossPredicted } from '@/api/field-loss/dto-out.dto'
import { ResponseArea } from '@/api/interface'

interface FieldLossCardProps {
	item: LossPredicted
	actArea: ResponseArea | undefined
}

const FieldLossCard: React.FC<FieldLossCardProps> = ({ item, actArea }) => {
	const { areaUnit } = useAreaUnit()
	const { t } = useTranslation(['default', 'field-loss'])

	return (
		<Box className='flex flex-col gap-1 rounded-lg border border-solid border-gray p-2'>
			<Box className='flex items-center justify-between'>
				<div className='flex items-center gap-1'>
					{item.lossType === 'drought' ? (
						<WbSunnyOutlined className='h-5 w-5 font-light text-lossTypeIcon-drought' />
					) : (
						<WaterOutlined className='h-5 w-5 font-light text-lossTypeIcon-flood' />
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
					<span className='text-base font-semibold text-black-light'>
						{actArea?.[areaUnit].toLocaleString()}
					</span>
					<span className='text-base font-normal text-black'>{t(areaUnit)}</span>
				</div>
			</Box>
		</Box>
	)
}

export default FieldLossCard
