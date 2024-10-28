import { IconLayer } from '@deck.gl/layers'
import { useCallback, useEffect } from 'react'
import useLayerStore from '../store/map'
import { Layer } from '@deck.gl/core'
import { layerIdConfig } from '@/config/app'
import { LatLng } from '../interface/map'

interface MapPinMarkProps {
	coords: LatLng
}

export default function MapPinMark({ coords }: MapPinMarkProps) {
	const { getLayer, addLayer, removeLayer } = useLayerStore()

	const getIconLayer = useCallback((coords: LatLng) => {
		const iconLayer = new IconLayer({
			id: layerIdConfig.toolCurrentLocation,
			data: [{ coordinates: [coords.longitude, coords.latitude] }],
			pickable: true,
			iconAtlas: '/images/map/icon-atlas.png',
			iconMapping: {
				marker: { x: 0, y: 0, width: 128, height: 128, anchorX: 64, anchorY: 64, mask: true },
			},
			getIcon: () => 'marker',
			getPosition: (d: any) => d.coordinates,
			getSize: 40,
			getColor: [255, 0, 0],
		})
		return iconLayer
	}, [])

	useEffect(() => {
		const iconLayer = getIconLayer(coords)
		addLayer(iconLayer as Layer)
		return () => {
			removeLayer(layerIdConfig.toolCurrentLocation)
		}
	}, [coords, getLayer, addLayer, removeLayer])

	return null
}
