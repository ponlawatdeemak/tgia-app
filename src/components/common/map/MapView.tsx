'use client'
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef } from 'react'
import { useMap, useMapLibre } from '@/contexts/map'
import BasemapList, { MapStyle, MapType } from './BasemapList'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import { useResizeDetector } from 'react-resize-detector'
import classNames from 'classnames'
import { IconButton, Typography, Divider, Button } from '@mui/material'
import { useLocalStorage } from '@/hook/local-storage'

export interface MapViewProps extends PropsWithChildren {
	style?: string
	loading?: boolean
	className?: string
	onClick?: (objects: any[] | null, info: any) => void
	defaultMapType?: MapType
	disableBasemapList?: boolean
	initialBounds?: ThailandBoundsKey | maplibregl.LngLatBoundsLike
	bounds?: ThailandBoundsKey | maplibregl.LngLatBoundsLike
	dataBounds?: ThailandBoundsKey | maplibregl.LngLatBoundsLike
	onReady?: (map: maplibregl.Map) => void
	busy?: boolean
}

export default function MapView({
	style,
	loading = true,
	disableBasemapList = false,
	defaultMapType = MapType.Imagery,
	onClick,
	className = '',
	children,
	initialBounds = 'full',
	bounds,
	dataBounds,
	onReady,
	busy,
}: MapViewProps) {
	const initBounds = useMemo(() => {
		if (typeof initialBounds === 'string') {
			return thailandBounds[initialBounds] || thailandBounds['full']
		} else if (initialBounds) {
			return initialBounds
		}
	}, [initialBounds])

	const dataBoundsButton = useMemo(() => {
		if (typeof dataBounds === 'string') {
			return thailandBounds[dataBounds] || thailandBounds['full']
		} else if (dataBounds) {
			return dataBounds
		}
	}, [dataBounds])

	const ref = useRef<HTMLDivElement>(null)
	const [mapType] = useLocalStorage<MapType>('maplibregl.mapType', defaultMapType)
	const source = 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json'

	const { map } = useMapLibre(ref, {
		style: MapStyle[mapType as MapType],
		// style: source,
		bounds: initBounds,
	})

	const propsOnHover = useMemo(() => {
		if (!map) return

		return {
			onHover(info: any, event: any) {
				if (!map?.getCanvas?.()?.style) return
				if (info.object) {
					map.getCanvas().style.cursor = 'pointer'
				} else {
					map.getCanvas().style.cursor = ''
				}
			},
		}
	}, [map])

	// const propsOnClick = useMemo(() => {
	// 	if (!deck) return
	// 	return {
	// 		onClick(info: any) {
	// 			onClick?.(deck.pickMultipleObjects(info), info)
	// 		},
	// 	}
	// }, [deck, onClick])

	useEffect(() => {
		if (!map) return
		map.once('idle', () => {
			map.resize()
			onReady?.(map)
		})

		document.addEventListener('fullscreenchange', () => resizeMap())

		document.addEventListener('webkitfullscreenchange', () => resizeMap())
	}, [map])

	const resizeMap = useCallback(() => {
		// setIsFullscreen((prev) => !prev)
		setTimeout(() => map?.resize(), 0)
	}, [map])

	// useEffect(() => {
	//   if (!deck || !onClick) return;
	//   deck.setProps({
	//     onClick(info) {
	//       onClick?.(deck.pickMultipleObjects(info), info);
	//     },
	//   });
	// }, [deck, onClick]);

	// useEffect(() => {
	// 	if (!deck) return
	// 	deck.setProps({ layers, ...propsOnClick, ...propsOnHover })
	// }, [deck, layers, propsOnClick, propsOnHover])

	useEffect(() => {
		if (!map || !bounds) return
		const fitOptions: maplibregl.FitBoundsOptions = {
			duration: 100,
			padding: 16,
			maxZoom: 18,
		}
		if (typeof bounds === 'string') {
			if (!thailandBounds[bounds]) {
				// notification.warning('Unknown officerArea.')
				return
			}
			map.fitBounds(thailandBounds[bounds], fitOptions)
		} else {
			map.fitBounds(bounds, fitOptions)
		}
	}, [map, bounds])

	const onResize = useCallback(() => {
		map?.resize()
	}, [map])

	const { ref: resizeRef } = useResizeDetector({
		handleHeight: false,
		refreshMode: 'debounce',
		refreshRate: 300,
		onResize,
	})

	// const showStreetView = useMemo(() => {
	// 	return disableStreetView !== true && streetViewCoordiantes && !isFullscreen
	// }, [streetViewCoordiantes, isFullscreen])

	const showLayerList = disableBasemapList !== true

	// const hideIconTrash = useCallback((hide: boolean) => {
	// 	setHideIcon(hide)
	// }, [])

	// const onClick3D = useCallback(() => {
	// 	if (!map) return

	// 	setActive3d((prev) => !prev)

	// 	// // เปิด 3d
	// 	// if (!active3d) {
	// 	// 	map.easeTo({ pitch: 75, zoom: 18 })

	// 	// 	const newDatasets: WebMapDatasets['datasets'] = {
	// 	// 		...datasets,
	// 	// 		[LayerId.buildingBlock]: {
	// 	// 			...buildingBlock3dLayer,
	// 	// 			customProps: {
	// 	// 				...buildingBlock3dLayer.customProps,
	// 	// 				visible: true,
	// 	// 			},
	// 	// 		},
	// 	// 	}

	// 	// 	setDatasets(newDatasets)
	// 	// } else {
	// 	map.easeTo({ pitch: 0 })
	// 	// }
	// }, [map])

	return (
		<div
			className={classNames(
				'relative flex h-full flex-1 flex-col overflow-hidden',
				className,

				// hideIcon ? 'hide-icon-trash' : '',
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-fullscreen)]:relative',
				// showStreetView
				// 	? `[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-fullscreen)]:right-[118px]`
				// 	: `[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-fullscreen)]:right-[78px]`,
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-fullscreen)]:top-[-6px]',
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-fullscreen)]:shadow-none',
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-shrink)]:relative',
				// showStreetView
				// 	? `[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-shrink)]:right-[118px]`
				// 	: `[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-shrink)]:right-[78px]`,
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-shrink)]:top-[-6px]',
				// '[&_.mapboxgl-ctrl-group:has(.mapboxgl-ctrl-shrink)]:shadow-none',
				// '[&_.mapboxgl-ctrl-fullscreen]:w-[32px]',
				// '[&_.mapboxgl-ctrl-fullscreen]:h-[32px]',
				// '[&_.mapboxgl-ctrl-shrink]:w-[32px]',
				// '[&_.mapboxgl-ctrl-shrink]:h-[32px]',
			)}
			// style={style}s
			ref={resizeRef}
		>
			<div ref={ref} className='flex-1'>
				{showLayerList ? (
					<MapLayerList
						className={classNames('absolute right-[8px] top-1')}
						defaultMapType={mapType}
						disableBasemapList={disableBasemapList}
						// disableLayerList={disableLayerList}
						// active3d={active3d}
						// busy={busy}
					/>
				) : null}
				{children}
			</div>
		</div>
	)
}

