import React, { useMemo, useEffect } from 'react'
import { APIProvider, Map, useMap as useMapGoogle } from '@vis.gl/react-google-maps'
import { GoogleMapsOverlay } from '@deck.gl/google-maps'
import useLayerStore from './store/map'
import { useMap } from './context/map'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'
import { MapInterface } from './interface/map'

interface MapGoogleProps extends MapInterface {}

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
	const map = useMapGoogle()
	const overlay = useMemo(() => new GoogleMapsOverlay({}), [])
	useEffect(() => {
		if (overlay instanceof GoogleMapsOverlay) {
			const temp = recreateLayer(layers)
			overlay.setProps({ layers: temp })
		}
	}, [layers, overlay])
	useEffect(() => {
		if (overlay instanceof GoogleMapsOverlay) {
			overlay.setMap(map)
			setOverlay(overlay)
		}
		return () => {
			overlay.finalize()
		}
	}, [map, overlay, setOverlay])
	return null
}

export default function MapGoogle({ viewState, onViewStateChange, onMapClick }: MapGoogleProps) {
	const overlay = useLayerStore((state) => state.overlay)
	const { setGoogleMapInstance } = useMap()

	useEffect(() => {
		return () => {
			overlay?.setProps({ layers: [] })
		}
	}, [overlay])

	useEffect(() => {
		return () => {
			setGoogleMapInstance(null)
		}
	}, [setGoogleMapInstance])

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
					setGoogleMapInstance(evt.map)
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
