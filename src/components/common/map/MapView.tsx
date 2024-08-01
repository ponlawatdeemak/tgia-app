'use client'
import { memo, useCallback, useState } from 'react'
import classNames from 'classnames'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import { BASEMAP } from '@deck.gl/carto'
import { MapViewProps, MapViewState } from './interface/map'

const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 100,
	latitude: 13,
	zoom: 5,
}

const MapView: React.FC<MapViewProps> = ({ className = '' }) => {
	const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
	const [basemap, setBasemap] = useState('carto-light')

	const onViewStateChange = useCallback((v: any) => {
		setViewState(v)
	}, [])

	const handleChange = useCallback((event: React.MouseEvent<HTMLElement>, newBasemap: string) => {
		setBasemap((prev) => newBasemap || prev)
	}, [])

	return (
		<div className={classNames('relative flex h-full flex-1 flex-col overflow-hidden', className)}>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='absolute left-0 top-0 z-10 bg-white'
				value={basemap}
				onChange={handleChange}
			>
				<ToggleButton value={'carto-light'}>Street</ToggleButton>
				<ToggleButton value={'carto-dark'}>Dark Matter</ToggleButton>
				<ToggleButton value={'google'}>Satellite</ToggleButton>
			</ToggleButtonGroup>
			{basemap !== 'google' ? (
				<MapLibre
					viewState={viewState as any}
					mapStyle={basemap === 'carto-light' ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
				/>
			) : (
				<MapGoogle viewState={viewState} onViewStateChange={onViewStateChange} />
			)}
		</div>
	)
}

export default memo(MapView)
