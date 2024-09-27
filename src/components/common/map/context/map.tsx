import { createContext, useState, ReactNode, useContext, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import { LatLng, MapInfoWindow } from '../interface/map'
import useLayerStore from '../store/map'

interface MapContextProps {
	setExtent: (extent: [number, number, number, number]) => void
	setGoogleMapInstance: (mapInstance: google.maps.Map | null) => void
	setMapLibreInstance: (mapInstance: maplibregl.Map | null) => void
	setCenter: (coords: LatLng) => void
	setCenterAndZoom: (coords: LatLng, zoomLevel?: number) => void
	setMapInfoWindow: (infoWindow: MapInfoWindow | null) => void
	setLatLng: (coords: LatLng) => void
	googleMapInstance: google.maps.Map | null
	mapLibreInstance: maplibregl.Map | null
	mapInfoWindow: MapInfoWindow | null
	latLng: LatLng | null
}

const MapContext = createContext<MapContextProps>({
	setExtent: () => {},
	setGoogleMapInstance: () => {},
	setMapLibreInstance: () => {},
	setCenter: () => {},
	setCenterAndZoom: () => {},
	setMapInfoWindow: () => {},
	setLatLng: () => {},
	googleMapInstance: null,
	mapLibreInstance: null,
	mapInfoWindow: null,
	latLng: null,
})

export const MapProvider = ({ children }: { children: ReactNode }) => {
	const { getLayer, removeLayer } = useLayerStore()
	const [googleMapInstance, setGoogleMapInstance] = useState<google.maps.Map | null>(null)
	const [mapLibreInstance, setMapLibreInstance] = useState<maplibregl.Map | null>(null)
	const [mapInfoWindow, setMapInfoWindow] = useState<MapInfoWindow | null>(null)
	const [latLng, setLatLng] = useState<LatLng | null>(null)

	const setExtent = useCallback(
		(extent: [number, number, number, number]) => {
			if (mapLibreInstance) {
				mapLibreInstance.fitBounds([
					[extent[0], extent[1]],
					[extent[2], extent[3]],
				])
			} else if (googleMapInstance) {
				googleMapInstance.fitBounds(
					new window.google.maps.LatLngBounds(
						{ lat: extent[1], lng: extent[0] },
						{ lat: extent[3], lng: extent[2] },
					),
				)
			}
		},
		[googleMapInstance, mapLibreInstance],
	)

	const setCenter = useCallback(
		(coords: LatLng) => {
			if (mapLibreInstance) {
				mapLibreInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
			} else if (googleMapInstance) {
				googleMapInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
			}
		},
		[googleMapInstance, mapLibreInstance],
	)

	const setCenterAndZoom = useCallback(
		(coords: LatLng, zoomLevel: number = 13) => {
			if (mapLibreInstance) {
				mapLibreInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
				mapLibreInstance.zoomTo(zoomLevel)
			} else if (googleMapInstance) {
				googleMapInstance.setCenter({ lat: coords.latitude, lng: coords.longitude })
				googleMapInstance.setZoom(zoomLevel)
			}
		},
		[googleMapInstance, mapLibreInstance],
	)

	return (
		<MapContext.Provider
			value={{
				setExtent,
				setGoogleMapInstance,
				setMapLibreInstance,
				setCenter,
				setCenterAndZoom,
				setMapInfoWindow,
				setLatLng,
				googleMapInstance,
				mapLibreInstance,
				mapInfoWindow,
				latLng,
			}}
		>
			{children}
		</MapContext.Provider>
	)
}

export function useMap() {
	return useContext(MapContext)
}
