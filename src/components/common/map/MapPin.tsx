'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	IconButton,
	Popover,
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

interface MapPinProps {}

const MapPin: React.FC<MapPinProps> = ({}) => {
	const queryClient = useQueryClient()
	const { open, setOpen } = useMapPin()

	const [busy, setBusy] = useState<boolean>(false)
	const [alertInfo, setAlertInfo] = useState<AlertInfoType>({
		open: false,
		severity: 'success',
		message: '',
	})
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [deleteOpenDialog, setDeleteOpenDialog] = useState<boolean>(false)
	const [postOpenDialog, setPostOpenDialog] = useState<boolean>(false)

	const [isPinOnMap, setIsPinOnMap] = useState(false)
	const [isAllChecked, setIsAllChecked] = useState(false)
	const [pinCheck, setPinCheck] = useState<{ [key: string]: boolean }>({})

	useEffect(() => setOpen(false), [])

	const { data: poisData, isLoading: isPOISDataLoading } = useQuery({
		queryKey: ['getPOISMapPin'],
		queryFn: () => service.plotMonitoring.getPOIS(),
		enabled: Boolean(anchorEl),
	})

	const {
		data,
		error,
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
			setAlertInfo({ open: true, severity: 'success', message: 'ลบตำแหน่งการปักหมุดสำเร็จ' })
		},
		onError: (error: ErrorResponse, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['getPOISMapPin'] })
			setAlertInfo({
				open: true,
				severity: 'error',
				message: error?.title ? error.title : 'เกิดข้อผิดพลาด กรุณาตรวจสอบข้อมูลอีกครั้ง',
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

	const handlePostSubmit = () => {
		console.log('Submitted!!')
	}

	const handleDeleteSubmit = useCallback(async () => {
		try {
			setBusy(true)
			await mutateDeleteMapPins(pinCheckIds)
		} catch (error: any) {
			console.log('Error:', error.title)
		} finally {
			setBusy(false)
			setDeleteOpenDialog(false)
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

	return (
		<React.Fragment>
			<IconButton
				sx={{
					border: 2,
					borderColor: Boolean(anchorEl) ? '#0C626D' : 'transparent',
				}}
				onClick={(event) => setAnchorEl(event.currentTarget)}
				className={'box-shadow mb-2 bg-white'}
			>
				<Icon color={Boolean(anchorEl) ? '#0C626D' : ''} path={mdiMapMarkerRadiusOutline} size={1} />
			</IconButton>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(null)}
				slotProps={{
					paper: {
						className: 'border border-solid border-gray',
					},
				}}
				anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
				transformOrigin={{ vertical: 218, horizontal: -56 }}
			>
				<Box className='flex h-[400px] w-[480px] flex-col bg-white drop-shadow-md'>
					<Box className='flex items-center justify-between p-3'>
						<Typography className='text-sm font-semibold text-black-dark'>การปักหมุด</Typography>
						<Box className='flex items-center gap-2'>
							<span className='text-xs font-medium text-black-dark'>แสดงในแผนที่</span>
							<IOSSwitch
								checked={isPinOnMap}
								onChange={handlePinOnMapCheck}
								inputProps={{ 'aria-label': 'controlled' }}
								disabled={busy || isPOISDataLoading}
							/>
						</Box>
					</Box>
					<Box className='flex items-center border-0 border-y border-solid border-gray px-3'>
						<Box className='m-0 flex px-1.5 py-[5px] [&_.MuiButtonBase-root>svg]:h-[20px] [&_.MuiButtonBase-root>svg]:w-[20px] [&_.MuiButtonBase-root]:p-0'>
							<Checkbox
								checkedIcon={<CheckBoxOutlined />}
								checked={isAllChecked}
								onChange={handleAllCheck}
								inputProps={{ 'aria-label': 'controlled' }}
								disabled={!poisData?.data || poisData?.data.length === 0 || busy || isPOISDataLoading}
							/>
						</Box>
						<span className='flex grow px-2.5 text-xs font-semibold text-black'>ชื่อตำแหน่ง</span>
						<span className='box-border w-[220px] px-2.5 text-xs font-semibold text-black'>ตำแหน่ง</span>
					</Box>
					<Box className='box-border flex h-[267px] flex-col gap-2 overflow-auto p-3'>
						{isPOISDataLoading ? (
							<div className='flex h-full items-center justify-center'>
								<CircularProgress size={60} color='primary' />
							</div>
						) : !poisData?.data || poisData?.data.length === 0 ? (
							<Box className='flex h-full items-center justify-center'>
								<span className='text-sm font-normal text-gray-dark2'>ไม่พบข้อมูล</span>
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
														className={classNames('h-4 w-4 font-normal text-[#959595]', {
															'!text-gray': busy,
														})}
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
					<Box className='flex grow items-center justify-between border-0 border-t border-solid border-gray p-3'>
						<Box className='flex items-center'>
							{!isAllChecked && !isSomePinCheck(pinCheck) && (
								<Button
									className='pl-2 pr-2.5 text-sm font-medium [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
									variant='contained'
									onClick={() => setPostOpenDialog(true)}
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
									เพิ่มตำแหน่ง
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
										ลบตำแหน่ง
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
					</Box>
				</Box>
			</Popover>
			<MapPinDialog open={postOpenDialog} onClose={() => setPostOpenDialog(false)} onConfirm={handlePostSubmit} />
			<AlertConfirm
				open={deleteOpenDialog}
				title='ลบตำแหน่งการปักหมุด'
				content='ต้องการยืนยันการลบตำแหน่งการปักหมุดนี้ใช่หรือไม่'
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
