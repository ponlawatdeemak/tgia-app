'use client'
import '@/components/common/map/inject'
import React from 'react'
import MapView from '@/components/common/map/MapView'
import { Box, IconButton, Container, Paper } from '@mui/material'
import StickyHeadTable from './table'
import AlignItemsList from './list'
import FormPropsTextFields from './form'
import QuiltedImageList from './image'
import Chart from './chart'
import html2canvas from 'html2canvas'
import { mdiFullscreen } from '@mdi/js'
import Icon from '@mdi/react'

// import { useMap } from '@/components/common/map/context/map'

export default function Page() {
	// const { setExtent, setMapInfoWindow } = useMap()

	// const mapViewRef = useRef<MapViewRef>(null)
	const onCapture = () => {
		const timestamp = new Date().toISOString().replace(/[:.-]/g, '_')
		const filename = `screenshot_${timestamp}.png`
		html2canvas(document.body, {
			useCORS: true,
			allowTaint: true,
			scrollX: 0,
			scrollY: 0,
			onclone: function (clone) {
				clone.body.style.height = 'unset'
				const elements = clone.getElementsByClassName('capture')
				for (let index = 0; index < elements.length; index++) {
					const element = elements[index] as HTMLElement
					element.style.overflowY = 'visible !important'
					element.style.maxHeight = 'unset !important'
				}
				return true
			},
		}).then((canvas) => {
			const img = canvas.toDataURL('image/png')
			const link = document.createElement('a')
			link.href = img
			link.download = filename
			link.click()
		})
	}

	const handleSetExtent = () => {
		// if (mapViewRef.current) {
		// 	const bounds = [
		// 		[100.5, 13.7],
		// 		[100.7, 13.9],
		// 	]
		// 	mapViewRef.current.setMapExtent(bounds)
		// }
		// 	const bounds = [
		// 		[100.5, 13.7],
		// 		[100.7, 13.9],
		// 	]
		// setExtent(bounds)
	}

	return (
		<Container>
			<Paper className='flex h-full flex-col overflow-hidden p-1'>
				<Box className='flex justify-end p-2'>
					<button onClick={handleSetExtent}>Set Map Extent</button>
					<IconButton disableRipple onClick={() => onCapture()}>
						<Icon path={mdiFullscreen} size={1} />
					</IconButton>
				</Box>
				<Box display='flex' sx={{ flexDirection: { xs: 'column', lg: 'row' } }}>
					<Box p={1} flex={1} sx={{ width: { xs: '100%', lg: '50%' } }}>
						<Box height={500} className='w-full p-1'>
							{/* <MapView ref={mapViewRef} /> */}
							<MapView />
						</Box>
						<StickyHeadTable />
						<QuiltedImageList />
					</Box>
					<Box p={1} flex={1} sx={{ width: { xs: '100%', lg: '50%' } }}>
						<Chart />
						<AlignItemsList />
						<Box p={1} pt={4}>
							<FormPropsTextFields />
						</Box>
					</Box>
				</Box>
			</Paper>
		</Container>
	)
}
