import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useEffect } from 'react'
import { Map, useControl } from 'react-map-gl/maplibre'
import { MapboxOverlay } from '@deck.gl/mapbox'
import useLayerStore from './store/map'
import { MapInterface } from './interface/map'
import { useMap } from './context/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'
import { MapStyleDataEvent, StyleSpecification } from 'maplibre-gl'

interface MapLibreProps extends MapInterface {
	mapStyle: string | StyleSpecification
}

export const recreateLayer = (layerList: Layer[]) => {
	return layerList.map((item) => {
		// const spliter = '---'
		// let id = item.id?.split(spliter)?.[0] || ''
		// id = `${id}${spliter}${new Date().getTime()}`

		const newProp = {
			...item.props,
			// id,
			beforeId: 'custom-referer-layer',
		} as any

		if (item instanceof IconLayer) {
			newProp.data = item.props.data
			return new IconLayer(newProp)
		}

		if (item instanceof MVTLayer) {
			return new MVTLayer(newProp)
		}
		return item
	})
}

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	// const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({}))

	const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay({ interleaved: true }))

	useEffect(() => {
		if (overlay instanceof MapboxOverlay) {
			const temp = recreateLayer(layers)
			overlay.setProps({ layers: temp })
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

export default function MapLibre({ viewState, mapStyle, onViewStateChange, onMapClick }: MapLibreProps) {
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

	const onStyleData = (event: MapStyleDataEvent) => {
		// add reference layer for all deck.gl layer under this layer and display draw layer to top
		const map = event.target

		const refSource = map.getSource('custom-referer-source')
		if (!refSource) {
			map.addSource('custom-referer-source', {
				type: 'geojson',
				data: { type: 'FeatureCollection', features: [] },
			})
		}
		const refLayer = map.getLayer('custom-referer-layer')
		if (!refLayer) {
			map.addLayer({
				id: 'custom-referer-layer',
				type: 'symbol',
				source: 'custom-referer-source',
				layout: { visibility: 'none' },
			})
		}
	}

	return (
		<Map
			initialViewState={viewState}
			mapStyle={mapStyle}
			preserveDrawingBuffer={true}
			// zoom={viewState?.zoom}
			onMove={(e) => onViewStateChange?.(e.viewState)}
			ref={(ref) => setMapLibreInstance(ref?.getMap() || null)}
			onClick={(e) => onMapClick?.({ latitude: e?.lngLat?.lat, longitude: e?.lngLat?.lng })}
			onStyleData={onStyleData}
			touchZoomRotate={true}
			touchPitch={false}
			dragRotate={false}
		>
			<DeckGLOverlay />
		</Map>
	)
}
