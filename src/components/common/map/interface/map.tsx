import { Layer, LayersList } from '@deck.gl/core'

import { PropsWithChildren } from 'react'
import { MapLibreRef } from '../MapLibre'
import { MapGoogleRef } from '../MapGoogle'

export interface MapInterface {
	ref?: MapLibreRef | MapGoogleRef
	layers?: LayersList
	viewState?: MapViewState
	onViewStateChange?: (viewState: MapViewState) => void
	onMapClick?: (latLng: LatLng) => void
}
export interface MapViewState {
	longitude: number
	latitude: number
	zoom: number
}

export interface MapViewProps extends PropsWithChildren {
	className?: string
	isShowMapPin?: boolean
	onMapClick?: (latLng: LatLng) => void
}

export interface LatLng {
	latitude: number
	longitude: number
}
