'use client'

import React, { useCallback, useState } from 'react'
import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import TableDetail from '../Detail/TableDetail'
import ChartDetail from '../Detail/ChartDetail'
import clsx from 'clsx'
import useResponsive from '@/hook/responsive'
import MapDetail from '../Detail/MapDetail'

interface FieldLossDetailProps {}

const FieldLossDetail: React.FC<FieldLossDetailProps> = () => {
	const { isDesktop } = useResponsive()
	const [areaDetail, setAreaDetail] = useState('summary-area')

	const handleAreaDetailChange = useCallback((_event: React.MouseEvent<HTMLElement>, newAreaDetail: string) => {
		setAreaDetail((prev) => newAreaDetail || prev)
	}, [])

	return (
		<Paper className='relative max-lg:flex max-lg:flex-col max-lg:gap-3 max-lg:bg-gray-light lg:block lg:flex-grow'>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='absolute right-3 top-3 z-10 flex gap-2 rounded-lg bg-gray-light3 p-1 max-lg:hidden [&_*]:px-3 [&_*]:py-1.5'
				value={areaDetail}
				onChange={handleAreaDetailChange}
			>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'summary-area',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'summary-area',
					})}
					value={'summary-area'}
				>
					ตามแผนที่
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'area-statistic',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'area-statistic',
					})}
					value={'area-statistic'}
				>
					ตามอันดับ
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'time-statistic',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'time-statistic',
					})}
					value={'time-statistic'}
				>
					ตามช่วงเวลา
				</ToggleButton>
			</ToggleButtonGroup>
			{(areaDetail === 'summary-area' || !isDesktop) && <MapDetail areaDetail={areaDetail} />}
			{(areaDetail === 'area-statistic' || !isDesktop) && <TableDetail areaDetail={areaDetail} />}
			{(areaDetail === 'time-statistic' || !isDesktop) && <ChartDetail areaDetail={areaDetail} />}
		</Paper>
	)
}

export default FieldLossDetail
