'use client'
import React, { useEffect, useMemo, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'

import { MVTLayer } from '@deck.gl/geo-layers'
import { Button } from '@mui/material'
import useLayerStore from '@/components/common/map/store/map'
import { ConstructionOutlined } from '@mui/icons-material'
import { apiAccessToken } from '@/api/core'
import { tileLayer } from '@/config/app'
import { IconLayer } from '@deck.gl/layers'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { getPin } from '@/utils/pin'
import { BoundaryTileColor, LossTypeTileColor } from '@/config/color'

export default function PlaygroundPage() {
	const popupNode = useRef<HTMLDivElement>(null)
	const { layers, addLayer, setLayers } = useLayerStore()

	useEffect(() => {
		// overlay.setMap(map)
		// setOverlay(overlay)

		console.log(' test ')
		// setLayers([
		// 	// new MVTLayer({
		// 	// 	data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
		// 	// 	filled: true,
		// 	// 	getFillColor(d) {
		// 	// 		return [255, 0, 0, 100]
		// 	// 	},
		// 	// 	getLineColor(d) {
		// 	// 		return [255, 0, 0, 255]
		// 	// 	},
		// 	// 	getLineWidth: 4,
		// 	// 	pickable: true,
		// 	// }),
		// 	new MVTLayer({
		// 		data: 'https://tileserver.cropinsurance-dev.thaicom.io/boundary_2022/tiles.json',
		// 		filled: true,
		// 		getFillColor(d) {
		// 			return [0, 0, 255, 100]
		// 		},
		// 		getLineColor(d) {
		// 			return [0, 0, 255, 255]
		// 		},
		// 		getLineWidth: 4,
		// 		pickable: true,
		// 	}),
		// ])

		addLayer(
			new MVTLayer({
				id: `boundary_$${2020}`,
				name: `boundary_$${2020}`,
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: `${process.env.API_URL_TILE}/boundary_${2020}/tiles.json`,
				filled: true,
				getFillColor(d) {
					return BoundaryTileColor.green
				},

				pickable: true,
			}),
		)

		addLayer(
			new MVTLayer({
				id: `boundary_$${2022}`,
				name: `boundary_$${2022}`,
				loadOptions: {
					fetch: {
						headers: {
							'content-type': 'application/json',
							Authorization: `Bearer ${apiAccessToken}`,
						},
					},
				},
				data: `${process.env.API_URL_TILE}/boundary_${2022}/tiles.json`,
				filled: true,
				getFillColor(d) {
					return LossTypeTileColor.flood
				},

				pickable: true,
			}),
		)

		addLayer(
			new IconLayer({
				id: 'IconLayer',
				data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
				getColor: (d) => [Math.sqrt(d.exits), 140, 0],
				getIcon: (d) => 'marker',
				getPosition: (d) => d.coordinates,
				getSize: 40,
				iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
				iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
				pickable: true,
			}),
		)

		// console.log(' layers  ', layers)
	}, [setLayers, addLayer])

	const { data: poisData, isLoading: isPOISDataLoading } = useQuery({
		queryKey: ['getPOISMapPin'],
		queryFn: () => service.plotMonitoring.getPOIS(),
	})

	const poisDataWithCoordinates = useMemo(() => {
		return poisData?.data?.map((data) => ({ ...data, coordinates: [data.lng, data.lat] }))
	}, [poisData])

	const initialLayer = useMemo(() => {
		console.log('poisDataWithCoordinates ', poisDataWithCoordinates)
		return [
			{
				id: 'province-layer',
				label: 'province',
				color: '#1f75cb',
				layer: new MVTLayer({
					id: 'province-layer',
					name: 'province',
					loadOptions: {
						fetch: {
							headers: {
								'content-type': 'application/json',
								Authorization: `Bearer ${apiAccessToken}`,
							},
						},
					},
					data: tileLayer.province,
					filled: true,
					lineWidthUnits: 'pixels',
					pickable: true,
					getFillColor() {
						return [226, 226, 226, 100]
					},
				}),
			},
			// {
			// 	id: 'province-layer2',
			// 	label: 'province2',
			// 	color: '#1f75cb',
			// 	layer: new IconLayer({
			// 		id: 'IconLayer',
			// 		// data: poisDataWithCoordinates,
			// 		data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
			// 		getColor: (d) => {
			// 			return [240, 62, 62, 255]
			// 		},
			// 		// getIcon: (d: PoisIconType) => {
			// 		// 	return 'marker'
			// 		// },
			// 		getIcon: () => {
			// 			return {
			// 				url: getPin('#01AA86'),
			// 				anchorY: 69,
			// 				width: 58,
			// 				height: 69,
			// 				mask: false,
			// 			}
			// 		},
			// 		getPosition: (d) => {
			// 			return d.coordinates
			// 		},
			// 		getSize: 40,

			// 		// sizeScale: 1,
			// 		// getPosition: (d) => d.coordinates,
			// 		// getSize: 40,

			// 		// iconAtlas: '/map/pin/location_on.png',
			// 		// iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
			// 		// iconMapping: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.json',
			// 		pickable: true,
			// 		// onClick: (info, event) => {
			// 		// 	if (info.object) {
			// 		// 		if (poisDataIds.includes(info.object.poiId)) {
			// 		// 			setClickPinInfo({ x: info.x, y: info.y, area: info.object })
			// 		// 		} else {
			// 		// 			setClickPinInfo(null)
			// 		// 		}
			// 		// 	} else {
			// 		// 		setClickPinInfo(null)
			// 		// 	}
			// 		// },
			// 	}),
			// },
		]
	}, [poisDataWithCoordinates])

	return (
		<div className='flex flex-1 flex-col overflow-auto'>
			{/* className='relative h-[calc(100vh-106px)] w-full' ' */}
			{/* <Button
				// onClick={() => {
				// 	console.log('onClick Province')
				// 	addLayer(
				// 		new MVTLayer({
				// 			data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
				// 			filled: true,
				// 			getFillColor(d) {
				// 				return [255, 0, 0, 100]
				// 			},
				// 			getLineColor(d) {
				// 				return [255, 0, 0, 255]
				// 			},
				// 			getLineWidth: 4,
				// 			pickable: true,
				// 		}),
				// 	)
				// }}
				>
					Province
				</Button>
				<Button
					onClick={() => {
						console.log('onClick District')

						const xx = []

						xx.push(
							new MVTLayer({
								data: 'https://tileserver.cropinsurance-dev.thaicom.io/district/tiles.json',
								filled: true,
								getFillColor(d) {
									return [255, 0, 0, 100]
								},
								getLineColor(d) {
									return [255, 0, 0, 255]
								},
								getLineWidth: 4,
								pickable: true,
							}),
						)

						// const xxxx = layers.concat(xx || undefined)

						// layers.concat(xx)
						addLayer(
							new MVTLayer({
								data: 'https://tileserver.cropinsurance-dev.thaicom.io/district/tiles.json',
								filled: true,
								getFillColor(d) {
									return [0, 255, 0, 100]
								},
								getLineColor(d) {
									return [0, 255, 0, 255]
								},
								getLineWidth: 4,
								pickable: true,
							}),
						)
						//	setLayers(xx)

						// addLayer(
						// 	new MVTLayer({
						// 		data: 'https://tileserver.cropinsurance-dev.thaicom.io/district/tiles.json',
						// 		filled: true,
						// 		getFillColor(d) {
						// 			return [255, 0, 0, 100]
						// 		},
						// 		getLineColor(d) {
						// 			return [255, 0, 0, 255]
						// 		},
						// 		getLineWidth: 4,
						// 		pickable: true,
						// 	}),
						// )
					}}
				>
					District
				</Button>
				<Button>SubDistrict</Button>

				<Button
					onClick={() => {
						console.log('layer ', layers)
					}}
				>
					Get Layer
				</Button> */}
			<MapView initialLayer={initialLayer} />
		</div>
	)
}

function Info({ feature }: { feature: String }) {
	return (
		<div>
			<div className='pt-6'>{feature}</div>
		</div>
	)
}
