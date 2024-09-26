import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect } from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { MapInterface } from './interface/map'
import { useMap } from './context/map'

interface MapLibreProps extends MapInterface {
	mapStyle: string
}

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))
	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			overlay.setProps({ layers })
		}
	}, [layers, overlay])
	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			setOverlay(overlay)
		}
		return () => {
			overlay.finalize()
		}
	}, [overlay, setOverlay])
	return null
}

export default function MapLibre({ viewState, mapStyle, onViewStateChange }: MapLibreProps) {
	const overlay = useLayerStore((state) => state.overlay)
	const { setMapLibreInstance } = useMap()

	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])

	useEffect(() => {
		return () => {
			setMapLibreInstance(null)
		}
	}, [setMapLibreInstance])

	return (
		<Map
			initialViewState={viewState}
			mapStyle={mapStyle}
			preserveDrawingBuffer={true}
			zoom={viewState?.zoom}
			onMove={(e) => onViewStateChange?.(e.viewState)}
			ref={(ref) => setMapLibreInstance(ref?.getMap() || null)}
		>
			<DeckGLOverlay />
		</Map>
	)
}
