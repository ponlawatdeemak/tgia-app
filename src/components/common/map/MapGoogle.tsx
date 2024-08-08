'use client'
import React, { useMemo, useEffect } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import useLayerStore from './store/map'
import { MapInterface } from './interface/map'

function DeckGLOverlay() {
	const layers = useLayerStore((state) => state.layers)
	const map = useMap()
	const overlay = useMemo(() => new GoogleMapsOverlay({ layers }), [layers])

	useEffect(() => {
		overlay.setMap(map)
		return () => {
			overlay.setMap(null)
			map?.unbindAll()
		}
	}, [map, overlay])

	return null
}

export default function MapGoogle({ viewState, onViewStateChange }: MapInterface) {
	return (
		<APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
			<Map
				defaultCenter={{ lat: viewState?.latitude!, lng: viewState?.longitude! }}
				defaultZoom={viewState?.zoom!}
				mapId={process.env.GOOGLE_MAPS_API_MAP_ID}
				mapTypeControl={false}
				fullscreenControl={false}
				zoomControl={false}
				streetViewControl={false}
				mapTypeId='hybrid'
				onBoundsChanged={(evt) =>
					onViewStateChange?.({
						latitude: evt.detail.center.lat,
						longitude: evt.detail.center.lng,
						zoom: evt.detail.zoom,
					})
				}
			>
				<DeckGLOverlay />
			</Map>
		</APIProvider>
	)
}
