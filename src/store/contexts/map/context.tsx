'use client'
import {
	Context,
	createContext,
	Dispatch,
	PropsWithChildren,
	SetStateAction,
	useContext,
	useMemo,
	useState,
} from 'react'

export type SourceSpecificationAndName = maplibregl.RasterSourceSpecification & {
	id: string
	name: string
}

export type MapType = maplibregl.Map
export interface MapContextValue<T = MapType> {
	map?: T
	sources?: SourceSpecificationAndName[][]
	visibility?: Record<string, boolean>
	layerIds?: Record<string, string>
	selectedSource?: Record<string, string>
	openBasemap?: boolean
}

export interface MapContextFunction<T = MapType> {
	setMap?: (map?: T) => void
	setSources: Dispatch<SetStateAction<SourceSpecificationAndName[][] | undefined>>
	setVisibility: Dispatch<SetStateAction<Record<string, boolean> | undefined>>
	setLayerIds: Dispatch<SetStateAction<Record<string, string> | undefined>>
	setSelectedSource: Dispatch<SetStateAction<Record<string, string> | undefined>>
	setOpenBasemap: Dispatch<SetStateAction<boolean>>
}

export type MapContextProps<T = MapType> = MapContextValue<T> & MapContextFunction<T>

const defaultValue: MapContextProps = {
	map: undefined,
	sources: undefined,
	setMap: (map) => {},
	setSources: () => {},
	setVisibility: () => {},
	setLayerIds: () => {},
	setSelectedSource: () => {},
	setOpenBasemap: () => {},
}

export interface MapProviderProps<T = MapType> extends MapContextValue<T>, PropsWithChildren {}

export const MapContext = createContext<MapContextProps>(defaultValue)

export function MapProvider({ children, map: defaultMap, sources: defaultSources }: MapProviderProps) {
	const [map, setMap] = useState<MapType | undefined>(defaultMap)
	const [sources, setSources] = useState<SourceSpecificationAndName[][] | undefined>(defaultSources)
	const [visibility, setVisibility] = useState<Record<string, boolean>>()
	const [layerIds, setLayerIds] = useState<Record<string, string>>()
	const [selectedSource, setSelectedSource] = useState<Record<string, string>>()
	const [openBasemap, setOpenBasemap] = useState<boolean>(false)

	const contextValue = useMemo<MapContextProps>(() => {
		return {
			...defaultValue,
			map,
			setMap,
			sources,
			setSources,
			visibility,
			setVisibility,
			layerIds,
			setLayerIds,
			selectedSource,
			setSelectedSource,
			openBasemap,
			setOpenBasemap,
		}
	}, [sources, map, visibility, layerIds, selectedSource, openBasemap])

	return <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
}

export function useMap<T = MapType>() {
	const MapContextTyped = MapContext as Context<MapContextProps<T>>
	return useContext(MapContextTyped)
}
