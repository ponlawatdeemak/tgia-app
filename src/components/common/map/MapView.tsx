'use client'
import { memo, useCallback, useState } from 'react'
import classNames from 'classnames'
import { Box } from '@mui/material'
import { BASEMAP } from '@deck.gl/carto'
import { MapViewProps, MapViewState } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTools'

const MAX_ZOOM = 10
const MIN_ZOOM = 3
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

	const handleBasemapChange = useCallback((newBasemap: string) => {
		setBasemap((prev) => newBasemap || prev)
	}, [])

	const handleZoom = useCallback(
		(level: number) => {
			if (level <= MAX_ZOOM && level >= MIN_ZOOM) {
				setViewState({ ...viewState, zoom: level })
			}
		},
		[viewState],
	)

	return (
		<div className={classNames('relative flex h-full flex-1 flex-col overflow-hidden', className)}>
			<Box className='absolute bottom-2 left-2 z-10'>
				<MapTools
					onBasemapChange={handleBasemapChange}
					onZoomIn={() => handleZoom(viewState.zoom + 1)}
					onZoomOut={() => handleZoom(viewState.zoom - 1)}
				></MapTools>
			</Box>
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
