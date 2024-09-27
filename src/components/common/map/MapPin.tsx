'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	IconButton,
	Popper,
	Snackbar,
	styled,
	Switch,
	SwitchProps,
	Typography,
} from '@mui/material'
import { mdiMapMarkerRadiusOutline, mdiTrashCanOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Add, CheckBoxOutlined, ContentCopyRounded, FileDownloadOutlined } from '@mui/icons-material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import service from '@/api'
import useMapPin from '@/components/pages/plot-monitoring/result/Map/context'
import { onExportCSV } from '@/utils/export-csv'
import { FeatureCollection, Geometry } from 'geojson'
import { onExportGeoJSON } from '@/utils/export-geojson'
import AlertConfirm from '../dialog/AlertConfirm'
import { AlertInfoType } from '@/components/shared/ProfileForm/interface'
import { ErrorResponse } from '@/api/interface'
import classNames from 'classnames'
import MapPinDialog from '@/components/pages/plot-monitoring/result/Map/MapPin/MapPinDialog'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { PostPOISDtoIn } from '@/api/plot-monitoring/dto-in.dto'
import useResponsive from '@/hook/responsive'
import { useMap } from './context/map'
import { FormikProps } from 'formik'
import FormInput from '@/components/common/input/FormInput'
import { LocationSearching } from '@mui/icons-material'
import { getPin } from '@/utils/pin'
import { IconLayer } from '@deck.gl/layers'
import useLayerStore from '@/components/common/map/store/map'

interface FormValues {
	name: string
	lat: number | null
	lng: number | null
}

const defaultFormValues: FormValues = {
	name: '',
	lat: null,
	lng: null,
}

interface MapPinProps {
	onAddPin?: (isAddPin: boolean) => void
}

