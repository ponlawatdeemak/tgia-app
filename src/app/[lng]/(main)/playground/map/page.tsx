'use client'
import React, { useEffect, useRef } from 'react'
import 'maplibre-gl/dist/maplibre-gl.css'
import MapView from '@/components/common/map/MapView'
import classNames from 'classnames'

import { MVTLayer } from '@deck.gl/geo-layers'
import { Button } from '@mui/material'
import useLayerStore from '@/components/common/map/store/map'
import { ConstructionOutlined } from '@mui/icons-material'

export default function PlaygroundPage() {
	const popupNode = useRef<HTMLDivElement>(null)
	const { layers, addLayer, setLayers } = useLayerStore()

	useEffect(() => {
		// overlay.setMap(map)
		// setOverlay(overlay)

		console.log(' test ')
		setLayers([
			// new MVTLayer({
			// 	data: 'https://tileserver.cropinsurance-dev.thaicom.io/province/tiles.json',
			// 	filled: true,
			// 	getFillColor(d) {
			// 		return [255, 0, 0, 100]
			// 	},
			// 	getLineColor(d) {
			// 		return [255, 0, 0, 255]
			// 	},
			// 	getLineWidth: 4,
			// 	pickable: true,
			// }),
			new MVTLayer({
				data: 'https://tileserver.cropinsurance-dev.thaicom.io/boundary_2022/tiles.json',
				filled: true,
				getFillColor(d) {
					return [0, 0, 255, 100]
				},
				getLineColor(d) {
					return [0, 0, 255, 255]
				},
				getLineWidth: 4,
				pickable: true,
			}),
		])

		// console.log(' layers  ', layers)
	}, [setLayers])

	// const pinLayer = useMemo(() => {
	// 	if (!coordinates) return;
	// 	return new IconLayer({
	// 	  id: "pre-permit-pin",
	// 	  // beforeId: "road-exit-shield",
	// 	  data: [{ coordinates }],
	// 	  visible: pinVisibility,
	// 	  getIcon: () => {
	// 		return {
	// 		  url: getPin("#01AA86"),
	// 		  anchorY: 69,
	// 		  width: 58,
	// 		  height: 69,
	// 		  mask: false,
	// 		};
	// 	  },
	// 	  sizeScale: 1,
	// 	  getPosition: (d) => d.coordinates,
	// 	  getSize: 40,
	// 	});
	//   }, [coordinates, pinVisibility]);

	return (
		<main>
			<div className='relative h-[calc(100vh-106px)] w-full'>
				<Button
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
				</Button>
				<MapView />
			</div>
		</main>
	)
}

function Info({ feature }: { feature: String }) {
	return (
		<div>
			<div className='pt-6'>{feature}</div>
		</div>
	)
}
