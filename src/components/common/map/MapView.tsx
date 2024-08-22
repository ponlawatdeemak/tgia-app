'use client'
import { forwardRef, memo, useCallback, useImperativeHandle, useRef, useState } from 'react'
import classNames from 'classnames'
import { Box } from '@mui/material'
import { BASEMAP } from '@deck.gl/carto'
import { MapViewProps, MapViewState } from './interface/map'
import MapGoogle, { MapGoogleRef } from './MapGoogle'
import MapLibre, { MapLibreRef } from './MapLibre'
import MapTools from './MapTools'

const MAX_ZOOM = 10
const MIN_ZOOM = 3
const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 100,
	latitude: 13,
	zoom: 5,
}

export interface MapViewRef {
	setMapExtent: (bounds: number[][]) => void
}

const MapView = forwardRef<MapViewRef, MapViewProps>(({ className = '' }, ref) => {
	const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
	const [basemap, setBasemap] = useState('carto-light')

	const mapLibreRef = useRef<MapLibreRef | null>(null)
	const mapGoogleRef = useRef<MapGoogleRef | null>(null)

	useImperativeHandle(ref, () => ({
		setMapExtent: (bounds: number[][]) => {
			if (basemap === 'google' && mapGoogleRef.current) {
				const googleBounds: google.maps.LatLngBoundsLiteral = {
					north: bounds[1][1],
					south: bounds[0][1],
					east: bounds[1][0],
					west: bounds[0][0],
				}
				mapGoogleRef.current.setExtent(googleBounds)
			} else if (mapLibreRef.current) {
				mapLibreRef.current.setExtent(bounds)
			}
		},
	}))

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
					ref={mapLibreRef}
					viewState={viewState as any}
					mapStyle={basemap === 'carto-light' ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
				/>
			) : (
				<MapGoogle ref={mapGoogleRef} viewState={viewState} onViewStateChange={onViewStateChange} />
			)}
		</div>
	)
})

export default memo(MapView)
