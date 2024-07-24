'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import React from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { MapInterface, useLayerStore } from './MapView'

function DeckGLOverlay() {
	const layers = useLayerStore((state) => state.layers)
	useControl<MapboxOverlay>(() => new MapboxOverlay({ layers }))
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
			onMove={(e) => onViewStateChange?.(e.viewState)}
		>
			<DeckGLOverlay />
		</Map>
	)
}