const MapPin: React.FC<MapPinProps> = ({ onAddPin }) => {
	const { isDesktop } = useResponsive()
	const queryClient = useQueryClient()
	const { open, setOpen } = useMapPin()
	const { latLng, setLatLng, setCenterAndZoom } = useMap()
	const { addLayer, removeLayer } = useLayerStore()
	const { t } = useTranslation(['plot-monitoring', 'default'])
	const [busy, setBusy] = useState<boolean>(false)
	const [alertInfo, setAlertInfo] = useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [deleteOpenDialog, setDeleteOpenDialog] = useState<boolean>(false)
	const [isPinOnMap, setIsPinOnMap] = useState(false)
	const [isAllChecked, setIsAllChecked] = useState(false)
	const [isAddPin, setIsAddPin] = useState(false)
	const [pinCheck, setPinCheck] = useState<{ [key: string]: boolean }>({})
	const selectPinId = 'selected-pin'

	const validationSchema = yup.object({
		name: yup.string().required(t('warning.inputPositionName', { ns: 'plot-monitoring' })),
		lat: yup
			.number()
			.required(t('warning.inputLatitude', { ns: 'plot-monitoring' }))
			.min(5.37, t('warning.inputWrongValue', { ns: 'plot-monitoring' }))
			.max(20.27, t('warning.inputWrongValue', { ns: 'plot-monitoring' })),
		lng: yup
			.number()
			.required(t('warning.inputLongitude', { ns: 'plot-monitoring' }))
			.min(97.21, t('warning.inputWrongValue', { ns: 'plot-monitoring' }))
			.max(105.37, t('warning.inputWrongValue', { ns: 'plot-monitoring' })),
	})

	useEffect(() => setOpen(false), [])

	const { data: poisData, isLoading: isPOISDataLoading } = useQuery({
		queryKey: ['getPOISMapPin'],
		queryFn: () => service.plotMonitoring.getPOIS(),
		enabled: Boolean(anchorEl),
	})

	const {
		data: postedMapPinData,
		error: postedMapPinError,
		mutateAsync: mutatePostMapPin,
	} = useMutation({
		mutationFn: async (payload: PostPOISDtoIn) => {
			await service.plotMonitoring.postPOIS(payload)
		},
	})

	const {
		data: deletedMapPinData,
		error: deletedMapPinError,
		mutateAsync: mutateDeleteMapPins,
	} = useMutation({
		mutationFn: async (mapPins: string[]) => {
			const deletedMapPins = mapPins.map((id) => service.plotMonitoring.deletePOIS({ poiId: id }))
			const responses = await Promise.all(deletedMapPins)
			mapPins.forEach((mapPin) => delete pinCheck[mapPin])

			return responses
		},
		onSuccess: (data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
			setAlertInfo({ open: true, severity: 'success', message: t('success.deleteMapPins') })
		},
		onError: (error: ErrorResponse, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : t('error.deleteMapPins'),
			})
		},
	})

	useEffect(() => {
		const pinCheckValues: boolean[] = []
		for (let value in pinCheck) {
			pinCheckValues.push(pinCheck[value])
		}

		if (pinCheckValues.length === 0) {
			setIsAllChecked(false)
		} else {
			if (pinCheckValues.length !== poisData?.data?.length) {
				setIsAllChecked(false)
			} else {
				if (pinCheckValues.includes(false)) {
					setIsAllChecked(false)
				} else {
					setIsAllChecked(true)
				}
			}
		}
	}, [pinCheck, poisData])

	const handlePinOnMapCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsPinOnMap(event.target.checked)
		setOpen(event.target.checked)
	}

	const handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsAllChecked(event.target.checked)
		if (event.target.checked) {
			const allPinChecks: { [key: string]: boolean } = {}
			poisData?.data?.forEach((items) => {
				allPinChecks[items.poiId] = true
			})
			setPinCheck(allPinChecks)
		} else {
			setPinCheck({})
		}
	}

	const handlePinCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPinCheck((prevPinCheck) => {
			return {
				...prevPinCheck,
				[event.target.name]: event.target.checked,
			}
		})
	}

	const isSomePinCheck = useCallback((obj: { [key: string]: boolean }) => {
		for (const prop in obj) {
			if (Object.hasOwn(obj, prop)) {
				if (obj[prop] === true) {
					return true
				}
			}
		}

		return false
	}, [])

	const pinCheckIds = useMemo(() => {
		const pinCheckIds: string[] = []
		for (let id in pinCheck) {
			if (pinCheck[id]) {
				pinCheckIds.push(id)
			}
		}

		return pinCheckIds
	}, [pinCheck])

	const downloadJSONAsCSV = useCallback(() => {
		const jsonData = pinCheckIds?.map((item) => {
			return poisData?.data?.find((data) => data.poiId === item)
		})

		onExportCSV(jsonData)
	}, [pinCheckIds, poisData])

	const downloadGeoJSON = useCallback(() => {
		const geoJSONData: FeatureCollection<Geometry> = {
			type: 'FeatureCollection',
			features: pinCheckIds
				?.map((item) => poisData?.data?.find((data) => data.poiId === item))
				.map((obj) => {
					return {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [obj?.lng as number, obj?.lat as number],
						},
						properties: {
							poiId: obj?.poiId,
							userId: obj?.userId,
							title: obj?.title,
							lat: obj?.lat,
							lng: obj?.lng,
							createdAt: obj?.createdAt,
							updatedAt: obj?.updatedAt,
						},
					}
				}),
		}

		onExportGeoJSON(geoJSONData)
	}, [pinCheckIds, poisData])

	const handlePostSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		formik.submitForm()
	}

	const onSubmit = useCallback(async (values: FormValues) => {
		try {
			setBusy(true)
			const mapPinData: PostPOISDtoIn = {
				title: values.name,
				lat: values.lat as number,
				lng: values.lng as number,
			}

			await mutatePostMapPin(mapPinData)
			setIsAddPin(false)
			formik.resetForm()
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
			setAlertInfo({ open: true, severity: 'success', message: t('success.createMapPin') })
		} catch (error) {
			console.log('Create map position failed')
			setAlertInfo({ open: true, severity: 'error', message: t('error.createMapPin') })
		} finally {
			setBusy(false)
		}
	}, [])

	const formik = useFormik<FormValues>({
		initialValues: defaultFormValues,
		validationSchema: validationSchema,
		onSubmit,
	})

	const handleDeleteSubmit = useCallback(async () => {
		try {
			setDeleteOpenDialog(false)
			setBusy(true)
			await mutateDeleteMapPins(pinCheckIds)
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
		} catch (error: any) {
			console.log('Error:', error.title)
		} finally {
			setBusy(false)
			setDeleteOpenDialog(false)
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
		}
	}, [pinCheckIds])

	const IOSSwitch = styled((props: SwitchProps) => (
		<Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
	))(({ theme }) => ({
		width: 36,
		height: 20,
		padding: 0,
		'& .MuiSwitch-switchBase': {
			padding: 0,
			margin: 2,
			transitionDuration: '300ms',
			'&.Mui-checked': {
				transform: 'translateX(16px)',
				color: '#fff',
				'& + .MuiSwitch-track': {
					backgroundColor: '#65C466',
					opacity: 1,
					border: 0,
					...theme.applyStyles('dark', {
						backgroundColor: '#2ECA45',
					}),
				},
				'&.Mui-disabled + .MuiSwitch-track': {
					opacity: 0.5,
				},
			},
			'&.Mui-focusVisible .MuiSwitch-thumb': {
				color: '#33cf4d',
				border: '6px solid #fff',
			},
			'&.Mui-disabled .MuiSwitch-thumb': {
				color: theme.palette.grey[100],
				...theme.applyStyles('dark', {
					color: theme.palette.grey[600],
				}),
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.7,
				...theme.applyStyles('dark', {
					opacity: 0.3,
				}),
			},
		},
		'& .MuiSwitch-thumb': {
			boxSizing: 'border-box',
			width: 16,
			height: 16,
		},
		'& .MuiSwitch-track': {
			borderRadius: 20 / 2,
			backgroundColor: '#E9E9EA',
			opacity: 1,
			transition: theme.transitions.create(['background-color'], {
				duration: 500,
			}),
			...theme.applyStyles('dark', {
				backgroundColor: '#39393D',
			}),
		},
	}))

	useEffect(() => {
		if (!latLng?.latitude && !latLng?.longitude) return

		if (isAddPin) {
			const lat = Number(latLng.latitude.toFixed(6))
			const lng = Number(latLng.longitude.toFixed(6))
			formik.setFieldValue('lng', lng)
			formik.setFieldValue('lat', lat)

			const coordinates: [number, number] = [lng, lat]
			removeLayer(selectPinId)
			const iconLayer = new IconLayer({
				id: selectPinId,
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

			setCenterAndZoom(latLng)
		}
	}, [latLng])

	useEffect(() => {
		if (!isAddPin) removeLayer(selectPinId)
	}, [isAddPin])

	const handleGetCurrentLocation = useCallback(async () => {
		try {
			setBusy(true)
			const position: GeolocationPosition = await new Promise<GeolocationPosition>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(resolve, reject)
			})

			const longitude = Number(position.coords.longitude.toFixed(6))
			const latitude = Number(position.coords.latitude.toFixed(6))

			setLatLng({
				latitude,
				longitude,
			})
		} catch (error) {
			console.error('Error getting location:', error)
		} finally {
			setBusy(false)
		}
	}, [])

	const handleLocationEnter = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			if (event.key === 'Enter') {
				if (formik.values.lng && formik.values.lat) {
					setLatLng({
						latitude: formik.values.lat,
						longitude: formik.values.lng,
					})
				}
			}
		},
		[formik.values.lat, formik.values.lng],
	)

	const handleLocationBlur = useCallback(
		(_event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
			if (formik.values.lng && formik.values.lat) {
				setLatLng({
					latitude: formik.values.lat,
					longitude: formik.values.lng,
				})
			}
		},
		[formik.values.lat, formik.values.lng],
	)

	return (
		<React.Fragment>
			<IconButton
				sx={{
					border: 2,
					borderColor: Boolean(anchorEl) ? '#0C626D' : 'transparent',
				}}
				onClick={(event) => setAnchorEl(anchorEl ? null : event.currentTarget)}
				className={'box-shadow mb-2 bg-white'}
			>
				<Icon color={Boolean(anchorEl) ? '#0C626D' : ''} path={mdiMapMarkerRadiusOutline} size={1} />
			</IconButton>
			<Popper
				id={Boolean(anchorEl) ? 'map-pin-popper' : undefined}
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				className='!top-2 z-10 h-[300px] w-[calc(100vw-32px)] overflow-x-auto rounded border border-solid border-gray drop-shadow-md max-lg:max-w-[480px] lg:!left-2 lg:!top-3 lg:w-[480px] lg:rounded-lg'
				placement={isDesktop ? 'right' : 'bottom-start'}
			>
				<Box className='flex w-[480px] flex-col bg-white'>
					<Box className='flex items-center justify-between p-3'>
						<Typography className='text-sm font-semibold text-black-dark'>{t('pinning')}</Typography>
						<Box className='flex items-center gap-2'>
							<span className='text-xs font-medium text-black-dark'>{t('showOnMap')}</span>
							<IOSSwitch
								checked={isPinOnMap}
								onChange={handlePinOnMapCheck}
								inputProps={{ 'aria-label': 'controlled' }}
								disabled={busy || isPOISDataLoading}
							/>
						</Box>
					</Box>
					{isAddPin ? (
						<Box className='box-border flex h-[199px] flex-col gap-4 overflow-auto border-0 border-t border-solid border-gray px-3 py-4'>
							<Typography className='text-sm font-semibold text-black-dark'>
								{t('addPosition')}
							</Typography>
							<Box className='flex flex-col gap-3 [&_*>input]:p-0 [&_*>input]:text-sm [&_*>input]:font-normal [&_*>input]:text-black [&_*>label]:mb-1 [&_*>label]:text-xs [&_*>label]:font-medium [&_*>label]:text-black [&_.MuiFormHelperText-root]:text-xs [&_.MuiInputBase-root]:rounded-lg [&_.MuiInputBase-root]:px-2.5 [&_.MuiInputBase-root]:py-1.5'>
								<FormInput
									className='w-full'
									name='name'
									label={t('positionName')}
									formik={formik}
									placeholder={t('position')}
									value={''}
									title={''}
									inputProps={{
										maxLength: 50,
									}}
									disabled={busy}
									required
								/>
								<Box className='flex items-start gap-2'>
									<FormInput
										className='w-full'
										type='number'
										name='lat'
										label={t('latitude')}
										formik={formik}
										placeholder='0.000000'
										value={''}
										title={''}
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
										disabled={busy}
										required
									/>
									<FormInput
										className='w-full'
										type='number'
										name='lng'
										label={t('longitude')}
										formik={formik}
										placeholder='0.000000'
										value={''}
										title={''}
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
										disabled={busy}
										required
									/>
								</Box>
							</Box>
						</Box>
					) : (
						<>
							<Box className='flex items-center border-0 border-y border-solid border-gray px-3'>
								<Box className='m-0 flex px-1.5 py-[5px] [&_.MuiButtonBase-root>svg]:h-[20px] [&_.MuiButtonBase-root>svg]:w-[20px] [&_.MuiButtonBase-root]:p-0'>
									<Checkbox
										checkedIcon={<CheckBoxOutlined />}
										checked={isAllChecked}
										onChange={handleAllCheck}
										inputProps={{ 'aria-label': 'controlled' }}
										disabled={
											!poisData?.data || poisData?.data.length === 0 || busy || isPOISDataLoading
										}
									/>
								</Box>
								<span className='flex grow px-2.5 text-xs font-semibold text-black'>
									{t('positionName')}
								</span>
								<span className='box-border w-[220px] px-2.5 text-xs font-semibold text-black'>
									{t('position')}
								</span>
							</Box>
							<Box className='box-border flex h-[167px] flex-col gap-2 overflow-auto p-3'>
								{isPOISDataLoading ? (
									<div className='flex h-full items-center justify-center'>
										<CircularProgress size={60} color='primary' />
									</div>
								) : !poisData?.data || poisData?.data.length === 0 ? (
									<Box className='flex h-full items-center justify-center'>
										<span className='text-sm font-normal text-gray-dark2'>
											{t('noResultsFound')}
										</span>
									</Box>
								) : (
									<>
										{poisData?.data?.map((item) => {
											return (
												<Box key={item.poiId} className='flex items-center gap-2.5'>
													<Box className='m-0 flex p-1.5 [&_.MuiButtonBase-root>svg]:h-[20px] [&_.MuiButtonBase-root>svg]:w-[20px] [&_.MuiButtonBase-root]:p-0'>
														<Checkbox
															checkedIcon={<CheckBoxOutlined />}
															checked={pinCheck?.[item.poiId] || false}
															onChange={handlePinCheck}
															name={item.poiId}
															inputProps={{ 'aria-label': 'controlled' }}
															disabled={busy}
														/>
													</Box>
													<Button
														variant='outlined'
														className='flex grow justify-start border border-solid border-gray px-2.5 py-1.5'
														disabled={busy}
													>
														<span
															className={classNames('text-sm font-medium text-black', {
																'!text-gray': busy,
															})}
														>
															{item.title}
														</span>
													</Button>
													<Button
														variant='outlined'
														disabled={busy}
														endIcon={
															<ContentCopyRounded
																className={classNames(
																	'h-4 w-4 font-normal text-[#959595]',
																	{
																		'!text-gray': busy,
																	},
																)}
															/>
														}
														className='box-border flex w-[210px] items-center justify-between border border-solid border-gray px-2.5 py-1.5'
													>
														<span
															className={classNames('text-sm font-medium text-black', {
																'!text-gray': busy,
															})}
														>{`${item.lat}, ${item.lng}`}</span>
													</Button>
												</Box>
											)
										})}
									</>
								)}
							</Box>
						</>
					)}

					<Box className='flex grow items-center justify-between border-0 border-t border-solid border-gray p-3'>
						{!isAddPin && (
							<>
								<Box className='flex items-center'>
									{!isAllChecked && !isSomePinCheck(pinCheck) && !isAddPin && (
										<Button
											className='pl-2 pr-2.5 text-sm font-medium [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
											variant='contained'
											onClick={() => {
												setIsAddPin(true)
											}}
											disabled={isPOISDataLoading}
											startIcon={
												isPOISDataLoading ? (
													<CircularProgress
														className='[&_.MuiCircularProgress-circle]:text-gray'
														size={16}
													/>
												) : (
													<Add className='m-0' />
												)
											}
										>
											{t('addPosition')}
										</Button>
									)}
									{(isAllChecked || isSomePinCheck(pinCheck)) && (
										<Button
											className={classNames('border-gray pl-2 pr-2.5', {
												'[&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1': busy,
												'flex items-center gap-1': !busy,
											})}
											variant='outlined'
											onClick={() => setDeleteOpenDialog(true)}
											disabled={busy}
											startIcon={
												busy ? (
													<CircularProgress
														className='[&_.MuiCircularProgress-circle]:text-gray'
														size={16}
													/>
												) : null
											}
										>
											{!busy && (
												<Box className='h-5 w-5 p-0'>
													<Icon path={mdiTrashCanOutline} className='h-5 w-5 text-black' />
												</Box>
											)}
											<span
												className={classNames('text-sm font-medium text-black', {
													'!text-gray': busy,
												})}
											>
												{t('deletePosition')}
											</span>
										</Button>
									)}
								</Box>
								{(isAllChecked || isSomePinCheck(pinCheck)) && (
									<Box className='flex items-center gap-1.5'>
										<Button
											className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
											variant='outlined'
											disabled={busy}
											startIcon={
												busy ? (
													<CircularProgress
														className='[&_.MuiCircularProgress-circle]:text-gray'
														size={16}
													/>
												) : (
													<FileDownloadOutlined className='m-0 text-black' />
												)
											}
											onClick={downloadJSONAsCSV}
										>
											<span
												className={classNames('text-sm font-medium text-black', {
													'!text-gray': busy,
												})}
											>
												CSV
											</span>
										</Button>
										<Button
											className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
											variant='outlined'
											disabled={busy}
											startIcon={
												busy ? (
													<CircularProgress
														className='[&_.MuiCircularProgress-circle]:text-gray'
														size={16}
													/>
												) : (
													<FileDownloadOutlined className='m-0 text-black' />
												)
											}
											onClick={downloadGeoJSON}
										>
											<span
												className={classNames('text-sm font-medium text-black', {
													'!text-gray': busy,
												})}
											>
												GeoJSON
											</span>
										</Button>
									</Box>
								)}
							</>
						)}
						{isAddPin && (
							<>
								<Button
									className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
									variant='outlined'
									onClick={handleGetCurrentLocation}
									disabled={busy}
									startIcon={
										busy ? (
											<CircularProgress
												className='[&_.MuiCircularProgress-circle]:text-gray'
												size={16}
											/>
										) : (
											<LocationSearching className='m-0 text-black' />
										)
									}
								>
									<span
										className={classNames('text-sm font-medium text-black', {
											'!text-gray': busy,
										})}
									>
										{t('useCurrentLocation')}
									</span>
								</Button>

								<Box className='flex items-center gap-2'>
									<Button
										onClick={() => {
											setIsAddPin(false)
											formik.resetForm()
										}}
										variant='outlined'
										className={classNames('border-gray px-3 py-1.5', {
											'pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1':
												busy,
										})}
										disabled={busy}
										startIcon={
											busy && (
												<CircularProgress
													className='[&_.MuiCircularProgress-circle]:text-gray'
													size={16}
												/>
											)
										}
									>
										<span
											className={classNames('text-sm font-medium text-black', {
												'!text-gray': busy,
											})}
										>
											{t('cancel', { ns: 'default' })}
										</span>
									</Button>
									<Button
										onClick={handlePostSubmit}
										variant='contained'
										className={classNames('px-3 py-1.5', {
											'pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1':
												busy,
										})}
										disabled={busy}
										startIcon={
											busy && (
												<CircularProgress
													className='[&_.MuiCircularProgress-circle]:text-gray'
													size={16}
												/>
											)
										}
									>
										<span className='text-sm font-medium text-white'>
											{t('confirm', { ns: 'default' })}
										</span>
									</Button>
								</Box>
							</>
						)}
					</Box>
				</Box>
			</Popper>
			{/* <MapPinDialog
				open={postOpenDialog}
				formik={formik}
				loading={busy}
				onClose={() => {
					setPostOpenDialog(false)
					formik.resetForm()
				}}
				onConfirm={handlePostSubmit}
			/> */}
			<AlertConfirm
				open={deleteOpenDialog}
				title={t('alert.confirmMapPinsDeleteTitle')}
				content={t('alert.confirmMapPinsDeleteContent')}
				onClose={() => setDeleteOpenDialog(false)}
				onConfirm={handleDeleteSubmit}
			/>
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				open={alertInfo.open}
				autoHideDuration={6000}
				onClose={() => setAlertInfo({ ...alertInfo, open: false })}
				className='w-[300px]'
			>
				<Alert
					onClose={() => setAlertInfo({ ...alertInfo, open: false })}
					severity={alertInfo.severity}
					className='w-full'
				>
					{alertInfo.message}
				</Alert>
			</Snackbar>
		</React.Fragment>
	)
}

export default MapPin
