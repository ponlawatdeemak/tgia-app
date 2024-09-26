'use client'

import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Paper,
	Typography,
} from '@mui/material'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { mdiClose } from '@mdi/js'
import Icon from '@mdi/react'
import { useTranslation } from 'react-i18next'
import FormInput from '@/components/common/input/FormInput'
import MapView from '@/components/common/map/MapView'
import { LocationSearching } from '@mui/icons-material'
import useSearchPlotMonitoring from '../../Main/context'
import service from '@/api'
import { useQuery } from '@tanstack/react-query'
import { GetExtentAdminPolyDtoIn } from '@/api/field-loss/dto-in.dto'
import { FormikProps } from 'formik'
import useMapPin from '../context'
import classNames from 'classnames'
import useLayerStore from '@/components/common/map/store/map'
import { IconLayer } from '@deck.gl/layers'
import { getPin } from '@/utils/pin'

export interface MapPinDialogProps {
	open: boolean
	formik: FormikProps<any>
	loading?: boolean
	hideClose?: boolean
	onClose: () => void
	onConfirm: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const MapPinDialog: React.FC<MapPinDialogProps> = ({
	open = false,
	formik,
	loading = false,
	hideClose = false,
	onClose,
	onConfirm,
}) => {
	const { queryParams } = useSearchPlotMonitoring()
	const { t } = useTranslation(['plot-monitoring', 'default'])
	const { getLayers, addLayer, removeLayer } = useLayerStore()
	// const mapViewRef = useRef<MapViewRef>(null)

	useEffect(() => {
		if (formik.values.lng && formik.values.lat) {
			// if (mapViewRef.current) {
			// 	mapViewRef.current.setMapCenter({
			// 		latitude: parseFloat(formik.values.lat),
			// 		longitude: parseFloat(formik.values.lng),
			// 	})
			// }

			const coordinates: [number, number] = [Number(formik?.values?.lng), Number(formik.values.lat)]
			removeLayer('selected-pin')
			const iconLayer = new IconLayer({
				id: 'selected-pin',
				// beforeId: "road-exit-shield",
				data: [{ coordinates }],
				visible: true,
				getIcon: () => {
					return {
						url: getPin('#F03E3E'),
						anchorY: 69,
						width: 58,
						height: 69,
						mask: false,
					}
				},
				sizeScale: 1,
				getPosition: (d) => d.coordinates,
				getSize: 40,
			})

			addLayer(iconLayer)
		}
	}, [formik.values.lng, formik.values.lat, removeLayer, getLayers, addLayer])

	// const filterExtentData = useMemo(() => {
	// 	const filter: GetExtentAdminPolyDtoIn = {
	// 		id: queryParams?.subDistrictCode
	// 			? queryParams.subDistrictCode
	// 			: queryParams?.districtCode
	// 				? queryParams.districtCode
	// 				: queryParams?.provinceCode
	// 					? queryParams.provinceCode
	// 					: undefined,
	// 	}
	// 	return filter
	// }, [queryParams])

	// const { data: extentData, isLoading: isExtentDataLoading } = useQuery({
	// 	queryKey: ['getExtentAdminPolyMapPin', filterExtentData],
	// 	queryFn: () => service.fieldLoss.getExtentAdminPoly(filterExtentData),
	// 	enabled: open,
	// })

	// useEffect(() => {
	// 	console.log('mapViewRef', mapViewRef)
	// 	if (mapViewRef.current) {
	// 		console.log('extentData', extentData)
	// 		mapViewRef.current.setMapExtent(extentData?.data?.extent as any)
	// 	}
	// }, [extentData])

	const handleGetCurrentLocation = useCallback(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const longitude = position.coords.longitude
				const latitude = position.coords.latitude
				formik.setFieldValue('lng', longitude.toFixed(6))
				formik.setFieldValue('lat', latitude.toFixed(6))
				// TO DO
				// if (mapViewRef.current) {
				// 	mapViewRef.current.setMapCenter({
				// 		latitude,
				// 		longitude,
				// 	})
				// }
			})
		} else {
			console.log('Geolocation is not supported by this browser.')
		}
	}, [formik])

	const handleLocationEnter = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (event.key === 'Enter') {
				if (formik.values.lng && formik.values.lat) {
					// TO DO
					// if (mapViewRef.current) {
					// 	mapViewRef.current.setMapCenter({
					// 		latitude: parseFloat(formik.values.lat),
					// 		longitude: parseFloat(formik.values.lng),
					// 	})
					// }
				}
			}
		},
		[formik.values.lat, formik.values.lng],
	)

	const handleLocationBlur = useCallback(
		(_event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
			if (formik.values.lng && formik.values.lat) {
				// TO DO
				// if (mapViewRef.current) {
				// 	mapViewRef.current.setMapCenter({
				// 		latitude: parseFloat(formik.values.lat),
				// 		longitude: parseFloat(formik.values.lng),
				// 	})
				// }
			}
		},
		[formik.values.lat, formik.values.lng],
	)

	return (
		<Dialog
			open={open}
			onClose={onClose}
			PaperProps={{
				className: 'm-0 p-6 min-w-[90%] min-h-[85%]',
			}}
		>
			<DialogTitle className='flex items-center justify-between p-0'>
				<Typography className='text-lg font-semibold text-black-dark'>{t('addPosition')}</Typography>
				{!hideClose && (
					<IconButton aria-label='close' onClick={onClose}>
						<Icon path={mdiClose} size={'24px'} />
					</IconButton>
				)}
			</DialogTitle>
			<form noValidate className='contents'>
				<DialogContent className='flex flex-grow flex-col gap-3 overflow-auto px-0 py-3'>
					<Box className='flex flex-col items-start gap-2 sm:flex-row [&_*>input]:p-0 [&_*>input]:text-sm [&_*>input]:font-normal [&_*>input]:text-black [&_*>label]:mb-1 [&_*>label]:text-xs [&_*>label]:font-medium [&_*>label]:text-black [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:px-2.5 [&_.MuiInputBase-root]:py-1.5'>
						<FormInput
							className='w-full sm:w-[200px]'
							name='name'
							label={t('positionName')}
							formik={formik}
							placeholder={t('position')}
							value={''}
							inputProps={{
								maxLength: 50,
							}}
							disabled={loading}
							required
						/>
						<FormInput
							className='w-full sm:w-[200px]'
							type='number'
							name='lat'
							label={t('latitude')}
							formik={formik}
							placeholder='0.000000'
							value={''}
							onChange={(event) => {
								const value = event.target.value
								const regex = /^\d*\.?\d{0,6}$/
								if (regex.test(value) || value === '') {
									if (value.length < 12) {
										formik.handleChange(event)
									}
								}
							}}
							onKeyDown={handleLocationEnter}
							onBlur={handleLocationBlur}
							disabled={loading}
							required
						/>
						<FormInput
							className='w-full sm:w-[200px]'
							type='number'
							name='lng'
							label={t('longitude')}
							formik={formik}
							placeholder='0.000000'
							value={''}
							onChange={(event) => {
								const value = event.target.value
								const regex = /^\d*\.?\d{0,6}$/
								if (regex.test(value) || value === '') {
									if (value.length < 12) {
										formik.handleChange(event)
									}
								}
							}}
							onKeyDown={handleLocationEnter}
							onBlur={handleLocationBlur}
							disabled={loading}
							required
						/>
					</Box>
					<Paper className='relative grid flex-grow overflow-hidden'>
						<Box className='relative h-full w-full'>
							<MapView
							// TO DO
							// ref={mapViewRef}
							// onMapClick={(latLng) => {
							// 	formik.setFieldValue('lng', latLng?.longitude?.toFixed(5) || null)
							// 	formik.setFieldValue('lat', latLng?.latitude?.toFixed(5) || null)
							// }}
							/>
						</Box>
					</Paper>
				</DialogContent>
				<DialogActions className='flex items-center justify-between p-0'>
					<Button
						className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
						variant='outlined'
						onClick={handleGetCurrentLocation}
						disabled={loading}
						startIcon={
							loading ? (
								<CircularProgress className='[&_.MuiCircularProgress-circle]:text-gray' size={16} />
							) : (
								<LocationSearching className='m-0 text-black' />
							)
						}
					>
						<span
							className={classNames('text-sm font-medium text-black', {
								'!text-gray': loading,
							})}
						>
							{t('useCurrentLocation')}
						</span>
					</Button>
					<Box className='flex items-center gap-2'>
						<Button
							onClick={onClose}
							variant='outlined'
							className={classNames('border-gray px-3 py-1.5', {
								'pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1': loading,
							})}
							disabled={loading}
							startIcon={
								loading && (
									<CircularProgress className='[&_.MuiCircularProgress-circle]:text-gray' size={16} />
								)
							}
						>
							<span
								className={classNames('text-sm font-medium text-black', {
									'!text-gray': loading,
								})}
							>
								{t('cancel', { ns: 'default' })}
							</span>
						</Button>
						<Button
							onClick={onConfirm}
							variant='contained'
							className={classNames('px-3 py-1.5', {
								'pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1': loading,
							})}
							disabled={loading}
							startIcon={
								loading && (
									<CircularProgress className='[&_.MuiCircularProgress-circle]:text-gray' size={16} />
								)
							}
						>
							<span className='text-sm font-medium text-white'>{t('confirm', { ns: 'default' })}</span>
						</Button>
					</Box>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default MapPinDialog
