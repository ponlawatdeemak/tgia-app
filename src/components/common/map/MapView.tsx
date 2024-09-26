import { useCallback, useState } from 'react'
import classNames from 'classnames'
import { BasemapType, MapType, MapInfoWindow, MapLayer, LatLng, MapViewState } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTools'
import { useMap } from './context/map'
import { Button, Paper } from '@mui/material'
import { PropsWithChildren, useEffect } from 'react'
import useLayerStore from './store/map'
import MapPin from './layer/MapPin'
import { layerIdConfig } from '@/config/app'
import { BASEMAP } from '@deck.gl/carto'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'

const CURRENT_LOCATION_ZOOM = 14
const DEFAULT = {
	viewState: {
		longitude: 100,
		latitude: 13,
		zoom: 5,
	},
	mapType: MapType.Libre,
	basemap: BasemapType.CartoLight,
}

export interface MapViewProps extends PropsWithChildren {
	className?: string
	initialLayer?: MapLayer[]
	isShowMapPin?: boolean
}

// TO DO
export default function MapView({ className = '', isShowMapPin = false, initialLayer }: MapViewProps) {
	const { mapInfoWindow, setCenter, setMapInfoWindow } = useMap()
	const { getLayer, getLayers, setLayers } = useLayerStore()
	const [mapType, setMapType] = useState<MapType>(DEFAULT.mapType)
	const [viewState, setViewState] = useState<MapViewState>(DEFAULT.viewState)
	const [basemap, setBasemap] = useState(DEFAULT.basemap)
	const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

	useEffect(() => {
		return () => {
			setMapInfoWindow(null)
		}
	}, [setMapInfoWindow])

	useEffect(() => {
		if (initialLayer && initialLayer.length) {
			const layers = initialLayer.map((item) => item.layer)
			setLayers(layers)
		}
	}, [setLayers])

	useEffect(() => {
		const recreateLayers = () => {
			const layers = getLayers()
			const newLayers = layers.map((layer) => {
				if (layer instanceof IconLayer) {
					return new IconLayer({ ...layer.props })
				}
				if (layer instanceof MVTLayer) {
					return new MVTLayer({ ...layer.props })
				}
				return layer
			})
			setLayers(newLayers as Layer[])
		}
		recreateLayers()
	}, [mapType, setLayers, getLayers])

	const onViewStateChange = useCallback((viewState: MapViewState) => {
		setViewState(viewState)
	}, [])

	const onBasemapChanged = useCallback((basemap: BasemapType) => {
		setBasemap(basemap)
		if (basemap === BasemapType.Google) {
			setMapType(MapType.Google)
		} else {
			setMapType(MapType.Libre)
		}
	}, [])

	const onGetLocation = useCallback(
		(coords: GeolocationCoordinates) => {
			const layer = getLayer(layerIdConfig.toolCurrentLocation)
			if (layer) {
				setCurrentLocation(null)
			} else {
				const { latitude, longitude } = coords
				setCurrentLocation({ latitude, longitude })
				setCenter({ latitude, longitude })
				setViewState({ longitude, latitude, zoom: CURRENT_LOCATION_ZOOM })
			}
		},
		[getLayer, setCurrentLocation, setCenter],
	)

	return (
		<div className={classNames('relative flex flex-1 overflow-hidden', className)}>
			<MapTools
				layerList={initialLayer}
				onZoomIn={() => setViewState({ ...viewState, zoom: viewState.zoom + 1 })}
				onZoomOut={() => setViewState({ ...viewState, zoom: viewState.zoom - 1 })}
				onBasemapChanged={onBasemapChanged}
				onGetLocation={onGetLocation}
				currentBaseMap={basemap}
			/>
			{mapType === MapType.Libre ? (
				<MapLibre
					viewState={viewState}
					mapStyle={basemap === BasemapType.CartoLight ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
				/>
			) : (
				<MapGoogle viewState={viewState} onViewStateChange={onViewStateChange} />
			)}
			{mapInfoWindow && (
				<InfoWindow positon={mapInfoWindow.positon} onClose={() => setMapInfoWindow(null)}>
					{mapInfoWindow.children}
				</InfoWindow>
			)}
			{currentLocation && mapType === MapType.Libre && <MapPin coords={currentLocation} />}
			{currentLocation && mapType === MapType.Google && <MapPin coords={currentLocation} />}
		</div>
	)
}

export interface InfoWindowProps extends MapInfoWindow, PropsWithChildren {
	onClose?: () => void
}

const InfoWindow: React.FC<InfoWindowProps> = ({ positon, children, onClose }) => {
	if (!positon) return null
	return (
		<Paper className='absolute z-10 bg-white p-2' style={{ left: positon.x, top: positon.y }}>
			{children}
			<Button onClick={onClose}>close</Button>
		</Paper>
	)
}
