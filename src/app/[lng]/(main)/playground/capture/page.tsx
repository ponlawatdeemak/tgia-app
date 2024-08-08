'use client'

import MapView from '@/components/common/map/MapView'
import { Box, Button, Container } from '@mui/material'
import { Paper } from '@mui/material'
import StickyHeadTable from './table'
import AlignItemsList from './list'
import FormPropsTextFields from './form'
import QuiltedImageList from './image'

export default function Page() {
	return (
		<Container>
			<Paper className='flex h-full flex-col overflow-hidden p-1'>
				<Box className='flex justify-end p-2'>
					<Button variant='contained'>Capture</Button>
				</Box>
				<Box className='flex'>
					<Box p={1} width={'50%'}>
						<Box height={500} className='w-full p-1'>
							<MapView />
						</Box>
						<StickyHeadTable />
						<Box>
							<QuiltedImageList />
						</Box>
					</Box>
					<Box p={1} width={'50%'}>
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
