'use client'
import React, { forwardRef, useImperativeHandle, useMemo, useEffect, useRef } from 'react'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import useLayerStore from './store/map'
import { LatLng, MapInterface } from './interface/map'

const DeckGLOverlay = () => {
	const layers = useLayerStore((state) => state.layers)
	const setOverlay = useLayerStore((state) => state.setOverlay)
	const map = useMap()
	const overlay = useMemo(() => new GoogleMapsOverlay({}), [])
	useEffect(() => {
		overlay.setProps({ layers })
	}, [layers, overlay])
	useEffect(() => {
		overlay.setMap(map)
		setOverlay(overlay)
	}, [map, overlay, setOverlay])
	return null
}

interface MapGoogleProps extends MapInterface {}

export interface MapGoogleRef {
	setExtent: (bounds: google.maps.LatLngBoundsLiteral) => void
	setCenter: (coords: LatLng) => void
}

function MapGoogle({ viewState, onViewStateChange, onMapClick }: MapGoogleProps, ref: React.Ref<MapGoogleRef>) {
	const mapRef = useRef<google.maps.Map | null>(null)
	const overlay = useLayerStore((state) => state.overlay)

	useImperativeHandle(ref, () => ({
		setExtent: (bounds: google.maps.LatLngBoundsLiteral) => {
			if (mapRef.current) {
				mapRef.current.fitBounds(bounds)
			}
		},
		setCenter: (coords: LatLng) => {
			if (mapRef.current) {
				mapRef.current.setCenter({ lat: coords.latitude, lng: coords.longitude })
			}
		},
	}))

	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])

	return (
		<APIProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
			<Map
				defaultCenter={{ lat: viewState?.latitude!, lng: viewState?.longitude! }}
				defaultZoom={viewState?.zoom!}
				mapId={process.env.GOOGLE_MAPS_API_MAP_ID}
				mapTypeControl={false}
				fullscreenControl={false}
				zoomControl={false}
				zoom={viewState?.zoom}
				streetViewControl={false}
				mapTypeId='hybrid'
				onBoundsChanged={(evt) => {
					mapRef.current = evt.map
					onViewStateChange?.({
						latitude: evt.detail.center.lat,
						longitude: evt.detail.center.lng,
						zoom: evt.detail.zoom,
					})
				}}
				onClick={(e) => {
					const info = e?.detail?.latLng
					onMapClick?.({
						latitude: info?.lat || 0,
						longitude: info?.lng || 0,
					})
				}}
			>
				<DeckGLOverlay />
			</Map>
		</APIProvider>
	)
}

export default forwardRef(MapGoogle)
