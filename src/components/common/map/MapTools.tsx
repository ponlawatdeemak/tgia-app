import React, { useCallback, useMemo, useState } from 'react'
import {
	Box,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
	IconButton,
	Popover,
	Button,
	styled,
	Switch,
} from '@mui/material'
import { mdiLayersOutline, mdiMapMarker, mdiMapMarkerOutline, mdiMinus, mdiPlus, mdiRulerSquareCompass } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import { BaseMap, BasemapType, MapLayer } from './interface/map'
import useLayerStore from './store/map'
import { layerIdConfig } from '@/config/app'
import { Layer } from '@deck.gl/core'
import { MapLayerIcon, MapMeasureIcon, MapPinIcon, MapZoomInIcon, MapZoomOutIcon } from '@/components/svg/MenuIcon'

const basemapList: BaseMap[] = [
	{ value: BasemapType.CartoLight, image: '/images/map/basemap_bright.png', label: 'map.street' },
	{ value: BasemapType.CartoDark, image: '/images/map/basemap_satellite.png', label: 'map.satellite' },
	{ value: BasemapType.Google, image: '/images/map/basemap_satellite_hybrid.png', label: 'map.hybrid' },
]

interface MapToolsProps {
	layerList?: MapLayer[]
	onBasemapChanged?: (basemap: BasemapType) => void
	onZoomIn?: () => void
	onZoomOut?: () => void
	onGetLocation?: (coords: GeolocationCoordinates) => void
	currentBaseMap: BasemapType
}

