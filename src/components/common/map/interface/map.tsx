import { Layer, LayersList } from '@deck.gl/core'

import { PropsWithChildren } from 'react'

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

export interface MapViewProps extends PropsWithChildren {
	className?: string 
}
