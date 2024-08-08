'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { MapInterface } from './interface/map'

function DeckGLOverlay() {
	const layers = useLayerStore((state) => state.layers)
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
	return (
		<Map
			{...props}
			initialViewState={viewState}
			mapStyle={mapStyle}
			preserveDrawingBuffer={true}
			onMove={(e) => onViewStateChange?.(e.viewState)}
		>
			<DeckGLOverlay />
		</Map>
	)
}
