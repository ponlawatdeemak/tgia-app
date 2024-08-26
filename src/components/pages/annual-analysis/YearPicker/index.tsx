'use client'

import useResponsive from '@/hook/responsive'
import { formatDate } from '@/utils/date'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, Checkbox, IconButton, Menu, MenuItem, Popover } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchAnnualAnalysis } from '../Main/context'
import { useQuery } from '@tanstack/react-query'
import lookup from '@/api/lookup'
import service from '@/api'
import { GetLookupOutDto } from '@/api/lookup/dto-out.dto'
import { useYearPicker } from './context'

export type DateRangeTypes = {
	startDate: Date
	endDate: Date
}

interface YearPickerProps {}

const YearPicker: React.FC<YearPickerProps> = () => {
	const { open, setOpen } = useYearPicker()
	const { queryParams } = useSearchAnnualAnalysis()
	const { isDesktop } = useResponsive()
	const { i18n } = useTranslation()
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [ranges, setRanges] = useState<DateRangeTypes>()
	const [selectedYear, setSelectedYear] = useState<[]>([])

	const { data: yearData, isLoading: isYearDataLoading } = useQuery({
		queryKey: ['getLookupYears'],
		queryFn: async () => {
			const res = await service.lookup.get('years')
			console.log('yearData :: ', res)
			return res
		},
		enabled: true,
	})

	useEffect(() => {
		// if (open && queryParams?.startDate && queryParams?.endDate) {
		// 	setRanges({ startDate: queryParams.startDate, endDate: queryParams.endDate })
		// }
	}, [queryParams, open])

	const handleClose = () => {
		setAnchorEl(null)
		setOpen(false)
	}

	const handleChangeDateRanges = (values: DateRangeTypes) => {
		setRanges(values)
	}

	const onSubmit = () => {
		if (ranges?.startDate && ranges?.endDate) {
			// setQueryParams({ ...queryParams, startDate: ranges.startDate, endDate: ranges.endDate })
		}
		setOpen(false)
	}

	const onReset = () => {
		// array of range of index
		// setRanges(resetDateRanges)
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
		if (isDesktop) {
			setOpen(!!event.currentTarget)
		} else {
			setOpen(!open)
		}
	}

	// const formatDateRange =
	// 	queryParams.startDate && queryParams.endDate
	// 		? `${formatDate(queryParams.startDate, 'dd MMM yyyy', i18n.language)} - ${formatDate(queryParams.endDate, 'dd MMM yyyy', i18n.language)}`
	// 		: ''

	return (
		<>
			{/* Mobile */}
			<IconButton color='secondary' className='btn-shadow lg:hidden' onClick={handleClick}>
				<Icon path={mdiCalendarMonthOutline} size={1} />
			</IconButton>

			{/* Desktop */}
			<Button
				variant='contained'
				color='secondary'
				className='hidden min-w-[280px] lg:flex'
				startIcon={<Icon path={mdiCalendarMonthOutline} size={1} />}
				onClick={handleClick}
			>
				{/* {formatDateRange} */}
			</Button>
			{/* Change Popover to selection fields to handle mobile case
                the modal popup isn't large so we should considered using select items?
            */}

			<Menu
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: -4,
					horizontal: 'right',
				}}
			>
				{yearData?.data?.map((item: GetLookupOutDto) => {
					return (
						<MenuItem disableRipple key={item.code}>
							<Checkbox color='primary' />
							{item.code}
						</MenuItem>
					)
				})}
			</Menu>
			{/* <Popover
				id='year-picker-popover'
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				className={
					'mt-1 min-w-[280px] [&_.MuiPaper-elevation]:border [&_.MuiPaper-elevation]:border-solid [&_.MuiPaper-elevation]:border-gray'
				}
			>
				<div className='flex'>
					<div className='w-[172px] border-0 border-l border-solid border-gray px-6 py-4'>
						<div className='mt-4 flex justify-center gap-2'></div>
					</div>
				</div>
			</Popover> */}
		</>
	)
}

export default YearPicker
