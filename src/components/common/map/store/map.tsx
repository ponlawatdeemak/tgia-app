import { create } from 'zustand'
import { Layer, LayersList } from '@deck.gl/core'
import type { MapboxOverlay } from '@deck.gl/mapbox'
import type { GoogleMapsOverlay } from '@deck.gl/google-maps'

export type LayerStore = {
	overlay?: MapboxOverlay | GoogleMapsOverlay
	setOverlay: (overlay: MapboxOverlay | GoogleMapsOverlay) => void
	layers: LayersList
	addLayer: (layer: Layer | undefined) => void
	setLayers: (layers: Layer[] | undefined) => void
	getLayer: (layerId: string) => Layer | undefined
	getLayers: () => LayersList
	removeLayer: (layerId: string) => void
}

export const useLayerStore = create<LayerStore>()((set, get) => ({
	overlay: undefined,
	setOverlay: (overlay) => set((state) => ({ ...state, overlay })),
	layers: [],
	addLayer: (layer) => set((state) => ({ ...state, layers: [...state.layers, layer] })),
	setLayers: (layers) =>
		set((state) => {
			return { ...state, layers }
		}),
	getLayer: (layerId: string): Layer | undefined => {
		const layer = get().layers.find((layer) => layer instanceof Layer && layer.id === layerId)
		return layer instanceof Layer ? layer : undefined
	},
	getLayers: (): LayersList => {
		return get().layers
	},
	removeLayer: (layerId) =>
		set((state) => ({
			...state,
			layers: state.layers.filter((layer) => !(layer instanceof Layer && layer.id === layerId)),
		})),
}))

export default useLayerStore
