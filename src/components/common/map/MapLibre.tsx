'use client'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react'
import { Map, MapLayerMouseEvent, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { LatLng, MapInterface } from './interface/map'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))
	useEffect(() => {
		overlay.setProps({ layers })
	}, [layers, overlay])
	useEffect(() => {
		setOverlay(overlay)
	}, [overlay, setOverlay])
	return null
}

interface MapLibreProps extends MapInterface {
	mapStyle?: string
}

export interface MapLibreRef {
	setExtent: (bounds: number[][]) => void
	setCenter: (coords: LatLng) => void
}

function MapLibre(
	{ layers, mapStyle, viewState, onViewStateChange, onMapClick, ...props }: MapLibreProps,
	ref: React.Ref<MapLibreRef>,
) {
	const mapRef = useRef<any>(null)
	const overlay = useLayerStore((state) => state.overlay)

	useImperativeHandle(ref, () => ({
		setExtent: (bounds: number[][]) => {
			if (mapRef.current) {
				mapRef.current.fitBounds(bounds)
			}
		},
		setCenter: (coords: LatLng) => {
			if (mapRef.current) {
				mapRef.current.setCenter({ lat: coords.latitude, lng: coords.longitude, zoom: 10 })
			}
		},
	}))

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
			ref={mapRef}
			onClick={(e) => onMapClick?.({ latitude: e?.lngLat?.lat, longitude: e?.lngLat?.lng })}
		>
			<DeckGLOverlay />
		</Map>
	)
}

export default forwardRef(MapLibre)
