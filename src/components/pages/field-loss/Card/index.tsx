'use client'

import { Box, Typography } from '@mui/material'
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined'
import React from 'react'
import { useTranslation } from '@/i18n/client'
import useLanguage from '@/store/language'
import { AreaTypeKey, AreaUnitKey, Language } from '@/enum'
import useAreaType from '@/store/area-type'
import useAreaUnit from '@/store/area-unit'

interface LossPredictedType {
	lossType: string
	areaRai: number
	areaPlot: number
	precent: number
}

interface FieldLossCardProps {
	item: LossPredictedType
	actAreaRai: number
}

const FieldLossCard: React.FC<FieldLossCardProps> = ({ item, actAreaRai }) => {
	const { areaType, setAreaType } = useAreaType()
	const { areaUnit } = useAreaUnit()
	const { language } = useLanguage()
	const { t } = useTranslation(language, 'default')

	return (
		<Box className='flex flex-col gap-[4px] rounded-lg border-[1px] border-solid border-gray p-[8px]'>
			<Box className='flex items-center justify-between'>
				<div className='flex items-center gap-[4px]'>
					<WbSunnyOutlinedIcon className='h-[20px] w-[20px] font-light text-[#FC8E59]' />
					<div className='flex items-baseline gap-[4px]'>
						<span className='leading-[20px] text-black'>{item.lossType}</span>
						<span className='font-semibold leading-[16px] text-[#9F1853]'>
							{(item.precent * 100).toFixed(1) + '%'}
						</span>
					</div>
				</div>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#9F1853]'>{item.areaRai.toLocaleString()}</span>
					<span className='font-normal leading-[20px] text-black'>ไร่</span>
				</div>
			</Box>
			<Box className='flex items-center justify-between'>
				<span className='font-normal leading-[20px] text-black'>พื้นที่ขึ้นทะเบียนที่มีขอบแปลง</span>
				<div className='flex items-baseline gap-[4px]'>
					<span className='font-semibold leading-[16px] text-[#575757]'>{actAreaRai.toLocaleString()}</span>
					<span className='font-normal leading-[20px] text-black'>ไร่</span>
				</div>
			</Box>
		</Box>
	)
}

export default FieldLossCard
