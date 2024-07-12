import maplibregl from 'maplibre-gl'
import { useEffect, useMemo } from 'react'
import { useMap } from './context'

export type MapEventCallback = (evt: maplibregl.MapLibreEvent) => void
export type MapMouseEventCallback = (evt: maplibregl.MapMouseEvent) => void

export function useMapLibre(ref: React.RefObject<HTMLElement>, opts?: Omit<maplibregl.MapOptions, 'container'>) {
	const mapContext = useMap()

	useEffect(() => {
		if (mapContext.map) return
		if (!mapContext.setMap) return
		if (!ref.current) return
		console.debug('Create Map Instance')
		const map = new maplibregl.Map({
			style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=Lwq4BQgNPyauaUe03gYT',
			// ...(opts ? opts : { style: "https://demotiles.maplibre.org/style.json" }),
			container: ref.current,
			antialias: false,
		})
		mapContext.setMap?.(map)
	}, [ref, mapContext.map, mapContext.setMap])

	const fullExtentControl = useMemo(() => {
		console.debug('Create FullExtentControll')
		return new FullExtentControll(opts?.bounds || [-180, -90, 180, 90])
	}, [opts?.bounds])

	const scaleControl = useMemo(() => {
		console.debug('Create ScaleControl')
		return new maplibregl.ScaleControl({ maxWidth: 80, unit: 'metric' })
	}, [])

	const navigateContol = useMemo(() => {
		console.debug('Create NavigationControl')
		return new maplibregl.NavigationControl()
	}, [])

	const geoControl = useMemo(() => {
		console.debug('Create GeolocateControl')
		return new maplibregl.GeolocateControl({
			positionOptions: { enableHighAccuracy: true },
			trackUserLocation: true,
		})
	}, [])

	useEffect(() => {
		if (!mapContext.map) return
		if (!mapContext.map.hasControl(navigateContol)) {
			mapContext.map?.addControl(navigateContol, 'bottom-right')
		}
		if (!mapContext.map.hasControl(fullExtentControl)) {
			mapContext.map?.addControl(fullExtentControl, 'bottom-right')
		}
		if (!mapContext.map.hasControl(geoControl)) {
			mapContext.map?.addControl(geoControl, 'bottom-right')
		}
		if (!mapContext.map.hasControl(scaleControl)) {
			mapContext.map?.addControl(scaleControl, 'bottom-left')
		}
	}, [mapContext.map])

	useEffect(() => {
		if (!mapContext.map || !opts?.style) return
		mapContext.map.setStyle(opts.style)
	}, [mapContext.map, opts?.style])

	useEffect(() => {
		if (!mapContext.map || !opts?.bounds) return
		if (Array.isArray(opts?.bounds) && (!opts?.bounds[0] || !opts?.bounds[1])) return
		try {
			mapContext.map.fitBounds(opts.bounds, {
				animate: false,
				linear: false,
				padding: 16,
			})
		} catch (err) {}
	}, [mapContext.map, opts?.bounds])

	useEffect(() => {
		if (!mapContext.map || !opts?.center) return
		mapContext.map.setCenter(opts.center)
	}, [mapContext.map, opts?.center])

	useEffect(() => {
		if (!mapContext.map || !opts?.zoom) return
		mapContext.map.setZoom(opts.zoom)
	}, [mapContext.map, opts?.zoom])

	return mapContext
}

class FullExtentControll implements maplibregl.IControl {
	private _map?: maplibregl.Map
	private _container?: HTMLDivElement

	private _bounds: maplibregl.LngLatBoundsLike
	private _options?: maplibregl.FitBoundsOptions

	constructor(bounds: maplibregl.LngLatBoundsLike, options?: maplibregl.FitBoundsOptions) {
		this._bounds = bounds
		this._options = options
	}

	onAdd(map: maplibregl.Map) {
		this._map = map
		this._container = document.createElement('div')
		this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group'

		const button = document.createElement('button')
		button.className = 'maplibregl-ctrl-full-extent'
		button.onclick = () => {
			this._map?.fitBounds(this._bounds, {
				...this._options,
				padding: 16,
				linear: false,
			})
		}

		const icon = document.createElement('span')
		icon.className = 'material-icons-outlined'
		icon.textContent = 'home'
		icon.style.paddingTop = '3px'

		button.appendChild(icon)

		this._container.appendChild(button)
		return this._container
	}

	onRemove() {
		this._container?.parentNode?.removeChild(this._container)
		this._map = undefined
	}
}
