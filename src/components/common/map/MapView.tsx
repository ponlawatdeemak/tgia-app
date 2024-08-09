'use client'
import { memo, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { ToggleButtonGroup, ToggleButton, Box, IconButton, Tooltip, Popover, Typography } from '@mui/material'
import MapGoogle from './MapGoogle'
import MapLibre from './MapLibre'
import { BASEMAP } from '@deck.gl/carto'
import { MapViewProps, MapViewState } from './interface/map'
import Icon from '@mdi/react'
import { mdiPlus, mdiMinus, mdiLayersOutline } from '@mdi/js'

const INITIAL_VIEW_STATE: MapViewState = {
	longitude: 100,
	latitude: 13,
	zoom: 5,
}

const basemapList = [
	{
		value: 'carto-light',
		image: '/map/basemap_bright.png',
		label: 'Bright',
	},
	{
		value: 'carto-dark',
		image: '/map/basemap_satellite.png',
		label: 'Satellite',
	},
	{
		value: 'google',
		image: '/map/basemap_satellite_hybrid.png',
		label: 'Satellite Hybrid',
	},
]

const MapView: React.FC<MapViewProps> = ({ className = '' }) => {
	const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
	const [basemap, setBasemap] = useState('carto-light')
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

	const onViewStateChange = useCallback((v: any) => {
		setViewState(v)
	}, [])

	const handleChange = useCallback((event: React.MouseEvent<HTMLElement>, newBasemap: string) => {
		setBasemap((prev) => newBasemap || prev)
	}, [])

	const handleZoom = useCallback(
		(zoom: number) => {
			setViewState({ ...viewState, zoom })
		},
		[viewState],
	)

	return (
		<div className={classNames('relative flex h-full flex-1 flex-col overflow-hidden', className)}>
			<Box className='absolute bottom-2 left-2 z-10'>
				<IconButton
					sx={{
						border: 2,
						borderColor: Boolean(anchorEl) ? '#0C626D' : 'transparent',
					}}
					className={'box-shadow mb-2 bg-white'}
					onClick={(event) => setAnchorEl(event.currentTarget)}
				>
					<Icon color={Boolean(anchorEl) ? '#0C626D' : ''} path={mdiLayersOutline} size={1} />
				</IconButton>
				<Popover
					open={Boolean(anchorEl)}
					anchorEl={anchorEl}
					onClose={() => setAnchorEl(null)}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					transformOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
				>
					<Box className='bg-white p-2 drop-shadow-md'>
						<Typography
							sx={{
								display: { xs: 'none', md: 'inline-block' },
							}}
							mb={1}
							variant={'body2'}
							className='font-bold'
						>
							ประเภทแผนที่
						</Typography>
						<ToggleButtonGroup
							size='small'
							exclusive
							color='primary'
							value={basemap}
							onChange={handleChange}
							className='flex items-start'
							sx={{
								flexDirection: { xs: 'column', md: 'row' },
							}}
						>
							{basemapList.map((item) => {
								return (
									<ToggleButton
										className='flex w-full flex-col rounded-none border-none'
										sx={{ maxWidth: { xs: '80px', md: 'unset' } }}
										value={item.value}
									>
										<img src={item.image} className='w-full' />
										<Typography variant={'body2'} align='center'>
											{item.label}
										</Typography>
									</ToggleButton>
								)
							})}
						</ToggleButtonGroup>
					</Box>
				</Popover>
				<Box className='box-shadow flex flex-col rounded-lg bg-white'>
					<IconButton className='rounded-none border-none' onClick={() => handleZoom(viewState.zoom + 1)}>
						<Icon path={mdiPlus} size={1} />
					</IconButton>
					<IconButton className='rounded-none border-none' onClick={() => handleZoom(viewState.zoom - 1)}>
						<Icon path={mdiMinus} size={1} />
					</IconButton>
				</Box>
			</Box>
			{basemap !== 'google' ? (
				<MapLibre
					viewState={viewState as any}
					mapStyle={basemap === 'carto-light' ? BASEMAP.VOYAGER : BASEMAP.DARK_MATTER}
					onViewStateChange={onViewStateChange}
				/>
			) : (
				<MapGoogle viewState={viewState} onViewStateChange={onViewStateChange} />
			)}
		</div>
	)
}

export default memo(MapView)