const MapTools: React.FC<MapToolsProps> = ({
	layerList,
	onBasemapChanged,
	onZoomIn,
	onZoomOut,
	onGetLocation,
	currentBaseMap,
}) => {
	const { t } = useTranslation()
	const { layers, getLayer, getLayers, setLayers, removeLayer } = useLayerStore()
	const [basemap, setBasemap] = useState<BasemapType | null>(currentBaseMap ?? null)
	const [anchorBasemap, setAnchorBasemap] = useState<HTMLButtonElement | null>(null)
	const [anchorLegend, setAnchorLegend] = useState<HTMLButtonElement | null>(null)

	const currentLocationIsActive = useMemo(() => !!getLayer(layerIdConfig.toolCurrentLocation), [layers, getLayer])

	const onToggleLayer = useCallback(
		(layerId: string) => {
			const layer = getLayer(layerId)
			if (layer) {
				removeLayer(layerId)
			} else {
				const item = layerList?.find((item) => item.id === layerId)
				if (item) {
					const updatedLayers = [...getLayers(), item.layer]
					setLayers(updatedLayers as Layer[])
				}
			}
		},
		[layerList, getLayer, getLayers, setLayers, removeLayer],
	)

	const handleBasemapChanged = useCallback(
		(basemap: BasemapType) => {
			if (basemap !== null) {
				console.log(basemap)
				setBasemap(basemap)
				onBasemapChanged?.(basemap)
			}
		},
		[onBasemapChanged],
	)

	const handleGetLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					onGetLocation?.(position.coords)
				},
				(error) => {
					console.error('Error fetching location:', error)
				},
			)
		} else {
			console.log('Geolocation is not supported by this browser.')
		}
	}, [onGetLocation])

	const ToggleSwitch = styled(Switch)(({ theme }) => ({
		width: 33,
		height: 16,
		padding: 0,
		display: 'flex',
		'&:active': {
			'& .MuiSwitch-thumb': {
				width: 15,
			},
			'& .MuiSwitch-switchBase.Mui-checked': {
				transform: 'translateX(19.5px)',
			},
		},
		'& .MuiSwitch-switchBase': {
			padding: 2,
			'&.Mui-checked': {
				transform: 'translateX(16.5px)',
				color: '#fff',
				'& + .MuiSwitch-track': {
					opacity: 1,
					// backgroundColor: '#1890ff',
					...theme.applyStyles('dark', {
						// backgroundColor: '#177ddc',
					}),
				},
			},
		},
		'& .MuiSwitch-thumb': {
			boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
			width: 12,
			height: 12,
			borderRadius: 6,
			transition: theme.transitions.create(['width'], {
				duration: 200,
			}),
		},
		'& .MuiSwitch-track': {
			borderRadius: 16 / 2,
			opacity: 1,
			backgroundColor: 'rgba(0,0,0,.25)',
			boxSizing: 'border-box',
			...theme.applyStyles('dark', {
				backgroundColor: 'rgba(255,255,255,.35)',
			}),
		},
	}))

	return (
		<>
			{/* Zoom Controls */}
			<Box className='absolute right-2 top-2 z-10 flex flex-col gap-2'>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={onZoomIn}>
					<MapZoomInIcon />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={onZoomOut}>
					<MapZoomOutIcon />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white'>
					<MapMeasureIcon />
				</IconButton>
				<IconButton className='box-shadow rounded-lg bg-white' onClick={handleGetLocation}>
					<MapPinIcon />
				</IconButton>
			</Box>

			{/* Basemap Selector */}
			<Box className='absolute bottom-2 right-2 z-10'>
				<IconButton
					onClick={(event) => setAnchorBasemap(event.currentTarget)}
					className='box-shadow rounded-lg bg-white'
				>
					<img
						src={basemapList[currentBaseMap].image}
						className='h-[60px] w-[60px] rounded-[4px] border-[1px] border-primary'
						alt={`${basemapList[currentBaseMap].label}`}
					/>
				</IconButton>
				<Popover
					open={Boolean(anchorBasemap)}
					anchorEl={anchorBasemap}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					elevation={0}
					onClose={() => setAnchorBasemap(null)}
				>
					<Box className='flex flex-col bg-white p-2 drop-shadow-md'>
						<Typography
							sx={{ display: { xs: 'none', md: 'inline-block' } }}
							mb={1}
							variant='body2'
							className='font-bold'
						>
							{t('map.mapType')}
						</Typography>
						<ToggleButtonGroup
							size='small'
							exclusive
							color='primary'
							value={basemap}
							onChange={(_, value) => handleBasemapChanged(value)}
						>
							{basemapList.map((item, index) => (
								<ToggleButton
									key={index}
									className='flex flex-col rounded-none border-none'
									value={item.value}
								>
									<img src={item.image} className='h-[60px] w-[60px]' alt={`${item.label}`} />
									<Typography variant='body2' align='center' className='text-sm'>
										{t(`${item.label}`)}
									</Typography>
								</ToggleButton>
							))}
						</ToggleButtonGroup>
					</Box>
				</Popover>
			</Box>

			{/* Layer Legend */}
			{layerList && (
				<>
					<Box className='absolute bottom-2 left-2 z-10'>
						<IconButton
							onClick={(event) => setAnchorLegend(event.currentTarget)}
							className='box-shadow rounded-lg bg-white'
						>
							<MapLayerIcon />
						</IconButton>
					</Box>
					<Popover
						open={Boolean(anchorLegend)}
						anchorEl={anchorLegend}
						onClose={() => setAnchorLegend(null)}
						elevation={0}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'left',
						}}
					>
						<Box className='flex flex-col gap-[6px] rounded-[4px] bg-white px-[16px] py-[10px] drop-shadow-md'>
							{layerList.map((item, index) => {
								if (item.id !== 'province') {
									return (
										<div key={index} className='flex items-center justify-between gap-[14px]'>
											<div className='flex gap-[8px]'>
												<div
													className={`h-[23px] w-[23px] rounded-[2px]`}
													style={{ backgroundColor: item.color }}
												></div>
												<p className='text-[14px] font-light'>
													{t('overview:ageOfDurianTrees')} {item.label}
												</p>
											</div>
											<ToggleSwitch
												defaultChecked
												onChange={() => {
													onToggleLayer(item.id)
												}}
											/>
										</div>
									)
								}
							})}
						</Box>
					</Popover>
				</>
			)}
		</>
	)
}

export default MapTools
