'use client'

import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
	Paper,
	Typography,
} from '@mui/material'
import React from 'react'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import FormInput from '@/components/common/input/FormInput'
import MapView from '@/components/common/map/MapView'
import { LocationSearching } from '@mui/icons-material'

export interface MapPinDialogProps {
	open: boolean
	hideClose?: boolean
	onClose: () => void
	onConfirm: () => void
}

const MapPinDialog: React.FC<MapPinDialogProps> = ({ open = false, hideClose = false, onClose, onConfirm }) => {
	const { t } = useTranslation(['default'])

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				className: 'm-0 p-6 min-w-[90%] min-h-[90%]',
				component: 'form',
				onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
					event.preventDefault()
					console.log('Submitted!!')
					onClose()
				},
			}}
		>
			<DialogTitle className='flex items-center justify-between p-0'>
				<Typography className='text-lg font-semibold text-black-dark'>เพิ่มตำแหน่ง</Typography>
				{!hideClose && (
					<IconButton aria-label='close' onClick={onClose}>
						<Icon path={mdiClose} size={'24px'} />
					</IconButton>
				)}
			</DialogTitle>
			<DialogContent className='flex flex-grow flex-col gap-3 overflow-auto px-0 py-3'>
				<Box className='flex items-center gap-2'>
					<FormInput name='ชื่อตำแหน่ง' label='ชื่อตำแหน่ง' />
					<FormInput name='ละติจูด' label='ละติจูด' />
					<FormInput name='ลองจิจูด' label='ลองจิจูด' />
				</Box>
				<Paper className='relative grid flex-grow overflow-hidden'>
					<Box className='relative h-full w-full'>
						<MapView
							isShowMapPin
							//ref={mapViewRef}
						/>
					</Box>
				</Paper>
			</DialogContent>
			<DialogActions className='flex items-center justify-between p-0'>
				<Button
					className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
					variant='outlined'
					startIcon={<LocationSearching className='m-0 text-black' />}
				>
					<span className='text-sm font-medium text-black'>GeoJSON</span>
				</Button>
				<Box className='flex items-center gap-2'>
					<Button onClick={onClose} variant='outlined' className='border-gray px-3 py-1.5'>
						<span className='text-sm font-medium text-black'>{t('cancel')}</span>
					</Button>
					<Button type='submit' variant='contained' className='px-3 py-1.5'>
						<span className='text-sm font-medium text-white'>{t('confirm')}</span>
					</Button>
				</Box>
			</DialogActions>
		</Dialog>
	)
}

export default MapPinDialog
