'use client'
import { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import classNames from 'classnames'
import { ToggleButtonGroup, ToggleButton } from '@mui/material'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import { MVTLayer } from '@deck.gl/geo-layers'
import { BASEMAP } from '@deck.gl/carto'
import { Layer, LayersList } from '@deck.gl/core'
import { create } from 'zustand'

export interface MapInterface {
	layers?: LayersList
	viewState?: MapViewState
	onViewStateChange?: (viewState: MapViewState) => void
}
export interface MapViewState {
	longitude: number
	latitude: number
	zoom: number
}
const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 100,
	latitude: 13,
	zoom: 5,
}

export interface MapViewProps extends PropsWithChildren {
	className?: string
}

// export type LayerStore = {
// 	layers: LayersList
// 	addLayer: (layer: Layer) => Layer
// }
// export const useLayerStore = create<LayerStore>()((set) => ({
// 	addLayer: (layer) => {
// 		set((state) => ({ ...state, layers: [...state.layers, layer] }))
// 		return layer
// 	},
// 	layers: [
// 		new MVTLayer({
// 			data: 'https://tileserver.cropinsurance-dev.thaicom.io/boundary_2022/tiles.json',
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
// 	],
// }))

export default function MapView({ className = '' }: MapViewProps) {
	const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
	const [basemap, setBasemap] = useState('carto-light')
	const onViewStateChange = useCallback((v: any) => {
		setViewState(v)
	}, [])

	const handleChange = (event: React.MouseEvent<HTMLElement>, newBasemap: string) => {
		setBasemap((prev) => newBasemap || prev)
	}

	return (
		<div className={classNames('relative flex h-full flex-1 flex-col overflow-hidden', className)}>
			<ToggleButtonGroup
				size='small'
				exclusive
				color='primary'
				className='absolute left-0 top-0 z-10 bg-white'
				value={basemap}
				onChange={handleChange}
			>
				<ToggleButton value={'carto-light'}>Street</ToggleButton>
				<ToggleButton value={'carto-dark'}>Dark Matter</ToggleButton>
				<ToggleButton value={'google'}>Satellite</ToggleButton>
			</ToggleButtonGroup>
			{basemap !== 'google' ? (
				<MapLibre
					viewState={viewState as any}
					mapStyle={basemap === 'carto-light' ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
				/>
			) : (
				<MapGoogle viewState={viewState} onViewStateChange={onViewStateChange} />
			)}
		</div>
	)
}
