'use client'

import React, { useCallback, useState } from 'react'
import { Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import clsx from 'clsx'
import CardList from '../List/CardList'
import MapList from '../List/MapList'

interface PlotMonitoringListProps {
	isFullList: boolean
}

const PlotMonitoringList: React.FC<PlotMonitoringListProps> = ({ isFullList }) => {
	const [areaDetail, setAreaDetail] = useState('cards')

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
						'border-primary bg-white font-semibold text-primary': areaDetail === 'cards',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'cards',
					})}
					value={'cards'}
				>
					รายการ
				</ToggleButton>
				<ToggleButton
					className={clsx('border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'map',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'map',
					})}
					value={'map'}
				>
					แผนที่
				</ToggleButton>
			</ToggleButtonGroup>
			<CardList areaDetail={areaDetail} />
			<MapList areaDetail={areaDetail} />
		</Paper>
	)
}

export default PlotMonitoringList
