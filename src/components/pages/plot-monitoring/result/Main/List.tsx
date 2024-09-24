'use client'

import React, { useCallback, useState } from 'react'
import { IconButton, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material'
import clsx from 'clsx'
import CardList from '../List/CardList'
import MapList from '../List/MapList'
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface PlotMonitoringListProps {
	isFullList: boolean
	setIsFullList: React.Dispatch<React.SetStateAction<boolean>>
	mapViewRef: any
}

const PlotMonitoringList: React.FC<PlotMonitoringListProps> = ({ isFullList, setIsFullList, mapViewRef }) => {
	const { t } = useTranslation(['default', 'plot-monitoring'])
	const [areaDetail, setAreaDetail] = useState('cards')

	const handleAreaDetailChange = useCallback((_event: React.MouseEvent<HTMLElement>, newAreaDetail: string) => {
		setAreaDetail((prev) => newAreaDetail || prev)
	}, [])

	return (
		<Paper className='relative block flex-grow'>
			<IconButton
				className='absolute left-0 top-3 z-10 flex items-center justify-center rounded-s-none border-0 border-l border-solid border-gray-light bg-white px-1 py-3 max-lg:hidden'
				onClick={() => setIsFullList(!isFullList)}
			>
				{isFullList ? (
					<ArrowForwardIos className='h-4 w-4 font-normal text-black-dark' />
				) : (
					<ArrowBackIosNew className='h-4 w-4 font-normal text-black-dark' />
				)}
			</IconButton>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='bg-gray-dark5 fixed right-3 z-10 flex gap-2 rounded p-2 max-lg:bottom-3 max-lg:left-3 lg:absolute lg:top-3 lg:rounded-lg lg:bg-gray-light3 lg:p-1 [&_*]:px-3 [&_*]:py-1.5 max-lg:[&_*]:rounded'
				value={areaDetail}
				onChange={handleAreaDetailChange}
			>
				<ToggleButton
					className={clsx('w-full border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'cards',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'cards',
					})}
					value={'cards'}
				>
					{t('item')}
				</ToggleButton>
				<ToggleButton
					className={clsx('w-full border border-solid text-base', {
						'border-primary bg-white font-semibold text-primary': areaDetail === 'map',
						'border-transparent font-medium text-gray-dark2': areaDetail !== 'map',
					})}
					value={'map'}
				>
					{t('map', { ns: 'plot-monitoring' })}
				</ToggleButton>
			</ToggleButtonGroup>
			<CardList areaDetail={areaDetail} />
			<MapList areaDetail={areaDetail} mapViewRef={mapViewRef} />
		</Paper>
	)
}

export default PlotMonitoringList
