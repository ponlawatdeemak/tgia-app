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
}
export const useLayerStore = create<LayerStore>()((set) => ({
	overlay: undefined,
	setOverlay: (overlay) => set((state) => ({ ...state, overlay })),
	addLayer: (layer) => set((state) => ({ ...state, layers: [...state.layers, layer] })),
	layers: [],
	setLayers: (layers) =>
		set((state) => {
			return { ...state, layers }
		}),
}))

export default useLayerStore
