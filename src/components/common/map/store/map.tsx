import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AreaTypeKey } from '@/enum'

import { MVTLayer } from '@deck.gl/geo-layers'
import { BASEMAP } from '@deck.gl/carto'
import { Layer, LayersList } from '@deck.gl/core'
import { ScatterplotLayer } from '@deck.gl/layers'

export type LayerStore = {
	layers: LayersList
	addLayer: (layer: Layer) => Layer
}
export const useLayerStore = create<LayerStore>()((set) => ({
	addLayer: (layer) => {
		set((state) => ({ ...state, layers: [...state.layers, layer] }))
		return layer
	},
	layers: [
		new MVTLayer({
			data: 'https://tileserver.cropinsurance-dev.thaicom.io/boundary_2022/tiles.json',
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
		new ScatterplotLayer({
			data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
			stroked: true,
			getPosition: (d) => d.coordinates,
			getRadius: (d) => Math.sqrt(d.exits),
			getFillColor: [255, 140, 0],
			getLineColor: [0, 0, 0],
			getLineWidth: 10,
			radiusScale: 6,
			pickable: true,
		}),
	],
}))

export default useLayerStore
