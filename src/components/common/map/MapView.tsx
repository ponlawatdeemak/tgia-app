import { useCallback, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import { BasemapType, MapType, MapInfoWindow, MapLayer, LatLng, MapViewState } from './interface/map'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import MapTools from './MapTools'
import { useMap } from './context/map'
import { Button, Paper, Box } from '@mui/material'
import { PropsWithChildren, useEffect } from 'react'
import useLayerStore from './store/map'
import MapPinMark from './layer/MapPinMark'
import { layerIdConfig } from '@/config/app'
import { BASEMAP } from '@deck.gl/carto'
import { IconLayer } from '@deck.gl/layers'
import { MVTLayer } from '@deck.gl/geo-layers'
import { Layer } from '@deck.gl/core'
import MapPin from './MapPin'
import maplibregl from 'maplibre-gl'

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
	onMapClick?: (latLng: LatLng) => void
}

// TO DO
export default function MapView({ className = '', isShowMapPin = false, initialLayer, onMapClick }: MapViewProps) {
	const { mapInfoWindow, mapLibreInstance, setCenter, setMapInfoWindow } = useMap()
	const { getLayer, getLayers, setLayers } = useLayerStore()
	const [mapType, setMapType] = useState<MapType>(DEFAULT.mapType)
	const [viewState, setViewState] = useState<MapViewState>(DEFAULT.viewState)
	const [basemap, setBasemap] = useState(DEFAULT.basemap)
	const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null)

	const popupNode = useRef<HTMLDivElement>(null)

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

	useEffect(() => {
		return () => {
			setMapInfoWindow(null)
		}
	}, [setMapInfoWindow])

	// const popup = useMemo(() => {
	// 	new maplibregl.Popup({
	// 		maxWidth: '300px',
	// 		closeOnClick: false,
	// 		closeOnMove: false,
	// 	})
	// }, [])

	const popup = useMemo(
		() =>
			new maplibregl.Popup({
				maxWidth: '300px',
				closeOnClick: false,
				closeOnMove: false,
			}),
		[],
	)

	// useEffect(() => {
	// 	return () => {
	// 		console.log('popup ', mapLibreInstance)

	// 		if (!mapLibreInstance) return

	// 		console.log('popup22 ')

	// 		const popup = new maplibregl.Popup({ closeOnClick: false })
	// 			.setLngLat([-96, 37.8])
	// 			.setHTML('<h1>Hello World!</h1>')
	// 			.addTo(mapLibreInstance)

	// 		// if (!mapInfoWindow?.children) {
	// 		// 	if (!popupNode.current || !mapInfoWindow?.positon || !mapLibreInstance) return

	// 		// 	const position = mapInfoWindow.positon

	// 		// 	const x = new maplibregl.Popup({
	// 		// 		maxWidth: '300px',
	// 		// 		closeOnClick: false,
	// 		// 		closeOnMove: false,
	// 		// 	})

	// 		// 	x.setLngLat

	// 		// 	popup.setLngLat([position.x, position.y]).setDOMContent(popupNode.current).addTo(mapLibreInstance)
	// 		// }
	// 	}
	// }, [popup, mapInfoWindow, mapLibreInstance])

	// const onMapClick = useCallback<NonNullable<PermitMapProps["onClick"]>>(
	//     (
	//       objects: { object: FeatureDto<ListReqBldgPermitOutDto> }[] | any | null,
	//       info
	//     ) => {
	//       onClick?.(objects, info);
	//       if (!objects || !objects[0] || !map || !popupNode.current) return;
	//       const { object } = objects[0];

	//       const [lng, lat] = info.coordinate || [];

	//       setFeature(object);
	//       popup?.setLngLat([lng, lat]).setDOMContent(popupNode.current).addTo(map);
	//     },
	//     [popup, map, onClick]
	//   );

	return (
		<div className={classNames('relative flex h-full flex-1 overflow-hidden', className)}>
			{isShowMapPin && (
				<Box className='absolute bottom-[8.7rem] left-2 z-10'>
					<MapPin />
				</Box>
			)}
			<Box className='absolute bottom-2 left-2 z-10'>
				<MapTools
					layerList={initialLayer}
					onZoomIn={() => setViewState({ ...viewState, zoom: viewState.zoom + 1 })}
					onZoomOut={() => setViewState({ ...viewState, zoom: viewState.zoom - 1 })}
					onBasemapChanged={onBasemapChanged}
					onGetLocation={onGetLocation}
					currentBaseMap={basemap}
				/>
			</Box>

			{mapType === MapType.Libre ? (
				<MapLibre
					viewState={viewState}
					mapStyle={basemap === BasemapType.CartoLight ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
					onMapClick={(latLng: LatLng) => {
						onMapClick?.(latLng)
					}}
				/>
			) : (
				<MapGoogle
					viewState={viewState}
					onViewStateChange={onViewStateChange}
					onMapClick={(latLng: LatLng) => {
						onMapClick?.(latLng)
					}}
				/>
			)}
			{/* {mapInfoWindow && (
				<div ref={popupNode} className={`m-4 max-h-80 flex-col ${!mapInfoWindow.children ? 'hidden' : 'flex'}`}>
					{mapInfoWindow.children}
				</div>

				// <InfoWindow positon={mapInfoWindow.positon} onClose={() => setMapInfoWindow(null)}>
				// 	{mapInfoWindow.children}
				// </InfoWindow>
			)} */}
			{currentLocation && mapType === MapType.Libre && <MapPinMark coords={currentLocation} />}
			{currentLocation && mapType === MapType.Google && <MapPinMark coords={currentLocation} />}
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
