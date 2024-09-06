'use client'

import { Box, IconButton, Paper, Typography } from '@mui/material'
import React from 'react'
import useAreaUnit from '@/store/area-unit'
import { useTranslation } from 'react-i18next'
import { mdiArrowRight } from '@mdi/js'
import Icon from '@mdi/react'
import { GetPositionSearchPlotDtoOut } from '@/api/plot-monitoring/dto-out.dto'
import { useRouter } from 'next/navigation'
import { AppPath } from '@/config/app'
import classNames from 'classnames'

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
	const { areaUnit } = useAreaUnit()
	const { t } = useTranslation(['default', 'plot-monitoring'])

	if (!clickInfo || !clickInfo.area) {
		return null
	}

	const handleClickInfoWindows = (activityId: number, count: number = 1) => {
		router.push(`${AppPath.PlotMonitoringResult}/${activityId}?count=${count}`)
		setClickInfo(null)
	}

	return (
		<Paper
			className='absolute z-10 flex w-56 flex-col gap-2 bg-white p-2 shadow-xl'
			style={{ left: clickInfo.x, top: clickInfo.y }}
		>
			<Box className='flex items-center justify-between'>
				<Box className='flex flex-col'>
					<Typography className='text-base font-semibold text-black'>{clickInfo.area.activityId}</Typography>
				</Box>
				{(!clickInfo.area.results || clickInfo.area.results.length === 0) && (
					<IconButton
						onClick={() => handleClickInfoWindows(clickInfo.area.activityId)}
						className='ml-2 h-6 w-6 rounded-lg border border-solid border-gray p-1'
					>
						<Icon path={mdiArrowRight} className='h-4 w-4 font-normal text-black' />
					</IconButton>
				)}
			</Box>
			<Box
				className={classNames('flex justify-between', {
					'pr-7': !!clickInfo.area.results,
				})}
			>
				<Box className='flex items-center gap-1'>
					<span className='text-sm font-medium text-black'>
						{t('canGrowRice', { ns: 'plot-monitoring' })}
					</span>
					<span className='text-base font-semibold text-secondary'>{`${clickInfo.area.predictedRiceArea.percent}%`}</span>
				</Box>
				<Box className='flex items-center gap-1'>
					<span className='text-base font-semibold text-secondary'>
						{clickInfo.area.predictedRiceArea?.[areaUnit]}
					</span>
					<span className='text-sm font-normal text-black'>{t(areaUnit)}</span>
				</Box>
			</Box>
			{clickInfo.area.results &&
				clickInfo.area.results.map((result, index) => {
					return (
						<Box key={index} className='flex justify-between'>
							<Box className='flex items-center gap-1'>
								<span className='text-sm font-medium text-black'>{`${t('occurrence', { ns: 'plot-monitoring' })} ${result.count} ${t(`${result.lossPredicted.lossType}`)}`}</span>
								<span className='text-base font-semibold text-secondary'>
									{result.lossPredicted.percent ? `${result.lossPredicted.percent}%` : ''}
								</span>
							</Box>
							<Box className='flex items-center gap-1'>
								<span className='text-base font-semibold text-secondary'>
									{result.lossPredicted?.[areaUnit]}
								</span>
								<span className='text-sm font-normal text-black'>{t(areaUnit)}</span>
								<IconButton
									onClick={() => handleClickInfoWindows(clickInfo.area.activityId, result.count)}
									className='h-6 w-6 rounded-lg border border-solid border-gray p-1'
								>
									<Icon path={mdiArrowRight} className='h-4 w-4 font-normal text-black' />
								</IconButton>
							</Box>
						</Box>
					)
				})}
		</Paper>
	)
}

export default InfoWindows