export function MapLayerList({
	className,
	defaultMapType,
	disableBasemapList = false,
	disableLayerList = false,
	active3d = false,
}: {
	className?: string
	defaultMapType?: MapType
	disableBasemapList?: boolean
	disableLayerList?: boolean
	active3d?: boolean
}) {
	const { openBasemap, setOpenBasemap } = useMap()

	return (
		<>
			{/* <IconButton
				color='white'
	 
				title='แผนที่ฐาน'
				textColor='secondary'
				onClick={() => setOpen(!open)}
				path={mdiLayersTripleOutline}
				className={classNames('z-10', className)}
			/> */}
			{/* xxx
			<Button>test</Button>
			<Icon path={mdiLayersOutline} /> */}
			<div
				style={{ display: openBasemap ? undefined : 'none' }}
				className={classNames(
					'absolute bottom-32 left-14 z-10',
					'max-h-[calc(100%_-_64px)] min-w-[280px] overflow-y-auto bg-white p-4 py-2 font-normal',
				)}
			>
				{disableBasemapList !== true && (
					<>
						<BasemapList defaultMapType={defaultMapType}>
							<Typography>แผนที่ฐาน</Typography>

							<IconButton
								aria-label='delete'
								color='primary'
								onClick={() => {
									setOpenBasemap(false)
								}}
							>
								<Icon path={mdiClose} size={1}></Icon>
							</IconButton>
							<Divider className='mb-2 mt-1' />
						</BasemapList>
						<div className='mb-2' />
					</>
				)}
			</div>
		</>
	)
}

export type ThailandBoundsKey = 'full'

export const thailandBounds: {
	[key: ThailandBoundsKey | string]: maplibregl.LngLatBoundsLike
} = {
	full: [97.3758964376, 5.69138418215, 105.589038527, 20.4178496363],
}
