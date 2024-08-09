'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect } from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { MapInterface } from './interface/map'

function DeckGLOverlay() {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))
	useEffect(() => {
		overlay.setProps({ layers })
	}, [layers, overlay])
	useEffect(() => {
		setOverlay(overlay)
	}, [overlay, setOverlay])
	useControl<MapboxOverlay>(() => new MapboxOverlay({ layers, interleaved: true }))
	return null
}

export default function MapLibre({
	layers,
	mapStyle,
	viewState,
	onViewStateChange,
	...props
}: MapInterface & { mapStyle?: string }) {
	const overlay = useLayerStore((state) => state.overlay)
	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])
	return (
		<Map
			{...props}
			initialViewState={viewState}
			mapStyle={mapStyle}
			preserveDrawingBuffer={true}
			zoom={viewState?.zoom}
			onMove={(e) => onViewStateChange?.(e.viewState)}
		>
			<DeckGLOverlay />
		</Map>
	)
}
