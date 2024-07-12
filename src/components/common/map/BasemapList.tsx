'use client'
import { useLocalStorage } from '@/hook/local-storage'
import { useMap } from '@/contexts/map'
import { Button } from '@mui/material'
import maplibregl from 'maplibre-gl'
import { useMemo } from 'react'

export interface BasemapListProps extends React.PropsWithChildren {
	defaultMapType?: MapType
}

export default function BasemapList(props: BasemapListProps) {
	const { children, defaultMapType } = props
	const { map } = useMap<maplibregl.Map>()
	const [mapType, setMapType] = useLocalStorage<MapType>('mapbox.mapType', defaultMapType)
	const mapTypes = useMemo(() => {
		if (!map) return []
		return [MapType.Streets, MapType.Imagery, MapType.Hybrid].map((m) => {
			return (
				<BasemapListItem
					key={m}
					active={mapType === m}
					mapType={m}
					onClick={(v) => {
						setMapType(v)
						map?.setStyle(MapStyle[v])
					}}
				/>
			)
		})
	}, [map, mapType])
	return (
		<>
			{children}
			<div className='flex [&>*]:mr-3 last:[&>]:mr-0'>{mapTypes}</div>
		</>
	)
}

function BasemapListItem({
	mapType,
	active,
	onClick,
}: {
	mapType: MapType
	active?: boolean
	onClick?: (mapType: MapType) => void
}) {
	const src = useMemo(() => {
		const url = new URL(MapStyle[mapType].replace('mapbox://styles/', 'https://api.mapbox.com/styles/v1/'))

		return `https://api.maptiler.com/maps/streets-v2/style.json?key=Lwq4BQgNPyauaUe03gYT`
		// return `${url.protocol}//${url.host}${url.pathname}/static/101,12,3,0,0/256x256?access_token=${maplibregl}`
	}, [mapType])

	return (
		<Button
			className={`relative block overflow-hidden p-0 ${active ? 'border-secondary' : ''}`}
			onClick={() => onClick?.(mapType)}
		>
			<img src={src} className='h-[72px] w-[72px]' />
			<div
				className={`absolute inset-0 top-auto ${
					active ? 'bg-secondary text-white' : 'text-text-primary bg-white'
				}`}
			>
				{MapTypeName[mapType]}
			</div>
		</Button>
	)
}

export enum MapType {
	Streets = 'Streets',
	Imagery = 'Imagery',
	Hybrid = 'Hybrid',
}

export enum MapTypeName {
	// Streets = "แผนที่",
	// Imagery = "ดาวเทียม",
	// Hybrid = "โหมดผสม",
	Streets = 'แผนที่',
	Imagery = 'ดาวเทียม',
	Hybrid = 'ภูมิประเทศ',
}

export enum MapStyle {
	// Streets = "mapbox://styles/mapbox/streets-v12?optimize=true",
	// Imagery = "mapbox://styles/mapbox/outdoors-v12?optimize=true",
	// Hybrid = "mapbox://styles/mapbox/satellite-streets-v12?optimize=true",
	Streets = 'mapbox://styles/mapbox/streets-v12?optimize=true',
	Imagery = 'mapbox://styles/mapbox/satellite-streets-v12?optimize=true',
	Hybrid = 'mapbox://styles/mapbox/outdoors-v12?optimize=true',
}
