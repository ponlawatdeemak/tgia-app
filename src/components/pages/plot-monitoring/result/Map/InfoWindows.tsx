'use client'

import { Box, IconButton, Paper, Typography } from '@mui/material'
import React from 'react'
import useSearchPlotMonitoring from '../Main/context'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { ResponseLanguage } from '@/api/interface'
import { mdiArrowRight } from '@mdi/js'
import Icon from '@mdi/react'
import { GetPositionSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'

type ClickInfo = {
	x: number
	y: number
	area: GetPositionSearchPlotDtoOut
}

interface InfoWindowsProps {
	clickInfo: ClickInfo | null
	setClickInfo: React.Dispatch<React.SetStateAction<ClickInfo | null>>
}

const InfoWindows: React.FC<InfoWindowsProps> = ({ clickInfo, setClickInfo }) => {
	const router = useRouter()
	const { queryParams, setQueryParams } = useSearchPlotMonitoring()
	const { areaUnit } = useAreaUnit()
	const { t, i18n } = useTranslation(['default', 'plot-monitoring'])
	const language = i18n.language as keyof ResponseLanguage

	if (!clickInfo || !clickInfo.area) {
		return null
	}

	const handleClickInfoWindows = (activityId: number) => {
		router.push(`${AppPath.PlotMonitoringResult}/${activityId}`)
		setClickInfo(null)
	}

	return (
		<Paper
			className='absolute z-10 flex w-[172px] flex-col gap-2 bg-white p-2 shadow-xl'
			style={{ left: clickInfo.x, top: clickInfo.y }}
		>
			<Box className='flex items-start justify-between'>
				<Box className='flex flex-col'>
					<Typography className='text-base font-semibold text-black'>{clickInfo.area.activityId}</Typography>
					<span className='text-xs font-medium text-gray-dark2'>ภัยแล้ง ครั้งที่ 1</span>
				</Box>
				<IconButton
					onClick={() => handleClickInfoWindows(clickInfo.area.activityId)}
					className='ml-2 h-6 w-6 rounded-lg border border-solid border-gray p-1'
				>
					<Icon path={mdiArrowRight} className='h-4 w-4 font-normal text-black' />
				</IconButton>
			</Box>
			<Box className='flex justify-between'>
				<Box className='flex items-center gap-1'>
					<span className='text-sm font-medium text-black'>ปลูกข้าวได้</span>
					<span className='text-base font-semibold text-secondary'>{`${clickInfo.area.predictedRiceArea.percent}%`}</span>
				</Box>
				<Box className='flex items-center gap-1'>
					<span className='text-base font-semibold text-secondary'>
						{clickInfo.area.predictedRiceArea.areaRai}
					</span>
					<span className='text-sm font-normal text-black'>ไร่</span>
				</Box>
			</Box>
			{clickInfo.area.results.map((result, index) => {
				return (
					<Box key={index} className='flex justify-between'>
						<Box className='flex items-center gap-1'>
							<span className='text-sm font-medium text-black'>{result.lossType}</span>
							<span className='text-base font-semibold text-secondary'>{`${result.lossPredicted.percent}%`}</span>
						</Box>
						<Box className='flex items-center gap-1'>
							<span className='text-base font-semibold text-secondary'>
								{result.lossPredicted.areaRai}
							</span>
							<span className='text-sm font-normal text-black'>ไร่</span>
						</Box>
					</Box>
				)
			})}
		</Paper>
	)
}

export default InfoWindows
