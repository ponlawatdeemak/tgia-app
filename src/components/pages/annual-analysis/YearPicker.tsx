'use client'

import useSearchFieldLoss from '@/components/pages/field-loss/Main/context'
import useResponsive from '@/hook/responsive'
import { formatDate } from '@/utils/date'
import { mdiCalendarMonthOutline } from '@mdi/js'
import Icon from '@mdi/react'
import { Button, IconButton, Popover } from '@mui/material'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useYearPicker } from './context'

export type DateRangeTypes = {
	startDate: Date
	endDate: Date
}

interface YearPickerProps {}

//  mock data return from API
const yearRange = [
	{
		value: { th: 2563, en: 2020 },
	},
	{
		value: { th: 2564, en: 2021 },
	},
	{
		value: { th: 2565, en: 2022 },
	},
	{
		value: { th: 2566, en: 2023 },
	},
]
const YearPicker: React.FC<YearPickerProps> = () => {
	const { open, setOpen, resetDateRanges } = useYearPicker()
	const { queryParams } = useSearchFieldLoss()
	const { isDesktop } = useResponsive()
	const { i18n } = useTranslation()
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const [ranges, setRanges] = useState<DateRangeTypes>()
	const [yearData, setYearData] = useState<any>()

	useEffect(() => {
		if (open && queryParams?.startDate && queryParams?.endDate) {
			setRanges({ startDate: queryParams.startDate, endDate: queryParams.endDate })
		}
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
		setRanges(resetDateRanges)
	}

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (isDesktop) {
			setAnchorEl(event.currentTarget)
			setOpen(!!event.currentTarget)
		} else {
			setOpen(!open)
		}
	}

	const formatDateRange =
		queryParams.startDate && queryParams.endDate
			? `${formatDate(queryParams.startDate, 'dd MMM yyyy', i18n.language)} - ${formatDate(queryParams.endDate, 'dd MMM yyyy', i18n.language)}`
			: ''

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
				{formatDateRange}
			</Button>
			<Popover
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
						<div className='mt-4 flex justify-center gap-2'>{}</div>
					</div>
				</div>
			</Popover>
		</>
	)
}

export default YearPicker
