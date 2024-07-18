'use client'
import { useLocalStorage } from '@/hook/local-storage'
import { useMap } from '@/store/contexts/map'
import { Button } from '@mui/material'
import maplibregl from 'maplibre-gl'
import { useMemo } from 'react'

export interface BasemapListProps extends React.PropsWithChildren {
	defaultMapType?: MapType
}

export default function BasemapList(props: BasemapListProps) {
	const { children, defaultMapType } = props
	const { map } = useMap<maplibregl.Map>()
	const [mapType, setMapType] = useLocalStorage<MapType>('maplibregl.mapType', defaultMapType)
	const mapTypes = useMemo(() => {
		if (!map) return []
		return [MapType.Streets, MapType.Imagery, MapType.Hybrid, MapType.Topo].map((m) => {
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
		const url = new URL(MapStyle[mapType].replace('maplibregl://styles/', 'https://api.maplibregl.com/styles/v1/'))
		return `${url.protocol}//${url.host}${url.pathname}/static/101,12,3,0,0/256x256?access_token=${maplibregl}`
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
	Topo = 'Topo',
}

export enum MapTypeName {
	Streets = 'แผนที่',
	Imagery = 'ดาวเทียม',
	Hybrid = 'ดาวเทียมผสม',
	Topo = 'ภูมิประเทศ',
}

export enum MapStyle {
	Streets = 'https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json',
	Imagery = 'https://geoserveis.icgc.cat/contextmaps/icgc_orto_estandard.json',
	Hybrid = 'https://geoserveis.icgc.cat/contextmaps/icgc_orto_hibrida.json',
	Topo = 'https://api.maptiler.com/maps/topo-v2/style.json?key=Lwq4BQgNPyauaUe03gYT',
}
