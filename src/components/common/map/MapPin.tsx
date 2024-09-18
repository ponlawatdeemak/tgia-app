'use client'

import React, { useCallback, useState } from 'react'
import { Box, Button, Checkbox, IconButton, Popover, styled, Switch, SwitchProps, Typography } from '@mui/material'
import { mdiMapMarkerRadiusOutline, mdiTrashCanOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Add, CheckBoxOutlined, ContentCopyRounded, DeleteOutlined, FileDownloadOutlined } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import service from '@/api'

interface MapPinProps {}

const MapPin: React.FC<MapPinProps> = ({}) => {
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [isPinOnMap, setIsPinOnMap] = useState(false)
	const [isAllChecked, setIsAllChecked] = useState(false)
	const [pinCheck, setPinCheck] = useState<{ [key: string]: boolean }>({})

	const { data: poisData, isLoading: isPOISDataLoading } = useQuery({
		queryKey: ['getPOISMapPin'],
		queryFn: () => service.plotMonitoring.getPOIS(),
		enabled: Boolean(anchorEl),
	})

	const handlePinOnMapCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIsPinOnMap(event.target.checked)
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
							/>
						</Box>
						<span className='flex grow px-2.5 text-xs font-semibold text-black'>ชื่อตำแหน่ง</span>
						<span className='box-border w-[220px] px-2.5 text-xs font-semibold text-black'>ตำแหน่ง</span>
					</Box>
					<Box className='box-border flex h-[267px] flex-col gap-2 overflow-auto p-3'>
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
										/>
									</Box>
									<Button
										variant='outlined'
										className='flex grow justify-start border border-solid border-gray px-2.5 py-1.5'
									>
										<span className='text-sm font-medium text-black'>{item.title}</span>
									</Button>
									<Button
										variant='outlined'
										endIcon={<ContentCopyRounded className='h-4 w-4 font-normal text-[#959595]' />}
										className='box-border flex w-[210px] items-center justify-between border border-solid border-gray px-2.5 py-1.5'
									>
										<span className='text-sm font-medium text-black'>{`${item.lat}, ${item.lng}`}</span>
									</Button>
								</Box>
							)
						})}
					</Box>
					<Box className='flex grow items-center justify-between border-0 border-t border-solid border-gray p-3'>
						<Box className='flex items-center'>
							{!isAllChecked && !isSomePinCheck(pinCheck) && (
								<Button
									className='pl-2 pr-2.5 text-sm font-medium [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
									variant='contained'
									startIcon={<Add className='m-0' />}
								>
									เพิ่มตำแหน่ง
								</Button>
							)}
							{(isAllChecked || isSomePinCheck(pinCheck)) && (
								<Button className='flex items-center gap-1 border-gray pl-2 pr-2.5' variant='outlined'>
									<Box className='h-5 w-5 p-0'>
										<Icon path={mdiTrashCanOutline} className='h-5 w-5 text-black' />
									</Box>
									<span className='text-sm font-medium text-black'>ลบตำแหน่ง</span>
								</Button>
							)}
						</Box>
						{(isAllChecked || isSomePinCheck(pinCheck)) && (
							<Box className='flex items-center gap-1.5'>
								<Button
									className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
									variant='outlined'
									startIcon={<FileDownloadOutlined className='m-0 text-black' />}
								>
									<span className='text-sm font-medium text-black'>CSV</span>
								</Button>
								<Button
									className='border-gray pl-2 pr-2.5 [&_.MuiButton-startIcon]:m-0 [&_.MuiButton-startIcon]:mr-1'
									variant='outlined'
									startIcon={<FileDownloadOutlined className='m-0 text-black' />}
								>
									<span className='text-sm font-medium text-black'>GeoJSON</span>
								</Button>
							</Box>
						)}
					</Box>
				</Box>
			</Popover>
		</React.Fragment>
	)
}

export default MapPin
