import { Layer } from '@deck.gl/core'
export interface MapInterface {
	viewState?: MapViewState
	onViewStateChange?: (viewState: MapViewState) => void
	onMapClick?: (latLng: LatLng) => void
}

export interface MapViewState {
	longitude: number
	latitude: number
	zoom: number
}

export interface BaseMap {
	value: BasemapType
	image: string
	label: string
}

export interface LatLng {
	latitude: number
	longitude: number
}

export interface MapInfoWindow {
	positon?: {
		x: number
		y: number
	}
	children?: React.ReactNode
}

export interface MapLayer {
	id: string
	label: string
	color: string
	layer: Layer
}

export interface MapLegend {
	id: string
	label: string
	color: string
}

export enum MapType {
	Libre,
	Google,
}

export enum BasemapType {
	CartoLight,
	CartoDark,
	Google,
}
